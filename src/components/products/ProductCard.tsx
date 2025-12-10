import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  category?: string;
  businessName?: string;
}

export function ProductCard({ 
  name, 
  price, 
  currency, 
  images, 
  category,
  businessName 
}: ProductCardProps) {
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-CI', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price) + ' ' + currency;
  };

  const imageUrl = images.length > 0 
    ? images[0] 
    : '/placeholder.svg';

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
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background hover:text-primary"
        >
          <Heart className="h-4 w-4" />
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
          <p className="text-xs text-muted-foreground mb-1">{businessName}</p>
        )}
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2">{name}</h3>
        <p className="text-lg font-bold text-primary">{formatPrice(price, currency)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
          <ShoppingCart className="h-4 w-4" />
          Ajouter au panier
        </Button>
      </CardFooter>
    </Card>
  );
}
