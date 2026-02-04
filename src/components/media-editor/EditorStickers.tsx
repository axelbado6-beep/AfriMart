import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Smile, Heart, Star, Flame, Sparkles, Gift, Crown, Music2, Camera, Zap, ThumbsUp, PartyPopper, Rocket, Coffee, Pizza, Trophy, Target, Clock, MapPin, Globe, Shirt, ShoppingBag, Gem, Palette, Utensils } from "lucide-react";

export interface Sticker {
  id: string;
  type: "emoji" | "icon" | "gif" | "text-badge";
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
  popular: ["🔥", "❤️", "😍", "🎉", "✨", "💯", "🚀", "💪", "🙌", "👏", "💫", "⭐", "🌟", "💎", "🎯", "💥", "🏆", "👑", "💰", "🛒", "🎁", "💖", "🥳", "🤩"],
  african: [
    // Africa & Countries
    "🌍", "🇨🇮", "🇸🇳", "🇬🇭", "🇳🇬", "🇨🇲", "🇲🇱", "🇧🇫", "🇹🇬", "🇧🇯",
    // Animals
    "🦁", "🐘", "🦒", "🦓", "🦍", "🦛", "🐆", "🦏", "🐃", "🦅", "🦜", "🐊",
    // Nature
    "🌴", "🌺", "🌻", "🌵", "🥭", "🍍", "🥥", "🍌", "🌶️", "🥜",
    // Culture
    "🪘", "🎭", "🏺", "🧺", "🪬", "📿", "🎨", "🖼️",
    // Hands
    "✊🏿", "✊🏾", "✊🏽", "🤝🏾", "👏🏾", "🙏🏾", "💪🏾", "👍🏾", "🙌🏾", "👋🏾",
    // Food
    "🍲", "🥘", "🫕", "🍛", "🥗", "🧆", "🥙", "🌯",
  ],
  fashion: ["👗", "👠", "👜", "💄", "💅", "👒", "🧣", "👔", "👕", "👖", "🥻", "👘", "🎀", "💍", "⌚", "👓", "🕶️", "💎", "📿", "🧢"],
  food: ["🍕", "🍔", "🍟", "🍗", "🥘", "🍲", "🥗", "🌮", "🌯", "🥙", "🧆", "🍛", "🍜", "🍝", "🍣", "🍱", "🥟", "🍰", "🧁", "🍩", "🍪", "☕", "🧃", "🥤"],
  money: ["💰", "💵", "💴", "💶", "💷", "💸", "🪙", "💳", "🏦", "📈", "📊", "💹", "🛒", "🛍️", "🏷️", "🎟️", "🎫", "💲", "🤑", "💱"],
  celebration: ["🎉", "🎊", "🥳", "🎈", "🎂", "🎁", "🎀", "🎆", "🎇", "🧨", "✨", "💫", "🌟", "⭐", "🏆", "🥇", "🥈", "🥉", "🎖️", "🏅"],
  faces: ["😀", "😂", "🥰", "😎", "🤩", "😇", "🥳", "😋", "🤤", "😜", "🤗", "🤔", "🙄", "😴", "🥱", "😏", "🤭", "🤫", "😈", "👻"],
  gestures: ["👍", "👎", "✌️", "🤞", "🤟", "🤙", "👋", "🙏", "💪", "👊", "✊", "🤝", "👏", "🤲", "🙌", "👐", "✋", "🖐️", "🤚", "👆"],
  symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💕", "💖", "💗", "💘", "💝", "✅", "❌", "⭕", "💢", "💯", "🔥", "⚡"],
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
  { icon: Globe, label: "Afrique", color: "#22c55e" },
  { icon: Shirt, label: "Mode", color: "#ec4899" },
  { icon: ShoppingBag, label: "Shop", color: "#f97316" },
  { icon: Gem, label: "Premium", color: "#8b5cf6" },
  { icon: Palette, label: "Art", color: "#06b6d4" },
  { icon: Utensils, label: "Food", color: "#22c55e" },
];

// TikTok-style text badges
const TEXT_BADGES = [
  { text: "NOUVEAU", bg: "from-red-500 to-pink-500", emoji: "🆕" },
  { text: "PROMO", bg: "from-orange-500 to-amber-500", emoji: "🔥" },
  { text: "-50%", bg: "from-green-500 to-emerald-500", emoji: "💰" },
  { text: "BEST SELLER", bg: "from-purple-500 to-pink-500", emoji: "👑" },
  { text: "TOP QUALITÉ", bg: "from-blue-500 to-cyan-500", emoji: "⭐" },
  { text: "LIVRAISON GRATUITE", bg: "from-green-500 to-teal-500", emoji: "🚚" },
  { text: "MADE IN AFRICA", bg: "from-amber-500 to-orange-500", emoji: "🌍" },
  { text: "100% NATUREL", bg: "from-green-600 to-lime-500", emoji: "🌿" },
  { text: "EXCLUSIF", bg: "from-violet-500 to-purple-500", emoji: "💎" },
  { text: "ÉDITION LIMITÉE", bg: "from-rose-500 to-red-500", emoji: "🎁" },
  { text: "DISPONIBLE", bg: "from-emerald-500 to-green-500", emoji: "✅" },
  { text: "COUP DE CŒUR", bg: "from-pink-500 to-rose-500", emoji: "❤️" },
  { text: "SWIPE UP", bg: "from-blue-500 to-indigo-500", emoji: "👆" },
  { text: "LIEN EN BIO", bg: "from-indigo-500 to-violet-500", emoji: "🔗" },
  { text: "DM POUR COMMANDE", bg: "from-cyan-500 to-blue-500", emoji: "📩" },
  { text: "WHATSAPP", bg: "from-green-500 to-emerald-600", emoji: "📱" },
];

