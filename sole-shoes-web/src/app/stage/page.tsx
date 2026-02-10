"use client";

import { StageScene } from "@/components/feature/stage/StageScene";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowUp, Sparkles, Ruler } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function StagePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      <Navbar />
      
      <main className="relative pt-24 min-h-screen flex flex-col lg:flex-row max-w-[1600px] mx-auto p-4 gap-6">
        <div className="flex-1">
            <StageScene />
        </div>

        <aside className="w-full lg:w-[420px] flex flex-col gap-6 relative z-30">
            {/* AI Stylist Panel */}
            <div className="glass-panel p-0 rounded-xl lg:rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/20 flex flex-col mb-4 bg-white/65 dark:bg-black/65 backdrop-blur-md border border-white/40 dark:border-white/10">
                <div className="p-4 border-b border-border flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-pink-300 via-purple-300 to-indigo-400 flex items-center justify-center shadow-md animate-pulse">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold">AI Stylist</h4>
                            <p className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">Online</p>
                        </div>
                    </div>
                </div>
                <div className="p-5 bg-white/30 dark:bg-black/30 flex flex-col gap-4 h-48 overflow-y-auto">
                    <div className="bg-muted/80 p-3.5 rounded-2xl rounded-tl-none text-sm leading-relaxed shadow-sm">
                        Hello! The Velocity Air 2026 in <strong>Red Oxide</strong> pairs perfectly with neutral techwear.
                    </div>
                </div>
                <div className="p-3 bg-white/60 dark:bg-black/60 border-t border-border flex gap-2">
                    <Input className="bg-transparent border-none focus-visible:ring-0 shadow-none h-auto py-1" placeholder="Ask about style..." />
                    <button className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center hover:opacity-90">
                        <ArrowUp className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Product Details Panel */}
            <div className="glass-panel p-8 rounded-xl lg:rounded-2xl h-full flex flex-col shadow-xl shadow-slate-200/50 dark:shadow-black/20 bg-white/65 dark:bg-black/65 backdrop-blur-md border border-white/40 dark:border-white/10">
                <div className="flex flex-col gap-1 mb-6">
                    <div className="flex justify-between items-start">
                        <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-[1.1]">
                            Velocity Air<br/><span className="text-primary">2026</span>
                        </h1>
                        <Button variant="ghost" size="icon" className="hover:text-red-500">
                            <Heart className="h-6 w-6" />
                        </Button>
                    </div>
                    <p className="text-muted-foreground text-sm font-medium mt-2">Limited Edition • Carbon Neutral</p>
                </div>

                <div className="mb-8">
                    <span className="text-2xl font-bold font-mono tracking-tighter">$240.00</span>
                </div>

                {/* Color Selection */}
                <div className="mb-8">
                    <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-3 block">Colorway</label>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 rounded-full bg-red-500 ring-2 ring-offset-2 ring-primary ring-offset-background"></button>
                        <button className="w-10 h-10 rounded-full bg-foreground hover:ring-2 hover:ring-offset-2 hover:ring-muted-foreground transition-all"></button>
                        <button className="w-10 h-10 rounded-full bg-blue-200 hover:ring-2 hover:ring-offset-2 hover:ring-muted-foreground transition-all"></button>
                    </div>
                </div>

                 {/* Size Selection */}
                 <div className="mb-8 flex-1">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Select Size</label>
                        <button className="text-xs font-semibold text-primary underline">Size Guide</button>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {['US 7', 'US 8', 'US 9', 'US 10'].map((size) => (
                             <button key={size} className="h-12 rounded-lg border border-border flex items-center justify-center font-semibold hover:border-primary hover:text-primary transition-colors">
                                {size}
                             </button>
                        ))}
                    </div>

                    {/* AI Size Scout */}
                    <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-xl flex items-center gap-4 border border-blue-100 dark:border-blue-900">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/30">
                            <Ruler className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold">Smart Size Scout</h4>
                            <p className="text-xs text-muted-foreground">AI-powered fit recommendation.</p>
                        </div>
                        <Badge variant="outline" className="text-primary bg-background border-none cursor-pointer hover:bg-accent">Scan</Badge>
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                    <Button className="w-full h-14 rounded-full font-bold text-lg shadow-xl" size="lg">
                        Add to Bag - $240
                    </Button>
                    <p className="text-center text-xs text-muted-foreground mt-2">Free shipping & 30-day returns.</p>
                </div>
            </div>
        </aside>
      </main>
    </div>
  );
}
