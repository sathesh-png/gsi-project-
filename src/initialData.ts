import { FinancialData, Lead, LeadSettings, SocialDraft, PlatformProduct, MarketTrend, CXInquiry } from './types';

export const initialFinancials: FinancialData = {
  revenue: 84320.00,
  cogs: 28150.00,
  adSpend: 15400.00,
  fees: 5900.00, // marketplace platform checkout fees (6-7%)
  netProfit: 34870.00,
  marginAlert: false, // Net profit margin is (34870/84320) ~ 41%, which is healthy (> 15%)
  topCostDriver: 'COGS - Bulk Import Packing'
};

export const initialLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Siti Azrina',
    source: 'TikTok Live Comments',
    intent: 'Hot',
    status: 'New',
    nextAction: 'WhatsApp promo catalog for Sambal Garing package',
    email: 'siti.azrina@gmail.com',
    notes: 'Inquired multiple times during Live about bulk purchase list'
  },
  {
    id: 'lead-2',
    name: 'Alex Tan',
    source: 'Shopify Checkout Abandonment',
    intent: 'Warm',
    status: 'Contacted',
    nextAction: 'Trigger automatic abandon basket discount email',
    email: 'alextan92@yahoo.com',
    notes: 'Left premium Batik shirt set (variant L) in shopping cart'
  },
  {
    id: 'lead-3',
    name: 'Muhammad Farhan',
    source: 'Instagram Direct Message',
    intent: 'Hot',
    status: 'Nurturing',
    nextAction: 'Offer shipping voucher code for East Malaysia delivery',
    email: 'farhan.enterprise@outlook.com',
    notes: 'Keen on wholesale dealership but worried about Sabah/Sarawak freight rates'
  },
  {
    id: 'lead-4',
    name: 'Evelyn Lau',
    source: 'Facebook Lead Form',
    intent: 'Cold',
    status: 'New',
    nextAction: 'Add to quarterly newsletter list',
    email: 'evelyn.l@gmail.com',
    notes: 'Signed up via general "Malaysian Home Chefs" free cookbook campaign'
  }
];

export const initialLeadSettings: LeadSettings = {
  autoQualifyHotScore: 80,
  requireEmail: false,
  followUpDelayDays: 2,
  leadTags: ['Bulk buyer', 'East Malaysia', 'Agent/Dropship', 'Inquire Price']
};

export const initialDrafts: SocialDraft[] = [
  {
    id: 'draft-1',
    title: 'Sambal Garing 15s Crunch Sound TikTok',
    platform: 'TikTok',
    type: 'Script',
    content: `[Visual: Close-up of hot steaming white rice with crispy Sambal Garing scooped on top. Crispy audio crunches amplified.]\nHOOK: "Dengar ni... ini bukan sambal biasa. Ini bunyinya sambal paling garing kat Malaysia!"\n[Visual: Dropping sambal onto a fried egg, yolk running.]\nBODY: "No oil mess, tak payah panaskan, tabur terus makan. Rice + Egg + Crispy Sambal is all you need."\nCTA: "Click the yellow basket below now - buy 2 free shipping for East and West Malaysia!"`,
    status: 'Refining',
    createdAt: '2026-06-21'
  },
  {
    id: 'draft-2',
    title: 'Modern Handcrafted Kebaya IG Carousel Captions',
    platform: 'Instagram',
    type: 'Caption',
    content: `Modern, breathable, and absolutely regal. 🌺✨\nOur classic Cotton Kebaya gets a contemporary update with lightweight flexi-mesh weaving, perfect for the Malaysian heat.\n\nShop sizes XS to 3XL.\n🚚 Free shipping across Malaysia.\n👉 click biological link to buy. #ClassicKebaya #MalaysiaFesyen #MalaysianBrand`,
    status: 'Approved',
    createdAt: '2026-06-20'
  },
  {
    id: 'draft-3',
    title: 'Lazada Mega GSS Sale Campaign Brief',
    platform: 'Facebook',
    type: 'Product Update',
    content: `Exclusive discounts up to 40% on all Home Food Items for Lazada GSS! Fast 24-hour shipout guaranteed. Stock up on your family favorites before the long holiday weekend.`,
    status: 'Refining',
    createdAt: '2026-06-19'
  }
];

