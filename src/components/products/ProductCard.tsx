import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Heart } from "lucide-react";

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

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
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
        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={handleChatClick}
            className="w-full gap-2 btn-client"
          >
            <MessageCircle className="h-4 w-4" />
            Contacter le vendeur
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
