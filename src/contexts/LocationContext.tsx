import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type DeliveryAddress = {
  label: string;
  lat: number;
  lng: number;
};

type LocationContextType = {
  address: DeliveryAddress | null;
  setAddress: (a: DeliveryAddress | null) => void;
  loading: boolean;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = "afrimart_delivery_address";

export function LocationProvider({ children }: { children: ReactNode }) {
  const [address, setAddressState] = useState<DeliveryAddress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAddressState(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const setAddress = (a: DeliveryAddress | null) => {
    setAddressState(a);
    try {
      if (a) localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <LocationContext.Provider value={{ address, setAddress, loading }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation must be used within LocationProvider");
  return ctx;
}

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(h));
}
