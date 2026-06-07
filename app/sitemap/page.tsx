'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  ChevronRight, 
  ChevronDown,
  ArrowLeft, 
  Search, 
  Compass, 
  Map, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  ShieldAlert,
  FileText
} from 'lucide-react';
import { PROVINCES, CITIES_AND_TOWNS } from '@/lib/saData';
import { BusinessListing } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function SitemapPage() {
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [selectedProvinceId, setSelectedProvinceId] = React.useState<string | null>(null);
  const [listings, setListings] = React.useState<BusinessListing[]>([]);
  const [seoPageSlugs, setSeoPageSlugs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  // Terms and legal consent states
  const [showConsentBanner, setShowConsentBanner] = React.useState<boolean>(false);
  const [showLegalModal, setShowLegalModal] = React.useState<boolean>(false);
  const [isLegalExpanded, setIsLegalExpanded] = React.useState<boolean>(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const legalAccepted = localStorage.getItem('biz_legal_accepted');
      if (!legalAccepted) {
        setShowConsentBanner(true);
      }

      async function loadListingsAndPages() {
        try {
          const [listingsRes, pagesRes] = await Promise.all([
            fetch('/api/listings?onlyVerified=true'),
            fetch('/api/pages')
          ]);
          
          const listingsData = await listingsRes.json();
          if (listingsData.success) {
            setListings(listingsData.listings);
          }

          const pagesData = await pagesRes.json();
          if (pagesData.success) {
            setSeoPageSlugs(pagesData.pages || []);
          }
        } catch (err) {
          console.error('Failed to load sitemap statistics:', err);
        } finally {
          setLoading(false);
        }
      }
      loadListingsAndPages();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Filter provinces and cities based on search term
  const filteredProvinces = PROVINCES.filter(province => {
    const provinceMatches = province.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if any child cities/towns or suburbs match
    const associatedCities = CITIES_AND_TOWNS.filter(c => c.provinceId === province.id);
    const cityMatches = associatedCities.some(city => 
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.suburbs.some(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return provinceMatches || cityMatches;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans" id="sitemap-root">
      {/* HEADER ROW */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40" id="sitemap-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between" id="sitemap-header-inner">
          <div className="flex items-center space-x-4" id="sitemap-logo-area">
            <Link href="/" className="inline-flex items-center space-x-1.5 text-slate-600 hover:text-slate-900 transition-colors" id="btn-back-home">
              <ArrowLeft className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold">Back to Finder</span>
            </Link>
            <div className="h-4 w-px bg-slate-200" id="logo-divider" />
            <span className="text-slate-900 font-mono text-xs hidden sm:inline-flex bg-slate-100 px-2.5 py-1 rounded-md" id="sitemap-indicator-badge">SITEMAP DIRECTORY</span>
          </div>
          <Link href="/" className="font-bold tracking-tight text-slate-900 block leading-tight whitespace-nowrap" id="logo-brand">
            <span className="text-white font-black text-2xl inline-block mr-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_-1.5px_-1.5px_0_#10b981,_1.5px_-1.5px_0_#10b981,_-1.5px_1.5px_0_#10b981,_1.5px_1.5px_0_#10b981,_0px_-1.5px_0_#10b981,_0px_1.5px_0_#10b981,_-1.5px_0px_0_#10b981,_1.5px_0px_0_#10b981]">B</span>iz<span className="text-emerald-500 font-black text-2xl inline-block mx-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_-1.5px_-1.5px_0_#000,_1.5px_-1.5px_0_#000,_-1.5px_1.5px_0_#000,_1.5px_1.5px_0_#000,_0px_-1.5px_0_#000,_0px_1.5px_0_#000,_-1.5px_0px_0_#000,_1.5px_0px_0_#000]">S</span>earch24
          </Link>
        </div>
      </header>

      {/* CORE FRAME */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="sitemap-main">
        {/* HERO CAPTION SECTION */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl" id="sitemap-hero">
          <div className="relative z-10 space-y-3 max-w-2xl" id="sitemap-hero-content">
            <span className="inline-flex bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
              Comprehensive GEO Index
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" id="sitemap-title">
              South African Regional Sitemap
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed" id="sitemap-subtitle">
              Navigate index-mapped organic links for all 9 provinces, municipalities, cities, tourist towns, and major suburbs across SA. Ensure robust search visibility and verify company registrations.
            </p>
          </div>

          {/* Decorative floating grids */}
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 pointer-events-none hidden md:block" id="sitemap-hero-decor">
            <Map className="w-full h-full text-emerald-400 transform translate-x-10 translate-y-2 scale-110" />
          </div>
        </div>

        {/* INTERACTIVE SEARCH PANEL */}
        <div className="bg-white border rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-center gap-4" id="sitemap-filter-panel">
          <div className="relative w-full md:flex-1" id="search-bar-wrap">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" id="search-icon" />
            <input
              id="sitemap-query-input"
              type="text"
              placeholder="Search by Province, City, Town, or Suburb (e.g. Camps Bay, Umhlanga, Sandton...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center space-x-2 shrink-0 text-xs text-slate-500 font-mono" id="stats-summary">
            <span>Provinces mapped: <strong className="text-slate-800 font-bold">9</strong></span>
            <span>•</span>
            <span>Cities & Towns: <strong className="text-slate-800 font-bold">{CITIES_AND_TOWNS.length}</strong></span>
          </div>
        </div>

        {/* PROVINCES AND SUB-TOWNS MULTI-VIEW INDEX */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="sitemap-layout-grid">
          {/* LEFT LIST: PROVINCE SELECTOR ACCORDION */}
          <div className="md:col-span-1 space-y-4" id="sitemap-side-panel">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs" id="prov-index-wrapper">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-widest border-b pb-3 mb-3 flex items-center space-x-2" id="prov-title">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Provincial Index</span>
              </h2>

              <div className="space-y-1.5" id="sitemap-prov-stack">
                <button
                  id="btn-prov-all"
                  onClick={() => setSelectedProvinceId(null)}
                  className={cn(
                    "w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all outline-none",
                    selectedProvinceId === null 
                      ? "bg-emerald-50 border border-emerald-200/55 text-emerald-800" 
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <span>Show All 9 Provinces</span>
                  <Layers className="w-3.5 h-3.5" />
                </button>

                {filteredProvinces.map(prov => {
                  const provinceCitiesCount = CITIES_AND_TOWNS.filter(c => c.provinceId === prov.id).length;
                  const provinceListingsCount = listings.filter(l => l.province === prov.id).length;
                  const isSelected = selectedProvinceId === prov.id;

                  return (
                    <button
                      id={`btn-prov-sel-${prov.id}`}
                      key={prov.id}
                      onClick={() => setSelectedProvinceId(prov.id)}
                      className={cn(
                        "w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold flex items-center justify-between transition-all outline-none border",
                        isSelected 
                          ? "bg-slate-900 border-slate-900 text-white shadow-md" 
                          : "bg-white border-transparent text-slate-650 hover:bg-slate-50"
                      )}
                    >
                      <div className="space-y-0.5 text-left" id={`prov-lbls-${prov.id}`}>
                        <span className="block">{prov.name}</span>
                        <span className={cn("block text-[10px] font-mono", isSelected ? "text-slate-300" : "text-slate-400")}>
                          {prov.code} • {provinceCitiesCount} areas
                        </span>
                      </div>
                      <span className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded-full font-bold",
                        isSelected ? "bg-emerald-500/20 text-emerald-300" : "bg-slate-100 text-slate-600"
                      )} id={`prov-counts-${prov.id}`}>
                        {provinceListingsCount} listings
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUICK SAFETY WARNING DISCLOSURE (HIGHLY VISIBLE) */}
            <div className="bg-amber-50 border border-amber-200/60 rounded-2xl p-5 space-y-3" id="sitemap-safety-disclaimer">
              <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 animate-bounce" />
                <span>Safeguard / Fraud Advisory</span>
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed" id="sitemap-disclaimer-detail">
                This directory is provided strictly for **informational purposes**. Bizsearch24 is not reliable or legally liable for any loss, damage, theft, or any physical, mental, emotional, or financial harm resulting from transactions. Always take strict precautions, verify company details, and watch out for potential scams.
              </p>
            </div>
          </div>

          {/* RIGHT PANELS: DETAILED BENTO GRID GRID SYSTEM */}
          <div className="md:col-span-2 space-y-6" id="sitemap-detail-panel">
            {filteredProvinces
              .filter(p => selectedProvinceId === null || p.id === selectedProvinceId)
              .map(prov => {
                const associatedCities = CITIES_AND_TOWNS.filter(c => c.provinceId === prov.id && (
                  searchTerm === '' ||
                  c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  c.suburbs.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
                ));

                if (associatedCities.length === 0) return null;

                return (
                  <motion.div
                    id={`prov-card-wrap-${prov.id}`}
                    key={prov.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border rounded-3xl p-6 shadow-sm space-y-5"
                  >
                    {/* Province heading */}
                    <div className="border-b pb-4 flex items-center justify-between" id={`prov-card-header-${prov.id}`}>
                      <div className="space-y-0.5" id={`prov-card-headings-${prov.id}`}>
                        <h3 className="text-lg font-black text-slate-900" id={`prov-card-title-${prov.id}`}>{prov.name} Province</h3>
                        <span className="text-xs font-mono text-emerald-700 font-bold" id={`prov-code-sub-${prov.id}`}>Primary Mapped Region Indicator ID: {prov.code}</span>
                      </div>
                      <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-mono" id={`prov-card-stat-${prov.id}`}>
                        {associatedCities.length} Areas Listed
                      </span>
                    </div>

                    {/* Cities & Suburbs tree list */}
                    <div className="space-y-6" id={`prov-areas-tree-${prov.id}`}>
                      {associatedCities.map(city => {
                        const cityListings = listings.filter(l => l.province === prov.id && l.city === city.id);

                        return (
                          <div id={`sitemap-city-node-${city.id}`} key={city.id} className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-slate-50/50 transition-all">
                            <div className="flex items-center justify-between" id={`city-node-hdr-${city.id}`}>
                              <div className="flex items-center space-x-2" id={`city-title-row-${city.id}`}>
                                <MapPin className="w-4 h-4 text-emerald-600" id={`city-pin-ico-${city.id}`} />
                                <Link 
                                  href={`/${city.name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/(^-|-$)+/g, '')}`}
                                  className="text-xs sm:text-sm font-extrabold text-slate-850 hover:text-emerald-700 hover:underline transition-all"
                                  id={`city-node-title-${city.id}`}
                                >
                                  {city.name}
                                </Link>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400" id={`city-node-count-${city.id}`}>
                                {cityListings.length} verified corporations
                              </span>
                            </div>
 
                            {/* Suburbs inline flow wrapper */}
                            <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-200/50" id={`city-suburbs-grid-${city.id}`}>
                              {city.suburbs.map(suburb => {
                                const subListingsCount = cityListings.filter(l => l.suburb && l.suburb.toLowerCase() === suburb.toLowerCase()).length;
                                const subSlug = suburb.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/(^-|-$)+/g, '');
                                
                                return (
                                  <Link
                                    id={`sitemap-suburb-tag-${city.id}-${suburb.replace(/[^a-zA-Z0-9]/g, '-')}`}
                                    key={suburb}
                                    href={`/${subSlug}`}
                                    className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-white border border-slate-200/60 rounded-lg hover:border-emerald-500 hover:text-emerald-800 transition-all text-[10.5px] font-mono cursor-pointer"
                                    title={`Explore verified listings in ${suburb}, ${city.name}`}
                                  >
                                    <span className="text-slate-650">{suburb}</span>
                                    {subListingsCount > 0 && (
                                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded-sm font-bold" id={`suburb-badge-${city.id}-${suburb.replace(/[^a-zA-Z0-9]/g, '-')}`}>
                                        +{subListingsCount}
                                      </span>
                                    )}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </main>

      {/* SITEMAP DYNAMIC URL CONFIGURATION LISTINGS ACCORDING TO USER'S INTENT */}
      <section className="bg-white border-t py-12" id="sitemap-config-feed">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6" id="sitemap-feed-inner">
          <div className="space-y-1.5 text-center md:text-left" id="sitemap-feed-header">
            <h3 className="text-lg font-bold tracking-tight text-slate-900" id="feed-heading">Dynamic SEO Slugs Directories</h3>
            <p className="text-slate-500 text-xs sm:text-sm" id="feed-para">Mapped redirect links and organic search channels maintained inside Bizsearch24 server databases.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="sitemap-feed-bento">
            <Link href="/sitemap" className="bg-slate-50 hover:bg-slate-100 border p-4 rounded-2xl flex items-center justify-between transition-all" id="seo-sitemap-strip">
              <div className="space-y-1" id="seo-sitemap-labels">
                <span className="text-xs font-bold text-slate-800">Visual Directory Index</span>
                <p className="text-[10px] text-emerald-700 font-mono">slug: /sitemap</p>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-500" />
            </Link>
            <Link href="/" className="bg-slate-50 hover:bg-slate-100 border p-4 rounded-2xl flex items-center justify-between transition-all" id="seo-home-strip">
              <div className="space-y-1" id="seo-home-labels">
                <span className="text-xs font-bold text-slate-800">Dynamic Finder Directory</span>
                <p className="text-[10px] text-emerald-700 font-mono">slug: /</p>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-500" />
            </Link>

            {/* Custom SEO Landing Pages fetched from Server DB */}
            {seoPageSlugs.map(p => (
              <Link key={p.id} href={`/${p.slug}`} className="bg-slate-50 hover:bg-slate-100 border p-4 rounded-2xl flex items-center justify-between transition-all hover:scale-101 hover:shadow-xs" id={`seo-dynamic-strip-${p.id}`}>
                <div className="space-y-1" id={`seo-dynamic-labels-${p.id}`}>
                  <span className="text-xs font-bold text-slate-800 truncate block max-w-[190px]">{p.title}</span>
                  <p className="text-[10px] text-emerald-700 font-mono">slug: /{p.slug}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-500" />
              </Link>
            ))}

            {/* Verified Business Profile Slugs fetched from SQLite */}
            {listings.map(l => {
              const displaySlug = l.slug || l.name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/(^-|-$)+/g, '');
              return (
                <Link key={l.id} href={`/${displaySlug}`} className="bg-slate-50 hover:bg-slate-100 border p-4 rounded-2xl flex items-center justify-between transition-all hover:scale-101 hover:shadow-xs" id={`seo-listing-strip-${l.id}`}>
                  <div className="space-y-1" id={`seo-listing-labels-${l.id}`}>
                    <span className="text-xs font-bold text-slate-800 truncate block max-w-[190px]">{l.name}</span>
                    <p className="text-[10px] text-emerald-600 font-mono">slug: /{displaySlug}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-500" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER ROW */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-slate-400 text-xs sm:text-sm" id="sitemap-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4" id="sitemap-footer-inner">
          <div className="text-center sm:text-left space-y-1" id="sitemap-footer-copys">
            <span className="text-white text-base font-bold tracking-tight block whitespace-nowrap">
              <span className="text-white font-black text-2xl inline-block mr-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_-1.5px_-1.5px_0_#10b981,_1.5px_-1.5px_0_#10b981,_-1.5px_1.5px_0_#10b981,_1.5px_1.5px_0_#10b981,_0px_-1.5px_0_#10b981,_0px_1.5px_0_#10b981,_-1.5px_0px_0_#10b981,_1.5px_0px_0_#10b981]">B</span>iz<span className="text-emerald-500 font-black text-2xl inline-block mx-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_-1.5px_-1.5px_0_#000,_1.5px_-1.5px_0_#000,_-1.5px_1.5px_0_#000,_1.5px_1.5px_0_#000,_0px_-1.5px_0_#000,_0px_1.5px_0_#000,_-1.5px_0px_0_#000,_1.5px_0px_0_#000]">S</span>earch24
            </span>
            <p className="text-slate-500 text-[11px] leading-relaxed">© 2026 Bizsearch24 South Africa directory maps index. All Rights Reserved.</p>
          </div>
          <div className="flex items-center space-x-4" id="sitemap-footer-links">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors" id="btn-footer-finder">Finder Dashboard</Link>
            <span className="text-slate-700">|</span>
            <span className="text-slate-500 text-[11px]">Johannesburg Engine (GMT+2)</span>
          </div>
        </div>
      </footer>

      {/* THE COMPREHENSIVE LEGAL COMPLIANCE & SAFETY VERIFICATION FLOATING CARD */}
      <AnimatePresence>
        {showLegalModal && (
          <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md w-auto bg-white border border-slate-200 rounded-3xl shadow-[0_15px_50px_-10px_rgba(0,0,0,0.18)] z-[9999] flex flex-col max-h-[85vh] overflow-hidden" id="safety-modal-card">
            
            {/* COMPACT BARS/BANNER HEADER */}
            <div className="bg-slate-900 text-white p-4 flex flex-col shrink-0" id="safety-modal-header">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider font-mono">Safety Notice</span>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-mono leading-none font-bold">POPIA Compliant</span>
                </div>
                {!isLegalExpanded && (
                  <button
                    type="button"
                    onClick={() => setIsLegalExpanded(true)}
                    className="text-emerald-400 hover:text-emerald-350 text-xs font-bold font-mono transition-all flex items-center space-x-1"
                    id="safety-expand-btn-top"
                  >
                    <span>Expand & Read</span>
                    <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                  </button>
                )}
                {isLegalExpanded && (
                  <button
                    type="button"
                    onClick={() => setIsLegalExpanded(false)}
                    className="text-slate-400 hover:text-white text-xs font-bold font-mono transition-all"
                    id="safety-collapse-btn-top"
                  >
                    Collapse
                  </button>
                )}
              </div>
              <h2 className="text-sm font-black tracking-tight mt-1.5" id="safety-modal-headline-text">
                Legal Advisory & Safe Usage Terms
              </h2>
              <p className="text-slate-400 text-[10px] leading-relaxed mt-1 max-w-sm">
                This directory indexes local public business listings. By using this service, you agree to our terms.
              </p>
            </div>

            {/* EXPANDED CONTENT AREA WITH VERTICAL SCROLL (No horizontal tabs!) */}
            <div 
              className={cn(
                "flex-1 overflow-y-auto p-4 text-xs text-slate-700 leading-relaxed transition-all duration-300",
                isLegalExpanded ? "h-80 md:h-[350px] opacity-100" : "h-0 p-0 overflow-hidden opacity-0"
              )} 
              id="safety-modal-body"
            >
              <div className="space-y-5" id="vertical-scroll-container">
                
                {/* 1. USAGE AGREEMENT */}
                <div className="space-y-1.5 border-b pb-3 border-slate-100" id="safety-pane-terms">
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-tight">
                    1. Binding Agreement & Usage Conditions
                  </h3>
                  <p className="text-[11px] text-slate-600 text-justify">
                    Welcome to <strong>bizsearch24.co.za</strong> (&ldquo;BizSearch24&rdquo;). Accessing, browsing, search-indexing, or interacting with our directory services constitutes your absolute and irrevocable agreement to these Terms & Conditions. If you do not agree, you are strictly prohibited from utilizing this platform.
                  </p>
                  <p className="text-[11px] text-slate-600 text-justify">
                    BizSearch24 operates strictly as an open indexed public advertisement directory for regional service providers in South Africa. Automated extraction of directory info, database scraping, API hijacking, or competitive replication is prohibited under criminal liability.
                  </p>
                </div>

                {/* 2. STRICT INDEMNIFICATION & ABSOLUTE ZERO LIABILITY */}
                <div className="space-y-1.5 border-b pb-3 border-slate-100 bg-red-50/50 p-2.5 rounded-xl border-dashed border-red-200" id="safety-pane-liability">
                  <h3 className="font-extrabold text-red-750 text-xs uppercase tracking-tight">
                    2. Absolute Zero Liability & General Indemnity
                  </h3>
                  <p className="text-[10.5px] text-slate-700 font-extrabold text-justify uppercase">
                    BIZSEARCH24.CO.ZA, ITS FOUNDERS, SUB-CONTRACTORS, DIRECTORS, PARTNERS, AND OPERATORS (&ldquo;THE COVERED PARTIES&rdquo;) ACCEPT ABSOLUTELY ZERO RESPONSIBILITY, INDEMNITY, OR LIABILITY FOR ANY COMMERCIAL LOSS, THEFT, INJURY, DEFAULT, CONTRACTUAL BREACH, INTENTIONAL MISREPRESENTATION, FRAUD, SCAM, OR BODILY HARM RESULTING FROM YOUR ENGAGEMENT WITH ANY DIRECTORY PROVIDER.
                  </p>
                  <p className="text-[10.5px] text-slate-605 text-justify">
                    By booking or hiring a listed company, you explicitly waive your legal right to seek any financial damages, claims, or lawsuits against the Covered Parties. All negotiations, quotes, and payment transfers are strictly bilateral transactions outside the scope, tracking, or knowledge of BizSearch24.
                  </p>
                </div>

                {/* 3. VERIFIED VS. UNVERIFIED SECTORS & RISK EXPOSURE */}
                <div className="space-y-1.5 border-b pb-3 border-slate-100" id="safety-pane-verification-policy">
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-tight">
                    3. Unverified Free-tier Postings vs. Verified Spotlights
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    We support two categories of directory listings:
                  </p>
                  <ul className="list-disc leading-normal pl-4 text-[10.5px] text-slate-605 space-y-1">
                    <li>
                      <strong className="text-emerald-700">Verified Premium Listings</strong>: These businesses have paid a directory listing fee and undergo high-level manual admin audit of email/phone contact matching during creation.
                    </li>
                    <li>
                      <strong className="text-red-700 font-extrabold">Unverified Free Postings (High Risk)</strong>: These accounts do not undergo search verification, identity check, commercial registry, or licensing validations.
                    </li>
                  </ul>
                  <p className="text-[11.5px] text-slate-600 text-justify">
                    Unverified listings are subjected to permanent, automated red flashing alerts warning users of <strong className="text-red-700 italic">&ldquo;Not Verified&rdquo;</strong> status at both the upper head and lower base of the business description modal. Users are aggressively cautioned to confirm CIPC registration and withhold upfront deposits on unverified entities.
                  </p>
                </div>

                {/* 4. POPIA COMPLIANCE & PUBLIC RECORD POLICY */}
                <div className="space-y-1.5 border-b pb-3 border-slate-100" id="safety-pane-popia">
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-tight">
                    4. POPIA Compliance & Privacy Act
                  </h3>
                  <p className="text-[11px] text-slate-605 text-justify">
                    We strictly comply with the Protection of Personal Information Act of South Africa (POPIA). BizSearch24 operates under Section 19 regulations representing an index of pre-existing public business registry indexes and general commercial contact numbers.
                  </p>
                  <p className="text-[11px] text-slate-605 text-justify">
                    Any registered franchise, craftsman, or entity listed here retains the absolute right to correct, request immediate unpublishing, or execute a permanent takedown under POPI guidelines. Please contact directory support for instant actioning.
                  </p>
                </div>

                {/* 5. DATA PRIVACY & ANALYTICS COOKIES */}
                <div className="space-y-1.5 border-b pb-3 border-slate-100" id="safety-pane-privacy-cookies">
                  <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-tight">
                    5. Cookie & Anonymous Metrics Policy
                  </h3>
                  <p className="text-[11px] text-slate-605 text-justify">
                    Our platform executes stateless micro-cookies to record geographic location choices (Province, City) and categorical search frequencies. We never track individuals, compile device metrics, or share personal communications.
                  </p>
                </div>

                {/* 6. SCAM WATCH & SAFETY DISCLAIMER (SHOW LAST!) */}
                <div className="space-y-1.5 bg-red-50 border border-red-200 p-3.5 rounded-xl text-red-950" id="safety-pane-agreement">
                  <div className="flex items-center space-x-1 font-extrabold uppercase tracking-wider text-[10.5px]">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-650" />
                    <span>⚠️ MANDATORY SCAM FRAUD MITIGATION POLICY</span>
                  </div>
                  <p className="text-[10.5px] leading-relaxed font-bold text-justify">
                    South African consumers must execute reasonable diligence: NEVER transfer deposits via EFT, eWallet, or dynamic payments without executing a formal service level contract, meeting at a verified physical brick-and-mortar office, and validating tradesmen certifications.
                  </p>
                  <p className="text-[11px] leading-relaxed font-semibold mt-1 text-justify">
                    By clicking &ldquo;OK&rdquo;, you acknowledge that using <strong>bizsearch24.co.za</strong> falls strictly under your own sovereign discretion. You relinquish any and all future actions of legal recourse against the platform and its operators.
                  </p>
                </div>

              </div>
            </div>

            {/* ACTION FOOTER */}
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0" id="safety-modal-footer">
              {!isLegalExpanded ? (
                <button
                  type="button"
                  id="safety-expand-link-bottom"
                  onClick={() => setIsLegalExpanded(true)}
                  className="text-[11px] text-slate-600 hover:text-slate-900 font-bold underline cursor-pointer"
                >
                  Expand to view more for convenience
                </button>
              ) : (
                <span className="text-[10px] text-slate-500 font-medium text-center sm:text-left block leading-normal max-w-[220px]" id="modal-agree-statement">
                  {"By using this website you agree to all these terms and if you don't agree then don't use this website."}
                </span>
              )}
              <button
                id="safety-accept-btn"
                onClick={() => {
                  localStorage.setItem('biz_legal_accepted', 'true');
                  setShowLegalModal(false);
                  setShowConsentBanner(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-99 text-white font-bold rounded-xl text-xs transition-all shadow-lg shrink-0 w-full sm:w-auto text-center cursor-pointer"
              >
                OK
              </button>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* HORIZONTAL CONSENT BANNER */}
      <AnimatePresence>
        {showConsentBanner && (
          <motion.div
            id="legal-consent-banner"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 text-white py-4 px-4 sm:px-6 md:px-8 z-[9999] shadow-[0_-10px_35px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center space-x-3 text-center md:text-left animate-fade-in" id="consent-text-container">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 hidden sm:inline-block" id="consent-alert-ico" />
              <p className="text-xs sm:text-sm text-slate-300 font-semibold leading-relaxed" id="consent-message-text">
                {"By using this site you agree to this website's terms. If you don't agree, then don't use this website."}
              </p>
            </div>
            <div className="flex items-center space-x-4 shrink-0 w-full md:w-auto justify-center md:justify-end" id="consent-actions font-sans">
              <button
                id="btn-consent-read"
                type="button"
                onClick={() => {
                  setShowLegalModal(true);
                  setIsLegalExpanded(true);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold underline transition-all bg-transparent border-0 cursor-pointer"
              >
                Open & Read Terms
              </button>
              <button
                id="btn-consent-ok"
                type="button"
                onClick={() => {
                  localStorage.setItem('biz_legal_accepted', 'true');
                  setShowConsentBanner(false);
                }}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold rounded-xl text-xs transition-all cursor-pointer shadow-lg w-24 text-center"
              >
                OK
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
