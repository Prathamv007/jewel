"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  setFilters: (filters: any) => void;
  categories: string[];
}

const MATERIALS = ["18K Gold", "14K Gold", "Silver", "Brass"];
const PLATING = ["18K Gold Plated", "Rose Gold Plated", "Rhodium", "None"];

export default function FilterSidebar({ isOpen, onClose, filters, setFilters, categories }: FilterSidebarProps) {
  const toggleFilter = (key: string, value: string) => {
    const current = filters[key] || [];
    if (current.includes(value)) {
      setFilters({ ...filters, [key]: current.filter((v: string) => v !== value) });
    } else {
      setFilters({ ...filters, [key]: [...current, value] });
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-foreground/5 flex items-center justify-between">
              <h2 className="text-2xl font-serif">Refine Selection</h2>
              <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-12">
              {/* Categories */}
              <div className="space-y-6">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40">Category</h3>
                <div className="flex flex-wrap gap-3">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => toggleFilter("category", cat)}
                      className={cn(
                        "px-4 py-2 text-[10px] uppercase tracking-widest font-bold border transition-all",
                        filters.category?.includes(cat)
                          ? "bg-foreground text-white border-foreground"
                          : "border-foreground/10 hover:border-foreground/30"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div className="space-y-6">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40">Material</h3>
                <div className="space-y-3">
                  {MATERIALS.map(mat => (
                    <label key={mat} className="flex items-center gap-3 group cursor-pointer">
                      <div 
                        onClick={() => toggleFilter("material", mat)}
                        className={cn(
                          "w-4 h-4 border flex items-center justify-center transition-all",
                          filters.material?.includes(mat) ? "bg-accent border-accent" : "border-foreground/20 group-hover:border-foreground/40"
                        )}
                      >
                        {filters.material?.includes(mat) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className="text-[11px] uppercase tracking-widest font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                        {mat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Plating */}
              <div className="space-y-6">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40">Plating</h3>
                <div className="space-y-3">
                  {PLATING.map(pl => (
                    <label key={pl} className="flex items-center gap-3 group cursor-pointer">
                      <div 
                        onClick={() => toggleFilter("plating", pl)}
                        className={cn(
                          "w-4 h-4 border flex items-center justify-center transition-all",
                          filters.plating?.includes(pl) ? "bg-accent border-accent" : "border-foreground/20 group-hover:border-foreground/40"
                        )}
                      >
                        {filters.plating?.includes(pl) && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                      <span className="text-[11px] uppercase tracking-widest font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                        {pl}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Anti-Tarnish Toggle */}
              <div className="pt-4">
                <label className="flex items-center justify-between group cursor-pointer">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/40">Anti-Tarnish Only</span>
                  <div 
                    onClick={() => setFilters({ ...filters, isAntiTarnish: !filters.isAntiTarnish })}
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-colors",
                      filters.isAntiTarnish ? "bg-accent" : "bg-foreground/10"
                    )}
                  >
                    <motion.div 
                      animate={{ x: filters.isAntiTarnish ? 20 : 2 }}
                      className="absolute top-1 left-0 w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </div>
                </label>
              </div>
            </div>

            <div className="p-8 border-t border-foreground/5 grid grid-cols-2 gap-4">
              <button 
                onClick={clearFilters}
                className="py-4 text-[10px] uppercase tracking-[0.2em] font-bold border border-foreground/10 hover:bg-foreground/5 transition-colors"
              >
                Clear All
              </button>
              <button 
                onClick={onClose}
                className="py-4 text-[10px] uppercase tracking-[0.2em] font-bold bg-foreground text-white hover:bg-foreground/90 transition-colors"
              >
                Show Results
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
