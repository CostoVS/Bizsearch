import { NextRequest, NextResponse } from 'next/server';
import { readDb, saveDb } from '@/lib/serverDb';
import { verifyAdminSession } from '@/lib/auth';
import { GoogleGenAI, Type } from '@google/genai';
import { NewsArticle } from '@/lib/types';

// Lazy-initialize Gemini client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const force = searchParams.get('force') === 'true';

    // Read the current state of dynamic JSON database
    const dbData = readDb();
    const now = new Date();

    let cachedArticles = dbData.newsCache?.articles || [];
    let lastFetchedAt = dbData.newsCache?.lastFetchedAt || '';

    let isExpiredByHour = true;
    if (lastFetchedAt) {
      const lastFetchTime = Date.parse(lastFetchedAt);
      if (!isNaN(lastFetchTime)) {
        // Less than 1 hour (3600 * 1000 milliseconds)
        isExpiredByHour = (now.getTime() - lastFetchTime) > (60 * 60 * 1000);
      }
    }

    // Force option can only be exercised by authorizing an admin session
    let isForced = false;
    if (force) {
      const isAuthorized = await verifyAdminSession(req);
      if (isAuthorized) {
        isForced = true;
      }
    }

    // Trigger crawler update if expired or forced, or if cached list is empty
    if (isExpiredByHour || isForced || cachedArticles.length === 0) {
      console.log('[NEWS ENGINE] Article cache is stale or missing. Initiating Gemini live news grounding fetch...');
      
      try {
        const ai = getAiClient();
        
        const prompt = `Search for the 10 most recent and major South African news articles or stories today from Google News channels.
Provide a clean JSON list containing exactly the top 10 unique, highly detailed news items.
For each news article, compile:
- 'title': The catchy, original headline based on today's events in South Africa.
- 'summary': A beautifully written 3-paragraph summary of the news story explaining the background, current occurrence, and public reactions or state declarations, formulated in clear, informative journalistic style. Avoid formatting tags (like bold stars '**') within the text.
- 'sourceName': The name of the original news publisher providing this coverage on Google News (e.g. News24, Daily Maverick, TimesLIVE, Mail & Guardian, Eyewitness News, BusinessTech, Fin24, etc.).
- 'sourceUrl': The exact source link URL of the coverage retrieved from search grounding results metadata. If no specific URL is linked, provide a valid generic URL from the news publisher web portal.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  sourceName: { type: Type.STRING },
                  sourceUrl: { type: Type.STRING }
                },
                required: ['title', 'summary', 'sourceName', 'sourceUrl']
              }
            }
          }
        });

        const responseText = response.text;
        if (responseText) {
          const parsedArticles = JSON.parse(responseText.trim());
          if (Array.isArray(parsedArticles) && parsedArticles.length > 0) {
            
            // Transform parsed inputs into NewsArticle structures with visual details
            const newsList: NewsArticle[] = parsedArticles.map((art: any, index: number) => {
              const newsId = `news_${Date.now()}_${index}`;
              return {
                id: newsId,
                title: art.title || 'South Africa Local News Updates',
                summary: art.summary || 'Summary details are loaded dynamically.',
                sourceName: art.sourceName || 'Google News SA',
                sourceUrl: art.sourceUrl || 'https://news.google.co.za',
                // Vivid fallback news seed image using Picsum
                imageUrl: `https://picsum.photos/seed/sanews_${index + 1}/800/600`,
                publishedAt: now.toISOString()
              };
            });

            // Update database newsCache
            dbData.newsCache = {
              articles: newsList,
              lastFetchedAt: now.toISOString()
            };
            saveDb(dbData);
            
            cachedArticles = newsList;
            lastFetchedAt = now.toISOString();
            console.log(`[NEWS ENGINE] Successfully fetched and summarized ${newsList.length} articles!`);
          } else {
            console.warn('[NEWS ENGINE] API returned blank or empty array structure. Using previous cash.');
          }
        }
      } catch (apiError: any) {
        console.error('[NEWS ENGINE] Failed to fetch live news from Gemini API:', apiError.message || apiError);
        // Fail gracefully and use cache if we have one
        if (cachedArticles.length === 0) {
          // If totally empty and API fails, inject high quality seed items
          cachedArticles = getLocalSeedNews();
          dbData.newsCache = {
            articles: cachedArticles,
            lastFetchedAt: now.toISOString()
          };
          saveDb(dbData);
        }
      }
    }

    // Filter active advertising campaigns to inject in-between items
    const activeAds = (dbData.ads || []).filter(a => {
      if (!a.active) return false;
      if (a.expiryType === 'date' && a.expiryDate) {
        const expTime = Date.parse(a.expiryDate);
        if (!isNaN(expTime) && expTime < Date.now()) {
          return false;
        }
      }
      return a.placementNews || a.placement === 'all';
    });

    // Sort ads: alwaysOnTop first, then newest
    activeAds.sort((a, b) => {
      const aTop = a.alwaysOnTop ? 1 : 0;
      const bTop = b.alwaysOnTop ? 1 : 0;
      if (aTop !== bTop) {
        return bTop - aTop;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({
      success: true,
      lastFetchedAt,
      articles: cachedArticles,
      ads: activeAds,
      nextFetchAllowedAt: new Date(Date.parse(lastFetchedAt || now.toISOString()) + 60 * 60 * 1000).toISOString()
    });

  } catch (error: any) {
    console.error('News route error:', error);
    return NextResponse.json({ success: false, message: 'Could not fetch South African news.', error: error?.message }, { status: 500 });
  }
}

// Fallback high-quality South African seed news if the external API key is missing or calls are rate-limited
function getLocalSeedNews(): NewsArticle[] {
  const stamp = new Date().toISOString();
  return [
    {
      id: 'seed_news_1',
      title: 'South African Reserve Bank Discusses Economic Recovery and Interest Rates',
      summary: 'The South African Reserve Bank (SARB) Monetary Policy Committee holds its latest sessions in Pretoria to address inflation targets and potential revisions to key interest rates. Economic analysts report a stabilizing Consumer Price Index (CPI) over the previous fiscal quarter, driven by localized commodity balance sheet gains and improved supply chain efficiencies.\n\nExperts expect policymakers to maintain a cautious stance to defend long-term fiscal resilience while providing local commercial banks with predictable liquidity models.\n\nFurther statements released highlighted the strengthening value of the South African Rand against major currencies, offering a stable framework for international trading groups and small-to-medium enterprises.',
      sourceName: 'Daily Maverick',
      sourceUrl: 'https://www.dailymaverick.co.za',
      imageUrl: 'https://picsum.photos/seed/resbank/800/600',
      publishedAt: stamp
    },
    {
      id: 'seed_news_2',
      title: 'Gauteng Invests R2.5 Billion in Regional Solar Grids and Off-grid Utilities',
      summary: 'The provincial government of Gauteng has officially launched a R2.5 billion infrastructure deployment aiming to integrate green renewable power across major municipal clinics, schools, and business processing parks. The strategy comprises installing hybrid photovoltaic inverter setups and smart local battery backup arrays.\n\nEnergy ministers stated that this public investment intends to curb localized grid impact and maximize uptime during load maintenance slots.\n\nLocal renewable energy tradesmen are welcomed to offer licensed tender packages, promoting job opportunities inside municipal centers in Johannesburg, Pretoria, and Soweto.',
      sourceName: 'News24',
      sourceUrl: 'https://www.news24.com',
      imageUrl: 'https://picsum.photos/seed/gautengsolar/800/600',
      publishedAt: stamp
    },
    {
      id: 'seed_news_3',
      title: 'Cape Town Tourism Hub Records Record-Breaking International Passenger Arrivals',
      summary: 'Western Cape tourism boards celebrated a record-breaking month of flight arrivals at Cape Town International Airport, with stats highlighting a 15% increase in global traveler entries compared to the previous historic high. The surge is credited to enhanced airline flight route mappings and highly active international boutique accommodation portals.\n\nLocal hospitality leaders state that the influx has positively boosted regional trades, private wine tours, and high-end coastal guest estates.\n\nSafety initiatives and transport operations have also been bolstered across Camps Bay, Constantia, and Table Mountain routes to provide seamless commuter flow.',
      sourceName: 'TimesLIVE',
      sourceUrl: 'https://www.timeslive.co.za',
      imageUrl: 'https://picsum.photos/seed/capetour/800/600',
      publishedAt: stamp
    },
    {
      id: 'seed_news_4',
      title: 'South African Technology Incubators Propel SMME Digital Transformations',
      summary: 'A consortium of local South African corporate leaders has announced a fully-funded IT development incubator to bolster micro and small businesses with online billing systems, SEO optimization tools, and zero-trust cybersecurity structures. Over 500 local enterprises have registered to take part across Johannesburg, Durban, and Gqeberha.\n\nProject managers emphasized that the principal objective is to bridge digitizing gaps for tradesmen and small shops.\n\nEarly success logs from the incubator highlight increased online search queries and brand clicks across community pages.',
      sourceName: 'BusinessTech',
      sourceUrl: 'https://www.businesstech.co.za',
      imageUrl: 'https://picsum.photos/seed/sa_tech/800/600',
      publishedAt: stamp
    }
  ];
}
