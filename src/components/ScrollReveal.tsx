import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // delay in ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.12,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      setIsAnimationDone(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  // Clean up transform after animation finishes so position: fixed children are never trapped
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsAnimationDone(true);
      }, 750 + (delay || 0));
      return () => clearTimeout(timer);
    }
  }, [isVisible, delay]);

  const getDirectionClasses = () => {
    if (direction === 'none') return '';
    if (direction === 'up') return 'translate-y-8';
    if (direction === 'down') return '-translate-y-8';
    if (direction === 'left') return 'translate-x-8';
    if (direction === 'right') return '-translate-x-8';
    return 'translate-y-8';
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-700 ease-out ${
        isAnimationDone
          ? 'opacity-100'
          : isVisible
          ? 'opacity-100 translate-x-0 translate-y-0'
          : `opacity-0 ${getDirectionClasses()}`
      } ${className}`}
      style={{
        transitionDelay: delay && !isAnimationDone ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </div>
  );
};
