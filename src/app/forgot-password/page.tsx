"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf9f4]">
      <Navbar />

      <div className="pt-40 container mx-auto px-6 h-screen flex justify-center">
        <div className="w-full max-w-md space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif">Reset Password</h1>
            <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold max-w-xs mx-auto">
              ENTER YOUR EMAIL AND WE'LL SEND YOU A LINK TO GET SECURE ACCESS TO YOUR ACCOUNT
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-12 border border-foreground/5 space-y-8"
          >
            {message ? (
              <div className="text-center space-y-6 py-8">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                   <Mail className="text-accent" size={24} />
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Check your inbox</p>
                   <p className="text-sm font-serif italic text-foreground/60">{message}</p>
                </div>
                <Link 
                  href="/login" 
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-accent hover:opacity-70 transition-opacity"
                >
                  <ArrowLeft size={12} /> Return to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <div className="text-[10px] uppercase tracking-widest font-bold text-red-500 bg-red-50 p-4 border border-red-100 text-center">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Email Address</label>
                  <input
                    required
                    type="email"
                    className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="atelier@example.com"
                  />
                </div>

                <div className="space-y-6 pt-4">
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full btn-secondary py-4 uppercase tracking-[0.2em] font-bold text-[10px] flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? "Sending link..." : "Send Reset Link"}
                    <ChevronRight size={14} />
                  </button>

                  <div className="text-center">
                    <Link href="/login" className="text-[10px] uppercase tracking-widest font-bold opacity-30 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <ArrowLeft size={12} /> Back to Sign In
                    </Link>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
