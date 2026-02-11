import type { Metadata } from "next";
import ShopPageClient from "./ShopPageClient";

export const metadata: Metadata = {
  title: "Shop — Sole Shoes",
  description:
    "Browse our curated collection of premium sneakers from Nike, Adidas, and New Balance.",
  openGraph: {
    title: "Shop — Sole Shoes",
    description:
      "Browse our curated collection of premium sneakers from Nike, Adidas, and New Balance.",
  },
};

export default function ShopPage() {
  return <ShopPageClient />;
}
