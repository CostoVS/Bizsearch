import fs from 'fs';
import path from 'path';
import { BusinessListing, DynamicPage, SlugMapping, BizAd, VisitorTrackingLog, NewsArticle } from './types';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');
const ALT_DB_FILE = '/tmp/bizearch_db.json';

const SEED_ADS: BizAd[] = [
  {
    id: 'ad_1',
    title: 'SuperSolar Gauteng Promo',
    imageUrl: 'https://picsum.photos/seed/solarprime/1200/400',
    targetUrl: '/explore?term=solar',
    placement: 'province',
    province: 'gauteng',
    active: true,
    position: 'top-banner',
    size: 'banner',
    createdAt: new Date().toISOString()
  },
  {
    id: 'ad_2',
    title: 'Cape Town Accommodation Special',
    imageUrl: 'https://picsum.photos/seed/cthotels/400/300',
    targetUrl: '/explore?category=tourism',
    placement: 'city',
    city: 'cape-town',
    active: true,
    position: 'sidebar',
    size: 'square',
    createdAt: new Date().toISOString()
  }
];

const SEED_VISITOR_LOGS: VisitorTrackingLog[] = [
  {
    id: 'log_1',
    timestamp: '2026-05-31T10:11:00Z',
    ip: '105.184.22.90',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    deviceType: 'Desktop',
    referrer: 'https://www.google.co.za',
    path: '/explore?province=gauteng&city=johannesburg',
    searches: ['solar installers', 'emergency plumber'],
    clicks: [
      { elementId: 'b1', elementText: 'Sandton Engineering & Plumbing', timestamp: '2026-05-31T10:12:05Z' }
    ]
  },
  {
    id: 'log_2',
    timestamp: '2026-05-31T12:05:00Z',
    ip: '197.245.88.112',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
    deviceType: 'Mobile',
    referrer: 'https://m.facebook.com',
    path: '/explore?province=western-cape',
    searches: ['boutique hotel', 'camps bay'],
    clicks: [
      { elementId: 'b2', elementText: 'Table Mountain Guest Inn', timestamp: '2026-05-31T12:07:30Z' }
    ]
  },
  {
    id: 'log_3',
    timestamp: '2026-05-31T13:40:00Z',
    ip: '41.13.190.4',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    deviceType: 'Desktop',
    referrer: 'https://duckduckgo.com',
    path: '/explore?category=health&province=kwazulu-natal',
    searches: ['dentist umhlanga', 'med-clinic'],
    clicks: [
      { elementId: 'b3', elementText: 'Umhlanga Med-Clinic Diagnostics', timestamp: '2026-05-31T13:42:12Z' }
    ]
  }
];

