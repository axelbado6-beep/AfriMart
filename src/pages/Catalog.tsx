import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  category: string | null;
  business_profiles: {
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          currency,
          images,
          category,
          business_profiles (
            business_name
          )
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (selectedCategory !== "Tous") {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
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
              Catalogue
            </h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Categories */}
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
      </header>

      {/* Products */}
      <main className="container mx-auto px-4 py-6">
        <ProductGrid 
          products={filteredProducts.map(p => ({
            ...p,
            category: p.category || undefined,
            business_profiles: p.business_profiles || undefined
          }))} 
          loading={loading} 
        />
      </main>
    </div>
  );
}
