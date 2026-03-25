import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ArrowLeft, ShoppingBag, MapPin, Phone, User } from "lucide-react";

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: ""
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setUserId(user.id);

      // Pre-fill with profile data
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profile) {
        setForm(prev => ({
          ...prev,
          fullName: profile.full_name || "",
          phone: profile.phone || ""
        }));
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (items.length === 0) {
      navigate("/catalog");
    }
  }, [items, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      navigate("/auth");
      return;
    }

    const trimmedName = form.fullName.trim();
    const trimmedPhone = form.phone.trim();
    const trimmedAddress = form.address.trim();
    const trimmedNotes = form.notes.trim();

    if (!trimmedName || !trimmedPhone || !trimmedAddress) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (trimmedAddress.length > 500) {
      toast({ title: "Erreur", description: "Adresse trop longue (max 500 caractères)", variant: "destructive" });
      return;
    }

    if (trimmedNotes.length > 1000) {
      toast({ title: "Erreur", description: "Notes trop longues (max 1000 caractères)", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // Group items by business
      const ordersByBusiness = items.reduce((acc, item) => {
        if (!acc[item.businessId]) {
          acc[item.businessId] = [];
        }
        acc[item.businessId].push(item);
        return acc;
      }, {} as Record<string, typeof items>);

      // Create orders for each business
      for (const [businessId, businessItems] of Object.entries(ordersByBusiness)) {
        for (const item of businessItems) {
          const { error } = await supabase.from("orders").insert({
            client_id: userId,
            business_id: businessId,
            product_id: item.productId,
            quantity: item.quantity,
            total_price: item.price * item.quantity,
            currency: item.currency,
            shipping_address: trimmedAddress,
            notes: trimmedNotes || null
          });

          if (error) throw error;

          // Send notification to business
          const { data: business } = await supabase
            .from("business_profiles")
            .select("user_id")
            .eq("id", businessId)
            .maybeSingle();

          if (business) {
            await supabase.from("notifications").insert({
              user_id: business.user_id,
              type: "new_order",
              title: "Nouvelle commande",
              message: `Commande pour ${item.name} (x${item.quantity})`,
              data: { product_id: item.productId }
            });
          }
        }
      }

      clearCart();
      toast({
        title: "Commande passée !",
        description: "Vos commandes ont été enregistrées avec succès"
      });
      navigate("/orders");
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de finaliser la commande",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-display font-bold">Finaliser la commande</h1>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Récapitulatif ({items.length} article{items.length > 1 ? "s" : ""})
          </h2>
          
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qté: {item.quantity}</p>
                </div>
                <p className="font-semibold text-sm">
                  {(item.price * item.quantity).toLocaleString()} {item.currency}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-4 pt-4 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg text-afrimart-orange">
              {getTotal().toLocaleString()} XOF
            </span>
          </div>
        </div>

        {/* Delivery Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-4 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Informations de livraison
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nom complet *
              </Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Votre nom complet"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Téléphone *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+225 07 00 00 00 00"
                required
              />
            </div>

            <div>
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Adresse de livraison *
              </Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Quartier, commune, ville..."
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Instructions spéciales pour la livraison..."
                rows={2}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full btn-client"
            disabled={loading}
          >
            {loading ? "Traitement..." : `Confirmer la commande (${getTotal().toLocaleString()} XOF)`}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Checkout;
