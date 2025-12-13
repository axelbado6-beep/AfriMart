import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useState } from "react";

export const CartDrawer = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { items, updateQuantity, removeFromCart, getItemCount, getTotal, clearCart } = useCart();

  const handleCheckout = () => {
    setOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="w-5 h-5" />
          {getItemCount() > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-afrimart-orange text-white text-xs rounded-full flex items-center justify-center">
              {getItemCount() > 9 ? "9+" : getItemCount()}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Mon Panier ({getItemCount()})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">Votre panier est vide</p>
            <Button
              onClick={() => {
                setOpen(false);
                navigate("/catalog");
              }}
              className="btn-client"
            >
              Explorer les produits
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 bg-muted/50 rounded-xl"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.businessName}
                    </p>
                    <p className="font-semibold text-afrimart-orange mt-1">
                      {item.price.toLocaleString()} {item.currency}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-background rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.productId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span className="font-semibold">
                  {getTotal().toLocaleString()} XOF
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearCart}
                >
                  Vider
                </Button>
                <Button
                  className="flex-1 btn-client"
                  onClick={handleCheckout}
                >
                  Commander
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
