import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Star,
  CheckCircle,
  MessageSquarePlus,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  X,
  Search,
  Award,
} from 'lucide-react';
import { getStoredTestimonials } from '../services/feedbackStorage';
import { Testimonial } from '../data/testimonialsData';

interface TestimonialsSectionProps {
  onOpenFeedback?: () => void;
  onOpenQuote?: () => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  onOpenFeedback,
  onOpenQuote,
}) => {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [modalSelectedCategory, setModalSelectedCategory] = useState('All');

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    setReviews(getStoredTestimonials());

    const handleUpdate = () => {
      setReviews(getStoredTestimonials());
    };
    window.addEventListener('sunil_woodworks_review_added', handleUpdate);
    return () => window.removeEventListener('sunil_woodworks_review_added', handleUpdate);
  }, []);

  // Compute overall review statistics by calculating the average rating dynamically
  const ratingStats = useMemo(() => {
    if (!reviews.length) {
      return {
        average: '5.0',
        totalCount: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        fiveStarPercentage: 100,
        recommendationRate: 100,
      };
    }
    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 5), 0);
    const avg = (sum / total).toFixed(1);

    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      dist[star] = (dist[star] || 0) + 1;
    });

    const fiveStarPercent = Math.round(((dist[5] || 0) / total) * 100);
    const positiveReviews = reviews.filter((r) => (r.rating || 5) >= 4).length;
    const recommendationRate = Math.round((positiveReviews / total) * 100);

    return {
      average: avg,
      totalCount: total,
      distribution: dist,
      fiveStarPercentage: fiveStarPercent,
      recommendationRate,
    };
  }, [reviews]);

  // Responsive itemsPerPage: 1 on mobile, 2 on tablet, 3 on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.max(1, Math.ceil(reviews.length / itemsPerPage));

  // Reset page if it exceeds bounds after screen resize
  useEffect(() => {
    if (currentIndex >= totalPages) {
      setCurrentIndex(Math.max(0, totalPages - 1));
    }
  }, [totalPages, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleOpenForm = () => {
    if (onOpenFeedback) {
      onOpenFeedback();
    } else {
      window.dispatchEvent(new CustomEvent('sunil_open_feedback_modal'));
    }
  };

  // Visible slice for the compact 1-row carousel
  const visibleReviews = useMemo(() => {
    const start = currentIndex * itemsPerPage;
    return reviews.slice(start, start + itemsPerPage);
  }, [reviews, currentIndex, itemsPerPage]);

  // Categories extracted from reviews for modal filter
  const categories = useMemo(() => {
    const set = new Set<string>();
    reviews.forEach((r) => {
      if (r.projectType) set.add(r.projectType);
    });
    return ['All', ...Array.from(set).slice(0, 6)];
  }, [reviews]);

  // Filtered reviews for the "View All Reviews" modal
  const filteredModalReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchSearch =
        r.clientName.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
        r.quote.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
        r.projectType.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
        r.location.toLowerCase().includes(modalSearchTerm.toLowerCase());

      const matchCategory =
        modalSelectedCategory === 'All' ||
        r.projectType.toLowerCase().includes(modalSelectedCategory.toLowerCase());

      return matchSearch && matchCategory;
    });
  }, [reviews, modalSearchTerm, modalSelectedCategory]);

  return (
    <section
      id="reviews"
      className="scroll-mt-24 py-12 sm:py-16 bg-[#FAF7F2] text-[#1C110B] border-b border-[#E8DECE]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Header with Slide Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8DECE] text-xs font-semibold uppercase tracking-wider text-[#8A532B] mb-2 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8A532B]" />
              <span>Verified Homeowner Reviews</span>
            </div>
            <h2 className="font-serif-wood text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C110B] leading-tight [text-wrap:balance]">
              Trusted by Homeowners Across Bengaluru
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#554C43] leading-relaxed">
              Real projects completed across apartments, villas, and independent homes. Compact showcase keeping the page swift and easy to navigate.
            </p>
          </div>

          {/* Action & Slide Controls in Header */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* View All Button */}
            <button
              type="button"
              onClick={() => setIsAllReviewsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#554C43] bg-white hover:bg-[#FAF7F2] border border-[#E8DECE] hover:border-[#8A532B] rounded-lg transition-all shadow-2xs cursor-pointer"
            >
              <ListFilter className="w-3.5 h-3.5 text-[#8A532B]" />
              <span>All Reviews ({reviews.length})</span>
            </button>

            {/* Write a Review Button */}
            <button
              type="button"
              onClick={handleOpenForm}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#8A532B] hover:bg-[#703F1E] rounded-lg transition-all shadow-2xs cursor-pointer"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-[#F3E7DB]" />
              <span>Write Review</span>
            </button>

            {/* Slider Navigation Arrows (Prev / Next) */}
            <div className="flex items-center gap-1 ml-1 bg-white p-1 rounded-lg border border-[#E8DECE] shadow-2xs">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous reviews slide"
                className="p-1.5 text-[#554C43] hover:text-[#1C110B] hover:bg-[#FAF7F2] rounded-md transition-colors cursor-pointer disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-medium text-[#8A532B] px-1.5 select-none font-mono">
                {currentIndex + 1}/{totalPages}
              </span>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next reviews slide"
                className="p-1.5 text-[#554C43] hover:text-[#1C110B] hover:bg-[#FAF7F2] rounded-md transition-colors cursor-pointer disabled:opacity-30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Overall Review Calculation Banner */}
        <div className="mb-6 p-4 sm:p-5 bg-white rounded-2xl border border-[#E8DECE] shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Big Score Box */}
            <div className="bg-[#FAF7F2] border border-[#E8DECE] rounded-xl px-4 py-2.5 text-center shrink-0">
              <div className="font-serif-wood text-3xl font-extrabold text-[#1C110B] leading-none">
                {ratingStats.average}
              </div>
              <div className="flex items-center justify-center gap-0.5 text-[#C59B27] mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(Number(ratingStats.average))
                        ? 'fill-current'
                        : 'text-[#D5C7B7]'
                    }`}
                  />
                ))}
              </div>
              <div className="text-[10px] font-mono font-medium text-[#8A532B] mt-0.5">
                out of 5.0
              </div>
            </div>

            {/* Label and Breakdown */}
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif-wood text-base sm:text-lg font-bold text-[#1C110B]">
                  Overall Client Rating
                </h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-[#1F512F] bg-[#E9F7EF] border border-[#B9E6C9] rounded-full">
                  <Award className="w-3 h-3 text-[#25D366]" />
                  {ratingStats.recommendationRate}% Recommended
                </span>
              </div>
              <p className="text-xs text-[#554C43] mt-0.5">
                Calculated from <strong className="text-[#1C110B]">{ratingStats.totalCount} verified homeowner ratings</strong> across Bengaluru.
              </p>
              <div className="flex items-center gap-3 text-[11px] text-[#8A532B] font-medium mt-1">
                <span>{ratingStats.fiveStarPercentage}% rated 5-Stars ★</span>
                <span>•</span>
                <span>100% genuine craftsmanship on-site</span>
              </div>
            </div>
          </div>

          {/* Quick Category Chips / Action */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#E8DECE]">
            <button
              type="button"
              onClick={() => setIsAllReviewsModalOpen(true)}
              className="text-xs font-semibold text-[#8A532B] hover:text-[#703F1E] hover:underline cursor-pointer"
            >
              See all {ratingStats.totalCount} reviews &rarr;
            </button>
          </div>
        </div>

        {/* Compact Single-Row Carousel (Never exceeds 1 row regardless of 100+ reviews!) */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleReviews.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 sm:p-6 rounded-xl border border-[#E8DECE] shadow-2xs flex flex-col justify-between hover:border-[#8A532B]/50 transition-all duration-200 min-h-[220px]"
              >
                <div>
                  {/* Rating & Project Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-0.5 text-[#C59B27]">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    {item.verifiedProject && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#1F512F] bg-[#E9F7EF] border border-[#B9E6C9] px-2 py-0.5 rounded-sm">
                        <CheckCircle className="w-2.5 h-2.5 text-[#25D366]" />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Review Quote (Clamped for uniform height) */}
                  <p className="text-xs sm:text-sm text-[#3E3832] leading-relaxed italic line-clamp-3 mb-4">
                    "{item.quote}"
                  </p>
                </div>

                {/* Attribution & Location */}
                <div className="pt-3 border-t border-[#E8DECE]/80">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-serif-wood text-sm font-bold text-[#1C110B] truncate">
                      {item.clientName}
                    </h4>
                    <span className="text-[11px] text-[#8A532B] font-medium shrink-0">
                      {item.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#6B6258] mt-0.5">
                    <span className="truncate max-w-[190px]">{item.projectType}</span>
                    {item.date && (
                      <span className="text-[10px] text-[#9C8F80] shrink-0">{item.date}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-5">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-6 bg-[#8A532B]' : 'w-1.5 bg-[#D5C7B7]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* "View All Reviews" Modal: Clean scrollable wall without stretching the main page */}
      {isAllReviewsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="all-reviews-title"
          onClick={() => setIsAllReviewsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full p-5 sm:p-7 border border-[#E8DECE] shadow-2xl relative my-auto max-h-[88vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E8DECE]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A532B] uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Client Feedback Archive</span>
                </div>
                <div className="flex items-center gap-3">
                  <h3 id="all-reviews-title" className="font-serif-wood text-xl sm:text-2xl font-bold text-[#1C110B]">
                    All Client Reviews ({reviews.length})
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8DECE] text-xs font-bold text-[#8A532B]">
                    ★ {ratingStats.average} / 5.0
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAllReviewsModalOpen(false)}
                className="p-1.5 text-[#6B6258] hover:text-[#1C110B] rounded-lg hover:bg-[#FAF7F2] transition-colors cursor-pointer border border-[#E8DECE]"
                aria-label="Close all reviews modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Category Filter */}
            <div className="py-3 space-y-2 border-b border-[#E8DECE]">
              <div className="relative">
                <Search className="w-4 h-4 text-[#8C827A] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={modalSearchTerm}
                  onChange={(e) => setModalSearchTerm(e.target.value)}
                  placeholder="Search reviews by client name, area, or woodwork type..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E8DECE] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A532B] text-[#1C110B]"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setModalSelectedCategory(cat)}
                    className={`px-2.5 py-1 text-[11px] rounded-md border transition-all cursor-pointer ${
                      modalSelectedCategory === cat
                        ? 'bg-[#8A532B] text-white border-[#8A532B] font-semibold'
                        : 'bg-white text-[#554C43] border-[#E8DECE] hover:border-[#8A532B]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Reviews List */}
            <div className="overflow-y-auto flex-1 py-4 pr-1 space-y-3.5">
              {filteredModalReviews.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#8C827A]">
                  No reviews match your search or filter.
                </div>
              ) : (
                filteredModalReviews.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-[#E8DECE] bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-0.5 text-[#C59B27]">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-[11px] font-semibold text-[#8A532B]">
                        {item.location}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#3E3832] leading-relaxed italic mb-3">
                      "{item.quote}"
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-[#6B6258] pt-2 border-t border-[#E8DECE]/60">
                      <div>
                        <span className="font-bold text-[#1C110B]">{item.clientName}</span>
                        <span className="text-[#8C827A] mx-1.5">•</span>
                        <span>{item.projectType}</span>
                      </div>
                      {item.date && <span className="text-[10px] text-[#9C8F80]">{item.date}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-[#E8DECE] flex items-center justify-between text-xs">
              <span className="text-[#6B6258]">
                Average Rating: <strong className="text-[#1C110B]">{ratingStats.average}★</strong> ({filteredModalReviews.length} reviews shown)
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsAllReviewsModalOpen(false);
                  handleOpenForm();
                }}
                className="font-bold text-[#8A532B] hover:underline cursor-pointer"
              >
                + Write a Review
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
