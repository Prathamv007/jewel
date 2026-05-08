"use client";

import { useState, useEffect, use } from "react";
import Navbar from "@/components/ui/Navbar";
import { ChevronRight, Heart, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [quantity, setQuantity] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          // Check if item is already in cart to set initial quantity
          const cartItem = cart.find(i => i.id === resolvedParams.id);
          if (cartItem) setQuantity(cartItem.quantity);
        } else {
          console.error("Product not found");
        }
      } catch (err) {
        console.error("Failed to fetch product details", err);
      }
    };
    fetchProduct();
  }, [resolvedParams.id]);

  // Sync quantity if cart changes externally
  useEffect(() => {
    if (product) {
      const cartItem = cart.find(i => i.id === product.id);
      if (cartItem) {
        setQuantity(cartItem.quantity);
      } else if (quantity > 0 && !cartItem) {
        // If it was in cart but now removed
        setQuantity(0);
      }
    }
  }, [cart, product]);

  const handleAddToBag = () => {
    if (!product) return;
    
    // If quantity is 0, add at least 1
    const qtyToAdd = quantity === 0 ? 1 : quantity;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "",
      quantity: qtyToAdd,
      stock: product.stock,
    });
    
    if (quantity === 0) setQuantity(1);
  };

  const increment = () => {
    if (quantity < product.stock) {
      const newQty = quantity + 1;
      setQuantity(newQty);
      // If already in cart, update cart too for seamless experience
      const cartItem = cart.find(i => i.id === product.id);
      if (cartItem) {
        updateQuantity(product.id, newQty);
      }
    }
  };

  const decrement = () => {
    if (quantity > 0) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      // If already in cart, update cart too
      const cartItem = cart.find(i => i.id === product.id);
      if (cartItem) {
        if (newQty === 0) {
          // You might not want to auto-remove from cart just by clicking minus on product page,
          // but we'll follow the user's logic of showing count.
          // Let's keep it in cart but at qty 0? No, standard is removal or min 1.
          // The user specifically asked for "keep it 0 by default".
          updateQuantity(product.id, 0); 
        } else {
          updateQuantity(product.id, newQty);
        }
      }
    }
  };


  if (!product) return <div className="h-screen bg-background" />;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-32 lg:pt-48 container mx-auto px-6 lg:px-12 mb-32">
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-foreground/60 hover:text-foreground transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back to Collection
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        {/* Left: Product Imagery */}
        <div className="lg:col-span-7 space-y-12">
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1 }}
             className="relative aspect-square bg-[#fbf9f4] overflow-hidden flex items-center justify-center p-12"
           >
              {product.images?.[0] ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-8 drop-shadow-2xl"
                />
              ) : (
                <div className="text-sm opacity-20 uppercase tracking-widest">No Image Available</div>
              )}
           </motion.div>
           
           <div className="grid grid-cols-2 gap-12">
              {product.images?.slice(1).map((img: string, i: number) => (
                <div key={i} className="relative aspect-square bg-[#fbf9f4] p-12 overflow-hidden">
                   <img src={img} alt={product.name} className="w-full h-full object-contain p-4 opacity-60" />
                </div>
              ))}
           </div>
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-5 space-y-12 lg:sticky lg:top-48 h-fit">
           <div className="space-y-4">
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-accent italic">
                 <span>{product.category}</span>
                 <span className="w-8 h-[1px] bg-accent/30" />
                 <span>{product.material}</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-serif leading-tight">
                {product.name}
              </h1>
              <p className="text-xl font-light tracking-tight text-foreground/40 italic">
                 {formatPrice(product.price)}
              </p>
           </div>

           <div className="space-y-6">
              <p className="text-sm text-foreground/60 leading-relaxed max-w-sm">
                {product.description}
              </p>
              
              <ul className="text-[10px] uppercase tracking-[0.2em] font-bold space-y-2">
                 <li className="flex justify-between border-b border-foreground/5 py-2">
                    <span className="opacity-40">Primary Gem</span>
                    <span>{product.gemstone || "—"}</span>
                 </li>
                 <li className="flex justify-between border-b border-foreground/5 py-2">
                    <span className="opacity-40">Atelier ID</span>
                    <span>#{product.id.slice(0, 6)}</span>
                 </li>
              </ul>
           </div>

           {/* Purchase Interactions */}
           <div className="space-y-8 pt-8">
              {product.stock > 0 && product.stock < 5 && (
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-red-500 bg-red-50 p-3 flex items-center gap-2 border border-red-100">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  Only {product.stock} Creations Left in Atelier
                </div>
              )}

              <div className="flex items-center gap-8 border border-foreground/10 px-6 py-4 w-fit">
                 <button 
                  onClick={decrement} 
                  disabled={product.stock === 0 || quantity === 0}
                  className="hover:text-accent transition-colors disabled:opacity-20"
                >
                    <Minus size={14} />
                 </button>
                 <div className="flex flex-col items-center min-w-[20px]">
                    <span className="text-xs font-bold">{quantity}</span>
                 </div>
                 <button 
                  onClick={increment}
                  disabled={product.stock === 0 || quantity >= product.stock}
                  className="hover:text-accent transition-colors disabled:opacity-20 flex flex-col items-center"
                >
                    <Plus size={14} />
                 </button>
              </div>

              {quantity >= product.stock && product.stock > 0 && (
                <p className="text-[10px] uppercase tracking-widest font-bold text-accent animate-pulse">
                  Maximum Atelier Stock Reached ({product.stock} available)
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleAddToBag}
                    disabled={product.stock === 0}
                    className="btn-primary flex-1 flex items-center justify-center gap-3 disabled:bg-foreground/10 disabled:text-foreground/30 disabled:cursor-not-allowed"
                  >
                    {product.stock > 0 ? (
                      <>
                        <ShoppingBag size={14} />
                        {cart.some(i => i.id === product.id) ? "Update Atelier Bag" : "Add to Atelier Bag"}
                      </>
                    ) : (
                      "Sold Out"
                    )}
                  </button>
                 <button className="p-4 border border-foreground/10 flex items-center justify-center hover:bg-foreground hover:text-white transition-all">
                    <Heart size={16} />
                 </button>
              </div>

              <div className="pt-4">
                 <button className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent flex items-center gap-2 hover:translate-x-2 transition-transform">
                    {product.stock > 0 ? "Arrange Bespoke Appointment" : "Enquire About Re-Creations"} <ChevronRight size={12} />
                 </button>
              </div>
           </div>
        </div>
        </div>
      </section>
    </main>
  );
}
