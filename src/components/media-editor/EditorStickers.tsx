import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Smile, Heart, Star, Flame, Sparkles, Gift, Crown, Music2, Camera, Zap, ThumbsUp, PartyPopper, Rocket, Bomb, Coffee, Pizza, Trophy, Target, Clock, MapPin } from "lucide-react";

export interface Sticker {
  id: string;
  type: "emoji" | "icon" | "gif";
  content: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface EditorStickersProps {
  onAddSticker: (sticker: Omit<Sticker, "id" | "x" | "y" | "scale" | "rotation">) => void;
}

const EMOJI_CATEGORIES = {
  popular: ["🔥", "❤️", "😍", "🎉", "✨", "💯", "🚀", "💪", "🙌", "👏", "💫", "⭐", "🌟", "💎", "🎯", "💥", "🏆", "👑", "💰", "🛒"],
  faces: ["😀", "😂", "🥰", "😎", "🤩", "😇", "🥳", "😋", "🤤", "😜", "🤗", "🤔", "🙄", "😴", "🥱"],
  gestures: ["👍", "👎", "✌️", "🤞", "🤟", "🤙", "👋", "🙏", "💪", "👊", "✊", "🤝", "👏"],
  objects: ["📱", "💻", "🎁", "🎈", "🎊", "🎂", "🍕", "☕", "🍰", "🎵", "📸", "💡", "⚡", "🔔"],
  symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💕", "💖", "💗", "💘", "💝", "✅", "❌"],
  african: ["🌍", "🦁", "🐘", "🦒", "🦓", "🌴", "☀️", "🥭", "🍍", "🥥", "🪘", "🎭", "🏺", "🧺", "✊🏿", "✊🏾", "✊🏽"],
};

const ICON_STICKERS = [
  { icon: Heart, label: "Cœur", color: "#ef4444" },
  { icon: Star, label: "Étoile", color: "#eab308" },
  { icon: Flame, label: "Feu", color: "#f97316" },
  { icon: Sparkles, label: "Étincelles", color: "#a855f7" },
  { icon: Gift, label: "Cadeau", color: "#22c55e" },
  { icon: Crown, label: "Couronne", color: "#eab308" },
  { icon: Music2, label: "Musique", color: "#ec4899" },
  { icon: Camera, label: "Photo", color: "#06b6d4" },
  { icon: Zap, label: "Éclair", color: "#eab308" },
  { icon: ThumbsUp, label: "Pouce", color: "#3b82f6" },
  { icon: PartyPopper, label: "Fête", color: "#f97316" },
  { icon: Rocket, label: "Fusée", color: "#8b5cf6" },
  { icon: Coffee, label: "Café", color: "#92400e" },
  { icon: Pizza, label: "Pizza", color: "#f97316" },
  { icon: Trophy, label: "Trophée", color: "#eab308" },
  { icon: Target, label: "Cible", color: "#ef4444" },
  { icon: Clock, label: "Temps", color: "#6366f1" },
  { icon: MapPin, label: "Lieu", color: "#ef4444" },
];

const EditorStickers = ({ onAddSticker }: EditorStickersProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof EMOJI_CATEGORIES>("popular");

  const filteredEmojis = searchQuery
    ? Object.values(EMOJI_CATEGORIES).flat().filter(emoji => emoji.includes(searchQuery))
    : EMOJI_CATEGORIES[selectedCategory];

  const handleEmojiClick = (emoji: string) => {
    onAddSticker({ type: "emoji", content: emoji });
  };

  const handleIconClick = (iconName: string, color: string) => {
    onAddSticker({ type: "icon", content: `${iconName}:${color}` });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="emoji" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="emoji" className="text-xs">
            <Smile className="w-4 h-4 mr-1" />
            Emojis
          </TabsTrigger>
          <TabsTrigger value="icons" className="text-xs">
            <Sparkles className="w-4 h-4 mr-1" />
            Icônes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emoji" className="mt-4 space-y-3">
          {/* Category Pills */}
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {(Object.keys(EMOJI_CATEGORIES) as Array<keyof typeof EMOJI_CATEGORIES>).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground scale-105"
                      : "bg-muted hover:bg-muted/80 hover:scale-105"
                  }`}
                >
                  {cat === "popular" && "🔥 Populaire"}
                  {cat === "faces" && "😀 Visages"}
                  {cat === "gestures" && "👋 Gestes"}
                  {cat === "objects" && "🎁 Objets"}
                  {cat === "symbols" && "❤️ Symboles"}
                  {cat === "african" && "🌍 Africain"}
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* Emoji Grid */}
          <div className="grid grid-cols-6 gap-2">
            {filteredEmojis.map((emoji, i) => (
              <button
                key={`${emoji}-${i}`}
                onClick={() => handleEmojiClick(emoji)}
                className="aspect-square flex items-center justify-center text-2xl rounded-xl hover:bg-muted transition-all duration-200 hover:scale-125 active:scale-95"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="icons" className="mt-4">
          <div className="grid grid-cols-4 gap-3">
            {ICON_STICKERS.map((item, i) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => handleIconClick(item.label, item.color)}
                  className="aspect-square flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-110 active:scale-95 group"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <IconComponent 
                    className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" 
                    style={{ color: item.color }} 
                  />
                  <span className="text-[10px] text-muted-foreground">{item.label}</span>
                </button>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditorStickers;
