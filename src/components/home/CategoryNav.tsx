import { useNavigate } from "react-router-dom";
import { 
  Shirt, 
  Smartphone, 
  UtensilsCrossed, 
  Sparkles, 
  Home, 
  Car, 
  Dumbbell, 
  BookOpen,
  Gem,
  MoreHorizontal
} from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const categories = [
  { name: "Mode", icon: Shirt, color: "bg-pink-500/10 text-pink-600" },
  { name: "Électronique", icon: Smartphone, color: "bg-blue-500/10 text-blue-600" },
  { name: "Alimentation", icon: UtensilsCrossed, color: "bg-orange-500/10 text-orange-600" },
  { name: "Beauté", icon: Sparkles, color: "bg-purple-500/10 text-purple-600" },
  { name: "Maison", icon: Home, color: "bg-green-500/10 text-green-600" },
  { name: "Auto-Moto", icon: Car, color: "bg-slate-500/10 text-slate-600" },
  { name: "Sport", icon: Dumbbell, color: "bg-red-500/10 text-red-600" },
  { name: "Livres", icon: BookOpen, color: "bg-amber-500/10 text-amber-600" },
  { name: "Bijoux", icon: Gem, color: "bg-cyan-500/10 text-cyan-600" },
  { name: "Autres", icon: MoreHorizontal, color: "bg-muted text-muted-foreground" },
];

export function CategoryNav() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/catalog?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-4 bg-muted/30 border-b border-border">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 pb-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-background transition-colors group shrink-0"
              >
                <div className={`p-3 rounded-xl ${category.color} group-hover:scale-110 transition-transform`}>
                  <category.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}
