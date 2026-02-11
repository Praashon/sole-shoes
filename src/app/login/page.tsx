"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footprints, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
        await login(email, password);
        router.push("/");
    } catch (err) {
        setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Branding & Visual */}
      <div className="hidden lg:flex relative bg-black items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-50"></div>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-white max-w-lg"
        >
            <h1 className="text-6xl font-black tracking-tighter mb-6">Sole<br/>Shoes.</h1>
            <p className="text-xl font-light text-white/80">
                Join the community of trendsetters. Experience premium footwear designed for the future.
            </p>
        </motion.div>
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full max-w-md space-y-8"
        >
            <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.3 }}
                  className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center mb-4 text-white"
                >
                    <Footprints className="h-6 w-6" />
                </motion.div>
                <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                <p className="text-muted-foreground mt-2">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded"
                  >
                    {error}
                  </motion.div>
                )}
                
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email" 
                        placeholder="name@example.com" 
                        type="email" 
                        className="h-11" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</Link>
                    </div>
                    <Input 
                        id="password" 
                        type="password" 
                        className="h-11"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>
                
                <Button disabled={isLoading} className="w-full h-11 rounded-lg font-bold text-base">
                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Sign In"}
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button type="button" variant="outline" className="h-11">Google</Button>
                    <Button type="button" variant="outline" className="h-11">Apple</Button>
                </div>
            </form>

            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-primary hover:underline">
                    Sign up
                </Link>
            </p>
        </motion.div>
      </div>
    </div>
  );
}
