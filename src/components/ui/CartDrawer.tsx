"use client";

import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const { formatPrice } = useCurrency();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.aside 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1b1c19] text-white z-[101] flex flex-col"
          >
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <ShoppingBag size={18} className="text-accent" />
                  <h2 className="text-xl font-serif">Atelier Bag</h2>
               </div>
               <button onClick={onClose} className="hover:text-accent transition-colors"><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
               {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-40">
                     <p className="text-[10px] uppercase tracking-[0.4em] font-bold">The Bag is Empty</p>
                     <button onClick={onClose} className="text-[10px] uppercase tracking-widest underline decoration-accent/30">Continue Exploring</button>
                  </div>
               ) : (
                  cart.map((item) => (
                     <div key={item.id} className="flex gap-6 group">
                        <div className="w-24 h-24 bg-white/5 p-2 overflow-hidden relative shrink-0">
                           {item.image ? (
                             <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-[8px] opacity-30">No img</div>
                           )}
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                           <div className="flex justify-between items-start">
                              <div>
                                 <p className="text-[10px] uppercase tracking-widest font-bold mb-1">{item.name}</p>
                                 <p className="text-xs font-serif italic text-accent">{formatPrice(item.price)}</p>
                              </div>
                              <button onClick={() => removeFromCart(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400">
                                 <Trash2 size={12} />
                              </button>
                           </div>
                           <div className="flex items-center gap-6 border border-white/10 w-fit px-3 py-2 text-[10px] font-bold">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={10} /></button>
                              <span>{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                className="disabled:opacity-20"
                              >
                                <Plus size={10} />
                              </button>
                           </div>
                        </div>
                     </div>
                  ))
               )}
            </div>

            <div className="p-8 space-y-6 border-t border-white/5 bg-[#161714]">
               <div className="flex justify-between items-end">
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">Estimate Total</span>
                  <span className="text-2xl font-serif text-accent">{formatPrice(total)}</span>
               </div>
               <Link 
                  href="/checkout" 
                  onClick={onClose}
                  className={cart.length === 0 ? "pointer-events-none opacity-50 block" : "block"}
               >
                  <button className="w-full btn-secondary text-white font-bold tracking-[0.2em] uppercase text-[10px] py-6">
                    Proceed to Atelier Checkout
                  </button>
               </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
