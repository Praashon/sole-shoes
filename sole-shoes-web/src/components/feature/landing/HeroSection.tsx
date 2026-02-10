"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { HeroScene } from "../hero/HeroScene";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-overline", { opacity: 0, y: 20, duration: 0.5 })
        .from(".hero-title span", { opacity: 0, y: 60, duration: 0.7, stagger: 0.08 }, "-=0.2")
        .from(".hero-subtitle", { opacity: 0, y: 20, duration: 0.5 }, "-=0.3")
        .from(".hero-cta", { opacity: 0, y: 15, duration: 0.4, stagger: 0.08 }, "-=0.2")
        .from(".hero-scene", { opacity: 0, scale: 0.95, duration: 0.8 }, "-=0.5");
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Text */}
        <div className="space-y-6 z-10">
          <p className="hero-overline text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            New for 2025
          </p>

          <h1 className="hero-title text-5xl md:text-7xl font-black tracking-tight leading-[0.92]">
            <span className="block">Step Into</span>
            <span className="block text-primary">The Future</span>
          </h1>

          <p className="hero-subtitle text-base text-muted-foreground max-w-md leading-relaxed">
            Sneakers built for the way you actually move. Lightweight feel, all-day comfort, designed in-house.
          </p>

          <div className="flex items-center gap-4">
            <Link href="/shop">
              <button className="hero-cta group flex items-center gap-2 px-7 py-3 bg-foreground text-background rounded-full text-sm font-semibold hover:opacity-90 transition-opacity">
                Shop Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
            <Link href="/stage">
              <button className="hero-cta px-7 py-3 border border-border rounded-full text-sm font-semibold hover:bg-secondary/50 transition-colors text-foreground">
                3D Studio
              </button>
            </Link>
          </div>
        </div>

        {/* Right: 3D Scene */}
        <div className="hero-scene relative h-[400px] lg:h-[550px]">
          <HeroScene />
        </div>
      </div>
    </section>
  );
}
