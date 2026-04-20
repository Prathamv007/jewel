"use client";

import { useState, Suspense } from "react";
import Navbar from "@/components/ui/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset password");

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return (
     <div className="bg-white p-12 text-center space-y-4">
        <p className="text-sm font-serif italic opacity-40">Invalid or missing reset token.</p>
        <button onClick={() => router.push("/login")} className="btn-secondary px-8 py-3">Return to login</button>
     </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-12 border border-foreground/5 space-y-8"
    >
      {success ? (
        <div className="text-center space-y-6 py-12">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
               <CheckCircle2 className="text-green-500" size={32} />
            </div>
            <div className="space-y-2">
               <h2 className="text-2xl font-serif">Password Secured</h2>
               <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Redirecting to login...</p>
            </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="text-[10px] uppercase tracking-widest font-bold text-red-500 bg-red-50 p-4 border border-red-100 text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">New Password</label>
            <input
              required
              type="password"
              className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Confirm Password</label>
            <input
              required
              type="password"
              className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full btn-secondary py-4 uppercase tracking-[0.2em] font-bold text-[10px] flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "Securing Account..." : "Update Password"}
            <ChevronRight size={14} />
          </button>
        </form>
      )}
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#fbf9f4]">
      <Navbar />

      <div className="pt-40 container mx-auto px-6 h-screen flex justify-center">
        <div className="w-full max-w-md space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif">Secure New Password</h1>
            <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
               Update your credentials to regain access
            </p>
          </div>

          <Suspense fallback={<div className="bg-white p-12 border border-foreground/5 h-[400px] animate-pulse" />}>
             <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
