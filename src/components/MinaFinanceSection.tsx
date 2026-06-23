import React, { useState } from 'react';
import { DollarSign, ShieldAlert, Sparkles, TrendingUp, Sliders, ChevronRight, FileText } from 'lucide-react';
import { FinancialData, PlatformProduct } from '../types';

interface MinaFinanceSectionProps {
  financials: FinancialData;
  onUpdateFinancials: (updates: Partial<FinancialData>) => void;
  products: PlatformProduct[];
}

export default function MinaFinanceSection({
  financials,
  onUpdateFinancials,
  products
}: MinaFinanceSectionProps) {
  const [revenue, setRevenue] = useState(financials.revenue);
  const [cogs, setCogs] = useState(financials.cogs);
  const [adSpend, setAdSpend] = useState(financials.adSpend);
  const [fees, setFees] = useState(financials.fees);

  // Interactive Cost Sandbox Calculator
  const [sandboxPrice, setSandboxPrice] = useState(100);
  const [sandboxCogs, setSandboxCogs] = useState(30);
  const [sandboxCAC, setSandboxCAC] = useState(25);
  const [sandboxFeePct, setSandboxFeePct] = useState(7.5); // platform charge

  // Calculations
  const calculatedNetProfit = revenue - cogs - adSpend - fees;
  const marginPercentage = revenue > 0 ? (calculatedNetProfit / revenue) * 100 : 0;
  const isMarginFragile = marginPercentage < 15;

  // Sandbox variables
  const sandboxFeeAmount = (sandboxPrice * sandboxFeePct) / 100;
  const sandboxProfit = sandboxPrice - sandboxCogs - sandboxCAC - sandboxFeeAmount;
  const sandboxMargin = sandboxPrice > 0 ? (sandboxProfit / sandboxPrice) * 100 : 0;
  const isSandboxLow = sandboxMargin < 15;

  const handleApplyToGlobal = () => {
    onUpdateFinancials({
      revenue,
      cogs,
      adSpend,
      fees,
      netProfit: calculatedNetProfit,
      marginAlert: isMarginFragile
    });
    alert("Updated Live Ledger Balance Sheet! Morning briefings and agent outputs will reference these updated financials.");
  };

  const lowMarginProducts = products.filter(p => {
    // Estimations based on price
    // Typical profit is 40% of sales on Shopee. Let's make an item have simulated high COGS to trigger a flag
    if (p.id === 'prod-2') return true; // Batik silk high COGS
    return false;
  });

  return (
    <div className="space-y-6" id="mina-financials-module">
      {/* Upper Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Gross Revenue</div>
          <div className="text-xl font-extrabold text-gray-900 mt-1">RM {revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">Sourced from Platforms</div>
        </div>

        {/* Metric Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Operational Expense</div>
          <div className="text-xl font-extrabold text-amber-700 mt-1">RM {(cogs + adSpend + fees).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div className="text-[10px] text-gray-400 mt-1">COGS + Ad spend + Checkout Fees</div>
        </div>

        {/* Metric Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Net Profit Outlay</div>
          <div className={`text-xl font-extrabold mt-1 ${calculatedNetProfit < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            RM {calculatedNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Adjusted current month</div>
        </div>

        {/* Metric Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-2xs">
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Net Profit Margin</div>
          <div className={`text-xl font-extrabold mt-1 ${isMarginFragile ? 'text-rose-600' : 'text-indigo-600'}`}>
            {marginPercentage.toFixed(1)}%
          </div>
          <div className="text-[10px] text-gray-400 mt-1">Threshold: 15% minimum margin</div>
        </div>
      </div>

      {/* Margin Risk warnings if margin less than 15% */}
      {isMarginFragile && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-2xs" id="margin-warning-alert">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
              MINA AUDIT WARNING: Net Margins Below 15% Threshold
            </h4>
            <p className="text-xs text-amber-800 mt-1">
              Your overall net margin is currently running tight at ({marginPercentage.toFixed(1)}%). Lower bulk cogs packing operations or trim ad spend overlays IMMEDIATELY.
            </p>
          </div>
        </div>
      )}

      {/* Financial inputs and product alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ledger adjustment form */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <h3 className="font-bold text-xs text-gray-900 uppercase">Live Account General Ledger Adjuster</h3>
            <span className="text-[10px] font-mono text-gray-400">Balance Sheets Row</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Gross Month Sales (RM)</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                className="w-full bg-gray-50 p-2.5 rounded border border-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">Total COGS (RM)</label>
              <input
                type="number"
                value={cogs}
                onChange={(e) => setCogs(Number(e.target.value))}
                className="w-full bg-gray-50 p-2.5 rounded border border-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">TikTok/FB Ad Spend (RM)</label>
              <input
                type="number"
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value))}
                className="w-full bg-gray-50 p-2.5 rounded border border-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">Marketplace Service Fees (RM)</label>
              <input
                type="number"
                value={fees}
                onChange={(e) => setFees(Number(e.target.value))}
                className="w-full bg-gray-50 p-2.5 rounded border border-gray-100"
              />
            </div>
          </div>

          <button
            onClick={handleApplyToGlobal}
            id="apply-financials-btn"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-xs transition cursor-pointer"
          >
            Apply & Save Ledger Data
          </button>
        </div>

        {/* Underperforming products flags (Operational rules: "Mina flags underperforming products") */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center border-b border-gray-50 pb-2">
            <h3 className="font-bold text-xs text-rose-800 uppercase flex items-center gap-1">
              <ShieldAlert className="w-4 h-4" /> MINA Margin-Leak Alerts
            </h3>
            <span className="text-[10px] font-medium text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded font-mono">1 Item Alerted</span>
          </div>

          <div className="space-y-3">
            {lowMarginProducts.map(p => (
              <div key={p.id} className="border border-rose-100 bg-rose-50/20 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-xs text-rose-950 uppercase">{p.title}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">Platform: {p.platform} • SKU: {p.sku}</p>
                  </div>
                  <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">Margin leak</span>
                </div>
                <div className="text-xs text-gray-700 font-mono space-y-1">
                  <div>• Retail Price: RM {p.price}</div>
                  <div>• Net Margin: <strong className="text-rose-600">8.5%</strong> (Critically below 15%)</div>
                  <div>• Top Leak: COGS-Silk sourcing and platform commissions.</div>
                </div>
                <div className="text-[10px] font-medium text-rose-900 bg-white/60 p-2 rounded border border-rose-100 italic">
                  <strong>MINA Sourcing Rec:</strong> Negotiate with Terengganu silk suppliers for 15% wholesale discount, or raise retail shelf price from RM {p.price} to **RM 99.00** to safeguard operational margins.
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Retail Sandbox Simulator */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 shadow-2xs space-y-4">
        <div>
          <h3 className="font-bold text-xs text-slate-800 uppercase flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-indigo-600" /> MINA Product Pricing Sandbox Sandbox
          </h3>
          <p className="text-xs text-slate-500">Model pricing factors prior to launching store listings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-gray-500 mb-1.5">A. Target Retail Shelf Price (RM)</label>
            <input
              type="range"
              min="10"
              max="300"
              step="1"
              value={sandboxPrice}
              onChange={(e) => setSandboxPrice(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-right font-bold text-gray-900 mt-1">RM {sandboxPrice}</div>
          </div>

          <div>
            <label className="block text-gray-500 mb-1.5">B. Sourcing COGS (RM)</label>
            <input
              type="range"
              min="2"
              max="150"
              step="1"
              value={sandboxCogs}
              onChange={(e) => setSandboxCogs(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-right font-bold text-gray-900 mt-1">RM {sandboxCogs}</div>
          </div>

          <div>
            <label className="block text-gray-500 mb-1.5">C. Marketing CAC (Ad Cost) (RM)</label>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={sandboxCAC}
              onChange={(e) => setSandboxCAC(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-right font-bold text-gray-900 mt-1">RM {sandboxCAC}</div>
          </div>

          <div>
            <label className="block text-gray-500 mb-1.5">D. Platform Commission (%)</label>
            <input
              type="range"
              min="2"
              max="15"
              step="0.5"
              value={sandboxFeePct}
              onChange={(e) => setSandboxFeePct(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-right font-bold text-gray-900 mt-1">{sandboxFeePct}%</div>
          </div>
        </div>

        {/* Sandbox audit decision */}
        <div className="mt-4 flex items-center justify-between flex-wrap gap-4 border-t border-slate-200/50 pt-4 text-xs p-3.5 rounded-lg bg-white shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="text-slate-400">Projected Margin:</div>
            <div className={`text-base font-extrabold ${isSandboxLow ? 'text-rose-600' : 'text-emerald-700'}`}>
              {sandboxMargin.toFixed(1)}%
            </div>
            <span className="text-[10px] text-slate-400">
              (Profit: RM {sandboxProfit.toFixed(2)})
            </span>
          </div>

          <div className="text-right">
            {isSandboxLow ? (
              <span className="text-xs bg-rose-50 text-rose-850 px-2.5 py-1 rounded-md font-bold tracking-wide border border-rose-100">
                ❌ BLOCKED - Pricing is dangerously below margin guidelines
              </span>
            ) : (
              <span className="text-xs bg-emerald-50 text-emerald-850 px-2.5 py-1 rounded-md font-bold tracking-wide border border-emerald-100">
                ✔ VIABLE - Confirms healthy margin standards for campaign launch
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
