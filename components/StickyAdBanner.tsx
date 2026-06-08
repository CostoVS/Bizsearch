'use client';

import * as React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Sparkles, Mail, MessageSquare, Globe, ChevronDown, ChevronUp, Check, ShieldCheck, X } from 'lucide-react';

export default function StickyAdBanner() {
  const [ads, setAds] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [isMinimized, setIsMinimized] = React.useState<boolean>(false);
  const [isDismissed, setIsDismissed] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('sticky_ad_dismissed') === 'true';
    }
    return false;
  });

  // Scroll listener to automatically minimize banner when user scrolls down
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsMinimized(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    sessionStorage.setItem('sticky_ad_dismissed', 'true');
  };

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

  // If loading or no active ad matches the location criteria, or if dismissed, display absolutely nothing
  if (loading || !activeAd || isDismissed) {
    return null;
  }

  // Generate safe dynamic outbound communication URLs
  const activeTargetUrl = activeAd.targetUrl || `https://wa.me/27751613007?text=${encodeURIComponent(
    `Hi BizSearch24 Support,\n\nI want to order or subscribe to: "${activeAd.title}". Please helper me contact back!\n\nReference Code: ${activeAd.id}`
  )}`;

  const advertiseContactUrl = `https://wa.me/27751613007?text=${encodeURIComponent(
    `Hi BizSearch24 Support,\n\nI want to buy or place premium advertisements on your platform directory in my area/location.\n\nPlease share options!\n\nInterested in space context ID: ${activeAd.id}`
  )}`;

  const handleOpenDetails = () => {
    const event = new CustomEvent('open-ad-details', { detail: activeAd });
    window.dispatchEvent(event);
  };

  if (isMinimized) {
    return (
      <div 
        className="bg-slate-950 border-b border-emerald-500/30 text-white cursor-pointer hover:bg-slate-900 transition-all sticky top-0 z-[100]"
        onClick={() => setIsMinimized(false)}
        id="sticky-ad-minimized"
      >
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0" />
            <span className="text-[10px] sm:text-xs font-bold tracking-tight text-slate-300 truncate">
              SPONSORED OFFER: {activeAd.title} - <span className="text-emerald-400 font-normal">Expand for info</span>
            </span>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer select-none"
            >
              Expand
            </button>
            <button 
              type="button"
              onClick={handleDismiss} 
              className="p-1 hover:text-red-400 text-slate-400 transition-colors cursor-pointer outline-none flex items-center justify-center rounded-lg hover:bg-white/10"
              title="Close permanently"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="bg-slate-950 border-b-2 border-emerald-500 text-white shadow-xl transition-all sticky top-0 z-[100] animate-fade-in"
      id="sticky-ad-banner-expanded"
    >
      <div className="max-w-7xl mx-auto p-2 sm:p-3 relative" id="sticky-ad-banner-inner">
        {/* Toggle & Close Controls */}
        <div className="absolute right-2 top-2 flex items-center space-x-1.5 z-20" id="sticky-controls">
          <button 
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1.5 bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer outline-none flex items-center justify-center shrink-0"
            title="Minimize banner"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={handleDismiss}
            className="p-1.5 bg-red-500/20 hover:bg-red-500/35 text-red-350 hover:text-red-100 rounded-lg transition-colors cursor-pointer outline-none flex items-center justify-center shrink-0"
            title="Close permanently"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Banner Content Grid - Compact Flex layout */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pr-8 pt-1.5 pb-1 md:py-0" id="banner-content-flex">
          
          {/* Main Info Box - Click to open details */}
          <div 
            onClick={handleOpenDetails}
            className="flex items-center space-x-3.5 flex-1 cursor-pointer group/info w-full"
          >
            {activeAd.imageUrl && (
              <div className="w-14 h-10 relative bg-slate-800 rounded-lg overflow-hidden shrink-0 border border-emerald-500/15 shadow-xs group-hover/info:scale-105 transition-transform">
                <img 
                  src={activeAd.imageUrl} 
                  alt={activeAd.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap" id="banner-badges-wrapper">
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border border-emerald-500/20">
                  <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                  {activeAd.badge ? `${activeAd.badge.replace('-', ' ').toUpperCase()} SPONSOR` : 'SPECIAL PARTNER AD'}
                </span>
                <span className="inline-flex bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-semibold">
                  Scope: {activeAd.placement.toUpperCase()} {activeAd.province && `(${activeAd.province.toUpperCase()})` || ''}
                </span>
              </div>
              <h2 className="text-xs sm:text-sm font-black tracking-tight text-white leading-tight group-hover/info:text-emerald-400 transition-colors truncate">
                {activeAd.title}
              </h2>
              {activeAd.description && (
                <p className="text-slate-400 text-[11px] font-normal leading-normal max-w-full truncate md:line-clamp-2 md:whitespace-normal line-clamp-1">
                  {activeAd.description}
                </p>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-row gap-2 w-full md:w-auto shrink-0 justify-end" id="banner-action-ctas">
            <button 
              type="button"
              onClick={handleOpenDetails}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs py-2 px-3 sm:px-4 rounded-lg transition-all flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-700/10 active:scale-[0.99] outline-none border-0 cursor-pointer flex-1 md:flex-initial"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-100" />
              <span>Claim Promo Offer</span>
            </button>

            <a 
              href={advertiseContactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 text-white font-extrabold text-xs py-2 px-3 sm:px-4 rounded-lg transition-all flex items-center justify-center space-x-1.5 hover:scale-[1.01] outline-none text-center flex-1 md:flex-initial"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-300" />
              <span>Advertise</span>
            </a>
          </div>

        </div>

        {/* Dynamic Ad Footer */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 hidden md:flex flex-col sm:flex-row sm:items-center sm:justify-between text-[10.5px] text-slate-400 gap-2 font-mono" id="banner-footer-panel">
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
