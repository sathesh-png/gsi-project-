import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw, Pencil, Check, Copy, Sparkles, CheckCircle2 } from 'lucide-react';
import { FinancialData, Lead } from '../types';

interface MorningBriefingCardProps {
  financials: FinancialData;
  leads: Lead[];
  trendNiche: string;
}

export default function MorningBriefingCard({ financials, leads, trendNiche }: MorningBriefingCardProps) {
  const [briefing, setBriefing] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate initial or fallback on mount or financial data load
  useEffect(() => {
    generateDynamicBriefing();
  }, [financials, leads, trendNiche]);

  const generateDynamicBriefing = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          financialData: financials,
          leadsData: leads,
          trendsData: trendNiche
        })
      });
      const data = await response.json();
      if (data.text) {
        setBriefing(data.text);
        setEditText(data.text);
      }
    } catch (e) {
      console.error(e);
      // Local robust offline evaluation
      const netProfitVal = (financials.revenue - financials.cogs - financials.adSpend - financials.fees).toFixed(2);
      const marginPctVal = (((financials.revenue - financials.cogs - financials.adSpend - financials.fees) / financials.revenue) * 100).toFixed(1);
      const isAlert = Number(marginPctVal) < 15 ? "YES" : "NO";
      
      const hotCount = leads.filter(l => l.intent === 'Hot').length;
      const warmCount = leads.filter(l => l.intent === 'Warm').length;

      const fallbackText = `MINA: [Net Profit: RM ${netProfitVal} (${marginPctVal}% Margin)] [Margin Alert: ${isAlert}] [Top Cost Driver: COGS (${financials.topCostDriver})]
LANA: [Trending Product Opportunity: ${trendNiche || 'Halal Vegan Cosmetics'} showing over +60% velocity spike in MY]
JANA: [Top 3 SEO/Platform Tasks: 1. Optimize Shopee Sambal Tempeh tags 2. Adjust slimfit batik inventory 3. Resolve customer refund exchange] [Lead Pipeline Update: ${hotCount} Hot, ${warmCount} Warm outstanding prospect leads]
LUNA: [Priority Content/Video Task: Capture 30s ASMR soundbite of Sambal crunching on white rice and save to drafts]`;

      setBriefing(fallbackText);
      setEditText(fallbackText);
    } finally {
      setGenerating(false);
    }
  };

  const startEdit = () => {
    setEditText(briefing);
    setIsEditing(true);
  };

  const saveEdit = () => {
    setBriefing(editText);
    setIsEditing(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(briefing);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Split lines to style individual agents colored cards properly
  const lines = briefing.split('\n').filter(l => l.trim() !== '');

  const getAgentStyles = (line: string) => {
    if (line.startsWith('MINA:')) return { name: 'MINA', style: 'border-l-4 border-amber-500 bg-amber-500/5', colorText: 'text-amber-800' };
    if (line.startsWith('LANA:')) return { name: 'LANA', style: 'border-l-4 border-violet-500 bg-violet-500/5', colorText: 'text-violet-800' };
    if (line.startsWith('JANA:')) return { name: 'JANA', style: 'border-l-4 border-emerald-500 bg-emerald-500/5', colorText: 'text-emerald-800' };
    if (line.startsWith('LUNA:')) return { name: 'LUNA', style: 'border-l-4 border-indigo-500 bg-indigo-500/5', colorText: 'text-indigo-800' };
    return { name: 'Agent', style: 'border-l-4 border-gray-400 bg-gray-50', colorText: 'text-gray-800' };
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5" id="morning-briefing-module">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-950">Daily Morning Briefing</h2>
            <p className="text-xs text-gray-500">Structured system synthesis from all 4 active agents</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generateDynamicBriefing}
            disabled={generating}
            id="regenerate-briefing-btn"
            className="flex items-center gap-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-3 rounded-lg transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
            <span>Refactor</span>
          </button>

          {isEditing ? (
            <button
              onClick={saveEdit}
              id="save-briefing-btn"
              className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 rounded-lg transition font-medium"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
          ) : (
            <button
              onClick={startEdit}
              id="edit-briefing-btn"
              className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 py-1.5 px-3 rounded-lg transition"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Override</span>
            </button>
          )}

          <button
            onClick={copyToClipboard}
            id="copy-briefing-btn"
            className="flex items-center gap-1 text-xs border border-gray-200 hover:bg-gray-100 text-gray-600 py-1.5 px-3 rounded-lg transition"
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={5}
            className="w-full text-xs font-mono bg-gray-50 p-3 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:bg-white text-gray-950"
          />
          <p className="text-[10px] text-gray-400 italic">
            * Please maintain the required MINA, LANA, JANA, and LUNA structure for system stability.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {lines.length > 0 ? (
            lines.map((line, idx) => {
              const info = getAgentStyles(line);
              // Extract parts between brackets if possible, otherwise print line
              const cleanText = line.replace(`${info.name}:`, '').trim();
              return (
                <div key={idx} className={`p-3.5 rounded-xl transition-all shadow-2xs hover:shadow-xs ${info.style}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${info.colorText}`}>
                      {info.name}
                    </span>
                    <span className="text-[10px] text-gray-400">Briefing Status: Live</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">
                    {cleanText}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center p-6 bg-gray-50 rounded-xl text-gray-500 text-xs italic">
              Loading current e-commerce parameters to synthesize daily workflow schedule...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
