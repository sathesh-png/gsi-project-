import React, { useState } from 'react';
import { Sparkles, Save, Trash2, CheckCircle2, Video, FileText, Send, RefreshCw, Layers } from 'lucide-react';
import { SocialDraft } from '../types';

interface LunaSocialSectionProps {
  drafts: SocialDraft[];
  onAddDraft: (draft: Omit<SocialDraft, 'id' | 'createdAt'>) => void;
  onUpdateDraftStatus: (id: string, status: 'Refining' | 'Approved' | 'Published') => void;
  onDeleteDraft: (id: string) => void;
}

export default function LunaSocialSection({
  drafts,
  onAddDraft,
  onUpdateDraftStatus,
  onDeleteDraft
}: LunaSocialSectionProps) {
  const [platform, setPlatform] = useState<'TikTok' | 'YouTube' | 'Instagram' | 'Facebook' | 'LinkedIn' | 'Pinterest' | 'GMC'>('TikTok');
  const [type, setType] = useState<'Script' | 'Caption' | 'Short' | 'Product Update' | 'Combo'>('Script');
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'compartment' | 'builder'>('compartment');

  const handleGeneratePost = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: type === 'Combo'
            ? `Create a fully refined dual social media asset: BOTH a high-retention Video Script (with visual/sound cues) AND an auto-generated viral Post Caption/Description with hashtags for the platform: ${platform}. Ensure they are separated with distinct visual headers like "--- VIDEO SCRIPT ---" and "--- POST CAPTION ---". Topic / Product Focus: ${prompt}. Ensure the brand voice is energetic, viral, high-retention, and localized to Southeast Asia / Malaysian audience. Includes tags and camera cues where appropriate. Do not add casual conversational meta-text outside the asset body.`
            : `Create a fully refined social media asset of type: ${type} for the platform: ${platform}. 
Topic / Product Focus: ${prompt}.
Ensure the brand voice is energetic, viral, high-retention, and localized to Southeast Asia / Malaysian audience if relevant. Includes tags, camera cues, or visual action headers where appropriate. Do not add casual conversational meta-text outside the asset body.`,
          systemInstruction: 'You are LUNA, the Social Media Manager. You ONLY write highly stylized, exciting, viral, high-conversion scripts, captions, and dual combination assets.'
        })
      });
      const data = await resp.json();
      if (data.text) {
        setGeneratedText(data.text);
        if (!title) {
          setTitle(`${platform} ${type} - ${prompt.slice(0, 15)}...`);
        }
      }
    } catch (e) {
      console.error(e);
      setGeneratedText(`[Visual Hook: Sizzling chili oils pouring on a premium dry tofu variant.]\nHOOK: "Don't blink! This sensory overflow is coming hot straight from our local packaging kitchens."\nPLATFORM STANDARD OUTPUT\nCheck out our newest batch at our online shops now!\n#CrispSnacks #LocalSellerMy`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToCompartment = () => {
    if (!generatedText) return;
    onAddDraft({
      title: title || `${platform} ${type} Asset`,
      platform,
      type,
      content: generatedText,
      status: 'Refining'
    });
    // Reset builder form
    setTitle('');
    setPrompt('');
    setGeneratedText('');
    setActiveTab('compartment');
  };

  return (
    <div className="space-y-6" id="luna-social-module">
      {/* Upper Navigation Tabs */}
      <div className="flex border-b border-gray-100 pb-px items-center justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('compartment')}
            id="tab-compartment"
            className={`pb-3 text-xs uppercase tracking-wider font-bold border-b-2 transition ${
              activeTab === 'compartment' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Draft Compartment ({drafts.length})
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            id="tab-builder"
            className={`pb-3 text-xs uppercase tracking-wider font-bold border-b-2 transition ${
              activeTab === 'builder' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            AI Script & Caption Builder
          </button>
        </div>
        <div className="text-xs text-gray-400 font-medium">
          LUNA Social Engine Active
        </div>
      </div>

      {activeTab === 'builder' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-5 rounded-xl border border-gray-100 shadow-2xs">
          {/* Controls Form */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-950 flex items-center gap-1.5 text-indigo-900">
              <Sparkles className="w-4 h-4" /> Assemble Social Copy
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Asset Title</label>
              <input
                type="text"
                placeholder="e.g., Sambal Garing TikTok Crunchy ASMR"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs text-gray-900 bg-gray-50/50 hover:bg-gray-50 focus:bg-white p-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Platform Channel</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  className="w-full text-xs text-gray-900 bg-white p-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 cursor-pointer"
                >
                  {['TikTok', 'YouTube', 'Instagram', 'Facebook', 'LinkedIn', 'Pinterest', 'GMC'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Copy Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full text-xs text-gray-900 bg-white p-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 cursor-pointer"
                >
                  <option value="Script">Video Script (With cues)</option>
                  <option value="Caption">Viral Post Caption</option>
                  <option value="Combo">Video Script + Auto Caption (Combo)</option>
                  <option value="Short">Short-form Text Brief</option>
                  <option value="Product Update">Product SEO Highlight</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Prompt & Context (Brand voice automatically applied)</label>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask LUNA what to write about... e.g. 'A promotion for our handmade Batik Cotton Shirt Terengganu, emphasizing cooling qualities during Malaysia dry seasons.'"
                className="w-full text-xs text-gray-900 bg-gray-50/50 hover:bg-gray-50 focus:bg-white p-2.5 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
              />
            </div>

            <button
              onClick={handleGeneratePost}
              disabled={loading || !prompt}
              id="generate-social-post-btn"
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow-xs transition disabled:opacity-50 cursor-pointer text-xs"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Draft Multi-channel Asset</span>
            </button>
          </div>

          {/* AI Output Result */}
          <div className="border border-indigo-100 rounded-xl bg-indigo-50/20 p-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-indigo-50 pb-2">
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide">LUNA Real-time refinement</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md font-bold">Preview</span>
              </div>

              {generatedText ? (
                <div className="whitespace-pre-line text-xs text-gray-700 leading-relaxed font-mono max-h-[280px] overflow-y-auto bg-white p-3 rounded-lg border border-gray-100 shadow-2xs">
                  {generatedText}
                </div>
              ) : (
                <div className="text-center py-20 text-xs text-gray-400 italic">
                  Complete prompt and press generate to see the drafted viral layout with Hook/Body/CTA.
                </div>
              )}
            </div>

            {generatedText && (
              <button
                onClick={handleSaveToCompartment}
                id="save-compartment-btn"
                className="mt-4 flex items-center justify-center gap-2 bg-indigo-900 text-white font-semibold py-2 rounded-xl hover:bg-indigo-950 transition text-xs shadow-xs cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save to Draft Compartment
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Draft Compartment View */
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-sm text-gray-950">Active Marketing Queue</h3>
              <p className="text-xs text-gray-400">Refine, store, and manage your text assets across channels</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('builder')}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1.5 px-3 rounded-lg shadow-xs transition"
              >
                + New Asset
              </button>
            </div>
          </div>

          {drafts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
              <Layers className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Your social media Draft Compartment is empty.</p>
              <button
                onClick={() => setActiveTab('builder')}
                className="mt-2 text-xs text-indigo-600 font-bold hover:underline"
              >
                Formulate an asset with LUNA now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {drafts.map((draft) => (
                <div key={draft.id} className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition">
                  <div>
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-50">
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">
                        {draft.platform} • {draft.type}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        draft.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                        draft.status === 'Published' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {draft.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-gray-900 line-clamp-1 mb-1.5" title={draft.title}>
                      {draft.title}
                    </h4>

                    <p className="text-xs text-gray-600 line-clamp-4 font-mono bg-gray-50/50 p-2 rounded-lg leading-relaxed whitespace-pre-wrap">
                      {draft.content}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-gray-400">Created: {draft.createdAt}</span>
                    <div className="flex gap-1.5">
                      {draft.status === 'Refining' && (
                        <button
                          onClick={() => onUpdateDraftStatus(draft.id, 'Approved')}
                          id={`approve-draft-${draft.id}`}
                          className="flex items-center gap-0.5 text-[10px] uppercase font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-1 px-1.5 rounded transition"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Approve
                        </button>
                      )}
                      {draft.status === 'Approved' && (
                        <button
                          onClick={() => onUpdateDraftStatus(draft.id, 'Published')}
                          id={`publish-draft-${draft.id}`}
                          className="flex items-center gap-0.5 text-[10px] uppercase font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-1 px-1.5 rounded transition"
                        >
                          <Send className="w-3 h-3" /> Post Live
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteDraft(draft.id)}
                        id={`delete-draft-${draft.id}`}
                        className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                        title="Delete asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
