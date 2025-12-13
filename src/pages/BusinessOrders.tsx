import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ArrowLeft, Package, Clock, CheckCircle, Truck, XCircle, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  client_id: string;
  quantity: number;
  total_price: number;
  currency: string;
  status: OrderStatus;
  notes: string | null;
  shipping_address: string | null;
  created_at: string;
  products: {
    id: string;
    name: string;
    images: string[] | null;
  };
  profiles?: {
    full_name: string | null;
    phone: string | null;
  };
}

const statusConfig: Record<OrderStatus, { label: string; icon: any; color: string }> = {
  pending: { label: "En attente", icon: Clock, color: "text-yellow-500 bg-yellow-500/10" },
  confirmed: { label: "Confirmée", icon: CheckCircle, color: "text-blue-500 bg-blue-500/10" },
  processing: { label: "En préparation", icon: Package, color: "text-purple-500 bg-purple-500/10" },
  shipped: { label: "Expédiée", icon: Truck, color: "text-afrimart-green bg-afrimart-green/10" },
  delivered: { label: "Livrée", icon: CheckCircle, color: "text-afrimart-green bg-afrimart-green/10" },
  cancelled: { label: "Annulée", icon: XCircle, color: "text-destructive bg-destructive/10" }
};

const BusinessOrders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Get business profile
      const { data: businessProfile } = await supabase
        .from("business_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!businessProfile) {
        navigate("/dashboard");
        return;
      }

      const { data } = await supabase
        .from("orders")
        .select(`
          *,
          products (id, name, images)
        `)
        .eq("business_id", businessProfile.id)
        .order("created_at", { ascending: false });

      // Fetch client profiles separately
      if (data && data.length > 0) {
        const clientIds = [...new Set(data.map(o => o.client_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, phone")
          .in("user_id", clientIds);

        const ordersWithProfiles = data.map(order => ({
          ...order,
          profiles: profiles?.find(p => p.user_id === order.client_id)
        }));

        setOrders(ordersWithProfiles as Order[]);
      } else {
        setOrders([]);
      }
      
      setLoading(false);
    };

    fetchOrders();
  }, [navigate]);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, clientId: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
      return;
    }

    // Create notification for client
    await supabase.from("notifications").insert({
      user_id: clientId,
      type: "order_update",
      title: "Mise à jour de commande",
      message: `Votre commande est maintenant: ${statusConfig[newStatus].label}`,
      data: { order_id: orderId, status: newStatus }
    });

    setOrders(prev => 
      prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );

    toast({
      title: "Statut mis à jour",
      description: `Commande marquée comme "${statusConfig[newStatus].label}"`
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-xl" />
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
          <h1 className="text-xl font-display font-bold">Commandes reçues</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <p className="text-muted-foreground">Aucune commande reçue</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;
              
              return (
                <div
                  key={order.id}
                  className="bg-card rounded-xl border border-border p-4 space-y-4"
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
                        Client: {order.profiles?.full_name || "Anonyme"}
                      </p>
                      {order.profiles?.phone && (
                        <p className="text-sm text-muted-foreground">
                          Tél: {order.profiles.phone}
                        </p>
                      )}
                      <p className="text-sm">Quantité: {order.quantity}</p>
                      <p className="font-semibold text-afrimart-orange">
                        {order.total_price.toLocaleString()} {order.currency}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className={config.color}>
                          <StatusIcon className="w-4 h-4 mr-2" />
                          {config.label}
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {(Object.keys(statusConfig) as OrderStatus[]).map((status) => {
                          const cfg = statusConfig[status];
                          const Icon = cfg.icon;
                          return (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => updateOrderStatus(order.id, status, order.client_id)}
                            >
                              <Icon className={`w-4 h-4 mr-2 ${cfg.color.split(' ')[0]}`} />
                              {cfg.label}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
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

export default BusinessOrders;
