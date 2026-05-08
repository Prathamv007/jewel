"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import { useRouter } from "next/navigation";
import { LogOut, ChevronRight, ShoppingBag, ShieldCheck, User as UserIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [bespokeHistory, setBespokeHistory] = useState<any[]>([]);
  const router = useRouter();
  const { clearCart } = useCart();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          // Fetch bespoke history after user is confirmed
          const bespokeRes = await fetch("/api/bespoke");
          if (bespokeRes.ok) {
            const bespokeData = await bespokeRes.json();
            setBespokeHistory(bespokeData);
          }
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Failed to authenticate");
        router.push("/login");
      }
    };
    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      clearCart();
      window.location.href = "/login";
    } catch {
      // Ignore errors
    }
  };

  if (!user) return <div className="h-screen bg-[#fbf9f4]" />;

  return (
    <main className="min-h-screen bg-[#fbf9f4] text-foreground">
      <Navbar />
      
      <div className="pt-44 pb-24 container mx-auto px-6 flex justify-center">
        <div className="w-full max-w-5xl space-y-12">
          <div className="text-center space-y-4">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent block">My Account</span>
            <h1 className="text-5xl font-serif">Welcome, {user.firstName || "User"}</h1>
            <p className="text-sm font-light text-foreground/40 italic">
              Logged in as {user.email}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Stats */}
            <div className="space-y-6">
              <div className="bg-white p-8 border border-foreground/5 space-y-6">
                <div className="flex items-center gap-4 text-accent">
                   <div className="w-10 h-10 bg-accent/10 flex items-center justify-center rounded-full">
                      <ShieldCheck size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold opacity-30 leading-none mb-1">Security</p>
                      <p className="text-sm font-serif font-medium">Identity Verified</p>
                   </div>
                </div>

                {user.role === 'admin' && (
                  <div className="pt-4 border-t border-foreground/5">
                    <Link href="/admin" className="w-full btn-secondary py-3 flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest font-bold">
                       Atelier Dashboard <ChevronRight size={12} />
                    </Link>
                  </div>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="w-full py-3 flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest font-bold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={12} /> Sign out
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border border-foreground/5 overflow-hidden">
                <div className="px-8 py-6 border-b border-foreground/5 flex justify-between items-center bg-[#fdfdfd]">
                   <h2 className="text-lg font-serif">Bespoke Requests</h2>
                   <Sparkles size={18} strokeWidth={1} className="opacity-20 text-accent" />
                </div>
                {bespokeHistory.length === 0 ? (
                  <div className="p-16 text-center space-y-4">
                    <div className="w-12 h-12 bg-foreground/5 flex items-center justify-center rounded-full mx-auto">
                      <Sparkles size={16} className="opacity-20" />
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
                        No bespoke commissions found
                    </p>
                    <Link href="/bespoke" className="inline-block text-xs font-serif italic text-accent hover:opacity-70 transition-opacity">
                      Begin your custom journey &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-foreground/5">
                    {bespokeHistory.map((design: any) => (
                      <div key={design.id} className="p-6 flex items-center gap-6 hover:bg-[#fbf9f4]/50 transition-colors">
                        <div className="w-16 h-16 bg-[#fbf9f4] overflow-hidden shrink-0">
                          <img src={design.designImage} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] uppercase tracking-widest font-bold opacity-30 mb-1">
                            {new Date(design.createdAt).toLocaleDateString()} • {design.material}
                          </p>
                          <p className="text-xs font-serif italic line-clamp-1 opacity-80 mb-2">"{design.description}"</p>
                          <div className="flex items-center gap-2">
                             <span className={`w-1.5 h-1.5 rounded-full ${design.status === 'Pending Review' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                             <span className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-50">{design.status}</span>
                          </div>
                        </div>
                        <Link href="/bespoke" className="text-[10px] uppercase tracking-widest font-bold text-accent px-4 py-2 border border-accent/20 hover:bg-accent hover:text-white transition-all">
                          Details
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white border border-foreground/5 overflow-hidden">
                <div className="px-8 py-6 border-b border-foreground/5 bg-[#fdfdfd]">
                  <h2 className="text-lg font-serif">Account Information</h2>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold opacity-30 mb-1">First Name</p>
                      <p className="text-sm font-serif underline decoration-foreground/10">{user.firstName || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold opacity-30 mb-1">Last Name</p>
                      <p className="text-sm font-serif underline decoration-foreground/10">{user.lastName || "Not provided"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-30 mb-1">Registered Email</p>
                    <p className="text-sm font-serif underline decoration-foreground/10">{user.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
