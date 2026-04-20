"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Send, History, CheckCircle2, Clock, Gem, Hammer, Sparkles, User as UserIcon } from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BespokePage() {
  const [formData, setFormData] = useState({
    description: "",
    material: "18k Gold",
    gemstones: "",
    budget: "",
    timeline: "3-5 Weeks",
    designImage: "",
  });
  const [history, setHistory] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          await fetchHistory();
        }
      } catch (err) {
        console.error("Auth failed");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/bespoke");
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, designImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bespoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchHistory();
        setActiveTab("history");
        setFormData({
          description: "",
          material: "18k Gold",
          gemstones: "",
          budget: "",
          timeline: "3-5 Weeks",
          designImage: "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf9f4]">
      <Navbar />
      
      <div className="pt-32 pb-24 px-6 lg:px-12">
        <div className="container mx-auto max-w-5xl">
          {/* Hero Section */}
          <div className="text-center space-y-4 mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent text-[10px] uppercase tracking-[0.3em] font-bold"
            >
              <Sparkles size={12} />
              The Bespoke Atelier
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-serif text-foreground"
            >
              Bring Your Vision to Life
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-foreground/60 text-sm max-w-xl mx-auto leading-relaxed"
            >
              Collaborate with our master artisans to create a one-of-a-kind masterpiece that reflects your personal journey and heritage.
            </motion.p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center gap-8 mb-16 border-b border-foreground/5">
            <button 
              onClick={() => setActiveTab("form")}
              className={`pb-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all ${activeTab === "form" ? "text-accent border-b border-accent" : "opacity-40 hover:opacity-100"}`}
            >
              Create New Design
            </button>
            <button 
              onClick={() => setActiveTab("history")}
              className={`pb-4 text-[10px] uppercase tracking-[0.3em] font-bold transition-all ${activeTab === "history" ? "text-accent border-b border-accent" : "opacity-40 hover:opacity-100"}`}
            >
              Your Design History ({history.length})
            </button>
          </div>

          {isLoading ? (
            <div className="py-32 text-center">
               <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
               <p className="text-[10px] uppercase tracking-widest font-bold opacity-30">Authenticating with the Atelier...</p>
            </div>
          ) : !user ? (
            <div className="max-w-2xl mx-auto py-24 px-12 bg-white border border-foreground/5 text-center space-y-8">
               <div className="w-16 h-16 bg-accent/5 flex items-center justify-center rounded-full mx-auto">
                  <UserIcon className="text-accent opacity-40" size={24} />
               </div>
               <div className="space-y-3">
                  <h3 className="text-2xl font-serif">A Personal Connection</h3>
                  <p className="text-sm text-foreground/50 font-light leading-relaxed">
                    Bespoke creations are deeply personal journeys. Please sign in or create an account to collaborate with our master artisans and track your custom designs.
                  </p>
               </div>
               <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/login?callback=/bespoke" className="btn-primary px-12 py-4 text-[10px] uppercase tracking-widest font-bold">
                    Sign In
                  </Link>
                  <Link href="/register" className="btn-secondary px-12 py-4 text-[10px] uppercase tracking-widest font-bold">
                    Create Account
                  </Link>
               </div>
            </div>
          ) : (
          <AnimatePresence mode="wait">
            {activeTab === "form" ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid lg:grid-cols-2 gap-16 items-start"
              >
                {/* Visual Inspiration */}
                <div className="space-y-8 bg-[#1b1c19] text-white p-12 lg:p-16 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-serif mb-6 italic">Our Artisanal Process</h3>
                    <div className="space-y-8">
                      <div className="flex gap-6">
                        <div className="w-10 h-10 border border-white/20 flex items-center justify-center shrink-0">
                          <Gem size={18} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-accent mb-1">01. Discovery</p>
                          <p className="text-sm opacity-60 leading-relaxed">Share your inspiration through images and descriptions.</p>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <div className="w-10 h-10 border border-white/20 flex items-center justify-center shrink-0">
                          <Hammer size={18} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-accent mb-1">02. Conceptualization</p>
                          <p className="text-sm opacity-60 leading-relaxed">Our designers create a tailored quote within 48 hours.</p>
                        </div>
                      </div>
                      <div className="flex gap-6">
                        <div className="w-10 h-10 border border-white/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={18} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-accent mb-1">03. Masterpiece</p>
                          <p className="text-sm opacity-60 leading-relaxed">Each piece is handcrafted with precision and care.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-12 border-t border-white/10">
                    <p className="text-[9px] uppercase tracking-[0.4em] opacity-40 mb-4">Featured Material</p>
                    <p className="text-xl font-serif italic text-accent">18k Recycled Rose Gold</p>
                  </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="space-y-6">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">The Concept</p>
                    
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold block">Upload Design Inspiration</label>
                      <div className="relative aspect-video border border-dashed border-foreground/20 bg-white group hover:border-accent/40 transition-colors flex flex-col items-center justify-center p-6 text-center cursor-pointer overflow-hidden">
                        {formData.designImage ? (
                          <img src={formData.designImage} className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <>
                            <Upload className="mb-4 text-foreground/40 group-hover:text-accent transition-colors" size={24} />
                            <p className="text-[10px] uppercase tracking-widest font-bold">Drop files here or click to upload</p>
                            <p className="text-[9px] opacity-40 mt-1">Sketches, moodboards, or references (PNG, JPG)</p>
                          </>
                        )}
                        <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[9px] uppercase tracking-widest font-bold block">Description of Vision</label>
                       <textarea 
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-white border border-foreground/5 px-6 py-4 text-xs font-serif italic focus:outline-none focus:border-accent min-h-[120px] resize-none"
                        placeholder="Tell us the story behind this piece..."
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold block">Preferred Material</label>
                      <select 
                        value={formData.material}
                        onChange={(e) => setFormData({...formData, material: e.target.value})}
                        className="w-full bg-white border border-foreground/5 px-6 py-4 text-[10px] font-bold focus:outline-none focus:border-accent appearance-none"
                      >
                        <option>18k Gold</option>
                        <option>14k Gold</option>
                        <option>925 Silver</option>
                        <option>Platinum</option>
                        <option>Rose Gold</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-bold block">Target Budget</label>
                      <input 
                        required
                        type="text"
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                        className="w-full bg-white border border-foreground/5 px-6 py-4 text-[10px] font-bold focus:outline-none focus:border-accent"
                        placeholder="e.g. ₹50k - ₹1L"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest font-bold block">Desired Delivery Window</label>
                    <div className="grid grid-cols-2 gap-4">
                      {["1-2 Weeks", "3-5 Weeks", "2 Months", "Flexible"].map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setFormData({...formData, timeline: t})}
                          className={`px-6 py-4 text-[10px] uppercase tracking-widest font-bold border transition-all ${formData.timeline === t ? "border-accent bg-accent text-white" : "border-foreground/5 bg-white opacity-60 hover:opacity-100"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full btn-primary py-6 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Submitting to Master Artisans...</span>
                    ) : (
                      <>
                        <Send size={14} />
                        Submit Bespoke Request
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {isLoading ? (
                  <div className="py-20 text-center">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">Consulting History...</p>
                  </div>
                ) : history.length === 0 ? (
                  <div className="py-32 text-center border border-foreground/5 bg-white/50">
                    <History size={32} className="mx-auto mb-4 opacity-10" />
                    <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">No previous custom designs found.</p>
                    <button onClick={() => setActiveTab("form")} className="mt-4 text-accent text-[10px] underline uppercase tracking-widest">Start your first journey</button>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {history.map((design) => (
                      <div key={design._id} className="bg-white border border-foreground/5 p-8 flex flex-col md:flex-row gap-8 group hover:shadow-2xl transition-all duration-500">
                        <div className="w-full md:w-48 aspect-square bg-[#fbf9f4] overflow-hidden shrink-0">
                          <img src={design.designImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mb-1">{new Date(design.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                              <h4 className="text-sm font-serif italic text-foreground/80 line-clamp-1">"{design.description}"</h4>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 border border-foreground/10">
                              <span className={`w-1.5 h-1.5 rounded-full ${design.status === 'Pending Review' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                              <span className="text-[9px] uppercase tracking-widest font-bold opacity-60 font-sans">{design.status}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-foreground/5">
                            <div>
                              <p className="text-[8px] uppercase tracking-widest font-bold opacity-30 mb-1">Material</p>
                              <p className="text-[10px] font-bold">{design.material}</p>
                            </div>
                            <div>
                              <p className="text-[8px] uppercase tracking-widest font-bold opacity-30 mb-1">Budget</p>
                              <p className="text-[10px] font-bold">{design.budget}</p>
                            </div>
                            <div>
                              <p className="text-[8px] uppercase tracking-widest font-bold opacity-30 mb-1">Timeline</p>
                              <p className="text-[10px] font-bold">{design.timeline}</p>
                            </div>
                            <div>
                              <p className="text-[8px] uppercase tracking-widest font-bold opacity-30 mb-1">Ref ID</p>
                              <p className="text-[10px] font-bold opacity-40">{design._id.slice(-6).toUpperCase()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
