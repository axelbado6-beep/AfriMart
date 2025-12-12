import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowLeft, Store, MapPin, CheckCircle, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

type BusinessProfile = Tables<"business_profiles">;

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

const categories = [
  "Tous",
  "Mode & Vêtements",
  "Électronique",
  "Alimentation",
  "Beauté & Santé",
  "Maison & Jardin",
  "Sport & Loisirs",
  "Art & Artisanat",
  "Services",
];

export default function Catalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [activeTab, setActiveTab] = useState("products");

  useEffect(() => {
    fetchData();
  }, [selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch products
      let productQuery = supabase
        .from('products')
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
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (selectedCategory !== "Tous") {
        productQuery = productQuery.eq('category', selectedCategory);
      }

      const { data: productsData } = await productQuery;
      setProducts(productsData || []);

      // Fetch businesses
      const { data: businessesData } = await supabase
        .from('business_profiles')
        .select('*')
        .order('followers_count', { ascending: false });

      setBusinesses(businessesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBusinesses = businesses.filter(business =>
    business.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Explorer
            </h1>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Produits
              </TabsTrigger>
              <TabsTrigger value="businesses" className="flex items-center gap-2">
                <Store className="w-4 h-4" />
                Entreprises
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={activeTab === "products" ? "Rechercher un produit..." : "Rechercher une entreprise..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Categories - Only for products */}
        {activeTab === "products" && (
          <div className="container mx-auto px-4 pb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer whitespace-nowrap px-4 py-2 transition-colors ${
                    selectedCategory === category 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6">
        {activeTab === "products" ? (
          <ProductGrid 
            products={filteredProducts.map(p => ({
              ...p,
              category: p.category || undefined,
              business_id: p.business_id,
              business_profiles: p.business_profiles ? {
                id: p.business_profiles.id,
                business_name: p.business_profiles.business_name
              } : undefined
            }))} 
            loading={loading} 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border animate-pulse">
                  <div className="h-24 bg-muted rounded-t-2xl" />
                  <div className="p-4">
                    <div className="w-16 h-16 rounded-xl bg-muted -mt-12 mb-3" />
                    <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : filteredBusinesses.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <Store className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h2 className="text-xl font-display font-semibold mb-2">
                  Aucune entreprise trouvée
                </h2>
                <p className="text-muted-foreground">
                  Essayez avec d'autres termes de recherche
                </p>
              </div>
            ) : (
              filteredBusinesses.map((business) => (
                <BusinessCard 
                  key={business.id} 
                  business={business}
                  onClick={() => navigate(`/business/${business.id}`)}
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

const BusinessCard = ({ 
  business, 
  onClick 
}: { 
  business: BusinessProfile;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="group text-left bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Banner */}
      <div 
        className="h-24 bg-gradient-to-br from-primary/20 to-secondary/20"
        style={business.banner_url ? {
          backgroundImage: `url(${business.banner_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      />

      {/* Content */}
      <div className="p-4 -mt-8">
        {/* Logo */}
        <div className="w-16 h-16 rounded-xl bg-card border-2 border-background shadow-lg overflow-hidden mb-3">
          {business.logo_url ? (
            <img 
              src={business.logo_url} 
              alt={business.business_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <Store className="w-6 h-6 text-primary" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="font-display font-bold truncate group-hover:text-primary transition-colors">
                {business.business_name}
              </h3>
              {business.is_verified && (
                <CheckCircle className="w-4 h-4 text-afrimart-green fill-afrimart-green/20 flex-shrink-0" />
              )}
            </div>
            {business.category && (
              <p className="text-sm text-muted-foreground">{business.category}</p>
            )}
          </div>
        </div>

        {/* Location & Stats */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          {business.location && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {business.location}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {business.followers_count || 0} abonnés
          </span>
        </div>
      </div>
    </button>
  );
};