// Animated stickers (GIF-like effects)
const ANIMATED_STICKERS = [
  { id: "shine", emoji: "✨", label: "Brillance", animation: "animate-pulse-slow" },
  { id: "fire", emoji: "🔥", label: "Feu", animation: "animate-bounce-soft" },
  { id: "money", emoji: "💸", label: "Money", animation: "animate-float" },
  { id: "heart", emoji: "💖", label: "Love", animation: "animate-pulse" },
  { id: "star", emoji: "⭐", label: "Star", animation: "animate-spin-slow" },
  { id: "rocket", emoji: "🚀", label: "Go!", animation: "animate-bounce" },
  { id: "party", emoji: "🎉", label: "Party", animation: "animate-wiggle" },
  { id: "crown", emoji: "👑", label: "King", animation: "animate-float" },
  { id: "gem", emoji: "💎", label: "Premium", animation: "animate-shimmer" },
  { id: "lightning", emoji: "⚡", label: "Flash", animation: "animate-pulse" },
  { id: "africa", emoji: "🌍", label: "Africa", animation: "animate-spin-slow" },
  { id: "lion", emoji: "🦁", label: "Lion", animation: "animate-bounce-soft" },
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

  const handleBadgeClick = (badge: typeof TEXT_BADGES[0]) => {
    onAddSticker({ type: "text-badge", content: JSON.stringify(badge) });
  };

  const handleAnimatedClick = (sticker: typeof ANIMATED_STICKERS[0]) => {
    onAddSticker({ type: "gif", content: JSON.stringify(sticker) });
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
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="emoji" className="text-xs">
            <Smile className="w-3 h-3 mr-1" />
            Emojis
          </TabsTrigger>
          <TabsTrigger value="badges" className="text-xs">
            <ShoppingBag className="w-3 h-3 mr-1" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="animated" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Animés
          </TabsTrigger>
          <TabsTrigger value="icons" className="text-xs">
            <Star className="w-3 h-3 mr-1" />
            Icônes
          </TabsTrigger>
        </TabsList>

        {/* Emojis Tab */}
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
                      ? "bg-gradient-to-r from-afrimart-orange to-afrimart-gold text-white scale-105 shadow-lg"
                      : "bg-muted hover:bg-muted/80 hover:scale-105"
                  }`}
                >
                  {cat === "popular" && "🔥 Populaire"}
                  {cat === "african" && "🌍 Africain"}
                  {cat === "fashion" && "👗 Mode"}
                  {cat === "food" && "🍲 Food"}
                  {cat === "money" && "💰 Business"}
                  {cat === "celebration" && "🎉 Fête"}
                  {cat === "faces" && "😀 Visages"}
                  {cat === "gestures" && "👋 Gestes"}
                  {cat === "symbols" && "❤️ Symboles"}
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* Emoji Grid */}
          <ScrollArea className="h-[200px]">
            <div className="grid grid-cols-7 gap-1">
              {filteredEmojis.map((emoji, i) => (
                <button
                  key={`${emoji}-${i}`}
                  onClick={() => handleEmojiClick(emoji)}
                  className="aspect-square flex items-center justify-center text-2xl rounded-xl hover:bg-gradient-to-br hover:from-afrimart-orange/20 hover:to-afrimart-gold/20 transition-all duration-200 hover:scale-125 active:scale-95"
                  style={{ animationDelay: `${i * 20}ms` }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Text Badges Tab (TikTok-style) */}
        <TabsContent value="badges" className="mt-4">
          <p className="text-xs text-muted-foreground mb-3">Badges style TikTok/Instagram pour vos promotions</p>
          <ScrollArea className="h-[220px]">
            <div className="grid grid-cols-2 gap-2">
              {TEXT_BADGES.map((badge, i) => (
                <button
                  key={badge.text}
                  onClick={() => handleBadgeClick(badge)}
                  className="relative p-3 rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${badge.bg} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className="relative flex items-center gap-2">
                    <span className="text-lg">{badge.emoji}</span>
                    <span className={`text-xs font-bold bg-gradient-to-r ${badge.bg} bg-clip-text text-transparent`}>
                      {badge.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Animated Stickers Tab */}
        <TabsContent value="animated" className="mt-4">
          <p className="text-xs text-muted-foreground mb-3">Stickers animés pour plus d'impact</p>
          <div className="grid grid-cols-4 gap-3">
            {ANIMATED_STICKERS.map((sticker, i) => (
              <button
                key={sticker.id}
                onClick={() => handleAnimatedClick(sticker)}
                className="aspect-square flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-110 active:scale-95 group"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className={`text-3xl ${sticker.animation}`}>
                  {sticker.emoji}
                </span>
                <span className="text-[9px] text-muted-foreground">{sticker.label}</span>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* Icons Tab */}
        <TabsContent value="icons" className="mt-4">
          <ScrollArea className="h-[220px]">
            <div className="grid grid-cols-4 gap-3">
              {ICON_STICKERS.map((item, i) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => handleIconClick(item.label, item.color)}
                    className="aspect-square flex flex-col items-center justify-center gap-1 p-2 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-110 active:scale-95 group"
                    style={{ animationDelay: `${i * 30}ms` }}
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
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditorStickers;
