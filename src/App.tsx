import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Compass, 
  Layers, 
  ArrowUpRight, 
  MessageSquare, 
  BookOpen, 
  Settings,
  HelpCircle,
  Menu,
  X,
  Share2
} from 'lucide-react';

import { 
  FinancialData, 
  Lead, 
  LeadSettings, 
  SocialDraft, 
  PlatformProduct, 
  MarketTrend, 
  CXInquiry, 
  ActiveTab, 
  AgentName 
} from './types';

import { 
  initialFinancials, 
  initialLeads, 
  initialLeadSettings, 
  initialDrafts, 
  initialProducts, 
  initialTrends, 
  initialCXInquiries 
} from './initialData';

import MorningBriefingCard from './components/MorningBriefingCard';
import AgentChatbot from './components/AgentChatbot';
import LunaSocialSection from './components/LunaSocialSection';
import JanaLeadsSection from './components/JanaLeadsSection';
import LanaTrendsSection from './components/LanaTrendsSection';
import MinaFinanceSection from './components/MinaFinanceSection';
import GsiHomeSection from './components/GsiHomeSection';

// --- Firebase Imports ---
import { doc, setDoc, deleteDoc, updateDoc, onSnapshot, collection } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { useAuth } from './components/FirebaseProvider';

export default function App() {
  const { user, logout } = useAuth();

  // --- Real-Time State hooks ---
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentAgent, setCurrentAgent] = useState<AgentName>('LUNA');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [financials, setFinancials] = useState<FinancialData>(initialFinancials);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [leadSettings, setLeadSettings] = useState<LeadSettings>(initialLeadSettings);
  const [drafts, setDrafts] = useState<SocialDraft[]>(initialDrafts);
  const [products, setProducts] = useState<PlatformProduct[]>(initialProducts);
  const [trends, setTrends] = useState<MarketTrend[]>(initialTrends);
  const [cxInquiries, setCxInquiries] = useState<CXInquiry[]>(initialCXInquiries);
  const [activeNicheFocus, setActiveNicheFocus] = useState<string>('Halal Vegan Retinol Essence & Local Beauty niches');

  // --- Sync with Firestore real-time ---
  useEffect(() => {
    if (!user) return;

    // 1. Listen for financials
    const unsubFinancials = onSnapshot(doc(db, 'financials', 'current'), (snapshot) => {
      if (snapshot.exists()) {
        setFinancials(snapshot.data() as FinancialData);
      } else {
        setDoc(doc(db, 'financials', 'current'), initialFinancials)
          .catch(e => handleFirestoreError(e, OperationType.WRITE, 'financials/current'));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'financials/current');
    });

    // 2. Listen for lead settings
    const unsubLeadSettings = onSnapshot(doc(db, 'settings_lead_settings', 'current'), (snapshot) => {
      if (snapshot.exists()) {
        setLeadSettings(snapshot.data() as LeadSettings);
      } else {
        setDoc(doc(db, 'settings_lead_settings', 'current'), initialLeadSettings)
          .catch(e => handleFirestoreError(e, OperationType.WRITE, 'settings_lead_settings/current'));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'settings_lead_settings/current');
    });

    // 3. Listen for niche focus
    const unsubNicheFocus = onSnapshot(doc(db, 'nicheFocus', 'current'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && data.focusText !== undefined) {
          setActiveNicheFocus(data.focusText);
        }
      } else {
        setDoc(doc(db, 'nicheFocus', 'current'), { focusText: 'Halal Vegan Retinol Essence & Local Beauty niches' })
          .catch(e => handleFirestoreError(e, OperationType.WRITE, 'nicheFocus/current'));
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'nicheFocus/current');
    });

    // 4. Listen for Leads
    const unsubLeads = onSnapshot(collection(db, 'leads'), (snapshot) => {
      if (!snapshot.empty) {
        const loadedLeads: Lead[] = [];
        snapshot.forEach((d) => {
          loadedLeads.push(d.data() as Lead);
        });
        setLeads(loadedLeads);
      } else {
        initialLeads.forEach((lead) => {
          setDoc(doc(db, 'leads', lead.id), lead)
            .catch(e => handleFirestoreError(e, OperationType.WRITE, `leads/${lead.id}`));
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'leads');
    });

    // 5. Listen for Drafts
    const unsubDrafts = onSnapshot(collection(db, 'drafts'), (snapshot) => {
      if (!snapshot.empty) {
        const loadedDrafts: SocialDraft[] = [];
        snapshot.forEach((d) => {
          loadedDrafts.push(d.data() as SocialDraft);
        });
        loadedDrafts.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        setDrafts(loadedDrafts);
      } else {
        initialDrafts.forEach((draft) => {
          setDoc(doc(db, 'drafts', draft.id), draft)
            .catch(e => handleFirestoreError(e, OperationType.WRITE, `drafts/${draft.id}`));
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'drafts');
    });

    // 6. Listen for Products
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const loadedProducts: PlatformProduct[] = [];
        snapshot.forEach((d) => {
          loadedProducts.push(d.data() as PlatformProduct);
        });
        setProducts(loadedProducts);
      } else {
        initialProducts.forEach((product) => {
          setDoc(doc(db, 'products', product.id), product)
            .catch(e => handleFirestoreError(e, OperationType.WRITE, `products/${product.id}`));
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'products');
    });

    // 7. Listen for Trends
    const unsubTrends = onSnapshot(collection(db, 'trends'), (snapshot) => {
      if (!snapshot.empty) {
        const loadedTrends: MarketTrend[] = [];
        snapshot.forEach((d) => {
          loadedTrends.push(d.data() as MarketTrend);
        });
        setTrends(loadedTrends);
      } else {
        initialTrends.forEach((trend) => {
          setDoc(doc(db, 'trends', trend.id), trend)
            .catch(e => handleFirestoreError(e, OperationType.WRITE, `trends/${trend.id}`));
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'trends');
    });

    // 8. Listen for CX Inquiries
    const unsubCX = onSnapshot(collection(db, 'cxInquiries'), (snapshot) => {
      if (!snapshot.empty) {
        const loadedCX: CXInquiry[] = [];
        snapshot.forEach((d) => {
          loadedCX.push(d.data() as CXInquiry);
        });
        setCxInquiries(loadedCX);
      } else {
        initialCXInquiries.forEach((cx) => {
          setDoc(doc(db, 'cxInquiries', cx.id), cx)
            .catch(e => handleFirestoreError(e, OperationType.WRITE, `cxInquiries/${cx.id}`));
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'cxInquiries');
    });

    return () => {
      unsubFinancials();
      unsubLeadSettings();
      unsubNicheFocus();
      unsubLeads();
      unsubDrafts();
      unsubProducts();
      unsubTrends();
      unsubCX();
    };
  }, [user]);

  // Handle auto-focus chatbot to target agent when user opens relevant workspace tabs
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (tab === 'luna') setCurrentAgent('LUNA');
    else if (tab === 'jana') setCurrentAgent('JANA');
    else if (tab === 'lana') setCurrentAgent('LANA');
    else if (tab === 'mina') setCurrentAgent('MINA');
  };

  // --- Interactive mutators with Cloud Firestore updates ---
  const handleUpdateFinancials = async (updates: Partial<FinancialData>) => {
    const nextFinancials: FinancialData = {
      ...financials,
      ...updates
    };
    try {
      await setDoc(doc(db, 'financials', 'current'), nextFinancials);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'financials/current');
    }
  };

  const handleUpdateSettings = async (settings: LeadSettings) => {
    try {
      await setDoc(doc(db, 'settings_lead_settings', 'current'), settings);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'settings_lead_settings/current');
    }
  };

  const handleSelectNiche = async (niche: string) => {
    try {
      await setDoc(doc(db, 'nicheFocus', 'current'), { focusText: niche });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'nicheFocus/current');
    }
  };

  const handleAddDraft = async (draft: Omit<SocialDraft, 'id' | 'createdAt'>) => {
    const draftId = `draft-${Date.now()}`;
    const newDraft: SocialDraft = {
      ...draft,
      id: draftId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    try {
      await setDoc(doc(db, 'drafts', draftId), newDraft);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `drafts/${draftId}`);
    }
  };

  const handleUpdateDraftStatus = async (id: string, status: 'Refining' | 'Approved' | 'Published') => {
    try {
      await updateDoc(doc(db, 'drafts', id), { status });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `drafts/${id}`);
    }
  };

  const handleDeleteDraft = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'drafts', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `drafts/${id}`);
    }
  };

  const handleAddLead = async (lead: Omit<Lead, 'id'>) => {
    const leadId = `lead-${Date.now()}`;
    const newLead: Lead = {
      ...lead,
      id: leadId
    };
    try {
      await setDoc(doc(db, 'leads', leadId), newLead);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `leads/${leadId}`);
    }
  };

  const handleUpdateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      await updateDoc(doc(db, 'leads', id), updates);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `leads/${id}`);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'leads', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `leads/${id}`);
    }
  };

  const handleUpdateProduct = async (id: string, updates: Partial<PlatformProduct>) => {
    try {
      await updateDoc(doc(db, 'products', id), updates);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `products/${id}`);
    }
  };

  const handleAddTrend = async (trend: Omit<MarketTrend, 'id'>) => {
    const trendId = `trend-${Date.now()}`;
    const newTrend: MarketTrend = {
      ...trend,
      id: trendId
    };
    try {
      await setDoc(doc(db, 'trends', trendId), newTrend);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `trends/${trendId}`);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: 'Resolved' | 'Escalated', resolutionDraft?: string) => {
    try {
      await updateDoc(doc(db, 'cxInquiries', id), { status, resolutionDraft });
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `cxInquiries/${id}`);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col" id="applet-container">
      {/* Top Banner / Header navbar */}
      <header className="bg-white border-b border-slate-200 h-14 px-6 shrink-0 flex items-center justify-between sticky top-0 z-45" id="workspace-header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-extrabold shadow-sm">
            <Bot className="w-4.5 h-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-sm lg:text-[15px] font-bold tracking-tight text-slate-800 flex items-center gap-2">
              GSI Workspace
            </h1>
          </div>
        </div>

        {/* Global stats indicators & Mobile Toggle */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden lg:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Online</span>
          </div>

          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
          </div>

          {user && (
            <div className="flex items-center gap-2 border-l border-slate-200 pl-4 h-8" id="header-user-profile-chip">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || "User"} className="w-6 h-6 rounded-full border border-slate-200" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[10px] font-extrabold uppercase">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                </div>
              )}
              <span className="text-xs font-bold text-slate-700 hidden md:inline">{user.displayName || user.email}</span>
              <button
                onClick={logout}
                className="text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-md transition duration-150 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-hamburger"
            className="lg:hidden p-1.5 hover:bg-slate-150 rounded text-slate-650 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-250 px-5 py-4 space-y-2 text-xs flex flex-col z-30 shadow-sm" id="mobile-nav-panel">
          <button
            onClick={() => handleTabChange('home')}
            className={`p-2.5 rounded-lg text-left font-bold ${
              activeTab === 'home' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            🏠 GSI Workspace Home
          </button>
          <button
            onClick={() => handleTabChange('briefing')}
            className={`p-2.5 rounded-lg text-left font-bold ${
              activeTab === 'briefing' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            Daily Briefing Summary
          </button>
          <button
            onClick={() => handleTabChange('luna')}
            className={`p-2.5 rounded-lg text-left font-bold ${
              activeTab === 'luna' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            LUNA Social Manager (Scripts & Drafts)
          </button>
          <button
            onClick={() => handleTabChange('jana')}
            className={`p-2.5 rounded-lg text-left font-bold ${
              activeTab === 'jana' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            JANA Platform & Leads Desk
          </button>
          <button
            onClick={() => handleTabChange('lana')}
            className={`p-2.5 rounded-lg text-left font-bold ${
              activeTab === 'lana' ? 'bg-violet-50 text-violet-700' : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            LANA Market Trend Intelligence
          </button>
          <button
            onClick={() => handleTabChange('mina')}
            className={`p-2.5 rounded-lg text-left font-bold ${
              activeTab === 'mina' ? 'bg-amber-50 text-amber-700' : 'text-slate-650 hover:bg-slate-50'
            }`}
          >
            MINA Ledger & Financials
          </button>
        </div>
      )}

      {/* Main Body Grid */}
      <main className="flex-1 overflow-hidden flex flex-col lg:flex-row" id="workspace-main-panel">
        
        {/* Sidebar / Agent Selector for Desktop */}
        <nav className="w-56 border-r border-slate-200 bg-slate-50 p-4 flex flex-col gap-2 shrink-0 hidden lg:flex" id="sidebar-nav">
          <div className="text-[10px] font-bold text-slate-450 uppercase tracking-widest mb-2 px-2">Active Modules</div>

          <button
            onClick={() => handleTabChange('home')}
            id="sidebar-home-btn"
            className={`flex items-center gap-3 p-2 rounded-lg border text-left transition-colors duration-150 cursor-pointer ${
              activeTab === 'home'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-100 font-bold shadow-3xs'
                : 'bg-transparent border-transparent text-slate-600 hover:bg-white hover:text-slate-900 font-medium'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeTab === 'home' ? 'bg-indigo-600' : 'bg-slate-400'} shrink-0`} />
            <span className="text-sm">GSI Workspace Home</span>
          </button>
          
          <button
            onClick={() => handleTabChange('briefing')}
            id="sidebar-briefing-btn"
            className={`flex items-center gap-3 p-2 rounded-lg border text-left transition-colors duration-150 cursor-pointer ${
              activeTab === 'briefing'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-100 font-bold shadow-3xs'
                : 'bg-transparent border-transparent text-slate-600 hover:bg-white hover:text-slate-900 font-medium'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeTab === 'briefing' ? 'bg-indigo-650' : 'bg-slate-350'} shrink-0`} />
            <span className="text-sm">Morning Briefing</span>
          </button>

          <button
            onClick={() => handleTabChange('luna')}
            id="sidebar-luna-btn"
            className={`flex items-center gap-3 p-2 rounded-lg border text-left transition-colors duration-150 cursor-pointer ${
              activeTab === 'luna'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-100 font-bold shadow-3xs'
                : 'bg-transparent border-transparent text-slate-600 hover:bg-white hover:text-slate-900 font-medium'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeTab === 'luna' ? 'bg-indigo-650' : 'bg-purple-400'} shrink-0`} />
            <span className="text-sm">LUNA: Content</span>
          </button>

          <button
            onClick={() => handleTabChange('jana')}
            id="sidebar-jana-btn"
            className={`flex items-center gap-3 p-2 rounded-lg border text-left transition-colors duration-150 cursor-pointer ${
              activeTab === 'jana'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-100 font-bold shadow-3xs'
                : 'bg-transparent border-transparent text-slate-600 hover:bg-white hover:text-slate-900 font-medium'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeTab === 'jana' ? 'bg-indigo-650' : 'bg-emerald-450'} shrink-0`} />
            <span className="text-sm">JANA: Sales & Ops</span>
          </button>

          <button
            onClick={() => handleTabChange('lana')}
            id="sidebar-lana-btn"
            className={`flex items-center gap-3 p-2 rounded-lg border text-left transition-colors duration-150 cursor-pointer ${
              activeTab === 'lana'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-100 font-bold shadow-3xs'
                : 'bg-transparent border-transparent text-slate-600 hover:bg-white hover:text-slate-900 font-medium'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeTab === 'lana' ? 'bg-indigo-650' : 'bg-violet-400'} shrink-0`} />
            <span className="text-sm">LANA: Market Trends</span>
          </button>

          <button
            onClick={() => handleTabChange('mina')}
            id="sidebar-mina-btn"
            className={`flex items-center gap-3 p-2 rounded-lg border text-left transition-colors duration-150 cursor-pointer ${
              activeTab === 'mina'
                ? 'bg-indigo-50 text-indigo-700 border-indigo-100 font-bold shadow-3xs'
                : 'bg-transparent border-transparent text-slate-600 hover:bg-white hover:text-slate-900 font-medium'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeTab === 'mina' ? 'bg-indigo-650' : 'bg-amber-450'} shrink-0`} />
            <span className="text-sm">MINA: Financials</span>
          </button>

          <div className="mt-auto">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Draft Compartment</div>
              <div className="text-xs text-slate-600 line-clamp-2 italic">
                {drafts.length > 0 ? `"${drafts[0].content}"` : `"No draft queued yet."`}
              </div>
              <div
                onClick={() => handleTabChange('luna')}
                className="mt-2 text-[10px] text-indigo-600 font-bold uppercase cursor-pointer hover:underline"
              >
                View all ({drafts.length}) →
              </div>
            </div>
          </div>
        </nav>

        {/* Left Side: Modular active tab viewport */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 lg:p-6 space-y-6" id="workspace-viewport">
          
          {/* Active Tab: GSI HOME WORKSPACE */}
          {activeTab === 'home' && (
            <GsiHomeSection 
              onNavigate={(tab) => handleTabChange(tab)} 
              financials={financials}
              leads={leads}
              drafts={drafts}
            />
          )}

          {/* Active Tab: BRIEFING SUMMARY */}
          {activeTab === 'briefing' && (
            <div className="space-y-6">
              {/* Top Dashboard KPI Row from the Professional Polish theme */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0" id="briefing-kpi-row">
                <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 hover:shadow-xs transition-all">
                  <div className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Net Profit Outlay</div>
                  <div className="text-lg lg:text-2xl font-bold text-slate-800">
                    RM {(financials.revenue - financials.cogs - financials.adSpend - financials.fees).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-1 font-semibold">
                    {((financials.revenue - financials.cogs - financials.adSpend - financials.fees) > 0) ? '+12.4% vs prev. month' : 'Adjust ledger metrics'}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 hover:shadow-xs transition-all">
                  <div className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Hot Leads</div>
                  <div className="text-lg lg:text-2xl font-bold text-slate-800">
                    {leads.filter(l => l.intent === 'Hot').length}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-medium">From TikTok & Shopee</div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 hover:shadow-xs transition-all">
                  <div className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Margin Alert</div>
                  <div className={`text-lg lg:text-2xl font-bold ${financials.marginAlert ? 'text-rose-500 font-black' : 'text-emerald-600 font-bold'}`}>
                    {financials.marginAlert ? 'YES' : 'NO'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-medium">
                    {financials.marginAlert ? 'Margins under 15% threshold!' : 'All products safe (>15%)'}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 hover:shadow-xs transition-all">
                  <div className="text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-1">Draft Compartment</div>
                  <div className="text-lg lg:text-2xl font-bold text-indigo-600">
                    {drafts.length} posts
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-medium">
                    {drafts.filter(d => d.status === 'Approved').length} approved to publish
                  </div>
                </div>
              </div>

              {/* Mandatory Morning Briefing Card styled specifically */}
              <MorningBriefingCard 
                financials={financials} 
                leads={leads} 
                trendNiche={activeNicheFocus} 
              />

              {/* General Executive Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Mina's quick ledger card */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-2xs space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-xs font-bold uppercase text-amber-800">Mina's Ledger</span>
                    <button onClick={() => handleTabChange('mina')} className="text-[10px] text-gray-400 hover:underline">Full parameters →</button>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-500">Gross Sales</span>
                    <span>RM {financials.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-500">Expenses Outline</span>
                    <span>RM {(financials.cogs + financials.adSpend + financials.fees).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold border-t border-dashed border-gray-100 pt-2 text-emerald-800">
                    <span>Net Cashflow Margin</span>
                    <span>{((financials.netProfit / financials.revenue) * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {/* Lana's Quick Focus */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-2xs space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-xs font-bold uppercase text-violet-800">Lana's Market Trend Target</span>
                    <button onClick={() => handleTabChange('lana')} className="text-[10px] text-gray-400 hover:underline">Full parameters →</button>
                  </div>
                  <div className="text-xs text-gray-700 leading-relaxed font-mono">
                    Current active focus: <strong>{activeNicheFocus}</strong>
                  </div>
                  <div className="bg-violet-50 text-violet-950 p-2 rounded text-[11px] italic">
                    "High localized searches showing over 60% velocity spike across Southeast Asia. Recommend expansion test."
                  </div>
                </div>

                {/* Jana's Quick leads Summary */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-2xs space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-xs font-bold uppercase text-emerald-800">Jana's Conversion Pipeline</span>
                    <button onClick={() => handleTabChange('jana')} className="text-[10px] text-gray-400 hover:underline">Leads Table →</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-rose-50 p-2 rounded">
                      <div className="font-extrabold text-rose-800">{leads.filter(l => l.intent === 'Hot').length}</div>
                      <div className="text-[9px] text-gray-400">Hot</div>
                    </div>
                    <div className="bg-amber-50 p-2 rounded">
                      <div className="font-extrabold text-amber-800">{leads.filter(l => l.intent === 'Warm').length}</div>
                      <div className="text-[9px] text-gray-400">Warm</div>
                    </div>
                    <div className="bg-gray-150/40 p-2 rounded">
                      <div className="font-extrabold text-gray-800">{leads.filter(l => l.intent === 'Cold').length}</div>
                      <div className="text-[9px] text-gray-400">Cold</div>
                    </div>
                  </div>
                </div>

                {/* Luna's Quick Content Queue */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-2xs space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <span className="text-xs font-bold uppercase text-indigo-800">Luna's Draft Hub</span>
                    <button onClick={() => handleTabChange('luna')} className="text-[10px] text-gray-400 hover:underline">Draft Compartment →</button>
                  </div>
                  <div className="text-xs text-gray-700 leading-normal">
                    You have <strong className="text-indigo-650">{drafts.filter(d => d.status === 'Refining').length}</strong> raw drafts awaiting refinement and <strong className="text-emerald-700">{drafts.filter(d => d.status === 'Approved').length}</strong> fully approved.
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-semibold">GMC: Active</span>
                    <span className="bg-cyan-50 text-cyan-800 px-2 py-0.5 rounded text-[10px] font-semibold">TikTok Shop: Connected</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'luna' && (
            <LunaSocialSection 
              drafts={drafts}
              onAddDraft={handleAddDraft}
              onUpdateDraftStatus={handleUpdateDraftStatus}
              onDeleteDraft={handleDeleteDraft}
            />
          )}

          {activeTab === 'jana' && (
            <JanaLeadsSection
              leads={leads}
              onAddLead={handleAddLead}
              onUpdateLead={handleUpdateLead}
              onDeleteLead={handleDeleteLead}
              leadSettings={leadSettings}
              onUpdateSettings={handleUpdateSettings}
              products={products}
              onUpdateProduct={handleUpdateProduct}
              cxInquiries={cxInquiries}
              onUpdateInquiryStatus={handleUpdateInquiryStatus}
            />
          )}

          {activeTab === 'lana' && (
            <LanaTrendsSection 
              trends={trends}
              onAddTrend={handleAddTrend}
              onSelectNiche={handleSelectNiche}
            />
          )}

          {activeTab === 'mina' && (
            <MinaFinanceSection 
              financials={financials}
              onUpdateFinancials={handleUpdateFinancials}
              products={products}
            />
          )}
        </div>

        {/* Right Side Panel: Fixed synchronistic Chatbot component */}
        <div className="w-full lg:w-[410px] border-t lg:border-t-0 lg:border-l border-gray-100 p-4 bg-gray-50/50 flex flex-col shrink-0" id="chatbot-sidebar">
          <AgentChatbot 
            currentAgent={currentAgent} 
            onChangeAgent={setCurrentAgent}
            onSaveDraft={(platform, content) => handleAddDraft({
              title: `${platform} Live Draft`,
              platform: platform as any,
              type: 'Script',
              content: content,
              status: 'Refining'
            })}
            onAddLead={(name, source, intent) => handleAddLead({
              name,
              source,
              intent,
              status: 'New',
              nextAction: 'Initiate WhatsApp outreach combo'
            })}
          />
        </div>

      </main>

      {/* Bottom Micro-Bar Footer from the Professional Polish theme */}
      <footer className="h-8 bg-slate-250 border-t border-slate-350 flex items-center px-6 text-[10px] text-slate-500 font-semibold justify-between shrink-0" id="global-system-footer">
        <div className="flex gap-4">
          <span>LAZADA: <strong className="text-emerald-700">CONNECTED</strong></span>
          <span>SHOPEE: <strong className="text-emerald-700">CONNECTED</strong></span>
          <span>SHOPIFY: <strong className="text-emerald-700">CONNECTED</strong></span>
          <span>GMC: <strong className="text-emerald-700">CONNECTED</strong></span>
        </div>
        <div className="flex gap-4">
          <span className="uppercase tracking-tighter hidden md:inline">Escalation Protocol Active</span>
          <span className="text-slate-400 hidden md:inline">|</span>
          <span className="text-indigo-600 font-bold">System Health 99.8%</span>
        </div>
      </footer>
    </div>
  );
}
