import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Sun, Moon, Cloud, Zap, Heart, Snowflake, Flame, Droplets, Wind, Rainbow, Eye, Film, Palette, Waves, Hexagon, Circle, Square, Triangle, Stars, Sunset, Sunrise, CloudRain, Tornado } from "lucide-react";

export interface VisualEffect {
  id: string;
  type: "particles" | "overlay" | "border" | "glow";
  name: string;
  config: Record<string, any>;
}

interface EditorEffectsProps {
  selectedEffect: string | null;
  onSelectEffect: (effectId: string | null) => void;
}

// Basic filter effects
const FILTER_EFFECTS = [
  { 
    id: "none", 
    name: "Original", 
    icon: null,
    preview: "bg-gradient-to-br from-muted to-muted/50",
    css: "",
  },
  { 
    id: "vivid", 
    name: "Vivid", 
    icon: Sun,
    preview: "bg-gradient-to-br from-orange-400/30 to-yellow-400/30",
    css: "saturate(1.4) contrast(1.1)",
  },
  { 
    id: "noir", 
    name: "Noir", 
    icon: Moon,
    preview: "bg-gradient-to-br from-gray-800/40 to-black/40",
    css: "grayscale(1) contrast(1.2)",
  },
  { 
    id: "vintage", 
    name: "Vintage", 
    icon: Film,
    preview: "bg-gradient-to-br from-amber-600/30 to-orange-800/30",
    css: "sepia(0.4) saturate(1.2) contrast(1.05)",
  },
  { 
    id: "warm", 
    name: "Warm", 
    icon: Sunrise,
    preview: "bg-gradient-to-br from-orange-300/30 to-red-400/30",
    css: "sepia(0.2) saturate(1.3) hue-rotate(-10deg)",
  },
  { 
    id: "cool", 
    name: "Cool", 
    icon: Snowflake,
    preview: "bg-gradient-to-br from-blue-300/30 to-cyan-400/30",
    css: "saturate(0.9) hue-rotate(15deg) brightness(1.05)",
  },
];

// TikTok-style visual effects
const TIKTOK_EFFECTS = [
  { 
    id: "sparkle", 
    name: "Étincelles", 
    icon: Sparkles,
    preview: "bg-gradient-to-br from-purple-500/30 to-pink-500/30",
    css: "drop-shadow(0 0 10px rgba(168, 85, 247, 0.5)) saturate(1.2)",
  },
  { 
    id: "neon-pink", 
    name: "Néon Rose", 
    icon: Zap,
    preview: "bg-gradient-to-br from-pink-500/40 to-purple-500/30",
    css: "drop-shadow(0 0 20px rgba(236, 72, 153, 0.7)) saturate(1.4) contrast(1.1)",
  },
  { 
    id: "neon-blue", 
    name: "Néon Bleu", 
    icon: Zap,
    preview: "bg-gradient-to-br from-cyan-400/40 to-blue-500/30",
    css: "drop-shadow(0 0 20px rgba(6, 182, 212, 0.7)) saturate(1.3)",
  },
  { 
    id: "neon-green", 
    name: "Néon Vert", 
    icon: Zap,
    preview: "bg-gradient-to-br from-green-400/40 to-emerald-500/30",
    css: "drop-shadow(0 0 20px rgba(34, 197, 94, 0.7)) saturate(1.3)",
  },
  { 
    id: "dreamy", 
    name: "Rêveur", 
    icon: Cloud,
    preview: "bg-gradient-to-br from-pink-300/30 to-purple-400/30",
    css: "blur(0.5px) brightness(1.15) saturate(0.9) drop-shadow(0 0 15px rgba(236, 72, 153, 0.3))",
  },
  { 
    id: "glitch", 
    name: "Glitch", 
    icon: Hexagon,
    preview: "bg-gradient-to-br from-red-500/30 via-transparent to-cyan-500/30",
    css: "hue-rotate(90deg) saturate(1.5) contrast(1.2)",
  },
  { 
    id: "vhs", 
    name: "VHS", 
    icon: Film,
    preview: "bg-gradient-to-br from-purple-900/40 to-pink-900/30",
    css: "contrast(1.3) saturate(1.5) brightness(0.9) sepia(0.2)",
  },
  { 
    id: "golden-hour", 
    name: "Golden Hour", 
    icon: Sunset,
    preview: "bg-gradient-to-br from-amber-400/40 to-orange-500/30",
    css: "sepia(0.3) saturate(1.4) brightness(1.1) drop-shadow(0 0 15px rgba(251, 191, 36, 0.4))",
  },
  { 
    id: "blue-hour", 
    name: "Blue Hour", 
    icon: Moon,
    preview: "bg-gradient-to-br from-indigo-600/40 to-blue-900/40",
    css: "brightness(0.9) saturate(1.2) hue-rotate(20deg) contrast(1.1)",
  },
  { 
    id: "love", 
    name: "Amour", 
    icon: Heart,
    preview: "bg-gradient-to-br from-rose-400/40 to-red-500/30",
    css: "saturate(1.3) drop-shadow(0 0 12px rgba(244, 63, 94, 0.4)) contrast(1.05)",
  },
  { 
    id: "cosmic", 
    name: "Cosmique", 
    icon: Stars,
    preview: "bg-gradient-to-br from-violet-600/40 to-indigo-800/40",
    css: "contrast(1.2) saturate(1.3) hue-rotate(-15deg) drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))",
  },
  { 
    id: "fire", 
    name: "Feu", 
    icon: Flame,
    preview: "bg-gradient-to-br from-orange-500/50 to-red-600/40",
    css: "saturate(1.5) contrast(1.2) drop-shadow(0 0 15px rgba(234, 88, 12, 0.6)) sepia(0.1)",
  },
];

