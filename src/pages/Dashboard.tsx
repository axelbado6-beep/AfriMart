import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import BusinessDashboard from "@/components/dashboard/BusinessDashboard";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  user_type: "client" | "business";
}

interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  logo_url: string | null;
  banner_url: string | null;
  category: string | null;
  description: string | null;
  is_verified: boolean;
  followers_count: number;
  location: string | null;
  phone: string | null;
}

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      
      if (profileData) {
        setProfile(profileData as Profile);
        
        if (profileData.user_type === "business") {
          const { data: businessData, error: businessError } = await supabase
            .from("business_profiles")
            .select("id, user_id, business_name, logo_url, banner_url, category, description, opening_hours, location, country, is_verified, followers_count, created_at, updated_at, latitude, longitude, delivery_radius_km, delivery_fee_base, delivery_fee_per_km, delivery_mode")
            .eq("user_id", user.id)
            .maybeSingle();
          
          if (businessError) throw businessError;
          if (businessData) {
            const { data: phone } = await supabase.rpc("get_business_phone", { _business_id: businessData.id });
            setBusinessProfile({ ...businessData, phone: (phone as string | null) ?? null } as BusinessProfile);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const isClient = profile?.user_type === "client";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      {isClient ? (
        <ClientDashboard 
          profile={profile} 
          userEmail={user?.email} 
        />
      ) : (
        <BusinessDashboard 
          profile={profile} 
          businessProfile={businessProfile}
          userEmail={user?.email} 
        />
      )}
    </DashboardLayout>
  );
};

export default Dashboard;