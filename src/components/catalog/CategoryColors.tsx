import { 
  Shirt, 
  Smartphone, 
  UtensilsCrossed, 
  Sparkles, 
  Home, 
  Dumbbell, 
  Palette, 
  Briefcase,
  Grid3X3
} from "lucide-react";

export interface CategoryConfig {
  name: string;
  icon: any;
  color: string;
  gradient: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  shadowClass: string;
  subcategories: string[];
  emoji: string;
  floatingEmojis: string[];
}

export const categoryConfigs: Record<string, CategoryConfig> = {
  "Tous": {
    name: "Tous",
    icon: Grid3X3,
    color: "primary",
    gradient: "from-primary to-primary/70",
    bgClass: "bg-primary/10",
    textClass: "text-primary",
    borderClass: "border-primary/30",
    shadowClass: "shadow-primary/20",
    subcategories: [],
    emoji: "🌍",
    floatingEmojis: ["🌍", "✨", "🎉"],
  },
  "Mode & Vêtements": {
    name: "Mode & Vêtements",
    icon: Shirt,
    color: "rose",
    gradient: "from-rose-500 to-pink-500",
    bgClass: "bg-rose-500/10",
    textClass: "text-rose-500",
    borderClass: "border-rose-500/30",
    shadowClass: "shadow-rose-500/20",
    subcategories: ["Robes", "Chemises", "Pantalons", "Chaussures", "Accessoires", "Sacs"],
    emoji: "👗",
    floatingEmojis: ["👗", "👠", "👜", "💍", "🧥"],
  },
  "Électronique": {
    name: "Électronique",
    icon: Smartphone,
    color: "blue",
    gradient: "from-blue-500 to-indigo-500",
    bgClass: "bg-blue-500/10",
    textClass: "text-blue-500",
    borderClass: "border-blue-500/30",
    shadowClass: "shadow-blue-500/20",
    subcategories: ["Téléphones", "Ordinateurs", "Tablettes", "Accessoires", "Audio", "Gaming"],
    emoji: "📱",
    floatingEmojis: ["📱", "💻", "🎧", "⌚", "🖥️"],
  },
  "Alimentation": {
    name: "Alimentation",
    icon: UtensilsCrossed,
    color: "green",
    gradient: "from-emerald-500 to-green-500",
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-500",
    borderClass: "border-emerald-500/30",
    shadowClass: "shadow-emerald-500/20",
    subcategories: ["Épices", "Céréales", "Boissons", "Snacks", "Huiles", "Fruits secs"],
    emoji: "🍲",
    floatingEmojis: ["🍲", "🌶️", "🥘", "🍌", "☕"],
  },
  "Beauté & Santé": {
    name: "Beauté & Santé",
    icon: Sparkles,
    color: "purple",
    gradient: "from-purple-500 to-violet-500",
    bgClass: "bg-purple-500/10",
    textClass: "text-purple-500",
    borderClass: "border-purple-500/30",
    shadowClass: "shadow-purple-500/20",
    subcategories: ["Soins peau", "Cheveux", "Maquillage", "Parfums", "Naturel", "Bien-être"],
    emoji: "💄",
    floatingEmojis: ["💄", "💅", "🧴", "✨", "🌸"],
  },
  "Maison & Jardin": {
    name: "Maison & Jardin",
    icon: Home,
    color: "amber",
    gradient: "from-amber-500 to-yellow-500",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-500",
    borderClass: "border-amber-500/30",
    shadowClass: "shadow-amber-500/20",
    subcategories: ["Décoration", "Meubles", "Cuisine", "Jardin", "Literie", "Rangement"],
    emoji: "🏠",
    floatingEmojis: ["🏠", "🪴", "🛋️", "🕯️", "🖼️"],
  },
  "Sport & Loisirs": {
    name: "Sport & Loisirs",
    icon: Dumbbell,
    color: "orange",
    gradient: "from-orange-500 to-red-500",
    bgClass: "bg-orange-500/10",
    textClass: "text-orange-500",
    borderClass: "border-orange-500/30",
    shadowClass: "shadow-orange-500/20",
    subcategories: ["Fitness", "Football", "Natation", "Yoga", "Camping", "Vélo"],
    emoji: "⚽",
    floatingEmojis: ["⚽", "🏃", "💪", "🚴", "🏊"],
  },
  "Art & Artisanat": {
    name: "Art & Artisanat",
    icon: Palette,
    color: "teal",
    gradient: "from-teal-500 to-cyan-500",
    bgClass: "bg-teal-500/10",
    textClass: "text-teal-500",
    borderClass: "border-teal-500/30",
    shadowClass: "shadow-teal-500/20",
    subcategories: ["Sculptures", "Tableaux", "Tissage", "Poterie", "Bijoux", "Masques"],
    emoji: "🎨",
    floatingEmojis: ["🎨", "🖌️", "🏺", "🪘", "🎭"],
  },
  "Services": {
    name: "Services",
    icon: Briefcase,
    color: "slate",
    gradient: "from-slate-500 to-gray-500",
    bgClass: "bg-slate-500/10",
    textClass: "text-slate-500",
    borderClass: "border-slate-500/30",
    shadowClass: "shadow-slate-500/20",
    subcategories: ["Coiffure", "Couture", "Réparation", "Livraison", "Formation", "Consulting"],
    emoji: "💼",
    floatingEmojis: ["💼", "✂️", "🧵", "📦", "📚"],
  },
};

export const getCategoryConfig = (categoryName: string): CategoryConfig => {
  return categoryConfigs[categoryName] || categoryConfigs["Tous"];
};

export const allCategories = Object.keys(categoryConfigs);
