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
import { cn } from "@/lib/utils";

const categories = [
  { 
    name: "Mode", 
    icon: Shirt, 
    gradient: "from-pink-500 to-rose-600",
    bgGlow: "bg-pink-500/20",
    shadowColor: "shadow-pink-500/30",
    emoji: "👗",
    animation: "hover:animate-wiggle"
  },
  { 
    name: "Électronique", 
    icon: Smartphone, 
    gradient: "from-blue-500 to-cyan-600",
    bgGlow: "bg-blue-500/20",
    shadowColor: "shadow-blue-500/30",
    emoji: "📱",
    animation: "hover:animate-bounce-soft"
  },
  { 
    name: "Alimentation", 
    icon: UtensilsCrossed, 
    gradient: "from-orange-500 to-amber-600",
    bgGlow: "bg-orange-500/20",
    shadowColor: "shadow-orange-500/30",
    emoji: "🍲",
    animation: "hover:animate-jelly"
  },
  { 
    name: "Beauté", 
    icon: Sparkles, 
    gradient: "from-purple-500 to-fuchsia-600",
    bgGlow: "bg-purple-500/20",
    shadowColor: "shadow-purple-500/30",
    emoji: "✨",
    animation: "hover:animate-pulse-heart"
  },
  { 
    name: "Maison", 
    icon: Home, 
    gradient: "from-green-500 to-emerald-600",
    bgGlow: "bg-green-500/20",
    shadowColor: "shadow-green-500/30",
    emoji: "🏠",
    animation: "hover:animate-rubber-band"
  },
  { 
    name: "Auto-Moto", 
    icon: Car, 
    gradient: "from-slate-500 to-zinc-600",
    bgGlow: "bg-slate-500/20",
    shadowColor: "shadow-slate-500/30",
    emoji: "🚗",
    animation: "hover:animate-shake"
  },
  { 
    name: "Sport", 
    icon: Dumbbell, 
    gradient: "from-red-500 to-orange-600",
    bgGlow: "bg-red-500/20",
    shadowColor: "shadow-red-500/30",
    emoji: "💪",
    animation: "hover:animate-pop"
  },
  { 
    name: "Livres", 
    icon: BookOpen, 
    gradient: "from-amber-500 to-yellow-600",
    bgGlow: "bg-amber-500/20",
    shadowColor: "shadow-amber-500/30",
    emoji: "📚",
    animation: "hover:animate-swing"
  },
  { 
    name: "Bijoux", 
    icon: Gem, 
    gradient: "from-cyan-500 to-teal-600",
    bgGlow: "bg-cyan-500/20",
    shadowColor: "shadow-cyan-500/30",
    emoji: "💎",
    animation: "hover:animate-pulse-glow"
  },
  { 
    name: "Autres", 
    icon: MoreHorizontal, 
    gradient: "from-gray-500 to-slate-600",
    bgGlow: "bg-gray-500/20",
    shadowColor: "shadow-gray-500/30",
    emoji: "🎁",
    animation: "hover:animate-wiggle"
  },
];

export function CategoryNav() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/catalog?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="py-6 bg-gradient-to-b from-muted/50 to-background border-b border-border overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section title */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🌍</span>
          <h2 className="text-lg font-display font-bold text-foreground">
            Explorer les catégories
          </h2>
        </div>
        
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 pb-3">
            {categories.map((category, index) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={cn(
                  "group relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 shrink-0",
                  "hover:scale-110 active:scale-95",
                  "animate-bounce-in",
                  category.animation
                )}
                style={{ animationDelay: '0ms' }} // Tous en même temps
              >
                {/* Glow background on hover */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl -z-10",
                  category.bgGlow
                )} />
                
                {/* Gradient icon container */}
                <div className={cn(
                  "relative p-4 rounded-2xl bg-gradient-to-br shadow-lg transition-all duration-300",
                  "group-hover:shadow-xl group-hover:scale-110",
                  category.gradient,
                  category.shadowColor
                )}>
                  {/* Floating emoji */}
                  <span className="absolute -top-2 -right-2 text-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125 animate-float">
                    {category.emoji}
                  </span>
                  
                  <category.icon className="h-6 w-6 text-white drop-shadow-md" />
                  
                  {/* Inner shine effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/20 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Category name */}
                <span className={cn(
                  "text-sm font-semibold text-muted-foreground transition-all duration-300",
                  "group-hover:text-foreground group-hover:font-bold group-hover:tracking-wide"
                )}>
                  {category.name}
                </span>
                
                {/* Underline animation */}
                <div className={cn(
                  "absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-0 rounded-full bg-gradient-to-r transition-all duration-300",
                  "group-hover:w-12",
                  category.gradient
                )} />
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="opacity-0" />
        </ScrollArea>
      </div>
    </section>
  );
}
