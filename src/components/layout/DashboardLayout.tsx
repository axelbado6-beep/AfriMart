import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { 
  ShoppingBag, 
  LogOut, 
  Search,
  Home,
  MessageCircle,
  Settings,
  Package
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur AfriMart !",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-afrimart-green to-afrimart-orange flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold">
              Afri<span className="text-gradient">Mart</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <CartDrawer />
            <NotificationBell />
            
            <button 
              onClick={() => navigate("/catalog")}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border md:hidden">
        <div className="flex items-center justify-around py-3">
          <NavItem icon={Home} label="Accueil" onClick={() => navigate('/dashboard')} />
          <NavItem icon={Search} label="Explorer" onClick={() => navigate('/catalog')} />
          <NavItem icon={Package} label="Commandes" onClick={() => navigate('/orders')} />
          <NavItem icon={MessageCircle} label="Messages" onClick={() => navigate('/messages')} />
          <NavItem icon={Settings} label="Paramètres" onClick={() => navigate('/settings')} />
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({ 
  icon: Icon, 
  label, 
  active = false,
  onClick 
}: { 
  icon: any; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
}) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-3 py-1 ${active ? 'text-primary' : 'text-muted-foreground'}`}
  >
    <Icon className="w-5 h-5" />
    <span className="text-xs">{label}</span>
  </button>
);

export default DashboardLayout;