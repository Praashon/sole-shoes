"use client";

import Link from "next/link";
import { Footprints, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <Footprints className="h-20 w-20 mx-auto text-primary/20" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-8xl md:text-9xl font-black tracking-tightest bg-gradient-to-b from-foreground to-foreground/20 bg-clip-text text-transparent"
        >
          404
        </motion.h1>

        <div>
          <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Looks like this pair walked off. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="rounded-full gap-2 px-6">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/shop">
            <Button className="rounded-full gap-2 px-6">
              <ShoppingBag className="h-4 w-4" />
              Shop
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
