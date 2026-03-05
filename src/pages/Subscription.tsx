import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSubscription } from "@/hooks/useSubscription";
import { PLANS, type PlanKey } from "@/lib/stripe-plans";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Building2, Loader2, Settings, ArrowLeft } from "lucide-react";

const Subscription = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { subscribed, plan: currentPlan, subscriptionEnd, loading, refresh } = useSubscription();
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annual">("monthly");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast({ title: "Abonnement activé ! 🎉", description: "Bienvenue dans votre nouveau plan." });
      refresh();
    }
    if (searchParams.get("canceled") === "true") {
      toast({ title: "Paiement annulé", description: "Vous pouvez réessayer quand vous voulez.", variant: "destructive" });
    }
  }, [searchParams, toast, refresh]);

  const handleCheckout = async (planKey: PlanKey) => {
    const plan = PLANS[planKey];
    const priceId = billingInterval === "monthly" ? plan.monthly.priceId : plan.annual.priceId;
    if (!priceId) return;

    setCheckoutLoading(planKey);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;
      if (data.error) {
        toast({ title: "Erreur", description: data.error, variant: "destructive" });
        return;
      }

      window.open(data.url, "_blank");
    } catch (err) {
      console.error("Checkout error:", err);
      toast({ title: "Erreur", description: "Impossible de lancer le paiement", variant: "destructive" });
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase.functions.invoke("customer-portal", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (error) throw error;
      window.open(data.url, "_blank");
    } catch (err) {
      console.error("Portal error:", err);
      toast({ title: "Erreur", description: "Impossible d'ouvrir le portail", variant: "destructive" });
    } finally {
      setPortalLoading(false);
    }
  };

  const planIcons: Record<PlanKey, React.ReactNode> = {
    free: <Zap className="w-6 h-6" />,
    pro: <Crown className="w-6 h-6" />,
    enterprise: <Building2 className="w-6 h-6" />,
  };

  const planColors: Record<PlanKey, string> = {
    free: "from-slate-500 to-slate-600",
    pro: "from-blue-500 to-indigo-600",
    enterprise: "from-indigo-600 to-purple-700",
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold">Abonnements</h1>
            <p className="text-muted-foreground text-sm">Choisissez le plan adapté à votre entreprise</p>
          </div>
        </div>

        {/* Current plan badge */}
        {subscribed && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-primary">Plan actuel : {PLANS[currentPlan].name}</p>
              {subscriptionEnd && (
                <p className="text-sm text-muted-foreground">
                  Renouvellement : {new Date(subscriptionEnd).toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>
            <Button variant="outline" onClick={handleManageSubscription} disabled={portalLoading}>
              {portalLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Settings className="w-4 h-4 mr-2" />}
              Gérer l'abonnement
            </Button>
          </div>
        )}

        {/* Billing toggle */}
        <div className="flex justify-center">
          <div className="bg-muted rounded-full p-1 flex gap-1">
            <button
              onClick={() => setBillingInterval("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingInterval === "monthly" ? "bg-background shadow text-foreground" : "text-muted-foreground"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingInterval("annual")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingInterval === "annual" ? "bg-background shadow text-foreground" : "text-muted-foreground"
              }`}
            >
              Annuel <span className="text-xs text-green-600 font-bold ml-1">-17%</span>
            </button>
          </div>
        </div>

        {/* Plans grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(([key, plan]) => {
              const isCurrentPlan = currentPlan === key;
              const price = billingInterval === "monthly" ? plan.monthly.price : plan.annual.price;
              const isPopular = key === "pro";

              return (
                <div
                  key={key}
                  className={`relative bg-card rounded-2xl border-2 p-6 flex flex-col transition-all hover:shadow-lg ${
                    isCurrentPlan ? "border-primary shadow-lg" : isPopular ? "border-blue-300" : "border-border"
                  }`}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">
                      Populaire
                    </Badge>
                  )}

                  {isCurrentPlan && (
                    <Badge className="absolute -top-3 right-4 bg-primary text-primary-foreground border-0">
                      Votre plan
                    </Badge>
                  )}

                  {/* Plan header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${planColors[key]} text-white`}>
                      {planIcons[key]}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-3xl font-bold">
                      {price === 0 ? "Gratuit" : `${price.toLocaleString()}`}
                    </span>
                    {price > 0 && (
                      <span className="text-muted-foreground text-sm ml-1">
                        XOF/{billingInterval === "monthly" ? "mois" : "an"}
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 flex-1 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  {key === "free" ? (
                    <Button variant="outline" disabled className="w-full">
                      {isCurrentPlan ? "Plan actuel" : "Plan par défaut"}
                    </Button>
                  ) : isCurrentPlan ? (
                    <Button variant="outline" onClick={handleManageSubscription} disabled={portalLoading} className="w-full">
                      {portalLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Gérer
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleCheckout(key)}
                      disabled={!!checkoutLoading}
                      className={`w-full bg-gradient-to-r ${planColors[key]} text-white hover:opacity-90`}
                    >
                      {checkoutLoading === key ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      S'abonner
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Subscription;
