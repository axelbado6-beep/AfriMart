import { useState, useEffect, useRef } from "react";
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
  Star,
  Truck,
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles
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
  const [animatedStats, setAnimatedStats] = useState({
    productsCount: 0,
    ordersCount: 0,
    totalRevenue: 0,
    followers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!businessProfile?.id) return;

      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("business_id", businessProfile.id);

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

  // Animated counter effect
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;

    const targets = {
      productsCount: stats.productsCount,
      ordersCount: stats.ordersCount,
      totalRevenue: stats.totalRevenue,
      followers: businessProfile?.followers_count || 0
    };

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        productsCount: Math.floor(targets.productsCount * easeOut),
        ordersCount: Math.floor(targets.ordersCount * easeOut),
        totalRevenue: Math.floor(targets.totalRevenue * easeOut),
        followers: Math.floor(targets.followers * easeOut)
      });

      if (step >= steps) clearInterval(interval);
    }, stepDuration);

    return () => clearInterval(interval);
  }, [stats, businessProfile?.followers_count]);

  const badges = [
    { icon: Truck, label: "Livraison rapide", color: "afrimart-green", earned: stats.ordersCount > 5 },
    { icon: Star, label: "Top vendeur", color: "afrimart-gold", earned: stats.totalRevenue > 50000 },
    { icon: Award, label: "Vérifié", color: "afrimart-orange", earned: businessProfile?.is_verified },
    { icon: CheckCircle, label: "Premium", color: "primary", earned: stats.productsCount > 10 },
  ];

  const timelineSteps = [
    { label: "Conception", icon: "💡", completed: true },
    { label: "Production", icon: "🔧", completed: stats.productsCount > 0 },
    { label: "Vente", icon: "🛒", completed: stats.ordersCount > 0 },
    { label: "Livraison", icon: "📦", completed: stats.ordersCount > 3 },
    { label: "Succès", icon: "🎉", completed: stats.totalRevenue > 100000 },
  ];

  return (
    <div className="space-y-8 animate-page">
      {/* Hero Section with Business Info */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-afrimart-orange/20 via-afrimart-gold/10 to-afrimart-orange/5 border border-afrimart-orange/20 p-6 md:p-8">
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 text-4xl opacity-30 animate-float">🏆</div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-20 animate-float stagger-3">✨</div>
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Logo with Story Ring */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-afrimart-orange via-afrimart-gold to-afrimart-orange opacity-75 blur group-hover:opacity-100 animate-gradient-x transition-opacity" />
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-card border-4 border-background overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
              {businessProfile?.logo_url ? (
                <img src={businessProfile.logo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-afrimart-orange/20 flex items-center justify-center">
                  <Building2 className="w-12 h-12 text-afrimart-orange" />
                </div>
              )}
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-afrimart-green rounded-full border-4 border-background animate-pulse" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-display font-bold">
                {businessProfile?.business_name || "Mon Entreprise"}
              </h1>
              {businessProfile?.is_verified && (
                <CheckCircle className="w-6 h-6 text-afrimart-green fill-afrimart-green/20" />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {businessProfile?.location && (
                <span className="flex items-center gap-1.5 animate-fade-in">
                  <MapPin className="w-4 h-4 text-afrimart-orange" />
                  {businessProfile.location}
                </span>
              )}
              {businessProfile?.phone && (
                <span className="flex items-center gap-1.5 animate-fade-in stagger-1">
                  <Phone className="w-4 h-4 text-afrimart-green" />
                  {businessProfile.phone}
                </span>
              )}
              {businessProfile?.category && (
                <span className="flex items-center gap-1.5 px-3 py-1 bg-afrimart-orange/10 text-afrimart-orange rounded-full text-xs font-medium animate-fade-in stagger-2">
                  {businessProfile.category}
                </span>
              )}
            </div>
          </div>

          <Button 
            variant="outline" 
            className="hover-scale border-afrimart-orange/30 hover:bg-afrimart-orange/10 hover:border-afrimart-orange"
            onClick={() => navigate(`/business/${businessProfile?.id}`)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Voir profil public
          </Button>
        </div>
      </div>

      {/* Animated Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatedStatCard 
          value={animatedStats.productsCount} 
          label="Produits" 
          icon={Package}
          color="blue"
          suffix=""
        />
        <AnimatedStatCard 
          value={animatedStats.followers} 
          label="Abonnés" 
          icon={Users}
          color="green"
          suffix=""
        />
        <AnimatedStatCard 
          value={animatedStats.ordersCount} 
          label="Commandes" 
          icon={ShoppingBag}
          color="orange"
          suffix=""
          badge={stats.pendingOrders > 0 ? `${stats.pendingOrders} en attente` : undefined}
        />
        <AnimatedStatCard 
          value={animatedStats.totalRevenue} 
          label="Revenus" 
          icon={TrendingUp}
          color="gold"
          suffix=" XOF"
        />
      </div>

      {/* Badges Section */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-afrimart-gold" />
          Vos Badges
        </h2>
        <div className="flex flex-wrap gap-3">
          {badges.map((badge, index) => (
            <div
              key={badge.label}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300
                animate-scale-in
                ${badge.earned 
                  ? `bg-${badge.color}/10 border-${badge.color}/30 text-${badge.color}` 
                  : 'bg-muted/50 border-muted text-muted-foreground opacity-50'
                }
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <badge.icon className={`w-4 h-4 ${badge.earned ? 'animate-bounce-soft' : ''}`} />
              <span className="text-sm font-medium">{badge.label}</span>
              {badge.earned && <Sparkles className="w-3 h-3 animate-pulse-slow" />}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-afrimart-green" />
          Votre Parcours
        </h2>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full" />
          <div 
            className="absolute top-6 left-0 h-1 bg-gradient-to-r from-afrimart-orange to-afrimart-gold rounded-full transition-all duration-1000"
            style={{ width: `${(timelineSteps.filter(s => s.completed).length / timelineSteps.length) * 100}%` }}
          />
          
          {/* Timeline Steps */}
          <div className="relative flex justify-between">
            {timelineSteps.map((step, index) => (
              <div
                key={step.label}
                className="flex flex-col items-center animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div 
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center text-xl
                    transition-all duration-500 z-10
                    ${step.completed 
                      ? 'bg-gradient-to-br from-afrimart-orange to-afrimart-gold shadow-lg shadow-afrimart-orange/30 animate-bounce-in' 
                      : 'bg-muted border-2 border-muted-foreground/20'
                    }
                  `}
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  {step.icon}
                </div>
                <span className={`mt-3 text-xs font-medium text-center ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
        <QuickActionCard 
          icon={Settings} 
          label="Paramètres" 
          color="muted" 
          onClick={() => navigate('/settings')}
          delay={4}
        />
      </div>

      {/* CTA Section */}
      {stats.productsCount === 0 && (
        <div className="bg-gradient-to-br from-afrimart-orange/10 via-afrimart-gold/10 to-afrimart-orange/5 rounded-3xl border border-afrimart-orange/20 p-8 text-center relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute top-4 left-4 text-4xl opacity-30 animate-float">🚀</div>
          <div className="absolute bottom-4 right-4 text-3xl opacity-30 animate-float stagger-2">💰</div>
          
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-afrimart-orange/20 flex items-center justify-center mx-auto mb-4 animate-bounce-in">
              <ShoppingBag className="w-10 h-10 text-afrimart-orange" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">
              Commencez à vendre
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Ajoutez vos premiers produits pour commencer à recevoir des commandes et développer votre activité
            </p>
            <Button 
              size="lg"
              className="btn-business hover-scale group" 
              onClick={() => navigate('/my-products')}
            >
              <Plus className="w-5 h-5 mr-2" />
              Ajouter un produit
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
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
    green: "bg-afrimart-green/10 text-afrimart-green hover:bg-afrimart-green/20 hover:shadow-lg hover:shadow-afrimart-green/20 border-afrimart-green/20",
    orange: "bg-afrimart-orange/10 text-afrimart-orange hover:bg-afrimart-orange/20 hover:shadow-lg hover:shadow-afrimart-orange/20 border-afrimart-orange/20",
    blue: "bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-lg hover:shadow-primary/20 border-primary/20",
    muted: "bg-muted text-muted-foreground hover:bg-muted/80 border-muted",
  };

  return (
    <button 
      onClick={onClick} 
      className={`relative p-5 rounded-2xl flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95 animate-scale-in border ${colorClasses[color]}`}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <Icon className="w-7 h-7" />
      <span className="text-sm font-medium text-center">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center animate-bounce-in font-bold">
          {badge}
        </span>
      )}
    </button>
  );
};

const AnimatedStatCard = ({ 
  value, 
  label, 
  icon: Icon,
  color = "orange",
  suffix = "",
  badge
}: { 
  value: number; 
  label: string; 
  icon: any;
  color?: string;
  suffix?: string;
  badge?: string;
}) => {
  const colorClasses: Record<string, string> = {
    orange: "from-afrimart-orange/20 to-afrimart-orange/5 border-afrimart-orange/20",
    green: "from-afrimart-green/20 to-afrimart-green/5 border-afrimart-green/20",
    blue: "from-primary/20 to-primary/5 border-primary/20",
    gold: "from-afrimart-gold/20 to-afrimart-gold/5 border-afrimart-gold/20",
  };

  const iconClasses: Record<string, string> = {
    orange: "bg-afrimart-orange/20 text-afrimart-orange",
    green: "bg-afrimart-green/20 text-afrimart-green",
    blue: "bg-primary/20 text-primary",
    gold: "bg-afrimart-gold/20 text-afrimart-gold",
  };

  return (
    <div 
      className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl border p-5 hover:scale-105 hover:-translate-y-1 transition-all duration-300 group`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl ${iconClasses[color]} flex items-center justify-center group-hover:animate-jelly`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="text-3xl font-display font-bold text-foreground tabular-nums">
        {value.toLocaleString()}{suffix}
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-sm text-muted-foreground">{label}</span>
        {badge && (
          <span className="text-xs text-afrimart-orange font-medium animate-pulse">{badge}</span>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;
