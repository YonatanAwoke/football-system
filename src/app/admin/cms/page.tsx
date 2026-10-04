"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Globe, Save, CheckCircle2, Image as ImageIcon, Video, Plus, Trash2, Edit3, 
  Megaphone, Sparkles, Eye, Play, LayoutGrid, ExternalLink, X, Layers, Tv, Upload, AlertCircle
} from 'lucide-react';
import { CMSContent, PromoBanner, GalleryAlbum, GalleryMediaItem } from '@/lib/types';
import { useLanguage } from '@/context/LanguageContext';

function CMSContentManager() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();

  // Active Main Section: 'promos' (Section 1: Banners & Posting) or 'gallery' (Section 2: Photos & Videos)
  const initialTab = searchParams.get('tab') === 'gallery' ? 'gallery' : 'promos';
  const [activeTab, setActiveTab] = useState<'promos' | 'gallery'>(initialTab);

  const [cms, setCms] = useState<CMSContent | null>(null);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [saved, setSaved] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // SECTION 1 STATES: 3 Promotional Banners
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([
    {
      id: 'PROMO-1',
      slotNumber: 1,
      title: '2026/27 Youth Academy Enrollment & Registration',
      tagline: 'Professional coaching, character development & competitive league play for U8 - U18 squads in Addis Ababa.',
      buttonText: 'REGISTER ONLINE NOW',
      linkUrl: '/register',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=80',
      badge: 'ACTIVE ENROLLMENT',
      active: true
    },
    {
      id: 'PROMO-2',
      slotNumber: 2,
      title: 'Sub-City Youth Cup Matchday & Tournament Finals',
      tagline: 'Bulbula Amen F.C. U15 Cadets vs Bole Youth Academy live this Saturday at Addis Ababa Stadium Sub-Pitch.',
      buttonText: 'VIEW FIXTURES & SQUAD',
      linkUrl: '/admin/teams',
      imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&auto=format&fit=crop&q=80',
      badge: 'TOURNAMENT FEATURE',
      active: true
    },
    {
      id: 'PROMO-3',
      slotNumber: 3,
      title: 'Community & Veteran Fitness Program Spotlight',
      tagline: 'Join adult weekend morning training sessions, physical conditioning, and recreational matches.',
      buttonText: 'EXPLORE PROGRAM',
      linkUrl: '/admin/players?teamId=TEAM-HEALTH',
      imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
      badge: 'COMMUNITY HEALTH',
      active: true
    }
  ]);

  // Section 1: New Announcement Form State
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  // SECTION 2 STATES: Photo & Video Upload Form
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCategory, setMediaCategory] = useState('Training');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');

  // Media Filter in Section 2
  const [mediaFilter, setMediaFilter] = useState<'ALL' | 'photo' | 'video'>('ALL');
  const [previewMedia, setPreviewMedia] = useState<(GalleryMediaItem & { category?: string }) | null>(null);

  useEffect(() => {
    // Fetch CMS and Gallery data
    Promise.all([
      fetch('/api/cms').then(r => r.json()),
      fetch('/api/gallery').then(r => r.json())
    ]).then(([cmsRes, galleryRes]) => {
      if (cmsRes.success && cmsRes.data) {
        setCms(cmsRes.data);
        if (cmsRes.data.promoBanners && cmsRes.data.promoBanners.length >= 3) {
          setPromoBanners(cmsRes.data.promoBanners);
        }
      }
      if (galleryRes.success && galleryRes.data) {
        setAlbums(galleryRes.data);
      }
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Update Promotional Banner Slot
  const handleUpdateBanner = (slotNum: 1 | 2 | 3, field: keyof PromoBanner, val: any) => {
    setPromoBanners(prev => 
      prev.map(b => b.slotNumber === slotNum ? { ...b, [field]: val } : b)
    );
  };

  // Save Section 1 Promotional Banners
  const handleSaveCMSBanners = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cms) return;
    try {
      const updatedCMS: CMSContent = {
        ...cms,
        promoBanners
      };
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCMS)
      }).then(r => r.json());

      if (res.success) {
        setCms(res.data);
        showToast("✅ Website Promotional Banners updated successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add New Announcement Post (Section 1)
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !cms) return;

    const newAnn = {
      id: `ANN-${Date.now()}`,
      title: newPostTitle,
      content: newPostContent,
      date: new Date().toISOString().split('T')[0],
      active: true
    };

    const updatedCMS: CMSContent = {
      ...cms,
      announcements: [newAnn, ...cms.announcements]
    };

    try {
      const res = await fetch('/api/cms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCMS)
      }).then(r => r.json());

      if (res.success) {
        setCms(res.data);
        setNewPostTitle('');
        setNewPostContent('');
        showToast("📢 New website promotional post published!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Section 2: Upload Photo / Video to Website Gallery
  const handleUploadMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetUrl = mediaUrl.trim() || (
      mediaType === 'video' 
        ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' 
        : 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80'
    );

    const newMediaItem: GalleryMediaItem = {
      id: `MED-${Date.now()}`,
      type: mediaType,
      url: targetUrl,
      caption: mediaCaption || mediaTitle || 'Website Gallery Media',
      uploadedAt: new Date().toISOString()
    };

    try {
      // Post to Gallery API as a new or updated album
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: mediaTitle || `${mediaCategory} Media Item`,
          category: mediaCategory,
          description: mediaCaption,
          coverUrl: targetUrl,
          items: [newMediaItem]
        })
      }).then(r => r.json());

      if (res.success) {
        setAlbums([res.data, ...albums]);
        setMediaTitle('');
        setMediaUrl('');
        setMediaCaption('');
        showToast(`🎉 ${mediaType === 'video' ? 'Video' : 'Photo'} uploaded to Website Gallery successfully!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Extract all media items across albums
  const allMediaItems: Array<GalleryMediaItem & { albumTitle: string; category: string }> = albums.flatMap(alb => 
    (alb.items || []).map(item => ({
      ...item,
      albumTitle: alb.title,
      category: alb.category
    }))
  );

  const filteredMedia = allMediaItems.filter(item => {
    if (mediaFilter !== 'ALL' && item.type !== mediaFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Main Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase text-brand-orange tracking-wider block">
            Website Content & Media Management
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-0.5">Content Management System (CMS)</h1>
          <p className="text-slate-500 text-xs mt-1">
            Manage public website promotional banners, announcements, photo galleries, and video highlights.
          </p>
        </div>

        {/* Section Tabs: Section 1 (Promotional Banners & Posts) vs Section 2 (Media Gallery Uploads) */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('promos')}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'promos'
                ? "bg-brand-orange text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            1. Promotional Banners & Posts
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'gallery'
                ? "bg-brand-orange text-white shadow-md"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            2. Photos & Videos Gallery
            <span className="px-1.5 py-0.5 bg-brand-orange text-white font-black rounded-full text-[10px]">
              {allMediaItems.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: PROMOTIONAL BANNERS & WEBSITE POSTS */}
      {/* ========================================================================= */}
      {activeTab === 'promos' && (
        <div className="space-y-8">
          <div className="bg-white text-slate-900 p-6 rounded-3xl border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-orange" />
                <h2 className="text-lg font-black text-slate-900">Section 1: 3 Promotional Website Banner Slots</h2>
              </div>
              <span className="text-xs font-mono text-brand-orange">Website Banner Configuration</span>
            </div>
            <p className="text-xs text-slate-600">
              Configure 3 promotional banner placements on the website. Each slot displays unique campaigns, images, call-to-actions, and registration links.
            </p>

            <form onSubmit={handleSaveCMSBanners} className="space-y-6 pt-2">
              <div className="grid md:grid-cols-3 gap-6">
                {promoBanners.map(banner => (
                  <div key={banner.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <span className="px-2.5 py-0.5 rounded bg-brand-orange/10 text-brand-orange font-mono text-[10px] font-black uppercase">
                          {banner.badge || `SLOT #${banner.slotNumber}`}
                        </span>
                        <label className="flex items-center gap-1.5 text-[11px] font-bold cursor-pointer text-slate-700">
                          <input 
                            type="checkbox"
                            checked={banner.active}
                            onChange={e => handleUpdateBanner(banner.slotNumber, 'active', e.target.checked)}
                            className="rounded border-slate-300 text-brand-orange focus:ring-brand-orange"
                          />
                          Active on Site
                        </label>
                      </div>

                      {/* Banner Image Preview */}
                      <div className="relative h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                        <img 
                          src={banner.imageUrl} 
                          alt={banner.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-slate-900/40 p-2 flex items-end">
                          <span className="text-[10px] font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-sm truncate">
                            {banner.buttonText}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="block text-slate-600 text-[10px] font-bold mb-1">Banner Slot #{banner.slotNumber} Title</label>
                          <input 
                            type="text" 
                            value={banner.title}
                            onChange={e => handleUpdateBanner(banner.slotNumber, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold text-xs focus:border-brand-orange focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-600 text-[10px] font-bold mb-1">Campaign Subtitle / Tagline</label>
                          <textarea 
                            rows={2}
                            value={banner.tagline}
                            onChange={e => handleUpdateBanner(banner.slotNumber, 'tagline', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] focus:border-brand-orange focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-slate-600 text-[10px] font-bold mb-1">Button CTA Text</label>
                            <input 
                              type="text" 
                              value={banner.buttonText}
                              onChange={e => handleUpdateBanner(banner.slotNumber, 'buttonText', e.target.value)}
                              className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-900 text-[11px]"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 text-[10px] font-bold mb-1">Target Link URL</label>
                            <input 
                              type="text" 
                              value={banner.linkUrl}
                              onChange={e => handleUpdateBanner(banner.slotNumber, 'linkUrl', e.target.value)}
                              className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-900 text-[11px] font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-600 text-[10px] font-bold mb-1">Poster Image URL</label>
                          <input 
                            type="text" 
                            value={banner.imageUrl}
                            onChange={e => handleUpdateBanner(banner.slotNumber, 'imageUrl', e.target.value)}
                            className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[10px] font-mono truncate"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-orange to-amber-500 text-white font-extrabold text-xs shadow-lg hover:shadow-brand-orange/30 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save 3 Promotional Banners to Website
                </button>
              </div>
            </form>
          </div>

          {/* Website Announcement Posting Form */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Megaphone className="w-5 h-5 text-brand-orange" />
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Publish Website Promotional Post / News</h3>
                <p className="text-xs text-slate-500">Add active promotional notices that appear on the website newsfeed.</p>
              </div>
            </div>

            <form onSubmit={handleAddPost} className="space-y-4 text-xs">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Post Title / Campaign Headline</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 2026 Season Academy Registration Discount"
                    value={newPostTitle}
                    onChange={e => setNewPostTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Post Content Details</label>
                  <input 
                    type="text" 
                    placeholder="Brief promotional description to showcase on public page..."
                    value={newPostContent}
                    onChange={e => setNewPostContent(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newPostTitle}
                  className="px-5 py-2.5 rounded-xl bg-brand-orange text-white font-extrabold text-xs hover:bg-brand-orange-dark shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Publish Post to Website Feed
                </button>
              </div>
            </form>

            {/* List of Active Website Announcements */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Website Posts ({cms?.announcements?.length || 0})</span>
              <div className="grid md:grid-cols-2 gap-3">
                {cms?.announcements?.map(ann => (
                  <div key={ann.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{ann.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">{ann.date}</span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{ann.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: UPLOAD PHOTOS & VIDEOS (WEBSITE GALLERY) */}
      {/* ========================================================================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-8">
          {/* Media Upload Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-lg text-slate-900">Section 2: Upload Photos & Videos to Website Gallery</h2>
                  <p className="text-xs text-slate-500">Upload media items that will be displayed in the public gallery section.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUploadMedia} className="space-y-4 text-xs">
              {/* Media Type Selector: Photo vs Video */}
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 w-fit">
                <button
                  type="button"
                  onClick={() => setMediaType('photo')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                    mediaType === 'photo' ? "bg-brand-orange text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" /> Upload Photo
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                    mediaType === 'video' ? "bg-brand-orange text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Video className="w-4 h-4" /> Upload Video Highlight
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Media Title / Album</label>
                  <input 
                    type="text"
                    required
                    placeholder={mediaType === 'video' ? 'e.g. U13 Championship Final Match Highlights' : 'e.g. Grassroots Tactical Training Drill'}
                    value={mediaTitle}
                    onChange={e => setMediaTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={mediaCategory}
                    onChange={e => setMediaCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:border-brand-orange focus:outline-none"
                  >
                    <option value="Training">Training & Drills</option>
                    <option value="Matches">Match Highlights</option>
                    <option value="Tournaments">Tournament Finals</option>
                    <option value="Ceremonies">Trophy Ceremonies</option>
                    <option value="Community">Community Events</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {mediaType === 'video' ? 'Video Embed URL / Link' : 'Photo Image URL / Link'}
                  </label>
                  <input 
                    type="text"
                    placeholder={mediaType === 'video' ? 'https://www.youtube.com/embed/...' : 'https://images.unsplash.com/...'}
                    value={mediaUrl}
                    onChange={e => setMediaUrl(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Media Caption & Description</label>
                <input 
                  type="text"
                  placeholder="Describe the photo or video action to show under website gallery item..."
                  value={mediaCaption}
                  onChange={e => setMediaCaption(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-brand-orange focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" /> Upload {mediaType === 'video' ? 'Video' : 'Photo'} to Gallery Section
                </button>
              </div>
            </form>
          </div>

          {/* Website Gallery Explorer Grid */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Website Gallery Collection</h3>
                <p className="text-xs text-slate-500">Live preview of photo albums and video highlights published to the website.</p>
              </div>

              {/* Media Type Filters */}
              <div className="flex items-center gap-2">
                {[
                  { key: 'ALL', label: `All Media (${allMediaItems.length})` },
                  { key: 'photo', label: `📷 Photos (${allMediaItems.filter(m => m.type === 'photo').length})` },
                  { key: 'video', label: `🎥 Videos (${allMediaItems.filter(m => m.type === 'video').length})` },
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setMediaFilter(f.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      mediaFilter === f.key ? "bg-brand-orange text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400">
                  No photo or video media items found in this section.
                </div>
              ) : (
                filteredMedia.map((item, idx) => (
                  <div key={item.id || idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group space-y-2 p-3">
                    <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100">
                      {item.type === 'video' ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-900 relative">
                          {item.url.includes('images.unsplash') ? (
                            <img src={item.url} alt={item.caption} className="w-full h-full object-cover opacity-80" />
                          ) : null}
                          <div className="w-12 h-12 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </div>
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-black uppercase flex items-center gap-1">
                            <Video className="w-3.5 h-3.5" /> Video
                          </span>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <img src={item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm text-slate-900 border border-slate-200 text-[10px] font-black uppercase flex items-center gap-1">
                            <ImageIcon className="w-3.5 h-3.5 text-brand-orange" /> Photo
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[10px] font-extrabold text-brand-orange uppercase">
                        <span>{item.category}</span>
                        <span className="text-slate-500 font-mono">{new Date(item.uploadedAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{item.caption}</h4>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setPreviewMedia(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-brand-orange text-[10px] font-bold flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Preview
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Media Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black text-brand-orange uppercase">{previewMedia.category} &bull; {previewMedia.type}</span>
                <h3 className="font-extrabold text-base text-slate-900">{previewMedia.caption}</h3>
              </div>
              <button onClick={() => setPreviewMedia(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 rounded-2xl overflow-hidden min-h-[300px] flex items-center justify-center">
              {previewMedia.type === 'video' ? (
                <iframe 
                  src={previewMedia.url} 
                  title={previewMedia.caption} 
                  className="w-full h-80 rounded-2xl" 
                  allowFullScreen 
                />
              ) : (
                <img src={previewMedia.url} alt={previewMedia.caption} className="max-h-96 object-contain" />
              )}
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setPreviewMedia(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CMSPage() {
  return (
    <Suspense fallback={<div className="text-center text-slate-400 py-20">Loading CMS...</div>}>
      <CMSContentManager />
    </Suspense>
  );
}
