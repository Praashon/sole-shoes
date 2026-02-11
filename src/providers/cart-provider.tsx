"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  size: number;
  quantity: number;
  color?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => boolean; // Return success status
  removeItem: (id: number, size: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  getStock: (id: number, size: number) => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // Mock stock state: Key is "id-size", value is stock count (default 100)
  const [stock, setStock] = useState<Record<string, number>>({});

  // Load from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("sole-cart");
    const savedStock = localStorage.getItem("sole-stock");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
    if (savedStock) {
        try {
            setStock(JSON.parse(savedStock));
        } catch (e) {
             console.error("Failed to parse stock", e);
        }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("sole-cart", JSON.stringify(items));
    localStorage.setItem("sole-stock", JSON.stringify(stock));
  }, [items, stock]);

  const getStock = (id: number, size: number) => {
      const key = `${id}-${size}`;
      return stock[key] !== undefined ? stock[key] : 100;
  };

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    const key = `${newItem.id}-${newItem.size}`;
    const currentStock = stock[key] !== undefined ? stock[key] : 100;

    if (currentStock <= 0) return false;

    // Decrease stock
    setStock(prev => ({
        ...prev,
        [key]: (prev[key] !== undefined ? prev[key] : 100) - 1
    }));

    setItems((prev) => {
      const existing = prev.find(
        (item) => item.id === newItem.id && item.size === newItem.size
      );
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    return true;
  };

  const removeItem = (id: number, size: number) => {
    // Optional: Restore stock when removing? User didn't ask, but logical. 
    // For now, let's keep it simple as user just asked to decrease stock.
    setItems((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, cartCount, cartTotal, getStock }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
