import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { readDb } from '@/lib/serverDb';
import { PROVINCES, CITIES_AND_TOWNS } from '@/lib/saData';
import { MapPin, Phone, Mail, Globe, Calendar, Eye, ShieldCheck, ChevronLeft, CalendarDays } from 'lucide-react';

// Standard simple Markdown renderer to avoid third-party hydration layout shifts
function renderSimpleMarkdown(md: string) {
  if (!md) return null;
  return md.split('\n').map((line, idx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={idx} className="text-2xl sm:text-3xl font-black mt-6 mb-4 text-slate-900 border-b border-slate-100 pb-2">
          {trimmed.slice(2)}
        </h1>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={idx} className="text-xl sm:text-2xl font-extrabold mt-5 mb-3 text-slate-800">
          {trimmed.slice(3)}
        </h2>
      );
    }
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="text-lg font-bold mt-4 mb-2 text-slate-800">
          {trimmed.slice(4)}
        </h3>
      );
    }
    if (trimmed.startsWith('- ')) {
      return (
        <li key={idx} className="list-disc ml-6 my-1.5 text-slate-600 text-sm">
          {trimmed.slice(2)}
        </li>
      );
    }
    if (trimmed.startsWith('1. ') || trimmed.match(/^\d+\.\s/)) {
      return (
        <li key={idx} className="list-decimal ml-6 my-1.5 text-slate-600 text-sm">
          {trimmed.replace(/^\d+\.\s/, '')}
        </li>
      );
    }
    if (trimmed === '') {
      return <div key={idx} className="h-3" />;
    }
    return (
      <p key={idx} className="text-slate-600 leading-relaxed my-2.5 text-sm sm:text-base">
        {trimmed}
      </p>
    );
  });
}

// Next.js App Router dynamic Metadata generator
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();

  // 1. Check Dynamic SEO Pages from JSON database
  try {
    const dbData = readDb();
    const dynamicPage = dbData.pages?.find(p => p.slug.toLowerCase() === decodedSlug);
    if (dynamicPage) {
      return {
        title: `${dynamicPage.title} | Bizsearch24 South Africa`,
        description: dynamicPage.metaDescription || `${dynamicPage.title} - Mapped regional business directories on Bizsearch24 South Africa.`,
        keywords: dynamicPage.keywords || `${dynamicPage.title}, business directory, South Africa, local trades`,
        other: {
          'geo.region': dynamicPage.geoRegion || 'ZA',
          'geo.placename': dynamicPage.geoPlacename || 'South Africa',
          'geo.position': dynamicPage.geoPosition || '-30;25',
          'ICBM': dynamicPage.geoPosition || '-30, 25',
        }
      };
    }
  } catch (err) {
    console.error('Error generating metadata for dynamic page:', err);
  }

  // 2. Check Database listings
  try {
    const listings = await prisma.listing.findMany({});
    const listing = listings.find(l => {
      const generatedSlug = l.businessName.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/(^-|-$)+/g, '');
      return generatedSlug === decodedSlug;
    });

    if (listing) {
      const provinceName = PROVINCES.find(p => p.id === listing.province)?.name || listing.province;
      const cityName = CITIES_AND_TOWNS.find(c => c.id === listing.city)?.name || listing.city;
      const geoLocName = `${listing.suburb ? listing.suburb + ', ' : ''}${cityName}, ${provinceName}`;
      
      return {
        title: `${listing.businessName} | Verified Listings Directory`,
        description: listing.description ? listing.description.slice(0, 155) + '...' : `Explore verified company listing ${listing.businessName} located in ${geoLocName}. Get contact details, reviews, and address maps.`,
        keywords: listing.keywords || `${listing.businessName}, ${cityName}, verified listing, trades`,
        other: {
          'geo.region': `ZA-${listing.province.slice(0, 2).toUpperCase()}`,
          'geo.placename': geoLocName,
          'geo.position': '-26.107;28.056', // default Johannesburg grid
          'ICBM': '-26.107, 28.056',
        }
      };
    }
  } catch (err) {
    console.error('Error generating listing metadata:', err);
  }

  return {
    title: 'Bizsearch24 | Verified Business Directories',
    description: 'Bizsearch24 directory of verified regional business providers, trades, and medical specialists across South Africa.'
  };
}

