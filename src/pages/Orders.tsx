import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ArrowLeft, Package, Clock, CheckCircle, Truck, XCircle } from "lucide-react";

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  quantity: number;
  total_price: number;
  currency: string;
  status: OrderStatus;
  created_at: string;
  products: {
    id: string;
    name: string;
    images: string[] | null;
  };
  business_profiles: {
    business_name: string;
  };
}

const statusConfig: Record<OrderStatus, { label: string; icon: any; color: string }> = {
  pending: { label: "En attente", icon: Clock, color: "text-yellow-500" },
  confirmed: { label: "Confirmée", icon: CheckCircle, color: "text-blue-500" },
  processing: { label: "En préparation", icon: Package, color: "text-purple-500" },
  shipped: { label: "Expédiée", icon: Truck, color: "text-afrimart-green" },
  delivered: { label: "Livrée", icon: CheckCircle, color: "text-afrimart-green" },
  cancelled: { label: "Annulée", icon: XCircle, color: "text-destructive" }
};

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data } = await supabase
        .from("orders")
        .select(`
          *,
          products (id, name, images),
          business_profiles (business_name)
        `)
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      setOrders((data as Order[]) || []);
      setLoading(false);
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-display font-bold">Mes Commandes</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground mb-4">Aucune commande pour le moment</p>
            <Button className="btn-client" onClick={() => navigate("/catalog")}>
              Explorer les produits
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;
              
              return (
                <div
                  key={order.id}
                  className="bg-card rounded-xl border border-border p-4 space-y-3"
                >
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={order.products?.images?.[0] || "/placeholder.svg"}
                        alt={order.products?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{order.products?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.business_profiles?.business_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Quantité: {order.quantity}
                      </p>
                      <p className="font-semibold text-afrimart-orange">
                        {order.total_price.toLocaleString()} {order.currency}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className={`flex items-center gap-2 ${config.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-sm font-medium">{config.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Orders;
