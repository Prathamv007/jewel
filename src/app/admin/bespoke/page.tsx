"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  MoreVertical,
  Filter,
  Search
} from "lucide-react";

interface BespokeRequest {
  id: string;
  userId: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  designImage: string;
  description: string;
  material: string;
  gemstones?: string;
  budget: string;
  timeline?: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
}

export default function AdminBespokePage() {
  const [requests, setRequests] = useState<BespokeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ budget: "", material: "", adminNotes: "", status: "" });

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/bespoke");
      const data = await res.json();
      if (Array.isArray(data)) {
        setRequests(data);
      }
    } catch (error) {
      console.error("Failed to fetch bespoke requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/bespoke/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        setRequests(requests.map(req => 
          req.id === id ? { ...req, ...editForm } : req
        ));
        setEditingId(null);
      } else {
         console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Failed to execute update:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Review": return "text-amber-500 bg-amber-50";
      case "Design in Progress": return "text-blue-500 bg-blue-50";
      case "Quoted": return "text-indigo-500 bg-indigo-50";
      case "In Production": return "text-violet-500 bg-violet-50";
      case "Completed": return "text-emerald-500 bg-emerald-50";
      case "Cancelled": return "text-gray-500 bg-gray-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };

  const filteredRequests = filter === "All" 
    ? requests 
    : requests.filter(req => req.status === filter);

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 border border-foreground/5 relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold mb-1 block">Active Designs</span>
            <p className="text-3xl font-serif">{requests.filter(r => r.status !== "Completed" && r.status !== "Declined").length}</p>
          </div>
          <Clock className="absolute top-1/2 -right-4 -translate-y-1/2 w-24 h-24 text-accent/5 -rotate-12 transition-transform group-hover:rotate-0" />
        </div>
        <div className="bg-white p-6 border border-foreground/5">
          <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold mb-1 block">Pending Review</span>
          <p className="text-3xl font-serif text-amber-600">{requests.filter(r => r.status === "Pending Review").length}</p>
        </div>
        <div className="bg-white p-6 border border-foreground/5">
          <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold mb-1 block">In Production</span>
          <p className="text-3xl font-serif text-indigo-600">{requests.filter(r => r.status === "In Production").length}</p>
        </div>
        <div className="bg-white p-6 border border-foreground/5">
          <span className="text-[10px] uppercase tracking-widest text-foreground/40 font-bold mb-1 block">Completed Total</span>
          <p className="text-3xl font-serif text-emerald-600">{requests.filter(r => r.status === "Completed").length}</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 border border-foreground/5">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-foreground/40" />
          <div className="flex gap-1">
            {["All", "Pending Review", "Quoted", "In Production", "Completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-all ${
                  filter === f ? "bg-foreground text-white" : "hover:bg-foreground/5 text-foreground/60"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
          <input 
            type="text" 
            placeholder="Search visionary..." 
            className="w-full pl-9 pr-4 py-2 text-[10px] uppercase tracking-widest bg-foreground/5 border-none focus:ring-1 focus:ring-accent outline-none"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-foreground/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-foreground/5 bg-foreground/[0.02]">
              <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40">Commission Detail</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40">Visionary</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40">Budget & Material</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40">Status</th>
              <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-foreground/5">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center">
                  <div className="animate-pulse flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/40">Consulting Archives...</span>
                  </div>
                </td>
              </tr>
            ) : filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-20 text-center text-[10px] uppercase tracking-[0.3em] text-foreground/40 italic">
                  No commissions found in this ledger.
                </td>
              </tr>
            ) : filteredRequests.map((req) => (
              <React.Fragment key={req.id}>
                <tr className="group hover:bg-foreground/[0.01] transition-colors">
                  <td className="px-6 py-6 font-serif">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 bg-[#fbf9f4] overflow-hidden">
                        <Image 
                          src={req.designImage} 
                          alt="Design vision" 
                          fill 
                          className="object-cover transition-transform group-hover:scale-110 duration-700"
                        />
                      </div>
                      <div>
                        <span className="text-[8px] uppercase tracking-widest text-foreground/40 mb-1 block">
                          {new Date(req.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                        <p className="text-sm line-clamp-2 italic leading-relaxed text-foreground/80 max-w-xs capitalize">
                          "{req.description}"
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-xs font-bold uppercase tracking-widest">
                      {req.userId?.firstName} {req.userId?.lastName}
                    </p>
                    <p className="text-[10px] text-foreground/40 lowercase tracking-wider">
                      {req.userId?.email}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-xs uppercase tracking-widest font-bold text-accent">
                      {req.budget}
                    </p>
                    <p className="text-[10px] text-foreground/40 uppercase tracking-widest mt-1">
                      {req.material} {req.gemstones ? `• ${req.gemstones}` : ""}
                    </p>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${getStatusColor(req.status)}`}>
                      <span className="w-1 h-1 rounded-full bg-current" />
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingId(req.id);
                          setEditForm({
                            budget: req.budget || "",
                            material: req.material || "",
                            adminNotes: req.adminNotes || "",
                            status: req.status || ""
                          });
                        }}
                        className="p-1 px-4 text-[9px] uppercase tracking-widest font-bold bg-foreground text-white hover:bg-accent transition-colors"
                      >
                        Evaluate
                      </button>
                    </div>
                  </td>
                </tr>
                {editingId === req.id && (
                  <tr className="bg-foreground/[0.03] border-b border-foreground/10">
                    <td colSpan={5} className="px-6 py-6">
                      <div className="grid grid-cols-4 gap-6 items-end">
                        <div>
                          <label className="text-[9px] uppercase tracking-widest font-bold text-foreground/40 block mb-2">Adjust Budget</label>
                          <input 
                            value={editForm.budget} 
                            onChange={e => setEditForm({...editForm, budget: e.target.value})} 
                            className="w-full bg-white border border-foreground/10 px-3 py-2 text-xs outline-none focus:border-accent" 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase tracking-widest font-bold text-foreground/40 block mb-2">Adjust Material</label>
                          <input 
                            value={editForm.material} 
                            onChange={e => setEditForm({...editForm, material: e.target.value})} 
                            className="w-full bg-white border border-foreground/10 px-3 py-2 text-xs outline-none focus:border-accent" 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase tracking-widest font-bold text-foreground/40 block mb-2">Visionary Memo (Reply)</label>
                          <input 
                            value={editForm.adminNotes} 
                            onChange={e => setEditForm({...editForm, adminNotes: e.target.value})} 
                            placeholder="Message to client..." 
                            className="w-full bg-white border border-foreground/10 px-3 py-2 text-xs outline-none focus:border-accent" 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] uppercase tracking-widest font-bold text-foreground/40 block mb-2">Stage Progression</label>
                          <select 
                            value={editForm.status} 
                            onChange={e => setEditForm({...editForm, status: e.target.value})} 
                            className="w-full bg-white border border-foreground/10 px-3 py-2 text-xs outline-none cursor-pointer focus:border-accent"
                          >
                              <option value="Pending Review">Review</option>
                              <option value="Design in Progress">Design</option>
                              <option value="Quoted">Quote</option>
                              <option value="In Production">Produce</option>
                              <option value="Completed">Complete</option>
                              <option value="Cancelled">Cancel</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setEditingId(null)} className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold text-foreground/60 hover:text-foreground">
                          Cancel
                        </button>
                        <button onClick={() => saveEdit(req.id)} className="px-6 py-2 text-[10px] uppercase tracking-widest font-bold bg-foreground text-white hover:bg-accent transition-colors">
                          Commit Revisions
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

