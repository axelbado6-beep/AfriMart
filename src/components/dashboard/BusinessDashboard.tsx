import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  ShoppingBag, 
  MessageCircle, 
  Settings,
  Building2,
  TrendingUp,
  Package,
  Users
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
}

interface BusinessDashboardProps {
  profile: Profile | null;
  businessProfile: BusinessProfile | null;
  userEmail?: string;
}

const BusinessDashboard = ({ profile, businessProfile, userEmail }: BusinessDashboardProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-afrimart-orange/20 flex items-center justify-center">
          <Building2 className="w-8 h-8 text-afrimart-orange" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">
            Bienvenue, {profile?.full_name || userEmail?.split("@")[0]} !
          </h1>
          <p className="text-muted-foreground">
            {businessProfile?.business_name || "Gérez votre entreprise"}
          </p>
        </div>
      </div>

      {/* Quick Actions - Business actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard 
          icon={Plus} 
          label="Nouveau produit" 
          color="green" 
          onClick={() => navigate('/my-products')} 
        />
        <QuickActionCard 
          icon={ShoppingBag} 
          label="Commandes" 
          color="orange" 
          onClick={() => navigate('/business-orders')} 
        />
        <QuickActionCard 
          icon={Package} 
          label="Mes produits" 
          color="blue" 
          onClick={() => navigate('/my-products')} 
        />
        <QuickActionCard 
          icon={MessageCircle} 
          label="Messages" 
          color="muted" 
          onClick={() => navigate('/messages')}
        />
      </div>

      {/* Stats */}
      {businessProfile && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="0" label="Produits" icon={Package} />
          <StatCard value={businessProfile.followers_count.toString()} label="Abonnés" icon={Users} />
          <StatCard value="0" label="Commandes" icon={ShoppingBag} />
          <StatCard value="0 FCFA" label="Revenus" icon={TrendingUp} />
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-card rounded-2xl border border-border p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-afrimart-orange/10 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8 text-afrimart-orange" />
        </div>
        <h2 className="text-xl font-display font-semibold mb-2">
          Commencez à vendre
        </h2>
        <p className="text-muted-foreground mb-4">
          Ajoutez vos premiers produits pour commencer à recevoir des commandes
        </p>
        <Button className="btn-business" onClick={() => navigate('/my-products')}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un produit
        </Button>
      </div>
    </div>
  );
};

const QuickActionCard = ({ 
  icon: Icon, 
  label, 
  color, 
  onClick 
}: { 
  icon: any; 
  label: string; 
  color: string; 
  onClick?: () => void;
}) => {
  const colorClasses: Record<string, string> = {
    green: "bg-afrimart-green/10 text-afrimart-green hover:bg-afrimart-green/20",
    orange: "bg-afrimart-orange/10 text-afrimart-orange hover:bg-afrimart-orange/20",
    blue: "bg-primary/10 text-primary hover:bg-primary/20",
    muted: "bg-muted text-muted-foreground hover:bg-muted/80",
  };

  return (
    <button 
      onClick={onClick} 
      className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-colors ${colorClasses[color]}`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

const StatCard = ({ 
  value, 
  label, 
  icon: Icon 
}: { 
  value: string; 
  label: string; 
  icon: any;
}) => (
  <div className="bg-card rounded-2xl border border-border p-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-afrimart-orange/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-afrimart-orange" />
      </div>
    </div>
    <div className="text-2xl font-display font-bold text-foreground">{value}</div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

export default BusinessDashboard;