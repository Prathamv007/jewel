"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Send, ChevronRight } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-[#fbf9f4] text-foreground">
      <Navbar />

      <section className="pt-44 pb-24 container mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-24">

        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent block">
              Contact Us
            </span>
            <h1 className="text-5xl lg:text-7xl font-serif leading-[1.05]">
              Let's Start <br />
              <span className="italic font-light opacity-60 text-accent">a Conversation</span>
            </h1>
            <p className="text-foreground/50 max-w-sm font-light leading-relaxed">
              Our master artisans and consultants are here to help you navigate your jewelry journey. Whether it's a sizing question or a vision for a legacy piece, we welcome the dialogue.
            </p>
          </div>

          <div className="space-y-8 pt-8 border-t border-foreground/5">
            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-white flex items-center justify-center border border-foreground/5 group-hover:border-accent/30 transition-colors">
                <Mail size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-30 mb-1">Email Us</p>
                <p className="text-sm font-serif">atelier@vedikajewels.com</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-white flex items-center justify-center border border-foreground/5 group-hover:border-accent/30 transition-colors">
                <Phone size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-30 mb-1">Call Our Studio</p>
                <p className="text-sm font-serif">+41 22 555 0192</p>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
              <div className="w-12 h-12 bg-white flex items-center justify-center border border-foreground/5 group-hover:border-accent/30 transition-colors">
                <MapPin size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-30 mb-1">Visit The Atelier</p>
                <p className="text-sm font-serif leading-relaxed">Rue de la Corraterie 24, <br />1204 Genève, Switzerland</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-12 lg:p-16 border border-foreground/5 relative overflow-hidden">
            <AnimatePresence>
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-10 bg-white flex flex-col items-center justify-center text-center p-12 space-y-6"
                >
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                    <Send size={24} />
                  </div>
                  <h2 className="text-3xl font-serif">Message Received</h2>
                  <p className="text-foreground/50 text-sm max-w-xs font-light">
                    Our team will review your inquiry and respond within 24 hours. Thank you for reaching out to Vedika.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="text-[10px] uppercase tracking-widest font-bold text-accent underline decoration-accent/20"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alexander Vance"
                    className="w-full bg-transparent border-b border-foreground/10 py-3 focus:border-accent outline-none text-sm font-serif transition-colors"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. alex@vance.com"
                    className="w-full bg-transparent border-b border-foreground/10 py-3 focus:border-accent outline-none text-sm font-serif transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Inquiry Subject</label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-transparent border-b border-foreground/10 py-3 focus:border-accent outline-none text-sm font-serif transition-colors appearance-none"
                >
                  <option>General Inquiry</option>
                  <option>Sizing & Repair</option>
                  <option>Atelier Commission</option>
                  <option>Order Status</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-30">Your Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can our artisans assist you?"
                  className="w-full bg-transparent border-b border-foreground/10 py-3 focus:border-accent outline-none text-sm font-serif transition-colors resize-none"
                />
              </div>

              <button
                disabled={status === "sending"}
                type="submit"
                className="w-full bg-[#1b1c19] text-white py-6 flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold disabled:opacity-50 hover:bg-accent transition-all shadow-xl"
              >
                {status === "sending" ? "Relaying Message..." : "Relay to Atelier"}
                <ChevronRight size={14} />
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
