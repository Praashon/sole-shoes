"use client";

import { useCart } from "@/providers/cart-provider";
import { ArrowLeft, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { StripePaymentForm } from "@/components/checkout/StripePaymentForm";
import { useAction, useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const VAT_RATE = 0.13;

export default function CheckoutPage() {
  const { items, removeItem, cartTotal, clearCart } = useCart();
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState("");
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  
  const userDetails = useQuery(api.users.getUser, user ? { userId: user._id } : "skip");
  const updateProfile = useMutation(api.users.updateProfile);
  const createPaymentIntent = useAction(api.payments.createPaymentIntent);
  const createOrder = useMutation(api.orders.create);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (userDetails) {
      if (userDetails.firstName) setFirstName(userDetails.firstName);
      else if (userDetails.name) {
        const parts = userDetails.name.split(" ");
        if (parts.length > 0) setFirstName(parts[0]);
        if (parts.length > 1) setLastName(parts.slice(1).join(" "));
      }
      if (userDetails.lastName) setLastName(userDetails.lastName);
      if (userDetails.dob) setDob(userDetails.dob);
    }
  }, [userDetails]);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSaveProfile = async () => {
    if (!user || !firstName || !lastName || !dob) return;
    const age = calculateAge(dob);
    await updateProfile({ userId: user._id, firstName, lastName, dob, age });
  };

  useEffect(() => {
    const hasProfile = userDetails && userDetails.firstName && userDetails.dob;
    if (items.length > 0 && user && hasProfile) {
      const totalWithVat = Math.round(cartTotal * (1 + VAT_RATE) * 100);
      createPaymentIntent({ amount: totalWithVat, currency: "usd" })
        .then((data) => {
          if (data && data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        })
        .catch((err) => console.error("Error creating payment intent:", err));
    }
  }, [items, cartTotal, user, userDetails, createPaymentIntent]);

  const handleSuccess = async (paymentIntentId: string) => {
    if (!user) return;
    try {
      await createOrder({
        userId: user._id,
        items: items.map((item) => ({
          productId: item.id.toString(),
          name: item.name,
          quantity: item.quantity,
          size: item.size,
          price: item.price,
        })),
        total: parseFloat((cartTotal * (1 + VAT_RATE)).toFixed(2)),
        paymentIntentId,
      });
    } catch (err) {
      console.error("Error creating order:", err);
    }
    clearCart();
    router.push(`/checkout/success?payment_intent=${paymentIntentId}`);
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-40 pb-20 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/20" />
            <h1 className="text-2xl font-bold">Your bag is empty</h1>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Find something you like? Add it to your bag and come back here to check out.
            </p>
            <Link href="/shop">
              <Button className="rounded-full px-8 mt-2">Browse Shop</Button>
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const subtotal = cartTotal;
  const vatAmount = subtotal * VAT_RATE;
  const totalWithVat = subtotal + vatAmount;

  const appearance = {
    theme: "stripe" as const,
    variables: {
      colorPrimary: "#2b8cee",
      colorBackground: "#ffffff",
      colorText: "#1d1d1f",
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />

      <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-8"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Contact & Shipping */}
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <h2 className="text-lg font-semibold">Contact & Shipping</h2>
              <Input
                value={user.email}
                disabled
                className="bg-secondary/50 border-0 h-11 text-muted-foreground"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">First Name</label>
                  <Input
                    className="bg-secondary/50 border-0 h-11"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Last Name</label>
                  <Input
                    className="bg-secondary/50 border-0 h-11"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Address</label>
                <Input
                  className="bg-secondary/50 border-0 h-11"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">City</label>
                  <Input
                    className="bg-secondary/50 border-0 h-11"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Postal Code</label>
                  <Input
                    className="bg-secondary/50 border-0 h-11"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Profile Completion or Payment */}
            {!userDetails || !userDetails.firstName || !userDetails.dob ? (
              <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                <h2 className="text-lg font-semibold">Complete Your Profile</h2>
                <p className="text-sm text-muted-foreground">
                  We need a few details before we can process your order.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">First Name</label>
                    <Input
                      className="bg-secondary/50 border-0 h-11"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Last Name</label>
                    <Input
                      className="bg-secondary/50 border-0 h-11"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Date of Birth</label>
                  <Input
                    type="date"
                    className="bg-secondary/50 border-0 h-11"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={!firstName || !lastName || !dob}
                  className="w-full h-11 rounded-full"
                >
                  Save & Continue
                </Button>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                <h2 className="text-lg font-semibold">Payment</h2>
                {clientSecret && (
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance }}
                  >
                    <StripePaymentForm
                      total={totalWithVat}
                      onSuccess={handleSuccess}
                    />
                  </Elements>
                )}
                {!clientSecret && (
                  <div className="flex items-center justify-center py-8 gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Preparing payment...</span>
                  </div>
                )}
              </div>
            )}
          </motion.div>

          {/* Right Column: Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24 space-y-6">
              <h2 className="text-lg font-semibold">
                Your Bag ({items.length})
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="h-20 w-20 bg-secondary rounded-xl overflow-hidden flex items-center justify-center p-2 relative shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="object-contain w-full h-full"
                      />
                      <span className="absolute -top-1 -right-1 bg-foreground text-background text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Size {item.size}
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="text-muted-foreground hover:text-red-500 transition-colors self-start p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">VAT (13%)</span>
                  <span>${vatAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-3 border-t border-border">
                  <span>Total</span>
                  <span>${totalWithVat.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
