import { useState, useEffect, useRef } from "react";
import { Search, TrendingUp, Gift, Shirt, Smartphone, Sparkles, Clock, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: string) => void;
  isVisible: boolean;
  onClose: () => void;
}

// Suggestions thématiques basées sur les mots-clés
const suggestionMap: Record<string, string[]> = {
  "cadeau": ["femme", "homme", "enfant", "anniversaire", "mariage", "naissance", "noël", "saint-valentin"],
  "robe": ["soirée", "mariage", "africaine", "wax", "été", "cocktail", "longue", "courte"],
  "chaussure": ["femme", "homme", "enfant", "sport", "élégante", "cuir", "sandale"],
  "sac": ["main", "bandoulière", "voyage", "cuir", "tressé", "africain"],
  "bijou": ["or", "argent", "africain", "perles", "collier", "bracelet", "boucles"],
  "téléphone": ["samsung", "iphone", "accessoires", "coque", "chargeur"],
  "cuisine": ["épices", "ustensiles", "africaine", "traditionnelle"],
  "beauté": ["cheveux", "peau", "maquillage", "naturel", "karité", "coco"],
  "décoration": ["maison", "africaine", "moderne", "traditionnelle", "mur"],
  "vêtement": ["homme", "femme", "enfant", "traditionnel", "moderne", "wax"],
};

// Tendances populaires
const trendingSuggestions = [
  { text: "Robes en wax", icon: TrendingUp, color: "text-afrimart-orange" },
  { text: "Bijoux africains", icon: Sparkles, color: "text-afrimart-gold" },
  { text: "Cadeaux artisanaux", icon: Gift, color: "text-afrimart-green" },
  { text: "Mode traditionnelle", icon: Shirt, color: "text-primary" },
  { text: "Accessoires tech", icon: Smartphone, color: "text-secondary" },
];

// Catégories rapides avec couleurs
const quickCategories = [
  { name: "Mode", emoji: "👗", bg: "bg-pink-500/10 hover:bg-pink-500/20", text: "text-pink-600" },
  { name: "Bijoux", emoji: "💍", bg: "bg-amber-500/10 hover:bg-amber-500/20", text: "text-amber-600" },
  { name: "Beauté", emoji: "✨", bg: "bg-purple-500/10 hover:bg-purple-500/20", text: "text-purple-600" },
  { name: "Maison", emoji: "🏠", bg: "bg-green-500/10 hover:bg-green-500/20", text: "text-green-600" },
  { name: "Tech", emoji: "📱", bg: "bg-blue-500/10 hover:bg-blue-500/20", text: "text-blue-600" },
];

export function SearchSuggestions({ query, onSelect, isVisible, onClose }: SearchSuggestionsProps) {
  const [activeSuggestions, setActiveSuggestions] = useState<string[]>([]);
  const [matchedKeyword, setMatchedKeyword] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trouver les suggestions correspondantes
    const lowerQuery = query.toLowerCase().trim();
    
    for (const [keyword, suggestions] of Object.entries(suggestionMap)) {
      if (lowerQuery.includes(keyword) || keyword.includes(lowerQuery)) {
        setMatchedKeyword(keyword);
        setActiveSuggestions(suggestions);
        return;
      }
    }
    
    setMatchedKeyword("");
    setActiveSuggestions([]);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isVisible) return null;

  const hasQuery = query.trim().length > 0;
  const hasSuggestions = activeSuggestions.length > 0;

  return (
    <div 
      ref={containerRef}
      className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in"
    >
      {/* Suggestions contextuelles basées sur la recherche */}
      {hasQuery && hasSuggestions && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Compléter "<span className="text-foreground font-medium">{matchedKeyword}</span>" avec...
            </span>
          </div>
          
          {/* Cercle de suggestions - apparition simultanée */}
          <div className="flex flex-wrap gap-2 justify-center">
            {activeSuggestions.map((suggestion, index) => {
              const angle = (index / activeSuggestions.length) * 360;
              const hue = (angle + 200) % 360;
              
              return (
                <button
                  key={suggestion}
                  onClick={() => onSelect(`${matchedKeyword} ${suggestion}`)}
                  className="group relative px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:scale-110 active:scale-95 animate-bounce-in"
                  style={{ 
                    animationDelay: '0ms', // Tous en même temps
                    background: `linear-gradient(135deg, hsl(${hue} 70% 95%), hsl(${hue + 30} 70% 90%))`,
                    color: `hsl(${hue} 70% 30%)`,
                  }}
                >
                  <span className="relative z-10">{suggestion}</span>
                  <ArrowUpRight className="inline-block w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Glow effect on hover */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-md -z-10"
                    style={{ background: `hsl(${hue} 70% 60% / 0.4)` }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tendances si pas de recherche spécifique */}
      {!hasSuggestions && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-afrimart-orange animate-pulse-slow" />
            <span className="text-sm font-medium text-foreground">Tendances du moment</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {trendingSuggestions.map((trend, index) => (
              <button
                key={trend.text}
                onClick={() => onSelect(trend.text)}
                className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce-in"
                style={{ animationDelay: '0ms' }} // Tous en même temps
              >
                <trend.icon className={cn("w-4 h-4 transition-transform group-hover:scale-125 group-hover:rotate-12", trend.color)} />
                <span className="text-sm font-medium">{trend.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Catégories rapides */}
      <div className="p-4 bg-muted/30">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Explorer par catégorie</span>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickCategories.map((cat, index) => (
            <button
              key={cat.name}
              onClick={() => onSelect(cat.name)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-300 hover:scale-105 active:scale-95 animate-elastic",
                cat.bg, cat.text
              )}
              style={{ animationDelay: '0ms' }} // Tous en même temps
            >
              <span className="text-lg">{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
