import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/products/ProductCard";
import { useFavorites } from "@/hooks/useFavorites";
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

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  category: string | null;
  business_id: string;
}

interface ClientDashboardProps {
  profile: Profile | null;
  userEmail?: string;
}

const ClientDashboard = ({ profile, userEmail }: ClientDashboardProps) => {
  const navigate = useNavigate();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const { favorites, toggleFavorite, isFavorite } = useFavorites(profile?.user_id || null);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (!favorites.length) {
        setFavoriteProducts([]);
        setLoadingFavorites(false);
        return;
      }

      const { data } = await supabase
        .from("products")
        .select("*")
        .in("id", favorites);

      setFavoriteProducts(data || []);
      setLoadingFavorites(false);
    };

    fetchFavoriteProducts();
  }, [favorites]);

  const handleChatClick = async (productId: string, productImage: string, productName: string) => {
    if (!profile?.user_id) {
      navigate("/auth");
      return;
    }

    const product = favoriteProducts.find(p => p.id === productId);
    if (!product) return;

    const { data: existingConvo } = await supabase
      .from("conversations")
      .select("id")
      .eq("client_id", profile.user_id)
      .eq("business_id", product.business_id)
      .single();

    const productContext = { id: productId, image: productImage, name: productName };

    if (existingConvo) {
      navigate(`/chat/${existingConvo.id}`, { state: { product: productContext } });
      return;
    }

    const { data: newConvo } = await supabase
      .from("conversations")
      .insert({ client_id: profile.user_id, business_id: product.business_id })
      .select("id")
      .single();

    if (newConvo) {
      navigate(`/chat/${newConvo.id}`, { state: { product: productContext } });
    }
  };

  return (
    <div className="space-y-8 animate-page">
      {/* Welcome Section */}
      <div className="flex items-center gap-4 animate-slide-up">
        <div className="w-16 h-16 rounded-full bg-afrimart-green/20 flex items-center justify-center animate-scale-in">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <QuickActionCard 
          icon={Store} 
          label="Explorer" 
          color="green" 
          onClick={() => navigate('/catalog')}
          delay={0}
        />
        <QuickActionCard 
          icon={Heart} 
          label={`Favoris (${favorites.length})`}
          color="orange" 
          onClick={() => document.getElementById('favorites-section')?.scrollIntoView({ behavior: 'smooth' })}
          delay={1}
        />
        <QuickActionCard 
          icon={ShoppingBag} 
          label="Commandes" 
          color="blue" 
          onClick={() => navigate('/orders')}
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

      {/* Favorites Section */}
      <div id="favorites-section" className="bg-card rounded-2xl border border-border p-6 animate-slide-up stagger-2">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-afrimart-orange/10 flex items-center justify-center">
            <Heart className="w-6 h-6 text-afrimart-orange" />
          </div>
          <div>
            <h2 className="text-lg font-display font-semibold">
              Mes Favoris
            </h2>
            <p className="text-sm text-muted-foreground">
              {favorites.length} produit{favorites.length !== 1 ? 's' : ''} sauvegardé{favorites.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {loadingFavorites ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : favoriteProducts.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground mb-4">Aucun favori pour le moment</p>
            <Button className="btn-client" onClick={() => navigate('/catalog')}>
              Explorer les produits
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                currency={product.currency}
                images={product.images || []}
                category={product.category || undefined}
                isFavorite={isFavorite(product.id)}
                onToggleFavorite={toggleFavorite}
                showChatButton={true}
                onChatClick={handleChatClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Search Section */}
      <div className="bg-card rounded-2xl border border-border p-6 animate-slide-up stagger-3">
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
          className="btn-client w-full hover-scale" 
          onClick={() => navigate('/catalog')}
        >
          <Search className="w-4 h-4 mr-2" />
          Parcourir le catalogue
        </Button>
      </div>
    </div>
  );
};

const QuickActionCard = ({ 
  icon: Icon, 
  label, 
  color, 
  onClick,
  delay = 0
}: { 
  icon: any; 
  label: string; 
  color: string; 
  onClick?: () => void;
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
      className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-300 hover-scale animate-scale-in ${colorClasses[color]}`}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <Icon className="w-6 h-6" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default ClientDashboard;
