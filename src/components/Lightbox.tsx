import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MessageCircle, MapPin, Hammer, Upload } from 'lucide-react';
import { ProjectItem } from '../data/galleryData';
import { CarpentryBlueprintPlaceholder } from './CarpentryBlueprintPlaceholder';
import { getWhatsAppUrl } from '../config/businessInfo';

interface LightboxProps {
  project: ProjectItem | null;
  photoUrl?: string | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalCount: number;
  onOpenUpload?: (category?: string, id?: string) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  project,
  photoUrl,
  onClose,
  onNext,
  onPrev,
  currentIndex,
  totalCount,
  onOpenUpload,
}) => {
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling while modal is active
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose, onNext, onPrev]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-10 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <div
        className="relative max-w-5xl w-full max-h-[94vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Floating Controls */}
        <div className="w-full flex items-center justify-between pb-3 px-1 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/80 bg-white/10 px-2.5 py-1 rounded-md border border-white/15">
              {currentIndex + 1} of {totalCount}
            </span>
            <span className="text-xs font-semibold text-[#D4A373] uppercase tracking-wider hidden sm:inline">
              Real Project Archive
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer border border-white/20 shadow-lg"
              aria-label="Close image preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Frame - Pure Photo Showcase */}
        <div className="relative w-full flex items-center justify-center overflow-hidden rounded-2xl bg-black/60 shadow-2xl border border-white/10">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={project.title}
              className="w-auto h-auto max-h-[72vh] max-w-full object-contain rounded-xl select-none"
            />
          ) : (
            <div className="w-full min-h-[360px] sm:min-h-[480px] flex flex-col items-center justify-center">
              <CarpentryBlueprintPlaceholder
                category={project.category}
                title={project.title}
                material={project.woodSpecies}
                className="w-full h-full"
                onUploadClick={() => onOpenUpload && onOpenUpload(project.category, project.id)}
              />
            </div>
          )}

          {/* Previous / Next Arrow Controls */}
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-[#8A532B] text-white transition-all cursor-pointer border border-white/20 z-20 shadow-lg"
            aria-label="Previous project"
            title="Previous project (Arrow Left)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={onNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-[#8A532B] text-white transition-all cursor-pointer border border-white/20 z-20 shadow-lg"
            aria-label="Next project"
            title="Next project (Arrow Right)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Authentic Details Bar */}
        <div className="w-full mt-3 p-3.5 bg-[#1C110B]/90 border border-white/10 rounded-xl backdrop-blur-md text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4A373] bg-white/10 px-2 py-0.5 rounded">
                {project.category}
              </span>
              {project.woodSpecies && (
                <span className="text-[11px] text-white/80 flex items-center gap-1">
                  <Hammer className="w-3 h-3 text-[#D4A373]" />
                  <span>{project.woodSpecies}</span>
                </span>
              )}
            </div>

            <h4 className="text-sm font-bold text-white truncate font-serif-wood">
              {project.title}
            </h4>

            {project.location && (
              <p className="text-xs text-[#FAF7F2]/75 line-clamp-1 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#D4A373] shrink-0" />
                <span>{project.location} {project.finish ? `• ${project.finish}` : ''}</span>
              </p>
            )}
          </div>

          {/* Quick Action: WhatsApp Enquire for this exact work */}
          <a
            href={getWhatsAppUrl(`Hi El Shaddai Interior Works, I am viewing this project from your gallery: "${project.title}" (${project.woodSpecies || project.category}). Can you give me an estimate for similar work?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold rounded-lg transition-colors shadow-sm shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
