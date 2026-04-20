"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#fbf9f4]">
      {/* Background Image with Fixed-Position Fallback */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2000&auto=format&fit=crop')`,
        }}
      >
        {/* Subtle Overlay to ensure text readability but maintain luminosity */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative h-full container mx-auto px-6 lg:px-12 flex flex-col justify-center">
        <div className="max-w-2xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#B08D2E] mb-4 block">
              The Heritage Collection
            </span>
            <h1 className="text-5xl lg:text-8xl font-serif leading-[1.1] mb-6 text-foreground">
              Timeless <br />
              <span className="italic pl-12 lg:pl-20 opacity-70">Luminescence</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg text-foreground/70 max-w-md font-light leading-relaxed"
          >
            A curation of the world’s most exquisite jewelry pieces,
            handcrafted for the modern user. Experience the digital
            boutique of Vedika.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex items-center gap-8 pt-4"
          >
            <Link href="/shop" className="btn-primary group flex items-center gap-2">
              Explore Collection
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/atelier" className="text-xs uppercase tracking-widest font-bold border-b border-foreground/20 pb-1 hover:border-accent transition-colors text-foreground">
              The Atelier
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Aesthetic Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent" />
        <span className="text-[9px] uppercase tracking-[0.3em] font-bold opacity-40 rotate-90 origin-left text-foreground">Scroll</span>
      </motion.div>
    </section>
  );
}
