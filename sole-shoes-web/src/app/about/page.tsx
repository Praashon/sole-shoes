"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heart, Globe, Zap } from "lucide-react";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero entrance
      gsap.from(".about-hero > *", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      });

      // Values cards stagger on scroll
      gsap.from(".value-card", {
        scrollTrigger: {
          trigger: ".values-grid",
          start: "top 80%",
          once: true,
        },
        y: 50,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });

      // Mission section
      gsap.from(".mission-block", {
        scrollTrigger: {
          trigger: ".mission-block",
          start: "top 85%",
          once: true,
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <main className="pt-28 pb-20 px-6">
        {/* Hero */}
        <section className="about-hero max-w-3xl mx-auto text-center mb-20">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-6">
            About Us
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            We make shoes people<br />actually want to wear
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Sole started in a small workshop in Kathmandu. We were tired of choosing between shoes that looked good and ones that felt good — so we stopped choosing.
          </p>
        </section>

        {/* Values */}
        <section className="values-grid max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: Heart,
              title: "Honest Materials",
              desc: "No marketing fluff. We use full-grain leather, recycled knit, and natural rubber. We'll tell you exactly what's in every pair.",
            },
            {
              icon: Zap,
              title: "Designed to Last",
              desc: "We test every model for 500+ miles before it goes to production. If it doesn't hold up, it doesn't ship.",
            },
            {
              icon: Globe,
              title: "Kathmandu to Everywhere",
              desc: "Designed in Nepal, shipped worldwide. Our community spans 40+ countries and counting.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="value-card rounded-2xl border border-border bg-card p-8 space-y-4 hover:border-foreground/10 transition-colors"
            >
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                <item.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-base font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* Mission */}
        <section className="max-w-3xl mx-auto text-center">
          <div className="mission-block rounded-2xl border border-border bg-card p-10 md:p-16 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">What we're working toward</h2>
            <p className="text-muted-foreground leading-relaxed">
              We're not perfect, and we don't pretend to be. But we're working on it — reducing packaging waste, partnering with local manufacturers, and aiming for carbon-neutral operations by 2030. Not as a marketing line, but because it's the right thing to do.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
