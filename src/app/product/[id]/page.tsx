import type { Metadata } from "next";
import ProductPageClient from "./ProductPageClient";

export const metadata: Metadata = {
  title: "Product — Sole Shoes",
  description:
    "Premium sneakers with detailed specs, reviews, and secure checkout.",
  openGraph: {
    title: "Product — Sole Shoes",
    description:
      "Premium sneakers with detailed specs, reviews, and secure checkout.",
  },
};

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ProductPageClient params={params} />;
}
