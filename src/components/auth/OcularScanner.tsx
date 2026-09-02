'use client';

import React, { useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from 'framer-motion';

interface OcularScannerProps {
  isTyping: boolean;
}

// Cyber-droplet config: pre-seeded so layout is stable on mount
const DROPLETS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 4.3 + 1.5) % 98}%`,
  width: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
  height: i % 4 === 0 ? 18 : i % 4 === 1 ? 12 : i % 4 === 2 ? 22 : 9,
  duration: 2.8 + (i % 7) * 0.55,
  delay: (i * 0.45) % 4.2,
  opacity: 0.12 + (i % 5) * 0.1,
}));

export const OcularScanner: React.FC<OcularScannerProps> = ({
  isTyping,
}) => {
  const eyeContainerRef = useRef<HTMLDivElement>(null);

  // Motion values for eyeball & pupil tracking
  const eyeXMotion = useMotionValue(0);
  const eyeYMotion = useMotionValue(0);
  const pupilXMotion = useMotionValue(0);
  const pupilYMotion = useMotionValue(0);
  const cursorDistance = useMotionValue(600);

  // Blink motion value: drives scaleY of the whole eye group
  const blinkScaleY = useMotionValue(1);

  const springConfig = { stiffness: 240, damping: 22 };
  const smoothEyeX = useSpring(eyeXMotion, springConfig);
  const smoothEyeY = useSpring(eyeYMotion, springConfig);
  const smoothPupilX = useSpring(pupilXMotion, springConfig);
  const smoothPupilY = useSpring(pupilYMotion, springConfig);

  const headRotateX = useSpring(useMotionValue(0), springConfig);
  const headRotateY = useSpring(useMotionValue(0), springConfig);

  // Lock gaze toward auth panel while typing
  const finalEyeX = isTyping ? 30 : smoothEyeX;
  const finalEyeY = isTyping ? 0 : smoothEyeY;
  const finalPupilX = isTyping ? 22 : smoothPupilX;
  const finalPupilY = isTyping ? 0 : smoothPupilY;

  // Dynamic proximity glow opacity mapped from cursor distance
  const proximityGlowOpacity = useTransform(
    cursorDistance,
    [0, 80, 250, 600],
    [1.0, 0.95, 0.45, 0.15]
  );

  // ── IDLE BLINK EFFECT ──────────────────────────────────────────────
  // Fires every 4–5s when user is NOT typing; stops completely on focus
  useEffect(() => {
    if (isTyping) {
      // Snap eye back open immediately when typing starts
      blinkScaleY.set(1);
      return;
    }

    let cancelled = false;

    const scheduleBlink = () => {
      // Random interval 4000–5200ms
      const delay = 4000 + Math.random() * 1200;
      const timer = setTimeout(async () => {
        if (cancelled) return;
        // Snap shut then snap open (like a real blink: ~120ms total)
        await animate(blinkScaleY, 0.08, { duration: 0.07, ease: 'easeIn' });
        if (cancelled) return;
        await animate(blinkScaleY, 1, { duration: 0.1, ease: 'easeOut' });
        if (cancelled) return;
        scheduleBlink(); // Schedule next blink
      }, delay);
      return timer;
    };

    const timer = scheduleBlink();
    return () => {
      cancelled = true;
      clearTimeout(timer as unknown as number);
    };
  }, [isTyping, blinkScaleY]);

  // ── MOUSE MOVE: RADIAL CLAMPING ────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    headRotateX.set((clientY / innerHeight - 0.5) * -16);
    headRotateY.set((clientX / innerWidth - 0.5) * 20);

    if (eyeContainerRef.current) {
      const rect = eyeContainerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = clientX - cx;
      const dy = clientY - cy;
      const angle = Math.atan2(dy, dx);
      const dist = Math.hypot(dx, dy);

      cursorDistance.set(dist);

      // Outer eyeball — clamped to 14px radius
      const eyeDist = Math.min(14, dist / 22);
      eyeXMotion.set(Math.cos(angle) * eyeDist);
      eyeYMotion.set(Math.sin(angle) * eyeDist);

      // Inner pupil — clamped to 18px radius
      const pupilDist = Math.min(18, dist / 12);
      pupilXMotion.set(Math.cos(angle) * pupilDist);
      pupilYMotion.set(Math.sin(angle) * pupilDist);
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full h-full bg-black text-white flex flex-col items-center justify-center overflow-hidden border-r border-[#ff0055]/20 select-none"
    >
      {/* ── BACKGROUND CYBER-DROPLETS (z-0, behind eye) ───────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {DROPLETS.map((d) => (
          <motion.div
            key={d.id}
            className="absolute rounded-full"
            style={{
              left: d.left,
              width: d.width,
              top: -d.height,
              height: d.height,
              background: `rgba(255, 0, 85, ${d.opacity})`,
              boxShadow: `0 0 ${d.width * 3}px rgba(255, 0, 85, ${d.opacity * 0.8})`,
            }}
            animate={{ y: ['0vh', '108vh'] }}
            transition={{
              duration: d.duration,
              delay: d.delay,
              repeat: Infinity,
              ease: 'linear',
              repeatDelay: 0,
            }}
          />
        ))}
      </div>

      {/* ── AMBIENT GLOW ORBS (z-0) ────────────────────────────────── */}
      <div className="absolute w-[500px] h-[500px] bg-[#ff0055]/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute w-[350px] h-[350px] bg-[#e60039]/8 rounded-full blur-2xl pointer-events-none z-0" />

      {/* ── 3D-TILTING EYE ASSEMBLY (z-10, above droplets) ────────── */}
      <motion.div
        style={{
          rotateX: headRotateX,
          rotateY: headRotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative z-10 flex flex-col items-center justify-center gap-8"
      >
        {/* Top label */}
        <div className="flex items-center gap-3 font-mono text-xs text-[#ff0055]/80 tracking-[0.3em] uppercase">
          <span className="w-8 h-px bg-[#ff0055]/40" />
          <span>
            {isTyping
              ? 'BIOMETRIC SCAN ACTIVE'
              : 'OCULAR TRACKING SYSTEM'}
          </span>
          <span className="w-8 h-px bg-[#ff0055]/40" />
        </div>

        {/* ── PROXIMITY GLOW RING ASSEMBLY ────────────────────────── */}
        <div ref={eyeContainerRef} className="relative flex items-center justify-center w-72 h-72">

          {/* Outer dashed spinning radar ring */}
          <motion.div
            animate={isTyping ? { rotate: 360 } : { rotate: 0 }}
            transition={
              isTyping
                ? { repeat: Infinity, duration: 2.2, ease: 'linear' }
                : { duration: 0.6, ease: 'easeOut' }
            }
            style={{ opacity: proximityGlowOpacity }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#ff0055]/60"
          />

          {/* Proximity glow solid ring (pulses on typing) */}
          <motion.div
            style={{ opacity: proximityGlowOpacity }}
            animate={
              isTyping
                ? {
                    boxShadow: [
                      '0 0 30px #ff0055, 0 0 60px rgba(255,0,85,0.5)',
                      '0 0 55px #ff0055, 0 0 110px rgba(255,0,85,0.8)',
                      '0 0 30px #ff0055, 0 0 60px rgba(255,0,85,0.5)',
                    ],
                  }
                : {}
            }
            transition={
              isTyping ? { repeat: Infinity, duration: 1.6, ease: 'easeInOut' } : {}
            }
            className="absolute inset-4 rounded-full border-2 border-[#ff0055]/50 shadow-[0_0_25px_#ff0055]"
          />

          {/* Inner counter-rotating ring */}
          <motion.div
            animate={isTyping ? { rotate: -360 } : { rotate: 0 }}
            transition={
              isTyping
                ? { repeat: Infinity, duration: 3.4, ease: 'linear' }
                : { duration: 0.6, ease: 'easeOut' }
            }
            className="absolute inset-8 rounded-full border border-[#e60039]/40 border-dashed"
          />

          {/* ── BLINKING WRAPPER: scaleY collapses the entire eye on blink ── */}
          <motion.div
            style={{ scaleY: blinkScaleY }}
            className="relative flex items-center justify-center"
          >
            {/* ── OUTER EYEBALL (Iris Lens) ── */}
            <motion.div
              style={{ x: finalEyeX, y: finalEyeY }}
              className="relative flex items-center justify-center"
            >
              {/* Iris glow halo */}
              <motion.div
                animate={{
                  scale: isTyping ? 1.08 : 1.0,
                  boxShadow: isTyping
                    ? '0 0 60px #ff0055, 0 0 120px rgba(255,0,85,0.9)'
                    : '0 0 25px #ff0055',
                }}
                transition={{ duration: 0.3 }}
                className="w-36 h-36 rounded-full bg-gradient-to-tr from-[#800020] via-[#ff0055] to-pink-300 flex items-center justify-center border-2 border-pink-200 shadow-[0_0_25px_#ff0055]"
              >
                {/* ── INNER PUPIL — camera aperture on typing ── */}
                <motion.div
                  animate={{
                    scaleX: isTyping ? 0.55 : 1.0,
                    scaleY: isTyping ? 1.3 : 1.0,
                    scale: isTyping ? 1.15 : 1.0,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  style={{ x: finalPupilX, y: finalPupilY }}
                  className="w-12 h-12 rounded-full bg-[#050008] border-2 border-red-900 flex items-center justify-center relative overflow-hidden shadow-inner"
                >
                  {/* Glowing red core */}
                  <motion.div
                    animate={{ scale: isTyping ? 1.5 : 1.0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-4 h-4 rounded-full bg-red-600 shadow-[0_0_14px_#ff0000]"
                  />
                  {/* Lens glare */}
                  <div className="absolute top-1 right-1.5 w-3 h-3 rounded-full bg-white opacity-90" />
                </motion.div>
              </motion.div>

              {/* Mechanical tick marks around iris */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-1 h-3 bg-[#ff0055]/60 rounded-full origin-bottom"
                  style={{
                    transform: `rotate(${deg}deg) translateX(-50%) translateY(-80px)`,
                    left: '50%',
                    bottom: '50%',
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom status line */}
        <div className="font-mono text-[10px] text-[#ff0055]/60 tracking-widest uppercase text-center">
          {isTyping
            ? 'SCANNING CREDENTIALS — APERTURE LOCKED'
            : 'CURSOR PROXIMITY TRACKING ACTIVE'}
        </div>
      </motion.div>
    </div>
  );
};
