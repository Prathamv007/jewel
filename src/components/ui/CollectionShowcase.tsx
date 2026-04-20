"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const COLLECTIONS = [
  {
    name: "The Ring Edit",
    description: "Architectural forms for the modern hands.",
    image: "/collections/rings.png",
    href: "/shop?category=Rings",
    size: "large"
  },
  {
    name: "Earring Curation",
    description: "Light-catching brilliance in every drop.",
    image: "/collections/earrings.png",
    href: "/shop?category=Earrings",
    size: "small"
  },
  {
    name: "Necklace Series",
    description: "Ethereal chains and statement pendants.",
    image: "/collections/necklaces.png",
    href: "/shop?category=Necklaces",
    size: "small"
  },
  {
    name: "Bracelets & Cuffs",
    description: "Sculptural pieces for effortless elegance.",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=1200",
    href: "/shop?category=Bracelets",
    size: "wide"
  }
];

export default function CollectionShowcase() {
  return (
    <section className="section-spacing container mx-auto px-6 lg:px-12">
      <div className="flex flex-col items-center text-center mb-24 space-y-4">
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent">Browse Collections</span>
        <h2 className="text-4xl lg:text-8xl font-serif">Curated <span className="italic font-light opacity-60">Series</span></h2>
        <div className="w-24 h-[1px] bg-accent/20 mt-8" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {COLLECTIONS.map((collection, idx) => (
          <Link 
            href={collection.href} 
            key={collection.name}
            className={cn(
              "group relative overflow-hidden bg-muted",
              collection.size === "large" ? "lg:col-span-2 lg:row-span-2 aspect-square" :
              collection.size === "wide" ? "lg:col-span-2 aspect-video" : "aspect-square"
            )}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img 
                src={collection.image} 
                alt={collection.name} 
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
            </motion.div>

            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-serif">{collection.name}</h3>
                <p className="text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-60 transition-opacity duration-500">
                  {collection.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Utility function copied or imported
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
