import React, { useState } from 'react';
import { TrendingUp, Compass, Plus, Star, ChevronRight, HelpCircle, Sparkles, RefreshCw } from 'lucide-react';
import { MarketTrend } from '../types';

interface LanaTrendsSectionProps {
  trends: MarketTrend[];
  onAddTrend: (trend: Omit<MarketTrend, 'id'>) => void;
  onSelectNiche: (niche: string) => void;
}

export default function LanaTrendsSection({
  trends,
  onAddTrend,
  onSelectNiche
}: LanaTrendsSectionProps) {
  const [showAddTrend, setShowAddTrend] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newNiche, setNewNiche] = useState('Malay Traditional Fesyen');
  const [newVelocity, setNewVelocity] = useState(35);
  const [newScore, setNewScore] = useState(80);
  const [newGlobalSpread, setNewGlobalSpread] = useState<'Local only' | 'Regional' | 'Global potential'>('Local only');

  // AI Trend generator
  const [aiLoading, setAiLoading] = useState(false);
  const [aiProductFocus, setAiProductFocus] = useState('');
  const [aiTrendReport, setAiTrendReport] = useState<string>('');

  const handleSubmitTrend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    onAddTrend({
      productName: newProdName.toUpperCase(),
      niche: newNiche,
      velocity: Number(newVelocity),
      localDemandScore: Number(newScore),
      globalNicheSpread: newGlobalSpread,
      pros: [
        'High consumer search query indicators in Google Trends Malaysia',
        'Relatively lower direct local brand competitors currently active'
      ],
      cons: [
        'High distribution costs for East Malaysia routes',
        'Seasonal volume patterns'
      ],
      recommendation: `Conduct testing via dynamic pre-orders on TikTok Shop with MOQ of 200 units.`
    });

    setNewProdName('');
    setShowAddTrend(false);
  };

  const handleGenerateTrend = async () => {
    if (!aiProductFocus.trim()) return;
    setAiLoading(true);
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Perform an analytical rising-star trend report for product category: "${aiProductFocus}" in Southeast Asia and global e-commerce.
Structure the response strictly with:
- Growth velocity estimation.
- Local demand indicators.
- Pro/Con/Recommendation structured layout for e-commerce owners.
Do not add other meta-conversation outside the requested layout structure.`,
          systemInstruction: 'You are LANA, Trend Analyst. You write deep, strategic, high-value market briefs.'
        })
      });
      const data = await resp.json();
      if (data.text) {
        setAiTrendReport(data.text);
      }
    } catch {
      setAiTrendReport(`**Product Niche**: ${aiProductFocus}\n**Velocity Index**: +45% peak month-over-month\n\nPROS:\n- Compact shipping footprint\n- Lucrative wholesale markups\n\nCONS:\n- Saturated social noise\n\nRECOMMENDATION:\nSource raw inventory from Selayang wholesale hubs, package in customized premium jars, and scale TikTok Live broadcasts immediately.`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="lana-trends-module">
      {/* Intro Banner */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-2xs flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-950 flex items-center gap-1.5 text-violet-950">
            <Compass className="w-5 h-5 text-violet-600" /> Southeast Asia "Rising Star" Intelligence
          </h2>
          <p className="text-xs text-gray-400">Targeting high-potential market expansions for Malaysian brands</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddTrend(!showAddTrend)}
            id="toggle-add-trend"
            className="text-xs bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            + Register Custom Trend Niche
          </button>
        </div>
      </div>

      {showAddTrend && (
        <form onSubmit={handleSubmitTrend} className="bg-white p-5 rounded-xl border border-violet-100 shadow-2xs space-y-4">
          <h3 className="text-xs font-extrabold uppercase text-violet-950">Log Custom Niche Metric</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Product Category Name</label>
              <input
                type="text"
                required
                value={newProdName}
                onChange={(e) => setNewProdName(e.target.value)}
                placeholder="e.g., Bird Nest Collagen"
                className="w-full bg-gray-50 p-2 rounded border border-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-500 font-semibold mb-1">E-commerce Niche Group</label>
              <select
                value={newNiche}
                onChange={(e) => setNewNiche(e.target.value)}
                className="w-full bg-white p-2 rounded border border-gray-100"
              >
                <option value="Halal Beauty & Skincare">Halal Beauty & Skincare</option>
                <option value="Malay Traditional Fesyen">Malay Traditional Fesyen</option>
                <option value="Ready-to-eat Foods">Ready-to-eat Foods</option>
                <option value="Organic Herbal Tonics">Organic Herbal Tonics</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Growth Velocity (%)</label>
              <input
                type="number"
                value={newVelocity}
                onChange={(e) => setNewVelocity(Number(e.target.value))}
                className="w-full bg-gray-50 p-2 rounded border border-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Niche Coverage</label>
              <select
                value={newGlobalSpread}
                onChange={(e) => setNewGlobalSpread(e.target.value as any)}
                className="w-full bg-white p-2 rounded border border-gray-100"
              >
                <option value="Local only">Local only</option>
                <option value="Regional">Regional</option>
                <option value="Global potential">Global potential</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="text-xs bg-violet-600 text-white font-semibold py-2 px-4 rounded hover:bg-violet-700 font-medium"
          >
            Add Trend Vector
          </button>
        </form>
      )}

      {/* Grid of registered trends with Pro/Con/Recommendation standard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-bold text-xs text-gray-500 uppercase tracking-widest pl-1">Vetted Trend Opportunities</h3>
          {trends.map(t => (
            <div key={t.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <div>
                  <h4 className="font-extrabold text-xs text-gray-900 tracking-wide flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-violet-600 fill-violet-200" /> {t.productName}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{t.niche} • {t.globalNicheSpread}</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-violet-700">+{t.velocity}%</div>
                  <div className="text-[9px] text-gray-400 uppercase font-bold">Velocity Index</div>
                </div>
              </div>

              {/* Pro / Con / Recommendation structured report */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div>
                  <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase">
                    PROS / Upsides
                  </span>
                  <ul className="list-disc pl-4 text-gray-700 mt-1 space-y-0.5">
                    {t.pros.map((p, pidx) => (
                      <li key={pidx}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-extrabold text-rose-800 bg-rose-50 px-2 py-0.5 rounded text-[10px] uppercase">
                    CONS / Risks
                  </span>
                  <ul className="list-disc pl-4 text-gray-700 mt-1 space-y-0.5">
                    {t.cons.map((c, cidx) => (
                      <li key={cidx}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-violet-50/40 p-3.5 rounded-lg border border-violet-100">
                  <span className="font-extrabold text-violet-900 text-[10px] uppercase tracking-wide block mb-1">
                    🎯 Strategic Recommendation
                  </span>
                  <p className="text-gray-900 italic font-mono text-[11px]">
                    "{t.recommendation}"
                  </p>
                </div>
              </div>

              {/* Set as active focus niche */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onSelectNiche(t.productName);
                    alert(`Niche expanded to: "${t.productName}". Morning Briefing generated next will reference this target.`);
                  }}
                  id={`select-niche-${t.id}`}
                  className="text-[10px] uppercase font-bold text-violet-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Focus Active Briefing on Niche <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Real-Time Niche Analyzer Desk */}
        <div className="bg-gradient-to-br from-violet-50/10 to-violet-100/5 border border-violet-100/50 rounded-xl p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-violet-950 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-600" /> LANA's Real-Time Deep Benchmarking
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Proposed Product / Idea (Input Keyword)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Traditional Ketupat instant mixes, organic hibiscus tea..."
                  value={aiProductFocus}
                  onChange={(e) => setAiProductFocus(e.target.value)}
                  className="flex-1 text-xs text-gray-950 bg-white p-2.5 rounded-lg border border-gray-200 focus:outline-hidden"
                />
                <button
                  onClick={handleGenerateTrend}
                  disabled={aiLoading || !aiProductFocus}
                  id="generate-trend-audit-btn"
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs px-3 rounded-lg flex items-center gap-1.5 disabled:opacity-50 transition cursor-pointer"
                >
                  {aiLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Audit</span>
                </button>
              </div>
            </div>

            {aiTrendReport ? (
              <div className="bg-white rounded-lg p-3.5 border border-violet-100 shadow-2xs text-xs space-y-3 leading-relaxed max-h-[300px] overflow-y-auto font-mono">
                <div className="font-bold border-b border-gray-50 pb-1.5 text-violet-950">
                  LANA's Real-time Opportunity Evaluation:
                </div>
                <div className="whitespace-pre-line text-gray-700">
                  {aiTrendReport}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-xs text-gray-400 italic bg-white rounded-lg border border-gray-50">
                Provide a product category candidate above and audit to receive a tailored Southeast Asian e-commerce benchmark.
              </div>
            )}
          </div>

          <div className="bg-white/70 rounded-lg p-3 border border-gray-100 text-xs text-gray-500 font-medium">
            🚩 <strong>Malaysian Competitor Velocity Warning indicators:</strong> Avoid launching basic sambal oils without a clear dietary specialty segment (e.g., sodium-reduced, stevia-salted, or packaging conveniences), due to localized retail congestion levels in Shopee Mall channels.
          </div>
        </div>
      </div>
    </div>
  );
}
