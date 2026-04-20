"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  Gem,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Creations", href: "/admin/products", icon: Gem },
  { label: "Bespoke", href: "/admin/bespoke", icon: ExternalLink },
  { label: "User Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Inventory", href: "/admin/inventory", icon: Package },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { clearCart } = useCart();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    clearCart(); // Clear cart state on logout
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#fbf9f4]">
      {/* Admin Sidebar: Charcoal & Minimal */}
      <aside className="w-64 bg-[#1b1c19] text-white flex flex-col fixed h-full z-50">
        <div className="p-8 border-b border-white/5">
          <Link href="/admin" className="font-serif text-xl tracking-tighter flex items-center gap-2">
            <Gem size={18} className="text-accent" />
            VEDIKA <span className="text-[8px] uppercase tracking-widest opacity-40">Atelier</span>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.15em] font-medium transition-all",
                  isActive
                    ? "bg-accent/10 text-accent border-l-2 border-accent"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={16} strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-1">
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.15em] font-medium text-white/40 hover:text-white transition-colors">
            <Settings size={16} strokeWidth={1.5} />
            Settings
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-[0.15em] font-medium text-white/40 hover:text-red-400 transition-colors">
            <LogOut size={16} strokeWidth={1.5} />
            Exit Studio
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-12 overflow-y-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent italic mb-2 block">Management Studio</span>
            <h2 className="text-3xl font-serif">Welcome, Atelier Admin</h2>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-[9px] uppercase tracking-widest border border-foreground/10 px-4 py-2 flex items-center gap-2 hover:bg-foreground hover:text-white transition-all">
              Live Boutique <ExternalLink size={10} />
            </Link>
            <div className="w-10 h-10 bg-accent/20 flex items-center justify-center font-serif text-accent">A</div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}
