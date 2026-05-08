"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown, CheckCircle2, Clock, Globe, CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const { formatPrice } = useCurrency();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "All") return true;
    return order.status?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
           <h3 className="text-2xl font-serif">User Orders</h3>
           <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Monitor boutique fulfillment & payments</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white px-6 py-4 border border-foreground/5 min-w-[300px]">
           <Search size={14} className="opacity-20" />
           <input className="bg-transparent border-none outline-none text-xs w-full uppercase tracking-widest font-bold" placeholder="Search Users..." />
        </div>
      </div>

      <div className="flex gap-4 border-b border-foreground/5 pb-4 overflow-x-auto no-scrollbar">
         {["All", "Processing", "Awaiting Delivery", "Shipped", "Canceled"].map((f) => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={cn(
                "text-[10px] uppercase tracking-widest font-bold px-6 py-2 transition-all",
                filter === f ? "text-accent bg-accent/10 border border-accent/20" : "opacity-40 hover:opacity-100"
              )}
            > {f} </button>
         ))}
      </div>

      <div className="bg-white border border-foreground/5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-accent" size={32} />
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Loading Orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">No orders found in the boutique</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#f5f3ee] border-b border-foreground/5">
              <tr>
                <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Order ID</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">User</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Boutique Value</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Gateway</th>
                <th className="px-8 py-6 text-[10px] uppercase tracking-[0.2em] font-bold opacity-40">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-accent/5 transition-colors cursor-pointer group">
                  <td className="px-8 py-6 text-[10px] uppercase tracking-tighter font-bold">#{order.id.slice(-6)}</td>
                  <td className="px-8 py-6">
                     <div className="flex flex-col">
                        <span className="text-xs uppercase tracking-widest font-bold">
                          {order.userId?.firstName} {order.userId?.lastName}
                        </span>
                        <span className="text-[8px] opacity-40 uppercase tracking-widest font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                     </div>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold tracking-widest">
                    {formatPrice(order.totalAmount, order.currency)}
                  </td>
                  <td className="px-8 py-6">
                     <div className="flex items-center gap-2 text-[8px] uppercase tracking-widest font-bold text-foreground/40">
                        {order.paymentGateway === "stripe" ? <Globe size={10} /> : <CreditCard size={10} />}
                        {order.paymentGateway || "N/A"}
                     </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 text-[8px] uppercase tracking-widest font-bold",
                      order.paymentStatus === "pending" ? "text-amber-600 bg-amber-50" : 
                      order.paymentStatus === "failed" ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
                    )}>
                      {order.paymentStatus === "completed" ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                      {order.paymentStatus}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
