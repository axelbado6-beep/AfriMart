import { useState } from "react";
import { MapPin, ChevronDown, Locate, Search, Loader2, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocation, DeliveryAddress } from "@/contexts/LocationContext";
import { toast } from "sonner";

type Suggestion = { display_name: string; lat: string; lon: string };

export function DeliveryAddressBar() {
  const { address, setAddress } = useLocation();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);

  const search = async (q: string) => {
    setQuery(q);
    if (q.trim().length < 3) {
      setResults([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(q)}`,
        { headers: { "Accept-Language": "fr" } }
      );
      const data: Suggestion[] = await res.json();
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const pick = (s: Suggestion) => {
    const addr: DeliveryAddress = {
      label: s.display_name.split(",").slice(0, 3).join(", "),
      lat: parseFloat(s.lat),
      lng: parseFloat(s.lon),
    };
    setAddress(addr);
    setOpen(false);
    setQuery("");
    setResults([]);
    toast.success("Adresse de livraison enregistrée");
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Géolocalisation non supportée");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { "Accept-Language": "fr" } }
          );
          const data = await res.json();
          const label =
            data?.display_name?.split(",").slice(0, 3).join(", ") ?? "Ma position";
          setAddress({ label, lat: latitude, lng: longitude });
          setOpen(false);
          toast.success("Position détectée");
        } catch {
          setAddress({
            label: "Ma position",
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setOpen(false);
        } finally {
          setLocating(false);
        }
      },
      () => {
        toast.error("Impossible d'obtenir votre position");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="w-full flex items-center gap-2 px-4 py-3 bg-card border-b border-border hover:bg-muted/50 transition-colors text-left">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
              Livrer à
            </div>
            <div className="text-sm font-medium text-foreground truncate">
              {address?.label ?? "Choisir une adresse"}
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Adresse de livraison</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-3">
          <Button
            onClick={useMyLocation}
            disabled={locating}
            variant="outline"
            className="w-full justify-start gap-2 h-12"
          >
            {locating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Locate className="h-4 w-4 text-primary" />
            )}
            Utiliser ma position actuelle
          </Button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Rechercher une adresse, ville, quartier..."
              value={query}
              onChange={(e) => search(e.target.value)}
              className="pl-9 pr-9 h-12"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setResults([]);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {searching && (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          <div className="space-y-1 max-h-[50vh] overflow-y-auto">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => pick(r)}
                className="w-full flex items-start gap-3 p-3 rounded-lg hover:bg-muted text-left transition-colors"
              >
                <MapPin className="h-4 w-4 text-primary mt-1 shrink-0" />
                <span className="text-sm text-foreground">{r.display_name}</span>
              </button>
            ))}
            {!searching && query.length >= 3 && results.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-6">
                Aucun résultat
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
