export interface BusinessListing {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  province: string; // ID of province (e.g., 'gauteng')
  city: string;     // ID or raw name of City (e.g., 'johannesburg')
  suburb: string;   // Name of suburb (e.g., 'Sandton')
  phone: string;
  email: string;
  website: string;
  verified: boolean;
  image: string;
  tags: string[];
  views: number;
  latitude?: number;
  longitude?: number;
  slug: string;     // SEO-ready slug
  createdAt: string;
  expiresAt?: string | null;
  
  // Extended administration fields requested by user
  servicesOffered?: string[]; // list of extra services
  tradingTimes?: string;       // e.g. "Mon-Fri: 08:00 - 17:00"
  whatsappNumber?: string;
  mobileNumber?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  appointmentRequired?: 'yes' | 'no';
  
  // Database properties for administrative listings
  userId?: string;
  status?: string;
  businessName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface BizAd {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  placement: 'all' | 'province' | 'city' | 'suburb';
  province?: string;
  city?: string;
  suburb?: string;
  active: boolean;
  position: 'top-banner' | 'sidebar' | 'inline-list';
  size?: 'any' | 'square' | 'banner' | 'portrait';
  createdAt: string;
  badge?: 'verified' | 'premium' | 'premium-verified' | 'standard';
  description?: string;
  alwaysOnTop?: boolean;
  placementNews?: boolean;
  placementSponsored?: boolean;
  expiryType?: 'permanent' | 'date';
  expiryDate?: string | null;
  targetPage?: 'all' | 'home' | 'news' | 'sitemaps';
  layoutRow?: 'top' | 'middle' | 'bottom';
  orderIndex?: number;
}

export interface VisitorTrackingLog {
  id: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  deviceType: 'Mobile' | 'Tablet' | 'Desktop';
  referrer: string;
  path: string;
  searches?: string[];
  clicks?: {
    elementId: string;
    elementText: string;
    timestamp: string;
  }[];
}

export interface DynamicPage {
  id: string;
  title: string;
  slug: string;
  content: string; // Markdown / HTML text
  metaDescription: string;
  keywords?: string;
  geoRegion?: string;
  geoPlacename?: string;
  geoPosition?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SlugMapping {
  id: string;
  source: string;       // e.g. "joburg.bizearch.co.za" or "cape-town-solar"
  target: string;       // e.g. "/explore?province=gauteng&city=cape-town" or dynamic path
  type: 'subdomain' | 'custom-link' | 'redirect';
  active: boolean;
  createdAt: string;
}

export interface AdminSession {
  token: string;
  username: string;
  expiresAt: string;
}

export interface SearchQuery {
  term: string;
  province: string;
  city: string;
  suburb: string;
  category: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;     // Bullet points or paragraphs summarizing the news article
  sourceName: string;  // Name of the source (e.g. News24, Daily Maverick, TimesLIVE)
  sourceUrl: string;   // Original source link from Google News
  imageUrl: string;    // Image URL for visual interest
  publishedAt: string; // Scraped/published timestamp
}
