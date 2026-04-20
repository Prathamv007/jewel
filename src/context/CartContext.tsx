"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, q: number) => void;
  clearCart: () => void;
  total: number;
  notification: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  // LocalStorage persistence for the 'Atelier Bag'
  useEffect(() => {
    const saved = localStorage.getItem("vedika_cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("vedika_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists) {
        const newQty = exists.quantity + item.quantity;
        if (newQty > item.stock) {
          setNotification(`Only ${item.stock} pieces available in our Atelier.`);
          setTimeout(() => setNotification(null), 3000);
          return prev;
        }
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: newQty } : i
        );
      }
      return [...prev, item];
    });
    
    setNotification(`${item.name} added to Bag`);
    setTimeout(() => setNotification(null), 3000);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const updateQuantity = (id: string, q: number) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i._id === id) {
          if (q > i.stock) {
            setNotification(`Maximum Atelier stock reached for this piece.`);
            setTimeout(() => setNotification(null), 3000);
            return i;
          }
          return { ...i, quantity: Math.max(1, q) };
        }
        return i;
      })
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, notification }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
