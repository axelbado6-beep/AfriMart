import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicHeader } from "@/components/home/PublicHeader";
import { DeliveryAddressBar } from "@/components/home/DeliveryAddressBar";
import { CategoryGlovoGrid } from "@/components/home/CategoryGlovoGrid";
import { BusinessRow } from "@/components/home/NearbyBusinesses";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PublicFooter } from "@/components/home/PublicFooter";
import HomeStoriesSection from "@/components/stories/HomeStoriesSection";
import LoadingScreen from "@/components/layout/LoadingScreen";

const Index = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <LoadingScreen onComplete={() => setIsLoading(false)} />
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <PublicHeader />
        <DeliveryAddressBar />
        <main className="animate-fade-in">
          <CategoryGlovoGrid />
          <BusinessRow title="Près de chez vous" subtitle="Triés par distance" mode="nearby" />
          <HomeStoriesSection currentUserId={currentUserId} />
          <BusinessRow title="Populaires cette semaine" mode="popular" />
          <HeroCarousel />
          <BusinessRow title="Nouveau sur Afrimart" mode="newest" />
          <FeaturedProducts />
        </main>
        <PublicFooter />
      </div>
    </div>
  );
};

export default Index;
