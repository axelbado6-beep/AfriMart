import { Link } from "react-router-dom";
import { UtensilsCrossed, ShoppingBasket, Shirt, Sparkles, Pill, Wine, Gift, Wrench, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { catalogHref, homeDestinations } from "@/lib/catalog-categories";

const icons = [UtensilsCrossed, ShoppingBasket, Shirt, Sparkles, Pill, Wine, Gift, Wrench];

export function CategoryGlovoGrid() {
  return <section className="py-6 md:py-8">
    <div className="container mx-auto px-4">
      <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-5">Que cherchez-vous aujourd'hui ?</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {homeDestinations.map((tile, index) => {
          const Icon = icons[index];
          return <Button asChild variant="ghost" key={tile.name}
            className={`category-tile category-tone-${tile.tone} group h-24 md:h-28 rounded-lg justify-start px-4 overflow-hidden motion-safe:hover:-translate-y-1 motion-safe:active:scale-95 transition-transform`}>
            <Link to={catalogHref(tile.category, tile.sub)}>
              <span className="category-tile-icon shrink-0 w-11 h-11 md:w-14 md:h-14 rounded-full flex items-center justify-center motion-safe:group-hover:rotate-6 transition-transform"><Icon className="!w-6 !h-6" /></span>
              <span className="font-semibold text-sm md:text-base min-w-0 whitespace-normal break-words">{tile.name}</span>
              <ArrowUpRight className="ml-auto opacity-50 shrink-0" />
            </Link>
          </Button>;
        })}
      </div>
    </div>
  </section>;
}