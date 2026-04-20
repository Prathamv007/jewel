"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save } from "lucide-react";

export default function AdminNewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Rings",
    material: "18K Gold",
    gemstone: "",
    imageUrl: "",
    featured: false,
    stock: 1,
    isAntiTarnish: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const productPayload = {
        ...formData,
        price: Number(formData.price),
        images: formData.imageUrl ? [formData.imageUrl] : [],
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create creation");

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in ease-out duration-700">
      <div className="space-y-2">
        <Link href="/admin/products" className="text-[10px] uppercase tracking-widest font-bold text-accent flex items-center gap-2 hover:opacity-70 transition-opacity w-fit">
          <ChevronLeft size={14} /> Back to Catalog
        </Link>
        <h3 className="text-2xl font-serif mt-4">New Masterpiece</h3>
        <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Add a new jewelry creation to the boutique</p>
      </div>

      <div className="bg-white border border-foreground/5 p-12 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="text-[10px] uppercase tracking-widest font-bold text-red-500 bg-red-50 p-4 border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Jewelry Name</label>
            <input 
              required
              className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. The Heritage Solitaire"
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Price (₹ INR)</label>
              <input 
                required
                type="number"
                min="0"
                className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Stock Count</label>
              <input 
                required
                type="number"
                min="0"
                className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors"
                value={formData.stock}
                onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                placeholder="Quantity in stock"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Category</label>
              <select
                className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Rings">Rings</option>
                <option value="Necklaces">Necklaces</option>
                <option value="Earrings">Earrings</option>
                <option value="Bracelets">Bracelets</option>
                <option value="Pendants">Pendants</option>
                <option value="Bespoke">Bespoke</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Material</label>
              <select
                className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors"
                value={formData.material}
                onChange={e => setFormData({...formData, material: e.target.value})}
              >
                <option value="18K Gold">18K Gold</option>
                <option value="14K Gold">14K Gold</option>
                <option value="Platinum">Platinum</option>
                <option value="Silver">Silver</option>
                <option value="Brass">Brass</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Primary Gemstone</label>
              <input 
                className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors"
                value={formData.gemstone}
                onChange={e => setFormData({...formData, gemstone: e.target.value})}
                placeholder="e.g. 2.5ct Flawless Diamond"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Anti-Tarnish</label>
              <div className="flex items-center gap-2 py-2">
                <input 
                  type="checkbox"
                  id="isAntiTarnish"
                  checked={formData.isAntiTarnish}
                  onChange={e => setFormData({...formData, isAntiTarnish: e.target.checked})}
                />
                <label htmlFor="isAntiTarnish" className="text-[10px] uppercase tracking-widest font-bold opacity-50 cursor-pointer">Yes, Protected</label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Description</label>
            <textarea 
              required
              rows={4}
              className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Tell the story of this masterpiece..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Image</label>
            <div className="flex gap-4">
               <input 
                 required
                 className="flex-1 bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors"
                 value={formData.imageUrl}
                 onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                 placeholder="Paste URL or upload file &rarr;"
               />
               <label className="bg-foreground text-background px-4 py-2 text-xs uppercase tracking-widest cursor-pointer hover:bg-accent transition-colors flex items-center shrink-0">
                  <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                     const file = e.target.files?.[0];
                     if (!file) return;
                     setLoading(true);
                     try {
                        const form = new FormData();
                        form.append("file", file);
                        const res = await fetch("/api/upload", { method: "POST", body: form });
                        const data = await res.json();
                        if (data.url) setFormData({...formData, imageUrl: data.url});
                     } catch(err) { console.error(err); } finally { setLoading(false); }
                  }} />
                  Upload File
               </label>
            </div>
            {formData.imageUrl && (
               <div className="w-32 h-32 relative border border-foreground/10 bg-[#fbf9f4] p-1">
                 <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
               </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <input 
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={e => setFormData({...formData, featured: e.target.checked})}
              className="accent-accent"
            />
            <label htmlFor="featured" className="text-xs uppercase tracking-widest font-bold cursor-pointer">
              Feature this on Homepage
            </label>
          </div>

          <div className="pt-8 flex justify-end">
             <button 
                type="submit"
                disabled={loading}
                className="btn-secondary px-12 flex items-center gap-3 disabled:opacity-50"
             >
                {loading ? "Archiving..." : "Archive Masterpiece"}
                <Save size={14} />
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
