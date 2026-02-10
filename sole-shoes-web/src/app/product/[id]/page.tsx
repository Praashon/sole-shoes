"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useState, use } from "react";
import Image from "next/image";
import { Star, Truck, ShieldCheck, ArrowRight, Box, Check, ShoppingBag, Loader2, MessageSquare } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/data";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const productId = parseInt(id);
  const product = products.find(p => p.id === productId) || products[0];
  const { addItem, getStock } = useCart();
  const { user } = useAuth();

  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // Reviews
  const reviews = useQuery(api.reviews.getByProduct, { productId: product.id });
  const addReview = useMutation(api.reviews.add);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const currentStock = selectedSize ? getStock(product.id, selectedSize) : null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      const sizeGrid = document.getElementById("size-grid");
      if (sizeGrid) {
        sizeGrid.classList.add("animate-shake", "border-red-500", "border-2");
        setTimeout(() => sizeGrid.classList.remove("animate-shake", "border-red-500", "border-2"), 500);
      }
      return;
    }

    setIsAdding(true);
    setTimeout(() => {
      const success = addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        size: selectedSize
      });

      if (success) {
        setIsAdding(false);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      } else {
        setIsAdding(false);
      }
    }, 400);
  };

  const handleSubmitReview = async () => {
    if (!user || !reviewComment.trim()) return;
    setIsSubmitting(true);
    try {
      const displayName = user.name || user.email.split("@")[0];

      await addReview({
        productId: product.id,
        userName: displayName,
        userEmail: user.email,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviewComment("");
      setReviewRating(5);
      setShowReviewForm(false);
    } catch (err) {
      console.error("Error submitting review:", err);
    }
    setIsSubmitting(false);
  };

  const avgRating = reviews && reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating.toString();

  const reviewCount = reviews ? reviews.length : product.reviews;

  const formatDate = (ts: number) => {
    const diff = Date.now() - ts;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-20">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left: Image Gallery (Sticky) */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="relative aspect-square w-full bg-[#f5f5f7] dark:bg-secondary/20 rounded-2xl overflow-hidden"
            >
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-contain p-8 mix-blend-multiply dark:mix-blend-normal"
                priority
              />
            </motion.div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative aspect-square rounded-xl overflow-hidden bg-[#f5f5f7] dark:bg-secondary/20 transition-all duration-200 ${
                    activeImage === idx ? "ring-1 ring-foreground opacity-100" : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`View ${idx + 1}`}
                    fill
                    className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details & Actions */}
          <div className="flex flex-col">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-2">{product.brand}</p>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">{product.name}</h1>
                <div className="flex items-baseline gap-3 mb-6">
                     <p className="text-xl font-semibold">${product.price}</p>
                     {product.originalPrice && (
                       <p className="text-sm text-muted-foreground line-through">${product.originalPrice}</p>
                     )}
                     <div className="flex items-center gap-1 text-sm ml-auto">
                        <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
                        <span className="font-medium">{avgRating}</span>
                        <span className="text-muted-foreground">({reviewCount})</span>
                     </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-8">
                  {product.description}
                </p>

                {/* Size Selector */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium">Size</span>
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">Size Guide</button>
                  </div>
                  <div id="size-grid" className="grid grid-cols-5 gap-2.5 rounded-xl transition-all">
                    {product.sizes.map((size) => {
                        const stock = getStock(product.id, size);
                        const isOutOfStock = stock <= 0;
                        return (
                          <button
                            key={size}
                            onClick={() => !isOutOfStock && setSelectedSize(size)}
                            disabled={isOutOfStock}
                            className={cn(
                                "h-11 rounded-lg text-sm font-medium transition-all duration-200 border",
                                selectedSize === size 
                                    ? "border-foreground bg-foreground text-background" 
                                    : "border-border bg-transparent text-foreground hover:border-foreground/40",
                                isOutOfStock && "opacity-30 cursor-not-allowed line-through"
                            )}
                          >
                            {size}
                          </button>
                        );
                    })}
                  </div>
                  {selectedSize && (
                      <p className="text-xs text-muted-foreground mt-2">
                          {getStock(product.id, selectedSize) < 10 && <span className="text-orange-500">Only {getStock(product.id, selectedSize)} left</span>}
                          {getStock(product.id, selectedSize) >= 10 && <span className="text-green-600">In stock</span>}
                      </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <Button 
                    size="lg" 
                    className={cn(
                        "w-full h-12 rounded-full font-semibold transition-all duration-300 relative overflow-hidden",
                        isAdded ? "bg-green-600 hover:bg-green-700 text-white" : ""
                    )}
                    onClick={handleAddToCart}
                    disabled={isAdding}
                  >
                     <span className={cn("flex items-center gap-2 transition-all", isAdded ? "-translate-y-[150%]" : "translate-y-0")}>
                        {isAdding ? "Adding..." : "Add to Bag"}
                     </span>
                     <span className={cn("absolute inset-0 flex items-center justify-center gap-2 transition-all", isAdded ? "translate-y-0" : "translate-y-[150%]")}>
                        <Check className="h-5 w-5" />
                        Added
                     </span>
                  </Button>
                  
                  <Link href="/stage" className="w-full">
                    <Button variant="outline" size="lg" className="w-full h-12 rounded-full gap-2 border hover:bg-secondary/50 transition-colors">
                        <Box className="h-4 w-4" />
                        View in 3D
                    </Button>
                  </Link>
                </div>
                
                {/* Shipping Info */}
                <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-3">
                        <Truck className="h-4 w-4" />
                        <span>Free delivery over $100</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-4 w-4" />
                        <span>30-day returns</span>
                    </div>
                </div>
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-20 border-t border-border pt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Reviews</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {reviewCount} reviews · {avgRating} average
              </p>
            </div>
            {user ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-2"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Write a Review
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="rounded-full gap-2">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Log in to Review
                </Button>
              </Link>
            )}
          </div>

          {/* Review Form (login-gated) */}
          <AnimatePresence>
            {showReviewForm && user && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-0.5 transition-transform hover:scale-110"
                        >
                          <Star
                            className={cn(
                              "h-6 w-6 transition-colors",
                              (hoverRating || reviewRating) >= star
                                ? "fill-yellow-500 text-yellow-500"
                                : "text-muted-foreground/30"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Your review</label>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      rows={3}
                      placeholder="What did you think of this shoe?"
                      className="w-full bg-secondary/50 border-0 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={handleSubmitReview}
                      disabled={isSubmitting || !reviewComment.trim()}
                      className="rounded-full px-6"
                      size="sm"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews List */}
          {!reviews ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-sm">No reviews yet. Be the first to share your thoughts.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review, i) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-xl border border-border bg-card p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{review.userName}</p>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, r) => (
                              <Star key={r} className={cn("h-3 w-3", r < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/20")} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground/50 shrink-0">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
