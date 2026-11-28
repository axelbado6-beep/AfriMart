import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, ArrowRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  { title: "AfriMart", subtitle: "Boutiques, restaurants et découvertes près de chez vous.", cta: "Explorer", link: "/catalog" },
  { title: "Le marché à portée de main", subtitle: "Retrouvez vos produits du quotidien dans le rayon Marché.", cta: "Voir le marché", link: "/catalog?category=Alimentation&sub=March%C3%A9" },
  { title: "Mode & Vêtements", subtitle: "Robes, chemises, accessoires : trouvez votre prochaine envie.", cta: "Découvrir la mode", link: "/catalog?category=Mode+%26+V%C3%AAtements" },
];

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const onSelect = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => clearInterval(timer);
  }, [emblaApi, paused]);

  return <section aria-label="À découvrir sur AfriMart" aria-roledescription="carrousel"
    className="relative bg-primary text-primary-foreground overflow-hidden"
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, index) => <div key={slide.title} className="flex-[0_0_100%] min-w-0" aria-hidden={index !== selectedIndex}>
          <div className="container mx-auto px-4 md:px-16 py-7 md:py-9 min-h-56 md:min-h-60 flex flex-col justify-center items-start">
            <p className="text-xs text-primary-foreground/70 font-semibold uppercase mb-2">Vos envies, vos commerces</p>
            {index === 0 ? <h1 className="text-3xl md:text-4xl font-display font-bold">{slide.title}</h1> : <h2 className="text-2xl md:text-3xl font-display font-bold">{slide.title}</h2>}
            <p className="text-sm md:text-base text-primary-foreground/80 mt-2 max-w-xl">{slide.subtitle}</p>
            <Button asChild variant="secondary" size="sm" className="mt-4 bg-background text-primary hover:bg-background/90">
              <Link to={slide.link} tabIndex={index === selectedIndex ? 0 : -1}>{slide.cta}<ArrowRight /></Link>
            </Button>
          </div>
        </div>)}
      </div>
    </div>
    <div className="absolute right-4 bottom-3 flex items-center gap-1">
      <Button variant="ghost" size="icon" aria-label="Bannière précédente" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => emblaApi?.scrollPrev()}><ChevronLeft /></Button>
      <span className="text-xs tabular-nums w-9 text-center">{selectedIndex + 1} / {slides.length}</span>
      <Button variant="ghost" size="icon" aria-label="Bannière suivante" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => emblaApi?.scrollNext()}><ChevronRight /></Button>
      <Button variant="ghost" size="icon" aria-label={paused ? "Reprendre les bannières" : "Mettre les bannières en pause"} className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" onClick={() => setPaused(value => !value)}>{paused ? <Play /> : <Pause />}</Button>
    </div>
  </section>;
}
