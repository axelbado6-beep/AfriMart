import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Store, ArrowRight, Sparkles, Users, TrendingUp, Star, Heart, Zap, Crown, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import afrimartLogo from "@/assets/afrimart-logo.jpg";

interface UserTypeSelectorProps {
  onSelect: (type: "client" | "business") => void;
}

const UserTypeSelector = ({ onSelect }: UserTypeSelectorProps) => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<"client" | "business" | null>(null);
  const [hoveredType, setHoveredType] = useState<"client" | "business" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSelect = (type: "client" | "business") => {
    setSelectedType(type);
    setIsAnimating(true);
    setTimeout(() => { onSelect(type); }, 600);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-gradient-to-br from-[hsl(222,47%,8%)] via-[hsl(224,76%,25%)] to-[hsl(239,50%,20%)]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[hsl(217,91%,60%,0.15)] rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[hsl(239,84%,67%,0.15)] rounded-full blur-3xl animate-pulse-slow stagger-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[hsl(224,76%,40%,0.1)] rounded-full blur-3xl animate-morph" />
        
        {/* Geometric particles instead of emojis */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="absolute w-2 h-2 rounded-full bg-white/10 animate-float" style={{ left: `${10 + (i * 12)}%`, top: `${20 + (i % 3) * 25}%`, animationDelay: `${i * 0.3}s`, animationDuration: `${4 + i}s` }} />
        ))}
      </div>

      {/* Logo */}
      <div className="relative mb-8 animate-bounce-in z-10">
        <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shadow-primary/30 ring-4 ring-white/50 cursor-pointer hover:scale-110 transition-transform" onClick={() => navigate("/")}>
          <img src={afrimartLogo} alt="AfriMart" className="w-full h-full object-cover" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[hsl(217,91%,60%)] animate-pulse" />
      </div>

      {/* Title */}
      <div className="relative text-center mb-10 z-10 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-3 text-white">
          Bienvenue sur <span className="gradient-text">AfriMart</span>
        </h1>
        <p className="text-white/60 text-lg">Comment souhaitez-vous nous rejoindre ?</p>
      </div>

      {/* Cards */}
      <div className="relative z-10 flex flex-col md:flex-row gap-6 w-full max-w-3xl">
        {/* Client Card */}
        <button onClick={() => handleSelect("client")} onMouseEnter={() => setHoveredType("client")} onMouseLeave={() => setHoveredType(null)} disabled={isAnimating}
          className={cn(
            "group relative flex-1 p-8 rounded-3xl border-2 transition-all duration-500 backdrop-blur-xl text-left",
            "bg-gradient-to-br from-[hsl(217,91%,60%,0.15)] via-[hsl(224,76%,40%,0.1)] to-[hsl(239,84%,67%,0.05)]",
            "hover:from-[hsl(217,91%,60%,0.25)] hover:via-[hsl(224,76%,40%,0.15)] hover:to-[hsl(239,84%,67%,0.1)]",
            "hover:border-[hsl(217,91%,60%)] hover:shadow-2xl hover:shadow-[hsl(217,91%,60%,0.3)]",
            "hover:-translate-y-3 hover:scale-[1.02] active:scale-95 active:translate-y-0",
            selectedType === "client" && "border-[hsl(217,91%,60%)] shadow-2xl shadow-[hsl(217,91%,60%,0.4)] scale-[1.02] -translate-y-3",
            selectedType === "business" && "opacity-50 scale-95",
            !selectedType && "border-[hsl(217,91%,60%,0.3)]",
            "animate-fade-in-left"
          )}>
          <div className={cn("absolute inset-0 rounded-3xl bg-gradient-to-br from-[hsl(217,91%,60%,0.2)] to-[hsl(224,76%,40%,0.2)] opacity-0 blur-xl transition-opacity duration-500 -z-10", hoveredType === "client" && "opacity-100")} />
          <div className="relative mb-6">
            <div className={cn("w-20 h-20 rounded-2xl bg-[hsl(217,91%,60%,0.2)] flex items-center justify-center", "transition-all duration-500 group-hover:scale-110 group-hover:rotate-3", selectedType === "client" && "animate-jelly")}>
              <ShoppingBag className="w-10 h-10 text-[hsl(217,91%,60%)]" />
            </div>
            <div className={cn("absolute -top-2 -right-2 transition-all duration-500", "opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-0")}>
              <Heart className="w-6 h-6 text-red-400 animate-pulse-heart" />
            </div>
            <div className={cn("absolute -bottom-1 -left-1 transition-all duration-500 delay-100", "opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-0")}>
              <Star className="w-5 h-5 text-[hsl(217,91%,60%)] animate-bounce-soft" />
            </div>
          </div>
          <h3 className="text-2xl font-display font-bold mb-3 text-white group-hover:text-[hsl(217,91%,60%)] transition-colors">Espace Client</h3>
          <p className="text-white/60 mb-6 leading-relaxed">Découvrez des produits uniques et soutenez les entrepreneurs africains</p>
          <div className="space-y-3 mb-6">
            {[{ icon: Gift, text: "Produits exclusifs" }, { icon: Users, text: "Vendeurs vérifiés" }, { icon: Zap, text: "Livraison rapide" }].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-[hsl(217,91%,60%,0.2)] flex items-center justify-center group-hover:bg-[hsl(217,91%,60%,0.3)] transition-colors">
                  <Icon className="w-4 h-4 text-[hsl(217,91%,60%)]" />
                </div>
                <span className="text-white/70 group-hover:text-white transition-colors">{text}</span>
              </div>
            ))}
          </div>
          <div className={cn("flex items-center gap-2 text-[hsl(217,91%,60%)] font-semibold", "opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all")}>
            <span>Continuer</span><ArrowRight className="w-5 h-5 animate-bounce-soft" style={{ animationDirection: "alternate" }} />
          </div>
        </button>

        {/* Business Card */}
        <button onClick={() => handleSelect("business")} onMouseEnter={() => setHoveredType("business")} onMouseLeave={() => setHoveredType(null)} disabled={isAnimating}
          className={cn(
            "group relative flex-1 p-8 rounded-3xl border-2 transition-all duration-500 backdrop-blur-xl text-left",
            "bg-gradient-to-br from-[hsl(239,84%,67%,0.15)] via-[hsl(239,70%,55%,0.1)] to-[hsl(224,76%,40%,0.05)]",
            "hover:from-[hsl(239,84%,67%,0.25)] hover:via-[hsl(239,70%,55%,0.15)] hover:to-[hsl(224,76%,40%,0.1)]",
            "hover:border-[hsl(239,84%,67%)] hover:shadow-2xl hover:shadow-[hsl(239,84%,67%,0.3)]",
            "hover:-translate-y-3 hover:scale-[1.02] active:scale-95 active:translate-y-0",
            selectedType === "business" && "border-[hsl(239,84%,67%)] shadow-2xl shadow-[hsl(239,84%,67%,0.4)] scale-[1.02] -translate-y-3",
            selectedType === "client" && "opacity-50 scale-95",
            !selectedType && "border-[hsl(239,84%,67%,0.3)]",
            "animate-fade-in-right"
          )}>
          <div className={cn("absolute inset-0 rounded-3xl bg-gradient-to-br from-[hsl(239,84%,67%,0.2)] to-[hsl(224,76%,40%,0.2)] opacity-0 blur-xl transition-opacity duration-500 -z-10", hoveredType === "business" && "opacity-100")} />
          <div className="relative mb-6">
            <div className={cn("w-20 h-20 rounded-2xl bg-[hsl(239,84%,67%,0.2)] flex items-center justify-center", "transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3", selectedType === "business" && "animate-jelly")}>
              <Store className="w-10 h-10 text-[hsl(239,84%,67%)]" />
            </div>
            <div className={cn("absolute -top-2 -left-2 transition-all duration-500", "opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-0")}>
              <Crown className="w-6 h-6 text-[hsl(239,84%,67%)] animate-bounce-soft" />
            </div>
            <div className={cn("absolute -bottom-1 -right-1 transition-all duration-500 delay-100", "opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-0")}>
              <Sparkles className="w-5 h-5 text-[hsl(239,84%,67%)] animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-display font-bold mb-3 text-white group-hover:text-[hsl(239,84%,67%)] transition-colors">Espace Entreprise</h3>
          <p className="text-white/60 mb-6 leading-relaxed">Développez votre activité et atteignez des milliers de clients</p>
          <div className="space-y-3 mb-6">
            {[{ icon: TrendingUp, text: "Visibilité maximale" }, { icon: Store, text: "Boutique en ligne" }, { icon: Sparkles, text: "Outils marketing" }].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-[hsl(239,84%,67%,0.2)] flex items-center justify-center group-hover:bg-[hsl(239,84%,67%,0.3)] transition-colors">
                  <Icon className="w-4 h-4 text-[hsl(239,84%,67%)]" />
                </div>
                <span className="text-white/70 group-hover:text-white transition-colors">{text}</span>
              </div>
            ))}
          </div>
          <div className={cn("flex items-center gap-2 text-[hsl(239,84%,67%)] font-semibold", "opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all")}>
            <span>Créer ma boutique</span><ArrowRight className="w-5 h-5 animate-bounce-soft" style={{ animationDirection: "alternate" }} />
          </div>
        </button>
      </div>

      <button onClick={() => navigate("/")} className="relative z-10 mt-10 text-white/50 hover:text-white transition-colors flex items-center gap-2 animate-fade-in stagger-5">
        <span>← Retour à l'accueil</span>
      </button>
      <p className="relative z-10 mt-4 text-sm text-white/40 text-center animate-fade-in stagger-5">
        La marketplace qui célèbre l'Afrique
      </p>
    </div>
  );
};

export default UserTypeSelector;
