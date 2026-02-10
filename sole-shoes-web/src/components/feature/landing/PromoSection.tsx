"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function PromoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".promo-text", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        opacity: 0,
        y: 40,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-28 px-6 overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-secondary/30" />

      <div className="relative max-w-3xl mx-auto text-center">
        <p className="promo-text text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
          New Drop
        </p>
        <h2 className="promo-text text-3xl md:text-5xl font-bold tracking-tight mb-5 leading-tight">
          The next step in
          <br />
          everyday comfort
        </h2>
        <p className="promo-text text-base text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
          Our latest collection — lighter soles, better arch support, and colorways that actually go with your wardrobe.
        </p>
        <Link href="/shop">
          <button className="promo-text group inline-flex items-center gap-2 px-7 py-3 bg-foreground text-background rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
            See the Collection
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </Link>
      </div>
    </section>
  );
}
