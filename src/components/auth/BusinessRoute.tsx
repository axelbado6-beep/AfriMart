import { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BusinessRouteProps {
  children: ReactNode;
}

const BusinessRoute = ({ children }: BusinessRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isBusinessUser, setIsBusinessUser] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkBusinessAccess();
  }, []);

  const checkBusinessAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth?type=business");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;

      if (profile?.user_type !== "business") {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Cette page est réservée aux entreprises.",
        });
        navigate("/dashboard");
        return;
      }

      setIsBusinessUser(true);
    } catch (error) {
      console.error("Error checking business access:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isBusinessUser) {
    return null;
  }

  return <>{children}</>;
};

export default BusinessRoute;