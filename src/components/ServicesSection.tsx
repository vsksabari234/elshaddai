import React from 'react';
import { servicesData, ServiceItem } from '../data/servicesData';
import { ArrowRight, MessageSquare, Hammer, Sparkles } from 'lucide-react';
import { getWhatsAppUrl } from '../config/businessInfo';
import { useProjectPhotos } from '../hooks/useProjectPhotos';
import { ScrollReveal } from './ScrollReveal';

interface ServicesSectionProps {
  onEnquire: (serviceTitle: string) => void;
  previewOnly?: boolean;
  onOpenUpload?: (category?: string, id?: string) => void;
  onNavigateToGallery?: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onEnquire,
  onNavigateToGallery,
}) => {
  const { getPhotoFor, photos } = useProjectPhotos();

  return (
    <section
      id="services"
      className="scroll-mt-24 py-16 sm:py-20 lg:py-24 bg-[#FAF7F2] text-[#1C110B] border-b border-[#E8DECE] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Services Header Matching Site Architecture */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-[#8A532B] mb-2 flex items-center gap-1.5">
              <Hammer className="w-4 h-4 text-[#8A532B]" />
              <span>Custom Carpentry & Woodwork</span>
            </div>

            <h2 className="font-serif-wood text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C110B] leading-tight mb-3 [text-wrap:balance]">
              What We Build
            </h2>

            <p className="text-base text-[#554C43] leading-relaxed">
              Every home deserves joinery measured to the millimetre and built to endure Bengaluru weather. Explore our bespoke woodworking specialities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-auto">
            <div className="text-xs font-mono text-[#554C43] bg-white px-3.5 py-2.5 rounded-lg border border-[#E8DECE] shadow-2xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8A532B]" />
              <span><strong className="text-[#8A532B] font-bold">6 Core</strong> Woodwork Solutions</span>
            </div>

            {onNavigateToGallery && (
              <button
                type="button"
                onClick={onNavigateToGallery}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold text-white bg-[#8A532B] hover:bg-[#724422] shadow-sm hover:shadow-md transition-all cursor-pointer"
                title="Open dedicated Gallery Page with all 156 authentic photos"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>View All 156 Photos Page →</span>
              </button>
            )}
          </div>
        </div>

        {/* Clean Responsive 3-Column × 2-Row Grid with ScrollReveal Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 items-stretch">
          {servicesData.map((service: ServiceItem, index: number) => {
            const photoUrl = (photos && photos.length ? getPhotoFor(service.id, service.category) : null) || service.image;

            return (
              <ScrollReveal
                key={service.id}
                delay={index * 90}
                direction="up"
                className="h-full"
              >
                <div
                  className="bg-white rounded-2xl border border-[#E8DECE]/80 shadow-[0_2px_12px_-2px_rgba(46,26,17,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(46,26,17,0.14)] transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1 hover:border-[#8A532B]/50 h-full"
                >
                  {/* Enhanced Polished Real-World Carpentry Image Container */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-[#24140D] border-b border-[#E8DECE]/80">
                    <img
                      src={photoUrl}
                      alt={service.title}
                      className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out filter brightness-[1.03] contrast-[1.05] saturate-[1.10]"
                      loading="lazy"
                    />

                    {/* Clean Subtle Gradient Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Card Content & Action */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif-wood text-xl sm:text-2xl font-bold text-[#1C110B] mb-2 leading-snug group-hover:text-[#8A532B] transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#554C43] leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Actions Bar: Enquire Now / Get a Quote & WhatsApp */}
                    <div className="pt-4 border-t border-[#E8DECE]/80 mt-5 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => onEnquire(service.title)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#2E1A11] hover:bg-[#432719] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer whitespace-nowrap active:scale-98"
                      >
                        <span>Request Quote</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D4A373]" />
                      </button>

                      <a
                        href={getWhatsAppUrl(`Hi El Shaddai Interior Works, I would like to enquire about your ${service.title} service.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg border border-[#E8DECE] hover:border-[#25D366] text-[#554C43] hover:text-[#25D366] hover:bg-[#E9F7EF] transition-all cursor-pointer shadow-2xs active:scale-95"
                        title={`Chat on WhatsApp about ${service.title}`}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};
