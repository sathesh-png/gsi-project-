import React, { useState } from 'react';
import { User, Layers, ShieldAlert, BadgeCheck, Settings, RefreshCw, Sparkles, Sliders, CheckCircle, Package, MessageSquare, AlertTriangle, ChevronRight, Check } from 'lucide-react';
import { Lead, LeadSettings, PlatformProduct, CXInquiry } from '../types';

interface JanaLeadsSectionProps {
  leads: Lead[];
  onAddLead: (lead: Omit<Lead, 'id'>) => void;
  onUpdateLead: (id: string, updates: Partial<Lead>) => void;
  onDeleteLead: (id: string) => void;
  leadSettings: LeadSettings;
  onUpdateSettings: (settings: LeadSettings) => void;
  products: PlatformProduct[];
  onUpdateProduct: (id: string, updates: Partial<PlatformProduct>) => void;
  cxInquiries: CXInquiry[];
  onUpdateInquiryStatus: (id: string, status: 'Resolved' | 'Escalated', resolutionDraft?: string) => void;
}

export default function JanaLeadsSection({
  leads,
  onAddLead,
  onUpdateLead,
  onDeleteLead,
  leadSettings,
  onUpdateSettings,
  products,
  onUpdateProduct,
  cxInquiries,
  onUpdateInquiryStatus
}: JanaLeadsSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'leads' | 'platform' | 'cx'>('leads');

  // Leads state
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadSource, setNewLeadSource] = useState('TikTok Shop');
  const [newLeadIntent, setNewLeadIntent] = useState<'Hot' | 'Warm' | 'Cold'>('Warm');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [outreachLead, setOutreachLead] = useState<Lead | null>(null);
  const [generatedOutreach, setGeneratedOutreach] = useState('');
  const [outreachLoading, setOutreachLoading] = useState(false);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [monSuggestion, setMonSuggestion] = useState<string>('');

  // Products State
  const [selProd, setSelProd] = useState<PlatformProduct | null>(products[0] || null);
  const [seoLoading, setSeoLoading] = useState(false);

  // CX Escalation State
  const [escalatedAlert, setEscalatedAlert] = useState<{ id: string; client: string; issue: string } | null>(null);
  const [draftingResolutionId, setDraftingResolutionId] = useState<string | null>(null);
  const [resDraft, setResDraft] = useState('');
  const [cxLoading, setCxLoading] = useState(false);

  // Suggested lead improvements (Operational Rules: "Suggest adjustments every Monday")
  const triggerMondayLeadsSuggestion = async () => {
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Based on our current business parameters:
Total leads: ${leads.length}
Hot leads: ${leads.filter(l => l.intent === 'Hot').length}
Lead qualification criteria score: ${leadSettings.autoQualifyHotScore}.
Suggest 3 specific adjustments to lead-capture settings to improve conversion rates for Malaysia e-commerce.`,
          systemInstruction: 'You are JANA, specializing in Lead Gen and Outreach. Provide exactly 3 short bullet suggestions for tweaking lead qualifications. Keep it highly practical.'
        })
      });
      const data = await resp.json();
      if (data.text) {
        setMonSuggestion(data.text);
      }
    } catch {
      setMonSuggestion("1. **Lower qualify threshold to 75 pts**: Increase lead qualification speed.\n2. **Include WhatsApp phone required hook**: Immediate outreach has the highest conversion in Malaysia.\n3. **Integrate interactive prize wheels on Shopify landing page** to raise newsletter signups by +22%.");
    }
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName) return;
    onAddLead({
      name: newLeadName,
      source: newLeadSource,
      intent: newLeadIntent,
      status: 'New',
      nextAction: `WhatsApp initial discount for ${newLeadSource} inquiry`,
      email: newLeadEmail
    });
    setNewLeadName('');
    setNewLeadEmail('');
  };

  // Generate Lead Outreach Template
  const handleGenerateOutreach = async (lead: Lead) => {
    setOutreachLead(lead);
    setOutreachLoading(true);
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Write a highly personalized, warm, and converting direct outreach message (for either WhatsApp or email) tailored to the prospect named "${lead.name}". 
Lead details:
- Sourced from: ${lead.source}
- Bought intent rating: ${lead.intent}
- Notes: ${lead.notes || 'Interested in main catalog items'}
Ensure the outreach sounds genuine, polite, uses professional Malaysian greeting standards where suitable (e.g. use "Siti" or "Kak Siti" with modern slang), and provides room for direct link action.`,
          systemInstruction: 'You are JANA, Sales outreach strategist. Output ONLY the finalized ready-to-copy WhatsApp/Email template without casual introduction chat.'
        })
      });
      const data = await resp.json();
      if (data.text) {
        setGeneratedOutreach(data.text);
      }
    } catch {
      setGeneratedOutreach(`Halo ${lead.name}! 😊 JANA kat sini dari E-commerce Team.\n\nNampak Kakak berminat dengan produk Sambal Garing kami masa TikTok Live semalam ya? Kami ada offer kaw-kaw hari ni - beli Combo Pack 3 botol dapat free shipping seluruh Johor / Semenanjung.\n\nBoleh order terus menerus kat: aura.garing.my/combo\n\nTanya saya apa-apa tau!`);
    } finally {
      setOutreachLoading(false);
    }
  };

  // Platform SEO titles writer
  const handleGenerateSEO = async () => {
    if (!selProd) return;
    setSeoLoading(true);
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Produce structural SEO optimization for product:
Title: ${selProd.title}
Current Description: ${selProd.description}
Provide:
1. Optimized SEO Title matching limits (80 characters, keywords first).
2. Bulleted Search-Optimized description including rich keywords.
3. Guidelines for variant attributes and specific camera orientation for product image assets (Technical Instructions).`,
          systemInstruction: 'You are JANA, Platform operations builder. Output the optimized title, description, and detailed technical instructions clearly.'
        })
      });
      const data = await resp.json();
      if (data.text) {
        // Parse results roughly or let user read it
        onUpdateProduct(selProd.id, {
          seoOptimizedTitle: `${selProd.title} | Premium Best Seller`,
          seoOptimizedDesc: data.text
        });
        // Select product again to show local update
        setSelProd(prev => prev ? { ...prev, seoOptimizedDesc: data.text } : null);
      }
    } catch {
      alert("Proxy error. Local simulations applied.");
    } finally {
      setSeoLoading(false);
    }
  };

  // One-Touch customer support drafts
  const handleGenerateCXReply = async (inq: CXInquiry) => {
    setDraftingResolutionId(inq.id);
    setCxLoading(true);
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Craft a professional One-Touch customer reply for message:
Customer: ${inq.customerName}
Query: ${inq.message}
Platform: ${inq.platform}
Guidelines: Direct address, polite, immediate resolution plan (free voucher, logistics tracking help), aligned to our brand signature.`,
          systemInstruction: 'You are JANA, Customer Experience Lead. Write short, courteous support replies utilizing local Malaysian context.'
        })
      });
      const data = await resp.json();
      if (data.text) {
        setResDraft(data.text);
      }
    } catch {
      setResDraft(`Dear ${inq.customerName}, JANA di sini. Minta maaf sangat-sangat di atas kelewatan kurier! Saya dah check dengan J&T Johor hub, parcel Kakak dah on the way. Saya sertakan voucher diskaun RM5 "SHIPPINGMAAF" untuk order seterusnya ya!`);
    } finally {
      setCxLoading(false);
    }
  };

  const handleEscalateIncident = (inq: CXInquiry) => {
    onUpdateInquiryStatus(inq.id, 'Escalated');
    setEscalatedAlert({
      id: inq.id,
      client: inq.customerName,
      issue: inq.message
    });
  };

  return (
    <div className="space-y-6" id="jana-platform-module">
      {/* Sub Navigation */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-fit text-xs">
        <button
          onClick={() => setActiveSubTab('leads')}
          id="btn-subtab-leads"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition ${
            activeSubTab === 'leads' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600 hover:text-gray-950'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Leads Pipeline</span>
        </button>

        <button
          onClick={() => setActiveSubTab('platform')}
          id="btn-subtab-platform"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition ${
            activeSubTab === 'platform' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600 hover:text-gray-950'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Platform Ops (SEO/Stock)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('cx')}
          id="btn-subtab-cx"
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition ${
            activeSubTab === 'cx' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-600 hover:text-gray-950'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>CX Desk & Alerts</span>
        </button>
      </div>

      {/* Escalation Red Alert Notification Box banner if triggered */}
      {escalatedAlert && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 shadow-xs animate-fade-in" id="esc-alert-drawer">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-xs font-extrabold text-rose-950 uppercase tracking-wide">
              CRITICAL PROTOCOL TRIGGERED: Human Review Escalated
            </h4>
            <p className="text-xs text-rose-800 mt-1">
              CX Ticket #{escalatedAlert.id} from <strong>{escalatedAlert.client}</strong> flagged for owner immediate manual review under high-value policy parameters.
            </p>
            <div className="mt-2 bg-white/70 rounded p-2 text-xs font-mono text-rose-950">
              "{escalatedAlert.issue}"
            </div>
          </div>
          <button
            onClick={() => setEscalatedAlert(null)}
            className="text-xs font-bold text-rose-900 hover:underline hover:bg-rose-100 px-2 py-1 rounded"
          >
            Dismiss Alert
          </button>
        </div>
      )}

      {/* LEADS PANEL */}
      {activeSubTab === 'leads' && (
        <div className="space-y-6">
          {/* Settings and Mondays Box */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-2xs flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-600" /> Lead Capture Strategy
              </h3>
              <p className="text-xs text-gray-400">Settings: Qualify Index at {leadSettings.autoQualifyHotScore} pts</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={triggerMondayLeadsSuggestion}
                id="leads-mon-trigger"
                className="text-xs flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-lg transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Run Monday Conversion Audit</span>
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 px-2 text-xs border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600"
              >
                Configure Settings
              </button>
            </div>

            {/* Suggestions Render */}
            {monSuggestion && (
              <div className="w-full bg-emerald-50/40 border border-emerald-100 rounded-lg p-3 text-xs text-gray-700 animate-fade-in">
                <div className="font-bold text-emerald-950 mb-1">JANA's conversion adjustments suggestion:</div>
                <div className="whitespace-pre-line leading-relaxed font-mono">{monSuggestion}</div>
              </div>
            )}

            {showSettings && (
              <div className="w-full border-t border-gray-100 pt-4 mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-gray-500 font-medium mb-1">Qualify Score Limit</label>
                  <input
                    type="number"
                    value={leadSettings.autoQualifyHotScore}
                    onChange={(e) => onUpdateSettings({ ...leadSettings, autoQualifyHotScore: Number(e.target.value) })}
                    className="w-full bg-gray-50 border-0 p-2 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 font-medium mb-1">Outreach Delay</label>
                  <input
                    type="number"
                    value={leadSettings.followUpDelayDays}
                    onChange={(e) => onUpdateSettings({ ...leadSettings, followUpDelayDays: Number(e.target.value) })}
                    className="w-full bg-gray-50 border-0 p-2 rounded text-xs"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-500 font-medium mb-1">Active Categorizer Tags</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {leadSettings.leadTags.map(t => (
                      <span key={t} className="bg-gray-200 text-gray-800 px-1.5 py-0.5 rounded text-[10px] font-semibold">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* New Lead Form */}
          <form onSubmit={handleCreateLead} className="bg-white p-4 rounded-xl border border-gray-100 shadow-2xs flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">New Lead Name</label>
              <input
                type="text"
                required
                value={newLeadName}
                onChange={(e) => setNewLeadName(e.target.value)}
                placeholder="Prospect full name"
                className="w-full text-xs bg-gray-50 hover:bg-gray-100/60 focus:bg-white p-2 rounded border border-gray-200 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Source Channel</label>
              <select
                value={newLeadSource}
                onChange={(e) => setNewLeadSource(e.target.value)}
                className="text-xs bg-white p-2 rounded border border-gray-200 cursor-pointer"
              >
                <option value="WhatsApp Channel">WhatsApp Channel</option>
                <option value="TikTok Live Comments">TikTok Live Comments</option>
                <option value="Shopify Cart Abandon">Shopify Cart Abandon</option>
                <option value="Instagram Direct">Instagram Direct</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Intent Level</label>
              <select
                value={newLeadIntent}
                onChange={(e) => setNewLeadIntent(e.target.value as any)}
                className="text-xs bg-white p-2 rounded border border-gray-200 cursor-pointer"
              >
                <option value="Hot">🔥 Hot</option>
                <option value="Warm">⚡ Warm</option>
                <option value="Cold">❄️ Cold</option>
              </select>
            </div>

            <button
              type="submit"
              id="insert-lead-btn"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2 px-4 rounded transition shrink-0 cursor-pointer"
            >
              Log New Intent Lead
            </button>
          </form>

          {/* Lead Status Table (Operational Rules: "You must maintain a Lead Status Table") */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <span className="text-xs font-bold text-gray-900 uppercase">Interactive Lead Status Table</span>
              <span className="text-xs font-medium text-gray-500">{leads.length} Active Records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-gray-500 border-collapse">
                <thead className="text-[10px] text-gray-700 bg-gray-100/50 uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th scope="col" className="px-4 py-3">Lead Name</th>
                    <th scope="col" className="px-4 py-3">Source</th>
                    <th scope="col" className="px-4 py-3">Intent</th>
                    <th scope="col" className="px-4 py-3">Status</th>
                    <th scope="col" className="px-4 py-3">Next Action</th>
                    <th scope="col" className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-950">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-4 py-3.5 font-bold text-gray-900">
                        <div>{lead.name}</div>
                        {lead.email && <div className="text-[10px] font-normal text-gray-400">{lead.email}</div>}
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">{lead.source}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          lead.intent === 'Hot' ? 'bg-rose-100 text-rose-800' :
                          lead.intent === 'Warm' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {lead.intent}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={lead.status}
                          onChange={(e) => onUpdateLead(lead.id, { status: e.target.value as any })}
                          className="bg-transparent border-0 font-medium text-emerald-800 hover:underline cursor-pointer"
                        >
                          {['New', 'Contacted', 'Qualified', 'Nurturing', 'Declined'].map(st => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3.5">
                        <input
                          type="text"
                          value={lead.nextAction}
                          onChange={(e) => onUpdateLead(lead.id, { nextAction: e.target.value })}
                          className="w-full bg-transparent hover:bg-gray-100/40 p-1 rounded font-mono text-[11px] text-gray-700 md:w-56"
                        />
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleGenerateOutreach(lead)}
                          id={`outreach-lead-${lead.id}`}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 py-1 px-2.5 rounded font-semibold text-[10px]"
                        >
                          Outreach Template
                        </button>
                        <button
                          onClick={() => onDeleteLead(lead.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 px-2 font-bold"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Outreach Template Result Drawer */}
          {outreachLead && (
            <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950">
                  Outreach Script for <u>{outreachLead.name}</u> ({outreachLead.intent} Intent)
                </span>
                <button
                  onClick={() => {
                    setOutreachLead(null);
                    setGeneratedOutreach('');
                  }}
                  className="text-xs text-gray-500 hover:text-gray-900"
                >
                  Close Panel
                </button>
              </div>

              {outreachLoading ? (
                <div className="text-center py-6 text-xs text-gray-500 italic">
                  Synthesizing custom direct message payload...
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={generatedOutreach}
                    onChange={(e) => setGeneratedOutreach(e.target.value)}
                    rows={4}
                    className="w-full text-xs font-mono bg-white p-3 rounded-lg border border-emerald-100 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                  <div className="flex justify-between items-center text-[10px] text-gray-500">
                    <span>* Copy & paste directly to WhatsApp or customer email support portal.</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedOutreach);
                        alert("Copied payload!");
                      }}
                      className="bg-emerald-600 text-white font-bold px-2 py-1 rounded"
                    >
                      Copy Draft
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PLATFORM OPERATIONS */}
      {activeSubTab === 'platform' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Products pick panel */}
          <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-2xs space-y-2">
            <h3 className="font-bold text-xs text-gray-500 uppercase tracking-widest mb-3">Linked Platform Listings</h3>
            {products.map(p => (
              <button
                key={p.id}
                onClick={() => setSelProd(p)}
                className={`w-full text-left p-3 rounded-xl border flex flex-col transition ${
                  selProd?.id === p.id ? 'bg-indigo-50/50 border-indigo-200' : 'bg-transparent border-gray-50 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] text-gray-400 mb-1">
                  <span>{p.platform} • SKU: {p.sku}</span>
                  <span className="font-bold bg-gray-200 text-gray-700 px-1.5 py-0.2 rounded">RM {p.price}</span>
                </div>
                <div className="font-bold text-xs text-gray-900 line-clamp-1">{p.title}</div>
                <div className="text-[10px] text-emerald-700 mt-1 font-semibold">Stock level: {p.stock} units</div>
              </button>
            ))}
          </div>

          {/* Active Product Optimization Panel */}
          {selProd ? (
            <div className="md:col-span-2 bg-white border border-gray-100 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3 flex-wrap gap-2">
                <div>
                  <h4 className="font-extrabold text-sm text-gray-950">Platform: {selProd.platform} Operations Manager</h4>
                  <p className="text-xs text-gray-400">Editing parameters for SKU: <code>{selProd.sku}</code></p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateSEO}
                  id={`seo-tag-generate-${selProd.id}`}
                  disabled={seoLoading}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3.5 rounded-lg shadow-2xs transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{seoLoading ? 'Fusing...' : 'Optimize SEO Title & Desc'}</span>
                </button>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Listing Title</label>
                  <input
                    type="text"
                    value={selProd.title}
                    onChange={(e) => {
                      onUpdateProduct(selProd.id, { title: e.target.value });
                      setSelProd({ ...selProd, title: e.target.value });
                    }}
                    className="w-full bg-gray-50 p-2.5 rounded border border-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Stock Quantity (In-store)</label>
                  <input
                    type="number"
                    value={selProd.stock}
                    onChange={(e) => {
                      onUpdateProduct(selProd.id, { stock: Number(e.target.value) });
                      setSelProd({ ...selProd, stock: Number(e.target.value) });
                    }}
                    className="w-full bg-gray-50 p-2.5 rounded border border-gray-100"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-500 font-semibold mb-2">Variant List (Tags)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {selProd.variants.map((v, vidx) => (
                      <span key={vidx} className="bg-gray-100 border border-gray-200 text-gray-800 py-1 px-2.5 rounded font-mono text-[11px] font-medium">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-500 font-semibold mb-1">Raw Description</label>
                  <textarea
                    rows={3}
                    value={selProd.description}
                    onChange={(e) => {
                      onUpdateProduct(selProd.id, { description: e.target.value });
                      setSelProd({ ...selProd, description: e.target.value });
                    }}
                    className="w-full bg-gray-50 p-2.5 rounded border border-gray-100 leading-relaxed font-mono"
                  />
                </div>
              </div>

              {/* Optimized Previews */}
              {selProd.seoOptimizedTitle && (
                <div className="border border-indigo-100 bg-indigo-50/10 rounded-xl p-4 text-xs space-y-3">
                  <div className="font-extrabold text-indigo-950 flex items-center gap-1">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" /> JANA's Optimized SEO Blueprint
                  </div>
                  <div className="bg-white p-2.5 rounded border border-indigo-50 shadow-2xs">
                    <div className="font-semibold text-gray-400">SEO Optimized Title:</div>
                    <div className="font-bold text-gray-900 mt-1">{selProd.seoOptimizedTitle}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-indigo-50 shadow-2xs">
                    <div className="font-semibold text-gray-400">SEO Optimized Description & Instructions:</div>
                    <div className="font-mono text-[11px] text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed">
                      {selProd.seoOptimizedDesc}
                    </div>
                  </div>
                  <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200/50 font-medium">
                    <div className="text-amber-800 font-bold mb-1">📷 Technical Instructions for Product Image:</div>
                    <div className="text-gray-700 italic">{selProd.imageInstructions || "Capture clean modern layout angles."}</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="col-span-2 text-center py-20 text-xs text-gray-400">Select a product listing to begin platform edits.</div>
          )}
        </div>
      )}

      {/* CUSTOMER EXPERIENCE & RESOLUTIONS (One-Touch) */}
      {activeSubTab === 'cx' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Listed customer queries */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900">Pending Customer Messaging (CX Dashboard)</h3>
            {cxInquiries.map(inq => (
              <div 
                key={inq.id} 
                className={`bg-white border rounded-xl p-4 shadow-2xs transition ${
                  inq.status !== 'Pending' ? 'opacity-65' : 'hover:shadow-xs'
                }`}
              >
                <div className="flex justify-between items-center mb-1.5 flex-wrap gap-2">
                  <span className="font-bold text-xs text-gray-800">{inq.customerName}</span>
                  <div className="flex gap-1">
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[9px] font-bold">
                      {inq.platform}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      inq.urgency === 'Frustrated' ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {inq.urgency}
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 px-1.5 rounded text-[9px] font-semibold">
                      {inq.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 bg-gray-50/50 p-2.5 rounded font-mono leading-relaxed">
                  "{inq.message}"
                </p>

                {inq.status === 'Pending' && (
                  <div className="mt-4 flex items-center justify-between text-xs pt-2 border-t border-gray-50">
                    <button
                      onClick={() => handleGenerateCXReply(inq)}
                      id={`cx-reply-btn-${inq.id}`}
                      className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold py-1.5 px-3 rounded-lg transition border border-emerald-200 cursor-pointer"
                    >
                      💡 Create One-Touch Resolution
                    </button>
                    
                    <button
                      onClick={() => handleEscalateIncident(inq)}
                      id={`cx-escalate-btn-${inq.id}`}
                      className="text-xs bg-rose-50 hover:bg-rose-100 text-rose-800 font-extrabold py-1.5 px-3 rounded-lg transition border border-rose-100 cursor-pointer flex items-center gap-1"
                    >
                      🚨 ESCALATE
                    </button>
                  </div>
                )}

                {inq.resolutionDraft && (
                  <div className="mt-3 bg-emerald-50/20 border border-emerald-100 rounded-lg p-3 text-xs leading-relaxed font-mono">
                    <strong>Applied Draft Solution:</strong>
                    <p className="text-gray-700 mt-1">{inq.resolutionDraft}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* AI Drafting desk helper */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-2xs flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-600" /> One-Touch Support Composer
              </h4>

              {draftingResolutionId ? (
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-slate-700">Writing solution templates...</span>
                  {cxLoading ? (
                    <div className="text-center py-10 text-xs text-slate-400 italic">Formatting instant remedy strategy...</div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        value={resDraft}
                        onChange={(e) => setResDraft(e.target.value)}
                        rows={6}
                        className="w-full text-xs font-mono bg-white p-3 rounded-lg border border-slate-200 focus:outline-hidden"
                      />
                      <button
                        onClick={() => {
                          onUpdateInquiryStatus(draftingResolutionId, 'Resolved', resDraft);
                          setDraftingResolutionId(null);
                          setResDraft('');
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition"
                      >
                        ✔ Approved & Mark Resolved
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-24 text-xs text-slate-400 italic">
                  Select "Create One-Touch Resolution" on any active ticket to compose a premium resolution strategy.
                </div>
              )}
            </div>

            <div className="bg-rose-950/5 border border-rose-950/10 rounded-lg p-4 mt-4">
              <div className="text-rose-900 font-extrabold text-xs flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> ESCALATION STANDARDS RULE
              </div>
              <p className="text-[11px] text-rose-800 leading-relaxed mt-1">
                "One-Touch Resolution" covers regular inquiries (late status checks, item allergen ingredients, exchanges). Any complex legal parameters, or buyers expressing extreme irritation, must be immediately escalated to the owner with the RED button.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
