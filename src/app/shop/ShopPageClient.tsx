"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { products } from "@/config/products";

const brands = ["All", "Nike", "Adidas", "New Balance"];

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("All");
  const headerRef = useRef<HTMLDivElement>(null);

  const filteredProducts =
    activeTab === "All"
      ? products
      : products.filter((product) => product.brand === activeTab);

  useGSAP(
    () => {
      gsap.from(".shop-header > *", {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
    { scope: headerRef }
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div ref={headerRef} className="shop-header mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-1">Shop</h1>
          <p className="text-muted-foreground text-sm mb-6">
            {filteredProducts.length} styles available
          </p>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() => setActiveTab(brand)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap border ${
                  activeTab === brand
                    ? "bg-foreground text-background border-foreground"
                    : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <Link href={`/product/${product.id}`}>
                  <ProductCard {...product} />
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-sm">No products found.</p>
            <button onClick={() => setActiveTab("All")} className="mt-3 text-sm text-primary hover:underline">View all</button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