// Seed Listings
const INITIAL_LISTINGS: BusinessListing[] = [
  {
    id: 'b1',
    name: 'Sandton Engineering & Plumbing',
    description: 'Premier commercial and residential plumbing services in Sandton and surrounding areas. Specialized in leak detection, solar geyser installations, and emergency 24/7 plumbing. SABS approved materials only.',
    category: 'trades',
    address: '43 Rivonia Road, Sandton, Johannesburg, 2196',
    province: 'gauteng',
    city: 'johannesburg',
    suburb: 'Sandton',
    phone: '+27 (11) 555-1234',
    email: 'info@sandtonplumbing.co.za',
    website: 'https://www.sandtonplumbing.co.za',
    verified: true,
    image: 'https://picsum.photos/seed/sandtonplumb/800/600',
    tags: ['plumbing', 'solar geyser', 'leak detection', 'emergency plumber'],
    views: 145,
    slug: 'sandton-engineering-and-plumbing',
    createdAt: '2026-01-15T08:00:00Z',
  },
  {
    id: 'b2',
    name: 'Table Mountain Guest Inn',
    description: 'Nestled at the foot of Table Mountain in Camps Bay, Cape Town. Offering boutique five-star suites with stunning seaside sunsets, personalized winery tours, and organic South African breakfasts.',
    category: 'tourism',
    address: '88 Victoria Road, Camps Bay, Cape Town, 8005',
    province: 'western-cape',
    city: 'cape-town',
    suburb: 'Camps Bay',
    phone: '+27 (21) 483-9988',
    email: 'reservations@tablemountainguest.co.za',
    website: 'https://www.tablemountainguest.co.za',
    verified: true,
    image: 'https://picsum.photos/seed/tablemountain/800/600',
    tags: ['boutique hotel', 'accommodation', 'luxury suite', 'cape town tourism'],
    views: 312,
    slug: 'table-mountain-guest-inn',
    createdAt: '2026-02-10T11:30:00.000Z',
  },
  {
    id: 'b3',
    name: 'Umhlanga Med-Clinic Diagnostics',
    description: 'State of the art diagnostic imaging and medical general practice clinic in Umhlanga Ridge. Available for family appointments, specialized dental checkups, and wellness screening with local medical aid partners.',
    category: 'health',
    address: '15 Lagoon Drive, Umhlanga, Durban, 4319',
    province: 'kwazulu-natal',
    city: 'durban',
    suburb: 'Umhlanga',
    phone: '+27 (31) 566-4433',
    email: 'helpdesk@umhlangadiagnostics.co.za',
    website: 'https://www.umhlangadiagnostics.co.za',
    verified: true,
    image: 'https://picsum.photos/seed/umhlangamed/800/600',
    tags: ['medical doctor', 'dental checkup', 'diagnostic clinic', 'umhlanga health'],
    views: 95,
    slug: 'umhlanga-med-clinic-diagnostics',
    createdAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'b4',
    name: 'Pretoria Cybersecurity Experts',
    description: 'Providing comprehensive IT security Audits, penetration testing, firewall maintenance, and managed IT structures for local businesses across Pretoria, Centurion and Midrand regions. Zero-trust security implementation.',
    category: 'services',
    address: 'Hatfield Plaza Office Suites, Hatfield, Pretoria, 0083',
    province: 'gauteng',
    city: 'pretoria',
    suburb: 'Hatfield',
    phone: '+27 (12) 644-8899',
    email: 'secure@pretoriacyber.co.za',
    website: 'https://www.pretoriacyber.co.za',
    verified: true,
    image: 'https://picsum.photos/seed/pretoriacyber/800/600',
    tags: ['cybersecurity', 'it support', 'firewalls', 'cloud server audit'],
    views: 184,
    slug: 'pretoria-cybersecurity-experts',
    createdAt: '2026-03-12T14:20:00Z',
  },
  {
    id: 'b5',
    name: 'Constantia Wine Estates Tours',
    description: 'A boutique luxury wine touring enterprise offering customized daily trips through Cape Town\'s historic Constantia Valley and Stellenbosch Vineyards. Includes somatic wine tasting and masterclass pairings.',
    category: 'tourism',
    address: 'Constantia Main Road, Constantia, Cape Town, 7806',
    province: 'western-cape',
    city: 'cape-town',
    suburb: 'City Bowl',
    phone: '+27 (21) 794-1122',
    email: 'info@constantiawinetours.co.za',
    website: 'https://www.constantiawinetours.co.za',
    verified: true,
    image: 'https://picsum.photos/seed/winetours/800/600',
    tags: ['wine tasting', 'stellenbosch tour', 'constantia vineyard', 'tourism shuttle'],
    views: 220,
    slug: 'constantia-wine-estates-tours',
    createdAt: '2026-04-05T10:15:00Z',
  },
  {
    id: 'b6',
    name: 'Gqeberha Auto Mechanic and Diesel',
    description: 'High caliber diagnostic vehicle diagnostics, engine overhauls, brake pad servicing and exhaust maintenance for passenger cars, light trucks and logistics diesels in Gqeberha (Port Elizabeth).',
    category: 'automotive',
    address: '102 Walmer Boulevard, Walmer, Gqeberha, 6065',
    province: 'eastern-cape',
    city: 'gqeberha',
    suburb: 'Walmer',
    phone: '+27 (41) 585-7000',
    email: 'service@peautomechanic.co.za',
    website: 'https://www.peautomechanic.co.za',
    verified: true,
    image: 'https://picsum.photos/seed/gqeberhaauto/800/600',
    tags: ['car repairs', 'diesel mechanic', 'automotive performance', 'brake repairs'],
    views: 112,
    slug: 'gqeberha-auto-mechanic-and-diesel',
    createdAt: '2026-04-18T16:45:00Z',
  },
  {
    id: 'b7',
    name: 'Bloemfontein Accounting and Tax Specialists',
    description: 'Qualified SARS tax returns practitioners, bookkeeping, payroll services and corporate financial audits. Tailored for small, medium and micro enterprises (SMMEs) in the Free State province.',
    category: 'services',
    address: 'Westdene Office Park, Westdene, Bloemfontein, 9301',
    province: 'free-state',
    city: 'bloemfontein',
    suburb: 'Westdene',
    phone: '+27 (51) 441-2020',
    email: 'admin@bloemtax.co.za',
    website: 'https://www.bloemtax.co.za',
    verified: true,
    image: 'https://picsum.photos/seed/bloemaccounting/800/600',
    tags: ['accounting', 'tax return', 'bookkeeping', 'SARS audit assistance'],
    views: 89,
    slug: 'bloemfontein-accounting-and-tax-specialists',
    createdAt: '2026-04-20T09:12:00Z',
  },
  {
    id: 'b8',
    name: 'Nelspruit Wildlife Expeditions',
    description: 'Offering private and group safari drives into the Kruger National Park. Luxury open-vehicle photographic safaris guided by certified FGASA professionals. Pickups from local Mbombela guest lodges.',
    category: 'tourism',
    address: '15 Madiba Drive, Sonheuwel, Mbombela, 1201',
    province: 'mpumalanga',
    city: 'mbombela',
    suburb: 'Sonheuwel',
    phone: '+27 (13) 755-3001',
    email: 'safari@nelspruitwildlife.co.za',
    website: 'https://www.nelspruitwildlife.co.za',
    verified: true,
    image: 'https://picsum.photos/seed/krugersafari/800/600',
    tags: ['safari', 'kruger park', 'tourist drive', 'game viewing'],
    views: 298,
    slug: 'nelspruit-wildlife-expeditions',
    createdAt: '2026-04-22T07:10:00Z',
  },
  {
    id: 'b9',
    name: 'Polokwane Solar Systems',
    description: 'Comprehensive hybrid and off-grid solar energy setups for residential homes and commercial blocks. SANS compliant installation, battery backup inverters, and high-quality solar panel certifications.',
    category: 'trades',
    address: '88 Bendor Avenue, Bendor, Polokwane, 0700',
    province: 'limpopo',
    city: 'polokwane',
    suburb: 'Bendor',
    phone: '+27 (15) 297-5050',
    email: 'sales@polokwanesolar.co.za',
    website: 'https://www.polokwanesolar.co.za',
    verified: true,
    image: 'https://picsum.photos/seed/polokwanesolar/800/600',
    tags: ['solar power', 'inverter battery', 'solar backup', 'electrician'],
    views: 140,
    slug: 'polokwane-solar-systems',
    createdAt: '2026-04-25T11:40:00Z',
  },
  {
    id: 'b10',
    name: 'Kimberley Diamond Jewellers',
    description: 'Design and crafting of premium engagement rings and custom luxury diamonds. Verifiable Kimberley Process certified diamonds of South African heritage. Showroom nestled in historic Belgravia area.',
    category: 'retail',
    address: '12 Belgravia Block, Belgravia, Kimberley, 8301',
    province: 'northern-cape',
    city: 'kimberley',
    suburb: 'Belgravia',
    phone: '+27 (53) 831-4040',
    email: 'jewels@kimberleydiamonds.co.za',
    website: 'https://www.kimberleydiamonds.co.za',
    verified: true,
    image: 'https://picsum.photos/seed/kimberleydiamonds/800/600',
    tags: ['jewellery', 'diamonds', 'engagement rings', 'custom craft'],
    views: 104,
    slug: 'kimberley-diamond-jewellers',
    createdAt: '2026-04-28T15:30:00Z',
  }
];

