import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ShoppingBag, 
  User, 
  Building2, 
  LogOut, 
  Settings, 
  Bell, 
  Search,
  Home,
  MessageCircle,
  Heart,
  Plus
} from "lucide-react";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";

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
}

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();

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
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();
          
          if (businessError) throw businessError;
          if (businessData) {
            setBusinessProfile(businessData as BusinessProfile);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur AfriMart !",
    });
    navigate("/");
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-afrimart-green to-afrimart-orange flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold">
              Afri<span className="text-gradient">Mart</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-afrimart-orange rounded-full" />
            </button>
            
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Search className="w-5 h-5" />
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isClient ? 'bg-afrimart-green/20' : 'bg-afrimart-orange/20'}`}>
              {isClient ? (
                <User className={`w-8 h-8 text-afrimart-green`} />
              ) : (
                <Building2 className={`w-8 h-8 text-afrimart-orange`} />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold">
                Bienvenue, {profile?.full_name || user?.email?.split("@")[0]} !
              </h1>
              <p className="text-muted-foreground">
                {isClient ? "Découvrez les meilleures entreprises africaines" : businessProfile?.business_name || "Gérez votre entreprise"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {isClient ? (
            <>
              <QuickActionCard icon={Home} label="Explorer" color="green" />
              <QuickActionCard icon={Heart} label="Favoris" color="orange" />
              <QuickActionCard icon={MessageCircle} label="Messages" color="blue" />
              <QuickActionCard icon={Settings} label="Paramètres" color="muted" />
            </>
          ) : (
            <>
              <QuickActionCard icon={Plus} label="Nouveau produit" color="green" />
              <QuickActionCard icon={ShoppingBag} label="Catalogue" color="orange" />
              <QuickActionCard icon={MessageCircle} label="Messages" color="blue" />
              <QuickActionCard icon={Settings} label="Paramètres" color="muted" />
            </>
          )}
        </div>

        {/* Stats for Business */}
        {!isClient && businessProfile && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard value="0" label="Produits" />
            <StatCard value={businessProfile.followers_count.toString()} label="Abonnés" />
            <StatCard value="0" label="Commandes" />
            <StatCard value="0 FCFA" label="Revenus" />
          </div>
        )}

        {/* Feed Placeholder */}
        <div className="bg-card rounded-2xl border border-border p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-display font-semibold mb-2">
            {isClient ? "Votre feed est vide" : "Commencez à vendre"}
          </h2>
          <p className="text-muted-foreground mb-4">
            {isClient 
              ? "Abonnez-vous à des entreprises pour voir leurs produits ici"
              : "Ajoutez vos premiers produits pour commencer à recevoir des commandes"
            }
          </p>
          <Button className={isClient ? "btn-client" : "btn-business"}>
            {isClient ? "Explorer les entreprises" : "Ajouter un produit"}
          </Button>
        </div>
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border md:hidden">
        <div className="flex items-center justify-around py-3">
          <NavItem icon={Home} label="Accueil" active />
          <NavItem icon={Search} label="Explorer" />
          <NavItem icon={MessageCircle} label="Messages" />
          <NavItem icon={User} label="Profil" />
        </div>
      </nav>
    </div>
  );
};

const QuickActionCard = ({ icon: Icon, label, color }: { icon: any; label: string; color: string }) => {
  const colorClasses: Record<string, string> = {
    green: "bg-afrimart-green/10 text-afrimart-green hover:bg-afrimart-green/20",
    orange: "bg-afrimart-orange/10 text-afrimart-orange hover:bg-afrimart-orange/20",
    blue: "bg-primary/10 text-primary hover:bg-primary/20",
    muted: "bg-muted text-muted-foreground hover:bg-muted/80",
  };

  return (
    <button className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-colors ${colorClasses[color]}`}>
      <Icon className="w-6 h-6" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-card rounded-2xl border border-border p-4 text-center">
    <div className="text-2xl font-display font-bold text-foreground">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

const NavItem = ({ icon: Icon, label, active = false }: { icon: any; label: string; active?: boolean }) => (
  <button className={`flex flex-col items-center gap-1 px-4 py-1 ${active ? 'text-primary' : 'text-muted-foreground'}`}>
    <Icon className="w-5 h-5" />
    <span className="text-xs">{label}</span>
  </button>
);

export default Dashboard;