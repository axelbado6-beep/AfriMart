import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    // Get business profile for this user
    const { data: business, error: bizErr } = await supabaseClient
      .from("business_profiles")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (bizErr || !business) throw new Error("Business profile not found");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Find completed checkout sessions for product supplement
    const email = user.email;
    if (!email) throw new Error("User email not available");

    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length === 0) {
      return new Response(JSON.stringify({ synced: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customers.data[0].id;

    // List completed payment sessions for this customer
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      status: "complete",
      limit: 100,
    });

    // Filter for product supplement payments (one-time, matching our product)
    const supplementProductId = "prod_U7HCuwRRC7oztw";
    let synced = 0;

    for (const session of sessions.data) {
      if (session.mode !== "payment") continue;

      // Check if already recorded
      const { data: existing } = await supabaseClient
        .from("product_supplements")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (existing) continue;

      // Verify this session is for our supplement product
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 5 });
      const isSupplementPayment = lineItems.data.some(
        (item) => item.price?.product === supplementProductId
      );

      if (!isSupplementPayment) continue;

      // Record the supplement
      const { error: insertErr } = await supabaseClient
        .from("product_supplements")
        .insert({ business_id: business.id, stripe_session_id: session.id });

      if (!insertErr) synced++;
    }

    return new Response(JSON.stringify({ synced }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
