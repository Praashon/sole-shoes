import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/feature/landing/HeroSection";
import { ProductGrid } from "@/components/feature/landing/ProductGrid";
import { PromoSection } from "@/components/feature/landing/PromoSection";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Sole Shoes — Premium Sneakers",
  description:
    "Curated collection of premium sneakers from Nike, Adidas, and New Balance. Design for the way you move.",
  openGraph: {
    title: "Sole Shoes — Premium Sneakers",
    description:
      "Curated collection of premium sneakers from Nike, Adidas, and New Balance.",
    type: "website",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <OrganizationJsonLd />
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
