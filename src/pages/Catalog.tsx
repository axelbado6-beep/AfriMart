import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ArrowLeft, Store, MapPin, CheckCircle, ShoppingBag, Sparkles, X } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";
import { categoryConfigs, getCategoryConfig, allCategories, type CategoryConfig } from "@/components/catalog/CategoryColors";
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
  business_id: string;
  business_profiles: {
    id: string;
    business_name: string;
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
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [businesses, setBusinesses] = useState<BusinessProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [activeTab, setActiveTab] = useState("products");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
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
  }, [selectedCategory]);

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
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBusinesses = businesses.filter(business =>
    business.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentCategoryConfig = getCategoryConfig(selectedCategory);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Idle Floating Elements */}
      <IdleFloatingElements isActive={showIdleElements} category={selectedCategory} />

      {/* Category-based Background Gradient */}
      <div 
        className={`absolute inset-0 opacity-30 transition-all duration-700 pointer-events-none bg-gradient-to-br ${currentCategoryConfig.gradient}`} 
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border animate-slide-down">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="hover-scale">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
                Explorer
                <Sparkles className="w-5 h-5 text-afrimart-gold animate-pulse-slow" />
              </h1>
              <p className="text-sm text-muted-foreground">
                Découvrez les trésors de l'Afrique
              </p>
            </div>
          </div>
          
          {/* Enhanced Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList className="grid w-full grid-cols-2 h-14 bg-muted/50 p-1 rounded-2xl">
              <TabsTrigger 
                value="products" 
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-afrimart-green data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-afrimart-green/30 transition-all duration-300 font-semibold"
              >
                <ShoppingBag className="w-4 h-4" />
                Produits
              </TabsTrigger>
              <TabsTrigger 
                value="businesses" 
                className="flex items-center gap-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-afrimart-orange data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-afrimart-orange/30 transition-all duration-300 font-semibold"
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
                className="pl-12 pr-12 h-14 text-lg bg-muted/50 border-2 border-transparent focus:border-primary/50 focus:bg-background rounded-2xl transition-all duration-300 focus:shadow-lg focus:shadow-primary/10"
              />
              {searchTerm && (
                <>
                  <Sparkles className="absolute right-12 top-1/2 -translate-y-1/2 h-5 w-5 text-afrimart-gold animate-pulse-slow" />
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
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

        {/* Enhanced Categories with Colors & Subcategories */}
        {activeTab === "products" && (
          <div className="container mx-auto px-4 pb-4">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              {allCategories.map((category, index) => {
                const config = getCategoryConfig(category);
                const isSelected = selectedCategory === category;
                const isHovered = hoveredCategory === category;

                return (
                  <div 
                    key={category}
                    className="relative flex-shrink-0"
                    onMouseEnter={() => setHoveredCategory(category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    {/* Category Pill */}
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`
                        flex items-center gap-2 px-5 py-3 rounded-2xl font-medium
                        transition-all duration-300 whitespace-nowrap
                        animate-scale-in
                        ${isSelected 
                          ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg ${config.shadowClass}` 
                          : `${config.bgClass} ${config.textClass} hover:scale-105 border ${config.borderClass}`
                        }
                      `}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <config.icon className={`w-4 h-4 ${isSelected || isHovered ? "animate-wiggle" : ""}`} />
                      <span>{category}</span>
                      <span className="text-lg">{config.emoji}</span>
                    </button>

                    {/* Subcategories Dropdown on Hover */}
                    {isHovered && config.subcategories.length > 0 && (
                      <div className="absolute top-full left-0 mt-2 z-50 animate-fade-in">
                        <div className={`bg-card border ${config.borderClass} rounded-2xl p-3 shadow-xl min-w-48`}>
                          <p className={`text-xs font-semibold ${config.textClass} mb-2 px-2`}>
                            Sous-catégories
                          </p>
                          <div className="grid grid-cols-2 gap-1">
                            {config.subcategories.map((sub, i) => (
                              <button
                                key={sub}
                                onClick={() => {
                                  setSelectedCategory(category);
                                  setSearchTerm(sub);
                                  setHoveredCategory(null);
                                }}
                                className={`
                                  text-left text-sm px-3 py-2 rounded-xl
                                  ${config.bgClass} hover:${config.textClass}
                                  transition-all duration-200 hover:scale-105 hover:shadow-md
                                  animate-fade-in
                                `}
                                style={{ animationDelay: `${i * 0.03}s` }}
                              >
                                {sub}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
              filteredBusinesses.map((business, index) => (
                <BusinessCard 
                  key={business.id} 
                  business={business}
                  onClick={() => navigate(`/business/${business.id}`)}
                  index={index}
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
  onClick,
  index = 0
}: { 
  business: BusinessProfile;
  onClick: () => void;
  index?: number;
}) => {
  const categoryConfig = getCategoryConfig(business.category || "Tous");

  return (
    <button
      onClick={onClick}
      className="group text-left bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 animate-scale-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Banner with gradient overlay */}
      <div 
        className={`h-28 bg-gradient-to-br ${categoryConfig.gradient} relative overflow-hidden`}
        style={business.banner_url ? {
          backgroundImage: `url(${business.banner_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        {/* Decorative floating emoji */}
        <div className="absolute top-3 right-3 text-2xl opacity-50 group-hover:opacity-100 group-hover:animate-bounce-soft transition-opacity">
          {categoryConfig.emoji}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 -mt-10 relative">
        {/* Logo */}
        <div className={`w-20 h-20 rounded-2xl bg-card border-4 border-background shadow-xl overflow-hidden mb-3 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}>
          {business.logo_url ? (
            <img 
              src={business.logo_url} 
              alt={business.business_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full ${categoryConfig.bgClass} flex items-center justify-center`}>
              <Store className={`w-8 h-8 ${categoryConfig.textClass}`} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-display font-bold text-lg truncate group-hover:text-primary transition-colors">
                {business.business_name}
              </h3>
              {business.is_verified && (
                <CheckCircle className="w-5 h-5 text-afrimart-green fill-afrimart-green/20 flex-shrink-0" />
              )}
            </div>
            {business.category && (
              <span className={`inline-flex items-center gap-1 text-sm ${categoryConfig.textClass} ${categoryConfig.bgClass} px-2 py-0.5 rounded-full mt-1`}>
                {business.category}
              </span>
            )}
          </div>
        </div>

        {/* Location & Stats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          {business.location && (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {business.location}
            </span>
          )}
          <span className="text-sm font-semibold text-afrimart-green">
            {business.followers_count || 0} abonnés
          </span>
        </div>
      </div>
    </button>
  );
};
