import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  ShoppingCart,
  Share2,
  Store,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string | null;
  images: string[] | null;
  category: string | null;
  stock_quantity: number | null;
  is_available: boolean | null;
  business_id: string;
  business_profiles?: {
    id: string;
    business_name: string;
    logo_url: string | null;
    is_verified: boolean | null;
    location: string | null;
    country: string | null;
  };
}

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [ordering, setOrdering] = useState(false);
  
  const { isFavorite, toggleFavorite } = useFavorites(userId);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          business_profiles (
            id,
            business_name,
            logo_url,
            is_verified,
            location,
            country
          )
        `)
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        navigate("/catalog");
        return;
      }

      setProduct(data);
      setLoading(false);
    };

    if (productId) fetchProduct();
  }, [productId, navigate]);

  const handleChatClick = async () => {
    if (!userId) {
      navigate("/auth");
      return;
    }

    if (!product) return;

    const { data: existingConvo } = await supabase
      .from("conversations")
      .select("id")
      .eq("client_id", userId)
      .eq("business_id", product.business_id)
      .single();

    const productContext = { 
      id: product.id, 
      image: product.images?.[0] || "", 
      name: product.name 
    };

    if (existingConvo) {
      navigate(`/chat/${existingConvo.id}`, { state: { product: productContext } });
      return;
    }

    const { data: newConvo } = await supabase
      .from("conversations")
      .insert({ client_id: userId, business_id: product.business_id })
      .select("id")
      .single();

    if (newConvo) {
      navigate(`/chat/${newConvo.id}`, { state: { product: productContext } });
    }
  };

  const handleOrder = async () => {
    if (!userId) {
      navigate("/auth");
      return;
    }

    if (!product) return;

    setOrdering(true);
    
    const { error } = await supabase
      .from("orders")
      .insert({
        client_id: userId,
        business_id: product.business_id,
        product_id: product.id,
        quantity,
        total_price: product.price * quantity,
        currency: product.currency
      });

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de passer la commande",
        variant: "destructive"
      });
    } else {
      // Create notification for business
      const { data: businessProfile } = await supabase
        .from("business_profiles")
        .select("user_id")
        .eq("id", product.business_id)
        .single();

      if (businessProfile) {
        await supabase.from("notifications").insert({
          user_id: businessProfile.user_id,
          type: "new_order",
          title: "Nouvelle commande",
          message: `Nouvelle commande pour ${product.name} (x${quantity})`,
          data: { product_id: product.id, quantity }
        });
      }

      toast({
        title: "Commande passée !",
        description: "Votre commande a été enregistrée avec succès"
      });
      navigate("/orders");
    }
    
    setOrdering(false);
  };

  const nextImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === product.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images!.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-4">
          <div className="aspect-square bg-muted rounded-2xl" />
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-6 bg-muted rounded w-1/4" />
        </div>
      </DashboardLayout>
    );
  }

  if (!product) return null;

  const images = product.images?.length ? product.images : ["/placeholder.svg"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold flex-1">Détails du produit</h1>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => toggleFavorite(product.id)}
          >
            <Heart 
              className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-afrimart-orange text-afrimart-orange' : ''}`} 
            />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Image Gallery */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
          <img
            src={images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentImageIndex ? 'bg-primary' : 'bg-background/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                  idx === currentImageIndex ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Product Info */}
        <div className="space-y-4">
          <div>
            {product.category && (
              <span className="text-sm text-muted-foreground">{product.category}</span>
            )}
            <h2 className="text-2xl font-display font-bold">{product.name}</h2>
            <p className="text-2xl font-bold text-afrimart-orange mt-2">
              {product.price.toLocaleString()} {product.currency}
            </p>
          </div>

          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          {/* Business Info */}
          {product.business_profiles && (
            <button
              onClick={() => navigate(`/business/${product.business_id}`)}
              className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border w-full text-left hover:bg-muted/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-afrimart-orange/10 flex items-center justify-center overflow-hidden">
                {product.business_profiles.logo_url ? (
                  <img 
                    src={product.business_profiles.logo_url} 
                    alt={product.business_profiles.business_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-6 h-6 text-afrimart-orange" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{product.business_profiles.business_name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.business_profiles.location || product.business_profiles.country || "Côte d'Ivoire"}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="font-semibold">Quantité:</span>
            <div className="flex items-center gap-3 bg-muted rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleChatClick}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contacter
          </Button>
          <Button
            className="flex-1 btn-client"
            onClick={handleOrder}
            disabled={ordering}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {ordering ? "..." : "Commander"}
          </Button>
        </div>

        {/* Spacer for fixed bottom bar */}
        <div className="h-20" />
      </div>
    </DashboardLayout>
  );
};

export default ProductDetails;
