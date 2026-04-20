"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="pt-24 pb-12 bg-muted/20 border-t border-foreground/5 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24">
        {/* Brand Section */}
        <div className="lg:col-span-2 space-y-10 group">
          <div className="space-y-4">
            <h3 className="font-serif text-5xl tracking-tighter transition-all duration-700 group-hover:tracking-normal group-hover:text-accent">VEDIKA</h3>
            <div className="w-12 h-[1px] bg-accent/30 transition-all duration-700 group-hover:w-24" />
          </div>
          <p className="text-base text-foreground/40 max-w-sm leading-relaxed font-light">
            Luxury jewelry, architecturally conceived and ethically born.
            Bridging the gap between heritage craftsmanship and the future of the digital atelier.
          </p>
        </div>

        {/* Links: Atelier */}
        <div className="space-y-8">
          <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-foreground/30">Atelier</h4>
          <ul className="space-y-4 text-xs tracking-widest font-bold">
            <li>
              <Link href="/atelier" className="hover:text-accent transition-all duration-300 hover:pl-2">Our Heritage</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-accent transition-all duration-300 hover:pl-2">Consultations</Link>
            </li>
            <li>
              <Link href="/atelier" className="hover:text-accent transition-all duration-300 hover:pl-2">Craftsmanship</Link>
            </li>
            <li className="opacity-40 cursor-default">Jewelry Care</li>
          </ul>
        </div>

        {/* Links: Concierge */}
        <div className="space-y-8">
          <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-foreground/30">Concierge</h4>
          <ul className="space-y-4 text-xs tracking-widest font-bold">
            <li className="opacity-40 cursor-default">Shipping & Returns</li>
            <li className="opacity-40 cursor-default">Sizing Guide</li>
            <li className="opacity-40 cursor-default">Gift Cards</li>
            <li>
              <Link href="/contact" className="hover:text-accent transition-all duration-300 hover:pl-2">Contact Us</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Centered Copyright */}
      <div className="container mx-auto px-6 lg:px-12 mt-20 pt-12 border-t border-foreground/5 flex flex-col items-center gap-6">
        <div className="flex gap-8 text-[9px] uppercase tracking-[0.3em] font-bold opacity-30">
          <span className="hover:opacity-100 transition-opacity cursor-pointer">Privacy Policy</span>
          <span className="hover:opacity-100 transition-opacity cursor-pointer">Terms of Service</span>
          <span className="hover:opacity-100 transition-opacity cursor-pointer">Cookie Settings</span>
        </div>
        <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-foreground/20 text-center">
          &copy; 2026 Vedika Jewels. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
