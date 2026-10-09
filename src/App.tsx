/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ServicesSection } from './components/ServicesSection';
import { ProcessSection } from './components/ProcessSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { FinalCTASection } from './components/FinalCTASection';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { QuoteModal } from './components/QuoteModal';
import { MobileQuickBar } from './components/MobileQuickBar';
import { FeedbackModal } from './components/FeedbackModal';
import { GalleryPage } from './components/GalleryPage';
import { ScrollReveal } from './components/ScrollReveal';
import { FlyingKiteCelebration } from './components/FlyingKiteCelebration';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'gallery'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      return hash === '#gallery-page' || hash === '#all-photos' ? 'gallery' : 'home';
    }
    return 'home';
  });
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [galleryCategory, setGalleryCategory] = useState<string | undefined>(undefined);
  const [selectedServiceForQuote, setSelectedServiceForQuote] = useState<string | undefined>(undefined);
  const [activeSection, setActiveSection] = useState('home');
  const [kiteFlightState, setKiteFlightState] = useState<{ active: boolean; startPos?: { x: number; y: number } }>({
    active: false,
  });

  // Listen for kite flight trigger event from Quote or Feedback submission
  useEffect(() => {
    const handleKiteFlight = (e: Event) => {
      const customEvent = e as CustomEvent<{ startPos?: { x: number; y: number } }>;
      setKiteFlightState({
        active: true,
        startPos: customEvent.detail?.startPos,
      });
    };
    const handleOpenFeedback = () => {
      setIsFeedbackModalOpen(true);
    };
    window.addEventListener('sunil_trigger_kite_flight', handleKiteFlight);
    window.addEventListener('sunil_open_feedback_modal', handleOpenFeedback);
    return () => {
      window.removeEventListener('sunil_trigger_kite_flight', handleKiteFlight);
      window.removeEventListener('sunil_open_feedback_modal', handleOpenFeedback);
    };
  }, []);

  // Handle URL hash changes for browser back/forward and deep linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#gallery-page' || hash === '#all-photos') {
        setCurrentPage('gallery');
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToGallery = (category?: string) => {
    setGalleryCategory(category);
    setCurrentPage('gallery');
    window.location.hash = '#gallery-page';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = (sectionId?: string) => {
    setCurrentPage('home');
    if (sectionId && sectionId !== 'home') {
      window.location.hash = `#${sectionId}`;
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          const navOffset = 90;
          const elementPosition = el.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navOffset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.location.hash = '#home';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Track active section for navbar highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'process', 'about', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenQuote = (serviceName?: string) => {
    setSelectedServiceForQuote(serviceName);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C110B] flex flex-col font-sans selection:bg-[#C59B27]/30 selection:text-[#1C110B] pb-14 md:pb-0">
      {currentPage === 'gallery' ? (
        <GalleryPage
          onNavigateHome={() => navigateToHome()}
          onOpenQuote={handleOpenQuote}
          initialCategory={galleryCategory}
        />
      ) : (
        <>
          {/* Top Navigation */}
          <Navbar
            onOpenQuote={() => handleOpenQuote()}
            onOpenFeedback={() => setIsFeedbackModalOpen(true)}
            onNavigateToGallery={navigateToGallery}
            onNavigateToHome={navigateToHome}
            currentPage={currentPage}
            activeSection={activeSection}
          />

          <main className="flex-1">
            {/* Hero Section */}
            <Hero
              onOpenQuote={() => handleOpenQuote()}
              onExploreWork={navigateToGallery}
            />

            {/* Why Choose El Shaddai Interior Works - 6 Core Pillars with Reveal Animation */}
            <ScrollReveal direction="up" threshold={0.1}>
              <WhyChooseUs />
            </ScrollReveal>

            {/* Services Showcase with Premium Reveal Transition */}
            <ScrollReveal direction="up" threshold={0.1}>
              <ServicesSection
                onEnquire={(serviceTitle) => handleOpenQuote(serviceTitle)}
                onNavigateToGallery={navigateToGallery}
              />
            </ScrollReveal>

            {/* 4-Step Craftsmanship Process with Smooth Transition */}
            <div id="process">
              <ScrollReveal direction="up" threshold={0.1}>
                <ProcessSection />
              </ScrollReveal>
            </div>

            {/* Client Testimonials & Reviews with Fade-in/Slide-up */}
            <ScrollReveal direction="up" threshold={0.1}>
              <TestimonialsSection
                onOpenFeedback={() => setIsFeedbackModalOpen(true)}
                onOpenQuote={() => handleOpenQuote()}
              />
            </ScrollReveal>

            {/* About Us & Workshop Approach with Reveal Animation */}
            <ScrollReveal direction="up" threshold={0.1}>
              <AboutSection />
            </ScrollReveal>

            {/* Contact Form & Workshop Info with Slide-up Animation */}
            <ScrollReveal direction="up" threshold={0.1}>
              <ContactSection
                initialService={selectedServiceForQuote}
              />
            </ScrollReveal>

            {/* Final Conversion CTA with Reveal Animation */}
            <ScrollReveal direction="up" threshold={0.1}>
              <FinalCTASection
                onOpenQuote={() => handleOpenQuote()}
              />
            </ScrollReveal>
          </main>

          {/* Footer */}
          <Footer />

          {/* Mobile Sticky Quick Action Bar */}
          <MobileQuickBar
            onOpenQuote={() => handleOpenQuote()}
          />
        </>
      )}

      {/* Floating WhatsApp Action Button */}
      <WhatsAppButton />

      {/* Interactive Free Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        preSelectedService={selectedServiceForQuote}
      />

      {/* Client Feedback & Review Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onTriggerKiteFlight={(pos) => setKiteFlightState({ active: true, startPos: pos })}
      />

      {/* Full-Website Flying Kite / Paper Plane Celebration Animation */}
      <FlyingKiteCelebration
        active={kiteFlightState.active}
        startPos={kiteFlightState.startPos}
        onComplete={() => setKiteFlightState({ active: false })}
      />
    </div>
  );
}
