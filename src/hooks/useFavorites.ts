import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useFavorites(userId: string | null) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const fetchFavorites = async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("product_id")
        .eq("user_id", userId);

      if (!error && data) {
        setFavorites(data.map((f) => f.product_id));
      }
      setLoading(false);
    };

    fetchFavorites();
  }, [userId]);

  const toggleFavorite = async (productId: string) => {
    if (!userId) {
      toast({
        title: "Connexion requise",
        description: "Connectez-vous pour ajouter des favoris",
        variant: "destructive",
      });
      return;
    }

    const isFavorite = favorites.includes(productId);

    if (isFavorite) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (!error) {
        setFavorites((prev) => prev.filter((id) => id !== productId));
        toast({ title: "Retiré des favoris" });
      }
    } else {
      const { error } = await supabase.from("favorites").insert({
        user_id: userId,
        product_id: productId,
      });

      if (!error) {
        setFavorites((prev) => [...prev, productId]);
        toast({ title: "Ajouté aux favoris" });
      }
    }
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  return { favorites, loading, toggleFavorite, isFavorite };
}
