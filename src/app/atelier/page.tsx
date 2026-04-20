"use client";

import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const pillars = [
  {
    num: "01",
    title: "Ethical Sourcing",
    body: "Every gemstone in a Vedika piece is traceable to its origin. We partner exclusively with mines that uphold the highest labor and environmental standards.",
  },
  {
    num: "02",
    title: "Master Craftsmanship",
    body: "Our goldsmith artisans in Geneva carry forward a tradition spanning over three generations. Each piece requires a minimum of 80 hours of handwork.",
  },
  {
    num: "03",
    title: "Architectural Design",
    body: "We reject ornamentation for its own sake. Every curve, facet, and setting is a deliberate structural decision — jewelry as wearable architecture.",
  },
  {
    num: "04",
    title: "Lifetime Guarantee",
    body: "Vedika pieces are made to be inherited. We offer complimentary service, polishing, and structural checks for the lifetime of every creation.",
  },
];

export default function AtelierPage() {
  return (
    <main className="min-h-screen bg-[#fbf9f4] text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="pt-44 pb-24 container mx-auto px-6 lg:px-16 flex flex-col items-center text-center text-balance">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent mb-6 block"
        >
          Our Heritage
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl lg:text-8xl font-serif max-w-5xl tracking-tight leading-[1.05] mb-8"
        >
          The Vedika <br />
          <span className="italic font-light opacity-70">Atelier</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-foreground/55 max-w-xl font-light leading-relaxed text-lg"
        >
          Where rough stones are transformed into legacies. Every Vedika piece
          is a statement of architectural precision, ethically made in India.
        </motion.p>
      </section>

      {/* Image Grid */}
      <section className="container mx-auto px-6 lg:px-16 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-auto min-h-[600px]">
          <div className="lg:col-span-2 overflow-hidden bg-white/5 relative group">
            <img
              src="/atelier_craftsmanship.png"
              alt="Diamond craftsmanship"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
          </div>
          <div className="space-y-6 flex flex-col">
            <div className="flex-1 overflow-hidden bg-white/5 relative group aspect-square">
              <img
                src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop"
                alt="Gold ring detail"
                className="w-full h-full object-cover brightness-90 hover:brightness-110 transition-all duration-700"
              />
            </div>
            <div className="flex-1 overflow-hidden bg-white/5 relative group aspect-square">
              <img
                src="https://images.unsplash.com/photo-1626497764746-6dc3e546828a?q=80&w=800&auto=format&fit=crop"
                alt="Jewelry artisan at work"
                className="w-full h-full object-cover brightness-90 hover:brightness-110 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Pillars */}
      <section className="border-t border-foreground/10 py-32 bg-white">
        <div className="container mx-auto px-6 lg:px-16 text-center">
          <div className="max-w-3xl mx-auto mb-20">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent mb-4 block">
              Our Principles
            </span>
            <h2 className="text-4xl lg:text-7xl font-serif text-foreground">
              Four Pillars of <br />
              <span className="italic font-light opacity-60">Excellence</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 text-left">
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="space-y-6 p-8 border border-transparent hover:border-foreground/5 transition-colors group"
              >
                <span className="text-6xl font-serif text-accent/10 font-light block transition-colors group-hover:text-accent/20">
                  {pillar.num}
                </span>
                <h3 className="text-xl font-serif text-foreground">{pillar.title}</h3>
                <p className="text-sm text-foreground/55 leading-relaxed font-light">
                  {pillar.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-44 container mx-auto px-6 lg:px-16 text-center space-y-12">
        <h2 className="text-5xl lg:text-8xl font-serif text-foreground leading-tight">
          Have a <br /> <span className="italic font-light opacity-60 text-accent">Conversation</span>
        </h2>
        <p className="text-foreground/50 max-w-lg mx-auto font-light leading-relaxed text-lg">
          The creation of an exceptional piece begins with a shared vision.
          Contact our atelier to discuss your jewelry journey with our master craftsmen.
        </p>
        <div className="pt-8">
          <Link href="/contact" className="bg-[#1b1c19] text-white px-12 py-6 text-[11px] uppercase tracking-[0.4em] font-bold inline-flex items-center gap-6 hover:bg-accent transition-all shadow-2xl">
            Start a Conversation <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
