import React, { useEffect, useState, useRef } from 'react';

interface FlyingKiteCelebrationProps {
  active: boolean;
  startPos?: { x: number; y: number };
  onComplete?: () => void;
}

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

export const FlyingKiteCelebration: React.FC<FlyingKiteCelebrationProps> = ({
  active,
  startPos,
  onComplete,
}) => {
  const [visible, setVisible] = useState(false);
  const [symbolState, setSymbolState] = useState({
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    opacity: 0,
  });
  const [particles, setParticles] = useState<SparkleParticle[]>([]);
  const [arrivalSparkle, setArrivalSparkle] = useState(false);

  const animFrameRef = useRef<number | null>(null);
  const particleCounter = useRef(0);

  useEffect(() => {
    if (!active) {
      setVisible(false);
      setArrivalSparkle(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    setVisible(true);
    setArrivalSparkle(false);

    // Starting Coordinates: EXACT center of the submit button icon
    const startX = startPos ? startPos.x : window.innerWidth * 0.5;
    const startY = startPos ? startPos.y : window.innerHeight * 0.6;

    // Pick a truly random destination anywhere across the website viewport
    const randomDestinations = [
      // Top right sky
      { x: window.innerWidth * (0.65 + Math.random() * 0.28), y: window.innerHeight * (0.05 + Math.random() * 0.2) },
      // Top left corner
      { x: window.innerWidth * (0.06 + Math.random() * 0.25), y: window.innerHeight * (0.05 + Math.random() * 0.2) },
      // Upper center near logo/navbar
      { x: window.innerWidth * (0.35 + Math.random() * 0.3), y: window.innerHeight * (0.04 + Math.random() * 0.15) },
      // Mid right
      { x: window.innerWidth * (0.75 + Math.random() * 0.2), y: window.innerHeight * (0.35 + Math.random() * 0.35) },
      // Mid left
      { x: window.innerWidth * (0.05 + Math.random() * 0.2), y: window.innerHeight * (0.35 + Math.random() * 0.35) },
    ];
    const destination = randomDestinations[Math.floor(Math.random() * randomDestinations.length)];
    const endX = destination.x;
    const endY = destination.y;

    // Control point 1: Smooth lift-off directly up and out of the button
    const cp1X = startX + (Math.random() * 80 - 40);
    const cp1Y = startY - 90 - Math.random() * 50;

    // Control point 2: Natural arching swoop across the screen
    const midX = (startX + endX) / 2;
    const midY = Math.min(startY, endY) - 80 - Math.random() * 100;
    const cp2X = midX + (Math.random() * 160 - 80);
    const cp2Y = Math.max(30, midY);

    const startTime = performance.now();
    const flightDuration = 2200; // Fast, responsive, snappy 2.2s flight

    const sparkleColors = ['#D4A373', '#FFD700', '#25D366', '#FFFFFF', '#C59B27'];

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / flightDuration);

      // Smooth aerodynamic easing (slow lift -> smooth flight glide -> soft landing)
      const t =
        progress < 0.5
          ? 2 * progress * progress
          : -1 + (4 - 2 * progress) * progress;

      const mt = 1 - t;

      // Cubic Bezier position
      const currX =
        mt * mt * mt * startX +
        3 * mt * mt * t * cp1X +
        3 * mt * t * t * cp2X +
        t * t * t * endX;

      const currY =
        mt * mt * mt * startY +
        3 * mt * mt * t * cp1Y +
        3 * mt * t * t * cp2Y +
        t * t * t * endY;

      // Tangent vector for natural angle
      const dx =
        3 * mt * mt * (cp1X - startX) +
        6 * mt * t * (cp2X - cp1X) +
        3 * t * t * (endX - cp2X);

      const dy =
        3 * mt * mt * (cp1Y - startY) +
        6 * mt * t * (cp2Y - cp1Y) +
        3 * t * t * (endY - cp2Y);

      // The Lucide Send icon points at ~45 degrees naturally (top-right corner).
      // Aligning rotation so its nose tracks movement direction:
      const headingAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 45;

      // Natural scale: starts at 1x (same size as the button icon), expands to 1.8x in air, settles gently at landing
      let scale = 1.0;
      if (progress < 0.15) {
        scale = 1.0 + (progress / 0.15) * 0.8;
      } else if (progress > 0.85) {
        scale = 1.8 - ((progress - 0.85) / 0.15) * 0.6;
      } else {
        scale = 1.8;
      }

      // Opacity
      let opacity = 1;
      if (progress < 0.05) {
        opacity = progress / 0.05;
      } else if (progress > 0.9) {
        opacity = 1 - (progress - 0.9) / 0.1;
      }

      setSymbolState({
        x: currX,
        y: currY,
        rotation: headingAngle,
        scale,
        opacity,
      });

      // Drop subtle glowing sparkle particles along the tail
      if (Math.random() < 0.8 && progress < 0.92) {
        particleCounter.current += 1;
        const newParticle: SparkleParticle = {
          id: particleCounter.current,
          x: currX - (dx / (Math.hypot(dx, dy) || 1)) * 14 + (Math.random() * 8 - 4),
          y: currY - (dy / (Math.hypot(dx, dy) || 1)) * 14 + (Math.random() * 8 - 4),
          size: 3 + Math.random() * 5,
          opacity: 0.9,
          color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
        };
        setParticles((prev) => [...prev.slice(-30), newParticle]);
      }

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Touchdown at the random place!
        setArrivalSparkle(true);
        setTimeout(() => {
          setVisible(false);
          setArrivalSparkle(false);
          setParticles([]);
          if (onComplete) onComplete();
        }, 800);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [active, startPos, onComplete]);

  // Fade out sparkle particles
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, opacity: p.opacity - 0.09, size: p.size * 0.94 }))
          .filter((p) => p.opacity > 0.05)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1000] overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Sparkle particles trailing the flying symbol */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full transition-opacity duration-100"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 8px ${p.color}`,
            opacity: p.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* The Exact Flying Send / Paper Plane Symbol Flying Across the Screen */}
      <div
        className="absolute will-change-transform filter drop-shadow-[0_8px_16px_rgba(212,163,115,0.65)]"
        style={{
          left: `${symbolState.x}px`,
          top: `${symbolState.y}px`,
          transform: `translate(-50%, -50%) rotate(${symbolState.rotation}deg) scale(${symbolState.scale})`,
          opacity: symbolState.opacity,
          transition: 'opacity 0.1s ease-out',
        }}
      >
        {/* The Exact Lucide Send Symbol Geometry, Enhanced with Golden Craftsmanship Finish */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-7 h-7"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <linearGradient id="flyingSendGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#FFE082" />
              <stop offset="70%" stopColor="#D4A373" />
              <stop offset="100%" stopColor="#8A532B" />
            </linearGradient>
            <filter id="symbolGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#D4A373" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Main Paper Plane Body (Filled with golden woodcraft gradient) */}
          <path
            d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"
            fill="url(#flyingSendGrad)"
            stroke="#2E1A11"
            strokeWidth="1.2"
          />

          {/* Center Fold / Crease Line */}
          <path
            d="m21.854 2.147-10.94 10.94"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Little Golden Star on Wingtip */}
          <circle cx="21" cy="3" r="1.5" fill="#FFD700" />
        </svg>
      </div>

      {/* Arrival Sparkle Burst at the Random Ending Place */}
      {arrivalSparkle && (
        <div
          className="absolute pointer-events-none transition-transform"
          style={{
            left: `${symbolState.x}px`,
            top: `${symbolState.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-12 h-12 rounded-full bg-[#FFD700]/40 animate-ping" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#FFD700] animate-spin"
              style={{ animationDuration: '1s' }}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.2-6.3-4.6-6.3 4.6 2.3-7.2-6-4.6h7.6z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