// African-themed effects
const AFRICAN_EFFECTS = [
  { 
    id: "savanna", 
    name: "Savane", 
    icon: Sun,
    preview: "bg-gradient-to-br from-amber-500/40 to-orange-600/30",
    css: "sepia(0.35) saturate(1.3) brightness(1.05) drop-shadow(0 0 10px rgba(217, 119, 6, 0.3))",
  },
  { 
    id: "kente", 
    name: "Kente", 
    icon: Palette,
    preview: "bg-gradient-to-r from-yellow-500/30 via-green-500/30 via-red-500/30 to-black/30",
    css: "saturate(1.6) contrast(1.15)",
  },
  { 
    id: "sunset-africa", 
    name: "Coucher Africain", 
    icon: Sunset,
    preview: "bg-gradient-to-br from-orange-500/50 via-red-500/40 to-purple-600/30",
    css: "saturate(1.4) contrast(1.1) sepia(0.2) drop-shadow(0 0 20px rgba(234, 88, 12, 0.4))",
  },
  { 
    id: "tropical", 
    name: "Tropical", 
    icon: Waves,
    preview: "bg-gradient-to-br from-green-400/40 to-teal-500/30",
    css: "saturate(1.4) brightness(1.1) hue-rotate(-15deg)",
  },
  { 
    id: "desert", 
    name: "Désert", 
    icon: Sun,
    preview: "bg-gradient-to-br from-yellow-600/40 to-amber-700/30",
    css: "sepia(0.4) saturate(1.1) brightness(1.1) contrast(1.05)",
  },
  { 
    id: "jungle", 
    name: "Jungle", 
    icon: Palette,
    preview: "bg-gradient-to-br from-green-600/40 to-emerald-800/30",
    css: "saturate(1.3) contrast(1.1) hue-rotate(10deg) brightness(0.95)",
  },
];

