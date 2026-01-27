import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Users, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

interface Business {
  id: string;
  business_name: string;
  logo_url: string | null;
  category: string | null;
  location: string | null;
  followers_count: number | null;
  is_verified: boolean | null;
}

export function PopularBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
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
      }
      setLoading(false);
    };

    fetchBusinesses();
  }, []);

  if (loading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (businesses.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Entreprises populaires
            </h2>
            <p className="text-muted-foreground mt-1">
              Découvrez les vendeurs les plus suivis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              className="hidden md:flex"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              className="hidden md:flex"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Link to="/catalog">
              <Button variant="outline" className="gap-2">
                Voir tout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {businesses.map((business, index) => (
              <div 
                key={business.id} 
                className="flex-[0_0_280px] md:flex-[0_0_300px] animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <Link to={`/business/${business.id}`}>
                  <Card className="hover-lift h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16 border-2 border-border">
                          <AvatarImage src={business.logo_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                            {business.business_name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground truncate">
                              {business.business_name}
                            </h3>
                            {business.is_verified && (
                              <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                            )}
                          </div>
                          {business.category && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {business.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                        {business.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{business.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{business.followers_count || 0} abonnés</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
