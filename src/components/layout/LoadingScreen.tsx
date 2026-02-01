import { useEffect, useState } from "react";
import afrimartLogo from "@/assets/afrimart-logo.jpg";

interface LoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

export const LoadingScreen = ({ onComplete, minDuration = 1200 }: LoadingScreenProps) => {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
      onComplete?.();
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-primary via-primary to-afrimart-blue transition-all duration-500 ${
        isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-afrimart-orange/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-afrimart-green/20 rounded-full blur-3xl animate-pulse-slow stagger-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-afrimart-gold/10 rounded-full blur-3xl animate-morph" />
      </div>

      {/* Logo Container with Drawing Animation */}
      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Logo Circle with Glow */}
        <div className="relative">
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-afrimart-orange to-afrimart-gold animate-ping-slow opacity-50" />
          
          {/* Spinning Border */}
          <div className="absolute -inset-2 rounded-full border-4 border-transparent border-t-afrimart-orange border-r-afrimart-gold animate-spin-slow" />
          
          {/* Logo Image */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-2xl animate-elastic">
            <img 
              src={afrimartLogo} 
              alt="AfriMart" 
              className="w-full h-full object-cover animate-pulse-slow"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
          </div>
          
          {/* Orbiting Dots */}
          <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: "4s" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-3 h-3 bg-afrimart-orange rounded-full shadow-lg" />
          </div>
          <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: "4s", animationDirection: "reverse" }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-2 h-2 bg-afrimart-green rounded-full shadow-lg" />
          </div>
        </div>

        {/* Brand Name with Typewriter Effect */}
        <div className="flex items-center gap-1 overflow-hidden">
          <span className="text-3xl font-display font-bold text-primary-foreground animate-fade-in-left">
            Afri
          </span>
          <span className="text-3xl font-display font-bold bg-gradient-to-r from-afrimart-orange via-afrimart-gold to-afrimart-orange bg-[length:200%_auto] animate-gradient-x">
            <span className="text-transparent bg-clip-text">Mart</span>
          </span>
        </div>

        {/* Loading Dots */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-afrimart-orange rounded-full animate-loading-dots" />
          <div className="w-2 h-2 bg-afrimart-gold rounded-full animate-loading-dots stagger-2" />
          <div className="w-2 h-2 bg-afrimart-green rounded-full animate-loading-dots stagger-4" />
        </div>

        {/* Tagline */}
        <p className="text-primary-foreground/70 text-sm font-medium animate-fade-in stagger-4">
          L'Afrique à portée de clic ✨
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
