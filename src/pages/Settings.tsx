import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProfileSettings from "@/components/settings/ProfileSettings";
import BusinessSettings from "@/components/settings/BusinessSettings";
import { Settings as SettingsIcon } from "lucide-react";

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
  country: string | null;
  phone: string | null;
}

const Settings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      fetchProfiles(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfiles = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile(profileData as Profile);

        if (profileData.user_type === "business") {
          const { data: businessData, error: businessError } = await supabase
            .from("business_profiles")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

          if (businessError) throw businessError;
          if (businessData) {
            setBusinessProfile(businessData as BusinessProfile);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      fetchProfiles(session.user.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <SettingsIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">Paramètres</h1>
            <p className="text-muted-foreground">
              Gérez vos informations personnelles
            </p>
          </div>
        </div>

        {/* Profile Settings */}
        <ProfileSettings 
          profile={profile} 
          onProfileUpdate={handleProfileUpdate} 
        />

        {/* Business Settings (only for business users) */}
        {profile?.user_type === "business" && (
          <BusinessSettings 
            businessProfile={businessProfile} 
            onBusinessUpdate={handleProfileUpdate} 
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
