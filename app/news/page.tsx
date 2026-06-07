'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  FileText, 
  Megaphone, 
  RefreshCw, 
  Search, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle,
  Share2
} from 'lucide-react';
import { NewsArticle, BizAd } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function NewsPage() {
  const [articles, setArticles] = React.useState<NewsArticle[]>([]);
  const [ads, setAds] = React.useState<BizAd[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedArticle, setSelectedArticle] = React.useState<NewsArticle | null>(null);
  const [lastFetchedAt, setLastFetchedAt] = React.useState<string>('');
  
  // Administrative states
  const [isAdmin, setIsAdmin] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return !!localStorage.getItem('biz_admin_token');
      } catch (e) {
        return false;
      }
    }
    return false;
  });
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [refreshSuccess, setRefreshSuccess] = React.useState<string>('');

  const fetchNewsFeed = React.useCallback(async (forceAdmin = false) => {
    setLoading(true);
    setError('');
    setRefreshSuccess('');
    
    try {
      let url = '/api/news';
      const headers: HeadersInit = {};
      
      if (forceAdmin) {
        url += '?force=true';
        const token = localStorage.getItem('biz_admin_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const res = await fetch(url, { headers });
      const data = await res.json();
      
      if (data.success) {
        setArticles(data.articles || []);
        setAds(data.ads || []);
        if (data.lastFetchedAt) {
          setLastFetchedAt(data.lastFetchedAt);
        }
        if (forceAdmin) {
          setRefreshSuccess('Successfully pulled and summarized South African news updates in real-time!');
          setTimeout(() => setRefreshSuccess(''), 5000);
        }
      } else {
        setError(data.message || 'Failed to load daily news feed.');
      }
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError('A network error occurred while reaching the news server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    // Load news feed
    const timer = setTimeout(() => {
      fetchNewsFeed();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchNewsFeed]);

  const handleForceNewsFetch = () => {
    setRefreshing(true);
    fetchNewsFeed(true);
  };

  // Client-side search filters
  const filteredArticles = articles.filter(art => {
    const q = searchQuery.toLowerCase();
    return (
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.sourceName.toLowerCase().includes(q)
    );
  });

  const handleShare = (article: NewsArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        navigator.share({
          title: article.title,
          text: `Read summarized article on BizSearch24: ${article.title}`,
          url: window.location.href
        });
      } else {
        navigator.clipboard.writeText(`${article.title} - Source: ${article.sourceName}. Summarized on BizSearch24 News.`);
        alert('Article quote details copied to clipboard!');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans" id="news-portal-container">
      
      {/* GLAM HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs" id="news-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 cursor-pointer" id="news-logo-block">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20" id="news-logo-icon">
              <FileText className="w-5 h-5 text-white" id="news-logo-desc" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight whitespace-nowrap" id="news-logo-title">
                <span className="text-white font-black text-2xl inline-block mr-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_-1.5px_-1.5px_0_#10b981,_1.5px_-1.5px_0_#10b981,_-1.5px_1.5px_0_#10b981,_1.5px_1.5px_0_#10b981,_0px_-1.5px_0_#10b981,_0px_1.5px_0_#10b981,_-1.5px_0px_0_#10b981,_1.5px_0px_0_#10b981]">B</span>iz<span className="text-emerald-500 font-black text-2xl inline-block mx-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_-1.5px_-1.5px_0_#000,_1.5px_-1.5px_0_#000,_-1.5px_1.5px_0_#000,_1.5px_1.5px_0_#000,_0px_-1.5px_0_#000,_0px_1.5px_0_#000,_-1.5px_0px_0_#000,_1.5px_0px_0_#000]">S</span>earch24
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-slate-400 -mt-0.5" id="news-logo-sub">NEWS DESK</span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-emerald-600 flex items-center space-x-1 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-all"
              id="back-to-directory"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </Link>
          </div>
        </div>
      </header>

      {/* PORTAL MAIN AREA */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" id="news-portal-main">
        
        {/* HERO TITLE GRID */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 mb-8 border border-slate-800 shadow-xl overflow-hidden relative" id="news-hero-banner">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl -z-1" />
          <div className="max-w-3xl space-y-4" id="news-hero-content">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold font-mono tracking-wider px-2.5 py-0.5 rounded-full uppercase" id="badge-hourly-uptime">
                Updated Hourly
              </span>
              <span className="bg-slate-800 text-slate-300 text-[10px] font-bold font-mono tracking-wider px-2.5 py-0.5 rounded-full uppercase" id="badge-news-source">
                Source: Google News
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight" id="news-headline-hero">
              South Africa National News Feed &amp; Summaries
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed" id="news-headline-p">
              Stay ahead with real-time news across South Africa parsed every hour. Top news articles are automatically summarized in engaging journalistic copy, matching local search trends, and backed by Google News publications.
            </p>

            {lastFetchedAt && (
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-mono pt-2" id="timestamp-fetch-box">
                <Clock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Last Updated: {new Date(lastFetchedAt).toLocaleString('en-ZA')}</span>
              </div>
            )}
          </div>

          {/* ADMIN SPEED OVERRIDE CONTROLS */}
          {isAdmin && (
            <div className="mt-6 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" id="admin-news-panel">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-emerald-400 block">S.A. Partners Desk Credentials Loaded</span>
                <p className="text-[11px] text-slate-400">As directory administrator, you can override the hourly cache and fetch fresh South African news directly from Google News results.</p>
              </div>
              <button
                id="admin-btn-sync-news"
                disabled={refreshing}
                onClick={handleForceNewsFetch}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all shadow-md shadow-emerald-600/20 max-sm:w-full justify-center shrink-0"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
                <span>{refreshing ? 'Fetching Live News...' : 'Force Sync News'}</span>
              </button>
            </div>
          )}

          {refreshSuccess && (
            <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl flex items-center space-x-2" id="refresh-success-banner">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{refreshSuccess}</span>
            </div>
          )}
        </div>

        {/* FEED SEARCH & CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8" id="search-filter-belt">
          <div className="relative w-full md:max-w-md" id="search-bar-wrap">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" id="search-input-mag" />
            <input
              id="search-input-news"
              type="text"
              placeholder="Search news articles, topics or sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 outline-none transition-all shadow-xs"
            />
          </div>

          <div className="flex items-center space-x-2 text-slate-500 font-mono text-[11px]" id="current-article-counter">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Showing <strong className="text-slate-800">{filteredArticles.length}</strong> summarized stories</span>
          </div>
        </div>

        {/* ERROR BOUNDARY DISPLAY */}
        {error && (
          <div className="bg-red-550/10 border border-red-200 text-red-700 text-sm p-4 rounded-xl mb-8 flex items-start space-x-3" id="error-boundaries-banner">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-650" />
            <div>
              <p className="font-semibold">Unable to fetch live news feed</p>
              <p className="text-xs opacity-90">{error}</p>
            </div>
          </div>
        )}

        {/* LAYOUT GRID: ARTICLES (LEFT) + SIDEBAR ADS (RIGHT) */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="skeleton-box">
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 animate-pulse">
                  <div className="h-4 bg-slate-200 w-1/3 rounded-md" />
                  <div className="h-6 bg-slate-200 w-3/4 rounded-md" />
                  <div className="h-20 bg-slate-200 w-full rounded-md" />
                  <div className="h-4 bg-slate-200 w-1/4 rounded-md" />
                </div>
              ))}
            </div>
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-5 h-80 animate-pulse" />
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4" id="empty-results-box">
            <Search className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-lg">No news found matching your query</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn&apos;t locate any summarized South African news updates regarding &quot;{searchQuery}&quot;. Try revising your search query key terms!
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg transition-all"
              id="clear-btn-empty"
            >
              Clear Search filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="news-grid-columns">
            
            {/* ARTICLES FEED STREAM (LEFT) - 8 COLS */}
            <div className="lg:col-span-8 space-y-8" id="left-news-stream">
              
              {/* ITERATIVE MIXED INLINE NEWS AND IN-BETWEEN AD PLACEMENT */}
              {(() => {
                const elements: React.ReactNode[] = [];
                
                filteredArticles.forEach((article, index) => {
                  elements.push(
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.2) }}
                      className="group bg-white border border-slate-200 hover:border-slate-350 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 grid grid-cols-1 md:grid-cols-12 cursor-pointer"
                      onClick={() => setSelectedArticle(article)}
                      id={`article-node-${article.id}`}
                    >
                      {/* Image cover preview */}
                      <div className="md:col-span-4 relative h-48 md:h-full min-h-[160px] bg-slate-100 overflow-hidden" id={`art-cover-box-${article.id}`}>
                        <img 
                          src={article.imageUrl} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          id={`art-thumb-img-${article.id}`}
                        />
                        <div className="absolute top-3 left-3 bg-slate-905/75 backdrop-blur-md text-[9px] font-bold font-mono tracking-wider text-white px-2 py-0.5 rounded-md flex items-center space-x-1" id={`p-stamp-box-${article.id}`}>
                          <Clock className="w-2.5 h-2.5 text-emerald-450" />
                          <span>{new Date(article.publishedAt).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>

                      {/* Content panel */}
                      <div className="md:col-span-8 p-5 sm:p-6 flex flex-col justify-between space-y-4" id={`art-meta-box-${article.id}`}>
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold font-mono text-emerald-600 block uppercase tracking-wider" id={`art-source-label-${article.id}`}>
                            {article.sourceName}
                          </span>
                          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug" id={`art-title-content-${article.id}`}>
                            {article.title}
                          </h2>
                          <p className="text-[11.5px] text-slate-500 leading-relaxed line-clamp-3" id={`art-desc-content-${article.id}`}>
                            {article.summary.split('\n\n')[0]}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100" id={`art-action-bar-${article.id}`}>
                          <span 
                            className="text-slate-800 text-xs font-semibold group-hover:text-emerald-700 flex items-center space-x-1"
                            id={`read-article-action-${article.id}`}
                          >
                            <span>Read Summarized Story</span>
                            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                          </span>

                          <button
                            id={`share-btn-nodes-${article.id}`}
                            onClick={(e) => handleShare(article, e)}
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-colors"
                            title="Share article or Copy Quote"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );

                  // IN-BETWEEN AD PLACEMENT: Inject an active advertising banner after every 3 articles (index + 1 % 3 === 0)
                  if ((index + 1) % 3 === 0) {
                    let injectedAd: BizAd | null = null;
                    if (ads.length > 0) {
                      const adIndex = Math.floor(index / 3) % ads.length;
                      injectedAd = ads[adIndex];
                    }

                    elements.push(
                      <motion.div
                        key={`inline-ad-holder-${index}`}
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-emerald-50/50 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                        id={`ad-box-stream-${index}`}
                      >
                        {injectedAd ? (
                          <>
                            <div className="flex items-start space-x-4 max-sm:flex-col max-sm:items-center max-sm:text-center" id={`ad-details-wrap-${index}`}>
                              <img 
                                src={injectedAd.imageUrl} 
                                alt={injectedAd.title}
                                className="w-20 h-20 rounded-xl object-cover border border-emerald-500/10 shadow-xs shrink-0 bg-white"
                                id={`ad-img-avatar-${index}`}
                              />
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-center space-x-1.5 flex-wrap justify-center sm:justify-start">
                                  <span className="bg-emerald-650/10 text-emerald-800 text-[8px] font-black font-mono uppercase tracking-widest px-2 py-0.5 rounded-md" id={`sponsored-lbl-${index}`}>
                                    {injectedAd.badge && injectedAd.badge !== 'standard' ? injectedAd.badge.replace('-', ' ') : 'Sponsored Partner'}
                                  </span>
                                  {injectedAd.alwaysOnTop && (
                                    <span className="bg-amber-100 text-amber-800 text-[7px] font-bold font-mono uppercase tracking-wider px-1.5 py-0.5 rounded">
                                      ALWAYS ON TOP
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight" id={`sponsored-title-${index}`}>{injectedAd.title}</h3>
                                <p className="text-[11px] text-slate-500 leading-relaxed" id={`sponsored-caption-${index}`}>
                                  {injectedAd.description || 'Promoted business listing on BizSearch24. Click to consult deals, operating hours, and location reviews.'}
                                </p>
                              </div>
                            </div>
                            
                            <a
                              id={`partner-ad-anchor-${index}`}
                              href={injectedAd.targetUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/10 text-center shrink-0 max-sm:w-full flex items-center justify-center space-x-1.5"
                            >
                              <span>Explore Business</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </>
                        ) : (
                          // Default gorgeous community directory ad hook if no sponsor campaigns are registered yet
                          <>
                            <div className="flex items-center space-x-3.5 max-sm:flex-col max-sm:text-center" id={`default-ad-cap-${index}`}>
                              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/25 shrink-0" id={`def-ad-ico-${index}`}>
                                <Megaphone className="w-5 h-5 text-white animate-bounce-slow" />
                              </div>
                              <div className="space-y-1">
                                <h3 className="font-extrabold text-slate-850 text-xs sm:text-sm" id={`def-ad-header-${index}`}>Advertise Here on BizSearch24 News</h3>
                                <p className="text-[11px] text-slate-500" id={`def-ad-p-${index}`}>Reach thousands of regional South African readers in Johannesburg, Cape Town, and Durban daily.</p>
                              </div>
                            </div>

                            <Link
                              id={`register-ad-link-${index}`}
                              href="/#submit"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/10 text-center shrink-0 max-sm:w-full"
                            >
                              List Your Business Now
                            </Link>
                          </>
                        )}
                      </motion.div>
                    );
                  }
                });

                return elements;
              })()}
            </div>

            {/* SIDEBAR RIGHT CONTAINER (RIGHT) - 4 COLS */}
            <aside className="lg:col-span-4 space-y-6" id="right-news-sidebar">
              
              {/* WEATHER & REGIONAL ACCENT */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4" id="weather-regional-widget">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3" id="weather-widget-h">
                  <h3 className="font-extrabold text-xs text-slate-800 font-mono tracking-wider uppercase">Region Profile</h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Country Targeted:</span>
                    <span className="font-semibold text-slate-800">South Africa (ZA)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Target Cities:</span>
                    <span className="font-semibold text-slate-800">Johannesburg, Cape Town, Durban...</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Index Status:</span>
                    <span className="text-emerald-600 font-mono font-bold">100% Live Sync</span>
                  </div>
                </div>
              </div>

              {/* STICKY ADVERTISEMENT BANNER (RIGHT SIDEBAR) */}
              <div className="sticky top-20 space-y-6" id="sticky-sidebar-ads-parent">
                
                {ads.length > 0 ? (
                  ads.map((ad, adIndex) => (
                    <div 
                      key={`sidebar-ad-${ad.id}-${adIndex}`} 
                      className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs hover:shadow-md transition-all border-l-4 border-l-emerald-500"
                      id={`sidebar-ad-card-${ad.id}`}
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3" id={`sidebar-ad-h-${ad.id}`}>
                        <span className="text-[9px] font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">
                          {ad.badge && ad.badge !== 'standard' ? ad.badge.replace('-', ' ') : 'Premium Partner'}
                        </span>
                        <div className="flex items-center space-x-1">
                          {ad.alwaysOnTop && (
                            <span className="text-[8px] bg-amber-100 text-amber-800 px-1 rounded font-bold font-mono">TOP</span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">AD</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3" id={`sidebar-ad-body-${ad.id}`}>
                        <img 
                          src={ad.imageUrl} 
                          alt={ad.title}
                          className="w-full h-32 object-cover rounded-xl border border-slate-105"
                          id={`sidebar-ad-img-${ad.id}`}
                        />
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 leading-tight" id={`sidebar-ad-title-${ad.id}`}>{ad.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed" id={`sidebar-ad-desc-${ad.id}`}>
                          {ad.description || `Listed under ${ad.placement === 'all' ? 'All Areas' : ad.province || ad.city || 'Regional South Africa'}. Click to look up directions, services, and business reviews.`}
                        </p>
                      </div>

                      <a 
                        id={`sidebar-ad-action-btn-${ad.id}`}
                        href={ad.targetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full bg-slate-900 text-white text-center py-2.5 rounded-xl font-semibold text-xs hover:bg-slate-800 transition-colors"
                      >
                        Visit Partner Portal
                      </a>
                    </div>
                  ))
                ) : (
                  // Elegant placeholders
                  <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 border border-slate-850 relative overflow-hidden" id="sticky-register-campaign-banner">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
                    <div className="space-y-2">
                      <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-bold font-mono uppercase tracking-widest px-2 py-0.5 rounded" id="partner-program-tag">Partner Program</span>
                      <h4 className="font-extrabold text-sm text-white leading-tight" id="partner-program-title">Get Seen on South Africa News Pages</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed" id="partner-program-p">Place your target ads inside categorized articles and in-between news listing blocks to capture highly converting South African business leads.</p>
                    </div>
                    <Link
                      id="sidebar-lead-btn"
                      href="/#submit"
                      className="block w-full bg-emerald-600 hover:bg-emerald-500 text-white text-center py-2.5 rounded-xl font-bold text-xs transition-colors shadow-lg shadow-emerald-600/10"
                    >
                      Grow Your Business Traffic
                    </Link>
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>

      {/* IMMERSIVE NEWS MODAL EXPANSIONS (SUPPORTING IN-ARTICLE AD INJECTIONS) */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 overflow-y-auto" id="article-glass-modal-panel">
            {/* Dark glass backdrop backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              id="backdrop-overlay-art"
            />
            
            {/* Modal Body */}
            <div className="flex min-h-screen items-center justify-center p-4 sm:p-6" id="modal-content-positioner">
              <motion.div 
                id="modal-article-container"
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 z-10"
              >
                
                {/* Close Button top-right */}
                <button
                  id="modal-close-cross-btn"
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 z-20 bg-slate-900/60 hover:bg-slate-900/80 text-white p-2 rounded-full backdrop-blur-md transition-all shadow"
                >
                  <span className="text-sm font-bold block px-1.5 py-0.5">✕</span>
                </button>

                {/* Hero Feature photo */}
                <div className="h-64 sm:h-80 w-full relative bg-slate-150" id="modal-cover-img-box">
                  <img 
                    src={selectedArticle.imageUrl} 
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                    id="modal-cover-photo"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2" id="modal-hero-title-overlay">
                    <span className="bg-emerald-600 text-white text-[9px] font-bold font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-md" id="modal-source-p-lbl">
                      {selectedArticle.sourceName}
                    </span>
                    <h2 className="text-lg sm:text-2xl font-black leading-tight text-white m-0" id="modal-hero-title-val">{selectedArticle.title}</h2>
                  </div>
                </div>

                {/* Scrollable text container */}
                <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[60vh] text-slate-700 leading-relaxed text-sm sm:text-base pr-4" id="modal-article-paragraphs-flow">
                  
                  {/* META METRICS */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 border-b border-slate-100 pb-4" id="modal-meta-box">
                    <div className="flex items-center space-x-1" id="m-metric-1">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span>{new Date(selectedArticle.publishedAt).toLocaleString('en-ZA')}</span>
                    </div>
                    <div className="flex items-center space-x-1" id="m-metric-2">
                      <CheckCircle className="w-4 h-4 text-emerald-505" />
                      <span>Summarized by BizSearch24 AI</span>
                    </div>
                  </div>

                  {/* PARAGRAPH INJECTIONS AND MIDDLE SPONSORED BANNER BLOCK */}
                  {(() => {
                    // Split paragraphs by standard double newline
                    const paragraphs = selectedArticle.summary.split('\n\n');
                    const elements: React.ReactNode[] = [];
                    
                    paragraphs.forEach((p, pIdx) => {
                      if (p.trim() === '') return;
                      elements.push(
                        <p key={`p-${pIdx}`} className="text-slate-650 leading-relaxed text-sm sm:text-base text-justify" id={`modal-p-${pIdx}`}>
                          {p}
                        </p>
                      );
                      
                      // IN-ARTICLE AD INJECTION: Inject a banner partner ad after the FIRST paragraph!
                      if (pIdx === 0) {
                        let innerAd: BizAd | null = null;
                        if (ads.length > 0) {
                          // Select the first active ad, or rotate based on article index or random
                          innerAd = ads[0]; 
                        }

                        elements.push(
                          <div 
                            key="in-article-ad" 
                            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 my-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-emerald-600"
                            id="modal-ad-injected-wrapper"
                          >
                            {innerAd ? (
                              <>
                                <div className="space-y-1" id="modal-ad-caps">
                                  <span className="text-[8px] font-bold font-mono uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded" id="modal-sponsored-badge">Sponsored Advertisement</span>
                                  <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight pt-1" id="modal-sponsored-title">{innerAd.title}</h4>
                                  <p className="text-[10px] text-slate-500" id="modal-sponsored-caption">Click to consult our verified business deals in your locality.</p>
                                </div>
                                <a
                                  id="modal-ad-click-lnk"
                                  href={innerAd.targetUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="bg-emerald-600 hover:bg-emerald-750 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/10 shrink-0 text-center max-sm:w-full flex items-center justify-center space-x-1.5"
                                >
                                  <span>Verify Details</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </>
                            ) : (
                              // Default inside-article call to action
                              <>
                                <div className="space-y-1" id="modal-ad-caps-default">
                                  <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm" id="modal-def-title">Add Your Business to this Directory</h4>
                                  <p className="text-[10px] text-slate-500" id="modal-def-desc">Gain maximum regional outreach inside trending news articles daily.</p>
                                </div>
                                <Link
                                  id="modal-def-click-lnk"
                                  href="/#submit"
                                  className="bg-emerald-600 hover:bg-emerald-750 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shrink-0 text-center max-sm:w-full"
                                >
                                  Register My Business
                                </Link>
                              </>
                            )}
                          </div>
                        );
                      }
                    });
                    
                    return elements;
                  })()}

                  {/* SOURCE REDIRECT & FOOTER LINK */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 text-xs text-slate-500 font-medium" id="modal-article-footer">
                    <span id="modal-source-reference">
                      Original Publication Source: <strong className="text-slate-700 font-bold">{selectedArticle.sourceName}</strong>
                    </span>
                    
                    <a
                      id="modal-btn-external-link"
                      href={selectedArticle.sourceUrl}
                      target="_blank"
                      rel="noreopener noreferrer"
                      className="inline-flex items-center space-x-1.5 text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      <span>Read Original Source on Google News</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* MODAL ACTION BAR */}
                <div className="bg-slate-50 px-6 sm:px-8 py-4 flex items-center justify-between border-t border-slate-205" id="modal-bottom-bar shadow-inner">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">BizSearch24 S.A. News System</span>
                  <button
                    id="modal-dismiss-footer-btn"
                    onClick={() => setSelectedArticle(null)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-750 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                  >
                    Close Article
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-850 py-12 text-slate-400 mt-16 text-xs sm:text-sm" id="news-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8" id="news-footer-layout">
          <div className="space-y-4 md:col-span-2" id="news-footer-brand-col">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer" id="news-footer-logo-block">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0" id="news-footer-logo-icon">
                <FileText className="w-5 h-5 text-white" id="news-footer-logo-search" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block leading-tight" id="news-footer-logo-title">
                  <span className="text-white font-black text-2xl inline-block mr-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_1.5px_1.5px_0_#10b981,_-1.5px_-1.5px_0_#10b981,_1.5px_-1.5px_0_#10b981,_-1.5px_1.5px_0_#10b981]">B</span>iz<span className="text-emerald-500 font-black text-2xl inline-block mx-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_1.5px_1.5px_0_#000,_-1.5px_-1.5px_0_#000,_1.5px_-1.5px_0_#000,_-1.5px_1.5px_0_#000]">S</span>earch24
                </span>
                <span className="block text-[10px] font-mono tracking-widest text-slate-400 -mt-0.5" id="news-footer-logo-sub">NEWS DESK</span>
              </div>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm pt-2" id="news-footer-logo-desc">
              Summarizing the leading local news daily from Google News and coupling announcements with verified South African enterprise listings on Bizsearch24 SA.
            </p>
          </div>

          <div className="space-y-3" id="news-footer-quicklinks-col">
            <span className="text-white font-semibold block uppercase tracking-wider text-xs" id="news-footer-quicklinks-lbl">Explore Site</span>
            <ul className="space-y-2 text-xs" id="news-footer-quick-links">
              <li>
                <Link href="/" className="hover:text-white transition-colors" id="lnk-foot-news-dir">
                  Business Directory
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="hover:text-white transition-colors" id="lnk-foot-news-map">
                  Visual Sitemap
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3" id="news-footer-disclaimer-col">
            <span className="text-white font-semibold block uppercase tracking-wider text-xs" id="news-footer-disclaimer-lbl">Content Disclaimer</span>
            <p className="text-[10px] leading-relaxed text-slate-500" id="news-footer-disclaimer-text">
              News synopses compiled here are automatically generated hourly using Google News search structures with grounding parameters. BizSearch24 does not claim intellectual property rights to reference titles. All rights belong to original publishers.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
