import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  MessageCircle, 
  Heart, 
  MapPin, 
  CheckCircle,
  Grid3X3,
  Store,
  ShoppingCart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFavorites } from "@/hooks/useFavorites";
import { useCart } from "@/contexts/CartContext";
import type { Tables } from "@/integrations/supabase/types";

type BusinessProfile = Tables<"business_profiles">;
type Product = Tables<"products">;

const BusinessPublicProfile = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [business, setBusiness] = useState<BusinessProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const { toggleFavorite, isFavorite } = useFavorites(currentUserId);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    checkUser();
  }, []);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!businessId) return;
      
      const { data: businessData, error } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("id", businessId)
        .single();

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de charger le profil de l'entreprise",
          variant: "destructive",
        });
        navigate("/catalog");
        return;
      }

      setBusiness(businessData);

      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .eq("business_id", businessId)
        .eq("is_available", true)
        .order("created_at", { ascending: false });

      setProducts(productsData || []);
      setLoading(false);
    };

    fetchBusiness();
  }, [businessId, navigate, toast]);

  const handleStartChat = async (product?: Product) => {
    if (!currentUserId) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour envoyer un message",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!business) return;

    // Check if conversation already exists
    const { data: existingConvo } = await supabase
      .from("conversations")
      .select("id")
      .eq("client_id", currentUserId)
      .eq("business_id", business.id)
      .single();

    const productContext = product ? {
      id: product.id,
      image: product.images?.[0] || "/placeholder.svg",
      name: product.name,
    } : undefined;

    if (existingConvo) {
      navigate(`/chat/${existingConvo.id}`, { state: { product: productContext } });
      return;
    }

    // Create new conversation
    const { data: newConvo, error } = await supabase
      .from("conversations")
      .insert({
        client_id: currentUserId,
        business_id: business.id,
      })
      .select("id")
      .single();

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la conversation",
        variant: "destructive",
      });
      return;
    }

    navigate(`/chat/${newConvo.id}`, { state: { product: productContext } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!business) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display font-bold truncate">{business.business_name}</h1>
        </div>
      </div>

      {/* Banner & Profile Info */}
      <div className="relative">
        <div 
          className="h-48 md:h-64 bg-gradient-to-br from-primary to-secondary"
          style={business.banner_url ? { 
            backgroundImage: `url(${business.banner_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        />

        <div className="container mx-auto px-4">
          <div className="relative -mt-16 mb-4">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="w-32 h-32 rounded-2xl bg-card border-4 border-background shadow-lg overflow-hidden flex-shrink-0">
                {business.logo_url ? (
                  <img 
                    src={business.logo_url} 
                    alt={business.business_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <Store className="w-12 h-12 text-primary" />
                  </div>
                )}
              </div>

              <div className="flex-1 pb-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-display font-bold">{business.business_name}</h2>
                      {business.is_verified && (
                        <CheckCircle className="w-5 h-5 text-afrimart-green fill-afrimart-green/20" />
                      )}
                    </div>
                    {business.category && (
                      <span className="text-sm text-muted-foreground">{business.category}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant={isFollowing ? "outline" : "default"}
                      className={!isFollowing ? "btn-client" : ""}
                      onClick={() => setIsFollowing(!isFollowing)}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isFollowing ? "fill-current" : ""}`} />
                      {isFollowing ? "Abonné" : "S'abonner"}
                    </Button>
                    <Button className="btn-business" onClick={() => handleStartChat()}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contacter
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 py-4 border-b border-border">
            <div className="text-center">
              <p className="text-xl font-bold">{products.length}</p>
              <p className="text-sm text-muted-foreground">Produits</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{business.followers_count || 0}</p>
              <p className="text-sm text-muted-foreground">Abonnés</p>
            </div>
          </div>

          {/* Description & Details */}
          <div className="py-4 space-y-3">
            {business.description && (
              <p className="text-foreground">{business.description}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {business.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {business.location}, {business.country}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-4">
          <Grid3X3 className="w-5 h-5" />
          <h3 className="font-display font-semibold">Produits</h3>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun produit disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                businessName={business.business_name}
                isFavorite={isFavorite(product.id)}
                onToggleFavorite={() => toggleFavorite(product.id)}
                onChatClick={() => handleStartChat(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  businessName: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onChatClick: () => void;
}

const ProductCard = ({ product, businessName, isFavorite, onToggleFavorite, onChatClick }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  
  const inCart = isInCart(product.id);
  const imageUrl = product.images?.[0] || "/placeholder.svg";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: imageUrl,
      businessId: product.business_id,
      businessName: businessName
    });
    toast({
      title: "Ajouté au panier",
      description: `${product.name} ajouté au panier`
    });
  };

  return (
    <div 
      className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="aspect-square relative overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Store className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-colors ${
            isFavorite ? "text-red-500" : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>
      
      <div className="p-3">
        <h4 className="font-medium truncate">{product.name}</h4>
        <p className="text-afrimart-orange font-bold mb-2">
          {product.price.toLocaleString()} {product.currency}
        </p>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleAddToCart}
            variant={inCart ? "secondary" : "outline"}
            size="sm"
            className="flex-1 gap-1"
          >
            <ShoppingCart className="w-4 h-4" />
            {inCart ? "Ajouté" : "Panier"}
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onChatClick();
            }}
            className="flex-1 btn-client gap-1"
            size="sm"
          >
            <MessageCircle className="w-4 h-4" />
            Contacter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessPublicProfile;
