"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export type SortOption = "featured" | "newest" | "price_asc" | "price_desc";

interface SortDropdownProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export default function SortDropdown({ currentSort, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold group"
      >
        <span className="opacity-40 group-hover:opacity-100 transition-opacity">Sort By:</span>
        <span className="flex items-center gap-2">
          {SORT_OPTIONS.find(o => o.value === currentSort)?.label}
          <ChevronDown size={12} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-full mt-4 bg-white border border-foreground/5 shadow-xl p-2 min-w-[200px] z-20"
            >
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors",
                    currentSort === option.value ? "bg-foreground/5 text-accent" : "hover:bg-foreground/5 opacity-60 hover:opacity-100"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
