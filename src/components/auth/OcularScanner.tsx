'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ShieldAlert, ScanLine } from 'lucide-react';

interface OcularScannerProps {
  isInputFocused: boolean;
  isAdminTrapdoor: boolean;
}

export const OcularScanner: React.FC<OcularScannerProps> = ({
  isInputFocused,
  isAdminTrapdoor,
}) => {
  // Global Mouse Coordinates
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  // Eyeball Center Ref for Viewport Tracking
  const eyeContainerRef = useRef<HTMLDivElement>(null);

  // Motion values for outer eyeball & inner pupil
  const eyeXMotion = useMotionValue(0);
  const eyeYMotion = useMotionValue(0);
  const pupilXMotion = useMotionValue(0);
  const pupilYMotion = useMotionValue(0);

  const springConfig = { stiffness: 240, damping: 22 };

  // Smooth springs for outer eyeball and inner pupil
  const smoothEyeX = useSpring(eyeXMotion, springConfig);
  const smoothEyeY = useSpring(eyeYMotion, springConfig);
  const smoothPupilX = useSpring(pupilXMotion, springConfig);
  const smoothPupilY = useSpring(pupilYMotion, springConfig);

  // 3D Head & Console Rotation Springs
  const headRotateX = useSpring(useMotionValue(0), springConfig);
  const headRotateY = useSpring(useMotionValue(0), springConfig);

  // When focused on inputs, lock gaze toward the right auth form panel (+24px X, 0 Y)
  const finalEyeX = isInputFocused ? 24 : smoothEyeX;
  const finalEyeY = isInputFocused ? 0 : smoothEyeY;

  const finalPupilX = isInputFocused ? 18 : smoothPupilX;
  const finalPupilY = isInputFocused ? 0 : smoothPupilY;

  // Viewport Mouse Tracker with Strict Radial Pupil Clamping
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Normalized Mouse Position (-0.5 to 0.5)
    const normX = clientX / innerWidth - 0.5;
    const normY = clientY / innerHeight - 0.5;

    rawMouseX.set(normX);
    rawMouseY.set(normY);

    headRotateX.set(normY * -20);
    headRotateY.set(normX * 24);

    // Calculate Exact Angle & Distance from Eyeball Center to Cursor
    if (eyeContainerRef.current) {
      const rect = eyeContainerRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = clientX - eyeCenterX;
      const deltaY = clientY - eyeCenterY;

      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.hypot(deltaX, deltaY);

      // 1. Outer Eyeball Movement (Clamped inside frame radius 14px)
      const maxEyeRadius = 14;
      const clampedEyeDist = Math.min(maxEyeRadius, distance / 22);
      eyeXMotion.set(Math.cos(angle) * clampedEyeDist);
      eyeYMotion.set(Math.sin(angle) * clampedEyeDist);

      // 2. Inner Pupil Radial Containment (Math Physics Clamping)
      // maxPupilRadius = 18px max travel radius
      const maxPupilRadius = 18;
      const clampedPupilDist = Math.min(maxPupilRadius, distance / 12);

      // Strict trigonometric clamping ensures pupil NEVER clips outside eyeball bounds
      const clampedPupilX = Math.cos(angle) * clampedPupilDist;
      const clampedPupilY = Math.sin(angle) * clampedPupilDist;

      pupilXMotion.set(clampedPupilX);
      pupilYMotion.set(clampedPupilY);
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="w-full h-full bg-black text-white relative flex flex-col items-center justify-center p-8 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#ff0055]/20 select-none"
    >
      {/* Ambient Crimson Glow Orbs */}
      <div className="absolute w-96 h-96 bg-[#ff0055]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute w-72 h-72 bg-[#e60039]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Gameboy Console Container with 3D Parallax Tilt */}
      <div className="relative z-10 flex flex-col items-center justify-center perspective-1000">
        <motion.div
          style={{
            rotateX: headRotateX,
            rotateY: headRotateY,
            transformStyle: 'preserve-3d',
          }}
          className="w-[310px] gameboy-console rounded-3xl p-5 relative border-2 border-[#ff0055]/50 shadow-[0_0_40px_rgba(255,0,85,0.35)] transition-shadow duration-300"
        >
          {/* Gameboy Bezel & Top Status Lights */}
          <div className="flex items-center justify-between pb-3 border-b border-[#ff0055]/30 mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff0055] animate-pulse shadow-[0_0_8px_#ff0055]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#e60039]" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#ff0055] ml-1">
                GAMEBOY // MECHANICAL EYE
              </span>
            </div>
            <div className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#ff0055]/20 border border-[#ff0055]/40 text-[#ff0055] flex items-center gap-1">
              {isInputFocused && <ScanLine className="w-2.5 h-2.5 animate-spin text-[#ff0055]" />}
              {isAdminTrapdoor ? 'TRAPDOOR' : isInputFocused ? 'BIOMETRIC SCAN' : 'LIVE'}
            </div>
          </div>

          {/* CRT Screen Frame containing the Mechanical Eye */}
          <div 
            ref={eyeContainerRef}
            className="relative rounded-2xl bg-[#050008] border border-[#ff0055]/60 p-4 overflow-hidden shadow-inner scanlines min-h-[190px] flex flex-col justify-between items-center"
          >
            {/* Screen Top Status */}
            <div className="w-full flex justify-between items-center text-[9px] font-mono text-[#ff0055] z-10">
              <span>OCULAR SENSOR</span>
              <span className="animate-pulse text-[#ff0055]">
                {isAdminTrapdoor 
                  ? 'ADMIN CLEARANCE' 
                  : isInputFocused 
                    ? 'MODE: BIOMETRIC SCAN' 
                    : 'MODE: RADIAL CLAMP'}
              </span>
            </div>

            {/* MECHANICAL EYE WITH STRICT RADIAL PUPIL CONTAINMENT & BIOMETRIC SCAN */}
            <div className="my-2 relative flex items-center justify-center w-36 h-36 z-10">
              
              {/* Animated Biometric Scan Beam overlay when input is focused */}
              {isInputFocused && (
                <motion.div
                  initial={{ y: -60, opacity: 0 }}
                  animate={{ y: [ -60, 60, -60 ], opacity: [ 0.4, 0.9, 0.4 ] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  className="absolute w-36 h-1.5 bg-[#ff0055] shadow-[0_0_15px_#ff0055] z-30 pointer-events-none rounded-full"
                />
              )}

              {/* Outer Eyeball Frame Container */}
              <motion.div
                style={{
                  x: finalEyeX,
                  y: finalEyeY,
                }}
                className="relative w-32 h-32 flex items-center justify-center"
              >
                {/* Outer Ring Frame with Rotation on Focus */}
                <motion.svg 
                  animate={{
                    rotate: isInputFocused ? 45 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                  className="w-32 h-32 absolute inset-0" 
                  viewBox="0 0 100 100"
                >
                  <circle cx="50" cy="50" r="46" stroke="#ff0055" strokeWidth="2" fill="none" strokeDasharray="6 3" className="animate-spin-slow opacity-80" />
                  <circle cx="50" cy="50" r="38" fill="#0c0012" stroke="#ff0055" strokeWidth="2" />
                </motion.svg>

                {/* Outer Eyeball Iris Lens with Dynamic Neon Glow Pulse */}
                <motion.div
                  animate={{
                    scale: isInputFocused ? 1.05 : 1.0,
                    boxShadow: isInputFocused 
                      ? '0 0 45px #ff0055, 0 0 90px rgba(255, 0, 85, 0.8)' 
                      : '0 0 25px #ff0055',
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#800020] via-[#ff0055] to-pink-300 flex items-center justify-center border-2 border-pink-200"
                >
                  
                  {/* STRICTLY RADIALLY CLAMPED INNER PUPIL (NEVER CLIPS OUTSIDE EYEBALL) */}
                  <motion.div
                    animate={{
                      scale: isInputFocused ? 1.3 : 1.0,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    style={{
                      x: finalPupilX,
                      y: finalPupilY,
                    }}
                    className="w-9 h-9 rounded-full bg-[#050008] border-2 border-red-900 flex items-center justify-center relative overflow-hidden shadow-inner"
                  >
                    {/* Glowing Red Core */}
                    <motion.div 
                      animate={{
                        scale: isInputFocused ? 1.4 : 1.0,
                      }}
                      className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_10px_#ff0000]" 
                    />
                    {/* Lens Glare Reflection */}
                    <div className="absolute top-1 right-1.5 w-2.5 h-2.5 rounded-full bg-white opacity-90" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Screen Footer Status */}
            <div className="w-full font-mono text-[9px] text-center text-gray-400 z-10">
              {isAdminTrapdoor 
                ? 'PASSWORD REQUIRED FOR ADMIN ABDURREHMAN' 
                : isInputFocused 
                  ? 'BIOMETRIC SCAN ACTIVE: PUPIL DILATED (1.3X)' 
                  : 'PUPIL RADIALLY CLAMPED TO EYEBALL BOUNDS'}
            </div>
          </div>

          {/* Gameboy Controls Section */}
          <div className="mt-4 grid grid-cols-2 gap-3 items-center">
            {/* D-Pad */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-mono text-gray-400 mb-1">DIRECTIONAL</span>
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute w-16 h-5 bg-slate-900 rounded border border-[#ff0055]/30 shadow-inner" />
                <div className="absolute w-5 h-16 bg-slate-900 rounded border border-[#ff0055]/30 shadow-inner" />
                <div className="z-10 w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-700" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-mono text-gray-400 mb-1">ACTIONS</span>
              <div className="relative w-20 h-20 flex items-center justify-center gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff0055] to-rose-950 text-white font-bold text-[10px] flex items-center justify-center border border-[#ff0055] shadow-[0_0_8px_#ff0055] transform -translate-y-1">
                  B
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#e60039] to-red-950 text-white font-extrabold text-[10px] flex items-center justify-center border border-red-500 shadow-[0_0_8px_#e60039] transform translate-y-1">
                  A
                </div>
              </div>
            </div>
          </div>

          {/* Select / Start Slanted Pills */}
          <div className="mt-3 pt-2 border-t border-[#ff0055]/20 flex justify-center gap-4">
            <div className="px-3 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[9px] font-mono text-gray-400 transform -rotate-12">
              SELECT
            </div>
            <div className="px-3 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[9px] font-mono text-gray-400 transform -rotate-12">
              START
            </div>
          </div>
        </motion.div>

        {/* Subtext */}
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#ff0055]" />
            Cyber Simulator Ocular Grid
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs">
            {isAdminTrapdoor 
              ? 'Admin security override trapdoor active.' 
              : 'Radially clamped pupil physics & biometric scan active.'}
          </p>
        </div>
      </div>
    </div>
  );
};
