import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Youtube, 
  ExternalLink, 
  Eye, 
  Clock, 
  Film,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { galleryShorts, ShortVideoItem } from '../data/shortsData';
import { ShortsModal } from './ShortsModal';
import { getYoutubeUrl } from '../config/businessInfo';
import { getAllShortsCustomMetadata, ShortCustomMetadata } from '../services/shortsStorage';

interface ShortsSectionProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

export const ShortsSection: React.FC<ShortsSectionProps> = ({
  title = "Real Woodwork Shorts & Site Footage",
  subtitle = "Direct video footage from our carpentry sites and workshop across Bengaluru. No artificial mockups—just authentic work in progress.",
  compact = false,
}) => {
  const [activeShortIndex, setActiveShortIndex] = useState<number | null>(null);
  const [customMetadata, setCustomMetadata] = useState<Record<string, ShortCustomMetadata>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    setCustomMetadata(getAllShortsCustomMetadata());

    const handleUpdate = () => {
      setCustomMetadata(getAllShortsCustomMetadata());
    };

    window.addEventListener('sunil_shorts_updated', handleUpdate);
    return () => window.removeEventListener('sunil_shorts_updated', handleUpdate);
  }, []);

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = Math.max(300, scrollContainerRef.current.clientWidth * 0.7);
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className={`w-full ${compact ? 'py-3' : 'py-8'}`}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200/80 text-red-600 text-xs font-semibold uppercase tracking-wider mb-2">
            <Youtube className="w-3.5 h-3.5 fill-current" />
            <span>Real Site Videos · @elshaddaigroup</span>
          </div>
          <h3 className="font-serif-wood text-2xl sm:text-3xl font-bold text-[#1C110B] leading-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-[#554C43] max-w-2xl mt-1.5 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Right Actions: Side Scroll Buttons & Channel Link */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          {/* Side Scroll Left / Right Buttons */}
          <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#E8DECE]">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                canScrollLeft
                  ? 'bg-white text-[#1C110B] hover:bg-[#8A532B] hover:text-white shadow-2xs'
                  : 'text-[#C5BBAF] cursor-not-allowed opacity-50'
              }`}
              aria-label="Scroll left"
              title="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                canScrollRight
                  ? 'bg-white text-[#1C110B] hover:bg-[#8A532B] hover:text-white shadow-2xs'
                  : 'text-[#C5BBAF] cursor-not-allowed opacity-50'
              }`}
              aria-label="Scroll right"
              title="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* YouTube Channel Button */}
          <a
            href={getYoutubeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FF0000] hover:bg-[#D40000] text-white text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md cursor-pointer group"
            title="Visit our YouTube channel @elshaddaigroup"
          >
            <Youtube className="w-4 h-4 fill-current" />
            <span>YouTube Channel</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 transition-opacity" />
          </a>
        </div>
      </div>

      {/* Horizontal Side-Scroll Rail of Vertical 9:16 Reels */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScrollButtons}
        className="flex gap-3.5 sm:gap-4.5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-3 pt-1 px-0.5"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {galleryShorts.map((short: ShortVideoItem, index: number) => {
          const custom = customMetadata[short.youtubeId];
          const displayTitle = custom?.title || short.title;
          const displayLocation = custom?.location || short.location;
          const hasCustomDesc = !!custom?.description;

          return (
            <div
              key={short.id}
              onClick={() => setActiveShortIndex(index)}
              className="group relative w-[200px] sm:w-[230px] md:w-[260px] shrink-0 aspect-9/16 snap-start rounded-2xl overflow-hidden bg-[#1C110B] border border-[#E8DECE]/80 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:border-[#8A532B]"
            >
              {/* Thumbnail Image */}
              <img
                src={short.thumbnail}
                alt={displayTitle}
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out opacity-85 group-hover:opacity-95"
                loading="lazy"
              />

              {/* Gradient Dark Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/40 pointer-events-none" />

              {/* Top Tags Bar */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold border border-white/10 uppercase">
                  <Film className="w-2.5 h-2.5 text-[#D4A373]" />
                  <span>{custom?.category || short.categoryLabel}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FF0000] text-white text-[9px] font-bold tracking-wider font-mono">
                  SHORTS
                </span>
              </div>

              {/* Center Play Button with Pulse */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 backdrop-blur-xs border border-white/50 flex items-center justify-center text-white shadow-lg group-hover:scale-115 group-hover:bg-[#FF0000] transition-all duration-300">
                  <Play className="w-5 h-5 fill-current ml-0.5 text-white" />
                </div>
              </div>

              {/* Bottom Information */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-3.5 z-10 pointer-events-none space-y-1.5">
                {/* Stats & Location */}
                <div className="flex items-center justify-between gap-1 text-[10px] text-white/75 font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-0.5">
                      <Eye className="w-3 h-3 text-[#D4A373]" />
                      <span>{short.views}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-[#D4A373]" />
                      <span>{short.duration}</span>
                    </span>
                  </div>

                  {displayLocation && (
                    <span className="flex items-center gap-0.5 text-[#D4A373] text-[9px] truncate max-w-[90px]">
                      <MapPin className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{displayLocation}</span>
                    </span>
                  )}
                </div>

                {/* Title & Authentic Tag */}
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-[#D4A373] transition-colors font-serif-wood">
                    {displayTitle}
                  </h4>
                  
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-white/70">
                    {hasCustomDesc ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Real Description</span>
                      </span>
                    ) : (
                      <span className="text-white/60">
                        Direct video · Tap to watch
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Lightbox Player Modal */}
      {activeShortIndex !== null && (
        <ShortsModal
          shorts={galleryShorts}
          activeIndex={activeShortIndex}
          onClose={() => setActiveShortIndex(null)}
          onSelectShort={(index) => setActiveShortIndex(index)}
        />
      )}
    </div>
  );
};
