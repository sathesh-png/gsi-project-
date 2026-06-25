import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Zap, TrendingUp, DollarSign, Send, RotateCcw, Bot, User, Flame, HelpCircle } from 'lucide-react';
import { AgentName } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sender: string;
  timestamp: string;
}

interface AgentChatbotProps {
  currentAgent: AgentName;
  onChangeAgent: (agent: AgentName) => void;
  onSaveDraft?: (platform: string, content: string) => void;
  onAddLead?: (name: string, source: string, intent: 'Hot' | 'Warm' | 'Cold') => void;
}

export default function AgentChatbot({
  currentAgent,
  onChangeAgent,
  onSaveDraft,
  onAddLead
}: AgentChatbotProps) const agentInstructions: Record<AgentName, string> = {
    LUNA: `You are LUNA, the Social Media Manager. 
1. If the user provides specific links for TikTok, Shopee, Lazada, Website, or WhatsApp, you MUST use those links in your output.
2. If no links are provided, generate the post content without including any links. 
3. When creating video content, you MUST generate three separate high-retention 30s scripts, in 9:16 aspect ratio, one each for TikTok, YouTube, and Instagram Reels, including specific visual cues, sound effects, and hooks for each. 
4. ALWAYS generate image concept titles and descriptions for FB, Insta, LinkedIn, GMC, and Pinterest.
5. ALWAYS provide an SEO-optimized title and high-conversion hashtags. ( , )
    JANA: `...`, // Keep your existing JANA instructions here
    LANA: `...`, // Keep your existing LANA instructions here
    MINA: `...`  // Keep your existing MINA instructions here
  };
  const [messages, setMessages] = useState<Record<AgentName, Message[]>>({
    LUNA: [
      {
        role: 'assistant',
        sender: 'LUNA',
        content: 'Salam! I am LUNA, your Social Media Manager. I handle scripts, captions, and brand engagement. Need a TikTok script or viral Instagram caption? Let me help write something engaging, and I will queue it in your Draft Compartment!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    JANA: [
      {
        role: 'assistant',
        sender: 'JANA',
        content: 'Hi! JANA here, Platform Specialist & Lead Engine. Ask me to optimize a product listing, run lead-capture analysis, draft direct client outreach, or simulate a support reply under direct One-Touch guidelines!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    LANA: [
      {
        role: 'assistant',
        sender: 'LANA',
        content: 'Hello! I am LANA, Trend Analyst. I track e-commerce niches, market velocity, and opportunities across Malaysia and Southeast Asia. Drop a product idea, and I will give you a detailed Pro/Con/Recommendation audit!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    MINA: [
      {
        role: 'assistant',
        sender: 'MINA',
        content: 'Greetings. I am MINA, Financial Controller. I analyze COGS, ad spend, and net profits to flag leaks in your budget. Ask me to calculate a profit margin, run a P&L breakout, or troubleshoot pricing!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  });

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentAgent]);

  const agentInstructions: Record<AgentName, string> = {
    LUNA: `You are LUNA, the Social Media Manager and sole controller of posting/scheduling for TikTok, YouTube, Instagram, Facebook, LinkedIn, Pinterest, and GMC. You maintain an engaging, warm, high-retention brand voice. Your core focus is video scripts, captions, and organizing publishing campaigns. When requested, you provide complete, exciting scripts (with Hook, Visual cues, Audio/SFX instructions) or viral captions with Malaysian relevant local hashtags. If appropriate, recommend saving the output draft. Keep responses professional, highly creative, and clear.`,
    JANA: `You are JANA, the Sales Specialist, Lead Engine & Platform Expert. In Sales, you extract high-intent leads and manage outreach under direct qualification criteria. In Platform Ops, you optimize product titles & listings (Shopee, Lazada, TikTok Shop, Shopify, Etsy) utilizing high-SEO organic keywords, and detail variants/stock. In Customer Experience (CX), you solve customer messages with 'One-Touch Resolutions' and escalate immediately to human review if the customer expresses extreme frustration, legal threats, or high-value claims. Keep response action-oriented, precise, and professional.`,
    LANA: `You are LANA, the Trend Analyst specializing in Malaysian and global e-commerce. You identify rising star products, analyze sales velocity, and recommend profitable niches (e.g. food products, traditional apparel, local beauty). Your writeups are deeply analytical, and strategic advice must follow a structured Pro/Con/Recommendation format. Be realistic, utilize data, and do not hallucinate metrics.`,
    MINA: `You are MINA, the Financial Controller. You track COGS, marketplace fees, ad spend, and net profits. You are highly structured, cautious, and detail-oriented. You flag low-margin products (< 15% net profit margin) instantly and suggest adjustments to COGS, retail price, or ad spend. Present financial calculations in clear markdown tables or itemized breakdowns. Do not guess values; ask for details if figures aren't clear.`
  };

  const handleSend = async () => {
    if (!inputVal.trim() || loading) return;

    const userMsg: Message = {
      role: 'user',
      sender: 'Owner',
      content: inputVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

   try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages[currentAgent].map(m => ({ role: m.role, content: m.content })),
          // This now uses the single source of truth defined at the top
          systemInstruction: agentInstructions[currentAgent] 
        })
      });
      // ... rest of your handleSend code 
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMsg.content,
          history: messages[currentAgent].map(m => ({ role: m.role, content: m.content })),
          systemInstruction: agentInstructions[currentAgent]
        })
      });

      const data = await response.json();

      const assistantMsg: Message = {
        role: 'assistant',
        sender: currentAgent,
        content: data.text || 'Sorry, I am having trouble connecting.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => ({
        ...prev,
        [currentAgent]: [...prev[currentAgent], assistantMsg]
      }));
    } catch (err) {
      console.error(err);
      const assistantMsg: Message = {
        role: 'assistant',
        sender: currentAgent,
        content: "⚠️ Connection error. I am running in local offline simulation mode. Please check if server is active and API Key is supplied in Secrets.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => ({
        ...prev,
        [currentAgent]: [...prev[currentAgent], assistantMsg]
      }));
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages((prev) => ({
      ...prev,
      [currentAgent]: [
        {
          role: 'assistant',
          sender: currentAgent,
          content: `Chat history cleared. How can I assist you as ${currentAgent} today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }));
  };

  // Agent quick-suggestion prompts
  const quickPrompts: Record<AgentName, string[]> = {
    LUNA: [
      "Write a TikTok script about crispy Sambal Garing",
      "Generate Instagram captions with high-conversion hashtags",
      "Draft a Pinterest post idea for modern cotton Batik shirts"
    ],
    JANA: [
      "Optimize SEO title for 'Bird Nest Ginseng Tonic Drink'",
      "Examine Shopee listing improvements",
      "Suggest a One-Touch support reply for late shipping inquiry"
    ],
    LANA: [
      "Analyze the high-demand Malaysian halal vegan skincare niche",
      "Compare local durian export potential: Singapore vs China",
      "Explain the velocity details of local ready-to-eat sambal"
    ],
    MINA: [
      "Calculate retail price based on RM10 COGS to hit 25% margin",
      "Break down a standard P&L statement outline",
      "Identify expense leaks for high ad spend (RM15,000)"
    ]
  };

  const getAgentTheme = (agent: AgentName) => {
    switch (agent) {
      case 'LUNA': return { bg: 'bg-indigo-50 border-indigo-200 text-indigo-700', active: 'bg-indigo-600 text-white', accent: 'bg-indigo-100 text-indigo-800', hover: 'hover:bg-indigo-50', icon: Sparkles, color: 'indigo' };
      case 'JANA': return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-700', active: 'bg-emerald-600 text-white', accent: 'bg-emerald-100 text-emerald-800', hover: 'hover:bg-emerald-50', icon: Zap, color: 'emerald' };
      case 'LANA': return { bg: 'bg-violet-50 border-violet-200 text-violet-700', active: 'bg-violet-600 text-white', accent: 'bg-violet-100 text-violet-800', hover: 'hover:bg-violet-50', icon: TrendingUp, color: 'violet' };
      case 'MINA': return { bg: 'bg-amber-50 border-amber-200 text-amber-700', active: 'bg-amber-600 text-white', accent: 'bg-amber-100 text-amber-800', hover: 'hover:bg-amber-50', icon: DollarSign, color: 'amber' };
    }
  };

  const themeCurrent = getAgentTheme(currentAgent);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden" id="agent-chatbot-panel">
      {/* Agent Quick Selector Header */}
      <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-1 flex-wrap">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-1">Consult Agent:</span>
        <div className="flex bg-gray-200/60 p-0.5 rounded-lg text-xs">
          {(['LUNA', 'JANA', 'LANA', 'MINA'] as AgentName[]).map((agent) => {
            const agTheme = getAgentTheme(agent);
            const isSel = currentAgent === agent;
            const Icon = agTheme.icon;
            return (
              <button
                key={agent}
                onClick={() => onChangeAgent(agent)}
                id={`select-agent-${agent.toLowerCase()}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                  isSel ? agTheme.active + ' shadow-xs' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{agent}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Header Info Banner */}
      <div className={`p-3 border-b flex items-center justify-between ${themeCurrent.bg}`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg ${themeCurrent.accent}`}>
            <themeCurrent.icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-950 flex items-center gap-1.5">
              Chatting with {currentAgent}
              <span className="text-xs font-normal opacity-85">
                {currentAgent === 'LUNA' && '• Social Hub'}
                {currentAgent === 'JANA' && '• Platform & Lead Specialist'}
                {currentAgent === 'LANA' && '• Trend Expert'}
                {currentAgent === 'MINA' && '• Finance Auditor'}
              </span>
            </h3>
            <p className="text-xs text-gray-700/80 mt-0.5 max-w-sm line-clamp-1">
              Active system instruction: Standard business alignment.
            </p>
          </div>
        </div>
        <button
          onClick={clearChat}
          title="Reset conversation"
          id="refresh-agent-chat"
          className="p-1 px-1.5 rounded hover:bg-black/5 text-gray-600 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50/50 text-sm scrollbar"
        style={{ minHeight: '340px' }}
      >
        {messages[currentAgent].map((msg, index) => {
          const isUser = msg.role === 'user';
          const agTheme = getAgentTheme(currentAgent);
          return (
            <div 
              key={index}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                isUser ? 'bg-indigo-600 text-white' : agTheme.accent
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className="max-w-[82%]">
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-xs font-semibold text-gray-700">{msg.sender}</span>
                  <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                </div>
                <div className={`p-3 rounded-2xl whitespace-pre-line leading-relaxed shadow-xs ${
                  isUser 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-900 rounded-tl-none'
                }`}>
                  {msg.content}

                  {/* Contextual actions inside assistant messages */}
                  {!isUser && currentAgent === 'LUNA' && onSaveDraft && (
                    <div className="mt-2 text-right">
                      <button
                        onClick={() => {
                          const cleanContent = msg.content;
                          onSaveDraft('TikTok', cleanContent);
                        }}
                        id="save-draft-from-chat"
                        className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1 px-2.5 rounded-md shadow-xs transition cursor-pointer"
                      >
                        📥 Keep in Draft Compartment
                      </button>
                    </div>
                  )}

                  {!isUser && msg.content.includes('Lead Name:') && onAddLead && (
                    <div className="mt-2 text-right">
                      <button
                        onClick={() => {
                          // Try to extract name
                          const matchName = msg.content.match(/Lead Name:\s*([^\n]+)/i);
                          const nameVal = matchName ? matchName[1].trim() : 'Siti Premium Buyer';
                          onAddLead(nameVal, 'Form Inquiry', 'Hot');
                        }}
                        id="add-lead-from-chat"
                        className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-1 px-2.5 rounded-md shadow-xs transition"
                      >
                        👤 Link to Lead Status Table
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-2.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${themeCurrent.accent}`}>
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-xs font-semibold text-gray-700">{currentAgent}</span>
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-xs text-gray-500 italic max-w-sm flex items-center gap-2">
                <span className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </span>
                <span>Typing strategic analysis...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/40">
        <div className="flex items-center gap-1 mb-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-500">Quick suggestions:</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {quickPrompts[currentAgent].map((prompt, prIdx) => (
            <button
              key={prIdx}
              onClick={() => setInputVal(prompt)}
              className="text-xs bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full whitespace-nowrap transition cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${currentAgent} anything... e.g. "Draft social post" or "Audit financials"`}
            className="flex-1 text-sm bg-gray-100 hover:bg-gray-200/60 focus:bg-white text-gray-950 px-3.5 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-indigo-600/20 focus:outline-hidden transition"
          />
          <button
            onClick={handleSend}
            disabled={!inputVal.trim() || loading}
            id="send-agent-chat"
            className={`p-2.5 rounded-xl text-white transition shrink-0 ${
              inputVal.trim() && !loading
                ? 'bg-indigo-600 hover:bg-indigo-700 shadow-sm cursor-pointer'
                : 'bg-gray-200 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