// Overlay/Texture effects
const OVERLAY_EFFECTS = [
  { 
    id: "rain", 
    name: "Pluie", 
    icon: CloudRain,
    preview: "bg-gradient-to-b from-blue-400/20 via-transparent to-blue-600/20",
    css: "brightness(0.95) contrast(1.05) saturate(0.9)",
  },
  { 
    id: "dust", 
    name: "Poussière", 
    icon: Wind,
    preview: "bg-gradient-to-br from-amber-300/20 to-orange-400/20",
    css: "sepia(0.15) brightness(1.05) contrast(0.95)",
  },
  { 
    id: "rainbow", 
    name: "Arc-en-ciel", 
    icon: Rainbow,
    preview: "bg-gradient-to-r from-red-400/20 via-yellow-400/20 via-green-400/20 via-blue-400/20 to-purple-400/20",
    css: "saturate(1.5) contrast(1.05) brightness(1.05)",
  },
  { 
    id: "prism", 
    name: "Prisme", 
    icon: Triangle,
    preview: "bg-gradient-to-tr from-pink-500/30 via-purple-500/20 to-cyan-500/30",
    css: "saturate(1.4) contrast(1.1) drop-shadow(0 0 10px rgba(168, 85, 247, 0.3))",
  },
  { 
    id: "storm", 
    name: "Tempête", 
    icon: Tornado,
    preview: "bg-gradient-to-br from-slate-600/40 to-gray-800/40",
    css: "brightness(0.85) contrast(1.3) saturate(0.8)",
  },
  { 
    id: "soft-focus", 
    name: "Flou Doux", 
    icon: Circle,
    preview: "bg-gradient-to-br from-white/20 to-gray-200/20",
    css: "blur(0.8px) brightness(1.1) contrast(0.95)",
  },
];

const ALL_EFFECTS = [
  ...FILTER_EFFECTS,
  ...TIKTOK_EFFECTS,
  ...AFRICAN_EFFECTS,
  ...OVERLAY_EFFECTS,
];

const EditorEffects = ({ selectedEffect, onSelectEffect }: EditorEffectsProps) => {
  const renderEffectGrid = (effects: typeof FILTER_EFFECTS) => (
    <div className="grid grid-cols-3 gap-2">
      {effects.map((effect, i) => {
        const IconComponent = effect.icon;
        const isSelected = selectedEffect === effect.id || (selectedEffect === null && effect.id === "none");
        
        return (
          <button
            key={effect.id}
            onClick={() => onSelectEffect(effect.id === "none" ? null : effect.id)}
            className={`relative aspect-square rounded-xl border-2 overflow-hidden transition-all duration-300 group ${
              isSelected
                ? "border-primary ring-2 ring-primary/30 scale-[1.02]"
                : "border-border hover:border-primary/50 hover:scale-105"
            }`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {/* Preview Background */}
            <div className={`absolute inset-0 ${effect.preview}`} />
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-1">
              {IconComponent && (
                <IconComponent 
                  className={`w-5 h-5 transition-all duration-300 ${
                    isSelected ? "text-primary scale-110" : "text-foreground group-hover:scale-125"
                  }`}
                />
              )}
              <span className={`text-[10px] font-medium text-center leading-tight transition-colors duration-300 ${
                isSelected ? "text-primary" : "text-foreground"
              }`}>
                {effect.name}
              </span>
            </div>

            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center animate-bounce-in">
                <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-muted-foreground">
        Ajoutez des effets visuels TikTok-style 🎬
      </p>

      <Tabs defaultValue="tiktok" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="tiktok" className="text-[10px]">
            <Sparkles className="w-3 h-3 mr-1" />
            TikTok
          </TabsTrigger>
          <TabsTrigger value="african" className="text-[10px]">
            <Sun className="w-3 h-3 mr-1" />
            Africain
          </TabsTrigger>
          <TabsTrigger value="filters" className="text-[10px]">
            <Eye className="w-3 h-3 mr-1" />
            Filtres
          </TabsTrigger>
          <TabsTrigger value="overlay" className="text-[10px]">
            <Droplets className="w-3 h-3 mr-1" />
            Overlay
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tiktok" className="mt-4">
          <ScrollArea className="h-[260px] pr-2">
            {renderEffectGrid(TIKTOK_EFFECTS)}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="african" className="mt-4">
          <p className="text-xs text-muted-foreground mb-3">Effets inspirés de l'Afrique 🌍</p>
          <ScrollArea className="h-[240px] pr-2">
            {renderEffectGrid(AFRICAN_EFFECTS)}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="filters" className="mt-4">
          <ScrollArea className="h-[260px] pr-2">
            {renderEffectGrid(FILTER_EFFECTS)}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="overlay" className="mt-4">
          <p className="text-xs text-muted-foreground mb-3">Effets atmosphériques</p>
          <ScrollArea className="h-[240px] pr-2">
            {renderEffectGrid(OVERLAY_EFFECTS)}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export const getEffectCSS = (effectId: string | null): string => {
  const effect = ALL_EFFECTS.find(e => e.id === effectId);
  return effect?.css || "";
};

export default EditorEffects;
