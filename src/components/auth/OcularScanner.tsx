'use client';

import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from 'framer-motion';

interface OcularScannerProps {
  isTyping: boolean;
  isAdminTrapdoor: boolean;
}

export const OcularScanner: React.FC<OcularScannerProps> = ({
  isTyping,
  isAdminTrapdoor,
}) => {
  const eyeContainerRef = useRef<HTMLDivElement>(null);

  // Raw motion values for eyeball & pupil tracking
  const eyeXMotion = useMotionValue(0);
  const eyeYMotion = useMotionValue(0);
  const pupilXMotion = useMotionValue(0);
  const pupilYMotion = useMotionValue(0);

  // Distance from cursor to eye center (0 = on top of eye, large = far away)
  const cursorDistance = useMotionValue(600);

  const springConfig = { stiffness: 240, damping: 22 };

  const smoothEyeX = useSpring(eyeXMotion, springConfig);
  const smoothEyeY = useSpring(eyeYMotion, springConfig);
  const smoothPupilX = useSpring(pupilXMotion, springConfig);
  const smoothPupilY = useSpring(pupilYMotion, springConfig);

  // 3D tilt for the whole panel
  const headRotateX = useSpring(useMotionValue(0), springConfig);
  const headRotateY = useSpring(useMotionValue(0), springConfig);

  // Final positions: when typing, lock gaze toward the right panel
  const finalEyeX = isTyping ? 30 : smoothEyeX;
  const finalEyeY = isTyping ? 0 : smoothEyeY;
  const finalPupilX = isTyping ? 22 : smoothPupilX;
  const finalPupilY = isTyping ? 0 : smoothPupilY;

  // Dynamic Proximity Glow: map cursor distance to border opacity & glow intensity
  // As distance decreases (cursor closer), glow flares up intensely
  const proximityGlowOpacity = useTransform(
    cursorDistance,
    [0, 80, 250, 600],
    [1.0, 0.95, 0.45, 0.15]
  );
  const proximityBoxShadowSize = useTransform(
    cursorDistance,
    [0, 80, 250, 600],
    [80, 55, 25, 8]
  );

  // Radar ring rotation: spins when typing, idles when not
  const radarRotation = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const normX = clientX / innerWidth - 0.5;
    const normY = clientY / innerHeight - 0.5;

    headRotateX.set(normY * -16);
    headRotateY.set(normX * 20);

    if (eyeContainerRef.current) {
      const rect = eyeContainerRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = clientX - eyeCenterX;
      const deltaY = clientY - eyeCenterY;

      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.hypot(deltaX, deltaY);

      // Update proximity distance for dynamic glow
      cursorDistance.set(distance);

      // Outer eyeball movement — clamped to 14px max radius
      const maxEyeRadius = 14;
      const clampedEyeDist = Math.min(maxEyeRadius, distance / 22);
      eyeXMotion.set(Math.cos(angle) * clampedEyeDist);
      eyeYMotion.set(Math.sin(angle) * clampedEyeDist);

      // Strict radial pupil containment — 18px max travel radius
      const maxPupilRadius = 18;
      const clampedPupilDist = Math.min(maxPupilRadius, distance / 12);
      pupilXMotion.set(Math.cos(angle) * clampedPupilDist);
      pupilYMotion.set(Math.sin(angle) * clampedPupilDist);
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="w-full h-full bg-black text-white relative flex flex-col items-center justify-center overflow-hidden border-r border-[#ff0055]/20 select-none"
    >
      {/* Deep ambient glow orbs */}
      <div className="absolute w-[500px] h-[500px] bg-[#ff0055]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-[#e60039]/08 rounded-full blur-2xl pointer-events-none" />

      {/* 3D-tilting eyeball container */}
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
            {isAdminTrapdoor
              ? 'ADMIN BIOMETRIC LOCK'
              : isTyping
              ? 'BIOMETRIC SCAN ACTIVE'
              : 'OCULAR TRACKING SYSTEM'}
          </span>
          <span className="w-8 h-px bg-[#ff0055]/40" />
        </div>

        {/* ─── PROXIMITY GLOW BORDER (Outer Radar Ring) ─── */}
        <div ref={eyeContainerRef} className="relative flex items-center justify-center w-72 h-72">

          {/* Spinning radar ring — only rotates when typing */}
          <motion.div
            animate={
              isTyping
                ? { rotate: 360 }
                : { rotate: 0 }
            }
            transition={
              isTyping
                ? { repeat: Infinity, duration: 2.2, ease: 'linear' }
                : { duration: 0.6, ease: 'easeOut' }
            }
            style={{ opacity: proximityGlowOpacity }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-[#ff0055]/60"
          />

          {/* Static proximity glow ring */}
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
              isTyping
                ? { repeat: Infinity, duration: 1.6, ease: 'easeInOut' }
                : {}
            }
            className="absolute inset-4 rounded-full border-2 border-[#ff0055]/50 shadow-[0_0_25px_#ff0055]"
          />

          {/* Second inner radar ring — counter-rotates when typing */}
          <motion.div
            animate={
              isTyping
                ? { rotate: -360 }
                : { rotate: 0 }
            }
            transition={
              isTyping
                ? { repeat: Infinity, duration: 3.4, ease: 'linear' }
                : { duration: 0.6, ease: 'easeOut' }
            }
            className="absolute inset-8 rounded-full border border-[#e60039]/40 border-dashed"
          />

          {/* ─── OUTER EYEBALL (Iris Lens) ─── */}
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
              {/* ─── INNER PUPIL — radially clamped, aperture-narrows on typing ─── */}
              <motion.div
                animate={{
                  scaleX: isTyping ? 0.55 : 1.0,   // narrow like camera aperture
                  scaleY: isTyping ? 1.3 : 1.0,    // tall when focused
                  scale: isTyping ? 1.15 : 1.0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                style={{ x: finalPupilX, y: finalPupilY }}
                className="w-12 h-12 rounded-full bg-[#050008] border-2 border-red-900 flex items-center justify-center relative overflow-hidden shadow-inner"
              >
                {/* Glowing core */}
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
        </div>

        {/* Bottom status line */}
        <div className="font-mono text-[10px] text-[#ff0055]/60 tracking-widest uppercase text-center">
          {isAdminTrapdoor
            ? 'ADMIN OVERRIDE: SECURITY KEY REQUIRED'
            : isTyping
            ? 'SCANNING CREDENTIALS — APERTURE LOCKED'
            : 'CURSOR PROXIMITY TRACKING ACTIVE'}
        </div>
      </motion.div>
    </div>
  );
};
