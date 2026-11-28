import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowLeft, Store, MapPin, CheckCircle, ShoppingBag, Sparkles, X } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";
import { getCategoryConfig } from "@/components/catalog/CategoryColors";
import { CategorySelector } from "@/components/catalog/CategorySelector";
import { matchesCatalogSection, normalizeCategory } from "@/lib/catalog-categories";
import afrimartLogo from "@/assets/afrimart-logo.jpg";
import { IdleFloatingElements } from "@/components/catalog/IdleFloatingElements";
import { SearchSuggestions } from "@/components/home/SearchSuggestions";

type BusinessProfile = Tables<"business_profiles">;

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  category: string | null;
  description: string | null;
  business_id: string;
  business_profiles: {
    id: string;
    business_name: string;
    category: string | null;
  } | null;
}

const placeholders = [
  "Rechercher des robes africaines...",
  "Trouver du beurre de karité...",
  "Des bijoux artisanaux...",
  "Des épices locales...",
  "Des tissus wax...",
];

export default function Catalog() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const selectedCategory = normalizeCategory(searchParams.get("category"));
  const requestedSub = searchParams.get("sub") || (["Restaurants", "Marché", "Boissons", "Pharmacie", "Cadeaux"].includes(searchParams.get("category") || "") ? searchParams.get("category") || "" : "");
  const selectedSub = getCategoryConfig(selectedCategory).subcategories.includes(requestedSub) ? requestedSub : "";
  const selectSection = (category: string, sub = "") => {
    const params = new URLSearchParams(searchParams);
    params.set("category", category);
    if (sub) params.set("sub", sub); else params.delete("sub");
    setSearchParams(params);
  };
  useEffect(() => { setSearchTerm(searchParams.get("search") || ""); }, [searchParams.get("search")]);
  const [activeTab, setActiveTab] = useState("products");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [idleTime, setIdleTime] = useState(0);
  const [showIdleElements, setShowIdleElements] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);

  // Animated placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Idle detection for floating elements
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const resetIdle = () => {
      setIdleTime(0);
      setShowIdleElements(false);
    };

    const checkIdle = () => {
      timer = setTimeout(() => {
        setIdleTime(prev => prev + 1);
        if (idleTime >= 10) {
          setShowIdleElements(true);
        }
        checkIdle();
      }, 1000);
    };

    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);
    window.addEventListener("click", resetIdle);
    window.addEventListener("scroll", resetIdle);
    checkIdle();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      window.removeEventListener("click", resetIdle);
      window.removeEventListener("scroll", resetIdle);
    };
  }, [idleTime]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      let productQuery = supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          currency,
          images,
          description,
          category,
          business_id,
          business_profiles (
            id,
            business_name,
            category
          )
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      const { data: productsData } = await productQuery;
      setProducts(productsData || []);

      const { data: businessesData } = await supabase
        .from('business_profiles')
        .select('id, user_id, business_name, logo_url, banner_url, category, description, opening_hours, location, country, is_verified, followers_count, created_at, updated_at, latitude, longitude, delivery_radius_km, delivery_fee_base, delivery_fee_per_km, delivery_mode')
        .order('followers_count', { ascending: false });

      setBusinesses((businessesData || []).map((b) => ({ ...b, phone: null })));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    matchesCatalogSection(product.category, `${product.name} ${product.description ?? ""} ${product.business_profiles?.category ?? ""}`, selectedCategory, selectedSub) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBusinesses = businesses.filter(business =>
    matchesCatalogSection(business.category, `${business.business_name} ${business.description ?? ""}`, selectedCategory, selectedSub) &&
    `${business.business_name} ${business.category ?? ""} ${business.location ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Idle Floating Elements */}
      <IdleFloatingElements isActive={showIdleElements} category={selectedCategory} />

      {/* Header */}
      <header className="relative md:sticky md:top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border animate-slide-down">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="icon" aria-label="Retour à l’accueil" className="hover-scale">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                Explorer
                <Sparkles className="w-5 h-5 text-afrimart-gold animate-pulse-slow" />
              </h1>
              <p className="text-sm text-muted-foreground">
                Découvrez les trésors de l'Afrique
              </p>
            </div>
            <Link to="/" aria-label="AfriMart — Accueil"><img src={afrimartLogo} alt="AfriMart" className="w-12 h-12 rounded-md object-contain" /></Link>
          </div>
          
          {/* Enhanced Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-2 h-11 bg-muted/50 p-1 rounded-lg">
              <TabsTrigger 
                value="products" 
                className="flex items-center gap-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
              >
                <ShoppingBag className="w-4 h-4" />
                Produits
              </TabsTrigger>
              <TabsTrigger 
                value="businesses" 
                className="flex items-center gap-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
              >
                <Store className="w-4 h-4" />
                Entreprises
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Enhanced Search Bar with Pinterest-style suggestions */}
          <div ref={searchRef} className="relative">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder={placeholders[placeholderIndex]}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="pl-12 pr-12 h-11 text-base bg-muted/50 border-2 border-transparent focus:border-primary/50 focus:bg-background rounded-2xl transition-all duration-300 focus:shadow-lg focus:shadow-primary/10"
              />
              {searchTerm && (
                <>
                  <Sparkles className="absolute right-12 top-1/2 -translate-y-1/2 h-5 w-5 text-afrimart-gold animate-pulse-slow" />
                  <Button variant="ghost" size="icon" aria-label="Effacer la recherche"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </>
              )}
            </div>
            
            {/* Search Suggestions */}
            <SearchSuggestions
              query={searchTerm}
              onSelect={(suggestion) => {
                setSearchTerm(suggestion);
                setShowSuggestions(false);
              }}
              isVisible={showSuggestions}
              onClose={() => setShowSuggestions(false)}
            />
          </div>
        </div>

        <div className="container mx-auto px-4">
          <CategorySelector category={selectedCategory} sub={selectedSub} onSelect={selectSection} />
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-6 relative z-10">
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

const BusinessCard = ({ business, onClick }: { business: BusinessProfile; onClick: () => void }) => (
  <Button variant="ghost" onClick={onClick}
    className="group h-auto block w-full p-0 text-left whitespace-normal bg-card text-card-foreground rounded-lg border border-border overflow-hidden hover:bg-card hover:border-primary/40 motion-safe:hover:-translate-y-1 transition-all">
    <div className="relative h-20 bg-muted overflow-hidden">
      {business.banner_url && <img src={business.banner_url} alt="" className="w-full h-full object-cover" loading="lazy" />}
    </div>
    <div className="p-3">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-md bg-muted shrink-0 overflow-hidden">
          {business.logo_url ? <img src={business.logo_url} alt="" className="w-full h-full object-cover" loading="lazy" /> : <Store className="w-full h-full p-2.5 text-muted-foreground" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-display font-semibold text-sm truncate group-hover:text-primary">{business.business_name}</h3>
            {business.is_verified && <CheckCircle aria-label="Entreprise vérifiée" className="h-4 w-4 text-primary shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground truncate mt-1">{business.category}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 min-w-0"><MapPin className="h-3 w-3 shrink-0" /><span className="truncate">{business.location || "—"}</span></span>
        <span className="shrink-0">{business.followers_count || 0} abonnés</span>
      </div>
    </div>
  </Button>
);
