import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Sparkles, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MessageCircle, 
  Phone, 
  Maximize2, 
  ZoomIn, 
  ZoomOut,
  MapPin,
  LayoutGrid,
  Grid2X2
} from 'lucide-react';
import { 
  allGalleryPhotos, 
  allGalleryCategories, 
  GalleryPhotoItem, 
  GalleryPageCategoryId 
} from '../data/allGalleryPhotos';
import { businessInfo, getWhatsAppUrl, getPhoneUrl } from '../config/businessInfo';
import { BrandLogo } from './BrandLogo';

interface GalleryPageProps {
  onNavigateHome: () => void;
  onOpenQuote: (serviceTitle?: string) => void;
  initialCategory?: string;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onNavigateHome,
  onOpenQuote,
  initialCategory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryPageCategoryId>(() => {
    if (initialCategory && allGalleryCategories.some(c => c.id === initialCategory)) {
      return initialCategory as GalleryPageCategoryId;
    }
    return 'all';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [viewColumns, setViewColumns] = useState<'normal' | 'large'>('normal');

  // Sync category if initialCategory changes
  useEffect(() => {
    if (initialCategory && allGalleryCategories.some(c => c.id === initialCategory)) {
      setSelectedCategory(initialCategory as GalleryPageCategoryId);
    }
  }, [initialCategory]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Filter 156 archive photos based on category & search query
  const filteredPhotos = useMemo(() => {
    return allGalleryPhotos.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        item.title.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.woodType.toLowerCase().includes(q) ||
        item.room.toLowerCase().includes(q) ||
        item.specs.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : 0));
        setIsZoomed(false);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredPhotos.length - 1));
        setIsZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredPhotos.length]);

  // Prevent background scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [lightboxIndex]);

  const activeLightboxPhoto: GalleryPhotoItem | null =
    lightboxIndex !== null ? filteredPhotos[lightboxIndex] || null : null;

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev < filteredPhotos.length - 1 ? prev + 1 : 0));
    setIsZoomed(false);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : filteredPhotos.length - 1));
    setIsZoomed(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C110B] flex flex-col font-sans">
      
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8DECE] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Back to Home & Logo */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-[#8A532B] hover:text-[#5A3825] bg-[#FAF7F2] hover:bg-[#F3ECE4] border border-[#E8DECE] transition-all cursor-pointer shadow-2xs shrink-0"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </button>

            <div className="h-6 w-px bg-[#E8DECE] hidden sm:block shrink-0" />

            <div 
              onClick={onNavigateHome}
              className="hidden xs:flex items-center cursor-pointer group min-w-0"
              title="El Shaddai Interior Works Home"
            >
              <BrandLogo variant="horizontal" size="responsive" className="group-hover:scale-102 transition-transform" />
            </div>
          </div>

          {/* Quick Actions (Client-facing only) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <a
              href={getWhatsAppUrl("Hi El Shaddai Interior Works, I was browsing your gallery page and want to enquire about custom carpentry.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-colors shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => onOpenQuote()}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-[#2E1A11] hover:bg-[#432719] rounded-lg transition-all shadow-sm cursor-pointer whitespace-nowrap"
            >
              Get Quote
            </button>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        
        {/* Hero Title Section */}
        <section className="bg-gradient-to-b from-white to-[#FAF7F2] border-b border-[#E8DECE] py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8A532B]/10 text-[#8A532B] text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Complete Project Archive · Real Bengaluru Woodwork</span>
              </div>

              <h1 className="font-serif-wood text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C110B] leading-tight [text-wrap:balance]">
                Our Works Gallery
              </h1>

              <p className="mt-2.5 text-xs sm:text-sm text-[#554C43] leading-relaxed">
                Explore documented residential carpentry projects built and installed across Bengaluru by El Shaddai Interior Works. From solid teak entrance doors to modular kitchens, floor-to-ceiling wardrobes, and acoustic TV consoles.
              </p>

              {/* Live Search Bar & Column View Controls */}
              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A532B]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by woodwork type (e.g. Teak, Wardrobe, Kitchen, Door, Fluted, Marble)..."
                    className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#E8DECE] rounded-xl text-xs sm:text-sm text-[#1C110B] placeholder:text-[#8C827A] focus:outline-none focus:ring-2 focus:ring-[#8A532B]/30 focus:border-[#8A532B] shadow-2xs transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[#8C827A] hover:text-[#1C110B]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* View Column Controls: Symmetrical, responsive segmented control */}
                <div className="grid grid-cols-2 sm:flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8DECE] shadow-2xs shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setViewColumns('normal')}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex-1 sm:flex-none ${
                      viewColumns === 'normal'
                        ? 'bg-[#8A532B] text-white shadow-xs'
                        : 'text-[#554C43] hover:text-[#1C110B] hover:bg-white/80'
                    }`}
                    title="Grid View (Compact 4 Columns)"
                    aria-label="Grid View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Grid View</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewColumns('large')}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex-1 sm:flex-none ${
                      viewColumns === 'large'
                        ? 'bg-[#8A532B] text-white shadow-xs'
                        : 'text-[#554C43] hover:text-[#1C110B] hover:bg-white/80'
                    }`}
                    title="Large View (Spacious 3 Columns)"
                    aria-label="Large Cards View"
                  >
                    <Grid2X2 className="w-3.5 h-3.5" />
                    <span>Large Cards</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Categorical Filter Tabs Bar */}
        <section className="sticky top-16 sm:top-18 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DECE] py-3 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
              {allGalleryCategories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#8A532B] text-white shadow-xs'
                        : 'bg-white text-[#554C43] border border-[#E8DECE] hover:border-[#D4A373] hover:text-[#1C110B]'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {cat.id !== 'all' && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums ${
                        isSelected ? 'bg-white/20 text-white font-bold' : 'bg-[#FAF7F2] text-[#8A532B]'
                      }`}>
                        {cat.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 1. PHOTOS PREVIEW (Grid of Categorized Photos Displayed FIRST) */}
        {/* ========================================================================= */}
        <section id="photos-preview" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          
          {/* Active Filter Status & Count */}
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E8DECE]">
            <p className="text-xs sm:text-sm font-medium text-[#554C43]">
              {selectedCategory === 'all' && !searchQuery ? (
                <span>Showing authentic project photos</span>
              ) : (
                <>
                  Showing <span className="font-bold text-[#1C110B]">{filteredPhotos.length}</span> photos
                  {selectedCategory !== 'all' && (
                    <span className="text-[#8A532B] font-semibold"> in {allGalleryCategories.find(c => c.id === selectedCategory)?.label}</span>
                  )}
                  {searchQuery && (
                    <span className="text-[#8A532B]"> matching "{searchQuery}"</span>
                  )}
                </>
              )}
            </p>

            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-[#8A532B] hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>

          {filteredPhotos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#E8DECE] p-8 max-w-lg mx-auto shadow-2xs">
              <Search className="w-10 h-10 text-[#8C827A] mx-auto mb-3" />
              <h3 className="font-serif-wood text-xl font-bold text-[#1C110B]">No photos found</h3>
              <p className="text-sm text-[#554C43] mt-1">
                No photos matched "{searchQuery}". Try searching for teak, wardrobe, kitchen, doors, or fluted panels.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#8A532B] hover:bg-[#724422] cursor-pointer"
              >
                View All Photos
              </button>
            </div>
          ) : (
            <div className={`grid gap-3 sm:gap-4.5 ${
              viewColumns === 'normal' 
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {filteredPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative rounded-xl overflow-hidden border border-[#E8DECE] hover:border-[#D4A373] shadow-2xs hover:shadow-xl transition-all duration-300 cursor-pointer bg-[#FAF7F2] aspect-4/3"
                >
                  <img
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Top Category Badge - Cleanly anchored top-left */}
                  <div className="absolute top-2 left-2 z-10 pointer-events-none">
                    <span className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold tracking-wide bg-black/70 backdrop-blur-xs text-[#D4A373] border border-white/20 shadow-xs">
                      {photo.categoryLabel}
                    </span>
                  </div>

                  {/* Bottom Title Gradient - Responsive padding and truncation to eliminate overflow */}
                  <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/55 to-transparent pt-6 pb-2 px-2 sm:pb-3 sm:px-3 flex flex-col justify-end transition-all">
                    <h4 className="font-serif-wood text-[11px] sm:text-xs md:text-sm font-bold text-white line-clamp-1 sm:line-clamp-2 leading-tight drop-shadow-xs">
                      {photo.title}
                    </h4>
                    <p className="hidden sm:flex items-center gap-1 text-[10px] text-[#D4A373] mt-0.5 font-mono">
                      <Maximize2 className="w-3 h-3" />
                      <span>Click to view full photo</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </section>

        {/* ========================================================================= */}
        {/* CUSTOM WOODWORK BOTTOM CTA BANNER (Clean, focused design matching screenshot) */}
        {/* ========================================================================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20 mb-8 sm:mb-12">
          <div className="bg-[#24140D] rounded-3xl p-8 sm:p-12 lg:p-14 border border-[#3E2417] shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#D4A373] block mb-3">
                CUSTOM JOINERY &amp; INTERIOR CARPENTRY
              </span>

              <h2 className="font-serif-wood text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight [text-wrap:balance]">
                Want similar custom woodwork crafted for your home?
              </h2>

              <p className="mt-4 text-sm sm:text-base text-white/80 leading-relaxed max-w-2xl mb-8">
                Send us any photo from this gallery or your own floor plan. Master Sunil will personally provide material recommendations, timber species options, and an honest quote.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5">
                <button
                  type="button"
                  onClick={() => onOpenQuote()}
                  className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-[#D4A373] hover:bg-[#c49363] text-[#1C110B] transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98 text-center"
                >
                  Request a Free Quote
                </button>

                <a
                  href={getWhatsAppUrl("Hi El Shaddai Interior Works, I was browsing your works gallery and would like custom woodwork crafted for my home.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-[#25D366] hover:bg-[#20ba5a] text-white transition-all shadow-md hover:shadow-lg cursor-pointer active:scale-98"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href={getPhoneUrl()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-xs sm:text-sm text-white bg-white/5 hover:bg-white/10 border border-white/20 transition-all cursor-pointer active:scale-98"
                >
                  <Phone className="w-4 h-4 text-[#D4A373]" />
                  <span>Call Directly</span>
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Full-Screen Interactive Lightbox */}
      {activeLightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-fadeIn"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Lightbox Top Bar */}
          <div
            className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-black/40 text-white z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span className="text-[11px] font-mono text-[#D4A373] uppercase tracking-wider block">
                Photo {lightboxIndex! + 1} of {filteredPhotos.length} · {activeLightboxPhoto.categoryLabel}
              </span>
              <h2 className="font-serif-wood text-sm sm:text-base font-bold text-white line-clamp-1 mt-0.5">
                {activeLightboxPhoto.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsZoomed((prev) => !prev)}
                className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title={isZoomed ? "Zoom Out" : "Zoom In"}
              >
                {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Stage */}
          <div
            className="flex-1 relative flex items-center justify-center p-2 sm:p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrevPhoto}
              className="absolute left-2 sm:left-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Photo Viewport */}
            <div className="max-w-5xl max-h-[72vh] flex items-center justify-center overflow-auto rounded-xl">
              <img
                src={activeLightboxPhoto.src}
                alt={activeLightboxPhoto.title}
                className={`max-w-full max-h-[72vh] object-contain transition-transform duration-300 ${
                  isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                }`}
                onClick={() => setIsZoomed((prev) => !prev)}
              />
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNextPhoto}
              className="absolute right-2 sm:right-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-xl"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Lightbox Bottom Details Bar */}
          <div
            className="p-4 sm:p-5 bg-black/85 border-t border-white/10 text-white z-10 flex flex-col sm:flex-row items-center justify-between gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-[#8A532B] font-bold text-white">
                  {activeLightboxPhoto.woodType}
                </span>
                <span className="text-white/60">·</span>
                <span className="text-white/80">{activeLightboxPhoto.room}</span>
              </div>
              <p className="text-[11px] text-white/60 mt-1 max-w-xl line-clamp-1">
                {activeLightboxPhoto.specs}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={getWhatsAppUrl(`Hi El Shaddai Interior Works, I would like to enquire about this project from your gallery: "${activeLightboxPhoto.title}" (${activeLightboxPhoto.src}). Could you please share estimate details?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs font-bold text-white bg-[#25D366] hover:bg-[#20ba5a] transition-colors flex-1 sm:flex-none text-center"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enquire on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setLightboxIndex(null);
                  onOpenQuote(activeLightboxPhoto.categoryLabel);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs font-bold text-[#1C110B] bg-[#D4A373] hover:bg-[#e2b487] transition-colors cursor-pointer flex-1 sm:flex-none text-center"
              >
                <span>Get Quote</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