export default async function SlugDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).toLowerCase();

  // 1. Load data
  let matchedPage = null;
  let matchedListing = null;

  try {
    const dbData = readDb();
    matchedPage = dbData.pages?.find(p => p.slug.toLowerCase() === decodedSlug) || null;
  } catch (err) {
    console.error('Failed to load JSON pages:', err);
  }

  try {
    const listings = await prisma.listing.findMany({
      include: { images: true }
    });
    
    matchedListing = listings.find(l => {
      const generatedSlug = l.businessName.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/(^-|-$)+/g, '');
      return generatedSlug === decodedSlug;
    }) || null;
  } catch (err) {
    console.error('Failed to load SQLite listings:', err);
  }

  // If nothing matched, throw NextJS notFound
  if (!matchedPage && !matchedListing) {
    notFound();
  }

  // ==========================================
  // VIEW RENDER FOR DYNAMIC SEO LANDING PAGE
  // ==========================================
  if (matchedPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="dynamic-seo-page-root">
        {/* Transparent Header Navigation Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40" id="dynamic-header">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between" id="dynamic-header-inner">
            <Link href="/" className="inline-flex items-center space-x-1 py-1.5 text-slate-600 hover:text-slate-900 transition-colors" id="dynamic-back-nav">
              <ChevronLeft className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold font-mono">BACK TO FINDER</span>
            </Link>
            <Link href="/" className="font-extrabold text-lg text-slate-950" id="dynamic-logo">
              Biz<span className="text-emerald-500 font-black">s</span>earch24
            </Link>
          </div>
        </header>

        <main className="flex-grow max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8" id="dynamic-seo-main-layout">
          {/* SEO Content Card */}
          <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6" id="seo-content-article">
            <div className="border-b border-slate-100 pb-5 space-y-2" id="seo-title-wrapper">
              <div className="flex items-center space-x-2 text-emerald-700 text-xs font-mono font-bold uppercase tracking-wider" id="seo-meta-indicator">
                <span>Verified Organic Portal</span>
                <span>•</span>
                <span>South Africa</span>
              </div>
              <h1 className="text-2xl sm:text-4.5xl font-black text-slate-900 tracking-tight leading-tight" id="seo-dynamic-primary-title">
                {matchedPage.title}
              </h1>
              {matchedPage.createdAt && (
                <div className="flex items-center text-slate-400 text-xs space-x-1 font-mono pt-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Mapped On: {new Date(matchedPage.createdAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Render simple markdown content */}
            <div className="prose max-w-none text-slate-700 leading-relaxed font-sans" id="seo-content-markdown-body">
              {renderSimpleMarkdown(matchedPage.content)}
            </div>

            {/* GEO MAPPING METRIC BADGES (FOR BROWSER PARSERS / SEARCH BOTS) */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 sm:p-5 space-y-3 pt-4 text-xs font-mono text-slate-500" id="geo-metadata-board">
              <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 border-b pb-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Search Discoverability Meta Coordinates</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                <div className="flex justify-between border-b border-slate-100 pb-1 sm:border-0 sm:pb-0">
                  <span className="font-bold text-slate-400">GEO REGION:</span>
                  <span className="text-slate-800 font-semibold">{matchedPage.geoRegion || 'ZA'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1 sm:border-0 sm:pb-0">
                  <span className="font-bold text-slate-400">GEO PLACENAME:</span>
                  <span className="text-slate-800 font-semibold">{matchedPage.geoPlacename || 'Gauteng, SA'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1 sm:border-0 sm:pb-0">
                  <span className="font-bold text-slate-400">POSITION MATRIX:</span>
                  <span className="text-slate-800 font-semibold">{matchedPage.geoPosition || '-26.107, 28.056'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-400">KEYWORDS COMPILED:</span>
                  <span className="text-slate-800 font-semibold truncate max-w-[200px]" title={matchedPage.keywords || 'None'}>
                    {matchedPage.keywords || 'business info'}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </main>

        <footer className="bg-slate-900 border-t border-slate-800 py-8 text-slate-400 text-xs" id="dynamic-footer">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4" id="dynamic-footer-inner">
            <span className="font-extrabold text-white text-md">
              Biz<span className="text-emerald-400 font-black">s</span>earch24
            </span>
            <p className="text-slate-500 text-[10.5px]">© 2026 Bizsearch24. Fully indexed for Chrome, Safari, Firefox, Google Search, and AI crawlers.</p>
          </div>
        </footer>
      </div>
    );
  }

  if (!matchedListing) {
    notFound();
  }

  // ==========================================
  // VIEW RENDER FOR BUSINESS LISTING DETAILS
  // ==========================================
  const imageSrc = matchedListing.images?.[0]
    ? `data:${matchedListing.images[0].mimeType};base64,${Buffer.from(matchedListing.images[0].imageData).toString('base64')}`
    : 'https://picsum.photos/seed/business/800/600';

  const provinceName = PROVINCES.find(p => p.id === matchedListing.province)?.name || matchedListing.province;
  const cityName = CITIES_AND_TOWNS.find(c => c.id === matchedListing.city)?.name || matchedListing.city;

  // JSON-LD Microdata schema for search engines (Schema.org LocalBusiness)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': matchedListing.businessName,
    'description': matchedListing.description,
    'telephone': matchedListing.contactPhone || '',
    'email': matchedListing.contactEmail || '',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': matchedListing.suburb || cityName,
      'addressLocality': cityName,
      'addressRegion': provinceName,
      'addressCountry': 'ZA'
    },
    'url': matchedListing.websiteUrl || 'https://bizsearch24.co.za',
    'image': imageSrc
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="listing-detail-page-root">
      {/* Insert JSON-LD Microdata for AI, Google Spider and Chrome parsing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navigation header banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40" id="listing-detail-header">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between" id="listing-detail-header-inner">
          <Link href="/" className="inline-flex items-center space-x-1.5 py-1.5 text-slate-600 hover:text-slate-900 transition-colors" id="listing-back-nav">
            <ChevronLeft className="w-5 h-5 text-emerald-650" />
            <span className="text-xs font-bold font-mono">BACK TO FINDER</span>
          </Link>
          <Link href="/" className="font-extrabold text-xl text-slate-950" id="listing-logo">
            Biz<span className="text-emerald-500 font-black">s</span>earch24
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8" id="listing-detail-main">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="listing-detail-grid">
          {/* Main Business Core Details - Left Column */}
          <div className="lg:col-span-2 space-y-6" id="listing-main-column">
            <article className="bg-white border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6" id="listing-card-body">
              {/* Image banner */}
              <div className="relative w-full h-[240px] sm:h-[350px] bg-slate-100 rounded-2xl overflow-hidden shadow-inner border border-slate-100" id="listing-image-container">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={matchedListing.businessName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-emerald-600 text-white font-mono text-[9px] sm:text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-wider shadow-sm flex items-center space-x-1" id="listing-approved-badge">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>VERIFIED CO.</span>
                </div>
              </div>

              {/* Business Titles */}
              <div className="space-y-2 border-b pb-5" id="listing-titles-sect">
                <span className="inline-flex bg-slate-100 text-slate-700 border border-slate-200/50 rounded-lg px-2.5 py-1 text-[11px] font-mono leading-none tracking-wide" id="listing-category-label">
                  {matchedListing.category.toUpperCase()} DIRECTORY INDEX
                </span>
                <h1 className="text-2xl sm:text-3.5xl font-black text-slate-900 tracking-tight leading-tight pt-1" id="listing-primary-name">
                  {matchedListing.businessName}
                </h1>
                <div className="flex items-center space-x-1 text-slate-500 text-xs sm:text-sm font-semibold" id="listing-locality-info">
                  <MapPin className="w-4 h-4 text-emerald-600 mr-0.5 shrink-0" />
                  <span>{matchedListing.suburb ? `${matchedListing.suburb}, ` : ''}{cityName}, {provinceName}</span>
                </div>
              </div>

              {/* Description Body */}
              <div className="space-y-3" id="listing-desc-sect">
                <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase font-mono">Company Profile & Scope</h3>
                <p className="text-slate-650 leading-relaxed text-sm sm:text-base border-l-4 border-slate-150 pl-4 py-1" id="listing-desc-text">
                  {matchedListing.description || 'No detailed company profile description submitted.'}
                </p>
              </div>

              {/* Keywords / SEO tags */}
              {matchedListing.keywords && (
                <div className="pt-2 border-t border-slate-100" id="listing-tags-sect">
                  <h4 className="text-slate-400 font-mono text-[10.5px] uppercase font-bold tracking-wider mb-2">Meta Keywords Logged</h4>
                  <div className="flex flex-wrap gap-1.5" id="listing-tags-wrapper">
                    {matchedListing.keywords.split(',').map((tag: string, i: number) => (
                      <span key={i} className="bg-slate-50 text-slate-600 border border-slate-205/45 rounded-md px-2 py-0.5 text-[10px] font-mono font-medium">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>

          {/* Core Contacts / Fast CTAs - Right Sidebar */}
          <div className="lg:col-span-1 space-y-6" id="listing-sidebar-column">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 sticky top-24" id="listing-fast-contacts">
              <h3 className="font-black text-slate-900 text-base tracking-tight border-b pb-3" id="contact-panel-hdr">Direct Contact Desk</h3>
              
              <div className="space-y-4" id="contact-list-strip">
                {/* Telephone */}
                {matchedListing.contactPhone && (
                  <div className="flex items-start space-x-3 text-xs" id="contact-phone-strip">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0" id="phone-ico-wrap">
                      <Phone className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="space-y-0.5" id="phone-labels">
                      <span className="block text-slate-400 font-mono text-[10px] uppercase font-bold">Phone Connection</span>
                      <a href={`tel:${matchedListing.contactPhone}`} className="text-slate-800 font-bold hover:underline select-all text-sm">
                        {matchedListing.contactPhone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Email Address */}
                {matchedListing.contactEmail && (
                  <div className="flex items-start space-x-3 text-xs" id="contact-email-strip">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0" id="email-ico-wrap">
                      <Mail className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="space-y-0.5" id="email-labels">
                      <span className="block text-slate-400 font-mono text-[10px] uppercase font-bold">Email Dispatch</span>
                      <a href={`mailto:${matchedListing.contactEmail}`} className="text-slate-800 font-bold hover:underline select-all text-sm select-all">
                        {matchedListing.contactEmail}
                      </a>
                    </div>
                  </div>
                )}

                {/* Website */}
                {matchedListing.websiteUrl && (
                  <div className="flex items-start space-x-3 text-xs" id="contact-web-strip">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0" id="web-ico-wrap">
                      <Globe className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="space-y-0.5" id="web-labels">
                      <span className="block text-slate-400 font-mono text-[10px] uppercase font-bold">Web Address</span>
                      <a
                        href={matchedListing.websiteUrl.startsWith('http') ? matchedListing.websiteUrl : `https://${matchedListing.websiteUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 font-extrabold hover:underline text-sm break-all"
                      >
                        {matchedListing.websiteUrl}
                      </a>
                    </div>
                  </div>
                )}

                {/* Registered date */}
                <div className="flex items-start space-x-3 text-xs pt-2 border-t border-slate-100" id="contact-reg-strip">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0" id="cal-ico-wrap">
                    <Calendar className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="space-y-0.5" id="reg-labels">
                    <span className="block text-slate-450 font-mono text-[9px] uppercase font-bold">Registration Verified On</span>
                    <span className="text-slate-650 font-mono font-medium text-xs">
                      {new Date(matchedListing.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Listing views counter */}
                <div className="flex items-start space-x-3 text-xs" id="contact-views-strip">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0" id="view-ico-wrap">
                    <Eye className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="space-y-0.5" id="views-labels">
                    <span className="block text-slate-450 font-mono text-[9px] uppercase font-bold">Verified Organic Impressions</span>
                    <span className="text-slate-800 font-bold font-mono text-xs">
                      {matchedListing.clicks || 0} hits
                    </span>
                  </div>
                </div>
              </div>

              {/* Fraud Protection Box */}
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/50 space-y-2 text-[10.5px]" id="sidebar-safety-disclaimer">
                <span className="text-amber-800 font-bold font-mono uppercase tracking-wider block">Important Safety Reminder</span>
                <p className="text-slate-600 leading-relaxed">
                  Never pay deposits upfront without physical verification. Real-estate, tradesmen, and guest bookings must be validated thoroughly before transfer. Refer to safety guides on home portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-slate-400 text-xs" id="listing-footer">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4" id="listing-footer-inner">
          <span className="font-extrabold text-white text-md">
            Biz<span className="text-emerald-400 font-black">s</span>earch24
          </span>
          <p className="text-slate-500 text-[10.5px]">© 2026 Bizsearch24 South Africa Directory. All indexed links mapped into search protocols.</p>
        </div>
      </footer>
    </div>
  );
}
