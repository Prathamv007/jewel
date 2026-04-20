"use client";

import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShoppingBag } from "lucide-react";

export default function CartNotification() {
  const { notification } = useCart();

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 20, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-[201] w-full max-w-sm px-4 text-center"
        >
          <div className="bg-[#1b1c19]/95 backdrop-blur-md text-white py-4 px-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-accent/20 flex flex-col items-center text-center gap-1">
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent">
              {notification.includes('available') || notification.includes('stock') ? 'Inventory Alert' : 'Atelier Bag Update'}
            </p>
            <p className="text-xs font-serif italic opacity-90">{notification.replace(' added to Bag', '')}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
