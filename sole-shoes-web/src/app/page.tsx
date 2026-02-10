import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/feature/landing/HeroSection";
import { ProductGrid } from "@/components/feature/landing/ProductGrid";
import { PromoSection } from "@/components/feature/landing/PromoSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex-grow pt-14">
        <HeroSection />
        <ProductGrid />
        <PromoSection />
      </main>
      <Footer />
    </div>
  );
}
