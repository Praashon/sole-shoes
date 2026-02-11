"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useRef } from "react";
import { useCart } from "@/providers/cart-provider";
import { motion } from "framer-motion";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");
  const { clearCart } = useCart();
  const hasClearedCart = useRef(false);
  
  const order = useQuery(api.orders.getByPaymentIntent, paymentIntentId ? { paymentIntentId } : "skip");

  useEffect(() => {
    if (order && !hasClearedCart.current) {
        hasClearedCart.current = true;
        clearCart();
    }
  }, [order, clearCart]);

  if (!paymentIntentId || order === undefined) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
  }

  if (order === null) {
       return (
        <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4">
            <h1 className="text-xl font-bold">Order not found</h1>
            <p className="text-muted-foreground">Could not find order with this payment ID.</p>
            <Link href="/">
                <Button>Return Home</Button>
            </Link>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full text-center space-y-8"
        >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.2 }}
              className="flex justify-center"
            >
                <div className="h-24 w-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-500">
                    <CheckCircle2 className="h-12 w-12" />
                </div>
            </motion.div>
            
            <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Order Confirmed!</h1>
                <p className="text-muted-foreground text-lg">
                    Thank you for your purchase. Your order <span className="font-mono font-medium text-foreground">#{order.orderNumber}</span> has been received.
                </p>
                <p className="text-sm text-muted-foreground">
                    A confirmation has been sent to your email.
                </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 text-left space-y-4 shadow-sm">
                <h3 className="font-semibold border-b border-border pb-2">Order Summary</h3>
                <div className="space-y-2">
                    {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-sm text-muted-foreground">
                            <span>{item.name} (x{item.quantity})</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                
                <div className="pt-2 border-t border-border space-y-1">
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>Subtotal</span>
                        <span>${order.subtotal?.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>VAT (13%)</span>
                        <span>${order.vat?.toFixed(2)}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center text-lg font-bold pt-2 border-t border-border">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/shop" className="w-full">
                    <Button size="lg" className="w-full rounded-full gap-2">
                        <ShoppingBag className="h-4 w-4" />
                        Continue Shopping
                    </Button>
                </Link>
                <Link href="/" className="w-full">
                     <Button variant="outline" size="lg" className="w-full rounded-full">
                        Return Home
                    </Button>
                </Link>
            </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
