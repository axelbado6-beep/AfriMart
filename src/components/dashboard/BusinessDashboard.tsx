import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  ShoppingBag, 
  MessageCircle, 
  Settings,
  Building2,
  TrendingUp,
  Package,
  Users,
  Eye,
  Phone,
  MapPin,
  Video,
  Camera,
  BarChart3
} from "lucide-react";

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

interface BusinessDashboardProps {
  profile: Profile | null;
  businessProfile: BusinessProfile | null;
  userEmail?: string;
}

const BusinessDashboard = ({ profile, businessProfile, userEmail }: BusinessDashboardProps) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!businessProfile?.id) return;

      // Fetch products count
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("business_id", businessProfile.id);

      // Fetch orders stats
      const { data: orders } = await supabase
        .from("orders")
        .select("total_price, status")
        .eq("business_id", businessProfile.id);

      const ordersCount = orders?.length || 0;
      const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total_price), 0) || 0;
      const pendingOrders = orders?.filter(o => o.status === "pending").length || 0;

      setStats({
        productsCount: productsCount || 0,
        ordersCount,
        totalRevenue,
        pendingOrders
      });
    };

    fetchStats();
  }, [businessProfile?.id]);

  return (
    <div className="space-y-8 animate-page">
      {/* Welcome Section with Business Info */}
      <div className="flex items-center gap-4 animate-slide-up">
        <div className="w-16 h-16 rounded-xl bg-afrimart-orange/20 flex items-center justify-center overflow-hidden animate-scale-in">
          {businessProfile?.logo_url ? (
            <img src={businessProfile.logo_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <Building2 className="w-8 h-8 text-afrimart-orange" />
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-display font-bold">
            {businessProfile?.business_name || "Mon Entreprise"}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {businessProfile?.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {businessProfile.location}
              </span>
            )}
            {businessProfile?.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                {businessProfile.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          value={stats.productsCount.toString()} 
          label="Produits" 
          icon={Package}
          color="blue"
          delay={0}
        />
        <StatCard 
          value={businessProfile?.followers_count?.toString() || "0"} 
          label="Abonnés" 
          icon={Users}
          color="green"
          delay={1}
        />
        <StatCard 
          value={stats.ordersCount.toString()} 
          label="Commandes" 
          icon={ShoppingBag}
          color="orange"
          delay={2}
          badge={stats.pendingOrders > 0 ? `${stats.pendingOrders} en attente` : undefined}
        />
        <StatCard 
          value={`${stats.totalRevenue.toLocaleString()} XOF`} 
          label="Revenus" 
          icon={TrendingUp}
          color="gold"
          delay={3}
        />
      </div>

      {/* Quick Actions - Business specific */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard 
          icon={Plus} 
          label="Nouveau produit" 
          color="green" 
          onClick={() => navigate('/my-products')}
          delay={0}
        />
        <QuickActionCard 
          icon={ShoppingBag} 
          label="Commandes" 
          color="orange" 
          onClick={() => navigate('/business-orders')}
          badge={stats.pendingOrders > 0 ? stats.pendingOrders : undefined}
          delay={1}
        />
        <QuickActionCard 
          icon={Package} 
          label="Mes produits" 
          color="blue" 
          onClick={() => navigate('/my-products')}
          delay={2}
        />
        <QuickActionCard 
          icon={MessageCircle} 
          label="Messages" 
          color="muted" 
          onClick={() => navigate('/messages')}
          delay={3}
        />
      </div>

      {/* Business Profile Card */}
      <div className="bg-card rounded-2xl border border-border p-6 animate-slide-up stagger-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-afrimart-orange" />
            Mon Profil Business
          </h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/business/${businessProfile?.id}`)}
            className="hover-scale"
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir public
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{businessProfile?.location || "Localisation non définie"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{businessProfile?.phone || "Téléphone non défini"}</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {businessProfile?.description || "Ajoutez une description pour votre entreprise..."}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {stats.productsCount === 0 && (
        <div className="bg-gradient-to-br from-afrimart-orange/10 to-afrimart-gold/10 rounded-2xl border border-afrimart-orange/20 p-8 text-center animate-slide-up stagger-3">
          <div className="w-16 h-16 rounded-full bg-afrimart-orange/20 flex items-center justify-center mx-auto mb-4 animate-bounce-in">
            <ShoppingBag className="w-8 h-8 text-afrimart-orange" />
          </div>
          <h2 className="text-xl font-display font-semibold mb-2">
            Commencez à vendre
          </h2>
          <p className="text-muted-foreground mb-4">
            Ajoutez vos premiers produits pour commencer à recevoir des commandes
          </p>
          <Button className="btn-business hover-scale" onClick={() => navigate('/my-products')}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un produit
          </Button>
        </div>
      )}
    </div>
  );
};

const QuickActionCard = ({ 
  icon: Icon, 
  label, 
  color, 
  onClick,
  badge,
  delay = 0
}: { 
  icon: any; 
  label: string; 
  color: string; 
  onClick?: () => void;
  badge?: number;
  delay?: number;
}) => {
  const colorClasses: Record<string, string> = {
    green: "bg-afrimart-green/10 text-afrimart-green hover:bg-afrimart-green/20 hover:shadow-lg hover:shadow-afrimart-green/20",
    orange: "bg-afrimart-orange/10 text-afrimart-orange hover:bg-afrimart-orange/20 hover:shadow-lg hover:shadow-afrimart-orange/20",
    blue: "bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20",
    muted: "bg-muted text-muted-foreground hover:bg-muted/80",
  };

  return (
    <button 
      onClick={onClick} 
      className={`relative p-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 hover-scale animate-scale-in ${colorClasses[color]}`}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <Icon className="w-6 h-6" />
      <span className="text-sm font-medium">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center animate-bounce-in">
          {badge}
        </span>
      )}
    </button>
  );
};

const StatCard = ({ 
  value, 
  label, 
  icon: Icon,
  color = "orange",
  delay = 0,
  badge
}: { 
  value: string; 
  label: string; 
  icon: any;
  color?: string;
  delay?: number;
  badge?: string;
}) => {
  const colorClasses: Record<string, string> = {
    orange: "bg-afrimart-orange/10 text-afrimart-orange",
    green: "bg-afrimart-green/10 text-afrimart-green",
    blue: "bg-primary/10 text-primary",
    gold: "bg-afrimart-gold/10 text-afrimart-gold",
  };

  return (
    <div 
      className="bg-card rounded-2xl border border-border p-4 hover-lift animate-scale-in"
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-2xl font-display font-bold text-foreground">{value}</div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        {badge && (
          <span className="text-xs text-afrimart-orange font-medium">{badge}</span>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;