import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Users, CheckCircle, Loader2, Crown, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Business {
  id: string;
  business_name: string;
  logo_url: string | null;
  category: string | null;
  location: string | null;
  followers_count: number | null;
  is_verified: boolean | null;
}

// Color palette for business cards
const cardColors = [
  { gradient: "from-pink-500/10 to-rose-500/5", border: "hover:border-pink-400" },
  { gradient: "from-blue-500/10 to-cyan-500/5", border: "hover:border-blue-400" },
  { gradient: "from-purple-500/10 to-fuchsia-500/5", border: "hover:border-purple-400" },
  { gradient: "from-green-500/10 to-emerald-500/5", border: "hover:border-green-400" },
  { gradient: "from-orange-500/10 to-amber-500/5", border: "hover:border-orange-400" },
  { gradient: "from-cyan-500/10 to-teal-500/5", border: "hover:border-cyan-400" },
];

export function PopularBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCards, setShowCards] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      const { data, error } = await supabase
        .from("business_profiles")
        .select("id, business_name, logo_url, category, location, followers_count, is_verified")
        .order("followers_count", { ascending: false })
        .limit(8);

      if (!error && data) {
        setBusinesses(data);
        setTimeout(() => setShowCards(true), 100);
      }
      setLoading(false);
    };

    fetchBusinesses();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-muted/50 via-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="p-4 rounded-full bg-gradient-to-r from-afrimart-green to-secondary animate-spin-slow">
                <Loader2 className="h-8 w-8 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-afrimart-green to-secondary rounded-full blur-xl opacity-50 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (businesses.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-muted/50 via-background to-muted/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-afrimart-green/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-afrimart-gold/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-10">
          <div className="animate-fade-in-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-afrimart-green to-secondary shadow-lg">
                <Store className="h-5 w-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-afrimart-green to-secondary blur-lg opacity-60 animate-pulse" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Entreprises populaires
              </h2>
              <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-full bg-afrimart-gold/20 text-afrimart-gold text-xs font-semibold animate-bounce-soft">
                <Crown className="w-3 h-3 fill-current" />
                TOP
              </div>
            </div>
            <p className="text-muted-foreground">
              Découvrez les vendeurs les plus suivis
            </p>
          </div>
          <div className="flex items-center gap-2 animate-fade-in-right">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="hidden md:flex rounded-xl hover:scale-110 active:scale-95 transition-all duration-300 hover:bg-muted hover:border-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="hidden md:flex rounded-xl hover:scale-110 active:scale-95 transition-all duration-300 hover:bg-muted hover:border-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Link to="/catalog">
              <Button 
                variant="outline" 
                className={cn(
                  "gap-2 rounded-xl font-semibold transition-all duration-300",
                  "hover:border-afrimart-green hover:bg-afrimart-green/10 hover:text-afrimart-green",
                  "hover:scale-105 active:scale-95"
                )}
              >
                Voir tout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {businesses.map((business, index) => {
              const colorScheme = cardColors[index % cardColors.length];
              
              return (
                <div 
                  key={business.id} 
                  className={cn(
                    "flex-[0_0_280px] md:flex-[0_0_300px] transition-all duration-500",
                    showCards 
                      ? "opacity-100 scale-100 translate-y-0" 
                      : "opacity-0 scale-90 translate-y-8"
                  )}
                  style={{ transitionDelay: '0ms' }} // Tous en même temps
                >
                  <Link to={`/business/${business.id}`}>
                    <Card className={cn(
                      "h-full group relative overflow-hidden rounded-2xl border-2 transition-all duration-300",
                      "hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98]",
                      "bg-gradient-to-br",
                      colorScheme.gradient,
                      colorScheme.border
                    )}>
                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                      
                      <CardContent className="p-6 relative">
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            <Avatar className="h-16 w-16 border-2 border-background shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                              <AvatarImage src={business.logo_url || undefined} />
                              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xl font-bold">
                                {business.business_name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            {/* Online indicator */}
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-foreground truncate transition-colors duration-300 group-hover:text-primary">
                                {business.business_name}
                              </h3>
                              {business.is_verified && (
                                <CheckCircle className="h-4 w-4 text-secondary shrink-0 group-hover:scale-125 transition-transform duration-300" />
                              )}
                            </div>
                            {business.category && (
                              <Badge 
                                variant="secondary" 
                                className="mt-2 text-xs transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                              >
                                {business.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-4 text-sm text-muted-foreground">
                          {business.location && (
                            <div className="flex items-center gap-1.5 transition-colors duration-200 group-hover:text-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="truncate">{business.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 transition-colors duration-200 group-hover:text-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span className="font-medium">{business.followers_count || 0}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
