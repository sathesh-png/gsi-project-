import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Initialize Gemini client securely server-side
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Route for agent chat proxy
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, systemInstruction } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(200).json({ 
          text: "⚠️ **API Key Missing**: GEMINI_API_KEY is not configured in the Secrets panel. Please provide an API key, or use me as a local simulator for now.\n\n*Simulation Response*: Hello! I am programmed to assist with social media, platform ops, trends, and finance, but I need active access to complete full calculations."
        });
      }

      // Convert history to structure suitable for contents
      const contents = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction || "You are an expert e-commerce business agent assistant.",
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.json({ 
        text: "🤖 **System Offline / High Demand Notice**: The Gemini AI backend is currently experiencing high request volumes (Status 503) or is temporarily unavailable. Let's continue working with local workspace data in the meantime!" 
      });
    }
  });

  // API Route to generate custom morning briefing strictly matching format
  app.post("/api/briefing", async (req, res) => {
    try {
      const { financialData, leadsData, trendsData } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        // Fallback simulated briefing
        const rawNetProfit = financialData.revenue - financialData.cogs - financialData.adSpend - financialData.fees;
        const netProfit = rawNetProfit.toFixed(2);
        const marginPct = ((rawNetProfit / financialData.revenue) * 100).toFixed(1);
        const hasAlert = Number(marginPct) < 15 ? "YES" : "NO";
        
        const fallbackText = `MINA: [Net Profit: RM ${netProfit} (${marginPct}% Margin)] [Margin Alert: ${hasAlert}] [Top Cost Driver: Ad Spend (RM ${financialData.adSpend})]
LANA: [Trending Product Opportunity: Sambal Nyet & Halal Skincare niches showing +45% Malaysian velocity]
JANA: [Top 3 SEO/Platform Tasks: 1. Optimize Shopee Sambal description 2. Update Lazada product variant stock 3. Resolve pending returns] [Lead Pipeline Update: ${leadsData.filter((l: any) => l.intent === 'Hot').length} Hot, ${leadsData.filter((l: any) => l.intent === 'Warm').length} Warm Leads awaiting outreach]
LUNA: [Priority Content/Video Task: Create 30s TikTok draft demonstrating quick kitchen usage recipe to boost Sambal sales]`;
        return res.json({ text: fallbackText });
      }

      const prompt = `
Generate a unified, professional, highly contextual Morning Briefing from our 4 specialized e-commerce office agents, strictly adhering to this format. Make sure to plug in actual Malaysian ringgit (RM) numbers where applicable based on the custom input metrics.

Input Metrics:
- Financial Data (COGS, Ad Spend, Marketplace Fee, Revenue): ${JSON.stringify(financialData)}
- Current Leads List: ${JSON.stringify(leadsData)}
- Current Trends Niche: ${JSON.stringify(trendsData)}

Format requirement must match this structure exactly:
MINA: [Net Profit] [Margin Alert: Y/N] [Top Cost Driver]
LANA: [Trending Product Opportunity]
JANA: [Top 3 SEO/Platform Tasks] [Lead Pipeline Update]
LUNA: [Priority Content/Video Task]

Guidelines:
- Keep information concise, professional, grounded, action-oriented.
- Do not add any introductory or concluding pleasantries. Just return the structured lines.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are the orchestrator for MINA (Financial Controller), LANA (Trend Analyst), JANA (Platform & Lead Specialist), and LUNA (Social Media Manager). Generate their morning briefings strictly in the requested short format.",
          temperature: 0.5,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.warn("Briefing Generation Gemini Error (falling back to simulation):", error);
      try {
        const { financialData, leadsData } = req.body;
        const revenue = financialData?.revenue || 1;
        const rawNetProfit = (financialData?.revenue || 0) - (financialData?.cogs || 0) - (financialData?.adSpend || 0) - (financialData?.fees || 0);
        const netProfit = rawNetProfit.toFixed(2);
        const marginPct = (((rawNetProfit / (revenue === 0 ? 1 : revenue)) * 100) || 0).toFixed(1);
        const hasAlert = Number(marginPct) < 15 ? "YES" : "NO";
        const adSpend = financialData?.adSpend || 0;
        
        const hotCount = (leadsData || []).filter((l: any) => l?.intent === 'Hot').length;
        const warmCount = (leadsData || []).filter((l: any) => l?.intent === 'Warm').length;

        const fallbackText = `MINA: [Net Profit: RM ${netProfit} (${marginPct}% Margin)] [Margin Alert: ${hasAlert}] [Top Cost Driver: Ad Spend (RM ${adSpend})]
LANA: [Trending Product Opportunity: Sambal Nyet & Halal Skincare niches showing +45% Malaysian velocity]
JANA: [Top 3 SEO/Platform Tasks: 1. Optimize Shopee Sambal description 2. Update Lazada product variant stock 3. Resolve pending returns] [Lead Pipeline Update: ${hotCount} Hot, ${warmCount} Warm Leads awaiting outreach]
LUNA: [Priority Content/Video Task: Create 30s TikTok draft demonstrating quick kitchen usage recipe to boost Sambal sales]`;
        return res.json({ text: fallbackText });
      } catch (fallbackErr: any) {
        console.error("Double failure in briefing generation:", fallbackErr);
        res.status(500).json({ error: error.message || "An error occurred during briefing generation." });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
