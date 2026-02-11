"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/styles/cn";

interface ProductCardProps {
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  isNew?: boolean;
  isSale?: boolean;
  originalPrice?: number;
}

export function ProductCard({
  name,
  price,
  category,
  imageUrl,
  isNew,
  isSale,
  originalPrice,
}: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col rounded-2xl bg-card p-4 shadow-apple-card hover:shadow-apple-hover transition-all duration-300 cursor-pointer border border-border/50"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-secondary mb-4">
        {isNew && (
          <span className="absolute top-3 left-3 z-10 rounded-md bg-white/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur-md shadow-sm">
            New
          </span>
        )}
        {isSale && (
          <span className="absolute top-3 left-3 z-10 rounded-md bg-red-500 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            Sale
          </span>
        )}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur text-black shadow-sm hover:bg-primary hover:text-white transition-colors">
            <Heart className="h-4 w-4" />
          </button>
        </div>
        <div className="h-full w-full relative">
            <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
            />
        </div>
      </div>
      <div className="flex flex-col gap-1 px-1">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h3>
          <div className="flex flex-col items-end">
            <span className={cn("text-sm font-semibold text-foreground", isSale && "text-red-500")}>
              ${price}
            </span>
            {isSale && originalPrice && (
                <span className="text-xs text-muted-foreground line-through">${originalPrice}</span>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{category}</p>
      </div>
    </motion.div>
  );
}
