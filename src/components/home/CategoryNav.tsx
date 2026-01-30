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
    <section className="py-4 bg-muted/30 border-b border-border animate-fade-in">
      <div className="container mx-auto px-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 pb-2">
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-background transition-all duration-300 group shrink-0 hover:scale-105 active:scale-95 animate-fade-in opacity-0"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <div className={`p-3 rounded-xl ${category.color} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:rotate-3`}>
                  <category.icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-all duration-200 group-hover:font-semibold">
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
