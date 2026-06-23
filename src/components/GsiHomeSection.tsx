import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Bot, 
  ArrowRight, 
  Layers, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  Sliders, 
  Activity, 
  Network, 
  Globe, 
  Calendar, 
  Edit3
} from 'lucide-react';
import { FinancialData, Lead, SocialDraft } from '../types';

interface GsiHomeSectionProps {
  onNavigate: (tab: 'home' | 'briefing' | 'luna' | 'jana' | 'lana' | 'mina') => void;
  financials: FinancialData;
  leads: Lead[];
  drafts: SocialDraft[];
}

export default function GsiHomeSection({
  onNavigate,
  financials,
  leads,
  drafts
}: GsiHomeSectionProps) {
  const [stickyNote, setStickyNote] = useState('');
  
  // Load initial value from local storage for high durability custom organizer rule
  useEffect(() => {
    const saved = localStorage.getItem('gsi_home_notes');
    if (saved) {
      setStickyNote(saved);
    } else {
      setStickyNote("🎯 Priority Focus Today:\n- Vibe TikTok scripts for RETINOL launching.\n- Check Terengganu silk COGS discounts with supplier.\n- Reach out to Farrah H (HOT TikTok lead).");
    }
  }, []);

  const handleSaveNote = () => {
    localStorage.setItem('gsi_home_notes', stickyNote);
    alert('Pinned new priority objectives on the GSI Workspace Board!');
  };

  const calculatedNetProfit = financials.revenue - financials.cogs - financials.adSpend - financials.fees;
  const hotLeadsCount = leads.filter(l => l.intent === 'Hot').length;

  return (
    <div className="space-y-6" id="gsi-home-workspace">
      {/* Hero Header Space */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 lg:p-8 text-white shadow-md border border-indigo-950">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-15 pointer-events-none">
          <Layers className="w-80 h-80 text-white" />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-200 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase border border-indigo-500/30">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            
          </div>
          <h2>
            GSI Workspace
          </h2>
          <p className="text-xs lg:text-sm text-indigo-100/90 leading-relaxed max-w-2xl">
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('briefing')}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl transition duration-150 flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              Initialize Morning Briefing <ArrowRight className="w-4 h-4" />
            </button>
            <a 
              href="#active-console"
              className="text-xs bg-white/10 hover:bg-white/15 text-white font-bold py-2.5 px-4 rounded-xl transition duration-150 border border-white/10 flex items-center gap-1.5"
            >
              Review Hub Logs
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Info Widgets & Interactive Dashboard elements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: System Status Grid & Agent Quick access */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Stats Grid representing current ecosystem values */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            
            <div className="bg-white p-4 rounded-xl shadow-2xs border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">E-Commerce Net Profit</span>
                <span className="text-lg font-bold text-slate-800">RM {calculatedNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
              <span className={`text-[10px] font-semibold mt-2 block ${financials.marginAlert ? 'text-rose-600' : 'text-emerald-600'}`}>
                {financials.marginAlert ? '⚠️ Check margins below 15%' : '✅ Operationally Secure'}
              </span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-2xs border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Active Hot Leads</span>
                <span className="text-lg font-bold text-slate-800">{hotLeadsCount} Outstanding</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium mt-2 block">Awaiting WhatsApp Outreach</span>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-2xs border border-slate-200/80 flex flex-col justify-between col-span-2 sm:col-span-1">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Content Draft Hub</span>
                <span className="text-lg font-bold text-slate-800">{drafts.length} Asset Files</span>
              </div>
              <span className="text-[10px] text-indigo-650 font-bold mt-2 block">{drafts.filter(d => d.status === 'Approved').length} Fully Approved</span>
            </div>

          </div>

          {/* Quick Access Portals to the AI Agents */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
              <Network className="w-4.5 h-4.5 text-indigo-600 animate-pulse" /> Launch Agent Workspaces
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div 
                onClick={() => onNavigate('luna')}
                className="group border border-slate-100 bg-slate-50 p-4 rounded-xl hover:bg-indigo-50/20 hover:border-indigo-100 transition duration-150 cursor-pointer flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold">L</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-950 flex items-center gap-1">
                    LUNA: Social Control <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Manage TikTok script schedules, draft caption generators, and GMC connected feed queues.
                  </p>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('jana')}
                className="group border border-slate-100 bg-slate-50 p-4 rounded-xl hover:bg-emerald-50/20 hover:border-emerald-100 transition duration-150 cursor-pointer flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">J</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-950 flex items-center gap-1">
                    JANA: Sales & Leads Pipeline <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Hot Shopee inquiries, custom lead routing, automated outreach checklists, and product SEO.
                  </p>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('lana')}
                className="group border border-slate-100 bg-slate-50 p-4 rounded-xl hover:bg-violet-50/20 hover:border-violet-100 transition duration-150 cursor-pointer flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 font-bold">La</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-violet-950 flex items-center gap-1">
                    LANA: Rising Star trends <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Conduct deep analytics for Southeast Asian product categories & TikTok Shop velocity spikes.
                  </p>
                </div>
              </div>

              <div 
                onClick={() => onNavigate('mina')}
                className="group border border-slate-100 bg-slate-50 p-4 rounded-xl hover:bg-amber-50/20 hover:border-amber-100 transition duration-150 cursor-pointer flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">M</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-amber-950 flex items-center gap-1">
                    MINA: Balance Ledger <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Real-time operational cashflow tuning, pricing margins modeling sandbox tools.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right 1 Column: Interactive Notepad & Quick Status Panel */}
        <div className="space-y-6">
          
          {/* Interactive GSI Priority Notepad */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-5 shadow-2xs space-y-3 relative">
            <div className="flex justify-between items-center bg-amber-100/50 -mx-5 -mt-5 px-5 py-2.5 rounded-t-xl border-b border-amber-200/50">
              <h3 className="text-xs font-bold uppercase text-amber-900 flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5" /> Workspace Central Board
              </h3>
              <span className="text-[9px] font-bold text-amber-700 font-mono tracking-wide uppercase">Interactive</span>
            </div>

            <p className="text-[11px] text-amber-800">
              Set priority objectives for this working session. Saved notes will persist in browser memory cache.
            </p>

            <textarea
              className="w-full h-32 bg-white/90 p-3 rounded-lg border border-amber-200 focus:outline-hidden text-xs text-slate-900 font-sans leading-relaxed"
              value={stickyNote}
              onChange={(e) => setStickyNote(e.target.value)}
              placeholder="Draft your operational notes here..."
            />

            <button
              onClick={handleSaveNote}
              className="w-full text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 py-2 rounded-lg transition"
            >
              Pin Objectives to Dashboard
            </button>
          </div>

          {/* Connected Channels List */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
              <Globe className="w-4.5 h-4.5 text-slate-400" /> Platform API Connectivity
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-650 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Lazada API Feed
                </span>
                <span className="text-[10px] font-mono text-slate-400">Connected 100%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-650 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Shopee Sandbox Feed
                </span>
                <span className="text-[10px] font-mono text-slate-400">Connected 100%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-650 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Shopify Webhook
                </span>
                <span className="text-[10px] font-mono text-slate-400">Active</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-650 flex items-center gap-1.5 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> GMC merchant center
                </span>
                <span className="text-[10px] font-mono text-slate-450">Pending sync...</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Embedded Terminal Status view from professional polish aesthetic */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-950 flex flex-col justify-between space-y-4 shadow-md" id="active-console">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> Active Workspace Feed Status
          </div>
          <span className="text-[9px] font-mono text-slate-500 uppercase">SYS-LOG_ACTIVE</span>
        </div>

        <div className="font-mono text-xs text-slate-300 space-y-1">
          <div>&gt; _ INITIALIZATION: GSI Command desk successful.</div>
          <div>&gt; _ CACHED DATA LOADED: Gross margin index verified ({((financials.netProfit / financials.revenue * 100) || 0).toFixed(1)}%).</div>
          <div>&gt; _ AUDIT TRIGGERED: {leads.length} active leads currently synchronized across connected social nodes.</div>
        </div>

        <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
          Last Verified Sync Time: {new Date().toLocaleTimeString()} • Live Node Connection OK SGP
        </div>
      </div>

    </div>
  );
}
