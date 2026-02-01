import { useNavigate } from "react-router-dom";
import { User, Building2, ShoppingBag, Star, TrendingUp, Users, Sparkles, ArrowRight } from "lucide-react";
import afrimartLogo from "@/assets/afrimart-logo.jpg";

interface UserTypeSelectorProps {
  onSelect: (type: "client" | "business") => void;
}

export const UserTypeSelector = ({ onSelect }: UserTypeSelectorProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-afrimart-blue relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-afrimart-orange/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-afrimart-green/15 rounded-full blur-3xl animate-pulse-slow stagger-3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-afrimart-gold/10 rounded-full blur-3xl animate-morph" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 right-20 text-4xl animate-float opacity-30">🌍</div>
        <div className="absolute bottom-32 left-16 text-3xl animate-float stagger-2 opacity-30">✨</div>
        <div className="absolute top-1/3 left-10 text-2xl animate-bounce-soft opacity-30">🛍️</div>
        <div className="absolute bottom-20 right-1/4 text-3xl animate-float stagger-4 opacity-30">🚀</div>
      </div>

      {/* Logo */}
      <div className="relative z-10 mb-10 flex flex-col items-center animate-fade-in-down">
        <div className="relative group cursor-pointer" onClick={() => navigate("/")}>
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-afrimart-orange to-afrimart-gold opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-500" />
          <img 
            src={afrimartLogo} 
            alt="AfriMart" 
            className="w-20 h-20 rounded-full object-cover shadow-2xl group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h1 className="mt-4 text-3xl font-display font-bold text-primary-foreground">
          Bienvenue sur Afri<span className="text-gradient">Mart</span>
        </h1>
        <p className="text-primary-foreground/70 mt-2 text-center">
          Choisissez votre espace pour continuer
        </p>
      </div>

      {/* Selection Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {/* Client Card */}
        <button
          onClick={() => onSelect("client")}
          className="group relative bg-gradient-to-br from-afrimart-green/20 to-afrimart-green/5 backdrop-blur-xl border-2 border-afrimart-green/30 rounded-3xl p-8 text-left transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:border-afrimart-green hover:shadow-2xl hover:shadow-afrimart-green/30 active:scale-95"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-afrimart-green/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Icon Container */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-afrimart-green/20 flex items-center justify-center group-hover:animate-jelly">
              <User className="w-10 h-10 text-afrimart-green group-hover:scale-110 transition-transform" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-afrimart-green flex items-center justify-center animate-bounce-soft">
              <ShoppingBag className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>

          {/* Content */}
          <h2 className="text-2xl font-display font-bold text-primary-foreground mb-2 group-hover:text-afrimart-green transition-colors">
            Espace Client
          </h2>
          <p className="text-primary-foreground/70 mb-6">
            Découvrez des produits africains authentiques et soutenez les entreprises locales
          </p>

          {/* Features */}
          <div className="space-y-3">
            <Feature icon={Star} text="Découvrir les meilleures entreprises" color="afrimart-green" />
            <Feature icon={ShoppingBag} text="Commander en toute simplicité" color="afrimart-green" />
            <Feature icon={Sparkles} text="Profiter d'offres exclusives" color="afrimart-green" />
          </div>

          {/* CTA */}
          <div className="mt-6 flex items-center gap-2 text-afrimart-green font-semibold opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all">
            Continuer <ArrowRight className="w-4 h-4 animate-bounce-soft" style={{ animationDirection: "alternate" }} />
          </div>
        </button>

        {/* Business Card */}
        <button
          onClick={() => onSelect("business")}
          className="group relative bg-gradient-to-br from-afrimart-orange/20 to-afrimart-orange/5 backdrop-blur-xl border-2 border-afrimart-orange/30 rounded-3xl p-8 text-left transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:border-afrimart-orange hover:shadow-2xl hover:shadow-afrimart-orange/30 active:scale-95"
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-afrimart-orange/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Icon Container */}
          <div className="relative mb-6">
            <div className="w-20 h-20 rounded-2xl bg-afrimart-orange/20 flex items-center justify-center group-hover:animate-jelly">
              <Building2 className="w-10 h-10 text-afrimart-orange group-hover:scale-110 transition-transform" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-afrimart-orange flex items-center justify-center animate-bounce-soft stagger-2">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>

          {/* Content */}
          <h2 className="text-2xl font-display font-bold text-primary-foreground mb-2 group-hover:text-afrimart-orange transition-colors">
            Espace Entreprise
          </h2>
          <p className="text-primary-foreground/70 mb-6">
            Vendez vos produits à des milliers de clients et développez votre activité
          </p>

          {/* Features */}
          <div className="space-y-3">
            <Feature icon={TrendingUp} text="Augmenter vos ventes" color="afrimart-orange" />
            <Feature icon={Users} text="Atteindre de nouveaux clients" color="afrimart-orange" />
            <Feature icon={Star} text="Obtenir des avis et visibilité" color="afrimart-orange" />
          </div>

          {/* CTA */}
          <div className="mt-6 flex items-center gap-2 text-afrimart-orange font-semibold opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all">
            Continuer <ArrowRight className="w-4 h-4 animate-bounce-soft" style={{ animationDirection: "alternate" }} />
          </div>
        </button>
      </div>

      {/* Back to Home Link */}
      <button
        onClick={() => navigate("/")}
        className="relative z-10 mt-8 text-primary-foreground/60 hover:text-primary-foreground transition-colors flex items-center gap-2 group"
      >
        <span>← Retour à l'accueil</span>
      </button>
    </div>
  );
};

const Feature = ({ 
  icon: Icon, 
  text, 
  color 
}: { 
  icon: any; 
  text: string; 
  color: string;
}) => (
  <div className="flex items-center gap-3 text-primary-foreground/80">
    <div className={`w-6 h-6 rounded-lg bg-${color}/20 flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-3.5 h-3.5 text-${color}`} />
    </div>
    <span className="text-sm">{text}</span>
  </div>
);

export default UserTypeSelector;
