import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, Send, ThumbsUp, ShieldCheck, Sparkles, ChevronDown } from 'lucide-react';
import { saveNewTestimonial } from '../services/feedbackStorage';
import { Testimonial } from '../data/testimonialsData';

export const WORK_CATEGORIES = [
  'Modular Kitchen Woodwork',
  'Fitted Wardrobes & Lofts',
  'Main Doors & Carved Entrances',
  'TV Units & Wall Paneling',
  'Pooja Units & Mandirs',
  'Custom Furniture (Beds, Tables, Sofas)',
  'Wooden Windows & Ventilators',
  'False Ceiling & Wooden Rafters',
  'Staircase Railings & Cladding',
  'Home Office & Study Desks',
  'Full Home Interior Woodwork',
  'Other Custom Woodwork',
];

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedbackSubmitted?: (newReview: Testimonial) => void;
  onTriggerKiteFlight?: (startPos?: { x: number; y: number }) => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onFeedbackSubmitted,
  onTriggerKiteFlight,
}) => {
  const [clientName, setClientName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [quote, setQuote] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Escape key and lock background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Only Name and Work Type are strictly required
    if (!clientName.trim() || !projectType.trim() || isSubmitting) return;

    // Get exact button coordinates on screen so flight takes off directly from here
    let startPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    if (submitButtonRef.current) {
      const rect = submitButtonRef.current.getBoundingClientRect();
      startPos = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }

    setIsSubmitting(true);

    // Trigger full-viewport flying symbol starting right from the button to random place
    if (onTriggerKiteFlight) {
      onTriggerKiteFlight(startPos);
    }
    window.dispatchEvent(
      new CustomEvent('sunil_trigger_kite_flight', { detail: { startPos } })
    );

    try {
      const saved = await saveNewTestimonial({
        clientName: clientName.trim(),
        clientRole: 'Homeowner', // Default role
        projectType: projectType.trim(),
        location: location.trim() || 'Bengaluru',
        quote: quote.trim() || `Excellent custom carpentry and solid precision joinery for ${projectType.trim()}. Very happy with the workmanship and finishing.`,
        rating,
      });

      if (onFeedbackSubmitted) {
        onFeedbackSubmitted(saved);
      }
    } catch (err) {
      console.warn('Feedback save warning:', err);
    }

    // Show celebratory confirmation
    setTimeout(() => {
      setSubmittedSuccess(true);
      setIsSubmitting(false);
    }, 600);

    setTimeout(() => {
      setClientName('');
      setProjectType('');
      setIsCustomCategory(false);
      setLocation('');
      setQuote('');
      setRating(5);
      setSubmittedSuccess(false);
      onClose();
    }, 3400);
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-lg w-full border border-[#E8DECE] shadow-2xl relative my-auto max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Title & Close Button */}
        <div className="flex items-start justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-[#E8DECE]/70 bg-white z-10 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A532B] uppercase tracking-wider mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8A532B]" />
              <span>Verified Client Feedback</span>
            </div>
            <h2
              id="feedback-modal-title"
              className="font-serif-wood text-xl sm:text-2xl font-bold text-[#1C110B] leading-tight"
            >
              Share Your Experience
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6B6258] hover:text-[#1C110B] rounded-lg hover:bg-[#FAF7F2] transition-colors cursor-pointer border border-[#E8DECE] shrink-0 ml-3"
            aria-label="Close feedback modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto p-4 sm:p-6 overscroll-contain flex-1">

        {submittedSuccess ? (
          <div className="text-center py-8 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 bg-[#E9F7EF] text-[#25D366] rounded-full flex items-center justify-center mx-auto border border-[#B9E6C9] shadow-sm animate-bounce">
              <ThumbsUp className="w-8 h-8" />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8DECE] text-xs font-mono font-semibold text-[#8A532B]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Flown from your button across Bengaluru!</span>
            </div>

            <h3 className="font-serif-wood text-2xl font-bold text-[#1C110B]">
              Thank You, {clientName}!
            </h3>
            <p className="text-sm text-[#554C43] max-w-sm mx-auto leading-relaxed">
              Your review for <span className="font-semibold text-[#8A532B]">{projectType}</span> has taken flight and is recorded on our client review wall. We deeply appreciate your trust in El Shaddai Interior Works!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Row 1: Name (Required) & Work Type Categories (Required) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1C110B] mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E8DECE] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A532B] text-[#1C110B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1C110B] mb-1">
                    Work Category <span className="text-red-500">*</span>
                  </label>
                  
                  {/* Category Dropdown Selection */}
                  <div className="relative">
                    <select
                      required
                      value={isCustomCategory ? 'Other Custom Woodwork' : projectType}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'Other Custom Woodwork') {
                          setIsCustomCategory(true);
                          setProjectType('');
                        } else {
                          setIsCustomCategory(false);
                          setProjectType(val);
                        }
                      }}
                      className="w-full appearance-none px-3.5 py-2.5 pr-8 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E8DECE] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A532B] text-[#1C110B] cursor-pointer"
                    >
                      <option value="" disabled>-- Select Work Category --</option>
                      {WORK_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#8A532B] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Custom Input if "Other Custom Woodwork" is selected */}
                  {isCustomCategory && (
                    <input
                      required
                      type="text"
                      autoFocus
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      placeholder="Type your custom woodwork category..."
                      className="mt-1.5 w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E8DECE] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A532B] text-[#1C110B] animate-fadeIn"
                    />
                  )}
                </div>
              </div>

              {/* Row 2: Location / Area (Optional) & Rating (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#554C43] mb-1">
                    Area / City <span className="text-[11px] text-[#8C827A] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Hennur, Whitefield, RT Nagar"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E8DECE] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A532B] text-[#1C110B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#554C43] mb-1">
                    Overall Rating <span className="text-[11px] text-[#8C827A] font-normal">(Optional)</span>
                  </label>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5 text-lg transition-transform hover:scale-120 cursor-pointer focus-visible:outline-none"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            (hoverRating || rating) >= star
                              ? 'fill-[#C59B27] text-[#C59B27]'
                              : 'text-[#E8DECE]'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-[#8A532B] ml-1">
                      {rating}★
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3: Feedback Comments (Optional) */}
              <div>
                <label className="block text-xs font-medium text-[#554C43] mb-1">
                  Your Review / Comments <span className="text-[11px] text-[#8C827A] font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Share a few words about the joinery, finish, durability, or punctuality (optional)..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E8DECE] rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8A532B] text-[#1C110B] resize-none"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-[#554C43] hover:text-[#1C110B] transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  ref={submitButtonRef}
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#2E1A11] hover:bg-[#432719] active:scale-98 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-90 overflow-hidden"
                >
                  <Send 
                    className={`w-3.5 h-3.5 text-[#D4A373] transition-all duration-300 ease-out ${
                      isSubmitting
                        ? 'translate-x-6 -translate-y-6 scale-50 opacity-0'
                        : 'group-hover:translate-x-1 group-hover:-translate-y-0.5'
                    }`} 
                  />
                  <span>{isSubmitting ? 'Taking Off...' : 'Submit Feedback'}</span>
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
