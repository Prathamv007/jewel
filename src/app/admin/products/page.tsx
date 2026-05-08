"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Check, X, Trash2, ExternalLink, Pencil } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.products) setProducts(data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const startEditing = (p: any) => {
    setEditingId(p.id);
    setEditPrice(p.price);
  };

  const cancelEditing = () => setEditingId(null);

  const savePrice = async (id: string) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price: editPrice }),
      });
      if (res.ok) {
        setProducts(products.map(p => p.id === id ? { ...p, price: editPrice } : p));
        setEditingId(null);
      } else {
        const d = await res.json();
        alert(`Failed to update price: ${d.error || res.status}`);
      }
    } catch (error) {
      console.error(error);
      alert("Network error updating price.");
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Remove "${name}" from the catalog permanently?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        const d = await res.json();
        alert(`Delete failed: ${d.error || res.status}. Make sure you are logged in as Admin.`);
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in ease-out duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-2xl font-serif">Creations Catalog</h3>
          <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
            {products.length} masterpiece{products.length !== 1 ? "s" : ""} in archive
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-secondary flex items-center gap-2">
          <Plus size={16} /> New Creation
        </Link>
      </div>

      <div className="bg-white border border-foreground/5 overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-[#f5f3ee] border-b border-foreground/5">
            <tr>
              <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Jewelry Piece</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Category</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Price (₹)</th>
              <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/5">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-accent/5 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#fbf9f4] overflow-hidden border border-transparent group-hover:border-accent/20 shrink-0">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[8px] opacity-30 uppercase tracking-widest">No img</div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest font-bold">{p.name}</p>
                      <p className="text-[8px] opacity-40 uppercase tracking-widest font-medium mt-0.5">#{p.id.slice(-8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-xs font-serif italic text-accent">{p.category}</td>
                <td className="px-8 py-6">
                  {editingId === p.id ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs tracking-widest font-bold">₹</span>
                      <input
                        type="number"
                        value={editPrice}
                        onChange={(e) => setEditPrice(Number(e.target.value))}
                        className="w-28 bg-transparent border-b border-accent text-xs tracking-widest font-bold outline-none py-1"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div
                      className="text-xs tracking-widest font-bold cursor-pointer hover:text-accent transition-colors border-b border-transparent hover:border-accent/30 inline-block pb-0.5"
                      onClick={() => startEditing(p)}
                      title="Click to edit price"
                    >
                      ₹{p.price?.toLocaleString("en-IN")}
                    </div>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3 text-foreground/30 group-hover:text-foreground/60 transition-colors">
                    {editingId === p.id ? (
                      <>
                        <button onClick={() => savePrice(p.id)} disabled={isUpdating} className="hover:text-green-600 transition-colors p-1" title="Save">
                          <Check size={16} />
                        </button>
                        <button onClick={cancelEditing} className="hover:text-red-500 transition-colors p-1" title="Cancel">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href={`/admin/products/${p.id}/edit`} className="hover:text-accent transition-colors p-1" title="Edit product">
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => deleteProduct(p.id, p.name)}
                          disabled={deletingId === p.id}
                          className="hover:text-red-500 transition-colors p-1 disabled:opacity-50"
                          title="Remove Creation"
                        >
                          <Trash2 size={15} />
                        </button>
                        <Link href={`/shop/${p.id}`} className="hover:text-accent transition-colors p-1" target="_blank" title="View in Shop">
                          <ExternalLink size={15} />
                        </Link>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center text-xs tracking-widest uppercase font-bold opacity-30">
                  No masterpieces in archive yet. Add your first creation →
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
