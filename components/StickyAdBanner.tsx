'use client';

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Sparkles, Mail, MessageSquare, Globe, ChevronDown, ChevronUp, Check, ShieldCheck } from 'lucide-react';

export default function StickyAdBanner() {
  const [ads, setAds] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isMinimized, setIsMinimized] = React.useState<boolean>(false);

  const pathname = usePathname() || '';
  const searchParams = useSearchParams();

  // Load active advertisements from endpoint once on mount
  React.useEffect(() => {
    async function loadStickyAds() {
      try {
        const res = await fetch('/api/ads');
        const data = await res.json();
        if (data.success && Array.isArray(data.ads)) {
          setAds(data.ads);
        }
      } catch (err) {
        console.error('Error fetching sticky ads database:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStickyAds();
  }, []); // Only fetch on mount to optimize network usage

  // Dynamic location-matching algorithm computed on-the-fly via useMemo
  const activeAd = React.useMemo(() => {
    if (ads.length === 0) {
      return null;
    }

    // Only filter active top-positions
    const topBanners = ads.filter(ad => ad.position === 'top-banner' && ad.active !== false);

    if (topBanners.length === 0) {
      return null;
    }

    const provQuery = searchParams?.get('province')?.toLowerCase() || '';
    const cityQuery = searchParams?.get('city')?.toLowerCase() || '';
    const suburbQuery = searchParams?.get('suburb')?.toLowerCase() || '';
    const pathSlug = pathname.replace(/^\//, '').toLowerCase().trim();

    // Map and score placement specificity
    const scored = topBanners.map(ad => {
      let score = 0;
      const placement = ad.placement?.toLowerCase() || 'all';
      const adProv = ad.province?.toLowerCase() || '';
      const adCity = ad.city?.toLowerCase() || '';
      const adSub = ad.suburb?.toLowerCase() || '';

      if (placement === 'suburb' && adSub) {
        if (suburbQuery === adSub || pathSlug === adSub || pathSlug.includes(adSub)) {
          score = 100;
        }
      } else if (placement === 'city' && adCity) {
        if (cityQuery === adCity || pathSlug === adCity || pathSlug.includes(adCity)) {
          score = 50;
        }
      } else if (placement === 'province' && adProv) {
        if (provQuery === adProv || pathSlug === adProv || pathSlug.includes(adProv)) {
          score = 25;
        }
      } else if (placement === 'all') {
        score = 1; // Catch-all fallback
      }

      return { ad, score };
    });

    // Keep only matches
    const matched = scored.filter(item => item.score > 0);

    if (matched.length === 0) {
      return null;
    }

    // Sort by: score desc, alwaysOnTop desc, createdAt desc
    matched.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      
      const aTop = a.ad.alwaysOnTop ? 1 : 0;
      const bTop = b.ad.alwaysOnTop ? 1 : 0;
      if (bTop !== aTop) return bTop - aTop;

      return new Date(b.ad.createdAt).getTime() - new Date(a.ad.createdAt).getTime();
    });

    return matched[0].ad;
  }, [ads, pathname, searchParams]);

  // If loading or no active ad matches the location criteria, display absolutely nothing
  if (loading || !activeAd) {
    return null;
  }

  // Generate safe dynamic outbound communication URLs
  const activeTargetUrl = activeAd.targetUrl || `https://wa.me/27751613007?text=${encodeURIComponent(
    `Hi BizSearch24 Support,\n\nI want to order or subscribe to: "${activeAd.title}". Please helper me contact back!\n\nReference Code: ${activeAd.id}`
  )}`;

  const advertiseContactUrl = `https://wa.me/27751613007?text=${encodeURIComponent(
    `Hi BizSearch24 Support,\n\nI want to buy or place premium advertisements on your platform directory in my area/location.\n\nPlease share options!\n\nInterested in space context ID: ${activeAd.id}`
  )}`;

  if (isMinimized) {
    return (
      <div 
        className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-b border-emerald-500/30 text-white text-[11px] py-1 px-4 flex items-center justify-between shadow-md transition-all sticky top-0 z-50 select-none animate-fade-in"
        id="sticky-ad-banner-minimized"
      >
        <div className="flex items-center space-x-2 truncate">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-405 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-550"></span>
          </span>
          <span className="font-extrabold uppercase tracking-widest text-emerald-400 font-mono text-[9.5px]">SPONSOR BANNER:</span>
          <span className="font-medium text-slate-205 truncate">{activeAd.title}</span>
        </div>
        <button 
          onClick={() => setIsMinimized(false)}
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase font-mono px-2 py-0.5 border border-emerald-500/20 rounded-md bg-white/5 hover:bg-white/10 flex items-center gap-1 cursor-pointer outline-none shrink-0"
        >
          <span>Expand Offer</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div 
      className="bg-slate-950 border-b-2 border-emerald-555 text-white shadow-xl transition-all sticky top-0 z-[100] animate-fade-in"
      id="sticky-ad-banner-expanded"
    >
      <div className="max-w-7xl mx-auto p-3.5 sm:p-5 relative" id="sticky-ad-banner-inner">
        {/* Minimize Button */}
        <button 
          onClick={() => setIsMinimized(true)}
          className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/5 focus:outline-none"
          title="Minimize advertisement"
          aria-label="Minimize"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        {/* Banner Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center pr-8">
          
          {/* Main Info Box */}
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center gap-2 flex-wrap" id="banner-badges-wrapper">
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30">
                <Sparkles className="w-3 h-3 animate-pulse" />
                {activeAd.badge ? `${activeAd.badge.replace('-', ' ').toUpperCase()} SPONSOR` : 'SPECIAL PARTNER AD'}
              </span>
              <span className="inline-flex bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold">
                📍 Location Scope: {activeAd.placement.toUpperCase()} {activeAd.province && `(${activeAd.province.toUpperCase()})` || ''}
              </span>
            </div>

            <h2 className="text-sm sm:text-base font-black tracking-tight text-white leading-tight">
              {activeAd.title}
            </h2>

            {activeAd.description && (
              <p className="text-slate-305 text-xs font-normal leading-relaxed max-w-full">
                {activeAd.description}
              </p>
            )}
          </div>

          {/* Action CTAs */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row gap-2.5 w-full justify-end" id="banner-action-ctas">
            <a 
              href={activeTargetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-700/20 hover:scale-[1.01] hover:shadow-emerald-700/30 outline-none border-0 group cursor-pointer text-center"
            >
              <Sparkles className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
              <span>Claim Promo Offer</span>
            </a>

            <a 
              href={advertiseContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center space-x-1.5 hover:scale-[1.01] outline-none text-center"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-300" />
              <span>Advertise Here</span>
            </a>
          </div>

        </div>

        {/* Dynamic Ad Footer */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between text-[11px] text-slate-400 gap-2 font-mono" id="banner-footer-panel">
          <div className="flex items-center space-x-1.5 flex-wrap">
            <span className="font-extrabold text-slate-200">✨ Targeted Listing Spot:</span>
            <span className="text-emerald-400">Secure regional placements in minutes. Reach prime local consumer buyers.</span>
          </div>

          <div className="flex items-center gap-2 justify-start sm:justify-end bg-emerald-950/40 border border-emerald-900/30 px-3 py-1 rounded-lg w-fit text-emerald-300 font-bold shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping items-center"></span>
            💬 WhatsApp Live: <span className="text-white hover:underline selection:bg-emerald-900"><a href={`https://wa.me/27751613007?text=Hi%20BizSearch24%20Support`} target="_blank" rel="noopener noreferrer">075 161 3007</a></span>
          </div>
        </div>

      </div>
    </div>
  );
}
