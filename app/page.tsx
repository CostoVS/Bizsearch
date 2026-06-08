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
  Check,
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
  AlertOctagon,
  TrendingUp,
  CheckSquare,
  Home,
  GraduationCap,
  Scissors,
  Laptop,
  PenTool,
  Music,
  Flower2,
  Truck,
  PawPrint,
  Factory,
  Scale,
  Coins,
  Dumbbell,
  Baby,
  Heart,
  Building,
  Layers,
  Camera,
  Lock,
  Smile,
  Pill,
  Brain,
  Bug,
  Key,
  Zap,
  Snowflake,
  Sun,
  Compass,
  Droplet,
  HardHat,
  Pizza,
  Wine,
  ClipboardList,
  Palette,
  BookOpen,
  Wifi,
  Megaphone,
  Building2,
  Shirt,
  Tv,
  Gamepad2,
  Store,
  Wind,
  Trees,
  Waves,
  PackageOpen,
  Volume2,
  Send,
  Gift,
  Armchair,
  Users,
  Calculator,
  Tag,
  Anchor,
  Plane,
  Calendar,
  Activity,
  Grid,
  Leaf,
  TrendingDown,
  Printer,
  Coffee,
  ThumbsUp,
  Share2,
  Image as ImageIcon,
  Star
} from 'lucide-react';