// Seed Dynamic SEO Pages
const INITIAL_PAGES: DynamicPage[] = [
  {
    id: 'p1',
    title: 'Top Local Subservices in Johannesburg',
    slug: 'joburg-top-listings',
    content: `
# Discover Elite Business Services in Johannesburg
Johannesburg (Gauteng) represents the absolute financial pulse of South Africa.
Here on BizEarch, we are committed to compiling trusted, verified tradesmen, digital developers, and engineering companies.

## Key Sectors in Gauteng
1. **Financial Hubs & Accounting Services**: Locate certified auditors in Sandton and Rosebank.
2. **Solar Energy Providers**: Beat load-shedding with our list of active backup installer businesses.
3. **Emergency Plumbers & Electricians**: Licensed contractors in Midrand and Pretoria Centurion.

For help registering your brand, navigate to submit list section above.
`,
    metaDescription: 'Find verified, licensed service companies and solar experts in Sandton, Rosebank and Midrand, Gauteng.',
    createdAt: '2026-05-01T12:00:00Z',
    updatedAt: '2026-05-01T12:00:00Z',
  },
  {
    id: 'p2',
    title: 'Guide to Wine Tasting and Travel in Western Cape',
    slug: 'western-cape-tourism-guide',
    content: `
# Exploring the Majestic Western Cape
The Western Cape boasts spectacular coastlines, historic vineyard routes, and majestic engineering marvels.

## Top Recommendations
- **Table Mountain & Camps Bay Guest Houses**: Boutique beach properties.
- **Stellenbosch Wine & Culinary Excursions**: Explore historic cellars.
- **George and Knysna (Garden Route)**: Find scenic coastal family cottages.

Our submissions list features certified local tourist tour operators and accommodation spots with secure card processing.
`,
    metaDescription: 'Boutique accommodation, luxury beach houses and Stellenbosch vineyards travel advisory, Western Cape.',
    createdAt: '2026-05-05T09:00:00Z',
    updatedAt: '2026-05-05T09:00:00Z',
  }
];

