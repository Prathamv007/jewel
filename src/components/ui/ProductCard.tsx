"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Star } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    stock: number;
    featured?: boolean;
    isAntiTarnish?: boolean;
  };
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { formatPrice } = useCurrency();
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  
  const cartItem = cart.find(item => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      stock: product.stock
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="group relative"
    >
      <Link href={`/shop/${product.id}`} className="block">
        {/* Architectural Image Container */}
        <div className="relative aspect-square overflow-hidden bg-[#fbf9f4] mb-6">
          <Image
            src={product.images[0] || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          
          {/* Subtle Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.featured && (
              <span className="bg-accent/90 text-white text-[8px] uppercase tracking-[0.2em] font-bold px-2 py-1 flex items-center gap-1">
                <Star size={8} fill="currentColor" /> Artisan Choice
              </span>
            )}
            {product.isAntiTarnish && (
              <span className="bg-foreground text-white text-[8px] uppercase tracking-[0.2em] font-bold px-2 py-1">
                Anti-Tarnish
              </span>
            )}
          </div>
        </div>

        {/* Product Details: Minimal & Serif */}
        <div className="space-y-4 px-1">
          <div>
            <div className="flex justify-between items-start gap-4 mb-1.5">
              <h3 className="font-serif text-lg leading-tight group-hover:text-accent transition-colors">
                {product.name}
              </h3>
              <span className="text-[11px] font-bold tracking-widest uppercase text-accent/80 whitespace-nowrap">
                {formatPrice(product.price)}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
               <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 font-bold">
                 {product.category} Series
               </span>
               <div className="w-1 h-1 rounded-full bg-foreground/10" />
               <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 italic">
                 Fine Jewelry
               </span>
            </div>
          </div>

          {/* Add to Bag / Quantity Controls */}
          <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="mt-4">
            {!cartItem ? (
              <button
                onClick={handleAddToCart}
                className="w-full bg-foreground text-white py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-accent transition-colors"
              >
                Add to Bag
              </button>
            ) : (
              <div className="w-full flex items-center justify-between border border-foreground/10 p-1">
                <button 
                  onClick={() => {
                    if (cartItem.quantity === 1) {
                      removeFromCart(product.id);
                    } else {
                      updateQuantity(product.id, cartItem.quantity - 1);
                    }
                  }}
                  className="px-4 py-2 hover:bg-foreground/5 transition-colors"
                >-</button>
                <span className="text-xs font-bold">{cartItem.quantity}</span>
                <button 
                  onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                  disabled={cartItem.quantity >= product.stock}
                  className="px-4 py-2 hover:bg-foreground/5 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                >+</button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
