"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import Navbar from "@/components/ui/Navbar";
import { ChevronRight, Globe, Lock, MapPin, Truck } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const { cart, total } = useCart();
  const { formatPrice } = useCurrency();
  const [gateway, setGateway] = useState<"stripe" | "razorpay">("stripe");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    country: "India",
  });

  const handleCheckout = async () => {
     setLoading(true);
     try {
        const endpoint = gateway === "stripe" ? "/api/checkout/stripe" : "/api/checkout/razorpay";
        const res = await fetch(endpoint, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
              items: cart,
              shippingDetails: formData
           })
        });

        const data = await res.json();
        if (gateway === "stripe") {
           window.location.href = data.url;
        } else {
           // Razorpay flow integration placeholder
           alert("Razorpay Order Created: " + data.id);
           setLoading(false);
        }
     } catch (err) {
        console.error(err);
        setLoading(false);
     }
  };

  if (cart.length === 0) return (
     <main className="h-screen flex flex-col items-center justify-center space-y-6">
        <Navbar />
        <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Your Bag is empty for checkout</p>
        <button className="btn-primary" onClick={() => window.location.href = "/shop"}>Explore Creations</button>
     </main>
  );

  return (
    <main className="min-h-screen bg-[#fbf9f4]">
      <Navbar />
      
      <section className="pt-40 pb-20 container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* Left: Shipping & Gateway Selection */}
        <div className="lg:col-span-7 space-y-16">
           <div className="space-y-8">
              <h1 className="text-4xl font-serif">Checkout Detail</h1>
              
              <div className="space-y-6">
                 <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-accent">
                    <MapPin size={14} /> <span>Shipping Destination</span>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Full Name</label>
                       <input 
                         required
                         className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors"
                         value={formData.name}
                         onChange={e => setFormData({...formData, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Email Address</label>
                       <input 
                         required
                         type="email"
                         className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors"
                         value={formData.email}
                         onChange={e => setFormData({...formData, email: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Street Address</label>
                    <input 
                      required
                      className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors"
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                    />
                 </div>
              </div>
           </div>

           {/* Gateway Selection: High-end Toggles */}
           <div className="space-y-8">
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-accent">
                 <Lock size={14} /> <span>Secure Transaction Gateway</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <button 
                   onClick={() => setGateway("stripe")}
                   className={cn(
                     "flex flex-col gap-4 p-8 border text-left transition-all group",
                     gateway === "stripe" ? "border-accent bg-accent/5" : "border-foreground/5 bg-white opacity-40 hover:opacity-100"
                   )}
                 >
                    <div className="flex justify-between items-start">
                       <Globe size={18} className={gateway === "stripe" ? "text-accent" : ""} />
                       {gateway === "stripe" && <div className="w-2 h-2 rounded-full bg-accent" />}
                    </div>
                    <div>
                       <p className="text-[10px] uppercase tracking-widest font-bold">International Delivery</p>
                       <p className="text-[9px] opacity-40 font-medium">Powered by Stripe • USD Payments</p>
                    </div>
                 </button>

                 <button 
                   onClick={() => setGateway("razorpay")}
                   className={cn(
                     "flex flex-col gap-4 p-8 border text-left transition-all group",
                     gateway === "razorpay" ? "border-accent bg-accent/5" : "border-foreground/5 bg-white opacity-40 hover:opacity-100"
                   )}
                 >
                    <div className="flex justify-between items-start">
                       <Truck size={18} className={gateway === "razorpay" ? "text-accent" : ""} />
                       {gateway === "razorpay" && <div className="w-2 h-2 rounded-full bg-accent" />}
                    </div>
                    <div>
                       <p className="text-[10px] uppercase tracking-widest font-bold">India Domestic</p>
                       <p className="text-[9px] opacity-40 font-medium">Powered by Razorpay • INR Payments</p>
                    </div>
                 </button>
              </div>
           </div>
        </div>

        {/* Right: Atelier Bag Summary */}
        <div className="lg:col-span-5 h-fit lg:sticky lg:top-48">
           <div className="bg-[#1b1c19] text-white p-12 space-y-12">
              <h2 className="text-2xl font-serif">Order Summary</h2>
              
              <div className="space-y-6 max-h-[300px] overflow-y-auto no-scrollbar pr-4">
                 {cart.map((item) => (
                    <div key={item._id} className="flex justify-between items-center gap-4">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/5 p-1 relative">
                             <Image src={item.image} alt={item.name} fill className="object-contain" />
                          </div>
                          <div>
                             <p className="text-[9px] uppercase tracking-widest font-bold">{item.name}</p>
                             <p className="text-[8px] opacity-40 uppercase tracking-widest">Qty: {item.quantity}</p>
                          </div>
                       </div>
                       <span className="text-xs font-serif text-accent">{formatPrice(item.price)}</span>
                    </div>
                 ))}
              </div>

              <div className="pt-12 border-t border-white/5 space-y-8">
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold opacity-40">
                       <span>Shipping</span>
                       <span>Complimentary</span>
                    </div>
                    <div className="flex justify-between text-2xl font-serif">
                       <span>Total</span>
                       <span className="text-accent">{formatPrice(total)}</span>
                    </div>
                 </div>

                 <button 
                   disabled={loading}
                   onClick={handleCheckout}
                   className="w-full btn-secondary py-6 uppercase tracking-[0.2em] font-bold text-[10px] flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    {loading ? "Preparing Transaction..." : `Begin ${gateway.toUpperCase()} Checkout`}
                    <ChevronRight size={14} />
                 </button>
                 
                 <p className="text-[8px] text-center uppercase tracking-widest opacity-30 font-medium max-w-[200px] mx-auto">
                    Secure checkout with industrial grade 256-bit encryption. Authenticity guaranteed.
                 </p>
              </div>
           </div>
        </div>
      </section>
    </main>
  );
}
