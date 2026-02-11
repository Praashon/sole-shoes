import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { CartProvider } from "@/providers/cart-provider";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { AuthProvider } from "@/providers/auth-provider";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sole Shoes",
  description: "Premium footwear for the modern era.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <ConvexClientProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
