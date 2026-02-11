"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Loader2, Command } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

function scoreMatch(product: { name: string; brand: string; category: string; description: string }, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  if (product.name.toLowerCase().includes(q)) score += 10;
  if (product.name.toLowerCase().startsWith(q)) score += 5;
  if (product.brand.toLowerCase().includes(q)) score += 6;
  if (product.category.toLowerCase().includes(q)) score += 4;
  if (product.description.toLowerCase().includes(q)) score += 2;
  if (fuzzyMatch(product.name, query)) score += 3;
  return score;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setDebouncedQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const products = useQuery(api.products.get);

  const results = debouncedQuery.length > 0
    ? (products ?? [])
        .map(p => ({ ...p, score: scoreMatch(p, debouncedQuery) }))
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
    : [];

  useEffect(() => {
    setSelectedIndex(0);
  }, [debouncedQuery]);

  const handleSelect = useCallback((id: string) => {
    router.push(`/product/${id}`);
    onClose();
  }, [router, onClose]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]._id);
      }
    }
  }, [results, selectedIndex, handleSelect]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] p-0 bg-background/95 backdrop-blur-xl border-border overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>

        <div className="flex items-center border-b border-border px-4 h-14" onKeyDown={handleKeyDown}>
          <SearchIcon className="mr-3 h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            placeholder="Search shoes..."
            className="flex-1 border-none bg-transparent focus-visible:ring-0 text-base placeholder:text-muted-foreground/40 h-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-secondary/50 px-1.5 text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-[360px] overflow-y-auto">
          {!query && (
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground/40">
              <p className="text-sm">Type to search products</p>
            </div>
          )}

          {query && !products && (
            <div className="flex items-center justify-center h-[200px]">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {query && products && results.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No results for &ldquo;{query}&rdquo;</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-2"
              >
                {results.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    data-selected={i === selectedIndex}
                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors hover:bg-secondary/50 data-[selected=true]:bg-secondary/60"
                    onClick={() => handleSelect(product._id)}
                    onMouseEnter={() => setSelectedIndex(i)}
                  >
                    <div className="h-10 w-10 bg-secondary rounded-lg overflow-hidden relative shrink-0">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {product.brand} · {product.category}
                      </p>
                    </div>
                    <span className="text-sm font-semibold shrink-0 tabular-nums">
                      ${product.price}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer hint */}
        <div className="border-t border-border px-4 py-2.5 flex items-center justify-between text-[11px] text-muted-foreground/50">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-4 items-center rounded border border-border/50 px-1 text-[10px]">↑</kbd>
              <kbd className="inline-flex h-4 items-center rounded border border-border/50 px-1 text-[10px]">↓</kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-4 items-center rounded border border-border/50 px-1 text-[10px]">↵</kbd>
              open
            </span>
          </div>
          <span
            className="cursor-pointer hover:text-muted-foreground transition-colors"
            onClick={() => {
              router.push("/shop");
              onClose();
            }}
          >
            Browse all →
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
