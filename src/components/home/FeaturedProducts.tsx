import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  category: string | null;
  business_id: string;
  business_profiles: {
    id: string;
    business_name: string;
  } | null;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          price,
          currency,
          images,
          category,
          business_id,
          business_profiles (
            id,
            business_name
          )
        `)
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(8);

      if (!error && data) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleProtectedAction = (callback: () => void) => {
    if (!session) {
      navigate("/auth");
    } else {
      callback();
    }
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Produits en vedette
            </h2>
            <p className="text-muted-foreground mt-1">
              Les dernières nouveautés de nos vendeurs
            </p>
          </div>
          <Link to="/catalog">
            <Button variant="outline" className="gap-2">
              Voir tout <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                currency={product.currency}
                images={product.images || []}
                category={product.category || undefined}
                businessName={product.business_profiles?.business_name}
                businessId={product.business_profiles?.id}
                onToggleFavorite={() => handleProtectedAction(() => {})}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
