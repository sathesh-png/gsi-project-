export interface FinancialData {
  revenue: number;
  cogs: number;
  adSpend: number;
  fees: number;
  netProfit: number;
  marginAlert: boolean;
  topCostDriver: string;
}

export interface Lead {
  id: string;
  name: string;
  source: string; // TikTok, Website, Instagram, WhatsApp
  intent: 'Hot' | 'Warm' | 'Cold';
  status: 'New' | 'Contacted' | 'Qualified' | 'Nurturing' | 'Declined';
  nextAction: string;
  email?: string;
  notes?: string;
}

export interface LeadSettings {
  autoQualifyHotScore: number;
  requireEmail: boolean;
  followUpDelayDays: number;
  leadTags: string[];
}

export interface SocialDraft {
  id: string;
  title: string;
  platform: 'TikTok' | 'YouTube' | 'Instagram' | 'Facebook' | 'LinkedIn' | 'Pinterest' | 'GMC';
  type: 'Script' | 'Caption' | 'Short' | 'Product Update' | 'Combo';
  content: string;
  status: 'Refining' | 'Approved' | 'Published';
  createdAt: string;
}

export interface PlatformProduct {
  id: string;
  title: string;
  sku: string;
  platform: 'Shopee' | 'Lazada' | 'TikTok Shop' | 'Shopify' | 'Etsy';
  price: number;
  stock: number;
  variants: string[];
  description: string;
  seoOptimizedTitle?: string;
  seoOptimizedDesc?: string;
  imageInstructions?: string;
}

export interface MarketTrend {
  id: string;
  productName: string;
  niche: string;
  velocity: number; // monthly growth percentage
  localDemandScore: number; // 1-100
  globalNicheSpread: 'Local only' | 'Regional' | 'Global potential';
  pros: string[];
  cons: string[];
  recommendation: string;
}

export interface CXInquiry {
  id: string;
  customerName: string;
  platform: string;
  message: string;
  urgency: 'Normal' | 'Urgent' | 'Frustrated';
  status: 'Pending' | 'Resolved' | 'Escalated';
  resolutionDraft?: string;
  createdAt: string;
}

export type ActiveTab = 'home' | 'briefing' | 'luna' | 'jana' | 'lana' | 'mina' | 'cx';
export type AgentName = 'LUNA' | 'JANA' | 'LANA' | 'MINA';