interface DatabaseSchema {
  listings: BusinessListing[];
  pages: DynamicPage[];
  slugMappings: SlugMapping[];
  ads: BizAd[];
  visitorLogs: VisitorTrackingLog[];
  newsCache?: {
    articles: NewsArticle[];
    lastFetchedAt: string;
  };
}

// In-Memory Fallback to prevent file locks or read overheads
let memoryDb: DatabaseSchema | null = null;

function getDbPath(): string {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    return DB_FILE;
  } catch (e) {
    return ALT_DB_FILE;
  }
}

export function readDb(): DatabaseSchema {
  if (memoryDb) {
    if (!memoryDb.slugMappings) memoryDb.slugMappings = [];
    if (!memoryDb.ads) memoryDb.ads = SEED_ADS;
    if (!memoryDb.visitorLogs) memoryDb.visitorLogs = SEED_VISITOR_LOGS;
    return memoryDb;
  }

  const dbPath = getDbPath();
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      memoryDb = JSON.parse(data);
      if (!memoryDb!.slugMappings) memoryDb!.slugMappings = [];
      if (!memoryDb!.ads) memoryDb!.ads = SEED_ADS;
      if (!memoryDb!.visitorLogs) memoryDb!.visitorLogs = SEED_VISITOR_LOGS;
      if (!memoryDb!.newsCache) memoryDb!.newsCache = { articles: [], lastFetchedAt: '' };
      return memoryDb!;
    }
  } catch (error) {
    console.error('Error reading first-choice DB:', error);
  }

  // Try read ALT_DB_FILE next
  try {
    if (fs.existsSync(ALT_DB_FILE)) {
      const data = fs.readFileSync(ALT_DB_FILE, 'utf-8');
      memoryDb = JSON.parse(data);
      if (!memoryDb!.slugMappings) memoryDb!.slugMappings = [];
      if (!memoryDb!.ads) memoryDb!.ads = SEED_ADS;
      if (!memoryDb!.visitorLogs) memoryDb!.visitorLogs = SEED_VISITOR_LOGS;
      if (!memoryDb!.newsCache) memoryDb!.newsCache = { articles: [], lastFetchedAt: '' };
      return memoryDb!;
    }
  } catch (error) {
    console.error('Error reading alternative DB:', error);
  }

  // Create & Save default seed if totally missing
  memoryDb = {
    listings: INITIAL_LISTINGS,
    pages: INITIAL_PAGES,
    slugMappings: [
      {
        id: 'map_1',
        source: 'joburg.bizearch.co.za',
        target: '/explore?province=gauteng&city=johannesburg',
        type: 'subdomain',
        active: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 'map_2',
        source: '/cape-town-solar',
        target: '/explore?province=western-cape&city=cape-town&category=trades',
        type: 'custom-link',
        active: true,
        createdAt: new Date().toISOString()
      }
    ],
    ads: SEED_ADS,
    visitorLogs: SEED_VISITOR_LOGS,
    newsCache: { articles: [], lastFetchedAt: '' }
  };
  saveDb(memoryDb);
  return memoryDb;
}

export function saveDb(data: DatabaseSchema): boolean {
  memoryDb = data;
  const dbPath = getDbPath();
  
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing first-choice DB, saving to alternative...', error);
    try {
      fs.writeFileSync(ALT_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return true;
    } catch (err2) {
      console.error('Totally failed to write anywhere:', err2);
      return false;
    }
  }
}
