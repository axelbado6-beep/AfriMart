import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, haversineKm } from "@/contexts/LocationContext";
import { MapPin, BadgeCheck, Store } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

type Business = {
  id: string;
  business_name: string;
  category: string | null;
  location: string | null;
  logo_url: string | null;
  banner_url: string | null;
  is_verified: boolean | null;
  latitude: number | null;
  longitude: number | null;
};

type Props = {
  title: string;
  subtitle?: string;
  mode: "nearby" | "newest" | "popular";
};

export function BusinessRow({ title, subtitle, mode }: Props) {
  const { address } = useLocation();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      let query = supabase
        .from("business_profiles")
        .select("id, business_name, category, location, logo_url, banner_url, is_verified, latitude, longitude")
        .limit(20);

      if (mode === "newest") query = query.order("created_at", { ascending: false });
      else if (mode === "popular") query = query.order("followers_count", { ascending: false });

      const { data } = await query;
      if (!active) return;

      let list = (data ?? []) as Business[];
      if (mode === "nearby" && address) {
        list = list
          .flatMap((b) => {
            if (b.latitude == null || b.longitude == null) return [];
            return [{ ...b, _d: haversineKm(address, { lat: b.latitude, lng: b.longitude }) }];
          })
          .sort((a, b) => a._d - b._d)
          .slice(0, 12);
      } else {
        list = list.slice(0, 12);
      }
      setBusinesses(list);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [mode, address]);

  if (!loading && businesses.length === 0) return null;

  return (
    <section className="py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <h2 className="text-lg font-display font-bold text-foreground">{title}</h2>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        <ScrollArea className="w-full">
          <div className="flex gap-3 pb-3">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="w-48 h-40 rounded-lg shrink-0" />
                ))
              : businesses.map((b) => {
                  const distance =
                    address && b.latitude != null && b.longitude != null
                      ? haversineKm(address, { lat: b.latitude, lng: b.longitude })
                      : null;
                  return (
                    <Button asChild variant="ghost" key={b.id}
                      className="group block h-auto p-0 w-48 shrink-0 text-left whitespace-normal rounded-lg overflow-hidden bg-card border border-border hover:bg-card hover:border-primary/40 motion-safe:hover:-translate-y-1 transition-all">
                      <Link to={`/business/${b.id}`}>

                      <div className="relative h-20 bg-muted overflow-hidden">
                        {b.banner_url ? (
                          <img
                            src={b.banner_url}
                            alt={b.business_name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Store className="h-8 w-8 text-primary/40" />
                          </div>
                        )}
                        {b.logo_url && (
                          <img
                            src={b.logo_url}
                            alt=""
                            className="absolute bottom-2 left-2 w-9 h-9 rounded-md border-2 border-card object-cover bg-card"
                          />
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-semibold text-foreground truncate flex-1">
                            {b.business_name}
                          </p>
                          {b.is_verified && (
                            <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {distance != null
                              ? `${distance.toFixed(1)} km`
                              : b.location ?? b.category ?? "—"}
                          </span>
                        </div>
                      </div>
                      </Link>
                    </Button>
                  );
                })}
          </div>
          <ScrollBar orientation="horizontal" className="opacity-0" />
        </ScrollArea>
      </div>
    </section>
  );
}
