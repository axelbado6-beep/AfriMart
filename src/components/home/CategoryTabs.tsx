import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Sparkles, TrendingUp, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/products/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Mode", emoji: "👗", gradient: "from-pink-500 to-rose-600", icon: Sparkles },
  { name: "Électronique", emoji: "📱", gradient: "from-blue-500 to-cyan-600", icon: Zap },
  { name: "Alimentation", emoji: "🍲", gradient: "from-orange-500 to-amber-600", icon: TrendingUp },
  { name: "Beauté", emoji: "✨", gradient: "from-purple-500 to-fuchsia-600", icon: Star },
];

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

export function CategoryTabs() {
  const [activeCategory, setActiveCategory] = useState(categories[0].name);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [showProducts, setShowProducts] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setShowProducts(false);
      
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
        .eq("category", activeCategory)
        .order("created_at", { ascending: false })
        .limit(4);

      if (!error && data) {
        setProducts(data as Product[]);
        // Petit délai pour animation de révélation
        setTimeout(() => setShowProducts(true), 50);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [activeCategory]);

  const handleProtectedAction = (callback: () => void) => {
    if (!session) {
      navigate("/auth");
    } else {
      callback();
    }
  };

  const activeTabData = categories.find(c => c.name === activeCategory);

  return (
    <section className="py-16 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section header with animation */}
        <div className="flex items-center justify-between mb-10">
          <div className="animate-fade-in-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-afrimart-orange to-afrimart-gold">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Par catégorie
              </h2>
            </div>
            <p className="text-muted-foreground">
              Explorez par type de produit
            </p>
          </div>
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          {/* Enhanced Tab Triggers */}
          <TabsList className="mb-8 flex-wrap h-auto gap-3 bg-transparent p-0 justify-start">
            {categories.map((category, index) => {
              const isActive = activeCategory === category.name;
              const CategoryIcon = category.icon;
              
              return (
                <TabsTrigger
                  key={category.name}
                  value={category.name}
                  className={cn(
                    "relative px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300",
                    "data-[state=active]:text-white data-[state=inactive]:text-muted-foreground",
                    "data-[state=inactive]:bg-muted/50 data-[state=inactive]:hover:bg-muted",
                    "hover:scale-105 active:scale-95",
                    "animate-bounce-in"
                  )}
                  style={{ animationDelay: '0ms' }} // Tous en même temps
                >
                  {/* Active gradient background */}
                  {isActive && (
                    <div className={cn(
                      "absolute inset-0 rounded-2xl bg-gradient-to-r shadow-lg animate-scale-in",
                      category.gradient
                    )} />
                  )}
                  
                  <span className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">{category.emoji}</span>
                    {category.name}
                    {isActive && <CategoryIcon className="w-4 h-4 animate-pulse-slow" />}
                  </span>
                  
                  {/* Glow effect when active */}
                  {isActive && (
                    <div className={cn(
                      "absolute inset-0 rounded-2xl bg-gradient-to-r blur-xl opacity-50 -z-10",
                      category.gradient
                    )} />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.name} value={category.name}>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className={cn(
                    "p-4 rounded-full bg-gradient-to-r animate-spin-slow",
                    category.gradient
                  )}>
                    <Loader2 className="h-8 w-8 text-white" />
                  </div>
                  <p className="mt-4 text-muted-foreground animate-pulse">Chargement...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4 animate-bounce-soft">😔</div>
                  <p className="text-muted-foreground text-lg">
                    Aucun produit dans cette catégorie pour le moment.
                  </p>
                  <Link to="/catalog">
                    <Button variant="outline" className="mt-6 hover:scale-105 transition-transform">
                      Explorer tout le catalogue
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Products grid - Circle reveal (all at once) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product, index) => {
                      // Calculate position for circular arrangement feel
                      const totalProducts = products.length;
                      const angle = (index / totalProducts) * 360;
                      
                      return (
                        <div 
                          key={product.id} 
                          className={cn(
                            "transition-all duration-500",
                            showProducts 
                              ? "opacity-100 scale-100" 
                              : "opacity-0 scale-75"
                          )}
                          style={{ 
                            // Tous apparaissent en même temps, pas de délai
                            transitionDelay: '0ms'
                          }}
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
                      );
                    })}
                  </div>
                  
                  {/* Enhanced "Voir plus" button */}
                  <div className="mt-10 text-center">
                    <Link to={`/catalog?category=${encodeURIComponent(category.name)}`}>
                      <Button 
                        className={cn(
                          "group relative px-8 py-3 rounded-2xl font-semibold overflow-hidden transition-all duration-300",
                          "bg-gradient-to-r hover:shadow-xl hover:scale-105 active:scale-95 text-white",
                          category.gradient
                        )}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Voir plus en {category.name} 
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                        </span>
                        
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
