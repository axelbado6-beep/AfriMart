import { useNavigate } from "react-router-dom";
import {
  UtensilsCrossed,
  ShoppingBasket,
  Shirt,
  Sparkles,
  Pill,
  Wine,
  Gift,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tiles = [
  { name: "Restaurants", catalogCategory: "Alimentation", icon: UtensilsCrossed, bg: "bg-orange-100", iconBg: "bg-orange-500", text: "text-orange-900" },
  { name: "Marché", catalogCategory: "Alimentation", icon: ShoppingBasket, bg: "bg-emerald-100", iconBg: "bg-emerald-500", text: "text-emerald-900" },
  { name: "Mode", catalogCategory: "Mode", icon: Shirt, bg: "bg-pink-100", iconBg: "bg-pink-500", text: "text-pink-900" },
  { name: "Beauté", catalogCategory: "Beauté", icon: Sparkles, bg: "bg-purple-100", iconBg: "bg-purple-500", text: "text-purple-900" },
  { name: "Pharmacie", catalogCategory: "Autres", icon: Pill, bg: "bg-red-100", iconBg: "bg-red-500", text: "text-red-900" },
  { name: "Boissons", catalogCategory: "Alimentation", icon: Wine, bg: "bg-amber-100", iconBg: "bg-amber-500", text: "text-amber-900" },
  { name: "Cadeaux", catalogCategory: "Autres", icon: Gift, bg: "bg-rose-100", iconBg: "bg-rose-500", text: "text-rose-900" },
  { name: "Services", catalogCategory: "Autres", icon: Wrench, bg: "bg-indigo-100", iconBg: "bg-indigo-500", text: "text-indigo-900" },
];

export function CategoryGlovoGrid() {
  const navigate = useNavigate();

  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-display font-bold text-foreground mb-4">
          Que cherchez-vous aujourd'hui ?
        </h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {tiles.map((tile, i) => (
            <button
              key={tile.name}
              onClick={() => navigate(`/catalog?category=${encodeURIComponent(tile.catalogCategory)}`)}
              className={cn(
                "group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-300",
                "hover:scale-105 active:scale-95 hover:shadow-lg animate-fade-in",
                tile.bg
              )}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div
                className={cn(
                  "w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110",
                  tile.iconBg
                )}
              >
                <tile.icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
              </div>
              <span className={cn("text-xs md:text-sm font-bold text-center leading-tight", tile.text)}>
                {tile.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
