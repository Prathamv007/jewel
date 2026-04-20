import { ArrowUpRight, TrendingUp, Users, ShoppingBag, Gem, Inbox } from "lucide-react";

export default function AdminDashboardHome() {
  return (
    <div className="space-y-16">
      {/* Stats Grid: Empty State Readiness */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Total Revenue", value: "$0.00", icon: TrendingUp },
          { label: "User Orders", value: "0", icon: ShoppingBag },
          { label: "Active Creations", value: "0", icon: Gem },
          { label: "Atelier Requests", value: "0", icon: Users },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#f5f3ee] p-8 space-y-4">
             <div className="flex justify-between items-start">
               <div className="w-10 h-10 bg-accent/20 flex items-center justify-center text-accent">
                 <stat.icon size={18} strokeWidth={1.5} />
               </div>
               <span className="text-foreground/20 text-[10px] font-bold uppercase tracking-widest">
                 Live
               </span>
             </div>
             <div>
               <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-foreground/40 mb-1">{stat.label}</p>
               <h3 className="text-3xl font-serif">{stat.value}</h3>
             </div>
          </div>
        ))}
      </section>

      {/* Recent Activity: Clean Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
         {/* Recent Orders List */}
         <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/60">Recent User Orders</h4>
              <button className="text-[10px] font-bold text-accent uppercase tracking-widest flex items-center gap-1 opacity-40 cursor-not-allowed">Manage All <ArrowUpRight size={10} /></button>
            </div>
            <div className="bg-white border border-foreground/5 p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
               <ShoppingBag size={32} className="text-foreground/10" />
               <p className="text-xs font-serif italic text-foreground/40">No orders have been received yet.</p>
            </div>
         </div>

         {/* Atelier Requests Feed */}
         <div className="space-y-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/60">Atelier Design Inquiries</h4>
            <div className="bg-[#f5f3ee] p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
               <Inbox size={32} className="text-foreground/10" />
               <p className="text-xs font-serif italic text-foreground/40">Your atelier queue is currently empty.</p>
            </div>
         </div>
      </section>
    </div>
  );
}
