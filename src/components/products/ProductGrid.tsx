import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/useFavorites";

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  category?: string;
  business_id?: string;
  business_profiles?: {
    id?: string;
    business_name: string;
  };
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  showChatButton?: boolean;
}

export function ProductGrid({ products, loading, showChatButton = true }: ProductGridProps) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { toggleFavorite, isFavorite } = useFavorites(userId);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  const handleChatClick = async (productId: string, productImage: string, productName: string) => {
    if (!userId) {
      navigate("/auth");
      return;
    }

    // Find the product to get business_id
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const businessId = product.business_id || product.business_profiles?.id;
    if (!businessId) return;

    // Check if conversation exists
    const { data: existingConvo } = await supabase
      .from("conversations")
      .select("id")
      .eq("client_id", userId)
      .eq("business_id", businessId)
      .single();

    const productContext = {
      id: productId,
      image: productImage,
      name: productName,
    };

    if (existingConvo) {
      navigate(`/chat/${existingConvo.id}`, { state: { product: productContext } });
      return;
    }

    // Create new conversation
    const { data: newConvo, error } = await supabase
      .from("conversations")
      .insert({
        client_id: userId,
        business_id: businessId,
      })
      .select("id")
      .single();

    if (!error && newConvo) {
      navigate(`/chat/${newConvo.id}`, { state: { product: productContext } });
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun produit disponible pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          currency={product.currency}
          images={product.images || []}
          category={product.category}
          businessName={product.business_profiles?.business_name}
          businessId={product.business_id || product.business_profiles?.id}
          isFavorite={isFavorite(product.id)}
          onToggleFavorite={toggleFavorite}
          showChatButton={showChatButton}
          onChatClick={handleChatClick}
        />
      ))}
    </div>
  );
}
