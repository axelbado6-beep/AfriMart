import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Sun, Moon, Cloud, Zap, Heart, Stars, Snowflake, Flame, Droplets, Wind, Rainbow } from "lucide-react";

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

const EFFECTS = [
  { 
    id: "none", 
    name: "Aucun", 
    icon: null,
    preview: "bg-gradient-to-br from-muted to-muted/50",
    css: "",
  },
  { 
    id: "sparkle", 
    name: "Étincelles", 
    icon: Sparkles,
    preview: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
    css: "drop-shadow(0 0 10px rgba(168, 85, 247, 0.4))",
  },
  { 
    id: "golden", 
    name: "Doré", 
    icon: Sun,
    preview: "bg-gradient-to-br from-amber-400/30 to-orange-500/20",
    css: "sepia(0.3) saturate(1.5)",
  },
  { 
    id: "neon", 
    name: "Néon", 
    icon: Zap,
    preview: "bg-gradient-to-br from-cyan-400/30 to-blue-500/30",
    css: "drop-shadow(0 0 15px rgba(6, 182, 212, 0.6)) saturate(1.3)",
  },
  { 
    id: "dreamy", 
    name: "Rêveur", 
    icon: Cloud,
    preview: "bg-gradient-to-br from-pink-300/30 to-purple-400/20",
    css: "blur(0.5px) brightness(1.1) saturate(0.9)",
  },
  { 
    id: "night", 
    name: "Nuit", 
    icon: Moon,
    preview: "bg-gradient-to-br from-indigo-900/30 to-purple-900/30",
    css: "brightness(0.9) saturate(0.8) hue-rotate(20deg)",
  },
  { 
    id: "love", 
    name: "Amour", 
    icon: Heart,
    preview: "bg-gradient-to-br from-rose-400/30 to-red-500/20",
    css: "saturate(1.2) drop-shadow(0 0 8px rgba(244, 63, 94, 0.3))",
  },
  { 
    id: "cosmic", 
    name: "Cosmique", 
    icon: Stars,
    preview: "bg-gradient-to-br from-violet-600/30 to-indigo-800/30",
    css: "contrast(1.1) saturate(1.2) hue-rotate(-10deg)",
  },
  { 
    id: "ice", 
    name: "Glacé", 
    icon: Snowflake,
    preview: "bg-gradient-to-br from-cyan-200/40 to-blue-300/30",
    css: "brightness(1.1) saturate(0.7) hue-rotate(180deg)",
  },
  { 
    id: "fire", 
    name: "Feu", 
    icon: Flame,
    preview: "bg-gradient-to-br from-orange-500/40 to-red-600/30",
    css: "saturate(1.4) contrast(1.1) drop-shadow(0 0 10px rgba(234, 88, 12, 0.5))",
  },
  { 
    id: "rain", 
    name: "Pluie", 
    icon: Droplets,
    preview: "bg-gradient-to-br from-blue-400/30 to-slate-500/30",
    css: "brightness(0.95) contrast(1.05) saturate(0.9)",
  },
  { 
    id: "wind", 
    name: "Vent", 
    icon: Wind,
    preview: "bg-gradient-to-br from-teal-300/30 to-cyan-400/20",
    css: "blur(0.3px) brightness(1.05)",
  },
  { 
    id: "rainbow", 
    name: "Arc-en-ciel", 
    icon: Rainbow,
    preview: "bg-gradient-to-r from-red-400/20 via-yellow-400/20 via-green-400/20 via-blue-400/20 to-purple-400/20",
    css: "saturate(1.5) contrast(1.05)",
  },
];

const EditorEffects = ({ selectedEffect, onSelectEffect }: EditorEffectsProps) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-muted-foreground">
        Ajoutez des effets visuels à votre média
      </p>

      <ScrollArea className="h-[300px] pr-2">
        <div className="grid grid-cols-2 gap-3">
          {EFFECTS.map((effect, i) => {
            const IconComponent = effect.icon;
            const isSelected = selectedEffect === effect.id || (selectedEffect === null && effect.id === "none");
            
            return (
              <button
                key={effect.id}
                onClick={() => onSelectEffect(effect.id === "none" ? null : effect.id)}
                className={`relative aspect-[4/3] rounded-xl border-2 overflow-hidden transition-all duration-300 group ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/30 scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:scale-105"
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Preview Background */}
                <div className={`absolute inset-0 ${effect.preview}`} />
                
                {/* Animated overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                  {IconComponent && (
                    <IconComponent 
                      className={`w-6 h-6 transition-all duration-300 ${
                        isSelected ? "text-primary scale-110" : "text-foreground group-hover:scale-125"
                      }`}
                    />
                  )}
                  <span className={`text-xs font-medium transition-colors duration-300 ${
                    isSelected ? "text-primary" : "text-foreground"
                  }`}>
                    {effect.name}
                  </span>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-primary rounded-full flex items-center justify-center animate-bounce-in">
                    <svg className="w-2.5 h-2.5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export const getEffectCSS = (effectId: string | null): string => {
  const effect = EFFECTS.find(e => e.id === effectId);
  return effect?.css || "";
};

export default EditorEffects;
