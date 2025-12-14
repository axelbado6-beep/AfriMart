import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  category?: string;
  businessName?: string;
  businessId?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  showChatButton?: boolean;
  onChatClick?: (productId: string, productImage: string, productName: string) => void;
}

export function ProductCard({ 
  id,
  name, 
  price, 
  currency, 
  images, 
  category,
  businessName,
  businessId,
  isFavorite = false,
  onToggleFavorite,
  showChatButton = false,
  onChatClick,
}: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-CI', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price) + ' ' + currency;
  };

  const imageUrl = images.length > 0 
    ? images[0] 
    : '/placeholder.svg';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(id);
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChatClick?.(id, imageUrl, name);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: id,
      name,
      price,
      currency,
      image: imageUrl,
      businessId: businessId || "",
      businessName: businessName || "Vendeur"
    });
    toast({
      title: "Ajouté au panier",
      description: `${name} ajouté au panier`
    });
  };

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const inCart = isInCart(id);

  return (
    <Card 
      className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background ${
            isFavorite ? "text-red-500 hover:text-red-600" : "hover:text-primary"
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </Button>
        {category && (
          <Badge 
            variant="secondary" 
            className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm"
          >
            {category}
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        {businessName && (
          <p 
            className="text-xs text-muted-foreground mb-1 hover:text-primary cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              if (businessId) navigate(`/business/${businessId}`);
            }}
          >
            {businessName}
          </p>
        )}
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{name}</h3>
        <p className="text-lg font-bold text-primary">{formatPrice(price, currency)}</p>
      </CardContent>
      {showChatButton && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button 
            onClick={handleAddToCart}
            variant={inCart ? "secondary" : "outline"}
            size="sm"
            className="flex-1 gap-1"
          >
            <ShoppingCart className="h-4 w-4" />
            {inCart ? "Ajouté" : "Panier"}
          </Button>
          <Button 
            onClick={handleChatClick}
            className="flex-1 gap-1 btn-client"
            size="sm"
          >
            <MessageCircle className="h-4 w-4" />
            Contacter
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