export const initialProducts: PlatformProduct[] = [
  {
    id: 'prod-1',
    title: 'Sambal Garing Tempeh Crispy 250g',
    sku: 'SB-TEMPEH-250G',
    platform: 'Shopee',
    price: 18.90,
    stock: 450,
    variants: ['Regular Savory', 'Spicy Fire', 'Anchovy Mix'],
    description: 'Crispy Tempeh infused with authentic dry chili paste and secret herbs. Ready to eat, high protein, no artificial preservatives. Packaged in air-tight aluminum bags.',
    seoOptimizedTitle: 'Sambal Garing Tempeh Crispy 250g | Ready-To-Eat Crunchy Spicy Shopee Best Seller',
    seoOptimizedDesc: 'Cari sambal garing tempeh yang ultra rangup? Sambal Garing Tempeh Crispy kami diperbuat daripada ramuan terpilih, kurang minyak dan sedia dimakan dengan nasi panas atau bubur. Tanpa pengawet tiruan, sesuai dipos seluruh Malaysia.',
    imageInstructions: 'Show a raw ingredient comparison with fresh chili, garlic, and sliced tempeh in a bright rustic kitchen. Overlay a "Ready to Eat" banner.'
  },
  {
    id: 'prod-2',
    title: 'Aura Batik Modern Male Slimfit Shirt',
    sku: 'BTK-SLM-MQL',
    platform: 'Shopify',
    price: 89.00,
    stock: 120,
    variants: ['Terengganu Blue M', 'Terengganu Blue L', 'Kelantan Red M', 'Kelantan Red L'],
    description: '100% premium local organic cotton dyed in Terengganu workshops. Structured slimfit style ideal for casual Friday corporate outfits.',
    seoOptimizedTitle: 'Aura Batik Modern Male Slimfit Shirt | 100% Organic Cotton Traditional Terengganu Motif',
    seoOptimizedDesc: 'Elevate your office look with our premium Aura Batik Slimfit Shirt. Handmade cotton featuring classic Terengganu floral stamps designed for optimal ventilation in humid climates. Perfect for corporate wear or wedding guest attires.',
    imageInstructions: 'Clean studio mockup of male model (180cm) wearing size M highlighting shoulder seam styling.'
  },
  {
    id: 'prod-3',
    title: 'Bird Nest Ginseng Tonic Drink 6x70ml Pack',
    sku: 'BNEST-GINS-6P',
    platform: 'Lazada',
    price: 49.90,
    stock: 95,
    variants: ['Standard Ginseng', 'Sugar-Free Stevia'],
    description: 'Premium raw birds nest extract double-boiled with Korean red ginseng. Increases vitality and supports respiratory health.',
    seoOptimizedTitle: 'Bird Nest Ginseng Tonic Drink Twin Pack 6x70ml | Halal Certified Vitality Concentrate',
    seoOptimizedDesc: 'Sarang burung herba ginseng premium double-boiled. Sesuai untuk kecantikan kulit dan penambahan tenaga harian. Sijil Halal JAKIM. Packaged beautifully in premium sturdy paper box.',
    imageInstructions: 'Premium flatlay showcasing gold box with gold jars inside, shadowed neatly with natural leaf shadows.'
  }
];

export const initialTrends: MarketTrend[] = [
  {
    id: 'trend-1',
    productName: 'HALAL VEGAN RETINOL SERUM',
    niche: 'Skincare Niche (K-Beauty Localised)',
    velocity: 68.4,
    localDemandScore: 92,
    globalNicheSpread: 'Regional',
    pros: [
      'Extremely high demand due to rising halal consciousness in younger consumers (Gen Z/Millennials)',
      'High repeat purchase rate',
      'Compact size cuts international shipping overhead significantly'
    ],
    cons: [
      'Requires strict NPRA registration with Malaysian Ministry of Health (KKM)',
      'Intense competition from local TikTok-famous formulation builders'
    ],
    recommendation: 'Partner with an OEM cosmetic lab in Shah Alam to do short-batch test orders (OEM MOQ ~500 bottles). Launch with pre-sale campaign focusing on pregnancy-safe retinol alternatives like Bakuchiol.'
  },
  {
    id: 'trend-2',
    productName: 'FREEZE-DRIED DURIAN MUSANG KING 80G',
    niche: 'Premium Export Snacks',
    velocity: 42.1,
    localDemandScore: 78,
    globalNicheSpread: 'Global potential',
    pros: [
      'Very popular with tourists from China and Singapore',
      'Virtually infinite shelf-life',
      'Premium pricing possible (can charge USD 15+ per box in export channels)'
    ],
    cons: [
      'Musang King supply price can be highly volatile depending on seasonal harvest cycles',
      'Sophisticated vacuum drying equipment requires heavy capital investment'
    ],
    recommendation: 'Do white-label packaging with established durian farms in Raub, Pahang. Focus the branding entirely on the export quality, using premium black-gold color pairings and multilingual descriptions (Malay, English, Chinese).'
  }
];

export const initialCXInquiries: CXInquiry[] = [
  {
    id: 'cx-1',
    customerName: 'Farah Hanim',
    platform: 'Shopee Chat',
    message: 'Saya dah order Sambal Garing 3 hari lepas dari Johor tapi kenapa tracking masih tulis "Sender is preparing package"? Esok lusa saya nak bawa balik kampung, boleh pos cepat sikit??',
    urgency: 'Frustrated',
    status: 'Pending',
    createdAt: '2026-06-22T08:30:00'
  },
  {
    id: 'cx-2',
    customerName: 'Chong Wei Ming',
    platform: 'Shopify WhatsApp',
    message: 'Hi group, I bought the Batik Shirt XL but it looks slightly tighter than standard fit. Do you support returns or exchange for XXL size? Please let me know how the logistics process goes.',
    urgency: 'Normal',
    status: 'Pending',
    createdAt: '2026-06-21T17:15:00'
  },
  {
    id: 'cx-3',
    customerName: 'Haris Naidu',
    platform: 'TikTok Shop DM',
    message: 'Hello, what ingredients do you use for your Sambal Tempeh? Is there any beef or meat fat trace? My cousin has strict food allergies.',
    urgency: 'Normal',
    status: 'Pending',
    createdAt: '2026-06-22T05:40:00'
  }
];
