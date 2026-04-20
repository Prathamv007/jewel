"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ProductCard from "@/components/ui/ProductCard";
import FilterSidebar from "@/components/ui/FilterSidebar";
import SortDropdown, { SortOption } from "@/components/ui/SortDropdown";
import { SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["Rings", "Necklaces", "Earrings", "Bracelets", "Pendants"];

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [filters, setFilters] = useState({
    category: [] as string[],
    material: [] as string[],
    plating: [] as string[],
    isAntiTarnish: false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.products) setProducts(data.products);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Multi-criteria Filter
    if (filters.category.length > 0) result = result.filter(p => filters.category.includes(p.category));
    if (filters.material.length > 0) result = result.filter(p => filters.material.includes(p.material));
    if (filters.plating.length > 0) result = result.filter(p => filters.plating.includes(p.plating));
    if (filters.isAntiTarnish) result = result.filter(p => p.isAntiTarnish);

    // Sorting
    switch (sort) {
      case "price_asc": result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "newest": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case "featured": result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
    }

    return result;
  }, [products, filters, sort]);

  return (
    <main className="min-h-screen bg-[#fbf9f4] text-foreground">
      <Navbar />

      {/* Refined Centered Header */}
      <section className="pt-44 pb-20 border-b border-foreground/[0.03]">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex flex-col items-center text-center space-y-4 mb-20">
            <h1 className="text-6xl lg:text-8xl font-serif tracking-tight leading-none">The Collections</h1>
            <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-accent">Professional Demi-Fine Series</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
               <span className="text-[9px] uppercase tracking-widest font-bold opacity-30">Curation</span>
               <div className="w-12 h-[1px] bg-foreground/10" />
            </div>

            <div className="flex items-center gap-8">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold group"
              >
                <SlidersHorizontal size={14} className="group-hover:text-accent transition-colors" />
                <span className="group-hover:text-accent transition-colors">Filters</span>
                {Object.values(filters).flat().filter(v => typeof v === 'boolean' ? v : (Array.isArray(v) && v.length > 0)).length > 0 && (
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                )}
              </button>

              <div className="h-4 w-[1px] bg-foreground/10" />

              <SortDropdown currentSort={sort} onSortChange={setSort} />
            </div>
          </div>
        </div>
      </section>

      <FilterSidebar 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        filters={filters}
        setFilters={setFilters}
        categories={CATEGORIES}
      />

      {/* Section-wise Product Display */}
      <section className="container mx-auto px-6 lg:px-16 mb-44 space-y-32">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pt-20">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square bg-foreground/5 animate-pulse" />
            ))}
          </div>
        ) : filteredAndSortedProducts.length > 0 ? (
          CATEGORIES.map(category => {
            const categoryProducts = filteredAndSortedProducts.filter(p => p.category === category);
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category} className="space-y-12">
                <div className="flex items-end justify-between border-b border-foreground/5 pb-4">
                  <h2 className="text-3xl font-serif">{category}</h2>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-30">
                    {categoryProducts.length} Items
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-20">
                  {categoryProducts.map((p, idx) => (
                    <ProductCard key={p._id} product={p} index={idx} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-44 text-center border-y border-foreground/5">
            <p className="text-sm font-serif italic text-foreground/40">No creations found matching your refinement.</p>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
