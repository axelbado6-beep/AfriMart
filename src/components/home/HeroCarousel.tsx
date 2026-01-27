import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    title: "Découvrez l'Afrique qui entreprend",
    subtitle: "Des milliers de produits authentiques des entrepreneurs africains",
    cta: "Explorer maintenant",
    link: "/catalog",
    icon: Sparkles,
    gradient: "from-primary via-primary to-secondary/50",
  },
  {
    title: "Paiement sécurisé Mobile Money",
    subtitle: "Orange Money, MTN Money, Wave - Payez en toute confiance",
    cta: "Voir les produits",
    link: "/catalog",
    icon: ShieldCheck,
    gradient: "from-secondary via-secondary to-accent/50",
  },
  {
    title: "Vendeurs vérifiés",
    subtitle: "Achetez auprès d'entreprises de confiance à travers l'Afrique",
    cta: "Découvrir",
    link: "/catalog",
    icon: TrendingUp,
    gradient: "from-accent via-accent to-primary/50",
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

    // Auto-scroll every 5 seconds
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
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0"
            >
              <div className={`relative bg-gradient-to-br ${slide.gradient} py-16 md:py-24 lg:py-32`}>
                {/* Pattern overlay */}
                <div className="absolute inset-0 african-pattern opacity-30" />
                
                <div className="container mx-auto px-4 relative z-10">
                  <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/10 backdrop-blur-sm text-primary-foreground/90 text-sm mb-6">
                      <slide.icon className="w-4 h-4" />
                      <span>AfriMart Marketplace</span>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-primary-foreground mb-4 animate-fade-up">
                      {slide.title}
                    </h1>
                    
                    <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 animate-fade-up stagger-1">
                      {slide.subtitle}
                    </p>
                    
                    <Link to={slide.link}>
                      <Button 
                        size="lg" 
                        className="bg-background text-foreground hover:bg-background/90 font-semibold animate-fade-up stagger-2"
                      >
                        {slide.cta}
                      </Button>
                    </Link>
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
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm text-primary-foreground hover:bg-background/40 hidden md:flex"
        onClick={scrollPrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm text-primary-foreground hover:bg-background/40 hidden md:flex"
        onClick={scrollNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === selectedIndex 
                ? "bg-primary-foreground w-6" 
                : "bg-primary-foreground/50"
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </section>
  );
}
