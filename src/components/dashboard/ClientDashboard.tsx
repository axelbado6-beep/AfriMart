import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Heart, 
  MessageCircle, 
  Settings,
  ShoppingBag,
  Store,
  Search
} from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  user_type: "client" | "business";
}

interface ClientDashboardProps {
  profile: Profile | null;
  userEmail?: string;
}

const ClientDashboard = ({ profile, userEmail }: ClientDashboardProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-afrimart-green/20 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-afrimart-green" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">
            Bienvenue, {profile?.full_name || userEmail?.split("@")[0]} !
          </h1>
          <p className="text-muted-foreground">
            Découvrez les meilleures entreprises africaines
          </p>
        </div>
      </div>

      {/* Quick Actions - Client only actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard 
          icon={Store} 
          label="Explorer" 
          color="green" 
          onClick={() => navigate('/catalog')} 
        />
        <QuickActionCard 
          icon={Heart} 
          label="Favoris" 
          color="orange" 
        />
        <QuickActionCard 
          icon={MessageCircle} 
          label="Messages" 
          color="blue" 
          onClick={() => navigate('/messages')}
        />
        <QuickActionCard 
          icon={Settings} 
          label="Paramètres" 
          color="muted" 
        />
      </div>

      {/* Search Section */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-afrimart-green/10 flex items-center justify-center">
            <Search className="w-6 h-6 text-afrimart-green" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold">
              Recherchez des produits
            </h2>
            <p className="text-sm text-muted-foreground">
              Trouvez exactement ce dont vous avez besoin
            </p>
          </div>
        </div>
        <Button 
          className="btn-client w-full" 
          onClick={() => navigate('/catalog')}
        >
          <Search className="w-4 h-4 mr-2" />
          Parcourir le catalogue
        </Button>
      </div>

      {/* Feed Placeholder */}
      <div className="bg-card rounded-2xl border border-border p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Home className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-display font-semibold mb-2">
          Votre feed est vide
        </h2>
        <p className="text-muted-foreground mb-4">
          Abonnez-vous à des entreprises pour voir leurs produits ici
        </p>
        <Button className="btn-client" onClick={() => navigate('/catalog')}>
          Explorer les entreprises
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

export default ClientDashboard;