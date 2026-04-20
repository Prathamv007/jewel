"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingBag, User, Menu, X, Gem, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import CartDrawer from "./CartDrawer";
import { motion, AnimatePresence } from "framer-motion";

const CURRENCIES = [
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
] as const;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const currencyRef = useRef<HTMLDivElement>(null);
  const { cart } = useCart();
  const { currency, setCurrency } = useCurrency();

  const activeCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-500 px-6 lg:px-12 py-6",
          isScrolled ? "bg-white/80 backdrop-blur-xl border-b border-foreground/5 py-4" : "bg-transparent"
        )}
      >
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 border border-accent flex items-center justify-center p-1.5 group-hover:bg-accent transition-all duration-500">
              <Gem className="text-accent group-hover:text-white transition-colors" size={16} />
            </div>
            <span className="text-xl font-serif tracking-tighter uppercase font-medium text-foreground">Vedika</span>
          </Link>

          <div className="hidden lg:flex items-center gap-12 text-[10px] uppercase tracking-[0.3em] font-bold">
            <Link href="/shop" className="hover:text-accent transition-colors">Collections</Link>
            <Link href="/bespoke" className="hover:text-accent transition-colors">Bespoke</Link>
            <Link href="/atelier" className="hover:text-accent transition-colors">Atelier</Link>
            <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block" ref={currencyRef}>
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold hover:text-accent transition-colors"
              >
                <span>{activeCurrency.code} {activeCurrency.symbol}</span>
                <ChevronDown size={10} className={cn("transition-transform duration-200", isCurrencyOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isCurrencyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-3 w-52 bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-foreground/5 overflow-hidden py-2 z-[200]"
                  >
                    <p className="px-4 py-2 text-[9px] uppercase tracking-[0.2em] font-bold opacity-30 text-foreground">
                      Select Currency
                    </p>
                    {CURRENCIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code as any);
                          setIsCurrencyOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-3 flex items-center justify-between hover:bg-[#fbf9f4] transition-colors",
                          currency === c.code && "bg-accent/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-base font-serif text-accent w-5 text-center">{c.symbol}</span>
                          <div className="text-foreground">
                            <p className="text-xs font-bold tracking-wide">{c.label}</p>
                            <p className="text-[9px] uppercase tracking-widest opacity-40">{c.code}</p>
                          </div>
                        </div>
                        {currency === c.code && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/account" className="hidden sm:flex hover:text-accent transition-colors text-foreground">
              <User size={18} strokeWidth={1.5} />
            </Link>
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 hover:text-accent transition-colors relative text-foreground"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-accent text-[8px] text-white flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="lg:hidden text-foreground" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-32 px-12 lg:hidden flex flex-col gap-12 text-2xl font-serif text-foreground"
          >
            <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>The Collections</Link>
            <Link href="/bespoke" onClick={() => setIsMobileMenuOpen(false)}>Bespoke Jewelry</Link>
            <Link href="/atelier" onClick={() => setIsMobileMenuOpen(false)}>Our Atelier</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
            <Link href="/account" onClick={() => setIsMobileMenuOpen(false)}>User Profile</Link>
            <div className="flex gap-4 mt-4">
              {CURRENCIES.map(c => (
                <button
                  key={c.code}
                  onClick={() => setCurrency(c.code as any)}
                  className={cn(
                    "px-4 py-2 text-sm font-sans border transition-colors",
                    currency === c.code ? "bg-accent text-white border-accent" : "border-foreground/10 hover:border-accent"
                  )}
                >
                  {c.symbol} {c.code}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