import { PROVINCES, CITIES_AND_TOWNS, CATEGORIES } from '@/lib/saData';
import { BusinessListing, DynamicPage, SlugMapping, BizAd, VisitorTrackingLog } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function Bizsearch24Home() {
  // Navigation tabs: 'explore' | 'submit' | 'pages' | 'services' | 'admin' | 'feed'
  const [activeTab, setActiveTab] = React.useState<'explore' | 'submit' | 'pages' | 'services' | 'admin' | 'feed'>('explore');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);

  // States for general listings
  const [listings, setListings] = React.useState<BusinessListing[]>([]);
  const [feedPosts, setFeedPosts] = React.useState<any[]>([]);
  const [loadingListings, setLoadingListings] = React.useState<boolean>(true);

  // Filter criteria states
  const [term, setTerm] = React.useState<string>('');
  const [selectedProvince, setSelectedProvince] = React.useState<string>('');
  const [selectedCity, setSelectedCity] = React.useState<string>('');
  const [selectedSuburb, setSelectedSuburb] = React.useState<string>('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = React.useState<boolean>(false);
  const [categorySearchQuery, setCategorySearchQuery] = React.useState<string>('');
  const catDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (catDropdownRef.current && !catDropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
  const [regUsername, setRegUsername] = React.useState<string>('');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = React.useState<boolean>(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = React.useState<string>('');
  const [forgotPasswordMsg, setForgotPasswordMsg] = React.useState<string>('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = React.useState<boolean>(false);
  const [adminToken, setAdminToken] = React.useState<string>('');
  const [authError, setAuthError] = React.useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = React.useState<boolean>(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState<boolean>(false);
  const [userRole, setUserRole] = React.useState<string>('USER');
  const [isRegistering, setIsRegistering] = React.useState<boolean>(false);
  const [postLoginIntent, setPostLoginIntent] = React.useState<string | null>(null);
  const [regTier, setRegTier] = React.useState<'FREE' | 'PREMIUM'>('FREE');
  const [userFormSelectedTier, setUserFormSelectedTier] = React.useState<'FREE' | 'PREMIUM'>('FREE');
  const [userFormTier, setUserFormTier] = React.useState<'FREE' | 'PREMIUM'>('FREE');
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
  const [editExpiresAt, setEditExpiresAt] = React.useState<string>('');
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
  const [editTiktok, setEditTiktok] = React.useState<string>('');
  const [editYoutube, setEditYoutube] = React.useState<string>('');
  const [editAppointmentRequired, setEditAppointmentRequired] = React.useState<'yes' | 'no'>('no');

  // Ad placement management states
  const [adsList, setAdsList] = React.useState<BizAd[]>([]);
  const [adminAds, setAdminAds] = React.useState<BizAd[]>([]);
  const [adsLoading, setAdsLoading] = React.useState<boolean>(false);
  const [isCreatingAd, setIsCreatingAd] = React.useState<boolean>(false);
  const [editingAd, setEditingAd] = React.useState<BizAd | null>(null);
  const [dismissedBannerId, setDismissedBannerId] = React.useState<string | null>(null);
  
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
  const [adTargetPage, setAdTargetPage] = React.useState<'all' | 'home' | 'news' | 'sitemaps'>('all');
  const [adLayoutRow, setAdLayoutRow] = React.useState<'top' | 'middle' | 'bottom'>('top');
  const [adOrderIndex, setAdOrderIndex] = React.useState<string>('0');

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

  // Find current active top-banner ad to display site-wide
  const activeTopBanner = React.useMemo(() => {
    const banner = adsList.find(ad => ad.active && ad.position === 'top-banner');
    if (banner && banner.id !== dismissedBannerId) {
      return banner;
    }
    return null;
  }, [adsList, dismissedBannerId]);

  const { topAds, middleAds, bottomAds } = React.useMemo(() => {
    const activeAds = adsList.filter(ad => ad.active);
    return {
      topAds: activeAds.filter(ad => ad.layoutRow === 'top' || !ad.layoutRow),
      middleAds: activeAds.filter(ad => ad.layoutRow === 'middle'),
      bottomAds: activeAds.filter(ad => ad.layoutRow === 'bottom')
    };
  }, [adsList]);

  // Visitor traffic logs and tracking states
  const [visitorLogs, setVisitorLogs] = React.useState<any[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = React.useState<boolean>(false);
  const [analyticsTimeFilter, setAnalyticsTimeFilter] = React.useState<'all' | 'today' | 'yesterday' | 'week' | 'month' | 'year'>('all');
  const [analyticsSearchFilter, setAnalyticsSearchFilter] = React.useState<string>('');

  // Admin section sub-tab switcher
  const [adminActiveSubTab, setAdminActiveSubTab] = React.useState<'listings' | 'ads' | 'analytics' | 'users' | 'feed' | 'moderation' | 'profile'>('listings');

  // Moderation state
  const [moderationLogs, setModerationLogs] = React.useState<any[]>([]);
  const [moderationLoading, setModerationLoading] = React.useState<boolean>(false);

  const fetchModerationLogs = React.useCallback(async () => {
    setModerationLoading(true);
    try {
      const res = await fetch('/api/admin/moderation', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setModerationLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setModerationLoading(false);
    }
  }, [adminToken]);

  // Admin Users Manager states
  const [adminUsers, setAdminUsers] = React.useState<any[]>([]);
  const [adminUsersLoading, setAdminUsersLoading] = React.useState<boolean>(false);
  const [editingUser, setEditingUser] = React.useState<any | null>(null);
  const [isAddingUser, setIsAddingUser] = React.useState<boolean>(false);
  
  const [userFormEmail, setUserFormEmail] = React.useState<string>('');
  const [userFormPassword, setUserFormPassword] = React.useState<string>('');
  const [userFormRole, setUserFormRole] = React.useState<string>('USER');
  const [userFormFirstName, setUserFormFirstName] = React.useState<string>('');
  const [userFormLastName, setUserFormLastName] = React.useState<string>('');
  const [userFormFullName, setUserFormFullName] = React.useState<string>('');
  const [userFormPhone, setUserFormPhone] = React.useState<string>('');
  const [userFormIdNumber, setUserFormIdNumber] = React.useState<string>('');
  const [userFormCompanyRegNumber, setUserFormCompanyRegNumber] = React.useState<string>('');
  const [userFormBillingAddress, setUserFormBillingAddress] = React.useState<string>('');
  const [userFormShowProfileDetails, setUserFormShowProfileDetails] = React.useState<boolean>(false);
  const [userFormProfileColor, setUserFormProfileColor] = React.useState<string>('slate');
  const [userFormWebsite, setUserFormWebsite] = React.useState<string>('');
  const [userFormBusinessName, setUserFormBusinessName] = React.useState<string>('');
  const [userFormVatNumber, setUserFormVatNumber] = React.useState<string>('');
  const [userFormMaxListings, setUserFormMaxListings] = React.useState<number>(1);
  const [userFormIsBanned, setUserFormIsBanned] = React.useState<boolean>(false);
  const [adminUserFormMsg, setAdminUserFormMsg] = React.useState<string>('');

  // User Profile
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [copiedPostId, setCopiedPostId] = React.useState<string | null>(null);
  const [activeShareMenuId, setActiveShareMenuId] = React.useState<string | null>(null);
  const [profileSaveMsg, setProfileSaveMsg] = React.useState('');

  const formatDisplayName = (name: string) => {
    if (!name) return "BizSearch Member";
    if (name.includes('@')) {
      if (name.toLowerCase().startsWith('admin')) {
        return "BizSearch24 Administrator";
      }
      const part = name.split('@')[0];
      return part.charAt(0).toUpperCase() + part.slice(1);
    }
    return name;
  };
  const [newProfilePassword, setNewProfilePassword] = React.useState('');
  const [isConfiguringProfile2FA, setIsConfiguringProfile2FA] = React.useState<boolean>(false);
  const [profileMfaToken, setProfileMfaToken] = React.useState<string>('');
  const [wantDeleteAccount, setWantDeleteAccount] = React.useState<boolean>(false);

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
  const [subServices, setSubServices] = React.useState<string>('');
  const [subWhatsapp, setSubWhatsapp] = React.useState<string>('');
  const [subFacebook, setSubFacebook] = React.useState<string>('');
  const [subInstagram, setSubInstagram] = React.useState<string>('');
  const [subTiktok, setSubTiktok] = React.useState<string>('');
  const [subYoutube, setSubYoutube] = React.useState<string>('');
  const [submittingUser, setSubmittingUser] = React.useState<boolean>(false);
  const [submissionSuccess, setSubmissionSuccess] = React.useState<string>('');
  const [submissionError, setSubmissionError] = React.useState<string>('');
  const [subTier, setSubTier] = React.useState<'free' | 'premium'>('free');
  const [subImage, setSubImage] = React.useState<string>('');
  const [showUpgradePrompt, setShowUpgradePrompt] = React.useState<boolean>(false);

  // Quick stats computed on verified listings
  const totalListingsCount = listings.length;
  const verifiedListingsCount = listings.filter(l => l.verified).length;

  const sortedListings = React.useMemo(() => {
    return [...listings].sort((a, b) => {
      if (a.verified === b.verified) return 0;
      return a.verified ? -1 : 1;
    });
  }, [listings]);

  const fetchFeedPosts = React.useCallback(async () => {
    try {
      const res = await fetch('/api/feed');
      const data = await res.json();
      if (data.success && data.posts) {
        setFeedPosts(data.posts);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

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
      qParams.append('publicAll', 'true'); // Fetch both verified and unverified for public directories

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
      qParams.append('page', 'home');
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

  // Full History Analytics CSV exporter
  const downloadAnalyticsCSV = React.useCallback(async () => {
    if (!adminToken) return;
    setAnalyticsLoading(true);
    try {
      const res = await fetch('/api/analytics?limit=all', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (!data.success || !data.logs || data.logs.length === 0) {
        alert('No logger entries available to download.');
        return;
      }
      
      const headers = ['Session ID', 'Timestamp', 'Date', 'Time', 'Visitor IP', 'Device', 'Referrer Source', 'Landing Path/Page', 'Search Queries', 'Clicks & Activities'];
      const rows = data.logs.map((l: any) => [
        l.id,
        l.timestamp,
        new Date(l.timestamp).toLocaleDateString('en-ZA'),
        new Date(l.timestamp).toLocaleTimeString('en-ZA'),
        l.ip,
        l.deviceType || 'Desktop',
        l.referrer || 'Direct Land',
        l.path || '/',
        l.searches && l.searches.length > 0 ? l.searches.join('; ') : 'None',
        l.clicks && l.clicks.length > 0 ? l.clicks.map((c: any) => c.elementText).join('; ') : 'None'
      ]);

      const csvContent = [
        headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
        ...rows.map((r: string[]) => r.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `BizSearch24_Visitor_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error compiling csv download:', err);
      alert('Could not export CSV data.');
    } finally {
      setAnalyticsLoading(false);
    }
  }, [adminToken]);

  // Client-side analytics logs filters
  const filteredLogs = React.useMemo(() => {
    return visitorLogs.filter(log => {
      // 1. Time interval filtering
      const logDate = new Date(log.timestamp);
      const now = new Date();
      
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(yesterdayStart.getDate() - 1);
      
      const oneWeekAgo = new Date(now);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      
      if (analyticsTimeFilter === 'today') {
        if (logDate < todayStart) return false;
      } else if (analyticsTimeFilter === 'yesterday') {
        if (logDate < yesterdayStart || logDate >= todayStart) return false;
      } else if (analyticsTimeFilter === 'week') {
        if (logDate < oneWeekAgo) return false;
      } else if (analyticsTimeFilter === 'month') {
        if (logDate < oneMonthAgo) return false;
      } else if (analyticsTimeFilter === 'year') {
        if (logDate < oneYearAgo) return false;
      }

      // 2. Text free query filtering (Visitor IP, Path, Referrer, searches and click events text)
      if (analyticsSearchFilter) {
        const query = analyticsSearchFilter.toLowerCase().trim();
        const ipMatch = log.ip?.toLowerCase().includes(query);
        const pathMatch = (log.path || '').toLowerCase().includes(query);
        const referrerMatch = (log.referrer || '').toLowerCase().includes(query);
        const searchQueryMatch = log.searches && log.searches.some((s: string) => s.toLowerCase().includes(query));
        const clicksMatch = log.clicks && log.clicks.some((c: any) => c.elementText?.toLowerCase().includes(query));
        
        return ipMatch || pathMatch || referrerMatch || searchQueryMatch || clicksMatch;
      }
      
      return true;
    });
  }, [visitorLogs, analyticsTimeFilter, analyticsSearchFilter]);

  // Administrative users load helper
  const fetchAdminUsers = React.useCallback(async () => {
    if (!adminToken) return;
    setAdminUsersLoading(true);
    try {
      const res = await fetch('/api/user/admin', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = await res.json();
      if (data.success) {
        setAdminUsers(data.users || []);
      }
    } catch (err) {
      console.error('Failed to load admin users:', err);
    } finally {
      setAdminUsersLoading(false);
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
      fetchFeedPosts();
      fetchSeoPages();
      fetchAdsList();
      trackVisitActivity('init', '/');
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchListings, fetchSeoPages, fetchAdsList, trackVisitActivity]);

  // Track active tab navigation changes
  React.useEffect(() => {
    if (activeTab !== 'explore') {
      trackVisitActivity('tab_switch', `/${activeTab}`);
    }
  }, [activeTab, trackVisitActivity]);

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
        if (profData.profile.selectedTier) {
          setSubTier(profData.profile.selectedTier.toLowerCase());
        }
        if (profData.profile.role === 'ADMIN') {
          fetchAdminAds();
          fetchAnalyticsLogs();
          fetchAdminUsers();
        }
        if (postLoginIntent === 'submit') {
          setActiveTab('submit');
          setPostLoginIntent(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
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
  }, [adminToken, userRole, handleLogout, fetchAdminAds, fetchAnalyticsLogs, fetchAdminUsers]);

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

  const handleCreateAdClick = () => {
    setViewingPage(null);
    setMobileMenuOpen(false);
    if (!isAdminLoggedIn) {
      if (!isRegistering) {
        setIsRegistering(true);
      }
      setPostLoginIntent('submit');
      setActiveTab('admin');
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } else {
      setActiveTab('submit');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
        trackVisitActivity('view_page', `/pages/${slug}`, { search: `SEO Page Guide: "${data.page?.title || slug}"` });
      }
    } catch (err) {
      console.error('Error fetching dynamic slug:', err);
    }
  };

  // Form Submission handles (Public)
  const handlePublicFormSubmitGate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError('');
    setSubmissionSuccess('');
    if (!isAdminLoggedIn) {
      setSubmissionError('You must be logged in to create an ad.');
      return;
    }
    if (!subName || !subCategory || !subAddress || !subProvince || !subCity) {
      setSubmissionError('Please fill in all mandatory fields.');
      return;
    }
    if (subTier === 'free') {
      setShowUpgradePrompt(true);
    } else {
      handlePublicSubmit(e);
    }
  };

  const handleConfirmFreeSubmit = async () => {
    setShowUpgradePrompt(false);
    const dummyEvent = {
      preventDefault: () => {}
    } as React.FormEvent;
    await handlePublicSubmit(dummyEvent);
  };

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

    // Safety check first for profanity and appropriate content
    try {
      const safetyRes = await fetch('/api/safety-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: subImage || '', 
          caption: `Business Name: ${subName}. Description: ${subDesc || 'N/A'}. Tags: ${subTags || 'N/A'}` 
        }),
      });
      const safetyData = await safetyRes.json();
      if (!safetyData.safe) {
        setSubmissionError('Safety rejection: ' + (safetyData.reason || 'Content contains inappropriate language or imagery.'));
        setSubmittingUser(false);
        return;
      }
    } catch (e) {
      console.warn('Safety check connection bypass');
    }

    if (subEmail) {
      const emailDomain = subEmail.toLowerCase().split('@')[1];
      const freeDomains = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'ymail.com', 
        'live.com', 'aol.com', 'icloud.com', 'mail.ru', 'protonmail.com', 
        'webmail.co.za', 'zoho.com', 'proton.me', 'gmx.com', 'mail.com'
      ];
      if (emailDomain && freeDomains.some(fd => emailDomain === fd || emailDomain.endsWith('.' + fd))) {
        setSubmissionError('Free email addresses (like Gmail, Yahoo, Hotmail, etc.) are not permitted for listing ads. Please use a professional business email address (e.g. contact@yourcompany.co.za).');
        setSubmittingUser(false);
        return;
      }
    }

    try {
      const tagArray = subTags ? subTags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken || ''}`
        },
        body: JSON.stringify({
          name: subName,
          description: subTier === 'premium' ? subDesc : '',
          category: subCategory,
          address: subAddress,
          province: subProvince,
          city: subCity,
          suburb: subSuburb,
          phone: subPhone,
          email: subTier === 'premium' ? subEmail : '',
          website: subTier === 'premium' ? subWebsite : '',
          tags: subTier === 'premium' ? tagArray : [],
          servicesOffered: subTier === 'premium' ? (subServices ? subServices.split(',').map(s => s.trim()).filter(Boolean) : []) : [],
          image: subTier === 'premium' ? subImage : '',
          whatsappNumber: subTier === 'premium' ? subWhatsapp : '',
          facebookUrl: subTier === 'premium' ? subFacebook : '',
          instagramUrl: subTier === 'premium' ? subInstagram : '',
          tiktokUrl: subTier === 'premium' ? subTiktok : '',
          youtubeUrl: subTier === 'premium' ? subYoutube : '',
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
        setSubServices('');
        setSubImage('');
        setSubTier('free');
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
      const body = isRegistering 
        ? { email: adminUsername, username: regUsername, password: adminPassword, selectedTier: regTier }
        : { email: adminUsername, password: adminPassword };

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
    setEditExpiresAt(listing.expiresAt ? listing.expiresAt : '');
    
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
    setEditTiktok(listing.tiktokUrl || '');
    setEditYoutube(listing.youtubeUrl || '');
    setEditAppointmentRequired(listing.appointmentRequired || 'no');

    setEditListingError('');
  };

  const handleDeleteListing = async (listing: BusinessListing) => {
    if (!confirm(`Are you absolutely sure you want to permanently delete "${listing.name}" from the directory? This action is irreversible.`)) return;
    try {
      const res = await fetch('/api/listings/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ id: listing.id, action: 'delete' })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
        fetchListings();
      } else {
        alert(data.message || 'Error deleting business listing.');
      }
    } catch (err) {
      console.error('Delete listing error:', err);
      alert('Network failure attempting to delete listing.');
    }
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
          expiresAt: editExpiresAt || null,
          // Extended attributes:
          servicesOffered: serviceArray,
          tradingTimes: editTradingTimes,
          whatsappNumber: editWhatsapp,
          mobileNumber: editMobile,
          facebookUrl: editFacebook,
          twitterUrl: editTwitter,
          instagramUrl: editInstagram,
          linkedinUrl: editLinkedin,
          tiktokUrl: editTiktok,
          youtubeUrl: editYoutube,
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
    const handleOpenAd = (e: any) => {
      const ad = e.detail;
      // Try to find a matching listing if targetUrl is an ID or slug
      let matched = listings.find(l => l.id === ad.id || (ad.targetUrl && ad.targetUrl.includes(l.slug)));
      if (!matched) {
        // Create a dummy listing from ad data so the modal has something to show
        matched = {
          id: ad.id,
          name: ad.title,
          description: ad.description || 'Verified Sponsor Advertisement',
          category: 'sponsored',
          address: ad.city || 'National',
          province: ad.province || 'South Africa',
          city: ad.city || '',
          suburb: ad.suburb || '',
          phone: '', email: '', website: ad.targetUrl || '',
          verified: true, image: ad.imageUrl, tags: ['sponsored'], views: 0, slug: ad.id, createdAt: ad.createdAt
        };
      }
      setSelectedListing(matched);
    };
    window.addEventListener('open-ad-details', handleOpenAd);
    return () => window.removeEventListener('open-ad-details', handleOpenAd);
  }, [listings]);

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
      case 'dental': return <Smile className="w-5 h-5 text-emerald-600" id="cat-icon-dental" />;
      case 'pharmacy': return <Pill className="w-5 h-5 text-teal-600" id="cat-icon-pharmacy" />;
      case 'therapy-mental': return <Brain className="w-5 h-5 text-violet-600" id="cat-icon-therapy-mental" />;
      case 'holistic-wellness': return <Leaf className="w-5 h-5 text-emerald-750" id="cat-icon-holistic-wellness" />;
      case 'elder-care': return <Users className="w-5 h-5 text-stone-600" id="cat-icon-elder-care" />;
      case 'services': return <Briefcase className="w-5 h-5 text-blue-600" id="cat-icon-services" />;
      case 'legal': return <Scale className="w-5 h-5 text-slate-700" id="cat-icon-legal" />;
      case 'accounting-tax': return <Calculator className="w-5 h-5 text-indigo-650" id="cat-icon-accounting-tax" />;
      case 'finance-insurance': return <Coins className="w-5 h-5 text-green-600" id="cat-icon-finance-insurance" />;
      case 'security-services': return <ShieldCheck className="w-5 h-5 text-teal-600" id="cat-icon-security-services" />;
      case 'pest-control': return <Bug className="w-5 h-5 text-amber-700" id="cat-icon-pest-control" />;
      case 'locksmith': return <Key className="w-5 h-5 text-orange-600" id="cat-icon-locksmith" />;
      case 'debt-collection': return <TrendingDown className="w-5 h-5 text-rose-600" id="cat-icon-debt-collection" />;
      case 'translation-writing': return <PenTool className="w-5 h-5 text-rose-500" id="cat-icon-translation-writing" />;
      case 'printing-signage': return <Printer className="w-5 h-5 text-violet-600" id="cat-icon-printing-signage" />;
      case 'automotive': return <Car className="w-5 h-5 text-indigo-600" id="cat-icon-automotive" />;
      case 'panel-beating': return <Hammer className="w-5 h-5 text-blue-600" id="cat-icon-panel-beating" />;
      case 'car-dealerships': return <Tag className="w-5 h-5 text-cyan-600" id="cat-icon-car-dealerships" />;
      case 'trucking-logistics': return <Truck className="w-5 h-5 text-sky-600" id="cat-icon-trucking-logistics" />;
      case 'maritime-marine': return <Anchor className="w-5 h-5 text-blue-700" id="cat-icon-maritime-marine" />;
      case 'aviation-drones': return <Plane className="w-5 h-5 text-indigo-700" id="cat-icon-aviation-drones" />;
      case 'trades': return <Wrench className="w-5 h-5 text-orange-600" id="cat-icon-trades" />;
      case 'electrical': return <Zap className="w-5 h-5 text-yellow-500" id="cat-icon-electrical" />;
      case 'hvac': return <Snowflake className="w-5 h-5 text-cyan-500" id="cat-icon-hvac" />;
      case 'carpentry': return <Hammer className="w-5 h-5 text-amber-600" id="cat-icon-carpentry" />;
      case 'solar-energy': return <Sun className="w-5 h-5 text-yellow-600" id="cat-icon-solar-energy" />;
      case 'construction': return <Hammer className="w-5 h-5 text-slate-500" id="cat-icon-construction" />;
      case 'architecture': return <Compass className="w-5 h-5 text-indigo-500" id="cat-icon-architecture" />;
      case 'roofing': return <Home className="w-5 h-5 text-neutral-600" id="cat-icon-roofing" />;
      case 'machinery-hire': return <Layers className="w-5 h-5 text-violet-500" id="cat-icon-machinery-hire" />;
      case 'boreholes-water': return <Droplet className="w-5 h-5 text-blue-500" id="cat-icon-boreholes-water" />;
      case 'mining-extractives': return <HardHat className="w-5 h-5 text-stone-700" id="cat-icon-mining-extractives" />;
      case 'industrial-mfg': return <Factory className="w-5 h-5 text-stone-600" id="cat-icon-industrial-mfg" />;
      case 'waste-recycling': return <Trash2 className="w-5 h-5 text-lime-600" id="cat-icon-waste-recycling" />;
      case 'food': return <Utensils className="w-5 h-5 text-amber-600" id="cat-icon-food" />;
      case 'fast-food': return <Coffee className="w-5 h-5 text-orange-600" id="cat-icon-fast-food" />;
      case 'catering-events': return <Pizza className="w-5 h-5 text-pink-500" id="cat-icon-catering-events" />;
      case 'liquor-breweries': return <Wine className="w-5 h-5 text-red-700" id="cat-icon-liquor-breweries" />;
      case 'real-estate': return <Building className="w-5 h-5 text-cyan-600" id="cat-icon-real-estate" />;
      case 'valutations': return <ClipboardList className="w-5 h-5 text-teal-600" id="cat-icon-valutations" />;
      case 'interior-decor': return <Palette className="w-5 h-5 text-purple-600" id="cat-icon-interior-decor" />;
      case 'education': return <GraduationCap className="w-5 h-5 text-indigo-700" id="cat-icon-education" />;
      case 'tutoring': return <BookOpen className="w-5 h-5 text-sky-600" id="cat-icon-tutoring" />;
      case 'tech-it': return <Laptop className="w-5 h-5 text-purple-600" id="cat-icon-tech-it" />;
      case 'telecoms': return <Wifi className="w-5 h-5 text-teal-600" id="cat-icon-telecoms" />;
      case 'digital-marketing': return <Megaphone className="w-5 h-5 text-rose-500" id="cat-icon-digital-marketing" />;
      case 'digital-media': return <Camera className="w-5 h-5 text-violet-600" id="cat-icon-digital-media" />;
      case 'coworking': return <Users className="w-5 h-5 text-blue-600" id="cat-icon-coworking" />;
      case 'ngos-charities': return <Heart className="w-5 h-5 text-rose-500" id="cat-icon-ngos-charities" />;
      case 'religious': return <Globe className="w-5 h-5 text-slate-600" id="cat-icon-religious" />;
      case 'municipality': return <Building2 className="w-5 h-5 text-emerald-700" id="cat-icon-municipality" />;
      case 'tourism': return <Palmtree className="w-5 h-5 text-cyan-500" id="cat-icon-tourism" />;
      case 'travel-agency': return <Compass className="w-5 h-5 text-blue-600" id="cat-icon-travel-agency" />;
      case 'fitness-gym': return <Dumbbell className="w-5 h-5 text-orange-600" id="cat-icon-fitness-gym" />;
      case 'sports-clubs': return <Activity className="w-5 h-5 text-emerald-600" id="cat-icon-sports-clubs" />;
      case 'beauty-wellness': return <Scissors className="w-5 h-5 text-fuchsia-500" id="cat-icon-beauty-wellness" />;
      case 'massage-spa': return <Sparkles className="w-5 h-5 text-teal-500" id="cat-icon-massage-spa" />;
      case 'tailoring': return <Scissors className="w-5 h-5 text-pink-600" id="cat-icon-tailoring" />;
      case 'retail': return <ShoppingBag className="w-5 h-5 text-pink-600" id="cat-icon-retail" />;
      case 'fashion-apparel': return <Shirt className="w-5 h-5 text-sky-600" id="cat-icon-fashion-apparel" />;
      case 'electronics': return <Tv className="w-5 h-5 text-purple-600" id="cat-icon-electronics" />;
      case 'hardware-store': return <Hammer className="w-5 h-5 text-stone-700" id="cat-icon-hardware-store" />;
      case 'toy-hobby': return <Gamepad2 className="w-5 h-5 text-red-500" id="cat-icon-toy-hobby" />;
      case 'bookshops': return <BookOpen className="w-5 h-5 text-indigo-500" id="cat-icon-bookshops" />;
      case 'art-galleries': return <Palette className="w-5 h-5 text-rose-500" id="cat-icon-art-galleries" />;
      case 'music-instruments': return <Music className="w-5 h-5 text-amber-500" id="cat-icon-music-instruments" />;
      case 'florists': return <Flower2 className="w-5 h-5 text-green-600" id="cat-icon-florists" />;
      case 'craft-markets': return <Store className="w-5 h-5 text-orange-600" id="cat-icon-craft-markets" />;
      case 'cleaning': return <Sparkles className="w-5 h-5 text-teal-500" id="cat-icon-cleaning" />;
      case 'home-improvement': return <Home className="w-5 h-5 text-yellow-500" id="cat-icon-home-improvement" />;
      case 'laundry-laundromat': return <Wind className="w-5 h-5 text-blue-500" id="cat-icon-laundry-laundromat" />;
      case 'landscaping': return <Trees className="w-5 h-5 text-emerald-600" id="cat-icon-landscaping" />;
      case 'swimming-pools': return <Waves className="w-5 h-5 text-cyan-500" id="cat-icon-swimming-pools" />;
      case 'tree-felling': return <Trees className="w-5 h-5 text-amber-700" id="cat-icon-tree-felling" />;
      case 'movers-relocation': return <PackageOpen className="w-5 h-5 text-sky-600" id="cat-icon-movers-relocation" />;
      case 'pets-veterinary': return <HeartPulse className="w-5 h-5 text-red-500" id="cat-icon-pets-veterinary" />;
      case 'pet-grooming': return <Scissors className="w-5 h-5 text-sky-505" id="cat-icon-pet-grooming" />;
      case 'pet-boarding': return <Home className="w-5 h-5 text-orange-600" id="cat-icon-pet-boarding" />;
      case 'events': return <Calendar className="w-5 h-5 text-red-500" id="cat-icon-events" />;
      case 'equipment-rentals': return <Sparkles className="w-5 h-5 text-pink-500" id="cat-icon-equipment-rentals" />;
      case 'stage-sound': return <Volume2 className="w-5 h-5 text-emerald-500" id="cat-icon-stage-sound" />;
      case 'dance-theaters': return <Activity className="w-5 h-5 text-purple-600" id="cat-icon-dance-theaters" />;
      case 'model-casting': return <Users className="w-5 h-5 text-rose-500" id="cat-icon-model-casting" />;
      case 'agriculture-garden': return <Leaf className="w-5 h-5 text-green-600" id="cat-icon-agriculture-garden" />;
      case 'paving-decking': return <Grid className="w-5 h-5 text-neutral-500" id="cat-icon-paving-decking" />;
      case 'funeral': return <Heart className="w-5 h-5 text-neutral-500" id="cat-icon-funeral" />;
      case 'courier': return <Send className="w-5 h-5 text-blue-500" id="cat-icon-courier" />;
      case 'childcare': return <Baby className="w-5 h-5 text-pink-400" id="cat-icon-childcare" />;
      case 'fire-safety': return <ShieldAlert className="w-5 h-5 text-red-600" id="cat-icon-fire-safety" />;
      case 'office-furniture': return <Armchair className="w-5 h-5 text-blue-600" id="cat-icon-office-furniture" />;
      case 'corporate-gifting': return <Gift className="w-5 h-5 text-rose-500" id="cat-icon-corporate-gifting" />;
      case 'taxidermy': return <Compass className="w-5 h-5 text-yellow-700" id="cat-icon-taxidermy" />;
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

  const renderAds = (adsArray: BizAd[], label: string) => {
    if (!adsArray || adsArray.length === 0) return null;
    return (
      <div className="mb-8 bg-amber-50/40 border border-amber-200/50 rounded-2xl p-5 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs font-black uppercase text-amber-805 tracking-wider">
            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-ping shrink-0" />
            <span>{label}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">geotargeted match</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {adsArray.map(ad => (
            <button
              id={`sponsored-ad-card-${ad.id}`}
              key={ad.id}
              onClick={(e) => {
                e.preventDefault();
                const event = new CustomEvent('open-ad-details', { detail: ad });
                window.dispatchEvent(event);
                trackVisitActivity('click', '/explore', {
                  adClick: { id: ad.id, title: ad.title }
                });
              }}
              className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex h-28 group relative text-left w-full cursor-pointer"
            >
              <div className="w-1/3 relative bg-slate-50 shrink-0">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 pointer-events-none"
                />
                <div className="absolute bottom-1 right-1 bg-black/75 px-1 py-0.5 rounded text-[8px] font-bold uppercase text-white font-mono tracking-wider">
                  SPONSOR
                </div>
              </div>
              <div className="p-3.5 flex flex-col justify-between w-2/3 pointer-events-none">
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
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderListingCard = (l: BusinessListing, index: number) => {
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
                <div className="bg-red-950/90 text-red-200 border border-red-600/40 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-md flex items-center space-x-1.5" id={`card-unverified-badge-${l.id}`}>
                  <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-600"></span>
                  </span>
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
          <div className="flex items-center space-x-3 text-slate-400 font-mono text-[10px]">
            {l.tier === 'premium' && (
              <>
                <button onClick={(e) => { e.stopPropagation(); fetch('/api/listings/interaction', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: l.id, action: 'like' }) }).then(res => { if (res.ok) setListings(prev => prev.map(item => item.id === l.id ? { ...item, likes: (item.likes || 0) + 1 } : item)) }) }} className="flex items-center space-x-1 hover:text-emerald-500 transition-colors cursor-pointer" title="Like">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{l.likes || 0}</span>
                </button>
                <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(`${window.location.origin}/explore?q=${encodeURIComponent(l.name)}`); alert('Link copied!'); fetch('/api/listings/interaction', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: l.id, action: 'share' }) }).then(res => { if (res.ok) setListings(prev => prev.map(item => item.id === l.id ? { ...item, shares: (item.shares || 0) + 1 } : item)) }) }} className="flex items-center space-x-1 hover:text-emerald-500 transition-colors cursor-pointer" title="Share">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{l.shares || 0}</span>
                </button>
              </>
            )}
            <div className="flex items-center space-x-1" id={`card-footer-views-${l.id}`} title="Views">
              <Eye className="w-3.5 h-3.5" id={`card-footer-eye-${l.id}`} />
              <span>{l.views || 0}</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen font-sans overflow-x-hidden" id="apps-container">
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setActiveTab('explore'); setViewingPage(null); setActivePageSlug(null); }} id="logo-block">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20" id="logo-icon">
              <Search className="w-6 h-6 text-white" id="logo-search" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight whitespace-nowrap" id="logo-title">
                <span className="text-white font-black text-2xl inline-block mr-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_-1.5px_-1.5px_0_#10b981,_1.5px_-1.5px_0_#10b981,_-1.5px_1.5px_0_#10b981,_1.5px_1.5px_0_#10b981,_0px_-1.5px_0_#10b981,_0px_1.5px_0_#10b981,_-1.5px_0px_0_#10b981,_1.5px_0px_0_#10b981]">B</span>iz<span className="text-emerald-500 font-black text-2xl inline-block mx-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_-1.5px_-1.5px_0_#000,_1.5px_-1.5px_0_#000,_-1.5px_1.5px_0_#000,_1.5px_1.5px_0_#000,_0px_-1.5px_0_#000,_0px_1.5px_0_#000,_-1.5px_0px_0_#000,_1.5px_0px_0_#000]">S</span>earch24
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
              id="nav-btn-feed"
              onClick={() => { setActiveTab('feed'); setViewingPage(null); setActivePageSlug(null); }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1.5",
                activeTab === 'feed' 
                  ? "bg-emerald-50 text-emerald-700 shadow-inner border border-emerald-100" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Ad Posts Feed</span>
            </button>
            <button 
              id="nav-btn-submit"
              onClick={handleCreateAdClick}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === 'submit' 
                  ? "bg-slate-100 text-emerald-700 shadow-inner" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              Create ad
            </button>
            <button 
              id="nav-btn-services"
              onClick={() => { setActiveTab('services'); setViewingPage(null); }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeTab === 'services' 
                  ? "bg-slate-100 text-emerald-750 shadow-inner" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              BizSearch24 Services
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
                  id="mob-nav-feed"
                  onClick={() => { setActiveTab('feed'); setViewingPage(null); setMobileMenuOpen(false); }}
                  className={cn(
                    "text-left px-4 py-3 rounded-lg text-base font-medium flex items-center space-x-2",
                    activeTab === 'feed' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "text-slate-600"
                  )}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Ad Posts Feed</span>
                </button>
                <button
                  id="mob-nav-submit"
                  onClick={handleCreateAdClick}
                  className={cn(
                    "text-left px-4 py-3 rounded-lg text-base font-medium",
                    activeTab === 'submit' ? "bg-slate-100 text-emerald-700" : "text-slate-600"
                  )}
                >
                  Create ad
                </button>
                <button
                  id="mob-nav-services"
                  onClick={() => { setActiveTab('services'); setViewingPage(null); setMobileMenuOpen(false); }}
                  className={cn(
                    "text-left px-4 py-3 rounded-lg text-base font-medium",
                    activeTab === 'services' ? "bg-slate-100 text-emerald-700" : "text-slate-600"
                  )}
                >
                  BizSearch24 Services
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
                  <div className="flex flex-col space-y-2">
                    <button
                      id="mob-nav-admin-logged"
                      onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                      className="text-left px-4 py-3 rounded-lg text-base font-semibold text-emerald-700 bg-emerald-50 flex items-center justify-between"
                    >
                      <span>My Dashboard</span>
                      <Settings className="w-4 h-4 animate-spin-slow" id="mob-admin-spin" />
                    </button>
                    <button
                      id="mob-nav-logout"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="text-left px-4 py-3 rounded-lg text-base font-bold text-red-650 flex items-center space-x-2 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <LogOut className="w-5 h-5 text-red-600" id="mob-logout-icon" />
                      <span>Sign Out</span>
                    </button>
                  </div>
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
          {activeTopBanner && (
            <motion.div
              key="site-wide-banner-active"
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mb-6 bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-amber-500/10 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative overflow-hidden"
              id="site-wide-premium-banner"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div 
                onClick={() => {
                  setSelectedListing({
                    id: activeTopBanner.id,
                    name: activeTopBanner.title,
                    description: activeTopBanner.description || 'Verified Sponsor Advertisement',
                    category: 'sponsored',
                    address: activeTopBanner.city || 'National',
                    province: activeTopBanner.province || 'South Africa',
                    city: activeTopBanner.city || '',
                    suburb: activeTopBanner.suburb || '',
                    phone: '', email: '', website: activeTopBanner.targetUrl || '',
                    verified: true, image: activeTopBanner.imageUrl, tags: ['sponsored'], views: 0, slug: activeTopBanner.id, createdAt: activeTopBanner.createdAt
                  });
                }}
                className="flex items-center space-x-3.5 z-10 w-full sm:w-auto cursor-pointer group/banner"
              >
                <div className="w-14 h-10 relative bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-amber-200/50 shadow-xs group-hover/banner:scale-105 transition-transform animate-pulse-slow">
                  <img
                    src={activeTopBanner.imageUrl}
                    alt={activeTopBanner.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[8px] bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded font-black font-mono tracking-wider uppercase">
                      SPONSORED
                    </span>
                    {activeTopBanner.badge && activeTopBanner.badge !== 'standard' && (
                      <span className="text-[8px] bg-emerald-650 text-white px-1.5 py-0.5 rounded font-bold font-mono tracking-wide uppercase">
                        {activeTopBanner.badge}
                      </span>
                    )}
                    {activeTopBanner.province && (
                      <span className="text-[9px] text-slate-500 font-mono">
                        📍 {activeTopBanner.province.toUpperCase()} {activeTopBanner.city && `• ${activeTopBanner.city.toUpperCase()}`}
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug mt-1 group-hover/banner:text-emerald-700 transition-colors">
                    {activeTopBanner.title}
                  </h4>
                  {activeTopBanner.description && (
                    <p className="text-[10px] sm:text-[10.5px] text-slate-500 leading-normal line-clamp-1 mt-0.5">
                      {activeTopBanner.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end z-10">
                <button
                  type="button"
                  onClick={() => {
                    trackVisitActivity('click', 'site-side-banner', {
                      adClick: { id: activeTopBanner.id, title: activeTopBanner.title }
                    });
                    setSelectedListing({
                      id: activeTopBanner.id,
                      name: activeTopBanner.title,
                      description: activeTopBanner.description || 'Verified Sponsor Advertisement',
                      category: 'sponsored',
                      address: activeTopBanner.city || 'National',
                      province: activeTopBanner.province || 'South Africa',
                      city: activeTopBanner.city || '',
                      suburb: activeTopBanner.suburb || '',
                      phone: '', email: '', website: activeTopBanner.targetUrl || '',
                      verified: true, image: activeTopBanner.imageUrl, tags: ['sponsored'], views: 0, slug: activeTopBanner.id, createdAt: activeTopBanner.createdAt
                    });
                  }}
                  className="py-1.5 px-4 bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all shadow-xs shrink-0 flex items-center space-x-1 border-0 outline-none cursor-pointer"
                >
                  <span>Call Promotion</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </button>
                <button
                  onClick={() => setDismissedBannerId(activeTopBanner.id)}
                  className="p-1 hover:bg-slate-100 rounded-full text-slate-450 hover:text-slate-650 transition-colors shrink-0 cursor-pointer border-0 outline-none bg-transparent"
                  title="Dismiss Banner ad"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">

          {/* AD POSTS FEED VIEW */}
          {activeTab === 'feed' && (
            <motion.div
              key="feed-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-3xl mx-auto space-y-6"
              id="feed-window"
            >
              <div className="bg-white border text-center border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                 <h1 className="text-2xl font-black text-slate-900 mb-2">Daily Community Feed</h1>
                 <p className="text-sm text-slate-500 mb-6">Promote your business or share updates. Limit 1 per day.</p>
                 {userProfile ? (
                   <form onSubmit={async (e) => {
                     e.preventDefault();
                     const form = e.target as HTMLFormElement;
                     const imageFile = (form.elements.namedItem('feedImage') as HTMLInputElement).files?.[0];
                     const caption = (form.elements.namedItem('feedCaption') as HTMLTextAreaElement).value;
                     if (!imageFile || !caption) { alert('Please provide both an image and a caption.'); return; }
                     
                     // Read image
                     const reader = new FileReader();
                     reader.onload = async () => {
                       const base64Data = reader.result as string;
                       
                       // 1. Post to safety check API (we'll create this)
                       try {
                         const checkRes = await fetch('/api/safety-check', {
                           method: 'POST',
                           headers: { 'Content-Type': 'application/json' },
                           body: JSON.stringify({ image: base64Data, caption }),
                         });
                         const checkData = await checkRes.json();
                         if (!checkData.safe) {
                           alert('Post rejected: ' + (checkData.reason || 'Failed safety check. No profanity or inappropriate images allowed.'));
                           return;
                         }
                         
                         // 2. Submit actual post
                         const res = await fetch('/api/feed', {
                           method: 'POST',
                           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}`},
                           body: JSON.stringify({ userId: userProfile.id, businessName: userProfile.businessName || userProfile.email, tier: userProfile?.tier === 'PREMIUM' ? 'premium' : 'free', imageUrl: base64Data, caption })
                         });
                         const data = await res.json();
                         if (data.success) {
                           form.reset();
                           fetchFeedPosts();
                           alert('Posted to feed successfully!');
                         } else {
                           alert(data.error || 'Failed to post.');
                         }
                       } catch(err) {
                         console.error(err);
                         alert('An error occurred during submission.');
                       }
                     };
                     reader.readAsDataURL(imageFile);
                   }} className="max-w-lg mx-auto space-y-4 text-left border p-4 rounded-xl shadow-sm bg-slate-50">
                     <div>
                       <label className="block text-xs font-bold text-slate-700 mb-1">Ad Image (will be resized constraints)</label>
                       <input type="file" name="feedImage" accept="image/*" required className="w-full text-xs" />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-slate-700 mb-1">Caption / Free Text</label>
                       <textarea name="feedCaption" required rows={3} placeholder="What are you promoting today?" className="w-full text-sm p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                     </div>
                     <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md">
                       Publish Post
                     </button>
                   </form>
                 ) : (
                   <button onClick={() => { setActiveTab('submit'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md">
                     Sign in to Post
                   </button>
                 )}
              </div>

              {/* Feed posts rendering logic */}
              <div className="space-y-6">
                {feedPosts.length === 0 ? (
                  <div className="text-center p-8 bg-slate-50 border border-slate-100 rounded-2xl">
                    <p className="text-slate-500 font-medium">No posts yet. Be the first to share an update!</p>
                  </div>
                ) : (
                  feedPosts.map((post) => (
                    <div key={post.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                       <div className="p-5 flex items-center justify-between border-b border-slate-50">
                         <div className="flex items-center space-x-3">
                           <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
                             {formatDisplayName(post.businessName).charAt(0)}
                           </div>
                           <div>
                             <h3 className="font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                               {formatDisplayName(post.businessName)}
                               {post.tier === 'premium' && (
                                 <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                               )}
                               {post.isPinned && (
                                 <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                               )}
                             </h3>
                             <p className="text-[10px] text-slate-400 font-mono">
                               {new Date(post.createdAt).toLocaleDateString()}
                             </p>
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                            {post.isPinned && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-bold uppercase tracking-wider">Featured Sponsor</span>
                            )}
                            {post.tier === 'premium' ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold uppercase tracking-wider">Premium Badge</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[9px] font-medium uppercase tracking-wider">Free Tier (Unverified)</span>
                            )}
                         </div>
                       </div>
                       {post.imageUrl && (
                         <div className="w-full bg-slate-100">
                           <img src={post.imageUrl} alt="Ad content" className="w-full max-h-[500px] object-contain" />
                         </div>
                       )}
                       <div className="p-5 flex items-start justify-between gap-4">
                         <p className="text-sm text-slate-700 whitespace-pre-wrap flex-1">{post.caption}</p>
                         <div className="flex items-center space-x-1.5 shrink-0">
                           <button
                             onClick={async () => {
                               try {
                                 const res = await fetch('/api/feed', {
                                   method: 'POST',
                                   headers: { 'Content-Type': 'application/json' },
                                   body: JSON.stringify({ action: 'like', id: post.id })
                                 });
                                 const data = await res.json();
                                 if (data.success) fetchFeedPosts();
                               } catch (e) {}
                             }}
                             className="group flex items-center space-x-1 bg-slate-50 hover:bg-red-50 px-3 py-1.5 rounded-full transition-all border border-slate-100 hover:border-red-100 cursor-pointer"
                           >
                             <Heart className="w-4 h-4 text-slate-400 group-hover:text-red-500 group-hover:fill-red-500 transition-colors" />
                             <span className="text-xs font-bold text-slate-600 group-hover:text-red-600">{post.likes || 0}</span>
                           </button>

                           <button
                             onClick={async () => {
                               const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?post=${post.id}` : '';
                               if (navigator.share) {
                                 try {
                                   await navigator.share({
                                     title: 'Check out this post from ' + formatDisplayName(post.businessName),
                                     text: post.caption,
                                     url: shareUrl,
                                   });
                                 } catch (err) {
                                   if (navigator.clipboard) {
                                     await navigator.clipboard.writeText(shareUrl);
                                     setCopiedPostId(post.id);
                                     setTimeout(() => setCopiedPostId(null), 2000);
                                   }
                                 }
                               } else if (navigator.clipboard) {
                                 await navigator.clipboard.writeText(shareUrl);
                                 setCopiedPostId(post.id);
                                 setTimeout(() => setCopiedPostId(null), 2000);
                               }
                             }}
                             className="group flex items-center space-x-1.5 bg-slate-50 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-all border border-slate-100 hover:border-indigo-100 cursor-pointer"
                             title="Share this Post"
                           >
                             {copiedPostId === post.id ? (
                               <>
                                 <Check className="w-4 h-4 text-emerald-600" />
                                 <span className="text-xs font-bold text-emerald-600">Copied!</span>
                               </>
                             ) : (
                               <>
                                 <Share2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                 <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600">Share</span>
                               </>
                             )}
                           </button>
                         </div>
                       </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

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
                    Find Local Businesses <br className="hidden sm:inline" />
                    <span className="text-emerald-400">in South Africa</span>
                  </h1>
                  <p className="text-slate-300 text-sm md:text-base leading-relaxed font-normal" id="hero-para">
                    Easily search for local services, shops, and professionals near you.
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

              {/* CREATE AD BUTTON ABOVE SEARCH BAR */}
              <div className="flex justify-start sm:justify-end" id="home-create-ad-row">
                <button
                  id="btn-create-ad-search-top"
                  onClick={handleCreateAdClick}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-99 text-white font-extrabold text-sm px-6 py-3 rounded-2xl transition-all duration-155 inline-flex items-center space-x-2 shadow-lg shadow-emerald-600/10 hover:shadow-emerald-650/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-100" />
                  <span>Create ad</span>
                </button>
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

                {/* CATEGORIES DROPDOWN SELECTOR */}
                <div className="border-t border-slate-100 pt-4" id="category-dropdown-panel" ref={catDropdownRef}>
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5" id="cat-dropdown-title">
                    Business Categories
                  </label>
                  
                  <div className="relative w-full">
                    {/* Trigger Button */}
                    <button
                      id="category-dropdown-trigger"
                      type="button"
                      onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl text-sm font-medium border cursor-pointer flex items-center justify-between transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white",
                        selectedCategory 
                          ? "border-emerald-500 text-slate-805 shadow-xs" 
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0" id="selected-category-info">
                        {selectedCategory ? (
                          <>
                            <span className="inline-flex shrink-0 p-0.5 rounded-md bg-emerald-50 text-emerald-600">
                              {getCategoryIcon(selectedCategory)}
                            </span>
                            <span className="font-semibold text-slate-900 truncate">
                              {CATEGORIES.find(c => c.id === selectedCategory)?.name}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="inline-flex shrink-0 p-0.5 text-slate-400">
                              <Layers className="w-5 h-5 animate-pulse" id="category-placeholder-icon" />
                            </span>
                            <span className="truncate">All Business Sectors (Filter or Select Any)</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1.5 ml-2 shrink-0">
                        {selectedCategory && (
                          <button
                            id="category-clear-inline-btn"
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCategorySelect('');
                            }}
                            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
                            title="Clear category filter"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <ChevronDown 
                          className={cn(
                            "w-5 h-5 text-slate-400 transition-transform duration-200", 
                            categoryDropdownOpen ? "transform rotate-180" : ""
                          )} 
                          id="category-dropdown-chevron"
                        />
                      </div>
                    </button>

                    {/* Dropdown Menu Panel */}
                    <AnimatePresence>
                      {categoryDropdownOpen && (
                        <motion.div
                          id="category-dropdown-menu"
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.98 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute left-0 mt-2 w-full bg-white border border-slate-205 rounded-2xl shadow-xl z-50 overflow-hidden"
                        >
                          {/* Search Area */}
                          <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center space-x-2" id="cat-search-box-container">
                            <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" id="cat-search-glass" />
                            <input
                              id="category-inner-search-input"
                              type="text"
                              placeholder="Search categories (e.g. Health, Law, Café...)"
                              value={categorySearchQuery}
                              onChange={(e) => setCategorySearchQuery(e.target.value)}
                              className="w-full bg-transparent border-0 p-1 text-sm outline-none focus:ring-0 text-slate-805 placeholder:text-slate-400"
                              onClick={(e) => e.stopPropagation()}
                            />
                            {categorySearchQuery && (
                              <button
                                id="cat-inner-search-clear"
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCategorySearchQuery('');
                                }}
                                className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 shrink-0"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Categories Scrollable Area */}
                          <div className="max-h-72 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-slate-205" id="category-dropdown-list">
                            {/* All Categories Option */}
                            <button
                              id="cat-option-all"
                              type="button"
                              onClick={() => {
                                handleCategorySelect('');
                                setCategoryDropdownOpen(false);
                                setCategorySearchQuery('');
                              }}
                              className={cn(
                                "w-full text-left px-4 py-2.5 text-xs font-medium transition-all flex items-center justify-between hover:bg-slate-50 cursor-pointer",
                                !selectedCategory ? "bg-emerald-50 text-emerald-700" : "text-slate-700"
                              )}
                            >
                              <div className="flex items-center space-x-2.5 min-w-0">
                                <span className={cn("p-1 rounded-md shrink-0", !selectedCategory ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                                  <Layers className="w-4 h-4" />
                                </span>
                                <span className="font-semibold truncate">All Categories (Show All Industries)</span>
                              </div>
                              {!selectedCategory && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                            </button>

                            <div className="border-t border-slate-100 my-1 font-mono" />

                            {/* Render lists */}
                            {(() => {
                              const filtered = CATEGORIES.filter(cat => 
                                cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase()) ||
                                cat.id.toLowerCase().includes(categorySearchQuery.toLowerCase())
                              );

                              if (filtered.length === 0) {
                                return (
                                  <div className="p-8 text-center text-slate-400 text-xs" id="no-matching-categories-alert">
                                    No categories match &ldquo;{categorySearchQuery}&rdquo;
                                  </div>
                                );
                              }

                              return filtered.map(cat => {
                                const isSelected = selectedCategory === cat.id;
                                return (
                                  <button
                                    id={`cat-option-${cat.id}`}
                                    key={cat.id}
                                    type="button"
                                    onClick={() => {
                                      handleCategorySelect(cat.id);
                                      setCategoryDropdownOpen(false);
                                      setCategorySearchQuery('');
                                    }}
                                    className={cn(
                                      "w-full text-left px-4 py-2.5 text-xs font-medium transition-all flex items-center justify-between hover:bg-slate-50 cursor-pointer",
                                      isSelected ? "bg-emerald-50 text-emerald-750" : "text-slate-700"
                                    )}
                                  >
                                    <div className="flex items-center space-x-2.5 min-w-0">
                                      <span className={cn("inline-flex shrink-0 p-1 rounded-md", isSelected ? "bg-emerald-100" : "bg-slate-50")}>
                                        {getCategoryIcon(cat.id)}
                                      </span>
                                      <span className={cn("truncate", isSelected ? "font-bold text-emerald-900" : "")}>
                                        {cat.name}
                                      </span>
                                    </div>
                                    {isSelected && (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    )}
                                  </button>
                                );
                              });
                            })()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* LISTINGS RESULTS */}
              <div id="directory-results-container">
                <div className="flex items-center justify-between mb-4" id="results-count-bar">
                  <h2 className="text-xl font-bold tracking-tight text-slate-800" id="dir-results-title">
                    {loadingListings ? 'Scanning SA Directory...' : `Directory Findings (${totalListingsCount})`}
                  </h2>
                  <span className="text-xs text-slate-450 font-mono" id="results-local-time">Johannesburg (GMT+2)</span>
                </div>

                {renderAds(topAds, 'Premium Directory Partners')}

                {loadingListings ? (
                  <div className="py-24 text-center space-y-3" id="loading-spinner-block">
                    <RefreshCw className="w-10 h-10 animate-spin text-emerald-650 mx-auto" id="spin-main" />
                    <p className="text-slate-500 text-sm font-mono animate-pulse" id="loading-text">Synchronizing high-speed local indices...</p>
                  </div>
                ) : listings.length === 0 ? (
                  <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-16 px-4 text-center" id="empty-results-fallback">
                    <ShieldAlert className="w-12 h-12 text-slate-350 mx-auto mb-3" id="fallback-shield" />
                    <h3 className="text-lg font-bold text-slate-800" id="fallback-title">No Local Listings Found</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1 leading-relaxed" id="fallback-desc">
                      We couldn&apos;t locate active businesses matching those specific criteria. Try adjusting filters or register your own company!
                    </p>
                    <button
                      id="fallback-btn-goto-sub"
                      onClick={handleCreateAdClick}
                      className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all"
                    >
                      Submit Your Brand
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* VERIFIED LISTINGS ROW */}
                    {sortedListings.filter(l => l.verified).length > 0 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="listings-grid-verified">
                          {sortedListings.filter(l => l.verified).map((l, index) => renderListingCard(l, index))}
                        </div>
                      </div>
                    )}

                    {renderAds(middleAds, 'Featured Directory Specials')}

                    {/* UNVERIFIED LISTINGS ROW */}
                    {sortedListings.filter(l => !l.verified).length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                          <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded">Free Listings</span>
                          <span className="text-slate-400 text-[11px]">Unverified local listings awaiting processing</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 opacity-85" id="listings-grid-unverified">
                          {sortedListings.filter(l => !l.verified).map((l, index) => renderListingCard(l, index))}
                        </div>
                      </div>
                    )}

                    {renderAds(bottomAds, 'Promoted Local Services')}
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

              {submissionError && !submissionError.toLowerCase().includes('logged in') && (
                <div className="bg-red-50 border border-red-200 text-red-808 p-4 rounded-xl text-sm flex items-start space-x-2" id="sub-error-banner">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" id="sub-err-icon" />
                  <p className="font-medium text-xs sm:text-sm">{submissionError}</p>
                </div>
              )}

              <form onSubmit={handlePublicFormSubmitGate} className="space-y-4" id="pub-submission-form">
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
                    <label id="lbl-sub-email" className="text-xs font-bold text-slate-703 flex items-center justify-between">
                      <span>Enquiry Email</span>
                      {subTier !== 'premium' && <span className="text-[9px] text-slate-400 flex items-center"><Lock className="w-2.5 h-2.5 mr-0.5" /> Premium Only</span>}
                    </label>
                    <input
                      id="input-sub-email"
                      type="email"
                      disabled={subTier !== 'premium'}
                      placeholder={subTier === 'premium' ? "e.g. client@sealingco.co.za" : "🔒 Premium Only"}
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1" id="sub-website-f">
                    <label id="lbl-sub-website" className="text-xs font-bold text-slate-704 flex items-center justify-between">
                      <span>Web Link (HTTPS)</span>
                      {subTier !== 'premium' && <span className="text-[9px] text-slate-400 flex items-center"><Lock className="w-2.5 h-2.5 mr-0.5" /> Premium Only</span>}
                    </label>
                    <input
                      id="input-sub-website"
                      type="url"
                      disabled={subTier !== 'premium'}
                      placeholder={subTier === 'premium' ? "e.g. https://www.sealingco.co.za" : "🔒 Premium Only"}
                      value={subWebsite}
                      onChange={(e) => setSubWebsite(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-1" id="sub-services-f">
                  <label id="lbl-sub-services" className="text-xs font-bold text-slate-705 flex items-center justify-between">
                    <span>Services Offered (comma separated)</span>
                    {subTier !== 'premium' && <span className="text-[9px] text-slate-400 flex items-center"><Lock className="w-2.5 h-2.5 mr-0.5" /> Premium Only</span>}
                  </label>
                  <input
                    id="input-sub-services"
                    type="text"
                    disabled={subTier !== 'premium'}
                    placeholder={subTier === 'premium' ? "e.g. Plumbing, Electrical, Handyman" : "🔒 Premium Only"}
                    value={subServices}
                    onChange={(e) => setSubServices(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Social media connections - Premium check */}
                <div className={cn(
                  "p-4 border rounded-xl space-y-4 transition-all duration-200",
                  subTier === 'premium' ? "bg-emerald-50/15 border-emerald-100" : "bg-slate-50/80 border-slate-100 opacity-80"
                )} id="pub-social-presence-card">
                  <div className="flex items-center justify-between" id="pub-social-header">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 flex items-center">
                        <Sparkles className="w-4 h-4 mr-1 text-amber-500 animate-pulse" />
                        Premium Ad Social Channels
                      </span>
                      <p className="text-[10px] text-slate-500">Connect with users on TikTok, WhatsApp, FB, Instagram and YouTube directly.</p>
                    </div>
                    {subTier !== 'premium' && (
                      <span className="text-[9px] bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded-full font-bold flex items-center border border-amber-500/20">
                        <Lock className="w-2.5 h-2.5 mr-1" /> Premium Only
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5" id="pub-social-form-grid">
                    {/* WhatsApp */}
                    <div className="space-y-1" id="sub-whatsapp-f">
                      <label className="text-[11px] font-bold text-slate-650">WhatsApp Trading Number</label>
                      <input
                        type="text"
                        disabled={subTier !== 'premium'}
                        placeholder={subTier === 'premium' ? "e.g. +27821234567" : "🔒 Premium Verified Only"}
                        value={subWhatsapp}
                        onChange={(e) => setSubWhatsapp(e.target.value)}
                        className="w-full bg-white border border-slate-200 disabled:bg-slate-100 disabled:text-slate-405 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>

                    {/* Facebook */}
                    <div className="space-y-1" id="sub-facebook-f">
                      <label className="text-[11px] font-bold text-slate-650">Facebook Page Link</label>
                      <input
                        type="url"
                        disabled={subTier !== 'premium'}
                        placeholder={subTier === 'premium' ? "e.g. https://facebook.com/mybiz" : "🔒 Premium Verified Only"}
                        value={subFacebook}
                        onChange={(e) => setSubFacebook(e.target.value)}
                        className="w-full bg-white border border-slate-200 disabled:bg-slate-100 disabled:text-slate-405 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>

                    {/* Instagram */}
                    <div className="space-y-1" id="sub-instagram-f">
                      <label className="text-[11px] font-bold text-slate-650">Instagram Profile Link</label>
                      <input
                        type="url"
                        disabled={subTier !== 'premium'}
                        placeholder={subTier === 'premium' ? "e.g. https://instagram.com/mybiz" : "🔒 Premium Verified Only"}
                        value={subInstagram}
                        onChange={(e) => setSubInstagram(e.target.value)}
                        className="w-full bg-white border border-slate-200 disabled:bg-slate-100 disabled:text-slate-405 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>

                    {/* TikTok */}
                    <div className="space-y-1" id="sub-tiktok-f">
                      <label className="text-[11px] font-bold text-slate-650">TikTok Profile Link</label>
                      <input
                        type="url"
                        disabled={subTier !== 'premium'}
                        placeholder={subTier === 'premium' ? "e.g. https://tiktok.com/@mybiz" : "🔒 Premium Verified Only"}
                        value={subTiktok}
                        onChange={(e) => setSubTiktok(e.target.value)}
                        className="w-full bg-white border border-slate-200 disabled:bg-slate-100 disabled:text-slate-405 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                      />
                    </div>

                    {/* YouTube */}
                    <div className="space-y-1 sm:col-span-2" id="sub-youtube-f">
                      <label className="text-[11px] font-bold text-slate-650">YouTube Channel Link</label>
                      <input
                        type="url"
                        disabled={subTier !== 'premium'}
                        placeholder={subTier === 'premium' ? "e.g. https://youtube.com/@mybiz" : "🔒 Premium Verified Only"}
                        value={subYoutube}
                        onChange={(e) => setSubYoutube(e.target.value)}
                        className="w-full bg-white border border-slate-200 disabled:bg-slate-100 disabled:text-slate-405 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Subscription Tier & Conditional Image Upload Component */}
                <div className="space-y-3 p-4 bg-slate-50 border border-slate-100 rounded-xl" id="pub-subscription-and-image-section">
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs font-bold text-slate-800 flex items-center">
                      <Coins className="w-4 h-4 mr-1 text-emerald-600" />
                      Listing Subscription Level
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Choose if this is a standard free entry or a Verified Premium Business spotlight entry.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="pub-tier-grid shadow-sm">
                    {/* Free Card */}
                    <div
                      id="tier-card-free"
                      onClick={() => {
                        setSubTier('free');
                        setSubImage('');
                      }}
                      className={`cursor-pointer border rounded-lg p-3 flex flex-col justify-between transition-all ${
                        subTier === 'free'
                          ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white hover:bg-slate-100/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-700">Standard Entry</p>
                          <p className="text-[10px] text-slate-500">Unverified Directory index</p>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">Free</span>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-2">❌ Customized media & logos locked</p>
                    </div>

                    {/* Premium Card */}
                    <div
                      id="tier-card-premium"
                      onClick={() => {
                        if (userRole !== 'ADMIN' && userProfile?.selectedTier?.toLowerCase() !== 'premium') {
                          alert('Upgrade to Premium to get access directly in your dashboard "Profile & Settings"!');
                          return;
                        }
                        setSubTier('premium');
                      }}
                      className={`cursor-pointer border rounded-lg p-3 flex flex-col justify-between transition-all ${
                        subTier === 'premium'
                          ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                          : 'border-slate-200 bg-white hover:bg-slate-100/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs font-bold text-slate-800">Premium Spotlight</span>
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          </div>
                          <p className="text-[10px] text-emerald-600 font-medium">Instant Verified Badge</p>
                        </div>
                        <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-mono font-bold">R199/pm</span>
                      </div>
                      <p className="text-[9px] text-emerald-700/80 mt-2 font-medium">✨ Upload custom images & branding active</p>
                    </div>
                  </div>

                  {/* Image input conditional view */}
                  <div className="mt-3 pt-3 border-t border-slate-200/50" id="pub-image-upload-wrapper">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between mb-1">
                      <span>Listing Icon / Showcase Image</span>
                      <span className="text-[9px] font-medium text-slate-404 flex items-center">
                        <Lock className="w-2.5 h-2.5 mr-0.5" /> Paying Clients Only
                      </span>
                    </label>

                    {subTier === 'premium' ? (
                      <div className="space-y-3" id="premium-uploader-active">
                        <div
                          id="dropzone-sub-image"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files?.[0];
                            if (file && file.type.startsWith('image/')) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setSubImage(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          onClick={() => {
                            document.getElementById('file-input-pub-sub')?.click();
                          }}
                          className="border-2 border-dashed border-slate-300 hover:border-emerald-400 bg-white rounded-lg p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1 relative"
                        >
                          {subImage ? (
                            <div className="w-full flex flex-col items-center space-y-2">
                              <img src={subImage} alt="Preview Logo" className="h-24 w-auto rounded-md shadow object-contain" />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSubImage('');
                                }}
                                className="text-[10px] text-red-650 underline font-mono cursor-pointer"
                              >
                                Revoke Image
                              </button>
                            </div>
                          ) : (
                            <>
                              <Plus className="w-6 h-6 text-slate-400 animate-pulse" />
                              <p className="text-[10.5px] font-medium text-slate-600">Drag & Drop Logo Image here</p>
                              <span className="text-[9px] text-slate-404">or click below to seek filesystem</span>
                            </>
                          )}
                        </div>

                        <div className="flex flex-col space-y-1">
                          <input
                            id="file-input-pub-sub"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (typeof reader.result === 'string') {
                                    setSubImage(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                          />
                          <span className="text-[9px] text-slate-400">Or copy-paste an absolute HTTPS URL containing the business artwork/photo:</span>
                          <input
                            id="url-input-pub-sub"
                            type="text"
                            placeholder="e.g., https://mysite.com/images/logo.png"
                            value={subImage.startsWith('data:') ? '' : subImage}
                            onChange={(e) => setSubImage(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-[11px] outline-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 bg-slate-100 border border-slate-200 rounded-lg text-center flex flex-col items-center justify-center space-y-1" id="free-uploader-locked">
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span className="text-[10.5px] font-semibold text-slate-500">Image & Logo upload is locked</span>
                        <p className="text-[9px] text-slate-400 max-w-sm">
                          Only premium paying clients can add logos or showcase custom listings images! Choose the Premium card above to unlock branding and verified status inside the directory indices.
                        </p>
                      </div>
                    )}
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

                {(!isAdminLoggedIn || (submissionError && submissionError.toLowerCase().includes('logged in'))) && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3 animate-fade-in" id="login-gate-warning-box">
                    <div className="flex items-start space-x-2">
                      <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5 animate-bounce" id="sub-gate-err-icon" />
                      <div className="space-y-1">
                        <p className="font-bold text-slate-805 text-[11px] uppercase tracking-wider">Account Authentication Required</p>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          You must be logged in to your BizSearch24 account to publish or create listing ads.
                        </p>
                      </div>
                    </div>
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsRegistering(true);
                          setActiveTab('admin');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 active:scale-98 text-slate-950 font-bold rounded-lg text-xs transition-all shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <span>👉 Click here to Sign Up / Register Account to Publish Ad</span>
                      </button>
                    </div>
                  </div>
                )}
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

          {/* BIZSEARCH24 SERVICES VIEW */}
          {activeTab === 'services' && (
            <motion.div
              key="services-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto space-y-6"
              id="bizsearch24-services-view"
            >
              {/* HEADING ACCENT */}
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden" id="services-hero-banner">
                <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none scale-150 rotate-12">
                  <Sparkles className="w-96 h-96" />
                </div>
                <div className="max-w-2xl space-y-3">
                  <div className="inline-flex items-center space-x-1 bg-emerald-500/20 text-emerald-350 px-3 py-1 rounded-full text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Exclusive Business Solutions</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                    Premium Cloud <span className="text-emerald-400">& Web Services</span>
                  </h1>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                    Get fully customized static websites, high-performance static page hosting, professional custom email addresses (yourname@yourbrand.co.za), co.za domain registration and premium co-verified status on South Africa&apos;s directory engine.
                  </p>
                </div>
              </div>

              {/* FOUR CORE OFFERINGS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="services-cards-grid">
                {/* HOSTING CARD */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-sm">Unlimited Hosting</h3>
                      <p className="text-slate-450 text-[10px] uppercase font-mono tracking-wider">Static Websites</p>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Enterprise-grade global CDN delivery for your company&apos;s web assets. Ultra-fast page loads, automatic TLS/SSL keys, and zero configuration or throttling.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100/60 mt-4">
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">⚡ Zero Limits</span>
                  </div>
                </div>

                {/* EMAILS CARD */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-sm">Unlimited Emails</h3>
                      <p className="text-slate-450 text-[10px] uppercase font-mono tracking-wider">Professional Domains</p>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Establish true brand credibility. Setup mailboxes for sales, info, and individual employees at your custom co.za domain with active webmail, POP3, and IMAP.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100/60 mt-4">
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">✉ Professional Brand</span>
                  </div>
                </div>

                {/* BUILDING CARD */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-sm">Website Building</h3>
                      <p className="text-slate-450 text-[10px] uppercase font-mono tracking-wider">Optional Custom Code</p>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Need custom templates or standard landing layouts? Our experts will custom-design your initial landing page for maximum conversion rate and mobile compliance.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100/60 mt-4">
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">✨ Premium Assistance</span>
                  </div>
                </div>

                {/* DOMAIN CARD */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                      <Search className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900 text-sm">.co.za Domain</h3>
                      <p className="text-slate-450 text-[10px] uppercase font-mono tracking-wider">Registry Administration</p>
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      Secure your own professional .co.za domain name to power your landing website and dedicated mailbox addresses legally. No setup markups or hidden fees.
                    </p>
                  </div>
                  <div className="pt-4 border-t border-slate-100/60 mt-4">
                    <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">🌐 R99 / Year</span>
                  </div>
                </div>
              </div>

              {/* PRICING & CALL-TO-ACTION BILLING PREVIEW */}
              <div className="bg-emerald-50/40 border border-emerald-150 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6" id="services-pricing-cta">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-emerald-600/10 text-emerald-800 font-extrabold px-2.5 py-1 rounded-md text-emerald-700">ALL-INCLUSIVE ADVANTAGE BUNDLE</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-905">Total Digital Suite Package</h3>
                  <p className="text-slate-600 text-xs max-w-lg leading-relaxed">
                    This all-inclusive bundle costs only <strong>R199 per month</strong> (month-to-month, cancel anytime) and <strong>INCLUDES</strong> a Premium BizSearch24 Directory account, website building, hosting, and unlimited email mailboxes.
                  </p>
                  <p className="text-slate-650 text-xs max-w-lg leading-relaxed mt-1">
                    <strong>Professional Domain Addon:</strong> Secure your custom <strong>.co.za domain name for just R99 once-per-year</strong>! Please note the domain is a separate addon (not inclusive in the monthly rate). If you select the domain addon, the total setup cost is <strong>R298 once-off</strong> for the first month, then <strong>R199 per month</strong> month-to-month and <strong>R99 per year</strong> for domain renewal.
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    💬 Got questions? Talk directly to our technical desk via WhatsApp: <strong>075 161 3007</strong>
                  </p>
                </div>
                
                <div className="bg-white border border-emerald-250 p-5 rounded-2xl shadow-inner text-center shrink-0 w-full md:w-80" id="pricing-tag-box">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">Exclusive Pricing</p>
                  <div className="my-2 space-y-1.5">
                    <p className="text-2xl font-black text-emerald-700">R199 <span className="text-xs text-slate-500 font-normal">/ month</span></p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">— PLUS OPTIONAL ADDON —</p>
                    <p className="text-sm font-extrabold text-teal-700">R99 <span className="text-xs text-slate-505 font-mono">/ year domain</span></p>
                    <div className="pt-2 border-t border-slate-100 mt-2 text-[10.5px] text-slate-700 font-medium" id="total-price-breakdown-custom">
                      <p className="font-bold text-slate-900">First Month with Domain: <span className="text-emerald-700 font-black">R298 once</span></p>
                      <p className="text-[9.5px] text-slate-500 font-normal leading-tight mt-0.5">Thereafter: R199/month + R99/year for domain renewal</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-450 mt-1">No Contract, Cancel Anytime</p>
                  
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        const whatsappMsg = `Hi BizSearch24 Support,\n\nI want to subscribe to your Premium Digital Suite (R199/pm) and get a .co.za domain name (R99/year).\n\nPlease contact me to finalize options!\n\nEmail: ${adminUsername || ""}`;
                        window.open(`https://wa.me/27751613007?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
                      }}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-sm flex items-center justify-center space-x-1 outline-none border-0 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Order via WhatsApp</span>
                    </button>

                    <button
                      onClick={() => {
                        const subject = encodeURIComponent("BizSearch24 Services Subscription Request");
                        const bodyText = encodeURIComponent(
                          "Hi BizSearch24 Team,\n\n" +
                          "I am interested in subscribing to your BizSearch24 Web Services Package (R199/pm) + .co.za domain name (R99/year once-per-year).\n\n" +
                          "Please provide details on configuring my:\n" +
                          "1. Custom .co.za domain (or link existing)\n" +
                          "2. Unlimited static website hosting\n" +
                          "3. Professional domain email accounts\n" +
                          "4. Optional custom website building services\n\n" +
                          "Please also upgrade my BizSearch24 account to Premium Verified Status.\n\n" +
                          "My Registered Account Email (if any): " + (adminUsername || "[Email]") + "\n" +
                          "Business Trading Name: \n" +
                          "Contact Number: \n\n" +
                          "Thank you!"
                        );
                        window.open(`mailto:mailbizsearch24@gmail.com?subject=${subject}&body=${bodyText}`, '_self');
                      }}
                      className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-950 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center space-x-1 outline-none border-0 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Order via Email</span>
                    </button>
                  </div>
                </div>
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
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-900" id="login-prompt-title">
                      {isForgotPasswordOpen ? 'Reset Password' : (isRegistering ? 'Create Your Account' : 'Log In to Bizsearch24')}
                    </h1>
                    <p className="text-slate-500 text-xs leading-relaxed" id="login-prompt-desc">
                      {isForgotPasswordOpen 
                        ? 'Request a secure new temporary password for your account instantly.'
                        : (isRegistering ? 'Sign up to submit business listings, manage your profile, and receive analytics.' : 'Access your dashboard, manage your listings, and view your traffic analytics.')}
                    </p>
                  </div>
                  
                  {isForgotPasswordOpen ? (
                    /* Inline Password Reset Dashboard */
                    <div className="space-y-4" id="forgot-password-panel">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Email Address or Username</label>
                        <input
                          type="text"
                          required
                          placeholder="nicholauscostochetty@gmail.com or username"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                        />
                        <span className="text-[10px] text-slate-450 leading-relaxed block mt-1">
                          After submitting, your active password will be replaced by a newly generated temporary password delivered to your registered email inbox.
                        </span>
                      </div>

                      {forgotPasswordMsg && (
                        <div className={cn(
                          "p-3 rounded-lg text-xs leading-normal font-semibold",
                          forgotPasswordMsg.toLowerCase().includes('error') || forgotPasswordMsg.toLowerCase().includes('fail')
                            ? "bg-red-50 text-red-800 border border-red-200"
                            : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        )} id="reset-msg-display-box">
                          {forgotPasswordMsg}
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          disabled={forgotPasswordLoading}
                          onClick={async () => {
                            if (!forgotPasswordEmail.trim()) {
                              setForgotPasswordMsg('Please enter your email address or username first.');
                              return;
                            }
                            setForgotPasswordLoading(true);
                            setForgotPasswordMsg('');
                            try {
                              const res = await fetch('/api/auth/forgot-password', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ identifier: forgotPasswordEmail })
                              });
                              const data = await res.json();
                              setForgotPasswordMsg(data.message || 'Check your email provider/project local sandbox log for instructions.');
                            } catch (e) {
                              setForgotPasswordMsg('Error communicating with authentication server.');
                            } finally {
                              setForgotPasswordLoading(false);
                            }
                          }}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 text-center"
                        >
                          {forgotPasswordLoading ? 'Generating Temporary Password...' : 'Send Temporary Password'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPasswordOpen(false);
                            setForgotPasswordMsg('');
                          }}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {authError && !show2FA && (
                        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-start space-x-2" id="login-error-card">
                          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" id="login-error-card-ico" />
                          <p className="font-semibold text-[11px] leading-normal">{authError}</p>
                        </div>
                      )}

                      <form onSubmit={show2FA ? handle2FASubmit : handleAdminLogin} className="space-y-4" id="login-auth-form">
                        {show2FA ? (
                          <div className="space-y-4">
                            {requires2FASetup && qrCodeData && (
                              <div className="flex flex-col items-center text-center">
                                <p className="text-xs text-slate-500 mb-2 font-bold text-slate-800">Keep your account safe from hackers!</p>
                                <p className="text-xs text-slate-500 mb-2">Scan this QR code with Google Authenticator:</p>
                                <img src={qrCodeData} alt="2FA QR Code" className="mb-2 border p-2 rounded-lg shadow-sm" />
                                <p className="text-[10px] font-mono text-slate-400 bg-slate-50 p-2 rounded-md mb-2">Secret: {setupSecret}</p>
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
                              <label id="lbl-login-user" className="text-xs font-bold text-slate-700">
                                {isRegistering ? 'Email Address' : 'Email Address or Username'}
                              </label>
                              <input
                                id="input-login-username"
                                type={isRegistering ? 'email' : 'text'}
                                required
                                placeholder={isRegistering ? 'your@email.com' : 'your@email.com or username'}
                                value={adminUsername}
                                onChange={(e) => setAdminUsername(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                              />
                            </div>

                            {isRegistering && (
                              <div className="space-y-1" id="login-username-custom-f">
                                <label className="text-xs font-bold text-slate-700 flex justify-between">
                                  <span>Choose Username (Optional)</span>
                                  <span className="text-[10px] text-slate-400">Default is email username</span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. sweet_bakery_24"
                                  value={regUsername}
                                  onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-xs focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                />
                              </div>
                            )}

                            <div className="space-y-1" id="login-pass-f">
                              <label id="lbl-login-pass" className="text-xs font-bold text-slate-700 flex justify-between items-center w-full">
                                <span>Password</span>
                                {!isRegistering && (
                                  <button 
                                    type="button" 
                                    onClick={() => {
                                      setIsForgotPasswordOpen(true);
                                      setForgotPasswordMsg('');
                                      setForgotPasswordEmail(adminUsername); // Auto-populate with whatever was typed
                                    }}
                                    className="text-[10px] text-emerald-650 hover:text-emerald-700 hover:underline font-bold border-0 bg-transparent cursor-pointer"
                                  >
                                    Forgot Password?
                                  </button>
                                )}
                              </label>
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

                            {isRegistering && (
                              <div className="space-y-3 pt-2" id="registration-tier-selection">
                                <label className="text-xs font-bold text-slate-800 block">Choose Your Membership Tier</label>
                                <div className="grid grid-cols-2 gap-2.5">
                                  <button
                                    type="button"
                                    onClick={() => setRegTier('FREE')}
                                    className={cn(
                                      "p-3 rounded-lg border text-left flex flex-col justify-between transition-all",
                                      regTier === 'FREE' ? "border-emerald-500 bg-emerald-50/50 ring-1 ring-emerald-500" : "border-slate-200 hover:bg-slate-50"
                                    )}
                                  >
                                    <div>
                                      <span className="block text-xs font-bold text-slate-700">Free Tier</span>
                                      <span className="text-[10px] text-slate-500 block leading-tight mt-1">Standard directory listing and search index entry</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 mt-2">FREE</span>
                                  </button>
                                  
                                  <button
                                    type="button"
                                    onClick={() => setRegTier('PREMIUM')}
                                    className={cn(
                                      "p-3 rounded-lg border text-left flex flex-col justify-between transition-all",
                                      regTier === 'PREMIUM' ? "border-emerald-500 bg-emerald-50/55 ring-1 ring-emerald-500" : "border-slate-200 hover:bg-slate-50"
                                    )}
                                  >
                                    <div>
                                      <span className="block text-xs font-bold text-slate-755 flex items-center gap-1">
                                        Premium Verified <Sparkles className="w-3 h-3 text-emerald-500 inline shrink-0" />
                                      </span>
                                      <span className="text-[10px] text-slate-500 block leading-tight mt-1">Get verified badge and unlock top rankings & images</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-600 mt-2">R199 / month</span>
                                  </button>
                                </div>

                                {regTier === 'PREMIUM' && (
                                  <div className="bg-emerald-50/30 border border-emerald-100 rounded-xl p-3.5 space-y-3 mt-2 text-xs text-slate-705" id="premium-documents-notice">
                                    <p className="font-semibold text-emerald-800 text-[11px] flex items-center shrink-0">
                                      📂 Premium Verification Document Submission Form
                                    </p>
                                    <p className="text-[10.5px] leading-relaxed text-slate-600">
                                      To unlock premium verified features, you must submit documents verifying your legal status. <strong>Admin approval is required.</strong> No user gets automatic premium.
                                    </p>
                                    <div className="space-y-1.5 text-[10px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-105 shadow-2xs font-mono">
                                      <p className="font-bold text-slate-700">Required Documents:</p>
                                      <p>✓ Identity Document (ID/Passport)</p>
                                      <p>✓ CIPC Business Registration Document</p>
                                      <p>✓ SARS Tax Clearance Document</p>
                                      <p>✓ Business Bank Account Proof</p>
                                      <span className="text-slate-400">✓ Optional signage, office, showroom pics</span>
                                    </div>
                                    
                                    <div className="flex items-start space-x-2 pt-1">
                                      <input 
                                        type="checkbox" 
                                        id="agree-premium-debt" 
                                        required 
                                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5 cursor-pointer shadow-none" 
                                      />
                                      <label htmlFor="agree-premium-debt" className="text-[10px] leading-normal text-slate-655 cursor-pointer font-medium selection:bg-transparent">
                                        I agree to the R199 per month debit agreement. This is a secure month-to-month, no contract arrangement.
                                      </label>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const subject = encodeURIComponent("BizSearch24 Premium Verification Request - " + (adminUsername || "[Email]"));
                                        const bodyText = encodeURIComponent(
                                          "Hi BizSearch24 Support,\n\n" +
                                          "I am registering for the Premium Verified Tier (R199/pm, month-to-month, no contracts).\n\n" +
                                          "Please find attached my legal verification documents:\n" +
                                          "1. Identity Document\n" +
                                          "2. CIPC Business Registration Document\n" +
                                          "3. SARS Document\n" +
                                          "4. Business Bank Account Proof\n" +
                                          "5. [Optional] Business signage or vehicle photos\n\n" +
                                          "My Registered Account Email: " + (adminUsername || "") + "\n" +
                                          "Business Trading Name: \n" +
                                          "Contact Phone: \n\n" +
                                          "I hereby agree to the R199 per month debit (month-to-month, cancel anytime).\n" +
                                          "I understand my account will remain as a free-tier user until the administrators verify these files and switch on my Premium Verified Status in the dashboard.\n\n" +
                                          "Thank you!"
                                        );
                                        window.open(`mailto:mailbizsearch24@gmail.com?subject=${subject}&body=${bodyText}`, '_self');
                                      }}
                                      className="w-full py-2 bg-slate-900 hover:bg-slate-955 text-white font-bold text-[10.5px] rounded-lg transition-all text-center block border-0 cursor-pointer"
                                    >
                                      📧 Open Default Email Client to Submit Documents
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
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
                          <div className="space-y-4">
                            {authError && (
                              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-start space-x-2">
                                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                <p className="font-semibold text-[11px] leading-normal">{authError}</p>
                              </div>
                            )}
                            
                            {requires2FASetup && (
                              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-[11px] text-slate-600 space-y-2.5">
                                <p className="font-bold flex items-center gap-1.5 text-slate-700"><ShieldAlert className="w-3.5 h-3.5 text-blue-500" /> Need help setting up?</p>
                                <ul className="list-decimal pl-4 space-y-1.5 text-slate-600 font-medium">
                                  <li>Download Google Authenticator from your app store.</li>
                                  <li>Open the app and tap the <strong>+ (plus) icon</strong>.</li>
                                  <li>Select <strong>Enter a setup key</strong> (or scan the QR code above).</li>
                                  <li>Paste the <strong>Secret Key</strong> shown above and save it.</li>
                                  <li>Enter the 6-digit code it generates above and click <strong>Verify 2FA</strong>.</li>
                                </ul>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setShow2FA(false);
                                setRequires2FASetup(false);
                                setMfaToken('');
                              }}
                              className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 font-semibold hover:underline text-center block cursor-pointer"
                            >
                              Cancel Verification
                            </button>
                          </div>
                        )}
                      </form>
                      
                      {!show2FA && (
                        <div className="mt-4 text-center">
                          <button type="button" onClick={() => setIsRegistering(!isRegistering)} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                            {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register Now'}
                          </button>
                        </div>
                      )}
                    </>
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
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4" id="admin-stats-grid">
                        <div className="bg-white border p-3 sm:p-5 rounded-xl text-center" id="stat-card-total">
                          <span className="block text-slate-400 text-[9px] sm:text-[10px] font-mono tracking-wider uppercase mb-1">Total Submissions</span>
                          <span className="text-xl sm:text-2xl font-black text-slate-800" id="stat-total-val">{adminListings.length}</span>
                        </div>
                        <div className="bg-white border p-3 sm:p-5 rounded-xl text-center" id="stat-card-pending">
                          <span className="block text-amber-650 text-[9px] sm:text-[10px] font-mono tracking-wider uppercase mb-1">Pending Approval</span>
                          <span className="text-xl sm:text-2xl font-black text-amber-500" id="stat-pending-val">{adminListings.filter(l => !l.verified).length}</span>
                        </div>
                        <div className="bg-white border p-3 sm:p-5 rounded-xl text-center" id="stat-card-active-pages">
                          <span className="block text-emerald-850 text-[9px] sm:text-[10px] font-mono tracking-wider uppercase mb-1">Dynamic SEO Pages</span>
                          <span className="text-xl sm:text-2xl font-black text-emerald-600" id="stat-pages-val">{seoPages.length}</span>
                        </div>
                        <div className="bg-white border p-3 sm:p-5 rounded-xl text-center" id="stat-card-traffic">
                          <span className="block text-slate-400 text-[9px] sm:text-[10px] font-mono tracking-wider uppercase mb-1">Aggregate Views</span>
                          <span className="text-xl sm:text-2xl font-black text-slate-800" id="stat-views-val">{adminListings.reduce((sum, item) => sum + (item.views || 0), 0)}</span>
                        </div>
                      </div>

                      {/* SUPREME ADMINISTRATIVE POWERS & BULK CONTROLS */}
                      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 border border-emerald-500/30 shadow-lg space-y-4" id="admin-bulk-powers-panel">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3" id="admin-powers-header">
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3.5" id="admin-powers-grid">
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
                  <div className="flex flex-wrap border-b border-slate-200 mb-6 sm:mx-0 sm:px-0" id="admin-tabs-nav">
                    <button
                      type="button"
                      id="admin-subtab-listings"
                      onClick={() => setAdminActiveSubTab('listings')}
                      className={cn(
                        "px-4 py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2 cursor-pointer",
                        adminActiveSubTab === 'listings' 
                          ? "border-emerald-600 text-emerald-700 font-extrabold" 
                          : "border-transparent text-slate-400 hover:text-slate-650"
                      )}
                    >
                      {userRole === 'ADMIN' ? 'Listings & Slugs' : 'My Listings'}
                    </button>
                    {userRole === 'ADMIN' && (
                      <>
                        <button
                          type="button"
                          id="admin-subtab-ads"
                          onClick={() => {
                            setAdminActiveSubTab('ads');
                            fetchAdminAds();
                          }}
                          className={cn(
                            "px-4 py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2 cursor-pointer",
                            adminActiveSubTab === 'ads' 
                              ? "border-emerald-600 text-emerald-700 font-extrabold" 
                              : "border-transparent text-slate-400 hover:text-slate-650"
                          )}
                        >
                          Ads Manager
                        </button>
                        <button
                          type="button"
                          id="admin-subtab-feed"
                          onClick={() => {
                            setAdminActiveSubTab('feed');
                            fetchFeedPosts();
                          }}
                          className={cn(
                            "px-4 py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2 cursor-pointer",
                            adminActiveSubTab === 'feed' 
                              ? "border-emerald-600 text-emerald-700 font-extrabold" 
                              : "border-transparent text-slate-400 hover:text-slate-650"
                          )}
                        >
                          Ad Feed
                        </button>
                        <button
                          type="button"
                          id="admin-subtab-moderation"
                          onClick={() => {
                            setAdminActiveSubTab('moderation');
                            fetchModerationLogs();
                          }}
                          className={cn(
                            "px-4 py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2 cursor-pointer",
                            adminActiveSubTab === 'moderation' 
                              ? "border-emerald-600 text-emerald-700 font-extrabold" 
                              : "border-transparent text-slate-400 hover:text-slate-650"
                          )}
                        >
                          Bad Actors
                        </button>
                        <button
                          type="button"
                          id="admin-subtab-analytics"
                          onClick={() => {
                            setAdminActiveSubTab('analytics');
                            fetchAnalyticsLogs();
                          }}
                          className={cn(
                            "px-4 py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2 cursor-pointer",
                            adminActiveSubTab === 'analytics' 
                              ? "border-emerald-600 text-emerald-700 font-extrabold" 
                              : "border-transparent text-slate-400 hover:text-slate-650"
                          )}
                        >
                          Traffic Stats
                        </button>
                        <button
                          type="button"
                          id="admin-subtab-users"
                          onClick={() => {
                            setAdminActiveSubTab('users');
                            fetchAdminUsers();
                          }}
                          className={cn(
                            "px-4 py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2 cursor-pointer",
                            adminActiveSubTab === 'users' 
                              ? "border-emerald-600 text-emerald-700 font-extrabold" 
                              : "border-transparent text-slate-400 hover:text-slate-650"
                          )}
                        >
                          Users Manager
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      id="admin-subtab-profile"
                      onClick={() => setAdminActiveSubTab('profile')}
                      className={cn(
                        "px-4 py-2.5 text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all duration-200 border-b-2 cursor-pointer",
                        adminActiveSubTab === 'profile' 
                          ? "border-emerald-600 text-emerald-700 font-extrabold" 
                          : "border-transparent text-slate-400 hover:text-slate-650"
                      )}
                    >
                      Profile & Settings
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

                    <div className="border rounded-2xl bg-white shadow-sm overflow-hidden" id="slugs-table-container">
                      <div className="hidden sm:block overflow-x-auto">
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
                                  <td className="p-3 text-right space-x-3 font-semibold">
                                    <button
                                      id={`slug-btn-edit-${m.id}`}
                                      onClick={() => startEditSlugMapping(m)}
                                      className="text-slate-600 hover:text-slate-900 cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      id={`slug-btn-dele-${m.id}`}
                                      onClick={() => handleDeleteSlugMapping(m.id)}
                                      className="text-red-650 hover:text-red-800 font-bold cursor-pointer"
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

                      {/* Mobile Card Layout for Slugs */}
                      <div className="sm:hidden divide-y divide-slate-150">
                        {slugMappings.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 text-[10px] font-mono">No mappings.</div>
                        ) : (
                          slugMappings.map(m => (
                            <div key={m.id} className="p-4 space-y-3 bg-white">
                               <div className="flex justify-between items-start">
                                  <div className="space-y-1">
                                    <div className="text-[11px] font-mono font-black text-slate-800">{m.source}</div>
                                    <div className="text-[10px] font-mono text-emerald-600">→ {m.target}</div>
                                  </div>
                                  <div className={cn(
                                    "w-3 h-3 rounded-full",
                                    m.active ? "bg-emerald-600 animate-pulse" : "bg-slate-300"
                                  )} />
                               </div>
                               <div className="flex justify-between items-center whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded-full text-[8px] bg-slate-100 text-slate-700 border font-bold uppercase">{m.type}</span>
                                  <div className="flex space-x-3 text-[10px]">
                                     <button onClick={() => startEditSlugMapping(m)} className="text-slate-500 font-bold">Edit</button>
                                     <button onClick={() => handleDeleteSlugMapping(m.id)} className="text-red-600 font-bold">Revoke</button>
                                  </div>
                               </div>
                            </div>
                          ))
                        )}
                      </div>
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
                                setAdTargetPage('all');
                                setAdLayoutRow('top');
                                setAdOrderIndex('0');
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
                              expiryDate: adExpiryType === 'date' ? adExpiryDate : null,
                              targetPage: adTargetPage,
                              layoutRow: adLayoutRow,
                              orderIndex: parseInt(adOrderIndex, 10) || 0
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
                              setAdTargetPage('all');
                              setAdLayoutRow('top');
                              setAdOrderIndex('0');
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
                                <label className="text-xs font-bold text-slate-700 block">Target Placement Scope (Location)</label>
                                <select
                                  value={adPlacement}
                                  onChange={(e: any) => setAdPlacement(e.target.value)}
                                  className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                                >
                                  <option value="all">Sponsor everywhere (All pages & locations)</option>
                                  <option value="province">Specific Province Level targeting</option>
                                  <option value="city">Specific City / Town Level targeting</option>
                                  <option value="suburb">Specific Suburb Name targeting</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 block">Ad Placement Position / Style</label>
                                <select
                                  value={adPosition}
                                  onChange={(e: any) => setAdPosition(e.target.value)}
                                  className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                                >
                                  <option value="top-banner">Always on Top - Sticky Header Ad Banner</option>
                                  <option value="sidebar">Right Sidebar Spotlight Showcase</option>
                                  <option value="inline-list">Inline Organic Search Sponsor Card</option>
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

                          <div className="col-span-full bg-slate-50/50 p-4 rounded-xl border border-slate-150 space-y-4">
                            <h4 className="text-xs font-black uppercase text-slate-600 tracking-wider">Layout Settings</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 block">Target Page</label>
                                <select
                                  value={adTargetPage}
                                  onChange={(e: any) => setAdTargetPage(e.target.value)}
                                  className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                                >
                                  <option value="all">All Pages</option>
                                  <option value="home">Home (Directory / Explore)</option>
                                  <option value="news">News</option>
                                  <option value="sitemaps">Sitemaps</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 block">Layout Row</label>
                                <select
                                  value={adLayoutRow}
                                  onChange={(e: any) => setAdLayoutRow(e.target.value)}
                                  className="w-full bg-white border border-slate-205 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none cursor-pointer"
                                >
                                  <option value="top">Top Row (Above verified)</option>
                                  <option value="middle">Middle Row (Between verified & unverified)</option>
                                  <option value="bottom">Bottom Row (Below unverified)</option>
                                </select>
                              </div>

                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 block">Order Index (Sort by lowest first)</label>
                                <input
                                  type="number"
                                  value={adOrderIndex}
                                  onChange={(e) => setAdOrderIndex(e.target.value)}
                                  className="w-full bg-white border border-slate-205 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                                />
                              </div>
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
                        <div className="border border-slate-100 rounded-2xl overflow-hidden" id="admin-ads-table-wrapper">
                          <div className="hidden lg:block overflow-x-auto">
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
                                    <td className="space-y-1">
                                      <div className="font-mono bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-650 font-bold inline-block">
                                        Scope: {ad.placement.toUpperCase()} 
                                        {ad.province && ` (${ad.province})`}
                                        {ad.city && ` (${ad.city})`}
                                        {ad.suburb && ` (${ad.suburb})`}
                                      </div>
                                      <div className="text-[10px] font-semibold text-emerald-700 block">
                                        Position: {ad.position || 'sidebar'}
                                      </div>
                                    </td>
                                    <td>
                                      <p className="max-w-[140px] truncate text-slate-500 font-mono" title={ad.targetUrl}>{ad.targetUrl || 'None'}</p>
                                    </td>
                                    <td>
                                      <button
                                        type="button"
                                        onClick={async () => {
                                          const nextActive = !ad.active;
                                          const res = await fetch('/api/ads', {
                                            method: 'PUT',
                                            headers: {
                                              'Content-Type': 'application/json',
                                              'Authorization': `Bearer ${adminToken}`
                                            },
                                            body: JSON.stringify({ ...ad, active: nextActive })
                                          });
                                          const data = await res.json();
                                          if (data.success) {
                                            fetchAdminAds();
                                            fetchAdsList();
                                          }
                                        }}
                                        className={cn(
                                          "px-2.5 py-1 rounded-full text-[9px] font-mono font-bold cursor-pointer transition-all border shrink-0 flex items-center space-x-1 outline-none",
                                          ad.active 
                                            ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200" 
                                            : "bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200"
                                        )}
                                        title="Click to toggle Active status instantly"
                                      >
                                        <span className={cn(
                                          "w-1.5 h-1.5 rounded-full inline-block mr-1.5",
                                          ad.active ? "bg-emerald-600 animate-pulse" : "bg-slate-400"
                                        )}></span>
                                        <span>{ad.active ? 'LIVE / ACTIVE' : 'INACTIVE'}</span>
                                      </button>
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
                                          setAdTargetPage(ad.targetPage || 'all');
                                          setAdLayoutRow(ad.layoutRow || 'top');
                                          setAdOrderIndex(ad.orderIndex !== undefined ? ad.orderIndex.toString() : '0');
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
                          {/* Mobile Ads Layout */}
                          <div className="lg:hidden divide-y divide-slate-100">
                             {filteredAdminAds.map(ad => (
                               <div key={ad.id} className="p-4 space-y-3 bg-white">
                                  <div className="flex items-center space-x-3">
                                     <img src={ad.imageUrl} alt={ad.title} referrerPolicy="no-referrer" className="w-16 h-12 object-cover rounded-md border" />
                                     <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-800 text-xs truncate">{ad.title}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">ID: {ad.id}</p>
                                     </div>
                                  </div>
                                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-[10px] font-mono">
                                     <span className="text-slate-500">{ad.placement.toUpperCase()}</span>
                                     <span className="font-bold text-emerald-700">{ad.position || 'sidebar'}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-[10px] font-bold">
                                     <button onClick={async () => {
                                       if(confirm('Delete ad campaign permanently?')) {
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
                                     }} className="text-red-600 font-bold uppercase tracking-wide text-[10px] cursor-pointer">Delete</button>
                                     <div className={cn("w-2 h-2 rounded-full", ad.active ? "bg-emerald-500 animate-pulse" : "bg-slate-300")} />
                                  </div>
                               </div>
                             ))}
                          </div>
                        </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SUPREME VISITOR TELEMETRY TRAFFIC FEED DASHBOARD */}
                  {adminActiveSubTab === 'analytics' && userRole === 'ADMIN' && (
                    <div className="space-y-8" id="admin-analytics-profile-tab-panel">
                        <>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                              <div>
                                <h3 className="font-extrabold text-slate-900 text-sm">Real-time Visitor Logs & Audits</h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">Showing {filteredLogs.length} of {visitorLogs.length} tracking sessions</p>
                              </div>
                              <div className="flex items-center space-x-2 w-full sm:w-auto self-stretch sm:self-auto shrink-0">
                                <button
                                  type="button"
                                  onClick={fetchAnalyticsLogs}
                                  className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl cursor-pointer font-semibold transition-colors flex items-center space-x-1 shrink-0"
                                >
                                  <span>🔄 Refresh Logs</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={downloadAnalyticsCSV}
                                  className="text-[11px] bg-emerald-600 hover:bg-emerald-750 text-white px-3 py-2 rounded-xl cursor-pointer font-extrabold transition-colors flex items-center space-x-1.5 shrink-0"
                                >
                                  <span>📥 Download History (CSV)</span>
                                </button>
                              </div>
                            </div>

                            {/* Filters row bar */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3" id="analytics-filter-bar">
                              <div className="md:col-span-4 shrink-0 relative">
                                <input
                                  type="text"
                                  value={analyticsSearchFilter}
                                  onChange={(e) => setAnalyticsSearchFilter(e.target.value)}
                                  placeholder="Filter by IP, Page, Search keyword..."
                                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 bg-slate-50"
                                />
                                {analyticsSearchFilter && (
                                  <button
                                    type="button"
                                    onClick={() => setAnalyticsSearchFilter('')}
                                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 font-bold font-mono text-[10px]"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                              
                              <div className="md:col-span-8 flex flex-wrap items-center gap-1.5 overflow-x-auto select-none" id="analytics-timescale-filter-list">
                                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase mr-1.5">Intervals:</span>
                                {([
                                  { value: 'all', label: 'All History' },
                                  { value: 'today', label: 'Today' },
                                  { value: 'yesterday', label: 'Yesterday' },
                                  { value: 'week', label: 'Past Week' },
                                  { value: 'month', label: 'Past Month' },
                                  { value: 'year', label: 'Past Year' }
                                ] as const).map((opt) => (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setAnalyticsTimeFilter(opt.value)}
                                    className={cn(
                                      "px-3 py-1.5 rounded-xl text-[10px] font-mono transition-all font-semibold cursor-pointer border",
                                      analyticsTimeFilter === opt.value
                                        ? "bg-slate-900 text-white border-slate-900"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                    )}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {analyticsLoading ? (
                              <p className="text-xs text-slate-500 font-mono">Connecting to streaming server...</p>
                            ) : filteredLogs.length === 0 ? (
                              <p className="text-xs text-slate-400 font-mono italic text-center py-10 bg-slate-50 rounded-xl" id="analytics-empty-log-state">
                                No logs match the selected timescale interval or search term filter.
                              </p>
                            ) : (
                              <div className="border border-slate-100 rounded-xl overflow-hidden" id="analytics-logs-container">
                                <div className="hidden lg:block overflow-x-auto">
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
                                    {filteredLogs.map(log => (
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
                                {/* Mobile Traffic Analytics Cards */}
                                <div className="lg:hidden divide-y divide-slate-100">
                                   {filteredLogs.map(log => (
                                      <div key={log.id} className="p-4 space-y-2 bg-white">
                                         <div className="flex justify-between items-start">
                                            <div className="text-[10px] font-mono text-slate-400 uppercase leading-tight font-extrabold">
                                               {new Date(log.timestamp).toLocaleTimeString()}<br/>
                                               {new Date(log.timestamp).toLocaleDateString()}
                                            </div>
                                            <div className="text-xs font-black text-slate-800">{log.ip}</div>
                                         </div>
                                         <div className="flex justify-between items-center text-[11px]">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">{log.deviceType || 'Desktop'}</span>
                                            <span className="font-mono text-emerald-600 truncate max-w-[150px]">{log.path}</span>
                                         </div>
                                         <div className="text-[10px] text-slate-400 truncate bg-slate-50 p-1.5 rounded">
                                            Source: {log.referrer || 'Direct Load'}
                                         </div>
                                         <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                                            <span>Clicks: {log.clicks?.length || 0}</span>
                                            <span>Terms: {log.searches?.length || 0}</span>
                                         </div>
                                      </div>
                                   ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                    </div>
                  )}

                  {/* USER AND ADMIN PROFILE CONFIGURATION TAB PANEL */}
                  {adminActiveSubTab === 'profile' && (
                    <div className="bg-white border border-slate-205 rounded-2xl p-6 shadow-xs max-w-2xl mx-auto space-y-6 text-sm" id="admin-profile-config-tab-panel">
                          <div className="border-b pb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                              <Settings className="w-5 h-5 text-indigo-600" />
                              Profile Settings
                            </h3>
                            <p className="text-slate-500 text-xs mt-1">Manage your account details and directory presentation</p>
                          </div>

                          {/* DYNAMIC SUBSCRIPTION TIER STATUS CARD */}
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3" id="profile-membership-card">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-slate-500">Your Membership Tier</span>
                              {userProfile?.tier === 'PREMIUM' ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 animate-pulse">
                                  💎 PREMIUM VERIFIED
                                </span>
                              ) : userProfile?.selectedTier === 'PREMIUM' ? (
                                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                                  ⌛ PENDING VERIFICATION
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                                  Standard Free Listing
                                </span>
                              )}
                            </div>

                            {userProfile?.tier === 'PREMIUM' ? (
                              <div className="bg-emerald-500/10 border border-emerald-300/40 rounded-xl p-3.5 space-y-1.5" id="premium-activated-info">
                                <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1">
                                  🏆 Enterprise Trust Badge Active
                                </h4>
                                <p className="text-[11px] text-emerald-800 leading-relaxed">
                                  Your business has been verified as legal and authentic by the BizSearch24 administrative board. Your listing is boosted and consumer caution flags have been removed.
                                </p>
                              </div>
                            ) : userProfile?.selectedTier === 'PREMIUM' ? (
                              <div className="bg-amber-500/10 border border-amber-300/40 rounded-xl p-3.5 space-y-3" id="premium-pending-info">
                                <h4 className="font-bold text-amber-900 text-xs">
                                  📂 Verification Document Review in Progress
                                </h4>
                                <p className="text-[11px] text-amber-805 leading-relaxed font-sans">
                                  To complete verification and unlock the verified badge, email your company documents directly to our reviewers at <strong className="underline">mailbizsearch24@gmail.com</strong>.
                                </p>
                                <div className="bg-white/80 p-2.5 rounded-lg border border-amber-200 text-[10px] text-slate-650 font-mono space-y-1">
                                  <p className="font-bold text-slate-800 block">Required verification files:</p>
                                  <p>✓ Legal Identity Document (ID / Passport)</p>
                                  <p>✓ CIPC Business Registry Certificate</p>
                                  <p>✓ SARS Tax Clearance Letter</p>
                                  <p>✓ Proof of active Business Bank Account</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const subject = encodeURIComponent("BizSearch24 Verification Document Submission - " + (userProfile?.email || ""));
                                    const bodyText = encodeURIComponent(
                                      "Hi BizSearch24 Administration,\n\n" +
                                      "Please find attached my legal verification documents to complete Premium verification for my account: " + (userProfile?.email || "") + "\n\n" +
                                      "Required documents included:\n" +
                                      "1. Identity Document\n" +
                                      "2. CIPC Business Certificate\n" +
                                      "3. SARS Tax clearance letter\n" +
                                      "4. Business account confirmation proof\n\n" +
                                      "I agree to the month-to-month R199 per month debit. No contracts.\n\n" +
                                      "Trading Business Name: " + (userProfile?.businessName || "") + "\n" +
                                      "Registration Number: " + (userProfile?.companyRegNumber || "") + "\n" +
                                      "Contact Phone: " + (userProfile?.phone || "") + "\n\n" +
                                      "Thank you!"
                                    );
                                    window.open(`mailto:mailbizsearch24@gmail.com?subject=${subject}&body=${bodyText}`, '_self');
                                  }}
                                  className="py-1.5 px-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[10.5px] rounded-lg transition-all flex items-center justify-center space-x-1 border-0 cursor-pointer w-fit"
                                >
                                  <Mail className="w-3 h-3 text-amber-100" />
                                  <span>Submit Verification Documents Now</span>
                                </button>
                              </div>
                            ) : (
                              <div className="bg-slate-100 border border-slate-200 rounded-xl p-3.5 space-y-3" id="premium-upgrade-info">
                                <h4 className="font-bold text-slate-800 text-xs">
                                  🔒 Increase Visibility & Build Customer Trust
                                </h4>
                                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                                  Standard free accounts trigger a red unverified banner to consumer clients. Upgrade to Premium Verified for <strong>R199 per month</strong> to lock-in premium rankings, visual gallery upload permissions, and customer assurance. You can also register/renew your professional custom <strong>.co.za domain</strong> name for only <strong>R99 once-per-year</strong>!
                                </p>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    try {
                                      const subject = encodeURIComponent("BizSearch24 Upgrade Request to Premium Tier - " + (userProfile?.email || ""));
                                      const bodyText = encodeURIComponent(
                                        "Hi BizSearch24 Team,\n\n" +
                                        "I would like to request upgrade to the Premium Verified Tier (R199/pm).\n\n" +
                                        "Please find attached my company verification files:\n" +
                                        "1. ID Copy\n" +
                                        "2. CIPC Document\n" +
                                        "3. SARS Document\n" +
                                        "4. Business Account Proof\n\n" +
                                        "Account Login Email: " + (userProfile?.email || "") + "\n" +
                                        "Trading Business Name: " + (userProfile?.businessName || "") + "\n\n" +
                                        "Thank you!"
                                      );
                                      window.open(`mailto:mailbizsearch24@gmail.com?subject=${subject}&body=${bodyText}`, '_self');

                                      if (userProfile) {
                                        setUserProfile({ ...userProfile, selectedTier: 'PREMIUM' });
                                      }
                                    } catch (err) {}
                                  }}
                                  className="py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] rounded-lg transition-all flex items-center justify-center space-x-1 border-0 cursor-pointer w-fit"
                                >
                                  <Sparkles className="w-3 h-3 text-emerald-100" />
                                  <span>Request Upgrade (Submit Documents)</span>
                                </button>
                              </div>
                            )}
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
                                   fullName: userProfile?.fullName || '',
                                   phone: userProfile?.phone || '',
                                   email: userProfile?.email || '',
                                   idNumber: userProfile?.idNumber || '',
                                   companyRegNumber: userProfile?.companyRegNumber || '',
                                   billingAddress: userProfile?.billingAddress || '',
                                   socialFacebook: userProfile?.socialFacebook || '',
                                   socialTwitter: userProfile?.socialTwitter || '',
                                   socialInstagram: userProfile?.socialInstagram || '',
                                   socialLinkedin: userProfile?.socialLinkedin || '',
                                   socialYoutube: userProfile?.socialYoutube || '',
                                   socialTiktok: userProfile?.socialTiktok || '',
                                   website: userProfile?.website || '',
                                   businessName: userProfile?.businessName || '',
                                   vatNumber: userProfile?.vatNumber || '',
                                   newPassword: newProfilePassword || '',
                                   showProfileDetails: userProfile?.showProfileDetails || false,
                                   profileColor: userProfile?.profileColor || 'slate'
                                 })
                               });
                               if (res.ok) {
                                 const data = await res.json();
                                 if (data.success) {
                                   setProfileSaveMsg('Profile saved securely.');
                                   setNewProfilePassword(''); // Clear password field on success
                                   await fetchAdminData();
                                 } else {
                                   setProfileSaveMsg(data.message || 'Failed to save profile');
                                 }
                               } else {
                                 if (res.status === 450) {
                                   setProfileSaveMsg('Email already in use by another account.');
                                 } else {
                                   setProfileSaveMsg('Failed to save profile');
                                 }
                               }
                             } catch (e) {
                               setProfileSaveMsg('Network error.');
                             }
                           }}>
                             {/* Personal Details */}
                             <div className="border-b pb-2">
                               <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">1. Personal & Contact Details</h4>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <label className="block col-span-2">
                                 <span className="font-bold text-slate-700 text-xs">Full Name</span>
                                 <input type="text" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.fullName || ''} onChange={e => setUserProfile({...userProfile, fullName: e.target.value})} placeholder="e.g. John Doe" />
                               </label>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">First Name</span>
                                 <input type="text" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.firstName || ''} onChange={e => setUserProfile({...userProfile, firstName: e.target.value})} />
                               </label>
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">Last Name</span>
                                 <input type="text" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.lastName || ''} onChange={e => setUserProfile({...userProfile, lastName: e.target.value})} />
                               </label>
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">Phone Number</span>
                                 <input type="text" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.phone || ''} onChange={e => setUserProfile({...userProfile, phone: e.target.value})} placeholder="e.g. 082 123 4567" />
                               </label>
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">Email Address (Sign In & Admin)</span>
                                 <input required type="email" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.email || ''} onChange={e => setUserProfile({...userProfile, email: e.target.value})} />
                               </label>
                             </div>

                             <div className="grid grid-cols-2 gap-4">
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">Identity Number / Passport</span>
                                 <input type="text" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.idNumber || ''} onChange={e => setUserProfile({...userProfile, idNumber: e.target.value})} />
                               </label>
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">Full Billing Address</span>
                                 <input type="text" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.billingAddress || ''} onChange={e => setUserProfile({...userProfile, billingAddress: e.target.value})} />
                               </label>
                             </div>

                             {/* Business Credentials */}
                             <div className="border-t pt-2 border-b pb-2">
                               <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">2. Correlate Business Credentials</h4>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <label className="block col-span-2">
                                 <span className="font-bold text-slate-700 text-xs">Business Name</span>
                                 <input type="text" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.businessName || ''} onChange={e => setUserProfile({...userProfile, businessName: e.target.value})} placeholder="Registered Business / Trading Name" />
                               </label>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">Company Registration Number</span>
                                 <input type="text" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.companyRegNumber || ''} onChange={e => setUserProfile({...userProfile, companyRegNumber: e.target.value})} placeholder="e.g. 2024/123456/07" />
                               </label>
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">VAT Number</span>
                                 <input type="text" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.vatNumber || ''} onChange={e => setUserProfile({...userProfile, vatNumber: e.target.value})} placeholder="10-digit VAT Number" />
                               </label>
                             </div>
                             <div className="grid grid-cols-1">
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">Business Website</span>
                                 <input type="url" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.website || ''} onChange={e => setUserProfile({...userProfile, website: e.target.value})} placeholder="https://yourwebsite.co.za" />
                               </label>
                             </div>

                             {/* Social Media Links */}
                             <div className="border-t pt-2 border-b pb-2">
                               <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">3. Social Media Connections</h4>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">Facebook Profile / Page</span>
                                 <input type="url" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.socialFacebook || ''} onChange={e => setUserProfile({...userProfile, socialFacebook: e.target.value})} placeholder="https://facebook.com/..." />
                               </label>
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">Twitter / X URL</span>
                                 <input type="url" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.socialTwitter || ''} onChange={e => setUserProfile({...userProfile, socialTwitter: e.target.value})} placeholder="https://x.com/..." />
                               </label>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">Instagram Username / Link</span>
                                 <input type="url" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.socialInstagram || ''} onChange={e => setUserProfile({...userProfile, socialInstagram: e.target.value})} placeholder="https://instagram.com/..." />
                               </label>
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">LinkedIn Company / Profile Link</span>
                                 <input type="url" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.socialLinkedin || ''} onChange={e => setUserProfile({...userProfile, socialLinkedin: e.target.value})} placeholder="https://linkedin.com/in/..." />
                               </label>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">YouTube Channel</span>
                                 <input type="url" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.socialYoutube || ''} onChange={e => setUserProfile({...userProfile, socialYoutube: e.target.value})} placeholder="https://youtube.com/@..." />
                               </label>
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">TikTok URL</span>
                                 <input type="url" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={userProfile?.socialTiktok || ''} onChange={e => setUserProfile({...userProfile, socialTiktok: e.target.value})} placeholder="https://tiktok.com/@..." />
                               </label>
                             </div>

                             {/* Change Password */}
                             <div className="border-t pt-2 border-b pb-2">
                               <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">4. Security Settings</h4>
                             </div>
                             <div className="grid grid-cols-1">
                               <label className="block">
                                 <span className="font-bold text-slate-700 text-xs">Change Password (Leave blank to keep unchanged)</span>
                                 <input type="password" className="mt-1 block w-full rounded-md border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs" value={newProfilePassword} onChange={e => setNewProfilePassword(e.target.value)} placeholder="Type new secure password" />
                               </label>
                             </div>

                             {/* Privacy Controls & Display settings */}
                             <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-3">
                               <p className="text-[11px] text-emerald-800 leading-relaxed font-semibold">
                                 🔒 <strong>Privacy Visibility Guarantee:</strong> You completely control your information on bizsearch24.co.za. You choose if your full name, phone number, physical address, business credentials, and socials are shown to public visitors on directory and search result pages, or fully hidden.
                               </p>
                               
                               <label className="flex items-center space-x-2 border-t border-emerald-100 pt-3">
                                 <input type="checkbox" className="rounded text-indigo-700 focus:ring-indigo-500 h-4 w-4" checked={userProfile?.showProfileDetails || false} onChange={e => setUserProfile({...userProfile, showProfileDetails: e.target.checked})} />
                                 <span className="text-xs font-black text-slate-800">Show Contact & Social Details on Public Listings (Toggle on/off)</span>
                               </label>
                               
                               <label className="block pt-2">
                                 <span className="font-bold text-slate-700 text-[11px]">Listings Theme Branding Accent Color</span>
                                 <select className="mt-1 block w-full rounded-md bg-white border-slate-200 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border outline-none text-xs font-mono" value={userProfile?.profileColor || 'slate'} onChange={e => setUserProfile({...userProfile, profileColor: e.target.value})}>
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

                          {/* Danger Zone for regular users */}
                          {wantDeleteAccount ? (
                            <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-3 mt-4" id="danger-zone-delete-confirm">
                              <h4 className="text-xs font-bold text-red-800 uppercase tracking-wide">⚠️ CRITICAL: Final Account Deletion Confirmation</h4>
                              <p className="text-xs text-red-700 leading-relaxed font-semibold">
                                Are you absolutely sure you want to delete your account? This action is <strong>irreversible</strong> and will permanently remove your contact profile, billing records, and all listings on bizsearch24.co.za.
                              </p>
                              <div className="flex gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setProfileSaveMsg('Deactivating and deleting your account...');
                                    try {
                                      const res = await fetch('/api/user/profile', {
                                        method: 'DELETE',
                                        headers: { 'Authorization': `Bearer ${adminToken}` }
                                      });
                                      const data = await res.json();
                                      if (data.success) {
                                        setAdminToken('');
                                        setUserProfile(null);
                                        setUserRole('USER');
                                        localStorage.removeItem('biz_admin_token');
                                        alert("Your account & directory listings have been permanently deleted.");
                                        window.location.reload();
                                      } else {
                                        setProfileSaveMsg(data.message || 'Could not complete account deletion.');
                                      }
                                    } catch (err) {
                                      setProfileSaveMsg('Network error.');
                                    }
                                  }}
                                  className="bg-red-650 hover:bg-red-700 text-white font-bold px-4 py-1.5 rounded text-xs cursor-pointer select-none"
                                  id="btn-delete-confirm-yes"
                                >
                                  Yes, Permanent Purge Account & Listings
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setWantDeleteAccount(false)}
                                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-1.5 rounded text-xs cursor-pointer select-none"
                                  id="btn-delete-confirm-no"
                                >
                                  No, Keep My Account (Cancel)
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl mt-4" id="danger-zone-delete-trigger">
                              <p className="text-[11.5px] text-red-600 font-semibold">Danger Zone: Looking to delete your account?</p>
                              <button
                                type="button"
                                onClick={() => setWantDeleteAccount(true)}
                                className="bg-red-100 hover:bg-red-200 text-red-700 font-bold px-3 py-1.5 rounded text-[11px] cursor-pointer mt-2"
                                id="btn-delete-account-trigger"
                              >
                                Delete My Account
                              </button>
                            </div>
                          )}
                        </div>
                  )}

                  {adminActiveSubTab === 'users' && (
                    <div className="space-y-6" id="admin-users-manager-tab-panel">
                      <div className="flex justify-between items-center bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
                        <div>
                          <h3 className="text-sm font-black uppercase text-slate-800 font-mono tracking-wide">Users & Directory Membership Control</h3>
                          <p className="text-[11px] text-slate-500 font-medium mt-1">As super-administrator, you have total authoritative control to view, add, modify, ban, or delete any account and clear their directory listings.</p>
                        </div>
                        {!editingUser && !isAddingUser && (
                          <button
                            onClick={() => {
                              setIsAddingUser(true);
                              setEditingUser(null);
                              // Reset form fields
                              setUserFormEmail('');
                              setUserFormPassword('');
                              setUserFormRole('USER');
                              setUserFormFirstName('');
                              setUserFormLastName('');
                              setUserFormFullName('');
                              setUserFormPhone('');
                              setUserFormIdNumber('');
                              setUserFormCompanyRegNumber('');
                              setUserFormBillingAddress('');
                              setUserFormShowProfileDetails(true);
                              setUserFormProfileColor('slate');
                              setUserFormWebsite('');
                              setUserFormBusinessName('');
                              setUserFormVatNumber('');
                              setUserFormMaxListings(1);
                              setUserFormIsBanned(false);
                              setAdminUserFormMsg('');
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer select-none"
                            id="admin-add-user-btn"
                          >
                            + Register New User Account
                          </button>
                        )}
                      </div>

                      {adminUserFormMsg && (
                        <div className="bg-indigo-50 border-l-4 border-indigo-600 text-indigo-700 px-4 py-3 border rounded text-xs font-semibold">
                          {adminUserFormMsg}
                        </div>
                      )}

                      {/* CREATE OR UPDATE USER FORM */}
                      {(isAddingUser || editingUser) ? (
                        <div className="bg-white border text-xs font-sans rounded-2xl p-5 md:p-6 shadow-xs space-y-4" id="admin-user-editor-form">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h4 className="text-xs font-extrabold uppercase font-mono text-indigo-750">
                              {isAddingUser ? 'Step 1: Admin Registration of New Account' : `Modify Profile & Control Protocol: ${editingUser.email}`}
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingUser(false);
                                setEditingUser(null);
                                setAdminUserFormMsg('');
                              }}
                              className="text-slate-500 hover:text-indigo-600 font-extrabold font-mono text-xs cursor-pointer select-none"
                            >
                              [Back to Users List]
                            </button>
                          </div>

                          <form onSubmit={async (e) => {
                            e.preventDefault();
                            setAdminUserFormMsg('Transmitting secure user profile updates...');
                            try {
                              const bodyObj: any = {
                                email: userFormEmail,
                                password: userFormPassword,
                                role: userFormRole,
                                firstName: userFormFirstName,
                                lastName: userFormLastName,
                                fullName: userFormFullName,
                                phone: userFormPhone,
                                idNumber: userFormIdNumber,
                                companyRegNumber: userFormCompanyRegNumber,
                                billingAddress: userFormBillingAddress,
                                showProfileDetails: userFormShowProfileDetails,
                                profileColor: userFormProfileColor,
                                website: userFormWebsite,
                                businessName: userFormBusinessName,
                                vatNumber: userFormVatNumber,
                                maxListings: Number(userFormMaxListings),
                                isBanned: userFormIsBanned,
                                selectedTier: userFormSelectedTier,
                                tier: userFormTier
                              };

                              let res;
                              if (isAddingUser) {
                                res = await fetch('/api/user/admin', {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${adminToken}`
                                  },
                                  body: JSON.stringify(bodyObj)
                                });
                              } else {
                                bodyObj.id = editingUser.id;
                                res = await fetch('/api/user/admin', {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${adminToken}`
                                  },
                                  body: JSON.stringify(bodyObj)
                                });
                              }

                              const data = await res.json();
                              if (data.success) {
                                setAdminUserFormMsg(isAddingUser ? 'New user registered successfully!' : 'User updated successfully!');
                                fetchAdminUsers();
                                setTimeout(() => {
                                  setIsAddingUser(false);
                                  setEditingUser(null);
                                  setAdminUserFormMsg('');
                                }, 1000);
                              } else {
                                setAdminUserFormMsg(data.message || 'Operation failed.');
                              }
                            } catch (err) {
                              setAdminUserFormMsg('A critical network error occurred.');
                            }
                          }} className="space-y-4">
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <label className="block">
                                <span className="font-bold text-slate-750">Login Email Address</span>
                                <input required type="email" value={userFormEmail} onChange={e => setUserFormEmail(e.target.value)} className="mt-1 block w-full rounded-md border-slate-250 p-2 outline-none text-xs" />
                              </label>
                              <label className="block">
                                <span className="font-bold text-slate-755">{isAddingUser ? 'Secure Password' : 'Change Password (Blank to keep current)'}</span>
                                <input required={isAddingUser} type="text" value={userFormPassword} onChange={e => setUserFormPassword(e.target.value)} placeholder="Type password" className="mt-1 block w-full rounded-md border-slate-250 p-2 outline-none text-xs" />
                              </label>
                              <label className="block">
                                <span className="font-bold text-slate-755">Account System Role</span>
                                <select value={userFormRole} onChange={e => setUserFormRole(e.target.value)} className="mt-1 block w-full rounded-md border-slate-250 p-2 bg-white outline-none text-xs">
                                  <option value="USER">USER (Regular submitter)</option>
                                  <option value="ADMIN">ADMIN (Super-admin backend access)</option>
                                </select>
                              </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-3">
                              <label className="block">
                                <span className="font-bold text-slate-755">First Name</span>
                                <input type="text" value={userFormFirstName} onChange={e => setUserFormFirstName(e.target.value)} className="mt-1 block w-full rounded-md border-slate-250 p-2 outline-none text-xs" />
                              </label>
                              <label className="block">
                                <span className="font-bold text-slate-755">Last Name</span>
                                <input type="text" value={userFormLastName} onChange={e => setUserFormLastName(e.target.value)} className="mt-1 block w-full rounded-md border-slate-250 p-2 outline-none text-xs" />
                              </label>
                              <label className="block">
                                <span className="font-bold text-slate-755">Full Public Display Name</span>
                                <input type="text" value={userFormFullName} onChange={e => setUserFormFullName(e.target.value)} className="mt-1 block w-full rounded-md border-slate-250 p-2 outline-none text-xs" placeholder="e.g. Johnathan Doe" />
                              </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <label className="block">
                                <span className="font-bold text-slate-755">Contact Phone</span>
                                <input type="text" value={userFormPhone} onChange={e => setUserFormPhone(e.target.value)} className="mt-1 block w-full rounded-md border-slate-250 p-2 outline-none text-xs" />
                              </label>
                              <label className="block">
                                <span className="font-bold text-slate-755">ID / Passport Number</span>
                                <input type="text" value={userFormIdNumber} onChange={e => setUserFormIdNumber(e.target.value)} className="mt-1 block w-full rounded-md border-slate-250 p-2 outline-none text-xs" />
                              </label>
                              <label className="block">
                                <span className="font-bold text-slate-755">Full Billing Address</span>
                                <input type="text" value={userFormBillingAddress} onChange={e => setUserFormBillingAddress(e.target.value)} className="mt-1 block w-full rounded-md border-slate-250 p-2 outline-none text-xs" />
                              </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-3">
                              <label className="block">
                                <span className="font-bold text-slate-755">Business Name</span>
                                <input type="text" value={userFormBusinessName} onChange={e => setUserFormBusinessName(e.target.value)} className="mt-1 block w-full rounded-md border-slate-250 p-2 outline-none text-xs" />
                              </label>
                              <label className="block">
                                <span className="font-bold text-slate-755">Company Registration Number</span>
                                <input type="text" value={userFormCompanyRegNumber} onChange={e => setUserFormCompanyRegNumber(e.target.value)} className="mt-1 block w-full rounded-md border-slate-250 p-2 outline-none text-xs" />
                              </label>
                              <label className="block">
                                <span className="font-bold text-slate-755">VAT Number (10 digit)</span>
                                <input type="text" value={userFormVatNumber} onChange={e => setUserFormVatNumber(e.target.value)} className="mt-1 block w-full rounded-md border-slate-250 p-2 outline-none text-xs" />
                              </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                              <label className="block">
                                <span className="font-bold text-slate-755">Business Website</span>
                                <input type="url" value={userFormWebsite} onChange={e => setUserFormWebsite(e.target.value)} className="mt-1 block w-full rounded-md border-slate-250 p-2 outline-none text-xs" placeholder="https://..." />
                              </label>
                              <label className="block">
                                <span className="font-bold text-slate-755">Allowed Free Listings Cap</span>
                                <input type="number" min="1" value={userFormMaxListings} onChange={e => setUserFormMaxListings(Number(e.target.value))} className="mt-1 block w-full rounded-md border-slate-250 p-2 outline-none text-xs" />
                              </label>
                              <label className="block">
                                <span className="font-bold text-slate-755">Listings Branding Style Accent</span>
                                <select value={userFormProfileColor} onChange={e => setUserFormProfileColor(e.target.value)} className="mt-1 block w-full rounded-md border-slate-250 p-2 bg-white outline-none text-xs">
                                  <option value="slate">Slate (Business Grey)</option>
                                  <option value="indigo">Indigo (Professional Blue)</option>
                                  <option value="emerald">Emerald (Green Growth)</option>
                                  <option value="amber">Amber (Creative Gold)</option>
                                  <option value="rose">Rose (Warm lifestyle)</option>
                                </select>
                              </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-3" id="admin-user-tier-controls">
                              <label className="block">
                                <span className="font-bold text-slate-800">User Requested Tier (Selected during Sign-up)</span>
                                <select value={userFormSelectedTier} onChange={e => setUserFormSelectedTier(e.target.value as 'FREE' | 'PREMIUM')} className="mt-1 block w-full rounded-md border-slate-250 p-2 bg-white outline-none text-xs">
                                  <option value="FREE">FREE (Standard)</option>
                                  <option value="PREMIUM">PREMIUM (R199/pm request)</option>
                                </select>
                              </label>
                              <label className="block">
                                <span className="font-bold text-emerald-800 flex items-center">
                                  <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-500 animate-pulse" />
                                  Active Premium Level Status (Admin Authorized Override Only)
                                </span>
                                <select value={userFormTier} onChange={e => setUserFormTier(e.target.value as 'FREE' | 'PREMIUM')} className="mt-1 block w-full rounded-md border-slate-250 p-2 bg-white font-extrabold text-emerald-800 border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 outline-none text-xs">
                                  <option value="FREE">FREE (Unverified Tier)</option>
                                  <option value="PREMIUM">PREMIUM (Authorized Verified Upgrade)</option>
                                </select>
                                <p className="text-[10px] text-slate-450 mt-1">
                                  As the Admin, set this to PREMIUM only after you have verified their uploaded CIPC, ID, SARS, and Proof of bank account documents sent to your mail server.
                                </p>
                              </label>
                            </div>

                            <div className="bg-slate-55/60 p-4 rounded-xl space-y-4 border border-slate-200">
                              <h5 className="font-extrabold text-slate-800 uppercase tracking-wide text-[10px] font-mono">Governance & Privacy Overrides</h5>
                              <div className="flex flex-wrap gap-6 text-[11px]">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input type="checkbox" checked={userFormShowProfileDetails} onChange={e => setUserFormShowProfileDetails(e.target.checked)} className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" />
                                  <span className="text-slate-800 font-bold">Public Listing visibility toggle (Show contact details publicly)</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input type="checkbox" checked={userFormIsBanned} onChange={e => setUserFormIsBanned(e.target.checked)} className="rounded text-red-600 focus:ring-red-500 w-4 h-4 cursor-pointer" />
                                  <span className="text-red-700 font-extrabold uppercase">🚫 BANNED FROM DIRECTORY (Disable sign in & listings)</span>
                                </label>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setIsAddingUser(false);
                                  setEditingUser(null);
                                  setAdminUserFormMsg('');
                                }}
                                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-lg text-xs select-none cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-lg shadow-sm text-xs select-none cursor-pointer"
                              >
                                {isAddingUser ? 'Register New User Account' : 'Commit Security Profile Changes'}
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : (
                        /* USERS LIST TABLE ACCORDION */
                        <div className="bg-white border text-xs font-sans rounded-2xl p-4 md:p-6 shadow-xs space-y-4">
                          <h4 className="font-extrabold text-slate-950 text-sm">Directory Membership Base ({adminUsers.length} total registered profiles)</h4>
                          
                          {adminUsersLoading ? (
                            <p className="text-xs text-slate-500 font-mono">Streaming active directory database records...</p>
                          ) : adminUsers.length === 0 ? (
                            <p className="text-xs text-slate-400 italic text-center py-6">No user profiles present in database.</p>
                          ) : (
                            <div className="space-y-4">
                              <div className="border border-slate-150 rounded-2xl overflow-hidden" id="admin-users-table-wrapper">
                              <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full text-left border-collapse text-[11px]" id="admin-users-data-table">
                                <thead>
                                  <tr className="border-b border-slate-100 text-slate-400 font-mono bg-slate-50 text-[10px] uppercase">
                                    <th className="p-2">Role / Status</th>
                                    <th className="p-2">Auth Account</th>
                                    <th className="p-2">Human & ID Details</th>
                                    <th className="p-2">Correlated Business / VAT</th>
                                    <th className="p-2">Vis. Toggle (Privacy)</th>
                                    <th className="p-2">Active Ads</th>
                                    <th className="p-2 text-right">Administrative Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {adminUsers.map((user) => {
                                    const userAds = adminListings.filter(l => l.userId === user.id);
                                    return (
                                      <tr key={user.id} className={cn("border-b border-slate-100/50 hover:bg-slate-50/50", user.isBanned && "bg-red-50/40")}>
                                        <td className="p-2 font-mono whitespace-nowrap">
                                          <span className={cn(
                                            "px-2 py-0.5 rounded text-[9px] font-bold block w-fit mb-1 uppercase text-center leading-none border",
                                            user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-850 border-indigo-200' : 'bg-slate-100 text-slate-800 border-slate-200'
                                          )}>
                                            {user.role}
                                          </span>
                                          {user.isBanned ? (
                                            <span className="px-1.5 py-0.5 rounded text-[8.5px] font-extrabold bg-red-100 text-red-800 uppercase block tracking-wider font-sans border border-red-200 w-fit">
                                              Banned
                                            </span>
                                          ) : (
                                            <span className="px-1.5 py-0.5 rounded text-[8.5px] font-semibold bg-emerald-50 text-emerald-800 uppercase block w-fit border border-emerald-200 font-sans">
                                              Active
                                            </span>
                                          )}
                                          {user.tier === 'PREMIUM' ? (
                                            <span className="px-1.5 py-0.5 rounded text-[8.5px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase block tracking-wider font-sans w-fit mt-1 flex items-center gap-0.5 animate-pulse">
                                              💎 Premium
                                            </span>
                                          ) : user.selectedTier === 'PREMIUM' ? (
                                            <span className="px-1.5 py-0.5 rounded text-[8.5px] font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase block tracking-wider font-sans w-fit mt-1 flex items-center gap-0.5">
                                              ⌛ Reviewing
                                            </span>
                                          ) : (
                                            <span className="px-1.5 py-0.5 rounded text-[8.5px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 uppercase block w-fit mt-1 font-sans">
                                              Free Tier
                                            </span>
                                          )}
                                        </td>
                                        <td className="p-2 font-mono leading-tight whitespace-normal break-all">
                                          <p className="font-extrabold text-slate-900">{user.email}</p>
                                          <p className="text-[10px] text-slate-450 mt-1 font-semibold">ID: {user.id}</p>
                                          {user.lastKnownIp && (
                                            <p className="text-[9.5px] text-indigo-700 mt-1 font-bold bg-indigo-50/60 w-fit px-1.5 py-0.5 rounded border border-indigo-150">
                                              🖥️ {user.lastKnownIp}
                                            </p>
                                          )}
                                        </td>
                                        <td className="p-2 leading-tight">
                                          <div className="font-bold text-slate-850">{user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || <span className="italic text-slate-300">- No name listed -</span>}</div>
                                          {user.phone && <p className="font-semibold text-slate-650 mt-1">📞 {user.phone}</p>}
                                          {user.idNumber && <p className="text-[10px] font-mono text-slate-500 mt-1">ID #: {user.idNumber}</p>}
                                          {user.billingAddress && <p className="text-[10px] text-slate-500 mt-1 max-w-[150px] truncate" title={user.billingAddress}>📍 {user.billingAddress}</p>}
                                        </td>
                                        <td className="p-2 leading-tight font-mono text-[10.5px]">
                                          {user.businessName ? (
                                            <div className="space-y-1">
                                              <p className="font-extrabold text-indigo-900 uppercase font-sans truncate max-w-[150px]">{user.businessName}</p>
                                              {user.companyRegNumber && <p className="text-[9.5px] text-slate-450 font-semibold uppercase">Reg: {user.companyRegNumber}</p>}
                                              {user.vatNumber && <p className="text-[9.5px] text-emerald-700 font-bold">VAT: {user.vatNumber}</p>}
                                              {user.website && <a href={user.website} target="_blank" rel="noreferrer" className="text-[9.5px] hover:underline text-blue-600 block truncate max-w-[150px]">{user.website}</a>}
                                            </div>
                                          ) : (
                                            <span className="text-slate-355 italic">- None -</span>
                                          )}
                                        </td>
                                        <td className="p-2">
                                          {user.showProfileDetails ? (
                                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-850 border border-emerald-200 rounded font-semibold text-[10px] uppercase font-sans">
                                              Visible (Public)
                                            </span>
                                          ) : (
                                            <span className="px-2 py-0.5 bg-amber-50 text-amber-850 border border-amber-200 rounded font-bold text-[10px] uppercase font-sans">
                                              Private (Hidden)
                                            </span>
                                          )}
                                          <p className="text-[9px] text-slate-400 font-mono mt-1.5 leading-tight">Admin Override Active: Details above are fully visible here even if user turned visibility toggle off.</p>
                                        </td>
                                        <td className="p-2 font-mono text-center">
                                          <div className="text-sm font-black text-slate-800">{userAds.length}</div>
                                          <p className="text-[8.5px] text-slate-400">Cap: {user.maxListings || 1}</p>
                                        </td>
                                        <td className="p-2 text-right">
                                          <div className="flex flex-col gap-1 items-end">
                                            <button
                                              onClick={() => {
                                                setEditingUser(user);
                                                setIsAddingUser(false);
                                                setUserFormEmail(user.email || '');
                                                setUserFormPassword('');
                                                setUserFormRole(user.role || 'USER');
                                                setUserFormFirstName(user.firstName || '');
                                                setUserFormLastName(user.lastName || '');
                                                setUserFormFullName(user.fullName || '');
                                                setUserFormPhone(user.phone || '');
                                                setUserFormIdNumber(user.idNumber || '');
                                                setUserFormCompanyRegNumber(user.companyRegNumber || '');
                                                setUserFormBillingAddress(user.billingAddress || '');
                                                setUserFormShowProfileDetails(user.showProfileDetails || false);
                                                setUserFormProfileColor(user.profileColor || 'slate');
                                                setUserFormWebsite(user.website || '');
                                                setUserFormBusinessName(user.businessName || '');
                                                setUserFormVatNumber(user.vatNumber || '');
                                                setUserFormMaxListings(user.maxListings || 1);
                                                setUserFormIsBanned(user.isBanned || false);
                                                setUserFormSelectedTier(user.selectedTier || 'FREE');
                                                setUserFormTier(user.tier || 'FREE');
                                                setAdminUserFormMsg('');
                                              }}
                                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-bold text-[9px] block w-24 text-center cursor-pointer uppercase select-none transition-all"
                                            >
                                              🔧 Edit Profile
                                            </button>
                                            
                                            <button
                                              onClick={async () => {
                                                const check = confirm(`⚠️ WARNING: Are you absolutely sure you want to permanently delete user account "${user.email}"?\n\nThis will immediately delete their entire profile AND cascade-delete all their directory listings (${userAds.length} ads) from the system permanently!`);
                                                if (check) {
                                                  setAdminUserFormMsg(`Deleting ${user.email} and purging active listings...`);
                                                  try {
                                                    const res = await fetch(`/api/user/admin?id=${user.id}`, {
                                                      method: 'DELETE',
                                                      headers: { 'Authorization': `Bearer ${adminToken}` }
                                                    });
                                                    const data = await res.json();
                                                    if (data.success) {
                                                      setAdminUserFormMsg(`Purged successfully: ${user.email}`);
                                                      fetchAdminUsers();
                                                      fetchListings();
                                                      setTimeout(() => setAdminUserFormMsg(''), 2000);
                                                    } else {
                                                      setAdminUserFormMsg(data.message || 'Deletion failed.');
                                                    }
                                                  } catch (err) {
                                                    setAdminUserFormMsg('Error performing delete request.');
                                                  }
                                                }
                                              }}
                                              className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-705 rounded-md font-bold text-[9px] block w-24 text-center cursor-pointer uppercase select-none transition-all"
                                            >
                                              ❌ Purge & Delete
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            {/* Mobile User Profiles Layout */}
                            <div className="lg:hidden divide-y divide-slate-100">
                               {adminUsers.map(user => {
                                  const userAdsCount = adminListings.filter(l => l.userId === user.id).length;
                                  return (
                                    <div key={user.id} className={cn("p-4 space-y-3 bg-white", user.isBanned && "bg-red-50/10")}>
                                       <div className="flex justify-between items-start">
                                          <div className="space-y-1">
                                             <div className="font-bold text-slate-950 text-xs truncate max-w-[220px]">{user.email}</div>
                                             <div className="flex gap-1.5 flex-wrap">
                                                <span className={cn("px-1.5 py-0.5 rounded text-[8px] font-black uppercase text-center border", user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-600')}>{user.role}</span>
                                                {user.isBanned && <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Banned</span>}
                                             </div>
                                          </div>
                                          <div className="text-right">
                                             <div className="text-[12px] font-black text-slate-800">{userAdsCount}</div>
                                             <div className="text-[8px] uppercase font-mono text-slate-400">Total Ads</div>
                                          </div>
                                       </div>
                                       <div className="flex gap-2 pt-1 border-t border-slate-50 mt-2">
                                          <button onClick={() => {
                                             setEditingUser(user);
                                             setIsAddingUser(false);
                                             setUserFormEmail(user.email || '');
                                             setUserFormPassword('');
                                             setUserFormRole(user.role || 'USER');
                                             setUserFormFirstName(user.firstName || '');
                                             setUserFormLastName(user.lastName || '');
                                             setUserFormFullName(user.fullName || '');
                                             setUserFormPhone(user.phone || '');
                                             setUserFormIdNumber(user.idNumber || '');
                                             setUserFormCompanyRegNumber(user.companyRegNumber || '');
                                             setUserFormBillingAddress(user.billingAddress || '');
                                             setUserFormShowProfileDetails(user.showProfileDetails || false);
                                             setUserFormEmail(user.email || '');
                                             setUserFormWebsite(user.website || '');
                                             setUserFormBusinessName(user.businessName || '');
                                             setUserFormVatNumber(user.vatNumber || '');
                                             setUserFormMaxListings(user.maxListings || 1);
                                             setUserFormIsBanned(user.isBanned || false);
                                             setUserFormSelectedTier(user.selectedTier || 'FREE');
                                             setUserFormTier(user.tier || 'FREE');
                                             setAdminUserFormMsg('');
                                          }} className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded font-black text-[9px] uppercase border shadow-xs">🔧 Manage User</button>
                                       </div>
                                    </div>
                                  );
                               })}
                            </div>
                          </div>

                        {/* SUB-AD SECTION CONTROLLER */}
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
                          <h5 className="font-extrabold text-slate-800 uppercase tracking-wide text-[10.5px] font-mono">Authoritative Controls over all users&apos; ads & listings</h5>
                          <p className="text-[11px] text-slate-550 leading-relaxed">
                            Below is the live operational feed of every active ad/listing in the directory database. You has the admin have full complete control to quickly approve, reject, modify, or permanently delete any listing at any time.
                          </p>
                          
                          <div className="border border-slate-150 rounded-xl overflow-hidden" id="admin-listings-manager-wrapper">
                            <div className="hidden lg:block overflow-x-auto">
                              <table className="w-full text-left border-collapse text-[10px]">
                                <thead>
                                  <tr className="border-b border-slate-200 text-slate-400 font-mono uppercase bg-slate-100 text-[8.5px]">
                                    <th className="p-2">Listing ID</th>
                                    <th className="p-2">Owner / email</th>
                                    <th className="p-2">Business Name / details</th>
                                    <th className="p-2">Verification Status</th>
                                    <th className="p-2 text-right">Authoritative Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {adminListings.map((listing) => {
                                    const owner = adminUsers.find(u => u.id === listing.userId);
                                    return (
                                      <tr key={listing.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                        <td className="p-2 font-mono text-[9px] truncate max-w-[80px]" title={listing.id}>{listing.id}</td>
                                        <td className="p-2 leading-tight">
                                          <p className="font-bold text-slate-800">{owner ? owner.email : 'Unknown Admin Account'}</p>
                                          <p className="text-[8.5px] text-slate-450">ID: {listing.userId}</p>
                                        </td>
                                        <td className="p-2 leading-tight">
                                          <p className="font-black text-slate-900 text-[10.5px] uppercase">{listing.businessName}</p>
                                          <p className="text-[9px] text-slate-500 font-mono">{listing.category} | {listing.province}, {listing.city}</p>
                                        </td>
                                        <td className="p-2">
                                          <span className={cn(
                                            "px-1.5 py-0.5 rounded text-[8.5px] font-extrabold font-mono uppercase border",
                                            listing.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                            listing.status === 'REJECTED' ? 'bg-red-50 text-red-800 border-red-200' :
                                            'bg-amber-50 text-amber-800 border-amber-200'
                                          )}>
                                            {listing.status}
                                          </span>
                                        </td>
                                        <td className="p-2 text-right">
                                          <div className="flex gap-1.5 justify-end">
                                            {listing.status !== 'APPROVED' && (
                                              <button
                                                onClick={async () => {
                                                  try {
                                                    const res = await fetch('/api/listings/verify', {
                                                      method: 'POST',
                                                      headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${adminToken}`
                                                      },
                                                      body: JSON.stringify({ listingId: listing.id, action: 'approve' })
                                                    });
                                                    if (res.ok) fetchAdminData();
                                                  } catch (err) { alert('Action failed'); }
                                                }}
                                                className="px-1.5 py-0.5 bg-emerald-105 hover:bg-emerald-200 text-emerald-800 rounded font-bold text-[8px] uppercase cursor-pointer"
                                              >
                                                Approve
                                              </button>
                                            )}
                                            {listing.status !== 'REJECTED' && (
                                              <button
                                                onClick={async () => {
                                                  try {
                                                    const res = await fetch('/api/listings/verify', {
                                                      method: 'POST',
                                                      headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${adminToken}`
                                                      },
                                                      body: JSON.stringify({ listingId: listing.id, action: 'reject' })
                                                    });
                                                    if (res.ok) fetchAdminData();
                                                  } catch (err) { alert('Action failed'); }
                                                }}
                                                className="px-1.5 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-850 rounded font-bold text-[8px] uppercase cursor-pointer"
                                              >
                                                Reject/Hold
                                              </button>
                                            )}
                                            <button
                                              onClick={async () => {
                                                const check = confirm(`Delete listing "${listing.businessName}" permanently?`);
                                                if (check) {
                                                  try {
                                                    const res = await fetch('/api/listings/verify', {
                                                      method: 'POST',
                                                      headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': `Bearer ${adminToken}`
                                                      },
                                                      body: JSON.stringify({ listingId: listing.id, action: 'delete' })
                                                    });
                                                    if (res.ok) fetchAdminData();
                                                  } catch (err) { alert('Action failed'); }
                                                }
                                              }}
                                              className="px-1.5 py-0.5 bg-red-100 hover:bg-red-200 text-red-700 rounded font-bold text-[8px] uppercase cursor-pointer"
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                            {/* Mobile Listings Card Feed */}
                            <div className="lg:hidden divide-y divide-slate-100">
                               {adminListings.map((listing) => (
                                 <div key={listing.id} className="p-4 space-y-2 bg-white">
                                    <div className="flex justify-between items-start">
                                       <div className="font-black text-[11px] text-slate-900 uppercase truncate max-w-[180px]">{listing.businessName}</div>
                                       <span className={cn(
                                          "px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase border",
                                          listing.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                                       )}>{listing.status}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono">
                                       {listing.category} | {listing.city}
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                       {listing.status !== 'APPROVED' && (
                                          <button onClick={() => fetch('/api/listings/verify', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }, body: JSON.stringify({ listingId: listing.id, action: 'approve' }) }).then(r => { if(r.ok) fetchAdminData(); })} className="flex-1 py-1 px-2 bg-emerald-50 text-emerald-800 rounded text-[9px] font-bold uppercase">Approve</button>
                                       )}
                                       <button onClick={() => { if(confirm(`Delete ${listing.businessName}?`)) { fetch('/api/listings/verify', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }, body: JSON.stringify({ listingId: listing.id, action: 'delete' }) }).then(r => { if(r.ok) fetchAdminData(); }); } }} className="flex-1 py-1 px-2 bg-red-50 text-red-600 rounded text-[9px] font-bold uppercase">Delete</button>
                                    </div>
                                 </div>
                               ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          {adminActiveSubTab === 'feed' && userRole === 'ADMIN' && (
                    <div className="space-y-6" id="admin-feed-manager-tab-panel">
                       <div className="bg-white border text-center border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                          <h1 className="text-2xl font-black text-slate-900 mb-2">Authoritative Feed Moderator</h1>
                          <p className="text-sm text-slate-500">Delete inappropriate posts or sponsor them to the top of the feed.</p>
                       </div>
                       
                       <div className="border border-slate-150 rounded-2xl bg-white shadow-sm overflow-hidden" id="admin-feed-manager-table-wrapper">
                         <div className="hidden lg:block overflow-x-auto">
                           <table className="w-full text-left border-collapse text-xs">
                             <thead>
                               <tr className="bg-slate-50 text-slate-600 border-b border-slate-150 font-mono text-[10px] uppercase">
                                 <th className="p-3">Business</th>
                                 <th className="p-3">Caption</th>
                                 <th className="p-3">Date</th>
                                 <th className="p-3 text-right">Actions</th>
                               </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                               {feedPosts.length === 0 ? (
                                 <tr><td colSpan={4} className="p-8 text-center text-slate-400">No posts in feed database.</td></tr>
                               ) : (
                                 feedPosts.map(post => (
                                   <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                                     <td className="p-3">
                                       <div className="font-bold text-slate-900">{formatDisplayName(post.businessName)}</div>
                                       <div className="text-[10px] text-slate-400 uppercase font-bold">{post.tier} Account</div>
                                     </td>
                                     <td className="p-3 max-w-xs truncate text-slate-600 font-medium">{post.caption}</td>
                                     <td className="p-3 text-slate-400 font-mono text-[10px] uppercase">{new Date(post.createdAt).toLocaleDateString()}</td>
                                     <td className="p-3 text-right space-x-3">
                                       <button onClick={() => {
                                         fetch('/api/feed', { 
                                           method: 'POST', 
                                           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }, 
                                           body: JSON.stringify({ action: 'pin', id: post.id, isPinned: !post.isPinned }) 
                                         })
                                         .then(res => res.json())
                                         .then(data => { if(data.success) fetchFeedPosts(); else alert('Operation failed'); });
                                       }} className={cn(
                                         "font-bold cursor-pointer transition-colors",
                                         post.isPinned ? "text-emerald-600 hover:text-emerald-800" : "text-slate-400 hover:text-slate-600"
                                       )}>
                                         {post.isPinned ? '★ Sponsoring' : '☆ Sponsor'}
                                       </button>
                                       <button onClick={() => {
                                         if(confirm('Delete this post?')) {
                                           fetch('/api/feed', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }, body: JSON.stringify({ id: post.id }) })
                                           .then(res => res.json())
                                           .then(data => { if(data.success) fetchFeedPosts(); else alert(data.error); });
                                         }
                                       }} className="text-red-500 hover:text-red-700 font-bold cursor-pointer text-[10px] uppercase">Delete</button>
                                     </td>
                                   </tr>
                                 ))
                               )}
                             </tbody>
                           </table>
                         </div>
                         {/* Mobile Feed Admin Cards */}
                         <div className="lg:hidden divide-y divide-slate-100">
                           {feedPosts.length === 0 ? (
                             <div className="p-8 text-center text-slate-400 text-xs italic">No feed content discovered in active buffers.</div>
                           ) : (
                             feedPosts.map(post => (
                               <div key={post.id} className="p-4 space-y-2 bg-white">
                                  <div className="flex justify-between items-start">
                                     <div className="font-bold text-slate-900 text-xs truncate max-w-[200px]">{formatDisplayName(post.businessName)}</div>
                                     <div className="text-[9px] text-slate-400 font-mono italic">{new Date(post.createdAt).toLocaleDateString()}</div>
                                  </div>
                                  <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50/50 p-2 rounded border border-slate-100 italic text-[11px]">&quot;{post.caption}&quot;</div>
                                  <div className="flex justify-end gap-3 pt-1">
                                     <button onClick={() => {
                                        fetch('/api/feed', { 
                                          method: 'POST', 
                                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }, 
                                          body: JSON.stringify({ action: 'pin', id: post.id, isPinned: !post.isPinned }) 
                                        })
                                        .then(res => res.json())
                                        .then(data => { if(data.success) fetchFeedPosts(); else alert('Operation failed'); });
                                     }} className={cn("text-[9.5px] font-black py-1 px-3 rounded uppercase border leading-none transition-all", post.isPinned ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200")}>{post.isPinned ? '★ Sponsoring' : '☆ Sponsor'}</button>
                                     <button onClick={() => { if(confirm(`Delete post?`)) fetch('/api/feed', { method: 'DELETE', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` }, body: JSON.stringify({ id: post.id }) }).then(r => { if(r.ok) fetchFeedPosts(); }); }} className="text-red-600 font-bold text-[9.5px] uppercase border border-red-100 px-3 py-1 bg-red-50 rounded leading-none transition-all">Delete</button>
                                  </div>
                               </div>
                             ))
                           )}
                         </div>
                       </div>
                    </div>
                  )}

                  {adminActiveSubTab === 'moderation' && userRole === 'ADMIN' && (
                    <div className="space-y-6" id="admin-moderation-tab-panel">
                       <div className="bg-white border text-center border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                          <h1 className="text-2xl font-black text-slate-900 mb-2">Automated &quot;Bad Actor&quot; Watchtower</h1>
                          <p className="text-sm text-slate-500">Live logs of blocked submissions and suspected bot activity.</p>
                       </div>

                       <div className="border rounded-2xl bg-white shadow-sm overflow-hidden" id="admin-moderation-table-container">
                         <div className="hidden sm:block overflow-x-auto">
                           <table className="w-full text-left border-collapse text-xs">
                             <thead>
                               <tr className="bg-slate-50 text-slate-600 border-b border-slate-150 font-mono text-[10px] uppercase">
                                 <th className="p-3">Time</th>
                                 <th className="p-3">Type</th>
                                 <th className="p-3">Pattern / Content</th>
                                 <th className="p-3">Reason</th>
                                 <th className="p-3">Actor Info</th>
                               </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                               {moderationLoading ? (
                                 <tr><td colSpan={5} className="p-8 text-center text-slate-400">Scanning logs...</td></tr>
                               ) : moderationLogs.length === 0 ? (
                                 <tr><td colSpan={5} className="p-8 text-center text-slate-400">No security incidents detected. The wall stands.</td></tr>
                               ) : (
                                 moderationLogs.map(log => (
                                   <tr key={log.id} className="hover:bg-red-50/30 transition-colors">
                                     <td className="p-3 text-slate-400 font-mono text-[10px] whitespace-nowrap uppercase">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                     <td className="p-3">
                                        <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 font-bold uppercase text-[9px]">
                                          {log.type}
                                        </span>
                                     </td>
                                     <td className="p-3 max-w-[200px] truncate font-mono text-slate-600" title={log.content}>{log.content}</td>
                                     <td className="p-3 text-red-600 font-bold">{log.reason}</td>
                                     <td className="p-3 leading-tight min-w-[120px]">
                                        <div className="text-slate-900 font-bold">{log.ip}</div>
                                        <div className="text-[10px] text-slate-400 truncate">User: {log.userId}</div>
                                     </td>
                                   </tr>
                                 ))
                               )}
                             </tbody>
                           </table>
                         </div>

                         {/* Mobile Card Layout for Logs */}
                         <div className="sm:hidden divide-y divide-slate-100">
                           {moderationLoading ? (
                              <div className="p-8 text-center text-slate-400 text-xs">Scanning logs...</div>
                           ) : moderationLogs.length === 0 ? (
                              <div className="p-8 text-center text-slate-400 text-xs">No incidents.</div>
                           ) : (
                              moderationLogs.map(log => (
                                <div key={log.id} className="p-4 space-y-2">
                                   <div className="flex justify-between items-center">
                                      <span className="text-[9px] font-mono text-slate-400 uppercase">{new Date(log.timestamp).toLocaleString()}</span>
                                      <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 font-bold uppercase text-[8px]">
                                        {log.type}
                                      </span>
                                   </div>
                                   <div className="text-xs font-bold text-red-600">{log.reason}</div>
                                   <div className="text-[11px] font-mono bg-slate-50 p-2 rounded-lg text-slate-600 line-clamp-2">{log.content}</div>
                                   <div className="flex items-center justify-between text-[10px] text-slate-400">
                                      <span>IP: {log.ip}</span>
                                      <span>ID: {log.userId}</span>
                                   </div>
                                </div>
                              ))
                           )}
                         </div>
                       </div>
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
                              <label className="font-bold text-slate-700 flex items-center justify-between">
                                <span>Custom Listing Image</span>
                                {(userRole === 'ADMIN' || (editingListing && 'verified' in editingListing && editingListing.verified)) ? (
                                  <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded font-mono">Premium Active</span>
                                ) : (
                                  <span className="text-[9px] text-slate-400 font-bold bg-slate-100 px-1 py-0.5 rounded font-mono">🔒 Locked</span>
                                )}
                              </label>

                              {(userRole === 'ADMIN' || (editingListing && 'verified' in editingListing && editingListing.verified)) ? (
                                <div className="space-y-2 mt-1" id="edit-img-unlocked">
                                  <div
                                    id="dropzone-edit-image"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                      e.preventDefault();
                                      const file = e.dataTransfer.files?.[0];
                                      if (file && file.type.startsWith('image/')) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                          if (typeof reader.result === 'string') {
                                            setEditImage(reader.result);
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    className="border border-dashed border-slate-300 hover:border-emerald-500 bg-white rounded-lg p-3 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-1"
                                  >
                                    {editImage ? (
                                      <div className="w-full flex flex-col items-center space-y-1">
                                        <img src={editImage} alt="Edit preview" className="h-14 w-auto rounded shadow-sm object-contain" />
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditImage('');
                                          }}
                                          className="text-[9px] text-red-600 underline font-mono"
                                        >
                                          Revoke
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <Plus className="w-4 h-4 text-slate-400" id="plus-icn" />
                                        <span className="text-[10px] text-slate-600 font-medium">Drag-and-Drop or click browse</span>
                                      </>
                                    )}
                                  </div>

                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                          if (typeof reader.result === 'string') {
                                            setEditImage(reader.result);
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    className="text-[9px] text-slate-505 block"
                                  />

                                  <input
                                    type="text"
                                    placeholder="Or paste direct image URL"
                                    value={editImage.startsWith('data:') ? '' : editImage}
                                    onChange={(e) => setEditImage(e.target.value)}
                                    className="w-full bg-slate-50 border rounded-lg px-2 py-1 text-[10px] focus:bg-white outline-none"
                                  />
                                </div>
                              ) : (
                                <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-[10px] flex flex-col items-center justify-center text-center space-y-1" id="edit-img-locked">
                                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                                  <span className="font-bold text-slate-600">Locked for Standard Listings</span>
                                  <p className="text-[9px] text-slate-404 leading-tight">
                                    Brand photos and logos require a Verified Premium Spotlight subscription tier. Contact system support or buy premium slots to upgrade!
                                  </p>
                                </div>
                              )}
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

                          <div className="space-y-1 p-3 bg-slate-50 border rounded-xl" id="edit-listing-expires-wrap">
                            <label className="font-bold text-slate-700 text-xs flex items-center justify-between">
                              Time Limit / Expiration (For Unverified or Temporary Listings)
                            </label>
                            <input
                              type="datetime-local"
                              value={editExpiresAt ? new Date(editExpiresAt).toISOString().slice(0,16) : ''}
                              onChange={(e) => setEditExpiresAt(e.target.value ? new Date(e.target.value).toISOString() : '')}
                              className="w-full bg-white border border-slate-205 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                            />
                            <p className="text-[10px] text-slate-500 font-mono mt-1">Leave empty for NO TIME LIMIT. Listing will persist forever unless deleted manually.</p>
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

              {/* TOP CAUTION ALERT FOR UNVERIFIED ENTRY */}
              {!selectedListing.verified && (
                <div id="det-unverified-top-alert" className="bg-red-50 border-b border-red-200 p-4 text-xs text-red-800 flex items-start space-x-3">
                  <span className="relative flex h-2.5 w-2.5 mt-1 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                  </span>
                  <div className="space-y-1">
                    <span className="font-extrabold uppercase tracking-wider text-red-650 block text-[11px]">
                      ⚠️ Safety Indicator: Not Verified Account
                    </span>
                    <p className="text-red-705 leading-relaxed font-semibold">
                      This business listing is hosted under our open Free Index. BizSearch24 has <strong>not verified</strong> the registration, physical address, or licenses of this provider. <strong>Please proceed with precaution</strong> before booking services or making upfront payments.
                    </p>
                  </div>
                </div>
              )}

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
                <div className={cn(
                  "border rounded-2xl p-4 flex items-center space-x-3",
                  selectedListing.verified ? "bg-slate-50 border-slate-100" : "bg-red-50/40 border-red-100/60"
                )} id="det-geo-visual-card">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border",
                    selectedListing.verified ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100 animate-pulse"
                  )} id="det-geo-ico-bx">
                    {selectedListing.verified ? (
                      <ShieldCheck className="w-6 h-6 text-emerald-600" id="det-shield-chk-ico" />
                    ) : (
                      <AlertOctagon className="w-6 h-6 text-red-650" id="det-shield-warn-ico" />
                    )}
                  </div>
                  <div className="space-y-1 text-slate-700" id="det-geo-visual-text">
                    <span className={cn("block font-bold text-xs", selectedListing.verified ? "text-slate-800" : "text-red-700")} id="det-verification-indicator">
                      {selectedListing.verified ? "S.A. Directory Verified" : "NOT VERIFIED (Unregistered Free Tier)"}
                    </span>
                    <p className="text-[10.5px] text-slate-550 leading-relaxed font-mono" id="det-verification-date-lbl font">Listed on: {new Date(selectedListing.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* BOTTOM CAUTION ALERT FOR UNVERIFIED ENTRY */}
                {!selectedListing.verified && (
                  <div id="det-unverified-bottom-alert" className="bg-red-50 border border-red-200/50 rounded-2xl p-4 text-xs text-red-800 flex items-start space-x-3">
                    <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5 animate-bounce" id="det-bottom-alert-ico" />
                    <div className="space-y-1">
                      <span className="font-extrabold uppercase tracking-wide text-red-700 block text-[10.5px]">
                        ⚠️ SECURITY CAUTIONARY
                      </span>
                      <p className="text-red-750 leading-relaxed font-semibold">
                        Ensure you confirm physical trade certificates, draft signed legal agreements, or verify registration directly prior to commissioning jobs. BizSearch24 assumes zero liability for transactions with unverified free directory indexees.
                      </p>
                    </div>
                  </div>
                )}

                {/* Admin Direct Power Action Edit Button */}
                {isAdminLoggedIn && (
                  <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-2 justify-end" id="det-admin-edit-action-container">
                    {/* Approve/Verify Toggle */}
                    <button
                      type="button"
                      onClick={() => handleVerifyBusiness(selectedListing.id, selectedListing.verified)}
                      className={cn(
                        "px-3 py-2 font-bold rounded-xl text-xs flex items-center space-x-1 border shadow-xs transition-all cursor-pointer",
                        selectedListing.verified 
                          ? "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200" 
                          : "bg-emerald-600 text-white border-transparent hover:bg-emerald-700"
                      )}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{selectedListing.verified ? 'Revoke Verification' : 'Verify & Approve'}</span>
                    </button>

                    {/* Edit Option */}
                    <button
                      type="button"
                      onClick={() => {
                        const listingToEdit = { ...selectedListing };
                        setSelectedListing(null);
                        startEditListing(listingToEdit);
                      }}
                      className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1 shadow-xs transition-all cursor-pointer border border-transparent"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>

                    {/* Delete Option */}
                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm(`Are you absolutely sure you want to permanently delete "${selectedListing.name}"?`)) {
                          await handleDeleteBusiness(selectedListing.id);
                          setSelectedListing(null);
                        }
                      }}
                      className="px-3 py-2 bg-red-105 hover:bg-red-200 text-red-800 font-bold rounded-xl text-xs flex items-center space-x-1 shadow-xs transition-all cursor-pointer border border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Listing</span>
                    </button>

                    {/* Ban User Option */}
                    {selectedListing.userId && selectedListing.userId !== 'admin_placeholder' && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`Do you want to BAN the owner of this listing permanently? This will ban their account and restrict their access.`)) {
                            try {
                              const res = await fetch(`/api/user/admin`, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': `Bearer ${adminToken}`
                                },
                                body: JSON.stringify({ id: selectedListing.userId, isBanned: true })
                              });
                              const data = await res.json();
                              if (data.success) {
                                alert('User has been banned.');
                                fetchAdminData();
                              } else {
                                alert(data.message || 'Error banning user account.');
                              }
                            } catch (e) {
                              alert('Connectivity error banning user.');
                            }
                          }
                        }}
                        className="px-3 py-2 bg-slate-950 hover:bg-red-950 hover:text-red-350 text-white font-bold rounded-xl text-xs flex items-center space-x-1 shadow-xs transition-all cursor-pointer border border-slate-700"
                      >
                        <X className="w-4 h-4" />
                        <span>Ban User</span>
                      </button>
                    )}
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
                <span className="text-xl font-bold tracking-tight text-white block leading-tight whitespace-nowrap" id="footer-logo-title">
                  <span className="text-white font-black text-2xl inline-block mr-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_-1.5px_-1.5px_0_#10b981,_1.5px_-1.5px_0_#10b981,_-1.5px_1.5px_0_#10b981,_1.5px_1.5px_0_#10b981,_0px_-1.5px_0_#10b981,_0px_1.5px_0_#10b981,_-1.5px_0px_0_#10b981,_1.5px_0px_0_#10b981]">B</span>iz<span className="text-emerald-500 font-black text-2xl inline-block mx-px drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] [text-shadow:_-1.5px_-1.5px_0_#000,_1.5px_-1.5px_0_#000,_-1.5px_1.5px_0_#000,_1.5px_1.5px_0_#000,_0px_-1.5px_0_#000,_0px_1.5px_0_#000,_-1.5px_0px_0_#000,_1.5px_0px_0_#000]">S</span>earch24
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
              <li><button onClick={() => { setActiveTab('feed'); setViewingPage(null); setActivePageSlug(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-white transition-colors cursor-pointer">Ad Posts Feed</button></li>
               <li><button onClick={handleCreateAdClick} className="text-left hover:text-white transition-colors cursor-pointer">Create ad</button></li>
              <li><button onClick={() => { setActiveTab('services'); setViewingPage(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-white transition-colors cursor-pointer">BizSearch24 Services</button></li>
              <li><button onClick={() => { setActiveTab('pages'); if (seoPages.length > 0 && !viewingPage) handlePageSelect(seoPages[0].slug); else window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-left hover:text-white transition-colors cursor-pointer">SEO Local Guides</button></li>
              <li className="pt-0.5"><Link href="/news" className="text-left hover:text-emerald-400 text-emerald-500 font-bold block transition-colors">SA News Feed</Link></li>
              <li><Link href="/sitemap" className="text-left hover:text-white transition-colors block">Visual Sitemap</Link></li>
            </ul>
          </div>

          <div className="space-y-3 md:col-span-1 text-xs" id="footer-admin-col">
            <span className="text-white font-semibold block" id="footer-admin-lbl">Secure Access Portal</span>
            <p className="text-[11px] leading-relaxed text-slate-500 font-medium" id="footer-admin-desc">
              All logins are secure. New business registrations are checked and approved before going live.
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
                <span>Login or Sign Up Registration</span>
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

      {/* UPGRADE & GET VERIFIED PAYMENT PROMPT FOR FREE TIER REGISTRANTS */}
      <AnimatePresence>
        {showUpgradePrompt && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[99999] flex items-center justify-center p-4 overflow-y-auto" id="upgrade-prompt-overlay">
            <motion.div
              id="upgrade-prompt-modal"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border text-left rounded-3xl overflow-hidden max-w-lg w-full p-6 shadow-2xl relative space-y-5"
            >
              <div className="flex items-start justify-between border-b pb-3" id="pro-header">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-red-50 border border-red-100 rounded-xl text-red-650 shrink-0 animate-pulse">
                    <ShieldAlert className="w-5 h-5 text-red-650" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 leading-tight">⚠️ Unverified Ad Alert</h3>
                    <p className="text-[10px] text-slate-500 font-mono">STAND-BY FREE SUBMISSION WARNING</p>
                  </div>
                </div>
                <button
                  id="upgrade-modal-x"
                  onClick={() => setShowUpgradePrompt(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-slate-705" id="pro-body">
                <p className="leading-relaxed">
                  You are registered under the <strong className="text-slate-900 font-extrabold">Standard Free Listing tier</strong>. Unverified accounts do not undergo business validation and are subject to visual cautionary alerts:
                </p>

                <div className="bg-red-50/70 border border-red-105 rounded-2xl p-3.5 space-y-2.5 text-[11px]" id="pro-warns">
                  <div className="flex items-start space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 mt-1.5 shrink-0 animate-ping" />
                    <p className="text-red-800 leading-normal">
                      <strong>Red Blinking Badge</strong>: Your listing cards will highlight with a highly visible red flashing <strong className="underline font-bold">Not Verified</strong> beacon on all searches.
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                    <p className="text-red-850 leading-normal">
                      <strong>Client Safety Banners</strong>: Absolute caution warnings will display at BOTH the top and bottom of your business micro-page advising public consumers to proceed with caution.
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 mt-1.5 shrink-0" />
                    <p className="text-red-900 leading-normal">
                      <strong>Media Upload Restrictions</strong>: Critical visual trust assets like portfolio images, company logos, gallery uploads, and direct hotline integrations are restricted.
                    </p>
                  </div>
                </div>

                <p className="leading-relaxed font-bold text-slate-800 text-[11.5px]">
                  Establish direct marketplace authority in South Africa by instantly upgrading to verified status.
                </p>
              </div>

              {/* TWO CORE OPTIONS */}
              <div className="flex flex-col space-y-2.5 pt-2" id="pro-options">
                {/* UPGRADE STATUS AND PAY CHOOSE */}
                <button
                  id="pro-choose-upgrade-pay"
                  type="button"
                  onClick={() => {
                    setSubTier('premium');
                    setShowUpgradePrompt(false);
                    alert("💎 Premium Verified Status Activated! Image upload has unlocked. Please choose your image asset and click 'Register Business Listing' to complete verified checkout.");
                  }}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-99 text-white font-extrabold text-xs rounded-xl flex items-center justify-between shadow-lg shadow-emerald-600/10 cursor-pointer transition-all border border-emerald-550"
                >
                  <div className="flex items-center space-x-2 text-left">
                    <span className="p-1 rounded bg-white/20 text-white shrink-0">
                      <Sparkles className="w-4 h-4 text-emerald-100" />
                    </span>
                    <div>
                      <span className="block font-bold">✨ UPGRADE & GET CO-VERIFIED</span>
                      <span className="text-[10px] text-emerald-100 block mt-0.5 font-normal">Instant Premium verification badge, logos & direct index exposure</span>
                    </div>
                  </div>
                  <span className="bg-emerald-700 text-white px-2.5 py-1 rounded font-mono font-black text-[10.5px] uppercase shrink-0">R199/pm</span>
                </button>

                {/* SLIDE UNDER FOR PROCEED AS FREE STANDARD */}
                <button
                  id="pro-choose-proceed-unverified"
                  type="button"
                  onClick={handleConfirmFreeSubmit}
                  className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-250 text-slate-700 hover:text-slate-900 font-bold text-[11px] rounded-xl flex items-center justify-center space-x-1 border border-slate-200 transition-all cursor-pointer text-center"
                >
                  <span>⚠️ Continue with unverified FREE Ad (I understand the safety badges)</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
