'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle2, 
  ShieldAlert, 
  HeartPulse, 
  Briefcase, 
  Utensils, 
  Car, 
  Wrench, 
  Palmtree, 
  ShoppingBag, 
  Hammer, 
  LogIn, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  FileText, 
  ChevronRight, 
  Menu, 
  X, 
  ArrowLeft, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  Settings, 
  ExternalLink,
  ChevronDown,
  Download,
  UploadCloud,
  AlertTriangle,
  TrendingUp,
  CheckSquare
} from 'lucide-react';

import { PROVINCES, CITIES_AND_TOWNS, CATEGORIES } from '@/lib/saData';
import { BusinessListing, DynamicPage, SlugMapping, BizAd, VisitorTrackingLog } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function Bizsearch24Home() {
  // Navigation tabs: 'explore' | 'submit' | 'pages' | 'admin'
  const [activeTab, setActiveTab] = React.useState<'explore' | 'submit' | 'pages' | 'admin'>('explore');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);

  // States for general listings
  const [listings, setListings] = React.useState<BusinessListing[]>([]);
  const [loadingListings, setLoadingListings] = React.useState<boolean>(true);

  // Filter criteria states
  const [term, setTerm] = React.useState<string>('');
  const [selectedProvince, setSelectedProvince] = React.useState<string>('');
  const [selectedCity, setSelectedCity] = React.useState<string>('');
  const [selectedSuburb, setSelectedSuburb] = React.useState<string>('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');

  // Dynamic override states to allow typing literally any custom town, city, suburb, or area in South Africa
  const [manualLocationMode, setManualLocationMode] = React.useState<boolean>(false);
  const [subManualMode, setSubManualMode] = React.useState<boolean>(false);
  const [editManualMode, setEditManualMode] = React.useState<boolean>(false);

  // Selected single listing for detailed view overlay
  const [selectedListing, setSelectedListing] = React.useState<BusinessListing | null>(null);

  // Dynamic SEO pages state
  const [seoPages, setSeoPages] = React.useState<DynamicPage[]>([]);
  const [activePageSlug, setActivePageSlug] = React.useState<string | null>(null);
  const [viewingPage, setViewingPage] = React.useState<DynamicPage | null>(null);

  // Admin authentication states
  const [adminUsername, setAdminUsername] = React.useState<string>('');
  const [adminPassword, setAdminPassword] = React.useState<string>('');
  const [adminToken, setAdminToken] = React.useState<string>('');
  const [authError, setAuthError] = React.useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = React.useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState<boolean>(false);
  const [userRole, setUserRole] = React.useState<string>('USER');
  const [isRegistering, setIsRegistering] = React.useState<boolean>(false);
  const [show2FA, setShow2FA] = React.useState<boolean>(false);
  const [mfaToken, setMfaToken] = React.useState<string>('');
  const [requires2FASetup, setRequires2FASetup] = React.useState<boolean>(false);
  const [qrCodeData, setQrCodeData] = React.useState<string>('');
  const [setupSecret, setSetupSecret] = React.useState<string>('');
  const [pendingUserId, setPendingUserId] = React.useState<string>('');

  // Admin panel dashboard states
  const [adminListings, setAdminListings] = React.useState<BusinessListing[]>([]);
  const [adminLoading, setAdminLoading] = React.useState<boolean>(false);
  const [editingListing, setEditingListing] = React.useState<BusinessListing | null>(null);
  const [editingPage, setEditingPage] = React.useState<DynamicPage | null>(null);
  const [isCreatingPage, setIsCreatingPage] = React.useState<boolean>(false);

  // Admin page/slug edit values
  const [pageTitle, setPageTitle] = React.useState<string>('');
  const [pageSlug, setPageSlug] = React.useState<string>('');
  const [pageContent, setPageContent] = React.useState<string>('');
  const [pageMeta, setPageMeta] = React.useState<string>('');
  const [pageKeywords, setPageKeywords] = React.useState<string>('');
  const [pageGeoRegion, setPageGeoRegion] = React.useState<string>('');
  const [pageGeoPlacename, setPageGeoPlacename] = React.useState<string>('');
  const [pageGeoPosition, setPageGeoPosition] = React.useState<string>('');
  const [pageSaveError, setPageSaveError] = React.useState<string>('');

  // Admin listing edit values
  const [editName, setEditName] = React.useState<string>('');
  const [editDesc, setEditDesc] = React.useState<string>('');
  const [editCategory, setEditCategory] = React.useState<string>('');
  const [editAddress, setEditAddress] = React.useState<string>('');
  const [editProvince, setEditProvince] = React.useState<string>('');
  const [editCity, setEditCity] = React.useState<string>('');
  const [editSuburb, setEditSuburb] = React.useState<string>('');
  const [editPhone, setEditPhone] = React.useState<string>('');
  const [editEmail, setEditEmail] = React.useState<string>('');
  const [editWebsite, setEditWebsite] = React.useState<string>('');
  const [editTags, setEditTags] = React.useState<string>('');
  const [editVerified, setEditVerified] = React.useState<boolean>(true);
  const [editListingError, setEditListingError] = React.useState<string>('');

  // New administrative listings edit states
  const [editSlug, setEditSlug] = React.useState<string>('');
  const [editImage, setEditImage] = React.useState<string>('');
  const [editServices, setEditServices] = React.useState<string>('');
  const [editTradingTimes, setEditTradingTimes] = React.useState<string>('');
  const [editWhatsapp, setEditWhatsapp] = React.useState<string>('');
  const [editMobile, setEditMobile] = React.useState<string>('');
  const [editFacebook, setEditFacebook] = React.useState<string>('');
  const [editTwitter, setEditTwitter] = React.useState<string>('');
  const [editInstagram, setEditInstagram] = React.useState<string>('');
  const [editLinkedin, setEditLinkedin] = React.useState<string>('');
  const [editAppointmentRequired, setEditAppointmentRequired] = React.useState<'yes' | 'no'>('no');

  // Ad placement management states
  const [adsList, setAdsList] = React.useState<BizAd[]>([]);
  const [adminAds, setAdminAds] = React.useState<BizAd[]>([]);
  const [adsLoading, setAdsLoading] = React.useState<boolean>(false);
  const [isCreatingAd, setIsCreatingAd] = React.useState<boolean>(false);
  const [editingAd, setEditingAd] = React.useState<BizAd | null>(null);
  
  // Ad campaign form fields
  const [adTitle, setAdTitle] = React.useState<string>('');
  const [adImageUrl, setAdImageUrl] = React.useState<string>('');
  const [adTargetUrl, setAdTargetUrl] = React.useState<string>('');
  const [adPlacement, setAdPlacement] = React.useState<'all' | 'province' | 'city' | 'suburb'>('all');
  const [adProvince, setAdProvince] = React.useState<string>('');
  const [adCity, setAdCity] = React.useState<string>('');
  const [adSuburb, setAdSuburb] = React.useState<string>('');
  const [adPosition, setAdPosition] = React.useState<'top-banner' | 'sidebar' | 'inline-list'>('sidebar');
  const [adSize, setAdSize] = React.useState<'any' | 'square' | 'banner' | 'portrait'>('any');
  const [adActive, setAdActive] = React.useState<boolean>(true);
  const [adSaveError, setAdSaveError] = React.useState<string>('');
  const [adSearchQuery, setAdSearchQuery] = React.useState<string>('');

  // Extended ad campaign fields requests
  const [adBadge, setAdBadge] = React.useState<'verified' | 'premium' | 'premium-verified' | 'standard'>('standard');
  const [adDescription, setAdDescription] = React.useState<string>('');
  const [adAlwaysOnTop, setAdAlwaysOnTop] = React.useState<boolean>(false);
  const [adPlacementNews, setAdPlacementNews] = React.useState<boolean>(false);
  const [adPlacementSponsored, setAdPlacementSponsored] = React.useState<boolean>(false);
  const [adExpiryType, setAdExpiryType] = React.useState<'permanent' | 'date'>('permanent');
  const [adExpiryDate, setAdExpiryDate] = React.useState<string>('');

  // Filtered ads list for admin section search
  const filteredAdminAds = React.useMemo(() => {
    const query = adSearchQuery.toLowerCase().trim();
    if (!query) return adminAds;
    return adminAds.filter(ad => 
      ad.title.toLowerCase().includes(query) ||
      (ad.id && ad.id.toLowerCase().includes(query)) ||
      (ad.targetUrl && ad.targetUrl.toLowerCase().includes(query)) ||
      ad.placement.toLowerCase().includes(query) ||
      (ad.province && ad.province.toLowerCase().includes(query)) ||
      (ad.city && ad.city.toLowerCase().includes(query)) ||
      (ad.suburb && ad.suburb.toLowerCase().includes(query))
    );
  }, [adminAds, adSearchQuery]);

  // Visitor traffic logs and tracking states
  const [visitorLogs, setVisitorLogs] = React.useState<any[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = React.useState<boolean>(false);

  // Admin section sub-tab switcher
  const [adminActiveSubTab, setAdminActiveSubTab] = React.useState<'listings' | 'ads' | 'analytics'>('listings');

  // User Profile
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [profileSaveMsg, setProfileSaveMsg] = React.useState('');
  const [isConfiguringProfile2FA, setIsConfiguringProfile2FA] = React.useState<boolean>(false);
  const [profileMfaToken, setProfileMfaToken] = React.useState<string>('');

  // Custom slug mappings states (subdomains/redirects manager)
  const [slugMappings, setSlugMappings] = React.useState<any[]>([]);
  const [editingMapping, setEditingMapping] = React.useState<any | null>(null);
  const [isConfiguringSlugs, setIsConfiguringSlugs] = React.useState<boolean>(false);
  const [mapSource, setMapSource] = React.useState<string>('');
  const [mapTarget, setMapTarget] = React.useState<string>('');
  const [mapType, setMapType] = React.useState<'subdomain' | 'custom-link' | 'redirect'>('subdomain');
  const [mapActive, setMapActive] = React.useState<boolean>(true);
  const [mapError, setMapError] = React.useState<string>('');

  // Terms and legal consent states
  const [showConsentBanner, setShowConsentBanner] = React.useState<boolean>(false);
  const [showLegalModal, setShowLegalModal] = React.useState<boolean>(false);
  const [isLegalExpanded, setIsLegalExpanded] = React.useState<boolean>(false);
  const [legalTab, setLegalTab] = React.useState<'terms' | 'privacy' | 'popia' | 'agreement'>('agreement');

  // Public Submission state
  const [subName, setSubName] = React.useState<string>('');
  const [subDesc, setSubDesc] = React.useState<string>('');
  const [subCategory, setSubCategory] = React.useState<string>('');
  const [subAddress, setSubAddress] = React.useState<string>('');
  const [subProvince, setSubProvince] = React.useState<string>('');
  const [subCity, setSubCity] = React.useState<string>('');
  const [subSuburb, setSubSuburb] = React.useState<string>('');
  const [subPhone, setSubPhone] = React.useState<string>('');
  const [subEmail, setSubEmail] = React.useState<string>('');
  const [subWebsite, setSubWebsite] = React.useState<string>('');
  const [subTags, setSubTags] = React.useState<string>('');
  const [submittingUser, setSubmittingUser] = React.useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = React.useState<string>('');
  const [submissionError, setSubmissionError] = React.useState<string>('');

  // Quick stats computed on verified listings
  const totalListingsCount = listings.length;
  const verifiedListingsCount = listings.filter(l => l.verified).length;

  // Load and refresh listings from the API
  const fetchListings = React.useCallback(async (termVal = '', pVal = '', cVal = '', sVal = '', catVal = '') => {
    setLoadingListings(true);
    try {
      const qParams = new URLSearchParams();
      if (termVal) qParams.append('term', termVal);
      if (pVal) qParams.append('province', pVal);
      if (cVal) qParams.append('city', cVal);
      if (sVal) qParams.append('suburb', sVal);
      if (catVal) qParams.append('category', catVal);
      qParams.append('onlyVerified', 'true'); // Filter out unverified for normal public directories

      const res = await fetch(`/api/listings?${qParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setListings(data.listings);
      }
    } catch (e) {
      console.error('Error fetching directory listings:', e);
    } finally {
      setLoadingListings(false);
    }
  }, []);

  // Fetch dynamic SEO pages
  const fetchSeoPages = React.useCallback(async () => {
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      if (data.success) {
        setSeoPages(data.pages);
      }
    } catch (e) {
      console.error('Error loading SEO pages:', e);
    }
  }, []);

  // Client activities event logger helper
  const trackVisitActivity = React.useCallback(async (act: string, pth: string, ext: any = {}) => {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: act,
          path: pth,
          referrer: typeof document !== 'undefined' ? document.referrer : '',
          search: ext.search || '',
          clickPayload: ext.clickPayload || null
        })
      });
    } catch (e) {
      // Fail silently for non-intrusive logging
    }
  }, []);

  // Public ads selector loader
  const fetchAdsList = React.useCallback(async (prov = '', ct = '', sub = '') => {
    try {
      const qParams = new URLSearchParams();
      if (prov) qParams.append('province', prov);
      if (ct) qParams.append('city', ct);
      if (sub) qParams.append('suburb', sub);
      const res = await fetch(`/api/ads?${qParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setAdsList(data.ads || []);
      }
    } catch (err) {
      console.error('Failed to load advertisements banner list:', err);
    }
  }, []);

  // Administrative ads campaign reader
  const fetchAdminAds = React.useCallback(async () => {
    if (!adminToken) return;
    setAdsLoading(true);
    try {
      const res = await fetch('/api/ads', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdminAds(data.ads || []);
      }
    } catch (err) {
      console.error('Failed to load admin ads:', err);
    } finally {
      setAdsLoading(false);
    }
  }, [adminToken]);

  // Administrative visitor tracking stream reader
  const fetchAnalyticsLogs = React.useCallback(async () => {
    if (!adminToken) return;
    setAnalyticsLoading(true);
    try {
      const res = await fetch('/api/analytics', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setVisitorLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to load analytics logs:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [adminToken]);

  // Sync token from localStorage and trigger legal disclaimer on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const storedToken = localStorage.getItem('biz_admin_token');
      if (storedToken) {
        setAdminToken(storedToken);
        setIsAdminLoggedIn(true);
      }
      const legalAccepted = localStorage.getItem('biz_legal_accepted');
      if (!legalAccepted) {
        setShowConsentBanner(true);
      }
      fetchListings();
      fetchSeoPages();
      fetchAdsList();
      trackVisitActivity('init', '/');
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchListings, fetchSeoPages, fetchAdsList, trackVisitActivity]);

  // Logout session helper declared with stable dependencies
  const handleLogout = React.useCallback(async () => {
    try {
      if (adminToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${adminToken}` }
        });
      }
    } catch (err) {
      // Silent error logging out
    }
    setAdminToken('');
    localStorage.removeItem('biz_admin_token');
    setIsAdminLoggedIn(false);
    setAdminListings([]);
  }, [adminToken]);

  // Load Admin Data when logged in
  const fetchAdminData = React.useCallback(async () => {
    if (!adminToken) return;
    setAdminLoading(true);
    try {
      // Load user profile
      const profRes = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const profData = await profRes.json();
      if (profData.success) {
        setUserProfile(profData.profile);
        setUserRole(profData.profile.role);
        if (profData.profile.role === 'ADMIN') {
          fetchAdminAds();
          fetchAnalyticsLogs();
        }
      }

      // Admin gets all including unverified, regular user gets their own
      const qParams = new URLSearchParams();
      qParams.append('onlyVerified', 'false');

      const res = await fetch(`/api/listings?${qParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        }
      });
      const data = await res.json();
      if (data.success) {
        setAdminListings(data.listings);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Admin data refresh failed:', err);
    } finally {
      setAdminLoading(false);
    }
  }, [adminToken, userRole, handleLogout, fetchAdminAds, fetchAnalyticsLogs]);

  React.useEffect(() => {
    if (isAdminLoggedIn) {
      const timer = setTimeout(() => {
        fetchAdminData();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAdminLoggedIn, fetchAdminData]);

  // Perform search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchListings(term, selectedProvince, selectedCity, selectedSuburb, selectedCategory);
    fetchAdsList(selectedProvince, selectedCity, selectedSuburb);
    trackVisitActivity('search', '/explore', { search: `Term: "${term}", Province: "${selectedProvince}", City: "${selectedCity || 'None'}", Category: "${selectedCategory || 'All'}"` });
  };

  // Reset filters
  const handleClearFilters = () => {
    setTerm('');
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedSuburb('');
    setSelectedCategory('');
    fetchListings('', '', '', '', '');
    fetchAdsList('', '', '');
    trackVisitActivity('search_clear', '/explore');
  };

  // Dynamic filter selector updates
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedProvince(val);
    setSelectedCity('');
    setSelectedSuburb('');
    fetchListings(term, val, '', '', selectedCategory);
    fetchAdsList(val, '', '');
    trackVisitActivity('filter_province', '/explore', { search: `Province: "${val}", Category: "${selectedCategory || 'All'}"` });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCity(val);
    setSelectedSuburb('');
    fetchListings(term, selectedProvince, val, '', selectedCategory);
    fetchAdsList(selectedProvince, val, '');
    trackVisitActivity('filter_city', '/explore', { search: `City: "${val}", Province: "${selectedProvince}"` });
  };

  const handleSuburbChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedSuburb(val);
    fetchListings(term, selectedProvince, selectedCity, val, selectedCategory);
    fetchAdsList(selectedProvince, selectedCity, val);
    trackVisitActivity('filter_suburb', '/explore', { search: `Suburb: "${val}", City: "${selectedCity}"` });
  };

  const handleCategorySelect = (catId: string) => {
    const newVal = selectedCategory === catId ? '' : catId;
    setSelectedCategory(newVal);
    fetchListings(term, selectedProvince, selectedCity, selectedSuburb, newVal);
    trackVisitActivity('filter_category', '/explore', { search: `Category Selected: "${newVal || 'Clear'}"` });
  };

  // Click on a listing
  const handleListingClick = async (listing: BusinessListing) => {
    setSelectedListing(listing);
    trackVisitActivity('click', '/explore', {
      clickPayload: { id: listing.id, text: `Opened info sheet: ${listing.name} (${listing.suburb || listing.city})` }
    });
    // Asynchronously trigger view increment logic
    try {
      await fetch('/api/listings/increment-views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: listing.id }),
      });
      // Increment local views count safely
      setListings(prev => prev.map(item => item.id === listing.id ? { ...item, views: (item.views || 0) + 1 } : item));
    } catch (e) {
      // Ignored non-critical view logging error
    }
  };

  // Interactive dynamic page select
  const handlePageSelect = async (slug: string) => {
    try {
      const res = await fetch(`/api/pages?slug=${slug}`);
      const data = await res.json();
      if (data.success) {
        setViewingPage(data.page);
        setActivePageSlug(slug);
        setActiveTab('pages');
        setMobileMenuOpen(false);
      }
    } catch (err) {
      console.error('Error fetching dynamic slug:', err);
    }
  };

  // Form Submission handles (Public)
  const handlePublicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingUser(true);
    setSubmissionSuccess('');
    setSubmissionError('');

    if (!subName || !subCategory || !subAddress || !subProvince || !subCity) {
      setSubmissionError('Please fill in all mandatory fields.');
      setSubmittingUser(false);
      return;
    }

    try {
      const tagArray = subTags ? subTags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: subName,
          description: subDesc,
          category: subCategory,
          address: subAddress,
          province: subProvince,
          city: subCity,
          suburb: subSuburb,
          phone: subPhone,
          email: subEmail,
          website: subWebsite,
          tags: tagArray,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionSuccess(data.message || 'Submission successful! Waiting for verification.');
        // Reset inputs
        setSubName('');
        setSubDesc('');
        setSubCategory('');
        setSubAddress('');
        setSubProvince('');
        setSubCity('');
        setSubSuburb('');
        setSubPhone('');
        setSubEmail('');
        setSubWebsite('');
        setSubTags('');
        fetchListings(); // reload directory
      } else {
        setSubmissionError(data.message || 'Error occurred during listing submission.');
      }
    } catch (err) {
      setSubmissionError('Server returned error while registering brand.');
    } finally {
      setSubmittingUser(false);
    }
  };

  // Admin login handling
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);

    try {
      const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
      const body = { email: adminUsername, password: adminPassword };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      
      if (isRegistering) {
        if (data.success) {
          setIsRegistering(false);
          setAuthError('Account registered. Please log in.');
        } else {
          setAuthError(data.message || 'Registration failed.');
        }
        setIsAuthenticating(false);
        return;
      }

      // Login Flow
      if (data.success) {
        if (data.require2FA) {
          setPendingUserId(data.userId);
          setRequires2FASetup(data.setupRequired);
          setShow2FA(true);
          
          if (data.setupRequired) {
            const qrRes = await fetch('/api/auth/setup-2fa', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: data.userId, action: 'generate' })
            });
            const qrData = await qrRes.json();
            if (qrData.success) {
              setQrCodeData(qrData.qrCode);
              setSetupSecret(qrData.secret);
            }
          }
        } else if (data.token) {
          setAdminToken(data.token);
          localStorage.setItem('biz_admin_token', data.token);
          setUserRole(data.role);
          setIsAdminLoggedIn(true);
          setAdminUsername('');
          setAdminPassword('');
          setAuthError('');
        }
      } else {
        setAuthError(data.message || 'Authentication failed.');
      }
    } catch (err) {
      setAuthError('Connection failure.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthenticating(true);
    try {
      if (requires2FASetup) {
        const res = await fetch('/api/auth/setup-2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: pendingUserId, action: 'verifyAndEnable', token: mfaToken })
        });
        const data = await res.json();
        if (data.success && data.token) {
          setAdminToken(data.token);
          localStorage.setItem('biz_admin_token', data.token);
          setUserRole(data.role);
          setIsAdminLoggedIn(true);
          setShow2FA(false);
          setAdminUsername('');
          setAdminPassword('');
        } else {
          setAuthError(data.message || 'Invalid 2FA code.');
        }
      } else {
        const res = await fetch('/api/auth/verify-2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: pendingUserId, token: mfaToken })
        });
        const data = await res.json();
        if (data.success && data.token) {
          setAdminToken(data.token);
          localStorage.setItem('biz_admin_token', data.token);
          setUserRole(data.role);
          setIsAdminLoggedIn(true);
          setShow2FA(false);
          setAdminUsername('');
          setAdminPassword('');
        } else {
          setAuthError(data.message || 'Invalid token.');
        }
      }
    } catch (err) {
      setAuthError('2FA Verification failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // handleLogout moved above fetchAdminData to solve ESM binding reference limits

  // Administrative Operations
  const handleVerifyBusiness = async (id: string, currentlyVerified: boolean) => {
    const action = currentlyVerified ? 'unverify' : 'verify';
    try {
      const res = await fetch('/api/listings/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ id, action }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
        fetchListings();
      }
    } catch (err) {
      console.error('Error verifying listing:', err);
    }
  };

  const handleDeleteBusiness = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this business listing?')) return;
    try {
      const res = await fetch('/api/listings/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ id, action: 'delete' }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
        fetchListings();
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  const handleBulkAction = async (action: 'verify_all' | 'boost_views' | 'delete_unverified') => {
    let confirmPrompt = 'Are you sure you want to run this bulk action?';
    if (action === 'verify_all') {
      confirmPrompt = 'Are you sure you want to approve & verify ALL listings in the database?';
    } else if (action === 'boost_views') {
      confirmPrompt = 'Are you sure you want to run the organic traffic simulator booster (+15-100 random views to each verified listing)?';
    } else if (action === 'delete_unverified') {
      confirmPrompt = 'Are you sure you want to delete ALL unverified listings permanently? This action is irreversible.';
    }
    if (!confirm(confirmPrompt)) return;

    try {
      const res = await fetch('/api/listings/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchAdminData();
        fetchListings();
      } else {
        alert(data.message || 'Bulk operation failed.');
      }
    } catch (err) {
      console.error('Error running bulk action:', err);
      alert('Network error running bulk operation.');
    }
  };

  const startEditListing = (listing: BusinessListing) => {
    setEditingListing(listing);
    setEditName(listing.name);
    setEditDesc(listing.description);
    setEditCategory(listing.category);
    setEditAddress(listing.address);
    setEditProvince(listing.province);
    setEditCity(listing.city);
    setEditSuburb(listing.suburb || '');
    setEditPhone(listing.phone || '');
    setEditEmail(listing.email || '');
    setEditWebsite(listing.website || '');
    setEditTags(listing.tags.join(', '));
    setEditVerified(listing.verified);
    
    // Set extended administrative attributes
    setEditSlug(listing.slug || '');
    setEditImage(listing.image || '');
    setEditServices((listing.servicesOffered || []).join(', '));
    setEditTradingTimes(listing.tradingTimes || '');
    setEditWhatsapp(listing.whatsappNumber || '');
    setEditMobile(listing.mobileNumber || '');
    setEditFacebook(listing.facebookUrl || '');
    setEditTwitter(listing.twitterUrl || '');
    setEditInstagram(listing.instagramUrl || '');
    setEditLinkedin(listing.linkedinUrl || '');
    setEditAppointmentRequired(listing.appointmentRequired || 'no');

    setEditListingError('');
  };

  const saveEditedListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingListing) return;
    setEditListingError('');

    try {
      const tagArray = editTags ? editTags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const serviceArray = editServices ? editServices.split(',').map(s => s.trim()).filter(Boolean) : [];
      const res = await fetch('/api/listings/verify', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          id: editingListing.id,
          name: editName,
          slug: editSlug,
          image: editImage,
          description: editDesc,
          category: editCategory,
          address: editAddress,
          province: editProvince,
          city: editCity,
          suburb: editSuburb,
          phone: editPhone,
          email: editEmail,
          website: editWebsite,
          tags: tagArray,
          verified: editVerified,
          // Extended attributes:
          servicesOffered: serviceArray,
          tradingTimes: editTradingTimes,
          whatsappNumber: editWhatsapp,
          mobileNumber: editMobile,
          facebookUrl: editFacebook,
          twitterUrl: editTwitter,
          instagramUrl: editInstagram,
          linkedinUrl: editLinkedin,
          appointmentRequired: editAppointmentRequired
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEditingListing(null);
        fetchAdminData();
        fetchListings();
      } else {
        setEditListingError(data.message || 'Error saving changes.');
      }
    } catch (err) {
      setEditListingError('Failed to execute update connection.');
    }
  };

  // Dynamic Pages Management
  const startCreatePage = () => {
    setEditingPage(null);
    setIsCreatingPage(true);
    setPageTitle('');
    setPageSlug('');
    setPageContent('');
    setPageMeta('');
    setPageKeywords('');
    setPageGeoRegion('');
    setPageGeoPlacename('');
    setPageGeoPosition('');
    setPageSaveError('');
  };

  const startEditPage = (page: DynamicPage) => {
    setEditingPage(page);
    setIsCreatingPage(true);
    setPageTitle(page.title);
    setPageSlug(page.slug);
    setPageContent(page.content);
    setPageMeta(page.metaDescription);
    setPageKeywords(page.keywords || '');
    setPageGeoRegion(page.geoRegion || '');
    setPageGeoPlacename(page.geoPlacename || '');
    setPageGeoPosition(page.geoPosition || '');
    setPageSaveError('');
  };

  const deletePage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      const res = await fetch('/api/pages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        fetchSeoPages();
      }
    } catch (err) {
      console.error('Error deleting page:', err);
    }
  };

  const saveSeoPage = async (e: React.FormEvent) => {
    e.preventDefault();
    setPageSaveError('');

    if (!pageTitle || !pageSlug || !pageContent) {
      setPageSaveError('Missing mandatory variables.');
      return;
    }

    try {
      const body = {
        id: editingPage?.id,
        title: pageTitle,
        slug: pageSlug,
        content: pageContent,
        metaDescription: pageMeta,
        keywords: pageKeywords,
        geoRegion: pageGeoRegion,
        geoPlacename: pageGeoPlacename,
        geoPosition: pageGeoPosition,
      };

      const method = editingPage ? 'PUT' : 'POST';
      const res = await fetch('/api/pages', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setIsCreatingPage(false);
        setEditingPage(null);
        fetchSeoPages();
      } else {
        setPageSaveError(data.message || 'Failed saving the page.');
      }
    } catch (err) {
      setPageSaveError('Server error saving dynamic page.');
    }
  };

  const handleDownloadListings = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(adminListings, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `bizsearch24_all_listings_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error('Failed to download database audit log:', err);
    }
  };

  const fetchSlugMappings = React.useCallback(async () => {
    try {
      const res = await fetch('/api/slug-mappings');
      const data = await res.json();
      if (data.success) {
        setSlugMappings(data.mappings);
      }
    } catch (err) {
      console.error('Error fetching dynamic slug maps:', err);
    }
  }, []);

  React.useEffect(() => {
    if (isAdminLoggedIn) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchSlugMappings();
    }
  }, [isAdminLoggedIn, fetchSlugMappings]);

  const handleSaveSlugMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    setMapError('');
    if (!mapSource || !mapTarget) {
      setMapError('Missing source or target parameter mappings.');
      return;
    }
    try {
      const isEdit = !!editingMapping;
      const url = '/api/slug-mappings';
      const method = isEdit ? 'PUT' : 'POST';
      const body = {
        id: editingMapping?.id,
        source: mapSource,
        target: mapTarget,
        type: mapType,
        active: mapActive
      };
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        fetchSlugMappings();
        setEditingMapping(null);
        setMapSource('');
        setMapTarget('');
        setMapType('subdomain');
        setMapActive(true);
      } else {
        setMapError(data.message || 'Error occurred saving mapping.');
      }
    } catch (err) {
      setMapError('Failed to map dynamic redirection with server.');
    }
  };

  const startEditSlugMapping = (m: any) => {
    setEditingMapping(m);
    setMapSource(m.source);
    setMapTarget(m.target);
    setMapType(m.type);
    setMapActive(m.active);
    setIsConfiguringSlugs(true);
    setMapError('');
  };

  const handleDeleteSlugMapping = async (id: string) => {
    if (!confirm('Are you of absolute consensus to revoke this custom mapping / redirection rules entry?')) return;
    try {
      const res = await fetch('/api/slug-mappings', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        fetchSlugMappings();
      }
    } catch (err) {
      console.error('Failed revoking route mapping:', err);
    }
  };

  // Category Icon Lookup
  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'emergency': return <ShieldAlert className="w-5 h-5 text-red-600" id="cat-icon-emergency" />;
      case 'health': return <HeartPulse className="w-5 h-5 text-emerald-600" id="cat-icon-health" />;
      case 'services': return <Briefcase className="w-5 h-5 text-blue-600" id="cat-icon-services" />;
      case 'food': return <Utensils className="w-5 h-5 text-amber-600" id="cat-icon-food" />;
      case 'automotive': return <Car className="w-5 h-5 text-indigo-600" id="cat-icon-automotive" />;
      case 'trades': return <Wrench className="w-5 h-5 text-orange-600" id="cat-icon-trades" />;
      case 'tourism': return <Palmtree className="w-5 h-5 text-cyan-600" id="cat-icon-tourism" />;
      case 'retail': return <ShoppingBag className="w-5 h-5 text-pink-600" id="cat-icon-retail" />;
      case 'construction': return <Hammer className="w-5 h-5 text-slate-600" id="cat-icon-construction" />;
      default: return <Briefcase className="w-5 h-5 text-gray-500" id="cat-icon-default" />;
    }
  };

  // Get active cities list based on province selection
  const provinceCities = CITIES_AND_TOWNS.filter(c => c.provinceId === selectedProvince);
  // Get active suburbs based on city selection
  const citySuburbs = CITIES_AND_TOWNS.find(c => c.id === selectedCity)?.suburbs || [];

  // Edit fields cascades
  const editProvinceCities = CITIES_AND_TOWNS.filter(c => c.provinceId === editProvince);
  const editCitySuburbs = CITIES_AND_TOWNS.find(c => c.id === editCity)?.suburbs || [];

  // Submit fields cascades
  const subProvinceCities = CITIES_AND_TOWNS.filter(c => c.provinceId === subProvince);
  const subCitySuburbs = CITIES_AND_TOWNS.find(c => c.id === subCity)?.suburbs || [];

  return (
    <div className="flex flex-col min-h-screen font-sans" id="apps-container">
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setActiveTab('explore'); setViewingPage(null); setActivePageSlug(null); }} id="logo-block">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20" id="logo-icon">
              <Search className="w-6 h-6 text-white" id="logo-search" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight" id="logo-title">
                <span className="text-white font-black text-2xl inline-block mr-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_1.5px_1.5px_0_#10b981,_-1.5px_-1.5px_0_#10b981,_1.5px_-1.5px_0_#10b981,_-1.5px_1.5px_0_#10b981]">B</span>iz<span className="text-emerald-500 font-black text-2xl inline-block mx-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_1.5px_1.5px_0_#000,_-1.5px_-1.5px_0_#000,_1.5px_-1.5px_0_#000,_-1.5px_1.5px_0_#000]">S</span>earch24
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-slate-400 -mt-0.5" id="logo-sub">SOUTH AFRICA</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" id="desktop-nav">
            <button 
              id="nav-btn-explore"
              onClick={() => { setActiveTab('explore'); setViewingPage(null); setActivePageSlug(null); }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === 'explore' 
                  ? "bg-slate-100 text-emerald-700 shadow-inner" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              Explore Directory
            </button>
            <button 
              id="nav-btn-submit"
              onClick={() => { setActiveTab('submit'); setViewingPage(null); }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === 'submit' 
                  ? "bg-slate-100 text-emerald-700 shadow-inner" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              Submit Business
            </button>
            <button 
              id="nav-btn-pages"
              onClick={() => { setActiveTab('pages'); if (seoPages.length > 0 && !viewingPage) handlePageSelect(seoPages[0].slug); }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === 'pages' 
                  ? "bg-slate-100 text-emerald-700 shadow-inner" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              SEO Local Guides
            </button>

            <Link
              id="nav-link-news"
              href="/news"
              className="px-4 py-2 rounded-lg text-sm text-slate-650 hover:text-slate-900 hover:bg-slate-50 font-semibold transition-all duration-200"
            >
              SA News Feed
            </Link>

            <Link
              id="nav-link-sitemap"
              href="/sitemap"
              className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-semibold transition-all duration-200"
            >
              Visual Sitemap
            </Link>
            
            <div className="w-[1px] h-6 bg-slate-200 mx-2" id="nav-divider" />

            {isAdminLoggedIn ? (
              <button 
                id="nav-btn-admin-dash"
                onClick={() => { setActiveTab('admin'); setViewingPage(null); }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-2 border shadow-xs transition-all",
                  activeTab === 'admin'
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                )}
              >
                <Settings className="w-4 h-4 animate-spin-slow text-emerald-600" id="settings-spin" />
                <span>My Dashboard</span>
              </button>
            ) : (
              <button 
                id="nav-btn-admin-login"
                onClick={() => { setActiveTab('admin'); setViewingPage(null); }}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-all duration-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50"
                )}
              >
                <LogIn className="w-4 h-4 text-emerald-600" id="login-icon-nav" />
                <span>Sign In / Register</span>
              </button>
            )}
          </nav>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center" id="mobile-menu-trigger-container">
            <button
              id="mobile-menu-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" id="hamb-x" /> : <Menu className="w-6 h-6" id="hamb-menu" />}
            </button>
          </div>
        </div>

        {/* MOBILE NAV MENU */}
        <AnimatePresence mode="wait">
          {mobileMenuOpen && (
            <motion.div
              id="mobile-dropdown-container"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-xl px-4 py-4 md:hidden"
            >
              <div className="flex flex-col space-y-2" id="mobile-nav-items">
                <button
                  id="mob-nav-explore"
                  onClick={() => { setActiveTab('explore'); setViewingPage(null); setMobileMenuOpen(false); }}
                  className={cn(
                    "text-left px-4 py-3 rounded-lg text-base font-medium",
                    activeTab === 'explore' ? "bg-slate-100 text-emerald-750" : "text-slate-600"
                  )}
                >
                  Explore Directory
                </button>
                <button
                  id="mob-nav-submit"
                  onClick={() => { setActiveTab('submit'); setViewingPage(null); setMobileMenuOpen(false); }}
                  className={cn(
                    "text-left px-4 py-3 rounded-lg text-base font-medium",
                    activeTab === 'submit' ? "bg-slate-100 text-emerald-700" : "text-slate-600"
                  )}
                >
                  Submit Your Business
                </button>
                <button
                  id="mob-nav-pages"
                  onClick={() => { setActiveTab('pages'); if (seoPages.length > 0 && !viewingPage) handlePageSelect(seoPages[0].slug); else setMobileMenuOpen(false); }}
                  className={cn(
                    "text-left px-4 py-3 rounded-lg text-base font-medium",
                    activeTab === 'pages' ? "bg-slate-100 text-emerald-750" : "text-slate-600"
                  )}
                >
                  SEO Local Guides
                </button>
                
                <Link
                  id="mob-nav-news"
                  href="/news"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left px-4 py-3 rounded-lg text-base font-semibold text-emerald-600 hover:bg-emerald-50/50"
                >
                  SA News Feed
                </Link>
                
                <Link
                  id="mob-nav-sitemap"
                  href="/sitemap"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-left px-4 py-3 rounded-lg text-base font-medium text-slate-650 hover:bg-slate-50"
                >
                  Visual Sitemap
                </Link>

                <div className="h-[1.5px] bg-slate-100 my-1" id="mob-nav-div" />
                {isAdminLoggedIn ? (
                  <button
                    id="mob-nav-admin-logged"
                    onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                    className="text-left px-4 py-3 rounded-lg text-base font-semibold text-emerald-700 bg-emerald-50 flex items-center justify-between"
                  >
                    <span>My Dashboard</span>
                    <Settings className="w-4 h-4 animate-spin-slow" id="mob-admin-spin" />
                  </button>
                ) : (
                  <button
                    id="mob-nav-admin-login"
                    onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                    className="text-left px-4 py-3 rounded-lg text-base font-bold text-slate-700 flex items-center space-x-2 bg-emerald-50/40 text-emerald-800"
                  >
                    <LogIn className="w-5 h-5 text-emerald-600" id="mob-login-icon" />
                    <span>Sign In / Register</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* CORE WRAPPER */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8" id="main-content-area">
        <AnimatePresence mode="wait">
          
          {/* EXPLORE DIRECTORY VIEW */}
          {activeTab === 'explore' && (
            <motion.div
              key="explore-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
              id="explore-window"
            >
              {/* HERO CALLOUT */}
              <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden" id="hero-banner">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16" id="banner-orb" />
                <div className="relative z-10 max-w-2xl space-y-4" id="banner-text">
                  <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-350 px-3 py-1 rounded-full text-xs font-semibold" id="b-tag">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" id="spark-hero" />
                    <span>South Africa Directory</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight" id="hero-heading">
                    Find Verified Local Businesses <br className="hidden sm:inline" />
                    <span className="text-emerald-400">in South Africa</span>
                  </h1>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal" id="hero-para">
                    Easily search for verified local services, shops, and professionals near you.
                  </p>
                  <div className="flex items-center space-x-6 text-xs text-slate-400 font-mono pt-2" id="hero-stat-bars">
                    <div>
                      <span className="block text-xl font-bold text-white" id="stat-total">{totalListingsCount}</span>
                      <span>COMPANIES</span>
                    </div>
                    <div className="w-[1.5px] h-8 bg-slate-700/50" />
                    <div>
                      <span className="block text-xl font-bold text-emerald-400" id="stat-verified">{verifiedListingsCount}</span>
                      <span>APPROVED & ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE SOUTH AFRICA SEARCH CONSOLE */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-4 md:space-y-4" id="search-filter-box">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3" id="filters-header-row">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center space-x-1.5" id="lbl-geo-filters">
                    <span>Geographic Filters</span>
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[9.5px] font-mono font-bold">ALL SA REGIONS</span>
                  </h2>
                  <button
                    id="toggle-location-typing-btn"
                    type="button"
                    onClick={() => {
                      setManualLocationMode(!manualLocationMode);
                      setSelectedCity('');
                      setSelectedSuburb('');
                      fetchListings(term, selectedProvince, '', '', selectedCategory);
                    }}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center space-x-1 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{manualLocationMode ? "← Select from list menus" : "✍️ Custom Town/Suburb manual search mode"}</span>
                  </button>
                </div>

                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3" id="filters-form">
                  <div className="md:col-span-4 relative" id="search-field">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" id="filt-search-ico" />
                    <input
                      id="search-input-term"
                      type="text"
                      placeholder="e.g. Solar Geyser, Plumbers, Medical Clinic..."
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="md:col-span-2" id="province-select-field">
                    <select
                      id="search-select-province"
                      value={selectedProvince}
                      onChange={handleProvinceChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-700"
                    >
                      <option value="">All Provinces (SA)</option>
                      {PROVINCES.map(p => (
                        <option id={`prov-opt-${p.id}`} key={p.id} value={p.id}>{p.name} ({p.code})</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2" id="city-select-field">
                    {manualLocationMode ? (
                      <input
                        id="search-input-city"
                        type="text"
                        placeholder="Type City/Town..."
                        value={selectedCity}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedCity(val);
                          setSelectedSuburb('');
                          fetchListings(term, selectedProvince, val, '', selectedCategory);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-700 placeholder:text-slate-400"
                      />
                    ) : (
                      <select
                        id="search-select-city"
                        value={selectedCity}
                        disabled={!selectedProvince}
                        onChange={handleCityChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-705 disabled:opacity-50"
                      >
                        <option value="">All Towns & Cities</option>
                        {provinceCities.map(c => (
                          <option id={`city-opt-${c.id}`} key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="md:col-span-2" id="suburb-select-field">
                    {manualLocationMode ? (
                      <input
                        id="search-input-suburb"
                        type="text"
                        placeholder="Type Suburb/Area..."
                        value={selectedSuburb}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedSuburb(val);
                          fetchListings(term, selectedProvince, selectedCity, val, selectedCategory);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-700 placeholder:text-slate-400"
                      />
                    ) : (
                      <select
                        id="search-select-suburb"
                        value={selectedSuburb}
                        disabled={!selectedCity}
                        onChange={handleSuburbChange}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-700 disabled:opacity-50"
                      >
                        <option value="">All Suburbs</option>
                        {citySuburbs.map(suburb => (
                          <option id={`suburb-opt-${suburb}`} key={suburb} value={suburb}>{suburb}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="md:col-span-2 flex space-x-2" id="search-action-btns">
                    <button
                      id="search-btn-run"
                      type="submit"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/10"
                    >
                      <span>Search</span>
                    </button>
                    {(term || selectedProvince || selectedCategory) && (
                      <button
                        id="search-btn-clear"
                        type="button"
                        onClick={handleClearFilters}
                        title="Clear all filters"
                        className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all text-slate-650"
                      >
                        <RefreshCw className="w-4 h-4" id="clear-refresh" />
                      </button>
                    )}
                  </div>
                </form>

                {/* CATEGORIES HORIZONTAL SELECTIONS BOARD */}
                <div className="border-t border-slate-100 pt-4" id="category-scroller-panel">
                  <span className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5" id="cat-scroll-title">Business Categories</span>
                  <div className="flex flex-wrap gap-2" id="category-button-group">
                    {CATEGORIES.map(cat => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          id={`cat-btn-${cat.id}`}
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className={cn(
                            "px-4 py-2.5 rounded-full text-xs font-medium cursor-pointer transition-all duration-200 border flex items-center space-x-2 focus:ring-1 focus:ring-emerald-500",
                            isSelected 
                              ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" 
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                          )}
                        >
                          <span className={cn("inline-flex shrink-0 p-0.5 rounded-md", isSelected ? "text-white" : "text-emerald-600")}>
                            {getCategoryIcon(cat.id)}
                          </span>
                          <span>{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* LISTINGS RESULTS */}
              <div id="directory-results-container">
                <div className="flex items-center justify-between mb-4" id="results-count-bar">
                  <h2 className="text-xl font-bold tracking-tight text-slate-800" id="dir-results-title">
                    {loadingListings ? 'Scanning SA Directory...' : `Directory Findings (${listings.length})`}
                  </h2>
                  <span className="text-xs text-slate-450 font-mono" id="results-local-time">Johannesburg (GMT+2)</span>
                </div>

                {/* GEOLOCATION SPONSORED PROMOTIONS */}
                {adsList && adsList.length > 0 && (
                  <div className="mb-6 bg-amber-50/40 border border-amber-200/50 rounded-2xl p-5 space-y-3" id="proximity-ads-showcase">
                    <div className="flex items-center justify-between" id="ads-showcase-head">
                      <div className="flex items-center space-x-1.5 text-xs font-black uppercase text-amber-805 tracking-wider">
                        <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-ping shrink-0" />
                        <span>Premium Directory Partners</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">geotargeted match</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in" id="premium-ads-grid">
                      {adsList.map(ad => (
                        <a
                          id={`sponsored-ad-card-${ad.id}`}
                          href={ad.targetUrl || '#'}
                          target={ad.targetUrl && ad.targetUrl.startsWith('http') ? '_blank' : '_self'}
                          rel="noreferrer"
                          key={ad.id}
                          onClick={() => {
                            trackVisitActivity('click', '/explore', {
                              adClick: { id: ad.id, title: ad.title }
                            });
                          }}
                          className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex h-28 group relative"
                        >
                          <div className="w-1/3 relative bg-slate-50 shrink-0">
                            {/* Visual ad of any dimension rendered of any size dynamically */}
                            <img
                              src={ad.imageUrl}
                              alt={ad.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                            />
                            <div className="absolute bottom-1 right-1 bg-black/75 px-1 py-0.5 rounded text-[8px] font-bold uppercase text-white font-mono tracking-wider">
                              SPONSOR
                            </div>
                          </div>
                          <div className="p-3.5 flex flex-col justify-between w-2/3">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between gap-1.5">
                                <h4 className="font-extrabold text-sm text-slate-900 line-clamp-1 group-hover:text-amber-800 transition-colors">
                                  {ad.title}
                                </h4>
                                {ad.badge && ad.badge !== 'standard' && (
                                  <span className={cn(
                                    "text-[8px] font-mono font-black px-1 py-0.5 rounded uppercase tracking-wider shrink-0",
                                    ad.badge === 'premium-verified' && "bg-amber-100 text-amber-800 border border-amber-200",
                                    ad.badge === 'premium' && "bg-amber-50 text-amber-700 border border-amber-100",
                                    ad.badge === 'verified' && "bg-emerald-50 text-emerald-800 border border-emerald-100"
                                  )}>
                                    {ad.badge.replace('-', ' ')}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                {ad.description || 'Verified local vendor on Bizsearch24. Secure premium service offerings, catalogs, & phone hotlines.'}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-amber-700 font-extrabold flex items-center space-x-1 underline">
                                <span>Redeem Promotion</span>
                                <span>→</span>
                              </span>
                              {ad.alwaysOnTop && (
                                <span className="text-[8px] text-amber-600 font-mono font-bold bg-amber-50 px-1 rounded">
                                  PRIORITY ALWAYS-ON-TOP
                                </span>
                              )}
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {loadingListings ? (
                  <div className="py-24 text-center space-y-3" id="loading-spinner-block">
                    <RefreshCw className="w-10 h-10 animate-spin text-emerald-650 mx-auto" id="spin-main" />
                    <p className="text-slate-500 text-sm font-mono animate-pulse" id="loading-text">Synchronizing high-speed local indices...</p>
                  </div>
                ) : listings.length === 0 ? (
                  <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-16 px-4 text-center" id="empty-results-fallback">
                    <ShieldAlert className="w-12 h-12 text-slate-350 mx-auto mb-3" id="fallback-shield" />
                    <h3 className="text-lg font-bold text-slate-800" id="fallback-title">No Verified Listings Found</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1 leading-relaxed" id="fallback-desc">
                      We couldn&apos;t locate active businesses matching those specific criteria. Try adjusting filters or register your own company!
                    </p>
                    <button
                      id="fallback-btn-goto-sub"
                      onClick={() => setActiveTab('submit')}
                      className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all"
                    >
                      Submit Your Brand
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="listings-grid">
                    {listings.map((l, index) => {
                      const provObj = PROVINCES.find(p => p.id === l.province);
                      const cityObj = CITIES_AND_TOWNS.find(c => c.id === l.city);
                      const catObj = CATEGORIES.find(c => c.id === l.category);
                      
                      return (
                        <motion.div
                          id={`listing-card-${l.id}`}
                          key={l.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min(index * 0.05, 0.4) }}
                          onClick={() => handleListingClick(l)}
                          className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-slate-300/60 cursor-pointer transition-all duration-300 flex flex-col justify-between group"
                        >
                          <div>
                            {/* Listing visual block overlay */}
                            <div className="relative h-44 w-full bg-slate-100 overflow-hidden" id={`card-image-wrap-${l.id}`}>
                              {/* Background placeholder or Picsum link */}
                              <img
                                id={`card-img-${l.id}`}
                                src={l.image || `https://picsum.photos/seed/${l.id}/800/600`}
                                alt={l.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs flex items-center space-x-1" id={`card-category-badge-${l.id}`}>
                                <span className="p-0.5 rounded-sm overflow-hidden text-emerald-600 block shrink-0 bg-emerald-50">
                                  {getCategoryIcon(l.category)}
                                </span>
                                <span className="text-slate-700">{catObj?.name || l.category}</span>
                              </div>

                              <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5" id={`card-verified-container-${l.id}`}>
                                {l.verified ? (
                                  <div className="bg-emerald-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs flex items-center space-x-1" id={`card-verified-badge-${l.id}`}>
                                    <CheckCircle2 className="w-3.5 h-3.5" id={`card-verified-chk-${l.id}`} />
                                    <span>Verified</span>
                                  </div>
                                ) : (
                                  <div className="bg-slate-900/85 backdrop-blur-xs text-slate-200 border border-slate-700/50 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs flex items-center space-x-1" id={`card-unverified-badge-${l.id}`}>
                                    <AlertTriangle className="w-3 h-3 text-amber-500 animate-pulse" id={`card-unverified-warn-${l.id}`} />
                                    <span>Not Verified</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="p-5 space-y-2.5" id={`card-body-${l.id}`}>
                              <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 text-base leading-tight" id={`card-title-${l.id}`}>
                                {l.name}
                              </h3>
                              <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed" id={`card-desc-${l.id}`}>
                                {l.description}
                              </p>
                              
                              <div className="flex flex-wrap gap-1 pt-1.5" id={`card-tags-${l.id}`}>
                                {l.tags.slice(0, 3).map((tag, tIdx) => (
                                  <span id={`card-tag-${l.id}-${tIdx}`} key={tag} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-mono leading-none">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="px-5 py-4 border-t border-slate-50 flex items-center justify-between text-slate-500 text-xs bg-slate-50/30 font-mono" id={`card-footer-${l.id}`}>
                            <div className="flex items-center space-x-1 text-slate-600" id={`card-footer-location-${l.id}`}>
                              <MapPin className="w-3.5 h-3.5 text-emerald-500" id={`card-footer-map-pin-${l.id}`} />
                              <span className="line-clamp-1 text-[11px]">
                                {l.suburb ? `${l.suburb}, ` : ''}{cityObj?.name || l.city} ({provObj?.code})
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-slate-400 font-mono text-[10px]" id={`card-footer-views-${l.id}`}>
                              <Eye className="w-3.5 h-3.5 text-slate-400" id={`card-footer-eye-${l.id}`} />
                              <span>{l.views || 0}</span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* DYNAMIC SEO LINK CAROUSEL BAR (South Africa Specific) */}
              {seoPages.length > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5" id="seo-links-carousel">
                  <div className="flex items-center justify-between mb-3" id="seo-links-header">
                    <span className="text-xs font-mono font-bold tracking-wider text-emerald-800 uppercase flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" id="seo-spark" />
                      <span>Optimized SEO Regional Guides</span>
                    </span>
                    <button id="seo-view-all-btn" onClick={() => setActiveTab('pages')} className="text-xs font-semibold text-emerald-700 hover:underline flex items-center space-x-0.5">
                      <span>View Guides</span>
                      <ChevronRight className="w-3 h-3" id="seo-view-arrow" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="seo-pages-box">
                    {seoPages.slice(0, 2).map(page => (
                      <div
                        id={`seo-page-strip-${page.id}`}
                        key={page.id}
                        onClick={() => handlePageSelect(page.slug)}
                        className="bg-white hover:bg-emerald-50 border border-emerald-200/50 p-4 rounded-xl cursor-pointer shadow-xs hover:border-emerald-500 transition-all flex items-center justify-between"
                      >
                        <div className="space-y-1" id={`seo-strip-body-${page.id}`}>
                          <h4 className="text-slate-800 font-bold text-xs" id={`seo-strip-title-${page.id}`}>{page.title}</h4>
                          <p className="text-slate-500 text-[10px] line-clamp-1" id={`seo-strip-desc-${page.id}`}>{page.metaDescription}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-emerald-500 shrink-0 ml-2" id={`seo-strip-arrow-${page.id}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* PUBLIC BUSINESS SUBMISSION VIEW */}
          {activeTab === 'submit' && (
            <motion.div
              key="submit-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
              id="submission-form-container"
            >
              <div className="space-y-1.5 border-b border-secondary/20 pb-4" id="sub-header-block">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900" id="sub-title">Register Your S.A. Business</h1>
                <p className="text-slate-500 text-xs sm:text-sm" id="sub-desc">
                  Increase your Google search ranking and show clients you are a verified business.
                </p>
              </div>

              {submissionSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm flex items-start space-x-2" id="sub-success-banner">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" id="sub-succ-icon" />
                  <div id="sub-succ-banner-text">
                    <p className="font-bold">Submission Confirmed</p>
                    <p className="text-slate-600 text-xs mt-1">{submissionSuccess}</p>
                  </div>
                </div>
              )}

              {submissionError && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm flex items-start space-x-2" id="sub-error-banner">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" id="sub-err-icon" />
                  <p className="font-medium text-xs sm:text-sm">{submissionError}</p>
                </div>
              )}

              <form onSubmit={handlePublicSubmit} className="space-y-4" id="pub-submission-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="pub-names-grid">
                  <div className="space-y-1" id="sub-name-f">
                    <label id="lbl-sub-name" className="text-xs font-bold text-slate-705">Company Name <span className="text-red-500">*</span></label>
                    <input
                      id="input-sub-name"
                      type="text"
                      required
                      placeholder="e.g. Durban Sealing Services"
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1" id="sub-category-f">
                    <label id="lbl-sub-category" className="text-xs font-bold text-slate-700">Service Category <span className="text-red-500">*</span></label>
                    <select
                      id="select-sub-category"
                      required
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-slate-700"
                    >
                      <option value="">Select Focus Field</option>
                      {CATEGORIES.map(c => (
                        <option id={`sub-cat-opt-${c.id}`} key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1" id="sub-desc-f">
                  <label id="lbl-sub-desc" className="text-xs font-bold text-slate-70D">Brief Business Profile</label>
                  <textarea
                    id="textarea-sub-desc"
                    rows={3}
                    placeholder="Provide details about your SABS certifications, materials used, areas of operation, and unique offerings."
                    value={subDesc}
                    onChange={(e) => setSubDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-1" id="sub-geo-header">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">Geographical Identity</span>
                  <button
                    id="btn-toggle-sub-manual"
                    type="button"
                    onClick={() => {
                      setSubManualMode(!subManualMode);
                      setSubCity('');
                      setSubSuburb('');
                    }}
                    className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center space-x-1 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse shrink-0" />
                    <span>{subManualMode ? "← Use dropdown lists" : "✍️ Can't find your area? Type town/suburb manually"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="pub-geo-grid">
                  <div className="space-y-1" id="sub-province-f">
                    <label id="lbl-sub-province" className="text-xs font-bold text-slate-700">Province <span className="text-red-500">*</span></label>
                    <select
                      id="select-sub-province"
                      required
                      value={subProvince}
                      onChange={(e) => { setSubProvince(e.target.value); setSubCity(''); setSubSuburb(''); }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-slate-700"
                    >
                      <option value="">Choose Province</option>
                      {PROVINCES.map(p => (
                        <option id={`sub-prov-opt-${p.id}`} key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1" id="sub-city-f">
                    <label id="lbl-sub-city" className="text-xs font-bold text-slate-700">Town / City <span className="text-red-500">*</span></label>
                    {subManualMode ? (
                      <input
                        id="input-sub-city-manual"
                        type="text"
                        required
                        placeholder="e.g. Graaff-Reinet, Nelspruit, Ladysmith..."
                        value={subCity}
                        onChange={(e) => { setSubCity(e.target.value); setSubSuburb(''); }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                      />
                    ) : (
                      <select
                        id="select-sub-city"
                        required
                        disabled={!subProvince}
                        value={subCity}
                        onChange={(e) => { setSubCity(e.target.value); setSubSuburb(''); }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-slate-700 disabled:opacity-50"
                      >
                        <option value="">Choose City</option>
                        {subProvinceCities.map(c => (
                          <option id={`sub-city-opt-${c.id}`} key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-1" id="sub-suburb-f">
                    <label id="lbl-sub-suburb" className="text-xs font-bold text-slate-700">Suburb / Region</label>
                    {subManualMode ? (
                      <input
                        id="input-sub-suburb-manual"
                        type="text"
                        placeholder="e.g. Town Centre, Bergsig, Wild Olive..."
                        value={subSuburb}
                        onChange={(e) => setSubSuburb(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                      />
                    ) : (
                      <select
                        id="select-sub-suburb"
                        disabled={!subCity}
                        value={subSuburb}
                        onChange={(e) => setSubSuburb(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all text-slate-700 disabled:opacity-50"
                      >
                        <option value="">Select Suburb</option>
                        {subCitySuburbs.map(suburb => (
                          <option id={`sub-sub-opt-${suburb}`} key={suburb} value={suburb}>{suburb}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div className="space-y-1" id="sub-address-f">
                  <label id="lbl-sub-address" className="text-xs font-bold text-slate-700">Physical Address <span className="text-red-500">*</span></label>
                  <input
                    id="input-sub-address"
                    type="text"
                    required
                    placeholder="e.g. 12 Berea Office Block, Durban North"
                    value={subAddress}
                    onChange={(e) => setSubAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="pub-contact-grid">
                  <div className="space-y-1" id="sub-phone-f">
                    <label id="lbl-sub-phone" className="text-xs font-bold text-slate-702">Phone Hotlines</label>
                    <input
                      id="input-sub-phone"
                      type="tel"
                      placeholder="e.g. +27 (31) 555-5000"
                      value={subPhone}
                      onChange={(e) => setSubPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1" id="sub-email-f">
                    <label id="lbl-sub-email" className="text-xs font-bold text-slate-703">Enquiry Email</label>
                    <input
                      id="input-sub-email"
                      type="email"
                      placeholder="e.g. client@sealingco.co.za"
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-1" id="sub-website-f">
                    <label id="lbl-sub-website" className="text-xs font-bold text-slate-704">Web Link (HTTPS)</label>
                    <input
                      id="input-sub-website"
                      type="url"
                      placeholder="e.g. https://www.sealingco.co.za"
                      value={subWebsite}
                      onChange={(e) => setSubWebsite(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-1" id="sub-tags-f">
                  <label id="lbl-sub-tags" className="text-xs font-bold text-slate-70D">Search Keywords & Tags (separated by commas)</label>
                  <input
                    id="input-sub-tags"
                    type="text"
                    placeholder="e.g. roofing, sealers, damp proofing, renovations"
                    value={subTags}
                    onChange={(e) => setSubTags(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                  />
                  <span className="block text-[10px] text-slate-400 font-mono">Enables targeted searches for local consumers</span>
                </div>

                <button
                  id="pub-submit-action-btn"
                  type="submit"
                  disabled={submittingUser}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-99 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-600/10 disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {submittingUser ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" id="sub-spin" />
                      <span>Writing Cloud Submission...</span>
                    </>
                  ) : (
                    <span>Register Business Listing</span>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* DYNAMIC SEO GUIDES VIEW */}
          {activeTab === 'pages' && (
            <motion.div
              key="pages-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-8"
              id="pages-view-layout"
            >
              {/* Left sidebar for pages selector */}
              <div className="md:col-span-1 bg-white border border-slate-200 rounded-2xl p-4 h-fit space-y-3" id="pages-selector-side">
                <h3 className="text-xs font-mono font-bold tracking-wider text-slate-405 uppercase border-b pb-2 px-1" id="side-guides-title">Regional Guides</h3>
                {seoPages.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center font-mono" id="side-no-guides">No guides compiled yet.</p>
                ) : (
                  <div className="flex flex-col space-y-1.5" id="side-pages-stack">
                    {seoPages.map(page => (
                      <button
                        id={`pages-list-btn-${page.slug}`}
                        key={page.id}
                        onClick={() => handlePageSelect(page.slug)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold leading-normal transition-all",
                          activePageSlug === page.slug
                            ? "bg-slate-100 text-emerald-800 shadow-inner"
                            : "text-slate-650 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        {page.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Page content display */}
              <div className="md:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs" id="pages-content-box">
                {viewingPage ? (
                  <div className="space-y-6" id="guide-layout">
                    {/* Simulated Breadcrumbs */}
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono" id="sim-breadcrumbs">
                      <span>BIZSEARCH24.CO.ZA</span>
                      <ChevronRight className="w-3 h-3" id="crumb-arrow-1" />
                      <span className="uppercase text-emerald-650 font-bold">LOCAL GUIDES</span>
                      <ChevronRight className="w-3 h-3" id="crumb-arrow-2" />
                      <span className="line-clamp-1">{viewingPage.title}</span>
                    </div>

                    <div className="space-y-2 border-b border-slate-100 pb-5" id="guide-title-block">
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-905" id="guide-primary-h">{viewingPage.title}</h1>
                      <p className="text-slate-500 text-xs sm:text-sm font-mono" id="guide-meta-sub">Google Indexed Meta Description: <span className="italic">&quot;{viewingPage.metaDescription}&quot;</span></p>
                    </div>

                    {/* Content text */}
                    <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-wrap" id="guide-body-text">
                      {viewingPage.content}
                    </div>

                    {/* Interactive search CTA directly within the local SEO guides page */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 mt-8 flex flex-col sm:flex-row items-center justify-between sm:space-x-4" id="guide-cta-panel">
                      <div className="space-y-1 mb-4 sm:mb-0 text-center sm:text-left" id="guide-cta-labels">
                        <h4 className="text-emerald-900 font-extrabold text-sm" id="guide-cta-h">Looking for services from this guide?</h4>
                        <p className="text-slate-600 text-xs" id="guide-cta-p">Launch our rapid directory finder and connect with local verified providers immediately.</p>
                      </div>
                      <button
                        id="guide-cta-btn"
                        onClick={() => setActiveTab('explore')}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 shrink-0"
                      >
                        Enter Directory Finder
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-24 text-center space-y-4" id="viewing-page-loading">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto" id="no-guide-file" />
                    <h3 className="text-base font-bold text-slate-700" id="no-guide-h">No Guides Active</h3>
                    <p className="text-slate-500 text-xs max-w-sm mx-auto" id="no-guide-p">Select an organic guide from the left directory strip or check submission lists.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ADMIN PORTAL PANEL */}
          {activeTab === 'admin' && (
            <motion.div
              key="admin-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
              id="admin-window"
            >
              {!isAdminLoggedIn ? (
                /* User Login Section */
                <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6" id="user-login-wrapper">
                  <div className="text-center space-y-2" id="login-head-text">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto" id="login-head-icon">
                      <LogIn className="w-6 h-6 text-emerald-600" id="login-set-ico" />
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-900" id="login-prompt-title">{isRegistering ? 'Create Your Account' : 'Log In to Bizsearch24'}</h1>
                    <p className="text-slate-500 text-xs leading-relaxed" id="login-prompt-desc">
                      {isRegistering ? 'Sign up to submit business listings, manage your profile, and receive analytics.' : 'Access your dashboard, manage your listings, and view your traffic analytics.'}
                    </p>
                  </div>
                  {authError && (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-start space-x-2" id="login-error-card">
                      <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" id="login-error-card-ico" />
                      <p className="font-semibold text-[11px] leading-normal">{authError}</p>
                    </div>
                  )}

                  <form onSubmit={show2FA ? handle2FASubmit : handleAdminLogin} className="space-y-4" id="login-auth-form">
                    {show2FA ? (
                      <div className="space-y-4">
                        {requires2FASetup && qrCodeData && (
                          <div className="flex flex-col items-center">
                            <p className="text-xs text-slate-500 mb-2 font-semibold">Keep your account safe from hackers!</p>
                            <p className="text-xs text-slate-500 mb-2">Scan this QR code with Google Authenticator:</p>
                            <img src={qrCodeData} alt="2FA QR Code" className="mb-2 border p-2 rounded-lg shadow-sm" />
                            <p className="text-[10px] font-mono text-slate-400 bg-slate-50 p-2 rounded-md">Secret: {setupSecret}</p>
                          </div>
                        )}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Enter Google Authenticator Code</label>
                          <input
                            type="text"
                            value={mfaToken}
                            onChange={(e) => setMfaToken(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono tracking-widest text-center"
                            placeholder="000000"
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1" id="login-user-f">
                          <label id="lbl-login-user" className="text-xs font-bold text-slate-700">Email Address</label>
                          <input
                            id="input-login-username"
                            type="email"
                            required
                            placeholder="your@email.com"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                          />
                        </div>

                        <div className="space-y-1" id="login-pass-f">
                          <label id="lbl-login-pass" className="text-xs font-bold text-slate-700">Password</label>
                          <input
                            id="input-login-password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                          />
                        </div>
                      </>
                    )}

                    <button
                      id="login-submit-action-btn"
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-99 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10 disabled:opacity-50 flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      {isAuthenticating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-white" id="login-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <span>{show2FA ? 'Verify 2FA' : (isRegistering ? 'Create Account' : 'Sign In')}</span>
                      )}
                    </button>

                    {show2FA && (
                      <button
                        type="button"
                        onClick={() => {
                          setShow2FA(false);
                          setRequires2FASetup(false);
                          setMfaToken('');
                        }}
                        className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 font-semibold hover:underline mt-2 text-center block cursor-pointer"
                      >
                        Cancel Verification
                      </button>
                    )}
                  </form>
                  {!show2FA && (
                    <div className="mt-4 text-center">
                      <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                        {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register Now'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Authenticated Core Dashboard */
                <div className="space-y-8" id="user-authenticated-dashboard">
                  <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" id="admin-dash-banner">
                    <div className="space-y-1" id="admin-info-labels">
                      <div className="flex items-center space-x-2" id="admin-badge-row">
                        <span className="bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold">{userRole === 'ADMIN' ? 'Secure Root Session' : 'User Account Dashboard'}</span>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" id="admin-ping-dot" />
                      </div>
                      <h1 className="text-xl md:text-2xl font-extrabold tracking-tight" id="admin-greeting-title">{userRole === 'ADMIN' ? 'Directory Command Center' : 'Your Business Dashboard'}</h1>
                      <p className="text-slate-400 text-xs font-mono" id="admin-ip-sub">Bizsearch24 local engine authorized</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0" id="admin-banner-actions">
                      {userRole === 'ADMIN' && (
                        <button
                          id="admin-btn-download"
                          onClick={handleDownloadListings}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-md shadow-emerald-600/10"
                          title="Download raw database structured listings payload"
                        >
                          <Download className="w-4 h-4 text-white" />
                          <span>Export Listings JSON Data</span>
                        </button>
                      )}

                      <button
                        id="admin-btn-logout-act"
                        onClick={handleLogout}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:scale-98 text-slate-200 rounded-xl text-xs font-semibold transition-all border border-slate-700 flex items-center space-x-1.5"
                      >
                        <LogOut className="w-4 h-4 text-slate-400" id="logout-icon-btn" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>

                  {/* USER vs ADMIN DASHBOARD CONTENT */}
                  {userRole === 'ADMIN' ? (
                    <>
                      {/* QUICK CONSOLE DIRECTORY STATS */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="admin-stats-grid">
                        <div className="bg-white border p-5 rounded-xl text-center" id="stat-card-total">
                          <span className="block text-slate-400 text-[10px] font-mono tracking-wider uppercase mb-1">Total Submissions</span>
                          <span className="text-2xl font-black text-slate-800" id="stat-total-val">{adminListings.length}</span>
                        </div>
                        <div className="bg-white border p-5 rounded-xl text-center" id="stat-card-pending">
                          <span className="block text-amber-650 text-[10px] font-mono tracking-wider uppercase mb-1">Pending Approval</span>
                          <span className="text-2xl font-black text-amber-500" id="stat-pending-val">{adminListings.filter(l => !l.verified).length}</span>
                        </div>
                        <div className="bg-white border p-5 rounded-xl text-center" id="stat-card-active-pages">
                          <span className="block text-emerald-850 text-[10px] font-mono tracking-wider uppercase mb-1">Dynamic SEO Pages</span>
                          <span className="text-2xl font-black text-emerald-600" id="stat-pages-val">{seoPages.length}</span>
                        </div>
                        <div className="bg-white border p-5 rounded-xl text-center" id="stat-card-traffic">
                          <span className="block text-slate-400 text-[10px] font-mono tracking-wider uppercase mb-1">Aggregate Views</span>
                          <span className="text-2xl font-black text-slate-800" id="stat-views-val">{adminListings.reduce((sum, item) => sum + (item.views || 0), 0)}</span>
                        </div>
                      </div>

                      {/* SUPREME ADMINISTRATIVE POWERS & BULK CONTROLS */}
                      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 border border-emerald-500/30 shadow-lg space-y-4" id="admin-bulk-powers-panel">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-3" id="admin-powers-header">
                          <div className="space-y-1" id="admin-powers-h-labels">
                            <div className="flex items-center space-x-2">
                              <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider font-extrabold flex items-center gap-1">
                                <ShieldAlert className="w-3 h-3" />
                                <span>Supreme Power Actions</span>
                              </span>
                              <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase">DB-Direct Write</span>
                            </div>
                            <h2 className="text-sm font-extrabold tracking-tight">God-Mode Database Overrides & Bulk Utilities</h2>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">authorized: NIC6604211989!?</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5" id="admin-powers-grid">
                          {/* ACTION 1: BOOST ORGANIC VIEWS */}
                          <button
                            type="button"
                            id="power-btn-boost-views"
                            onClick={() => handleBulkAction('boost_views')}
                            className="bg-slate-850/60 hover:bg-slate-800 border border-slate-700 hover:border-emerald-600 rounded-xl p-4 text-left transition-all group flex flex-col justify-between h-32 cursor-pointer relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors" />
                            <div className="flex items-center space-x-2 text-emerald-400 group-hover:text-emerald-350 transition-colors">
                              <TrendingUp className="w-5 h-5" />
                              <span className="text-xs font-black uppercase tracking-wider font-mono">Organic Traffic Boost</span>
                            </div>
                            <div className="space-y-1 mt-2">
                              <p className="text-[10.5px] text-slate-300 font-semibold">Simulate Traffic Increase</p>
                              <p className="text-[9px] text-slate-400 leading-tight">Increases views/weights (+15 to +100) per approved business to optimize regional search ranks.</p>
                            </div>
                          </button>

                          {/* ACTION 2: BULK APPROVE LISTINGS */}
                          <button
                            type="button"
                            id="power-btn-verify-all"
                            onClick={() => handleBulkAction('verify_all')}
                            className="bg-slate-850/60 hover:bg-slate-800 border border-slate-700 hover:border-amber-500 rounded-xl p-4 text-left transition-all group flex flex-col justify-between h-32 cursor-pointer relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors" />
                            <div className="flex items-center space-x-2 text-amber-500 group-hover:text-amber-450 transition-colors">
                              <CheckSquare className="w-5 h-5" />
                              <span className="text-xs font-black uppercase tracking-wider font-mono">Mass Approval</span>
                            </div>
                            <div className="space-y-1 mt-2">
                              <p className="text-[10.5px] text-slate-300 font-semibold">Verify All Pending Entries</p>
                              <p className="text-[9px] text-slate-400 leading-tight">Bypasses audits and marks all passive database registrations as Verified immediately.</p>
                            </div>
                          </button>

                          {/* ACTION 3: CULL UNVERIFIED */}
                          <button
                            type="button"
                            id="power-btn-delete-unverified"
                            onClick={() => handleBulkAction('delete_unverified')}
                            className="bg-slate-850/60 hover:bg-slate-800 border border-slate-700 hover:border-red-500 rounded-xl p-4 text-left transition-all group flex flex-col justify-between h-32 cursor-pointer relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full blur-xl group-hover:bg-red-500/10 transition-colors" />
                            <div className="flex items-center space-x-2 text-red-500 group-hover:text-red-450 transition-colors">
                              <Trash2 className="w-5 h-5" />
                              <span className="text-xs font-black uppercase tracking-wider font-mono">Cull Unverified Entries</span>
                            </div>
                            <div className="space-y-1 mt-2">
                              <p className="text-[10.5px] text-slate-300 font-semibold">Purge Spam Registrations</p>
                              <p className="text-[9px] text-slate-400 leading-tight">Cleans the entire database by immediately vaporizing entries that have not been approved.</p>
                            </div>
                          </button>
                        </div>
                      </div>
                    </>
                  ) : null}

                  {/* Sub-tab switcher */}
                  <div className="flex border-b border-slate-200 mb-6 gap-2" id="admin-tabs-nav">
                    <button
                      type="button"
                      id="admin-subtab-listings"
                      onClick={() => setAdminActiveSubTab('listings')}
                      className={cn(
                        "px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2 cursor-pointer",
                        adminActiveSubTab === 'listings' 
                          ? "border-emerald-600 text-emerald-700 font-extrabold" 
                          : "border-transparent text-slate-400 hover:text-slate-650"
                      )}
                    >
                      {userRole === 'ADMIN' ? 'Listings & Slugs' : 'My Listings'}
                    </button>
                    {userRole === 'ADMIN' && (
                      <button
                        type="button"
                        id="admin-subtab-ads"
                        onClick={() => {
                          setAdminActiveSubTab('ads');
                          fetchAdminAds();
                        }}
                        className={cn(
                          "px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2 cursor-pointer",
                          adminActiveSubTab === 'ads' 
                            ? "border-emerald-600 text-emerald-700 font-extrabold" 
                            : "border-transparent text-slate-400 hover:text-slate-650"
                        )}
                      >
                        Ads Manager Banners
                      </button>
                    )}
                    <button
                      type="button"
                      id="admin-subtab-analytics"
                      onClick={() => {
                        setAdminActiveSubTab('analytics');
                        if (userRole === 'ADMIN') fetchAnalyticsLogs();
                      }}
                      className={cn(
                        "px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2 cursor-pointer",
                        adminActiveSubTab === 'analytics' 
                          ? "border-emerald-600 text-emerald-700 font-extrabold" 
                          : "border-transparent text-slate-400 hover:text-slate-650"
                      )}
                    >
                      {userRole === 'ADMIN' ? 'Traffic Telemetry Stats' : 'Profile & Settings'}
                    </button>
                  </div>

                  {adminActiveSubTab === 'listings' && (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="admin-functional-columns">
                    
                    {/* LISTINGS MANAGEMENT */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-4" id="listings-management-col">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3" id="listings-col-header">
                        <h2 className="text-base font-bold tracking-tight text-slate-800 flex items-center space-x-2" id="listings-col-h">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" id="list-check-col" />
                          <span>Listed Companies ({adminListings.length})</span>
                        </h2>
                        <div className="flex items-center space-x-2">
                          {userRole !== 'ADMIN' && (
                            <button
                              onClick={() => {
                                alert("Redirecting to external payment portal (Stripe/PayPal)... Limit extended upon successful verification.")
                              }}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wide font-extrabold flex items-center space-x-1 transition-all"
                            >
                              <Briefcase className="w-3.5 h-3.5" />
                              <span>Buy More Slots</span>
                            </button>
                          )}
                          <button
                            id="admin-btn-add-business"
                            onClick={() => {
                              setEditingListing({
                                id: '', name: '', description: '', category: '', address: '',
                                province: '', city: '', suburb: '', phone: '', email: '',
                                website: '', verified: true, image: '', tags: [], views: 0, slug: '', createdAt: ''
                              });
                              setEditName('');
                              setEditDesc('');
                              setEditCategory('');
                              setEditAddress('');
                              setEditProvince('');
                              setEditCity('');
                              setEditSuburb('');
                              setEditPhone('');
                              setEditEmail('');
                              setEditWebsite('');
                              setEditTags('');
                              setEditListingError('');
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" id="plus-sub-admin" />
                            <span>Add New Corp</span>
                          </button>
                        </div>
                      </div>

                      {adminLoading ? (
                        <div className="py-12 text-center" id="listings-admin-loading">
                          <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mx-auto" id="spin-admin-list" />
                        </div>
                      ) : adminListings.length === 0 ? (
                        <p className="text-slate-400 text-xs py-8 text-center font-mono" id="no-listings-admin text">No directory submissions logged.</p>
                      ) : (
                        <div className="overflow-y-auto max-h-110 space-y-3 pr-1" id="admin-listings-scroll-box">
                          {adminListings.map(listing => {
                            const isExpired = listing.expiresAt && new Date(listing.expiresAt) < new Date();
                            return (
                            <div
                              id={`admin-listing-strip-${listing.id}`}
                              key={listing.id}
                              className={cn(
                                "border p-4 rounded-xl space-y-3 bg-white hover:bg-slate-50 transition-all shadow-xs",
                                !listing.verified ? "border-amber-200 bg-amber-50/10" : "border-slate-150",
                                isExpired && "opacity-60 grayscale"
                              )}
                            >
                              <div className="flex items-start justify-between" id={`admin-listing-metrics-${listing.id}`}>
                                <div className="space-y-1 max-w-[70%]" id={`admin-listing-labels-${listing.id}`}>
                                  <h3 className="font-extrabold text-xs text-slate-800 line-clamp-1" id={`admin-listing-title-${listing.id}`}>{listing.name}</h3>
                                  <span className="block text-[10px] text-slate-500 font-mono" id={`admin-listing-loc-${listing.id}`}>
                                    {listing.suburb ? `${listing.suburb}, ` : ''}{listing.city} | {listing.category}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1.5" id={`admin-listing-status-${listing.id}`}>
                                  {isExpired && (
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono tracking-wider bg-red-100 text-red-800">
                                      Expired
                                    </span>
                                  )}
                                  <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono tracking-wider",
                                    listing.verified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                  )} id={`admin-listing-verified-${listing.id}`}>
                                    {listing.verified ? 'Verified' : 'Pending'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-[10.5px] font-semibold" id={`admin-listing-actions-${listing.id}`}>
                                <div className="flex items-center space-x-1" id={`admin-listing-controls-${listing.id}`}>
                                  {userRole === 'ADMIN' && (
                                    <button
                                      id={`admin-btn-verify-${listing.id}`}
                                      onClick={() => handleVerifyBusiness(listing.id, listing.verified)}
                                      className={cn(
                                        "px-2 py-1 rounded-md text-[10px] transition-all",
                                        listing.verified 
                                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
                                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                                      )}
                                    >
                                      {listing.verified ? 'Reject' : 'Verify'}
                                    </button>
                                  )}
                                  <button
                                    id={`admin-btn-edit-${listing.id}`}
                                    onClick={() => startEditListing(listing)}
                                    className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-all flex items-center space-x-0.5"
                                  >
                                    <Edit3 className="w-3 h-3" id={`edit-icon-${listing.id}`} />
                                    <span>Edit</span>
                                  </button>
                                  {isExpired && userRole !== 'ADMIN' && (
                                    <button
                                      onClick={() => alert('Subscription required to Republish. Contact Sales.')}
                                      className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md hover:bg-emerald-200 transition-all flex items-center space-x-0.5"
                                    >
                                      <RefreshCw className="w-3 h-3" />
                                      <span>Republish</span>
                                    </button>
                                  )}
                                </div>
                                <button
                                  id={`admin-btn-delete-${listing.id}`}
                                  onClick={() => handleDeleteBusiness(listing.id)}
                                  className="p-1 px-2 text-red-650 hover:bg-red-50 rounded-md transition-all flex items-center space-x-0.5 text-[10px]"
                                >
                                  <Trash2 className="w-3 h-3 text-red-500" id={`trash-icon-${listing.id}`} />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* DYNAMIC SEO PAGES MANAGEMENT */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-4" id="seo-pages-management-col">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3" id="seo-col-header">
                        <h2 className="text-base font-bold tracking-tight text-slate-800 flex items-center space-x-2" id="seo-col-h">
                          <FileText className="w-5 h-5 text-emerald-650" id="seo-file-col" />
                          <span>SEO Guides / Dynamic Pages</span>
                        </h2>
                        <button
                          id="admin-btn-create-page"
                          onClick={startCreatePage}
                          className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" id="plus-page-admin" />
                          <span>Create SEO Page</span>
                        </button>
                      </div>

                      {seoPages.length === 0 ? (
                        <p className="text-slate-400 text-xs py-8 text-center font-mono" id="no-pages-admin-text">No SEO dynamic pages compiled.</p>
                      ) : (
                        <div className="overflow-y-auto max-h-110 space-y-3 pr-1" id="admin-pages-scroll-box">
                          {seoPages.map(page => (
                            <div id={`admin-page-card-${page.id}`} key={page.id} className="border border-slate-200 p-4 rounded-xl bg-white hover:bg-slate-50 transition-all shadow-xs space-y-3">
                              <div className="flex items-start justify-between" id={`admin-page-titles-${page.id}`}>
                                <div className="space-y-1 max-w-[75%]" id={`admin-page-meta-${page.id}`}>
                                  <h3 className="font-extrabold text-xs text-slate-800" id={`admin-page-heading-${page.id}`}>{page.title}</h3>
                                  <span className="block text-[10px] text-emerald-700 font-mono" id={`admin-page-slug-${page.id}`}>Path: /{page.slug}</span>
                                </div>
                                <span className="block text-[9px] text-slate-400 font-mono shrink-0" id={`admin-page-date-${page.id}`}>
                                  {new Date(page.createdAt).toLocaleDateString()}
                                </span>
                              </div>

                              <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-[10.5px] font-semibold" id={`admin-page-actions-${page.id}`}>
                                <div className="flex items-center space-x-1.5" id={`admin-page-controls-${page.id}`}>
                                  <button
                                    id={`admin-btn-edit-page-${page.id}`}
                                    onClick={() => startEditPage(page)}
                                    className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-all flex items-center space-x-0.5"
                                  >
                                    <Edit3 className="w-3 h-3" id={`page-edit-icon-${page.id}`} />
                                    <span>Edit Content</span>
                                  </button>
                                  <button
                                    id={`admin-btn-preview-page-${page.id}`}
                                    onClick={() => handlePageSelect(page.slug)}
                                    className="px-2 py-1 text-slate-500 hover:text-slate-700 flex items-center space-x-0.5 text-[10px]"
                                  >
                                    <Eye className="w-3 h-3" id={`page-preview-icon-${page.id}`} />
                                    <span>View</span>
                                  </button>
                                </div>
                                <button
                                  id={`admin-btn-delete-page-${page.id}`}
                                  onClick={() => deletePage(page.id)}
                                  className="p-1 px-2 text-red-650 hover:bg-red-50 rounded-md transition-all flex items-center space-x-0.5"
                                >
                                  <Trash2 className="w-3 h-3 text-red-500" id={`page-trash-icon-${page.id}`} />
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CENTRAL ROUTE REDIRECTION & CUSTOM MAPPED SEO SLUGS MANAGER */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6" id="slug-redirects-manager-sec">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-100 pb-4 gap-4" id="redirect-manager-h">
                      <div className="space-y-1" id="redirect-texts">
                        <h2 className="text-sm font-black tracking-tight text-slate-800 flex items-center space-x-2">
                          <Globe className="w-5 h-5 text-emerald-600" id="globe-subdoms-ico" />
                          <span>ORGANIC SEO PATHS & DYNAMIC SLUGS MANAGER</span>
                        </h2>
                        <p className="text-slate-500 text-[11px] font-mono leading-relaxed">Dynamic path router and crawlable overrides (e.g., bizsearch24.co.za/exampleslug) registered inside Bizsearch24 server databases.</p>
                      </div>
                      
                      <button
                        id="admin-btn-toggle-slug-map-form"
                        onClick={() => {
                          setEditingMapping(null);
                          setMapSource('');
                          setMapTarget('');
                          setMapType('custom-link');
                          setMapActive(true);
                          setMapError('');
                          setIsConfiguringSlugs(!isConfiguringSlugs);
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isConfiguringSlugs ? 'Close Custom Slugs Editor' : 'Configure New Custom Path / Slug'}</span>
                      </button>
                    </div>

                    {isConfiguringSlugs && (
                      <form onSubmit={handleSaveSlugMapping} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 text-xs" id="slug-map-add-form">
                        <div className="border-b border-slate-200 pb-2 mb-2" id="slug-edit-hdr">
                          <h3 className="font-bold text-slate-800 text-xs">{editingMapping ? 'Update Custom Router Destination Mapping' : 'Map Custom Directory Paths / SEO Slugs'}</h3>
                          <p className="text-[10px] text-slate-400">Routes incoming path queries to targeted Dynamic Finder search results and verified listings immediately.</p>
                        </div>

                        {mapError && (
                          <p className="text-xs text-red-650 bg-red-50 p-2.5 rounded-lg border border-red-200 font-semibold" id="map-form-error">{mapError}</p>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-[11px]" id="map-form-fields">
                          <div className="space-y-1 bg-white p-3 rounded-lg border" id="map-source-f">
                            <label className="font-bold text-slate-700 block">Crawlable Slug Path (e.g., /exampleslug)</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. /pretoria-emergency-plumbers"
                              value={mapSource}
                              onChange={(e) => setMapSource(e.target.value)}
                              className="w-full bg-slate-50 border rounded-md px-2 py-1.5 focus:bg-white focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1 bg-white p-3 rounded-lg border" id="map-target-f">
                            <label className="font-bold text-slate-700 block">Destination Search Filter Target</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. /explore?province=gauteng&city=pretoria"
                              value={mapTarget}
                              onChange={(e) => setMapTarget(e.target.value)}
                              className="w-full bg-slate-50 border rounded-md px-2 py-1.5 focus:bg-white focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1 bg-white p-3 rounded-lg border" id="map-type-f">
                            <label className="font-bold text-slate-700 block">SEO Target Classification</label>
                            <select
                              value={mapType}
                              onChange={(e) => setMapType(e.target.value as any)}
                              className="w-full bg-slate-50 border rounded-md px-2.5 py-1.5 focus:bg-white focus:outline-none"
                            >
                              <option value="custom-link">SEO Friendly Sub-route Link</option>
                              <option value="redirect">301 Permanent External Redirect</option>
                            </select>
                          </div>

                          <div className="space-y-1 bg-white p-3 rounded-lg border" id="map-active-f">
                            <label className="font-bold text-slate-700 block">Active Status Router State</label>
                            <select
                              value={mapActive ? 'true' : 'false'}
                              onChange={(e) => setMapActive(e.target.value === 'true')}
                              className="w-full bg-slate-50 border rounded-md px-2.5 py-1.5 focus:bg-white focus:outline-none"
                            >
                              <option value="true">Active & Routing</option>
                              <option value="false">Inactive / Paused</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2" id="map-form-buttons">
                          <button
                            type="button"
                            onClick={() => { setIsConfiguringSlugs(false); setEditingMapping(null); }}
                            className="px-3 py-1.5 bg-white border rounded-lg hover:bg-slate-100 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                          >
                            {editingMapping ? 'Apply Redirect Caching' : 'Register Custom Mapping Rule'}
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="overflow-x-auto border rounded-2xl" id="slugs-table-container">
                      <table className="w-full text-left border-collapse text-xs" id="slugs-table">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 border-b border-slate-150 font-mono text-[10px] uppercase">
                            <th className="p-3">Source Route / Mapped SEO Path</th>
                            <th className="p-3">Dynamic Destination Route</th>
                            <th className="p-3">SEO Method Type</th>
                            <th className="p-3 text-center">In-Service</th>
                            <th className="p-3 text-right">Operations</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-150" id="slugs-table-rows">
                          {slugMappings.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="p-8 text-center text-slate-400 font-mono">No custom redirections or subdomains maps logged inside local cache.</td>
                            </tr>
                          ) : (
                            slugMappings.map(m => (
                              <tr id={`slug-row-${m.id}`} key={m.id} className="hover:bg-slate-50/50">
                                <td className="p-3 font-mono font-extrabold text-slate-800">{m.source}</td>
                                <td className="p-3 font-mono text-emerald-800">{m.target}</td>
                                <td className="p-3">
                                  <span className="px-2 py-0.5 rounded-full text-[9px] bg-slate-100 text-slate-700 border font-mono font-bold uppercase">
                                    {m.type}
                                  </span>
                                </td>
                                <td className="p-3 text-center">
                                  <span className={cn(
                                    "inline-flex w-2.5 h-2.5 rounded-full",
                                    m.active ? "bg-emerald-600 animate-pulse" : "bg-slate-350"
                                  )} id={`slug-active-dot-${m.id}`} />
                                </td>
                                <td className="p-3 text-right space-x-2 whitespace-nowrap font-semibold">
                                  <button
                                    id={`slug-btn-edit-${m.id}`}
                                    onClick={() => startEditSlugMapping(m)}
                                    className="text-slate-600 hover:text-slate-900"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    id={`slug-btn-dele-${m.id}`}
                                    onClick={() => handleDeleteSlugMapping(m.id)}
                                    className="text-red-650 hover:text-red-800 font-bold"
                                  >
                                    Revoke
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                    </>
                  )}

                  {/* SUPREME ADVERTISING SPAN MANAGEMENT VIEW SECTION */}
                  {adminActiveSubTab === 'ads' && (
                    <div className="space-y-8" id="admin-ads-tab-panel">
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <h3 className="font-extrabold text-slate-900 flex items-center space-x-2 text-base">
                            <Settings className="w-5 h-5 text-emerald-650" />
                            <span>{editingAd ? 'Override Campaign Info' : 'Initialize New Ad Campaign'}</span>
                          </h3>
                          {editingAd && (
                            <button
                              onClick={() => {
                                setEditingAd(null);
                                setAdTitle('');
                                setAdImageUrl('');
                                setAdTargetUrl('');
                                setAdPlacement('all');
                                setAdProvince('');
                                setAdCity('');
                                setAdSuburb('');
                                setAdPosition('sidebar');
                                setAdSize('any');
                                setAdActive(true);
                                setAdBadge('standard');
                                setAdDescription('');
                                setAdAlwaysOnTop(false);
                                setAdPlacementNews(false);
                                setAdPlacementSponsored(false);
                                setAdExpiryType('permanent');
                                setAdExpiryDate('');
                              }}
                              className="text-xs text-slate-500 hover:text-slate-800 underline cursor-pointer"
                            >
                              Reset Constructor
                            </button>
                          )}
                        </div>

                        <form onSubmit={async (e) => {
                          e.preventDefault();
                          setAdSaveError('');
                          try {
                            const payload = {
                              id: editingAd ? editingAd.id : undefined,
                              title: adTitle,
                              imageUrl: adImageUrl,
                              targetUrl: adTargetUrl,
                              placement: adPlacement,
                              province: adProvince,
                              city: adCity,
                              suburb: adSuburb,
                              position: adPosition,
                              size: adSize,
                              active: adActive,
                              badge: adBadge,
                              description: adDescription,
                              alwaysOnTop: adAlwaysOnTop,
                              placementNews: adPlacementNews,
                              placementSponsored: adPlacementSponsored,
                              expiryType: adExpiryType,
                              expiryDate: adExpiryType === 'date' ? adExpiryDate : null
                            };

                            const url = '/api/ads';
                            const method = editingAd ? 'PUT' : 'POST';

                            const res = await fetch(url, {
                              method,
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${adminToken}`
                              },
                              body: JSON.stringify(payload)
                            });

                            const data = await res.json();
                            if (data.success) {
                              setEditingAd(null);
                              setAdTitle('');
                              setAdImageUrl('');
                              setAdTargetUrl('');
                              setAdPlacement('all');
                              setAdProvince('');
                              setAdCity('');
                              setAdSuburb('');
                              setAdPosition('sidebar');
                              setAdSize('any');
                              setAdActive(true);
                              setAdBadge('standard');
                              setAdDescription('');
                              setAdAlwaysOnTop(false);
                              setAdPlacementNews(false);
                              setAdPlacementSponsored(false);
                              setAdExpiryType('permanent');
                              setAdExpiryDate('');
                              fetchAdminAds();
                              fetchAdsList();
                            } else {
                              setAdSaveError(data.message || 'Error processing advertisement.');
                            }
                          } catch (err) {
                            setAdSaveError('Failed to save ad campaign details.');
                          }
                        }} className="grid grid-cols-1 md:grid-cols-12 gap-5">
                          {adSaveError && (
                            <div className="col-span-full bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs font-semibold">
                              {adSaveError}
                            </div>
                          )}

                          {/* CAMPAIGN GENERAL INFORMATION */}
                          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700">Ad Campaign Name / Sponsor Headline</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Plumbers 24/7 Service Cape Town"
                                value={adTitle}
                                onChange={(e) => setAdTitle(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700">Ad Badge Status Designation</label>
                              <select
                                value={adBadge}
                                onChange={(e: any) => setAdBadge(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                              >
                                <option value="standard">Standard Partner Stamp</option>
                                <option value="verified">Verified Business Placement</option>
                                <option value="premium">Premium Promotion Badge</option>
                                <option value="premium-verified">Premium Verified Highlight (Max Priority)</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-span-full space-y-1">
                            <label className="text-xs font-bold text-slate-700">Target Outbound URL Redirect</label>
                            <input
                              type="text"
                              placeholder="e.g. https://www.yourpartnersite.co.za or leave empty"
                              value={adTargetUrl}
                              onChange={(e) => setAdTargetUrl(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-mono"
                            />
                          </div>

                          <div className="col-span-full space-y-1">
                            <label className="text-xs font-bold text-slate-700">Ad Content Description & Offer Details Immersive</label>
                            <textarea
                              rows={3}
                              placeholder="Describe your special offer details, contact number, reviews recap, or coupon codes..."
                              value={adDescription}
                              onChange={(e) => setAdDescription(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3.5 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                            />
                          </div>

                          {/* DUAL IMAGE SETTINGS: DRAG AND DROP FILE UPLOAD OR URL DIRECT INPUT */}
                          <div className="col-span-full bg-slate-50/50 p-4 rounded-xl border border-slate-150 space-y-4">
                            <h4 className="text-xs font-black uppercase text-slate-600 tracking-wider">Campaign Visual Banner</h4>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Browse or Drag Image File</label>
                                <div className="border border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-4 text-center transition-all cursor-pointer relative bg-white group flex flex-col items-center justify-center h-28"
                                     onDragOver={(e) => { e.preventDefault(); }}
                                     onDrop={(e) => { 
                                       e.preventDefault(); 
                                       if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                         const file = e.dataTransfer.files[0];
                                         const reader = new FileReader();
                                         reader.onloadend = () => {
                                           if (typeof reader.result === 'string') {
                                             setAdImageUrl(reader.result);
                                           }
                                         };
                                         reader.readAsDataURL(file);
                                       }
                                     }}>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    id="ad-local-file-upload-input"
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        const file = e.target.files[0];
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          if (typeof reader.result === 'string') {
                                            setAdImageUrl(reader.result);
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                  <UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 transition-colors mb-1" />
                                  <p className="text-[11px] font-bold text-slate-655">Drag file here or <span className="text-emerald-600 underline">browse</span></p>
                                  <p className="text-[9px] text-slate-405 font-mono mt-0.5">Loads local image instantly.</p>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="space-y-1">
                                  <label className="text-xs font-bold text-slate-700">Or Paste Image Web URL</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. https://images.unsplash.com/photo-151234567"
                                    value={adImageUrl}
                                    onChange={(e) => setAdImageUrl(e.target.value)}
                                    className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                                  />
                                </div>
                                {adImageUrl && (
                                  <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-100 p-2 rounded-lg">
                                    <div className="w-12 h-9 rounded overflow-hidden bg-slate-100 shrink-0 border relative">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img src={adImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="truncate">
                                      <span className="text-[10px] font-mono text-emerald-800 font-bold block">Visual Link Connected</span>
                                      <span className="text-[9px] font-mono text-slate-400 block truncate max-w-[200px]">{adImageUrl}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* OPTION WHERE TO PUT THE AD (PLACEMENT REGIONS & CHANNELS) */}
                          <div className="col-span-full bg-slate-50/50 p-4 rounded-xl border border-slate-150 space-y-4">
                            <h4 className="text-xs font-black uppercase text-slate-600 tracking-wider">Placement Criteria & Channels</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 block">Target Placement Scope</label>
                                <select
                                  value={adPlacement}
                                  onChange={(e: any) => setAdPlacement(e.target.value)}
                                  className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                                >
                                  <option value="all">Sponsor on ALL regional searches & pages (Ever Single Page)</option>
                                  <option value="province">Specific Province Level targeting</option>
                                  <option value="city">Specific City / Town Level targeting</option>
                                  <option value="suburb">Specific Suburb Name targeting</option>
                                </select>
                              </div>

                              {adPlacement === 'province' && (
                                <div className="space-y-1 animate-fade-in">
                                  <label className="text-xs font-bold text-slate-700">Target Province</label>
                                  <select
                                    value={adProvince}
                                    onChange={(e) => setAdProvince(e.target.value)}
                                    className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                                  >
                                    <option value="">-- Choose Province --</option>
                                    {PROVINCES.map(p => (
                                      <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {adPlacement === 'city' && (
                                <div className="space-y-1 animate-fade-in">
                                  <label className="text-xs font-bold text-slate-700">Target City / Town</label>
                                  <select
                                    value={adCity}
                                    onChange={(e) => setAdCity(e.target.value)}
                                    className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                                  >
                                    <option value="">-- Choose City --</option>
                                    {CITIES_AND_TOWNS.map(c => (
                                      <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {adPlacement === 'suburb' && (
                                <div className="space-y-1 animate-fade-in">
                                  <label className="text-xs font-bold text-slate-700">Target Suburb Name</label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Sandton"
                                    value={adSuburb}
                                    onChange={(e) => setAdSuburb(e.target.value)}
                                    className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-slate-200/60">
                              <label className="flex items-center space-x-2 text-xs font-bold text-slate-705 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={adAlwaysOnTop}
                                  onChange={(e) => setAdAlwaysOnTop(e.target.checked)}
                                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                />
                                <div>
                                  <span className="block">Show Always on Top</span>
                                  <span className="block text-[9px] text-slate-400 font-normal leading-none mt-0.5">Locks at highest priority list</span>
                                </div>
                              </label>

                              <label className="flex items-center space-x-2 text-xs font-bold text-slate-705 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={adPlacementNews}
                                  onChange={(e) => setAdPlacementNews(e.target.checked)}
                                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                />
                                <div>
                                  <span className="block">Inject on News Stream</span>
                                  <span className="block text-[9px] text-slate-400 font-normal leading-none mt-0.5">Show inside news blogs feed</span>
                                </div>
                              </label>

                              <label className="flex items-center space-x-2 text-xs font-bold text-slate-705 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={adPlacementSponsored}
                                  onChange={(e) => setAdPlacementSponsored(e.target.checked)}
                                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                />
                                <div>
                                  <span className="block">Add to Sponsored Rails</span>
                                  <span className="block text-[9px] text-slate-400 font-normal leading-none mt-0.5">Show in right sidebar showcases</span>
                                </div>
                              </label>

                              <label className="flex items-center space-x-2 text-xs font-bold text-slate-705 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={adActive}
                                  onChange={(e) => setAdActive(e.target.checked)}
                                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                                />
                                <div>
                                  <span className="block">Campaign Live Status</span>
                                  <span className="block text-[9px] text-slate-400 font-normal leading-none mt-0.5">Enable and show immediately</span>
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* OPTION MAKE IT A PRIORITY AD PERMANENT OR TIME EXPIRED LIMIT */}
                          <div className="col-span-full bg-slate-50/50 p-4 rounded-xl border border-slate-150 space-y-4">
                            <h4 className="text-xs font-black uppercase text-slate-600 tracking-wider">Expiry parameters (Time limits)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 block">Campaign Lifespan</label>
                                <select
                                  value={adExpiryType}
                                  onChange={(e: any) => setAdExpiryType(e.target.value)}
                                  className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                                >
                                  <option value="permanent">Infinite Permanent Sponsorship</option>
                                  <option value="date">Temporary Custom Expiry Target Date</option>
                                </select>
                              </div>

                              {adExpiryType === 'date' && (
                                <div className="space-y-1 animate-fade-in font-mono">
                                  <label className="text-xs font-bold text-slate-700 font-sans block">Select Expiration Date & Time</label>
                                  <input
                                    type="datetime-local"
                                    required
                                    value={adExpiryDate}
                                    onChange={(e) => setAdExpiryDate(e.target.value)}
                                    className="w-full bg-white border border-slate-205 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-span-full pt-2 flex justify-end">
                            <button
                              id="btn-ad-campaign-submit-panel"
                              type="submit"
                              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                            >
                              {editingAd ? 'Override Campaign Details' : 'Initialize Partnership Frame'}
                            </button>
                          </div>
                        </form>
                      </div>

                      {/* Ads Table */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3" id="ads-table-header-block">
                          <div className="space-y-0.5">
                            <h3 className="font-extrabold text-slate-900 text-sm">Active Advertising Campaign Portfolios</h3>
                            <p className="text-[10px] text-slate-400 font-mono">Manage global context banner rotations and localized directory highlights.</p>
                          </div>
                          
                          <div className="relative w-full sm:w-64" id="ad-search-tool-wrapper">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none" id="ad-search-icon-container">
                              <Search className="w-3.5 h-3.5 text-slate-400" id="ad-search-glass-icon" />
                            </span>
                            <input
                              type="text"
                              id="input-ad-search-query"
                              placeholder="Search ads by title, url, scope..."
                              value={adSearchQuery}
                              onChange={(e) => setAdSearchQuery(e.target.value)}
                              className="w-full bg-slate-50 hover:bg-slate-100 border rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            />
                            {adSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setAdSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 text-[10px] font-mono"
                                id="btn-clear-ad-search"
                              >
                                Clear
                              </button>
                            )}
                          </div>
                        </div>

                        {adsLoading ? (
                          <p className="text-xs text-slate-500 font-mono">Loading campaign databases...</p>
                        ) : adminAds.length === 0 ? (
                          <p className="text-xs text-slate-400 font-mono italic">No ads campaigns created yet. Populate the creator above to launch your first banner!</p>
                        ) : filteredAdminAds.length === 0 ? (
                          <div className="py-8 text-center" id="search-ads-empty-state">
                            <p className="text-xs text-slate-400 font-mono italic">No advertising campaigns matched your query: &quot;{adSearchQuery}&quot;.</p>
                            <button 
                              onClick={() => setAdSearchQuery('')} 
                              className="mt-2 text-[10px] font-bold text-emerald-650 hover:underline cursor-pointer"
                              id="btn-reset-ads-search-link"
                            >
                              Reset Search Filter
                            </button>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-mono">
                                  <th className="py-2.5">Ad Banner</th>
                                  <th>Target Scope</th>
                                  <th>Outbound Redirect</th>
                                  <th>Status</th>
                                  <th className="text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredAdminAds.map(ad => (
                                  <tr key={ad.id} className="border-b border-slate-50 hover:bg-slate-50/20">
                                    <td className="py-3 flex items-center space-x-3">
                                      <img src={ad.imageUrl} alt={ad.title} referrerPolicy="no-referrer" className="w-16 h-12 object-cover rounded-md border" />
                                      <div>
                                        <p className="font-bold text-slate-800">{ad.title}</p>
                                        <p className="text-[10px] text-slate-404 font-mono">ID: {ad.id}</p>
                                      </div>
                                    </td>
                                    <td>
                                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-650 font-bold">
                                        Scope: {ad.placement.toUpperCase()} 
                                        {ad.province && ` (${ad.province})`}
                                        {ad.city && ` (${ad.city})`}
                                        {ad.suburb && ` (${ad.suburb})`}
                                      </span>
                                    </td>
                                    <td>
                                      <p className="max-w-[140px] truncate text-slate-500 font-mono" title={ad.targetUrl}>{ad.targetUrl || 'None'}</p>
                                    </td>
                                    <td>
                                      <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[9px] font-mono font-bold",
                                        ad.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                                      )}>
                                        {ad.active ? 'LIVE / ACTIVE' : 'INACTIVE'}
                                      </span>
                                    </td>
                                    <td className="text-right space-x-1.5 whitespace-nowrap">
                                      <button
                                        onClick={() => {
                                          setEditingAd(ad);
                                          setAdTitle(ad.title);
                                          setAdImageUrl(ad.imageUrl);
                                          setAdTargetUrl(ad.targetUrl || '');
                                          setAdPlacement(ad.placement);
                                          setAdProvince(ad.province || '');
                                          setAdCity(ad.city || '');
                                          setAdSuburb(ad.suburb || '');
                                          setAdPosition(ad.position);
                                          setAdSize(ad.size || 'any');
                                          setAdActive(ad.active);
                                          setAdBadge(ad.badge || 'standard');
                                          setAdDescription(ad.description || '');
                                          setAdAlwaysOnTop(!!ad.alwaysOnTop);
                                          setAdPlacementNews(!!ad.placementNews);
                                          setAdPlacementSponsored(!!ad.placementSponsored);
                                          setAdExpiryType(ad.expiryType || 'permanent');
                                          setAdExpiryDate(ad.expiryDate || '');
                                        }}
                                        className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded font-bold text-[10px] uppercase tracking-wide cursor-pointer"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={async () => {
                                          if (confirm('Delete this banner permanently?')) {
                                            const res = await fetch(`/api/ads?id=${ad.id}`, {
                                              method: 'DELETE',
                                              headers: { 'Authorization': `Bearer ${adminToken}` }
                                            });
                                            const data = await res.json();
                                            if (data.success) {
                                              fetchAdminAds();
                                              fetchAdsList();
                                            }
                                          }
                                        }}
                                        className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-850 rounded font-bold text-[10px] uppercase tracking-wide cursor-pointer"
                                      >
                                        Delete
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SUPREME VISITOR TELEMETRY TRAFFIC FEED DASHBOARD OR USER PROFILE */}
                  {adminActiveSubTab === 'analytics' && (
                    <div className="space-y-8" id="admin-analytics-profile-tab-panel">
                      {userRole === 'ADMIN' ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Sessions Count */}
                            <div className="bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Total Recorded Sessions</span>
                              <div className="mt-2 text-2xl font-black text-slate-800">{visitorLogs.length} Sessions</div>
                              <p className="text-[10px] text-slate-500 font-mono mt-1">Unique IP track instances</p>
                            </div>

                            {/* Mobile Device Count */}
                            <div className="bg-white border rounded-2xl p-5 shadow-xs space-y-2">
                              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Device Profiles</span>
                              <div className="space-y-1 pt-1">
                                <div className="flex justify-between text-[11px] text-slate-650">
                                  <span>Desktop PC</span>
                                  <span className="font-bold">{visitorLogs.filter(l => l.deviceType === 'Desktop').length}</span>
                                </div>
                                <div className="flex justify-between text-[11px] text-slate-655">
                                  <span>Mobile Touch</span>
                                  <span className="font-bold">{visitorLogs.filter(l => l.deviceType === 'Mobile').length}</span>
                                </div>
                                <div className="flex justify-between text-[11px] text-slate-655">
                                  <span>Tablet Screen</span>
                                  <span className="font-bold">{visitorLogs.filter(l => l.deviceType === 'Tablet').length}</span>
                                </div>
                              </div>
                            </div>

                            {/* Referrers */}
                            <div className="bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Top Traffic Origin</span>
                              <div className="mt-2 text-xs font-bold text-emerald-800 truncate">
                                {(() => {
                                  const counts: { [key: string]: number } = {};
                                  visitorLogs.forEach(l => {
                                    const ref = l.referrer || 'Direct Land';
                                    counts[ref] = (counts[ref] || 0) + 1;
                                  });
                                  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                                  return sorted[0] ? `${sorted[0][0]} (${sorted[0][1]} sessions)` : 'Direct Load';
                                })()}
                              </div>
                              <p className="text-[10px] text-slate-500 font-mono mt-1">Highest frequency entry link</p>
                            </div>

                            {/* Hot Searches */}
                            <div className="bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Hot Directories searched</span>
                              <div className="mt-2 text-xs font-bold text-slate-800 truncate">
                                {(() => {
                                  const searches: string[] = [];
                                  visitorLogs.forEach(l => {
                                    if (l.searches && Array.isArray(l.searches)) searches.push(...l.searches);
                                  });
                                  const counts: { [key: string]: number } = {};
                                  searches.forEach(s => counts[s] = (counts[s] || 0) + 1);
                                  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
                                  return sorted[0] ? `"${sorted[0][0]}" (${sorted[0][1]} requests)` : 'No entries yet';
                                })()}
                              </div>
                              <p className="text-[10px] text-slate-500 font-mono mt-1">Most typed keyword string</p>
                            </div>
                          </div>

                          {/* Live Stream Traffic Table logs */}
                          <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-xs space-y-4 font-sans text-xs">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                              <h3 className="font-extrabold text-slate-900 text-sm">Real-time Visitor Tracker Audit Feed</h3>
                              <button
                                onClick={fetchAnalyticsLogs}
                                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-705 px-2.5 py-1 rounded-md cursor-pointer"
                              >
                                Refresh Feed
                              </button>
                            </div>
                            {analyticsLoading ? (
                              <p className="text-xs text-slate-500 font-mono">Connecting to streaming server...</p>
                            ) : visitorLogs.length === 0 ? (
                              <p className="text-xs text-slate-400 font-mono italic text-center py-6">No traffic recorded yet or server-level telemetry disabled.</p>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-[11px]">
                                  <thead>
                                    <tr className="border-b border-slate-100 text-slate-400 font-mono bg-slate-50 text-[10px] uppercase">
                                      <th className="p-2">Time / Session</th>
                                      <th className="p-2">Visitor IP</th>
                                      <th className="p-2">Device Code</th>
                                      <th className="p-2">Referrer Source</th>
                                      <th className="p-2">Landing Path</th>
                                      <th className="p-2">Searches Initiated</th>
                                      <th className="p-2">Links / CTAs Clicked</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {visitorLogs.map(log => (
                                      <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/40">
                                        <td className="p-2 text-slate-400 font-mono leading-tight whitespace-nowrap">
                                          {new Date(log.timestamp).toLocaleTimeString()}<br/>
                                          <span className="text-[9px] font-mono text-slate-400">{new Date(log.timestamp).toLocaleDateString()}</span>
                                        </td>
                                        <td className="p-2 font-mono text-slate-900 font-extrabold">{log.ip}</td>
                                        <td className="p-2">
                                          <span className={cn(
                                            "px-2 py-0.5 rounded text-[10px] font-mono font-semibold",
                                            log.deviceType === 'Mobile' ? "bg-amber-100 text-amber-800" :
                                            log.deviceType === 'Tablet' ? "bg-indigo-100 text-indigo-800" :
                                            "bg-emerald-100 text-emerald-800"
                                          )}>
                                            {log.deviceType || 'DesktopType'}
                                          </span>
                                        </td>
                                        <td className="p-2">
                                          <p className="max-w-[120px] truncate text-slate-500 font-mono leading-tight" title={log.referrer}>{log.referrer || 'Direct Land'}</p>
                                        </td>
                                        <td className="p-2 font-mono text-slate-650 font-semibold">{log.path || '/'}</td>
                                        <td className="p-2 font-mono">
                                          {log.searches && log.searches.length > 0 ? (
                                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                                              {log.searches.map((s: string, sI: number) => (
                                                <span key={sI} className="bg-slate-50 text-slate-700 px-1.5 py-0.5 rounded border text-[10px] leading-none whitespace-normal" title={s}>
                                                  {s}
                                                </span>
                                              ))}
                                            </div>
                                          ) : (
                                            <span className="text-slate-300 font-mono">-</span>
                                          )}
                                        </td>
                                        <td className="p-2 font-mono">
                                          {log.clicks && log.clicks.length > 0 ? (
                                            <div className="flex flex-col gap-1 max-w-[170px] text-[10px] font-mono text-emerald-750">
                                              {log.clicks.map((c: any, cI: number) => (
                                                <span key={cI} className="border-l-2 border-emerald-500 pl-1 py-0.5 max-w-full" title={c.elementText}>
                                                  {c.elementText}
                                                </span>
                                              ))}
                                            </div>
                                          ) : (
                                            <span className="text-slate-300 font-mono">-</span>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="bg-white border rounded-2xl p-6 shadow-xs max-w-2xl mx-auto space-y-6 text-sm">
                          <div className="border-b pb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                              <Settings className="w-5 h-5 text-indigo-600" />
                              Profile Settings
                            </h3>
                            <p className="text-slate-500 text-xs mt-1">Manage your account details and directory presentation</p>
                          </div>
                          
                          {profileSaveMsg && (
                            <div className="bg-indigo-50 text-indigo-700 px-4 py-2 border-l-4 border-indigo-600 text-xs">
                              {profileSaveMsg}
                            </div>
                          )}

                          <form className="space-y-4" onSubmit={async (e) => {
                            e.preventDefault();
                            setProfileSaveMsg('Saving details...');
                            try {
                              const res = await fetch('/api/user/profile', {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${adminToken}`
                                },
                                body: JSON.stringify({
                                  firstName: userProfile?.firstName || '',
                                  lastName: userProfile?.lastName || '',
                                  idNumber: userProfile?.idNumber || '',
                                  companyRegNumber: userProfile?.companyRegNumber || '',
                                  billingAddress: userProfile?.billingAddress || '',
                                  showProfileDetails: userProfile?.showProfileDetails || false,
                                  profileColor: userProfile?.profileColor || 'slate'
                                })
                              });
                              if (res.ok) setProfileSaveMsg('Profile saved securely.');
                              else setProfileSaveMsg('Failed to save profile');
                            } catch (e) {
                              setProfileSaveMsg('Network error.');
                            }
                          }}>
                            <div className="grid grid-cols-2 gap-4">
                              <label className="block">
                                <span className="font-bold text-slate-700 text-xs">First Name</span>
                                <input required type="text" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none" value={userProfile?.firstName || ''} onChange={e => setUserProfile({...userProfile, firstName: e.target.value})} />
                              </label>
                              <label className="block">
                                <span className="font-bold text-slate-700 text-xs">Last Name</span>
                                <input required type="text" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none" value={userProfile?.lastName || ''} onChange={e => setUserProfile({...userProfile, lastName: e.target.value})} />
                              </label>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <label className="block">
                                <span className="font-bold text-slate-700 text-xs">Identity Number / Passport</span>
                                <input required type="text" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none" value={userProfile?.idNumber || ''} onChange={e => setUserProfile({...userProfile, idNumber: e.target.value})} />
                              </label>
                              <label className="block">
                                <span className="font-bold text-slate-700 text-xs">Company Reg / VAT</span>
                                <input type="text" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none" value={userProfile?.companyRegNumber || ''} onChange={e => setUserProfile({...userProfile, companyRegNumber: e.target.value})} />
                              </label>
                            </div>

                            <label className="block">
                              <span className="font-bold text-slate-700 text-xs">Full Billing Address</span>
                              <textarea required className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none min-h-[80px]" value={userProfile?.billingAddress || ''} onChange={e => setUserProfile({...userProfile, billingAddress: e.target.value})}></textarea>
                            </label>

                            <div className="bg-slate-50 p-4 rounded-xl border space-y-3">
                              <label className="flex items-center space-x-2">
                                <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" checked={userProfile?.showProfileDetails || false} onChange={e => setUserProfile({...userProfile, showProfileDetails: e.target.checked})} />
                                <span className="text-xs font-bold text-slate-800">Show Contact Details on Listings</span>
                              </label>
                              
                              <label className="block">
                                <span className="font-bold text-slate-700 text-xs">Public Profile Color Theme</span>
                                <select className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none" value={userProfile?.profileColor || 'slate'} onChange={e => setUserProfile({...userProfile, profileColor: e.target.value})}>
                                  <option value="slate">Slate (Default Business)</option>
                                  <option value="indigo">Indigo (Professional)</option>
                                  <option value="emerald">Emerald (Growth / Eco)</option>
                                  <option value="amber">Amber (Creative)</option>
                                  <option value="rose">Rose (Lifestyle)</option>
                                </select>
                              </label>
                            </div>

                            <div className="pt-4 flex justify-end">
                              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-lg shadow-md transition-colors flex gap-2 text-xs">
                                <CheckSquare className="w-4 h-4"/> Save Profile Security Protocol
                              </button>
                            </div>
                          </form>

                          <div className="border-t pt-4 mt-4">
                            <h4 className="text-sm font-bold text-slate-800 flex gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-600"/>
                              Hack Protection & 2FA
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 mb-3">Enable Google Authenticator locking to prevent hackers from stealing data.</p>
                            
                            {userProfile?.twoFactorEnabled ? (
                              <div className="bg-emerald-50 text-emerald-800 p-3 rounded border border-emerald-200 text-xs font-bold">
                                ✓ Google Authenticator 2FA is currently active on your account.
                              </div>
                            ) : (
                              isConfiguringProfile2FA ? (
                                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                  {qrCodeData && (
                                    <div className="flex flex-col items-center">
                                      <p className="text-xs text-slate-500 mb-2 font-semibold">Keep your account safe from hackers!</p>
                                      <p className="text-xs text-slate-500 mb-2">Scan this QR code with Google Authenticator:</p>
                                      <img src={qrCodeData} alt="2FA QR Code" className="mb-2 border p-2 rounded-lg shadow-sm" />
                                      <p className="text-[10px] font-mono text-slate-400 bg-white border p-2 rounded-md">Secret: {setupSecret}</p>
                                    </div>
                                  )}
                                  <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700">Enter Google Authenticator Code</label>
                                    <input
                                      type="text"
                                      value={profileMfaToken}
                                      onChange={(e) => setProfileMfaToken(e.target.value)}
                                      className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs focus:ring focus:ring-indigo-200 outline-none"
                                      placeholder="6-digit code"
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setIsConfiguringProfile2FA(false)}
                                      className="text-slate-500 hover:text-slate-700 text-xs font-bold px-3 py-2"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={async () => {
                                        try {
                                          const res = await fetch('/api/auth/setup-2fa', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ userId: pendingUserId, action: 'verifyAndEnable', token: profileMfaToken })
                                          });
                                          const data = await res.json();
                                          if (data.success && data.token) {
                                            setAdminToken(data.token);
                                            localStorage.setItem('biz_admin_token', data.token);
                                            setUserProfile({ ...userProfile, twoFactorEnabled: true });
                                            setIsConfiguringProfile2FA(false);
                                            alert("2FA Enabled Successfully!");
                                          } else {
                                            alert(data.message || 'Invalid 2FA code.');
                                          }
                                        } catch (err) {
                                          alert("Failed to verify code.");
                                        }
                                      }}
                                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow text-xs font-semibold"
                                    >
                                      Verify and Enable
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={async () => {
                                    try {
                                      const res = await fetch('/api/auth/setup-2fa', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ userId: userProfile.id, action: 'generate' })
                                      });
                                      const data = await res.json();
                                      if (data.success) {
                                        setQrCodeData(data.qrCode);
                                        setSetupSecret(data.secret);
                                        setPendingUserId(userProfile.id);
                                        setIsConfiguringProfile2FA(true);
                                      } else alert(data.message || 'Could not generate QR code');
                                    } catch (e) { alert('Network error'); }
                                  }}
                                  className="bg-slate-800 hover:bg-black text-white px-4 py-2 rounded shadow text-xs font-semibold"
                                >
                                  Configure Google Authenticator
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ADMIN EDIT / CREATE BUSINESS MODAL OVERLAY */}
                  {editingListing && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto" id="edit-listing-modal-overlay">
                      <div className="bg-white border rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl relative" id="edit-listing-modal">
                        <button
                          id="edit-listing-close"
                          onClick={() => setEditingListing(null)}
                          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-550 transition-all"
                        >
                          <X className="w-5 h-5" id="edit-listing-x-ico" />
                        </button>

                        <div className="border-b pb-2" id="edit-listing-modal-header">
                          <h2 className="text-base font-extrabold text-slate-900" id="edit-listing-modal-h">
                            {editingListing.id ? 'Modify Business Details' : 'Register Administrative Business'}
                          </h2>
                          <p className="text-slate-500 text-[11px]" id="edit-listing-modal-p">Administrative level listing creation validates immediately on publication.</p>
                        </div>

                        {editListingError && (
                          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs" id="edit-listing-error-card">
                            <p className="font-semibold text-[11px]">{editListingError}</p>
                          </div>
                        )}

                        <form onSubmit={saveEditedListing} className="space-y-4 text-xs" id="edit-listing-form">
                          <div className="space-y-1" id="edit-listing-name-f">
                            <label id="lbl-edit-name" className="font-bold text-slate-700">Company Name</label>
                            <input
                              id="input-edit-name"
                              type="text"
                              required
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4" id="edit-listing-cats-grid">
                            <div className="space-y-1" id="edit-listing-category-f">
                              <label id="lbl-edit-category" className="font-bold text-slate-700">Category Sector</label>
                              <select
                                id="select-edit-category"
                                required
                                value={editCategory}
                                onChange={(e) => setEditCategory(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              >
                                <option value="">Select Category</option>
                                {CATEGORIES.map(c => (
                                  <option id={`edit-cat-opt-${c.id}`} key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1" id="edit-listing-phone-f">
                              <label id="lbl-edit-phone" className="font-bold text-slate-700">Phone Hotline</label>
                              <input
                                id="input-edit-phone"
                                type="text"
                                value={editPhone}
                                onChange={(e) => setEditPhone(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1" id="edit-listing-desc-f">
                            <label id="lbl-edit-desc" className="font-bold text-slate-700">Detailed Profile Description</label>
                            <textarea
                              id="textarea-edit-desc"
                              rows={3}
                              value={editDesc}
                              onChange={(e) => setEditDesc(e.target.value)}
                              className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                            />
                          </div>

                           <div className="space-y-2" id="edit-listing-geo-wrapper">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-1" id="edit-geo-header">
                              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Geographical Identity</span>
                              <button
                                id="btn-toggle-edit-manual"
                                type="button"
                                onClick={() => {
                                  setEditManualMode(!editManualMode);
                                }}
                                className="text-[10px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center space-x-1 transition-all"
                              >
                                <Sparkles className="w-3 h-3 text-emerald-500 shrink-0" />
                                <span>{editManualMode ? "← Use dropdown lists" : "✍️ Type manually"}</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-3 gap-4" id="edit-listing-geo-grid">
                              <div className="space-y-1" id="edit-listing-province-f">
                                <label id="lbl-edit-province" className="font-bold text-slate-700 text-xs">Province</label>
                                <select
                                  id="select-edit-province"
                                  required
                                  value={editProvince}
                                  onChange={(e) => { setEditProvince(e.target.value); setEditCity(''); setEditSuburb(''); }}
                                  className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none text-slate-705"
                                >
                                  <option value="">Selection</option>
                                  {PROVINCES.map(p => (
                                    <option id={`edit-prov-opt-${p.id}`} key={p.id} value={p.id}>{p.name}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="space-y-1" id="edit-listing-city-f">
                                <label id="lbl-edit-city" className="font-bold text-slate-700 text-xs">Town / City</label>
                                {editManualMode ? (
                                  <input
                                    id="input-edit-city-manual"
                                    type="text"
                                    required
                                    value={editCity}
                                    onChange={(e) => { setEditCity(e.target.value); setEditSuburb(''); }}
                                    className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                                  />
                                ) : (
                                  <select
                                    id="select-edit-city"
                                    required
                                    disabled={!editProvince}
                                    value={editCity}
                                    onChange={(e) => { setEditCity(e.target.value); setEditSuburb(''); }}
                                    className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none disabled:opacity-50 text-slate-707"
                                  >
                                    <option value="">Select</option>
                                    {editProvinceCities.map(c => (
                                      <option id={`edit-city-opt-${c.id}`} key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                  </select>
                                )}
                              </div>

                              <div className="space-y-1" id="edit-listing-suburb-f">
                                <label id="lbl-edit-suburb" className="font-bold text-slate-700 text-xs">Suburb Zone</label>
                                {editManualMode ? (
                                  <input
                                    id="input-edit-suburb-manual"
                                    type="text"
                                    value={editSuburb}
                                    onChange={(e) => setEditSuburb(e.target.value)}
                                    className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                                  />
                                ) : (
                                  <select
                                    id="select-edit-suburb"
                                    disabled={!editCity}
                                    value={editSuburb}
                                    onChange={(e) => setEditSuburb(e.target.value)}
                                    className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none disabled:opacity-50 text-slate-700"
                                  >
                                    <option value="">None</option>
                                    {editCitySuburbs.map(sub => (
                                      <option id={`edit-sub-opt-${sub}`} key={sub} value={sub}>{sub}</option>
                                    ))}
                                  </select>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1" id="edit-listing-address-f">
                            <label id="lbl-edit-address" className="font-bold text-slate-700">Physical Address Location</label>
                            <input
                              id="input-edit-address"
                              type="text"
                              required
                              value={editAddress}
                              onChange={(e) => setEditAddress(e.target.value)}
                              className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4" id="edit-listing-urls-grid">
                            <div className="space-y-1" id="edit-listing-email-f">
                              <label id="lbl-edit-email" className="font-bold text-slate-701">Active Email</label>
                              <input
                                id="input-edit-email"
                                type="email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>

                            <div className="space-y-1" id="edit-listing-website-f">
                              <label id="lbl-edit-website" className="font-bold text-slate-702">Website HTTPS Link</label>
                              <input
                                id="input-edit-website"
                                type="text"
                                value={editWebsite}
                                onChange={(e) => setEditWebsite(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1" id="edit-listing-tags-f">
                            <label id="lbl-edit-tags" className="font-bold text-slate-70D">Keywords / Tags (comma separated)</label>
                            <input
                              id="input-edit-tags"
                              type="text"
                              value={editTags}
                              onChange={(e) => setEditTags(e.target.value)}
                              className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                            />
                          </div>

                          {/* Extended Administrative Overrides */}
                          <div className="grid grid-cols-2 gap-4 border-t pt-3 border-slate-100" id="edit-listing-extensions-grid-1">
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">Custom Listing Slug</label>
                              <input
                                type="text"
                                placeholder="e.g. sandton-plumping-services"
                                value={editSlug}
                                onChange={(e) => setEditSlug(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none font-mono"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">Custom Listing Image (Any size)</label>
                              <input
                                type="text"
                                placeholder="e.g. HTTPS URL to logo or shop picture"
                                value={editImage}
                                onChange={(e) => setEditImage(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4" id="edit-listing-extensions-grid-2">
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">Services Offered (comma separated)</label>
                              <input
                                type="text"
                                placeholder="e.g. Pipe Leak Repair, Emergency Geysers"
                                value={editServices}
                                onChange={(e) => setEditServices(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">Trading times description</label>
                              <input
                                type="text"
                                placeholder="e.g. Mon-Fri: 8AM-5PM, Sat: 9AM-1PM"
                                value={editTradingTimes}
                                onChange={(e) => setEditTradingTimes(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-3" id="edit-listing-extensions-grid-3">
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">WhatsApp Number</label>
                              <input
                                type="text"
                                placeholder="e.g. +27721234567"
                                value={editWhatsapp}
                                onChange={(e) => setEditWhatsapp(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none font-mono"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">Mobile Number</label>
                              <input
                                type="text"
                                placeholder="e.g. 082 123 4567"
                                value={editMobile}
                                onChange={(e) => setEditMobile(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none font-mono"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">Booking Appointment Required?</label>
                              <select
                                value={editAppointmentRequired}
                                onChange={(e: any) => setEditAppointmentRequired(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              >
                                <option value="no">No Appointment Required</option>
                                <option value="yes">Yes, Appointment Required</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3" id="edit-listing-extensions-grid-4">
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">Facebook Page URL</label>
                              <input
                                type="text"
                                placeholder="https://facebook.com/company"
                                value={editFacebook}
                                onChange={(e) => setEditFacebook(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">Twitter Link</label>
                              <input
                                type="text"
                                placeholder="https://twitter.com/company"
                                value={editTwitter}
                                onChange={(e) => setEditTwitter(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">Instagram URL</label>
                              <input
                                type="text"
                                placeholder="https://instagram.com/company"
                                value={editInstagram}
                                onChange={(e) => setEditInstagram(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold text-slate-700">LinkedIn Corporation URL</label>
                              <input
                                type="text"
                                placeholder="https://linkedin.com/company"
                                value={editLinkedin}
                                onChange={(e) => setEditLinkedin(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2.5 p-3 bg-slate-50 border rounded-xl" id="edit-listing-verified-wrap">
                            <input
                              id="edit-listing-verified-checkbox"
                              type="checkbox"
                              checked={editVerified}
                              onChange={(e) => setEditVerified(e.target.checked)}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded cursor-pointer"
                            />
                            <label htmlFor="edit-listing-verified-checkbox" className="font-bold text-slate-700 cursor-pointer text-xs select-none">
                              Verified & Approved Listing Badge (Shown to public searchers)
                            </label>
                          </div>

                          <button
                            id="edit-listing-submit-btn"
                            type="submit"
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-99 text-white rounded-xl font-bold transition-all flex items-center justify-center shadow-lg"
                          >
                            <span>Save Business Configuration</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* ADMIN EDIT / CREATE SEO PAGE MODAL OVERLAY */}
                  {isCreatingPage && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto" id="edit-page-modal-overlay">
                      <div className="bg-white border rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl relative" id="edit-page-modal">
                        <button
                          id="edit-page-close"
                          onClick={() => setIsCreatingPage(false)}
                          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-550 transition-all"
                        >
                          <X className="w-5 h-5" id="edit-page-x-ico" />
                        </button>

                        <div className="border-b pb-2" id="edit-page-modal-header">
                          <h2 className="text-base font-extrabold text-slate-905 animate-pulse" id="edit-page-modal-h">
                            {editingPage ? 'Update Dynamic SEO Page' : 'Compile Dynamic SEO Guide Page'}
                          </h2>
                          <p className="text-slate-500 text-[11px]" id="edit-page-modal-p">Creating guides boosts organic relevance for South African queries.</p>
                        </div>

                        {pageSaveError && (
                          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs" id="edit-page-error-card">
                            <p className="font-semibold text-[11px]">{pageSaveError}</p>
                          </div>
                        )}

                        <form onSubmit={saveSeoPage} className="space-y-4 text-xs" id="edit-page-form">
                          <div className="grid grid-cols-2 gap-4" id="edit-page-slugs-grid">
                            <div className="space-y-1" id="edit-page-title-f">
                              <label id="lbl-page-title" className="font-bold text-slate-705">Page Title</label>
                              <input
                                id="input-page-title"
                                type="text"
                                required
                                placeholder="e.g. Durban Solar Specialists Guide"
                                value={pageTitle}
                                onChange={(e) => setPageTitle(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>

                            <div className="space-y-1" id="edit-page-slug-f">
                              <label id="lbl-page-slug" className="font-bold text-slate-700">SEO Slug URL (/slug)</label>
                              <input
                                id="input-page-slug"
                                type="text"
                                required
                                placeholder="e.g. durban-solar-guide"
                                value={pageSlug}
                                onChange={(e) => setPageSlug(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1" id="edit-page-meta-f">
                            <label id="lbl-page-meta" className="font-bold text-slate-700">Google SEO Meta Description</label>
                            <input
                              id="input-page-meta"
                              type="text"
                              placeholder="e.g. Find the top verified eco-friendly solar providers in Durban North and uMhlanga Area."
                              value={pageMeta}
                              onChange={(e) => setPageMeta(e.target.value)}
                              className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4" id="edit-page-seo-extra-grid">
                            <div className="space-y-1" id="edit-page-keywords-f">
                              <label id="lbl-page-keywords" className="font-bold text-slate-700">SEO Keywords (Comma Separated)</label>
                              <input
                                id="input-page-keywords"
                                type="text"
                                placeholder="e.g. solar, durban, electrician, backup"
                                value={pageKeywords}
                                onChange={(e) => setPageKeywords(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>

                            <div className="space-y-1" id="edit-page-georegion-f">
                              <label id="lbl-page-georegion" className="font-bold text-slate-700">Geo Region Code (e.g. ZA-GT)</label>
                              <input
                                id="input-page-georegion"
                                type="text"
                                placeholder="e.g. ZA-GT"
                                value={pageGeoRegion}
                                onChange={(e) => setPageGeoRegion(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4" id="edit-page-seo-geo-grid">
                            <div className="space-y-1" id="edit-page-geoplacename-f">
                              <label id="lbl-page-geoplacename" className="font-bold text-slate-700">Geo Place Name (e.g. Sandton)</label>
                              <input
                                id="input-page-geoplacename"
                                type="text"
                                placeholder="e.g. Johannesburg"
                                value={pageGeoPlacename}
                                onChange={(e) => setPageGeoPlacename(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>

                            <div className="space-y-1" id="edit-page-geoposition-f">
                              <label id="lbl-page-geoposition" className="font-bold text-slate-700">Geo Position Coordinate Matrix</label>
                              <input
                                id="input-page-geoposition"
                                type="text"
                                placeholder="e.g. -26.107;28.056"
                                value={pageGeoPosition}
                                onChange={(e) => setPageGeoPosition(e.target.value)}
                                className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white outline-none"
                              />
                            </div>
                          </div>

                          <div className="space-y-1" id="edit-page-content-f">
                            <label id="lbl-page-content" className="font-bold text-slate-70D">Guide Page Body (Markdown elements are preserved)</label>
                            <textarea
                              id="textarea-page-content"
                              rows={8}
                              required
                              placeholder="# Header One&#10;&#10;Provide rich guide text, regional analysis, plumbing certifications..."
                              value={pageContent}
                              onChange={(e) => setPageContent(e.target.value)}
                              className="w-full bg-slate-50 border rounded-lg px-3 py-2 text-xs focus:bg-white font-mono leading-relaxed outline-none"
                            />
                          </div>

                          <button
                            id="edit-page-submit-btn"
                            type="submit"
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg"
                          >
                            <span>Save SEO Document Configuration</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* SINGLE BUSINESS CARD DISPLAY MODE DIALOG (OVERLAY) */}
      <AnimatePresence>
        {selectedListing && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto" id="det-modal-overlay">
            <motion.div
              id="details-layout-modal"
              key="detail-modal"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border text-left rounded-3xl overflow-hidden max-w-xl w-full p-0 shadow-2xl relative max-h-[92vh] overflow-y-auto"
            >
              {/* Detailed image wrapper */}
              <div className="relative h-60 w-full bg-slate-100 overflow-hidden" id="det-img-wrapper">
                <img
                  id="details-image"
                  src={selectedListing.image || `https://picsum.photos/seed/${selectedListing.id}/800/600`}
                  alt={selectedListing.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Close absolute */}
                <button
                  id="det-modal-close-btn"
                  onClick={() => setSelectedListing(null)}
                  className="absolute top-4 right-4 p-2.5 rounded-full bg-white/95 text-slate-850 hover:bg-slate-100 shadow-lg cursor-pointer transition-all border border-slate-200/50"
                  title="Close overview"
                >
                  <X className="w-5 h-5 text-slate-800" id="det-close-x" />
                </button>

                {selectedListing.verified && (
                  <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-md flex items-center space-x-1" id="det-verified-badge">
                    <CheckCircle2 className="w-4 h-4 text-white" id="det-chk-icon" />
                    <span>Verified Business</span>
                  </div>
                )}
              </div>

              {/* Detailed specs */}
              <div className="p-6 md:p-8 space-y-6" id="det-modal-body">
                <div className="space-y-2" id="det-title-group">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 inline-block" id="det-cat-sub">
                    {CATEGORIES.find(c => c.id === selectedListing.category)?.name || selectedListing.category}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight" id="det-primary-title">
                    {selectedListing.name}
                  </h2>
                </div>

                {selectedListing.description && (
                  <div className="space-y-1.5" id="det-desc-block">
                    <span className="block text-xs font-mono text-slate-400 uppercase tracking-wider" id="det-desc-lbl">Company Profile</span>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed" id="det-desc-p">
                      {selectedListing.description}
                    </p>
                  </div>
                )}

                {/* Structured Local Address & Contact Specs */}
                <div className="border-t border-slate-100 pt-5 space-y-3 text-xs text-slate-650" id="det-contacts-strip">
                  <div className="flex items-start space-x-3" id="det-address-row">
                    <MapPin className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" id="det-loc-pin" />
                    <div id="det-address-text">
                      <span className="block font-bold text-slate-800" id="det-suburb-label">
                        {selectedListing.suburb ? `${selectedListing.suburb}, ` : ''}{CITIES_AND_TOWNS.find(c => c.id === selectedListing.city)?.name || selectedListing.city}
                      </span>
                      <p className="text-slate-500 text-[11px] mt-0.5" id="det-full-address">{selectedListing.address}</p>
                    </div>
                  </div>

                  {selectedListing.phone && (
                    <div className="flex items-center space-x-3" id="det-phone-row">
                      <Phone className="w-4.5 h-4.5 text-emerald-600 shrink-0" id="det-phone-ico" />
                      <a id="det-phone-link" href={`tel:${selectedListing.phone}`} className="hover:text-emerald-750 hover:underline font-semibold text-slate-800" title="Click to call local hotline">
                        {selectedListing.phone}
                      </a>
                    </div>
                  )}

                  {selectedListing.email && (
                    <div className="flex items-center space-x-3" id="det-email-row">
                      <Mail className="w-4.5 h-4.5 text-emerald-600 shrink-0" id="det-email-ico" />
                      <a id="det-email-link" href={`mailto:${selectedListing.email}`} className="hover:text-emerald-750 hover:underline font-semibold text-slate-800" title="Email enquiry directly">
                        {selectedListing.email}
                      </a>
                    </div>
                  )}

                  {selectedListing.website && (
                    <div className="flex items-center space-x-3" id="det-web-row">
                      <Globe className="w-4.5 h-4.5 text-emerald-600 shrink-0" id="det-web-ico" />
                      <a id="det-web-link" href={selectedListing.website} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-750 hover:underline font-semibold text-emerald-600 flex items-center space-x-1" title="Visit company website">
                        <span>{selectedListing.website}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-500" id="det-web-ext" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Simulated Geographic Vector Alignment visual support block */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center space-x-3" id="det-geo-visual-card">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-center shrink-0" id="det-geo-ico-bx">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" id="det-shield-chk-ico" />
                  </div>
                  <div className="space-y-1 text-slate-700" id="det-geo-visual-text">
                    <span className="block font-bold text-xs" id="det-verification-indicator">S.A. Directory Verified</span>
                    <p className="text-[10px] text-slate-550 leading-relaxed font-mono" id="det-verification-date-lbl font">Listed on: {new Date(selectedListing.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Admin Direct Power Action Edit Button */}
                {isAdminLoggedIn && (
                  <div className="border-t border-slate-100 pt-4 flex justify-end" id="det-admin-edit-action-container">
                    <button
                      type="button"
                      id="det-admin-edit-action-btn"
                      onClick={() => {
                        const listingToEdit = { ...selectedListing };
                        setSelectedListing(null);
                        startEditListing(listingToEdit);
                      }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Admin: Edit Listing Details</span>
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 border-t border-slate-100 pt-4" id="det-tags-block">
                  {selectedListing.tags.map((tag, tIdx) => (
                    <span id={`det-tag-lbl-${selectedListing.id}-${tIdx}`} key={tag} className="bg-slate-100 text-slate-550 px-2.5 py-1 rounded-md text-[11px] font-mono leading-none">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECURE FOOTER CONTENT */}
      <footer className="bg-slate-900 border-t border-slate-850 py-12 text-slate-400 mt-16 text-xs sm:text-sm" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8" id="footer-layout">
          <div className="space-y-4 md:col-span-1" id="footer-desc-col">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setActiveTab('explore'); setViewingPage(null); setActivePageSlug(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} id="footer-logo-block">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0" id="footer-logo-icon">
                <Search className="w-6 h-6 text-white" id="footer-logo-search" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block leading-tight" id="footer-logo-title">
                  <span className="text-white font-black text-2xl inline-block mr-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_1.5px_1.5px_0_#10b981,_-1.5px_-1.5px_0_#10b981,_1.5px_-1.5px_0_#10b981,_-1.5px_1.5px_0_#10b981]">B</span>iz<span className="text-emerald-500 font-black text-2xl inline-block mx-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_1.5px_1.5px_0_#000,_-1.5px_-1.5px_0_#000,_1.5px_-1.5px_0_#000,_-1.5px_1.5px_0_#000]">S</span>earch24
                </span>
                <span className="block text-[10px] font-mono tracking-widest text-slate-400 -mt-0.5" id="footer-logo-sub">SOUTH AFRICA</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed pt-2" id="footer-logo-desc">
              Connecting local clients with verified tradesmen and businesses across South Africa.
            </p>
            <span className="block text-[10.5px] font-mono text-slate-500 pt-1" id="footer-copyright-lbl">© 2026 Bizsearch24 SA. All Rights Reserved.</span>
          </div>

          <div className="space-y-2 md:col-span-1 text-xs" id="footer-prov-col">
            <span className="text-white font-bold block" id="footer-prov-lbl">Active Provinces</span>
            <div className="grid grid-cols-2 gap-1.5" id="footer-prominent-provs">
              {PROVINCES.map(p => (
                <button
                  id={`footer-prov-link-${p.id}`}
                  key={p.id}
                  onClick={() => { setSelectedProvince(p.id); setActiveTab('explore'); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                  className="text-left text-slate-450 hover:text-white transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 md:col-span-1 text-xs" id="footer-tech-col">
            <span className="text-white font-bold block" id="footer-links-lbl">Quick Links</span>
            <ul className="space-y-1.5 text-slate-450" id="footer-links-items">
              <li><button onClick={() => { setActiveTab('explore'); setViewingPage(null); setActivePageSlug(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-white transition-colors cursor-pointer">Explore Directory</button></li>
              <li><button onClick={() => { setActiveTab('submit'); setViewingPage(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-white transition-colors cursor-pointer">Submit Your Business</button></li>
              <li><button onClick={() => { setActiveTab('pages'); if (seoPages.length > 0 && !viewingPage) handlePageSelect(seoPages[0].slug); else window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-white transition-colors cursor-pointer">SEO Local Guides</button></li>
              <li className="pt-0.5"><Link href="/news" className="text-left hover:text-emerald-400 text-emerald-500 font-bold block transition-colors">SA News Feed</Link></li>
              <li><Link href="/sitemap" className="text-left hover:text-white transition-colors block">Visual Sitemap</Link></li>
            </ul>
          </div>

          <div className="space-y-3 md:col-span-1 text-xs" id="footer-admin-col">
            <span className="text-white font-semibold block" id="footer-admin-lbl">S.A. Partners Desk</span>
            <p className="text-[11px] leading-relaxed text-slate-500 font-medium" id="footer-admin-desc">
              All logins are secure. New public business registrations are checked and approved before going live.
            </p>
            {isAdminLoggedIn ? (
              <button
                id="footer-btn-dash-goto"
                onClick={() => { setActiveTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-emerald-400 hover:text-emerald-350 hover:underline font-bold transition-colors flex items-center space-x-1"
              >
                <span>Access My Dashboard</span>
                <ChevronRight className="w-4 h-4" id="footer-arr-dash" />
              </button>
            ) : (
              <button
                id="footer-btn-login-goto"
                onClick={() => { setActiveTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="text-slate-350 hover:text-white hover:underline transition-colors flex items-center space-x-1"
              >
                <LogIn className="w-4 h-4 text-slate-400" id="footer-login-ico" />
                <span>Partner Sign In</span>
              </button>
            )}

            <button
              id="footer-btn-legal-rules"
              onClick={() => { setShowLegalModal(true); setIsLegalExpanded(true); }}
              className="text-[11px] text-amber-500 hover:text-amber-400 font-bold flex items-center space-x-1.5 mt-3 pt-2.5 border-t border-slate-800 transition-all text-left uppercase font-mono"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Legal Disclaimers & POPIA</span>
            </button>
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
                  <h3 className="font-extrabold text-slate-900 text-xs">
                    1. Directory Usage Terms
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    Welcome to Bizsearch24! This directory allows you to find public trade services across South African cities and towns.
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Directory access is free for normal individual searches. Automated crawling, scraping, or heavy copying is strictly prohibited.
                  </p>
                </div>

                {/* 2. DATA PRIVACY POLICY */}
                <div className="space-y-1.5 border-b pb-3 border-slate-100" id="safety-pane-privacy">
                  <h3 className="font-extrabold text-slate-900 text-xs">2. Data Privacy Policy</h3>
                  <p className="text-[11px] text-slate-600">
                    We collect simple nameless cookies to understand search volumes and help improve our search rankings.
                    We do not track your personal device location, contacts list, or identity.
                  </p>
                </div>

                {/* 3. POPIA COMPLIANCE */}
                <div className="space-y-1.5 border-b pb-3 border-slate-100" id="safety-pane-popia">
                  <h3 className="font-extrabold text-slate-900 text-xs">3. POPIA Compliance (Act 4 of 2513)</h3>
                  <p className="text-[11px] text-slate-600">
                    We comply with the Protection of Personal Information Act of South Africa. Bizsearch24 acts as an index of public-domain business records.
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Any business owner listed in our search results has the right to update details, confirm correct address data, or request permanent removal at any time by contacting our administrators.
                  </p>
                </div>

                {/* 4. SCAM WATCH & SAFETY DISCLAIMER (SHOW LAST!) */}
                <div className="space-y-1.5 bg-amber-50 border border-amber-200 p-3 rounded-xl" id="safety-pane-agreement">
                  <div className="flex items-center space-x-1 text-amber-800 font-extrabold uppercase tracking-wider text-[10px]">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>⚠️ SCAM WARNING & DISCLAIMER</span>
                  </div>
                  <p className="text-[11px] leading-relaxed font-bold text-amber-950">
                    This search index is purely for general information. Bizsearch24 does not endorse, verify qualifications, or guarantee any details of the listings published here. It is your sole responsibility to check CIPC registration or trade credentials before paying any funds.
                  </p>
                  <p className="text-[11.5px] leading-relaxed text-amber-900 mt-1 font-semibold">
                    By proceeding, you agree that Bizsearch24 and its owners accept NO liability for any loss, damage, scam, or distress. You use this free search directory at your own choice.
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
            <div className="flex items-center space-x-4 shrink-0 w-full md:w-auto justify-center md:justify-end" id="consent-actions bg-slate-900">
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
