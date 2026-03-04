import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shirt, Smartphone, UtensilsCrossed, Sparkles, Home, Car, Dumbbell, BookOpen, Gem, MoreHorizontal, ChevronDown } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Mode", icon: Shirt, gradient: "from-pink-500 to-rose-600", bgGlow: "bg-pink-500/20", shadowColor: "shadow-pink-500/30", subcategories: ["Robes", "Chaussures", "Sacs", "Accessoires", "Traditionnelle"] },
  { name: "Électronique", icon: Smartphone, gradient: "from-blue-500 to-cyan-600", bgGlow: "bg-blue-500/20", shadowColor: "shadow-blue-500/30", subcategories: ["Téléphones", "Ordinateurs", "Audio", "Accessoires", "Gaming"] },
  { name: "Alimentation", icon: UtensilsCrossed, gradient: "from-amber-500 to-orange-600", bgGlow: "bg-amber-500/20", shadowColor: "shadow-amber-500/30", subcategories: ["Épices", "Céréales", "Boissons", "Snacks", "Huiles"] },
  { name: "Beauté", icon: Sparkles, gradient: "from-purple-500 to-fuchsia-600", bgGlow: "bg-purple-500/20", shadowColor: "shadow-purple-500/30", subcategories: ["Soins peau", "Cheveux", "Maquillage", "Parfums", "Naturel"] },
  { name: "Maison", icon: Home, gradient: "from-green-500 to-emerald-600", bgGlow: "bg-green-500/20", shadowColor: "shadow-green-500/30", subcategories: ["Décoration", "Meubles", "Cuisine", "Jardin", "Literie"] },
  { name: "Auto-Moto", icon: Car, gradient: "from-slate-500 to-zinc-600", bgGlow: "bg-slate-500/20", shadowColor: "shadow-slate-500/30", subcategories: ["Accessoires", "Entretien", "Pièces", "Moto", "Électrique"] },
  { name: "Sport", icon: Dumbbell, gradient: "from-red-500 to-orange-600", bgGlow: "bg-red-500/20", shadowColor: "shadow-red-500/30", subcategories: ["Fitness", "Football", "Natation", "Yoga", "Cyclisme"] },
  { name: "Livres", icon: BookOpen, gradient: "from-indigo-500 to-blue-600", bgGlow: "bg-indigo-500/20", shadowColor: "shadow-indigo-500/30", subcategories: ["Romans", "Éducation", "Business", "Enfants", "Africains"] },
  { name: "Bijoux", icon: Gem, gradient: "from-cyan-500 to-teal-600", bgGlow: "bg-cyan-500/20", shadowColor: "shadow-cyan-500/30", subcategories: ["Colliers", "Bracelets", "Boucles", "Montres", "Africains"] },
  { name: "Autres", icon: MoreHorizontal, gradient: "from-gray-500 to-slate-600", bgGlow: "bg-gray-500/20", shadowColor: "shadow-gray-500/30", subcategories: ["Cadeaux", "Services", "Art", "Artisanat", "Divers"] },
];

export function CategoryNav() {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/catalog?category=${encodeURIComponent(categoryName)}`);
  };

  const handleSubcategoryClick = (categoryName: string, subcategory: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/catalog?category=${encodeURIComponent(categoryName)}&sub=${encodeURIComponent(subcategory)}`);
  };

  return (
    <section className="py-6 bg-gradient-to-b from-muted/50 to-background border-b border-border overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-lg font-display font-bold text-foreground">
            Explorer les catégories
          </h2>
        </div>
        
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 pb-3">
            {categories.map((category) => (
              <div key={category.name} className="relative" onMouseEnter={() => setHoveredCategory(category.name)} onMouseLeave={() => setHoveredCategory(null)}>
                <button
                  onClick={() => handleCategoryClick(category.name)}
                  className={cn("group relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 shrink-0", "hover:scale-110 active:scale-95", "animate-bounce-in")}
                  style={{ animationDelay: '0ms' }}
                >
                  <div className={cn("absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl -z-10", category.bgGlow)} />
                  <div className={cn("relative p-4 rounded-2xl bg-gradient-to-br shadow-lg transition-all duration-300", "group-hover:shadow-xl group-hover:scale-110", category.gradient, category.shadowColor)}>
                    <category.icon className="h-6 w-6 text-white drop-shadow-md" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/20 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={cn("text-sm font-semibold text-muted-foreground transition-all duration-300", "group-hover:text-foreground group-hover:font-bold")}>{category.name}</span>
                    <ChevronDown className={cn("w-3 h-3 text-muted-foreground transition-all duration-300", "group-hover:text-foreground group-hover:rotate-180")} />
                  </div>
                  <div className={cn("absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-0 rounded-full bg-gradient-to-r transition-all duration-300", "group-hover:w-12", category.gradient)} />
                </button>

                {hoveredCategory === category.name && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 animate-scale-in">
                    <div className="bg-card border border-border rounded-xl shadow-xl p-3 min-w-[160px]">
                      <div className="space-y-1">
                        {category.subcategories.map((sub, i) => (
                          <button key={sub} onClick={(e) => handleSubcategoryClick(category.name, sub, e)} className={cn("w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200", "hover:bg-muted hover:scale-[1.02] hover:translate-x-1", "text-muted-foreground hover:text-foreground")} style={{ animationDelay: `${i * 50}ms` }}>
                            {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="opacity-0" />
        </ScrollArea>
      </div>
    </section>
  );
}
