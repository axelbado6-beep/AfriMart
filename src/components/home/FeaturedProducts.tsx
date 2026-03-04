import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Flame, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  category: string | null;
  business_id: string;
  business_profiles: { id: string; business_name: string } | null;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [showProducts, setShowProducts] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`id, name, price, currency, images, category, business_id, business_profiles (id, business_name)`)
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(8);

      if (!error && data) {
        setProducts(data as Product[]);
        setTimeout(() => setShowProducts(true), 100);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleProtectedAction = (callback: () => void) => {
    if (!session) { navigate("/auth"); } else { callback(); }
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="p-4 rounded-full bg-gradient-to-r from-primary to-secondary animate-spin-slow">
                <Loader2 className="h-8 w-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-50 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="animate-fade-in-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
                <Flame className="h-5 w-5 text-white animate-pulse-slow" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-secondary blur-lg opacity-60 animate-pulse" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Produits en vedette
              </h2>
              <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold animate-bounce-soft">
                <Star className="w-3 h-3 fill-current" />
                HOT
              </div>
            </div>
            <p className="text-muted-foreground">Les dernières nouveautés de nos vendeurs</p>
          </div>
          <Link to="/catalog" className="animate-fade-in-right">
            <Button 
              variant="outline" 
              className={cn(
                "group gap-2 rounded-xl border-2 font-semibold transition-all duration-300",
                "hover:border-primary hover:bg-primary/10 hover:text-primary",
                "hover:scale-105 active:scale-95"
              )}
            >
              Voir tout <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className={cn("transition-all duration-500", showProducts ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-8")}
              style={{ transitionDelay: '0ms' }}
            >
              <ProductCard
                id={product.id} name={product.name} price={product.price} currency={product.currency}
                images={product.images || []} category={product.category || undefined}
                businessName={product.business_profiles?.business_name} businessId={product.business_profiles?.id}
                onToggleFavorite={() => handleProtectedAction(() => {})}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
