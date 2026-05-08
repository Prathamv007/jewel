"use client";

import { useState, Suspense } from "react";
import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Redirect logic: respect callback URL if it exists, otherwise use role-based default
      if (callback) {
        window.location.href = callback;
      } else if (data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/account";
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="bg-white p-12 border border-foreground/5 space-y-8">
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
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Password</label>
        <input
          required
          type="password"
          className="w-full bg-transparent border-b border-foreground/10 py-2 focus:border-accent outline-none text-sm transition-colors"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-[10px] uppercase tracking-widest font-bold opacity-30 hover:opacity-100 transition-opacity">
            Forgot Password?
          </Link>
        </div>
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full btn-secondary py-4 uppercase tracking-[0.2em] font-bold text-[10px] flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {loading ? "Authenticating..." : "Sign In"}
        <ChevronRight size={14} />
      </button>

      <div className="text-center pt-6 border-t border-foreground/5">
        <p className="text-[10px] uppercase tracking-widest font-medium opacity-40">
          New to Vedika Jewels?
        </p>
        <Link href="/register" className="inline-block mt-2 text-xs font-serif italic text-accent hover:opacity-70 transition-opacity">
          Create a User Account
        </Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#fbf9f4]">
      <Navbar />

      <div className="pt-40 container mx-auto px-6 h-screen flex justify-center">
        <div className="w-full max-w-md space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-serif">Account Login</h1>
            <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">
              Access your user profile
            </p>
          </div>

          {/* Suspense boundary required for useSearchParams in some environments/builds */}
          <Suspense fallback={<div className="bg-white p-12 border border-foreground/5 h-[400px] animate-pulse" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
