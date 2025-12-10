import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductGrid } from "@/components/products/ProductGrid";
import { AddProductForm } from "@/components/products/AddProductForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, ArrowLeft, Package } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  category: string | null;
}

export default function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkBusinessAndFetchProducts();
  }, []);

  const checkBusinessAndFetchProducts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      // Get business profile
      const { data: businessProfile, error: businessError } = await supabase
        .from('business_profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (businessError) throw businessError;

      if (!businessProfile) {
        toast.error("Vous devez avoir un compte entreprise pour gérer les produits");
        navigate('/dashboard');
        return;
      }

      setBusinessId(businessProfile.id);
      await fetchProducts(businessProfile.id);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur est survenue");
    }
  };

  const fetchProducts = async (busId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, currency, images, category')
        .eq('business_id', busId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductAdded = () => {
    setDialogOpen(false);
    if (businessId) {
      fetchProducts(businessId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-display font-bold text-foreground">
                  Mes Produits
                </h1>
                <p className="text-sm text-muted-foreground">
                  {products.length} produit{products.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Nouveau Produit
                  </DialogTitle>
                </DialogHeader>
                {businessId && (
                  <AddProductForm 
                    businessId={businessId} 
                    onSuccess={handleProductAdded}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Products */}
      <main className="container mx-auto px-4 py-6">
        {!loading && products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Aucun produit
            </h2>
            <p className="text-muted-foreground mb-6">
              Commencez à vendre en ajoutant votre premier produit
            </p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un produit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Nouveau Produit
                  </DialogTitle>
                </DialogHeader>
                {businessId && (
                  <AddProductForm 
                    businessId={businessId} 
                    onSuccess={handleProductAdded}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <ProductGrid 
            products={products.map(p => ({
              ...p,
              category: p.category || undefined
            }))} 
            loading={loading} 
          />
        )}
      </main>
    </div>
  );
}
