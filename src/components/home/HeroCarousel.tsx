import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp, ShieldCheck, Zap, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "Découvrez l'Afrique qui entreprend",
    subtitle: "Des milliers de produits authentiques des entrepreneurs africains",
    cta: "Explorer maintenant",
    link: "/catalog",
    icon: Sparkles,
    gradient: "from-[hsl(224,76%,30%)] via-[hsl(224,76%,40%)] to-[hsl(239,84%,50%)]",
  },
  {
    title: "Paiement sécurisé Mobile Money",
    subtitle: "Orange Money, MTN Money, Wave - Payez en toute confiance",
    cta: "Voir les produits",
    link: "/catalog",
    icon: ShieldCheck,
    gradient: "from-[hsl(222,47%,11%)] via-[hsl(224,76%,30%)] to-[hsl(217,91%,45%)]",
  },
  {
    title: "Vendeurs vérifiés",
    subtitle: "Achetez auprès d'entreprises de confiance à travers l'Afrique",
    cta: "Découvrir",
    link: "/catalog",
    icon: TrendingUp,
    gradient: "from-[hsl(239,84%,50%)] via-[hsl(239,70%,55%)] to-[hsl(217,91%,55%)]",
  },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);

    const autoplay = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      emblaApi.off("select", onSelect);
      clearInterval(autoplay);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="relative overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div key={index} className="flex-[0_0_100%] min-w-0">
              <div className={cn(
                "relative py-20 md:py-28 lg:py-36 overflow-hidden",
                `bg-gradient-to-br ${slide.gradient}`
              )}>
                {/* Geometric decorations */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {/* Circles */}
                  <div className="absolute top-1/4 right-[15%] w-32 h-32 border border-white/10 rounded-full animate-pulse-slow" />
                  <div className="absolute bottom-1/4 left-[10%] w-48 h-48 border border-white/5 rounded-full animate-pulse-slow" style={{ animationDelay: '1s' }} />
                  <div className="absolute top-[60%] right-[30%] w-20 h-20 border border-white/8 rounded-full animate-float" />
                  
                  {/* Gradient orbs */}
                  <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse-slow" />
                  <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
                  
                  {/* Lines */}
                  <div className="absolute top-[20%] left-[5%] w-px h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                  <div className="absolute bottom-[20%] right-[8%] w-px h-24 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                </div>
                
                <div className="container mx-auto px-4 relative z-10">
                  <div className="max-w-3xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-sm mb-6 animate-bounce-in border border-white/20">
                      <slide.icon className="w-4 h-4 animate-pulse-slow" />
                      <span className="font-medium">AfriMart Marketplace</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white mb-6 animate-fade-in-up leading-tight">
                      {slide.title}
                    </h1>
                    
                    <p className="text-lg md:text-xl text-white/80 mb-10 animate-fade-in-up max-w-2xl mx-auto" style={{ animationDelay: '0.1s' }}>
                      {slide.subtitle}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                      <Link to={slide.link}>
                        <Button 
                          size="lg" 
                          className={cn(
                            "bg-white text-[hsl(224,76%,40%)] hover:bg-white/90 font-semibold px-8 py-6 text-lg rounded-2xl",
                            "transition-all duration-300 hover:scale-105 active:scale-95",
                            "hover:shadow-2xl hover:shadow-white/20",
                            "group"
                          )}
                        >
                          <span className="flex items-center gap-2">
                            {slide.cta}
                            <Zap className="w-5 h-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                          </span>
                        </Button>
                      </Link>
                      
                      <Link to="/catalog">
                        <Button 
                          variant="outline"
                          size="lg" 
                          className={cn(
                            "border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-6 text-lg rounded-2xl",
                            "transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
                          )}
                        >
                          <Gift className="w-5 h-5 mr-2" />
                          Offres spéciales
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full",
          "bg-white/10 backdrop-blur-md text-white",
          "hover:bg-white/20 hover:scale-110 active:scale-95",
          "transition-all duration-300 hidden md:flex",
          "border border-white/20"
        )}
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full",
          "bg-white/10 backdrop-blur-md text-white",
          "hover:bg-white/20 hover:scale-110 active:scale-95",
          "transition-all duration-300 hidden md:flex",
          "border border-white/20"
        )}
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={cn(
              "rounded-full transition-all duration-300",
              index === selectedIndex 
                ? "bg-white w-8 h-3" 
                : "bg-white/40 w-3 h-3 hover:bg-white/60 hover:scale-110"
            )}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </section>
  );
}
