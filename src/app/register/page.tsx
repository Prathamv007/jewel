"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      window.location.href = "/shop";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf9f4]">
      <Navbar />

      <div className="pt-40 pb-20 container mx-auto px-6 flex justify-center">
        <div className="w-full max-w-md space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif text-foreground">User Registration</h1>
            <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
              Join the Vedika Jewels Boutique
            </p>
          </div>

          <form onSubmit={handleRegister} className="bg-white p-12 border border-foreground/5 space-y-8">
            {error && (
              <div className="text-[10px] uppercase tracking-widest font-bold text-red-500 bg-red-50 p-4 border border-red-100 text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">First Name</label>
                <input
                  required
                  className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors text-foreground"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Last Name</label>
                <input
                  required
                  className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors text-foreground"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Email Address</label>
              <input
                required
                type="email"
                className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors text-foreground"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Password</label>
              <input
                required
                type="password"
                className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors text-foreground"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full btn-secondary py-4 uppercase tracking-[0.2em] font-bold text-[10px] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? "Registering..." : "Create Account"}
              <ChevronRight size={14} />
            </button>

            <div className="text-center pt-6 border-t border-foreground/5">
              <p className="text-[10px] uppercase tracking-widest font-medium opacity-40">
                Already have an account?
              </p>
              <Link href="/login" className="inline-block mt-2 text-xs font-serif italic text-accent hover:opacity-70 transition-opacity">
                Sign In to your Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
