import { PublicHeader } from "@/components/home/PublicHeader";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryNav } from "@/components/home/CategoryNav";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PopularBusinesses } from "@/components/home/PopularBusinesses";
import { CategoryTabs } from "@/components/home/CategoryTabs";
import { PublicFooter } from "@/components/home/PublicFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <main>
        <HeroCarousel />
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
