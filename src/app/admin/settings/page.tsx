"use client";

import { useState } from "react";
import { Save, Shield, Bell, User, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-12 max-w-4xl">
      <div>
        <h3 className="text-2xl font-serif">Studio Settings</h3>
        <p className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold">Configure your atelier management experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Section */}
        <div className="bg-white p-8 border border-foreground/5 space-y-6">
          <div className="flex items-center gap-3 border-b border-foreground/5 pb-4">
             <User size={18} className="text-accent" />
             <h4 className="text-xs uppercase tracking-widest font-bold">Atelier Profile</h4>
          </div>
          <div className="space-y-4">
             <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest opacity-40 font-bold">Admin Name</label>
                <input className="w-full bg-[#fbf9f4] border-none outline-none p-3 text-xs font-bold font-sans" defaultValue="Atelier Admin" />
             </div>
             <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest opacity-40 font-bold">Role Identifier</label>
                <input className="w-full bg-[#fbf9f4] border-none outline-none p-3 text-xs font-bold font-sans opacity-50" defaultValue="Senior Craftsman" readOnly />
             </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white p-8 border border-foreground/5 space-y-6">
          <div className="flex items-center gap-3 border-b border-foreground/5 pb-4">
             <Shield size={18} className="text-accent" />
             <h4 className="text-xs uppercase tracking-widest font-bold">Security & Keys</h4>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-center text-xs">
                <span className="opacity-60 font-medium">Two-Factor Authentication</span>
                <span className="text-[8px] px-2 py-1 bg-green-50 text-green-600 font-bold uppercase tracking-widest">Active</span>
             </div>
             <button className="text-[9px] uppercase tracking-widest font-bold text-accent py-2 border-b border-accent/20 hover:border-accent transition-all">
                Rotate API Secret
             </button>
          </div>
        </div>

        {/* Localization Section */}
        <div className="bg-white p-8 border border-foreground/5 space-y-6">
          <div className="flex items-center gap-3 border-b border-foreground/5 pb-4">
             <Globe size={18} className="text-accent" />
             <h4 className="text-xs uppercase tracking-widest font-bold">Internationalization</h4>
          </div>
          <div className="space-y-4 text-xs">
             <p className="opacity-50">Base Currency: <span className="text-foreground font-bold">INR (₹)</span></p>
             <p className="opacity-50">Timezone: <span className="text-foreground font-bold">IST (Asia/Kolkata)</span></p>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white p-8 border border-foreground/5 space-y-6">
          <div className="flex items-center gap-3 border-b border-foreground/5 pb-4">
             < Bell size={18} className="text-accent" />
             <h4 className="text-xs uppercase tracking-widest font-bold">Dispatch Alerts</h4>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-2">
                <input type="checkbox" checked readOnly className="accent-accent" />
                <span className="text-xs opacity-60">Notify on new Atelier Request</span>
             </div>
             <div className="flex items-center gap-2">
                <input type="checkbox" checked readOnly className="accent-accent" />
                <span className="text-xs opacity-60">Daily Fulfillment Digest</span>
             </div>
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-end">
         <button className="bg-[#1b1c19] text-white px-10 py-5 text-[10px] uppercase tracking-[0.3em] font-bold flex items-center gap-3 hover:bg-accent transition-all shadow-xl group">
            <Save size={16} className="group-hover:scale-110 transition-transform" />
            Save Atelier Configuration
         </button>
      </div>
    </div>
  );
}
