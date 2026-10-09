import React, { useEffect, useState } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Youtube, 
  ArrowRight,
  Eye,
  MapPin,
  Sparkles,
  Share2
} from 'lucide-react';
import { ShortVideoItem } from '../data/shortsData';
import { getWhatsAppUrl } from '../config/businessInfo';
import { 
  getShortCustomMetadata, 
  ShortCustomMetadata 
} from '../services/shortsStorage';

interface ShortsModalProps {
  shorts: ShortVideoItem[];
  activeIndex: number | null;
  onClose: () => void;
  onSelectShort: (index: number) => void;
  onOpenQuote?: (serviceName?: string) => void;
}

export const ShortsModal: React.FC<ShortsModalProps> = ({
  shorts,
  activeIndex,
  onClose,
  onSelectShort,
}) => {
  const [copied, setCopied] = useState(false);
  const [customData, setCustomData] = useState<ShortCustomMetadata | null>(null);

  const activeShort: ShortVideoItem | null =
    activeIndex !== null && shorts[activeIndex] ? shorts[activeIndex] : null;

  // Load custom metadata when active short changes
  useEffect(() => {
    if (activeShort) {
      const meta = getShortCustomMetadata(activeShort.youtubeId);
      setCustomData(meta);
    }
  }, [activeShort?.youtubeId, activeIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        onSelectShort((activeIndex + 1) % shorts.length);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        onSelectShort((activeIndex - 1 + shorts.length) % shorts.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, shorts.length]);

  // Lock background scroll when open
  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeIndex]);

  if (activeIndex === null || !activeShort) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(activeShort.youtubeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const displayTitle = customData?.title || activeShort.title;
  const displayLocation = customData?.location || activeShort.location;
  const displayCategory = customData?.category || activeShort.categoryLabel;
  const displayDescription = customData?.description || null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 select-none animate-fadeIn"
      onClick={onClose}
    >
      {/* Top Header Controls */}
      <div 
        className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between pointer-events-auto max-w-4xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-white shadow-lg">
          <Youtube className="w-4 h-4 text-[#FF0000] fill-current" />
          <span className="text-xs font-semibold">Real Shorts · @elshaddaigroup</span>
          <span className="text-[10px] text-white/60 font-mono">
            {activeIndex + 1} of {shorts.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/15 transition-all hover:scale-105 cursor-pointer shadow-lg"
            title="Copy link to this YouTube Short"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {copied && (
            <span className="text-[11px] bg-emerald-600 text-white px-2 py-1 rounded-md shadow">
              Copied!
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/70 hover:bg-black/90 text-white border border-white/15 flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-lg"
            aria-label="Close video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows for Desktop */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelectShort((activeIndex - 1 + shorts.length) % shorts.length);
        }}
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-xl z-40"
        title="Previous Short (Left Arrow)"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onSelectShort((activeIndex + 1) % shorts.length);
        }}
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-xl z-40"
        title="Next Short (Right Arrow)"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Video Reel Container (Vertical 9:16 aspect ratio like YouTube Shorts) */}
      <div 
        className="relative w-full h-full sm:h-[90vh] sm:max-h-[820px] sm:max-w-[430px] bg-[#120B07] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border-0 sm:border border-white/15"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Real YouTube Embedded Player */}
        <div className="relative flex-1 w-full bg-black overflow-hidden flex items-center justify-center">
          <iframe
            key={activeShort.youtubeId}
            src={activeShort.embedUrl}
            title={displayTitle}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Bottom Information & Action Bar */}
        <div className="bg-[#1C110B] p-4 sm:p-5 z-20 space-y-2.5 border-t border-white/10 shrink-0">
          {/* Category & Stats Badges */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#8A532B] text-white text-[11px] font-semibold tracking-wide uppercase">
                {displayCategory}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-white/80 bg-white/10 px-2 py-0.5 rounded-md">
                <Eye className="w-3 h-3 text-[#D4A373]" />
                <span>{activeShort.views}</span>
              </span>
            </div>

            {displayLocation && (
              <span className="flex items-center gap-1 text-[11px] text-[#D4A373]">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[150px] font-medium">{displayLocation}</span>
              </span>
            )}
          </div>

          {/* Reel Title & Authentic Description */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug font-serif-wood">
                {displayTitle}
              </h3>
            </div>

            {/* Authentic Description or Observation Note */}
            {displayDescription ? (
              <div className="mt-1.5 p-2 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-[#FAF7F2]/90 leading-relaxed">
                  {displayDescription}
                </p>
              </div>
            ) : (
              <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-[#FAF7F2]/75">
                <p className="line-clamp-2 leading-relaxed">
                  <span className="text-[#D4A373] font-medium">Observed: </span>
                  {activeShort.observedNote}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons Row: Watch on YouTube & Request Quote */}
          <div className="pt-1 flex items-center gap-2.5">
            {/* Watch on YouTube button */}
            <a
              href={activeShort.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#FF0000] hover:bg-[#D40000] text-white text-xs font-bold transition-all shadow-md group cursor-pointer"
              title="Watch full short on YouTube @elshaddaigroup"
            >
              <Youtube className="w-4 h-4 fill-current" />
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100" />
            </a>

            {/* Quick Enquire Button */}
            <a
              href={getWhatsAppUrl(`Hi El Shaddai Interior Works, I watched your real YouTube video "${displayTitle}" (${activeShort.youtubeUrl}) and would like a quote for similar custom woodwork.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <span>Enquire</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4A373]" />
            </a>
          </div>

          {/* Channel link credit */}
          <div className="pt-0.5 flex items-center justify-between text-[11px] text-white/60">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4A373]" />
              <span>Official Video Archive</span>
            </span>
            <a 
              href="https://youtube.com/@elshaddaigroup?si=sZVqyqXXNjwOB3-4" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#D4A373] hover:text-white underline transition-colors"
            >
              @elshaddaigroup
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
