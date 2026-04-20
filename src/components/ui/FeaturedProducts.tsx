"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.products) {
          // Priority to featured, then newest
          const sorted = [...data.products].sort((a, b) => {
             if (a.featured && !b.featured) return -1;
             if (!a.featured && b.featured) return 1;
             return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          });
          setProducts(sorted.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) {
     return (
        <section className="section-spacing container mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-foreground/5 animate-pulse" />)}
            </div>
        </section>
     );
  }

  if (products.length === 0) return null;

  return (
    <section className="section-spacing container mx-auto px-6 lg:px-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent italic">Trending Now</span>
          <h2 className="text-4xl lg:text-6xl font-serif">Shop the <span className="italic font-light opacity-60">Creations</span></h2>
        </div>
        <Link href="/shop" className="text-[11px] uppercase tracking-[0.3em] font-bold border-b border-foreground/10 pb-1 hover:text-accent hover:border-accent transition-all">
          View all Items
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
        {products.map((product, idx) => (
          <ProductCard key={product._id} product={product} index={idx} />
        ))}
      </div>
    </section>
  );
}
