"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  material?: string;
  isAntiTarnish?: boolean;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center space-y-6">
        <h1 className="font-serif text-3xl">Piece Not Found</h1>
        <Link href="/shop" className="text-xs uppercase tracking-widest border-b border-foreground pb-1">
          Return to Boutique
        </Link>
      </div>
    );
  }

  const cartItem = cart.find((item) => item._id === product._id);

  const handleAddToCart = () => {
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop",
      quantity: 1,
      stock: product.stock,
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-foreground/60 hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back to Collection
        </Link>

        <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="aspect-[4/5] relative bg-[#fbf9f4]">
              <Image
                src={(product.images && product.images.length > 0) ? product.images[0] : "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 font-bold">
                    {product.category} Series
                  </span>
                  {product.isAntiTarnish && (
                    <>
                      <div className="w-1 h-1 rounded-full bg-foreground/10" />
                      <span className="text-[9px] uppercase tracking-[0.2em] text-foreground/40 font-bold">
                        Anti-Tarnish
                      </span>
                    </>
                  )}
                </div>
                <h1 className="font-serif text-4xl lg:text-5xl leading-tight text-foreground">
                  {product.name}
                </h1>
                <p className="text-xl font-bold tracking-widest text-accent">
                  {formatPrice(product.price)}
                </p>
              </div>

              <div className="w-12 h-[1px] bg-foreground/10 my-8" />

              <p className="text-foreground/70 leading-relaxed font-light text-sm">
                {product.description || "A breathtaking piece capturing the essence of our artisanal heritage. Meticulously crafted for those who embrace architectural elegance."}
              </p>

              {/* Action Area */}
              <div className="pt-8">
                {!cartItem ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-foreground text-white py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-accent transition-colors flex items-center justify-center gap-3"
                  >
                    <ShoppingBag size={16} /> Add to Bag
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-between border border-foreground/20 p-2">
                    <button 
                      onClick={() => {
                        if (cartItem.quantity === 1) {
                          removeFromCart(product._id);
                        } else {
                          updateQuantity(product._id, cartItem.quantity - 1);
                        }
                      }}
                      className="px-6 py-3 hover:bg-foreground/5 transition-colors"
                    >-</button>
                    <span className="text-sm font-bold">{cartItem.quantity} In Bag</span>
                    <button 
                      onClick={() => updateQuantity(product._id, cartItem.quantity + 1)}
                      className="px-6 py-3 hover:bg-foreground/5 transition-colors"
                    >+</button>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-foreground/10 space-y-4">
                <div className="flex justify-between text-xs tracking-wider uppercase text-foreground/60">
                  <span>Material</span>
                  <span className="font-bold text-foreground">{product.material || "18K Solid Gold"}</span>
                </div>
                <div className="flex justify-between text-xs tracking-wider uppercase text-foreground/60">
                  <span>Availability</span>
                  <span className="font-bold text-foreground">
                    {product.stock > 0 ? "In Stock - Ships in 48h" : "Made to Order"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
