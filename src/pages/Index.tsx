import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicHeader } from "@/components/home/PublicHeader";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryNav } from "@/components/home/CategoryNav";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PopularBusinesses } from "@/components/home/PopularBusinesses";
import { CategoryTabs } from "@/components/home/CategoryTabs";
import { PublicFooter } from "@/components/home/PublicFooter";
import HomeStoriesSection from "@/components/stories/HomeStoriesSection";

const Index = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main>
        <HeroCarousel />
        <HomeStoriesSection currentUserId={currentUserId} />
        <CategoryNav />
        <FeaturedProducts />
        <PopularBusinesses />
        <CategoryTabs />
      </main>
      <PublicFooter />
    </div>
  );
};

export default Index;
