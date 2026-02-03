import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import afrimartLogo from "@/assets/afrimart-logo.jpg";

interface LoadingScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

export const LoadingScreen = ({ onComplete, minDuration = 1200 }: LoadingScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, minDuration / 50);

    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 500);
    }, minDuration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [minDuration, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex flex-col items-center justify-center",
        "bg-gradient-to-br from-primary via-primary to-afrimart-blue",
        "transition-all duration-500",
        isExiting && "opacity-0 scale-110"
      )}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-afrimart-orange/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-afrimart-green/20 rounded-full blur-3xl animate-pulse-slow stagger-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-afrimart-gold/10 rounded-full blur-3xl animate-morph" />
      </div>

      {/* Logo container */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Outer glow ring */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-36 h-36 rounded-full bg-gradient-to-r from-afrimart-orange via-afrimart-gold to-afrimart-green opacity-30 blur-xl animate-pulse-slow" />
        </div>

        {/* Spinning ring */}
        <div className="absolute w-32 h-32 rounded-full border-4 border-transparent border-t-afrimart-orange border-r-afrimart-gold animate-spin-slow" />
        
        {/* Logo */}
        <div className={cn(
          "relative w-24 h-24 rounded-2xl overflow-hidden shadow-2xl shadow-afrimart-orange/40",
          "ring-4 ring-white/20 transition-transform duration-700",
          isExiting ? "scale-150 opacity-0" : "animate-elastic"
        )}>
          <img 
            src={afrimartLogo} 
            alt="AfriMart" 
            className="w-full h-full object-cover animate-pulse-slow"
          />
          
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>

        {/* Orbiting dots */}
        <div className="absolute w-32 h-32 animate-spin-slow" style={{ animationDuration: "4s" }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-3 h-3 bg-afrimart-orange rounded-full shadow-lg" />
        </div>
        <div className="absolute w-32 h-32 animate-spin-slow" style={{ animationDuration: "4s", animationDirection: "reverse" }}>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-2 h-2 bg-afrimart-green rounded-full shadow-lg" />
        </div>

        {/* Brand name */}
        <div className={cn(
          "mt-8 flex items-center gap-1",
          "transition-all duration-500",
          isExiting && "opacity-0 translate-y-4"
        )}>
          <span className="text-3xl font-display font-bold text-primary-foreground animate-fade-in-left">
            Afri
          </span>
          <span className="text-3xl font-display font-bold bg-gradient-to-r from-afrimart-orange via-afrimart-gold to-afrimart-orange bg-[length:200%_auto] animate-gradient-x">
            <span className="text-transparent bg-clip-text">Mart</span>
          </span>
        </div>

        {/* Tagline */}
        <p className={cn(
          "mt-2 text-primary-foreground/70 text-sm font-medium",
          "transition-all duration-500 delay-100",
          isExiting && "opacity-0 translate-y-4"
        )}>
          L'Afrique à portée de clic ✨
        </p>

        {/* Progress bar */}
        <div className={cn(
          "mt-8 w-48 h-1.5 bg-white/10 rounded-full overflow-hidden",
          "transition-all duration-500 delay-200",
          isExiting && "opacity-0 scale-x-0"
        )}>
          <div 
            className="h-full bg-gradient-to-r from-afrimart-orange via-afrimart-gold to-afrimart-green rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading dots */}
        <div className="mt-4 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full animate-loading-dots",
                i === 0 && "bg-afrimart-orange",
                i === 1 && "bg-afrimart-gold",
                i === 2 && "bg-afrimart-green"
              )}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>

      {/* Floating emojis */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["🌍", "✨", "🛍️", "💫", "🎉"].map((emoji, i) => (
          <span
            key={i}
            className="absolute text-2xl opacity-40 animate-float"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 2) * 50}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
