import * as React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { readDb } from '@/lib/serverDb';
import { PROVINCES, CITIES_AND_TOWNS } from '@/lib/saData';
import { MapPin, Phone, Mail, Globe, Calendar, Eye, ShieldCheck, ChevronLeft, CalendarDays } from 'lucide-react';

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/(^-|-$)+/g, '');
}

// Find matched location
function findLocationBySlug(slug: string) {
  // 1. Check if slug matches a Province
  const matchedProvince = PROVINCES.find(p => toSlug(p.name) === slug);
  if (matchedProvince) {
    return { type: 'province', data: matchedProvince, name: matchedProvince.name, province: matchedProvince, city: null };
  }

  // 2. Check if slug matches a City
  const matchedCity = CITIES_AND_TOWNS.find(c => toSlug(c.name) === slug);
  if (matchedCity) {
    const province = PROVINCES.find(p => p.id === matchedCity.provinceId);
    return { type: 'city', data: matchedCity, name: matchedCity.name, province, city: null };
  }

  // 3. Check if slug matches a Suburb
  for (const city of CITIES_AND_TOWNS) {
    const matchedSuburb = city.suburbs.find(s => toSlug(s) === slug);
    if (matchedSuburb) {
      const province = PROVINCES.find(p => p.id === city.provinceId);
      return { type: 'suburb', data: matchedSuburb, name: matchedSuburb, city, province };
    }
  }

  return null;
}

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

  // 3. Check Location Names (Provinces, Cities, Suburbs)
  const loc = findLocationBySlug(decodedSlug);
  if (loc) {
    if (loc.type === 'province') {
      return {
        title: `Business Directory in ${loc.name} | Bizsearch24 South Africa`,
        description: `Browse verified business directory listings, contact details, and local services in the ${loc.name} province, South Africa.`,
        keywords: `${loc.name}, business directory, South Africa, services`,
      };
    } else if (loc.type === 'city') {
      const provName = loc.province ? `, ${loc.province.name}` : '';
      return {
        title: `Verified Local Businesses in ${loc.name}${provName} | Bizsearch24`,
        description: `Explore top-rated local companies, professional trades, and retail services in ${loc.name}${provName}. Find addresses, contact info, and map directions.`,
        keywords: `${loc.name}, business directory, local trades, services`,
      };
    } else if (loc.type === 'suburb') {
      const parentCity = loc.city ? ` in ${loc.city.name}` : '';
      const provName = loc.province ? `, ${loc.province.name}` : '';
      return {
        title: `Best Businesses & Services in ${loc.name}${parentCity}${provName} | Bizsearch24`,
        description: `Find top-certified local trades, medical services, and popular restaurants in ${loc.name}${parentCity}${provName}. Verified contact details and location maps.`,
        keywords: `${loc.name}, directory, local services, ${loc.city?.name || ''}`,
      };
    }
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
  const matchedLocation = findLocationBySlug(decodedSlug);

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
  if (!matchedPage && !matchedListing && !matchedLocation) {
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

  // ==========================================
  // VIEW RENDER FOR DYNAMIC LOCATION DIRECTORY
  // ==========================================
  if (matchedLocation) {
    let localListings: any[] = [];
    try {
      const dbListings = await prisma.listing.findMany({
        include: { images: true }
      });
      
      if (matchedLocation.type === 'province') {
        localListings = dbListings.filter(l => l.province === (matchedLocation.data as any).id);
      } else if (matchedLocation.type === 'city') {
        localListings = dbListings.filter(l => l.city === (matchedLocation.data as any).id);
      } else if (matchedLocation.type === 'suburb') {
        localListings = dbListings.filter(
          l => l.suburb && l.suburb.toLowerCase() === matchedLocation.name.toLowerCase()
        );
      }
    } catch (err) {
      console.error('Error fetching dynamic location listings:', err);
    }

    const titlePrefix = matchedLocation.type === 'province' 
      ? `${matchedLocation.name} Province` 
      : matchedLocation.type === 'city'
      ? `${matchedLocation.name}`
      : `${matchedLocation.name}`;

    const subTitleText = matchedLocation.type === 'province'
      ? `Explore companies, trades, and medical professionals operating across ${matchedLocation.name}.`
      : matchedLocation.type === 'city'
      ? `Verified local business listings in ${matchedLocation.name}, ${matchedLocation.province?.name || 'South Africa'}.`
      : `Complete list of certified services and shops located in ${matchedLocation.name}, ${matchedLocation.city?.name || 'South Africa'}.`;

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="dynamic-location-root">
        {/* Header Navigation */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40" id="location-header">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between" id="location-header-inner">
            <Link href="/" className="inline-flex items-center space-x-1.5 py-1.5 text-slate-600 hover:text-slate-900 transition-colors" id="location-back-nav">
              <ChevronLeft className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold font-mono">BACK TO FINDER</span>
            </Link>
            <Link href="/" className="font-extrabold text-lg text-slate-950" id="location-logo">
              Biz<span className="text-emerald-500 font-black">s</span>earch24
            </Link>
          </div>
        </header>

        {/* Main Content Pane */}
        <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 space-y-8" id="location-main">
          {/* Location Hero Banner */}
          <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl" id="location-hero">
            <div className="relative z-10 space-y-3 max-w-2xl" id="location-hero-content">
              <span className="inline-flex bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                {matchedLocation.type.toUpperCase()} DIRECTORY
              </span>
              <h1 className="text-3xl sm:text-4.5xl font-black tracking-tight text-white leading-tight" id="location-title">
                {titlePrefix} Local Index
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed" id="location-subtitle">
                {subTitleText} Fully indexed index with contact phone numbers, emails, active website links, and location maps.
              </p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400 font-mono pt-2" id="location-meta-stats">
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Active Listings: <strong className="text-emerald-400 ml-1 font-bold">{localListings.length}</strong>
                </span>
                {matchedLocation.province && (
                  <span>Region: <strong className="text-white ml-0.5 font-bold">{matchedLocation.province.name}</strong></span>
                )}
                {matchedLocation.city && (
                  <span>City: <strong className="text-white ml-0.5 font-bold">{matchedLocation.city.name}</strong></span>
                )}
              </div>
            </div>

            {/* Backdrop graphic decor */}
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 pointer-events-none hidden md:block" id="location-hero-decor">
              <MapPin className="w-full h-full text-emerald-400 transform translate-x-12 translate-y-6 scale-110" />
            </div>
          </section>

          {/* Directory Listings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="location-directory-layout">
            
            {/* Main Listings Column */}
            <div className="lg:col-span-2 space-y-6" id="location-listings-pane">
              <div className="flex items-center justify-between border-b pb-3" id="listings-pane-header">
                <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase font-mono">
                  Registered Businesses ({localListings.length})
                </h2>
                <span className="text-xs text-slate-400 font-mono font-semibold">Sorted alphabetically</span>
              </div>

              {localListings.length === 0 ? (
                /* Empty state */
                <div className="bg-white border rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4" id="location-empty-state">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100" id="empty-ico-wrap">
                    <MapPin className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="space-y-1" id="empty-titles">
                    <h3 className="text-base font-extrabold text-slate-800">No Listings Found Yet</h3>
                    <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto">
                      There are currently no registered or verified company records indexed under {matchedLocation.name} yet.
                    </p>
                  </div>
                  <Link 
                    href="/?open_submission=true" 
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
                    id="btn-register-empty"
                  >
                    Add Business to {matchedLocation.name} for Free
                  </Link>
                </div>
              ) : (
                /* Listings container */
                <div className="space-y-4" id="location-listings-stack">
                  {localListings.map((listing) => {
                    const listingSlug = listing.businessName.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/(^-|-$)+/g, '');
                    const hasImage = listing.images?.[0];
                    const listingImg = hasImage 
                      ? `data:${listing.images[0].mimeType};base64,${Buffer.from(listing.images[0].imageData).toString('base64')}`
                      : 'https://picsum.photos/seed/company/200/200';

                    return (
                      <Link 
                        key={listing.id}
                        href={`/${listingSlug}`}
                        className="block bg-white border border-slate-200 hover:border-emerald-500/80 rounded-2xl p-4 sm:p-5 transition-all hover:shadow-md hover:-translate-y-0.5 duration-200"
                        id={`location-listing-link-${listing.id}`}
                      >
                        <div className="flex gap-4 items-start" id={`listing-card-layout-${listing.id}`}>
                          {/* Left Image aspect */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 border border-slate-100 rounded-xl overflow-hidden shrink-0 relative" id={`listing-card-img-wrap-${listing.id}`}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={listingImg} 
                              alt={listing.businessName}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Detail text */}
                          <div className="flex-grow space-y-1.5 min-w-0" id={`listing-card-text-${listing.id}`}>
                            <div className="flex items-start justify-between gap-2" id={`listing-card-headings-${listing.id}`}>
                              <h3 className="font-extrabold text-slate-900 group-hover:text-emerald-700 text-xs sm:text-sm tracking-tight truncate" id={`listing-card-title-${listing.id}`}>
                                {listing.businessName}
                              </h3>
                              <span className="shrink-0 inline-flex bg-emerald-50 text-emerald-800 border border-emerald-100 font-mono text-[8px] sm:text-[9px] uppercase font-black px-1.5 py-0.5 rounded-sm" id={`listing-card-badge-${listing.id}`}>
                                VERIFIED
                              </span>
                            </div>

                            <p className="text-slate-500 text-[11px] sm:text-xs line-clamp-2" id={`listing-card-desc-${listing.id}`}>
                              {listing.description || 'No detailed company description submitted yet.'}
                            </p>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-450 font-mono" id={`listing-card-meta-${listing.id}`}>
                              <span className="flex items-center">
                                <MapPin className="w-3.5 h-3.5 text-emerald-600 mr-0.5 shrink-0" />
                                <span className="truncate max-w-[150px]">{listing.suburb ? `${listing.suburb}, ` : ''}{matchedLocation.type === 'city' ? '' : matchedLocation.name}</span>
                              </span>
                              {listing.contactPhone && (
                                <span className="flex items-center">
                                  <Phone className="w-3 h-3 text-slate-400 mr-0.5 shrink-0" />
                                  <span>{listing.contactPhone}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar Columns - Local exploration metadata */}
            <div className="lg:col-span-1 space-y-6" id="location-sidebar-pane">
              
              {/* Parent/Child lists */}
              <div className="bg-white border rounded-2xl p-5 shadow-xs space-y-4" id="location-explore-box">
                <h3 className="font-extrabold text-slate-800 text-xs tracking-wider uppercase font-mono border-b pb-2">
                  Explore Neighboring Areas
                </h3>

                {matchedLocation.type === 'province' ? (
                  /* Province -> List Cities in Province */
                  <div className="space-y-2" id="explore-cities-stack">
                    <p className="text-[10.5px] text-slate-500">Major verified business municipalities in {matchedLocation.name}:</p>
                    <div className="flex flex-col gap-1.5 animate-fade-in" id="explore-cities-list">
                      {CITIES_AND_TOWNS.filter(c => c.provinceId === (matchedLocation.data as any).id).slice(0, 15).map(city => {
                        const citySlug = city.name.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/(^-|-$)+/g, '');
                        return (
                          <Link 
                            key={city.id}
                            href={`/${citySlug}`}
                            className="text-xs text-slate-600 hover:text-emerald-700 font-medium inline-flex items-center justify-between py-1 px-2 hover:bg-slate-50 rounded"
                            id={`explore-city-${city.id}`}
                          >
                            <span>{city.name}</span>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                              {city.suburbs.length} suburbs
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : matchedLocation.type === 'city' ? (
                  /* City -> List Suburbs in City */
                  <div className="space-y-2" id="explore-suburbs-stack">
                    <p className="text-[10.5px] text-slate-500">Suburbs & towns located around {matchedLocation.name}:</p>
                    <div className="flex flex-wrap gap-1.5" id="explore-suburbs-grid">
                      {(matchedLocation.data as any).suburbs.map((sub: string, i: number) => {
                        const subSlug = sub.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/(^-|-$)+/g, '');
                        return (
                          <Link 
                            key={i}
                            href={`/${subSlug}`}
                            className="bg-slate-50 hover:bg-emerald-50 border hover:border-emerald-300 text-slate-600 hover:text-emerald-800 rounded-lg px-2.5 py-1 text-[10.5px] font-mono transition-all"
                            id={`explore-sub-${i}`}
                          >
                            {sub}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* Suburb -> List neighboring Suburbs */
                  <div className="space-y-2" id="neighboring-suburbs-stack">
                    {matchedLocation.city && (
                      <>
                        <p className="text-[10.5px] text-slate-500">Other suburbs in {matchedLocation.city.name} to view:</p>
                        <div className="flex flex-wrap gap-1.5" id="neighbor-sub-grid">
                          {matchedLocation.city.suburbs.filter(s => s !== matchedLocation.name).slice(0, 15).map((sub, i) => {
                            const subSlug = sub.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/(^-|-$)+/g, '');
                            return (
                              <Link 
                                key={i}
                                href={`/${subSlug}`}
                                className="bg-slate-50 hover:bg-emerald-50 border hover:border-emerald-300 text-slate-600 hover:text-emerald-800 rounded-lg px-2.5 py-1 text-[10.5px] font-mono transition-all"
                                id={`neighbor-sub-${i}`}
                              >
                                {sub}
                              </Link>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Instant registration Promo */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 shadow-md" id="sidebar-promo">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">Spotlight Premium</span>
                <span className="text-sm font-bold block" id="promo-headline">Feature Business in {matchedLocation.name}</span>
                <p className="text-slate-350 text-[10.5px] leading-relaxed" id="promo-subtitle">
                  Lock down premium exposure. Place a highlight banner at the very crown of the {matchedLocation.name} directory indexes. Instantly receive your verified client credentials.
                </p>
                <Link 
                  href="/?open_submission=true"
                  className="w-full text-center block py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                  id="btn-promo-register"
                >
                  Buy Premium Spot
                </Link>
              </div>

            </div>
          </div>
        </main>

        <footer className="bg-slate-900 border-t border-slate-800 py-8 text-slate-400 text-xs" id="location-footer">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4" id="location-footer-inner">
            <span className="font-extrabold text-white text-md">
              Biz<span className="text-emerald-400 font-black">s</span>earch24
            </span>
            <p className="text-slate-500 text-[10.5px]">© 2026 Bizsearch24 South Africa Directory. All rights reserved.</p>
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
