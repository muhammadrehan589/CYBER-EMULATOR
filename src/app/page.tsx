'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { User, AtSign, ArrowRight, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';

export default function SquidGameMinimalistAuth() {
  // Global Mouse Coordinates
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  // Eyeball Center Ref for Exact Viewport Tracking
  const eyeContainerRef = useRef<HTMLDivElement>(null);

  // Exact Viewport Delta Offset Motion Values
  const eyeXMotion = useMotionValue(0);
  const eyeYMotion = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 24 };

  // Refined Eyeball Translation Springs
  const smoothEyeX = useSpring(eyeXMotion, springConfig);
  const smoothEyeY = useSpring(eyeYMotion, springConfig);

  // 3D Head Rotation Springs
  const headRotateX = useSpring(useTransform(rawMouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const headRotateY = useSpring(useTransform(rawMouseX, [-0.5, 0.5], [-16, 16]), springConfig);

  // Focus State Logic
  const [isInputFocused, setIsInputFocused] = useState(false);

  // When focused on inputs, lock gaze to the right panel (+32px) and shrink eyeball
  const finalEyeX = isInputFocused ? 32 : smoothEyeX;
  const finalEyeY = isInputFocused ? 0 : smoothEyeY;
  const finalEyeScale = useSpring(isInputFocused ? 0.7 : 1.0, springConfig);

  // Refined Exact Viewport Mouse Tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Normalized Mouse Position (-0.5 to 0.5)
    rawMouseX.set(clientX / innerWidth - 0.5);
    rawMouseY.set(clientY / innerHeight - 0.5);

    // Calculate Exact Angle and Distance from Eye Center to Cursor
    if (eyeContainerRef.current) {
      const rect = eyeContainerRef.current.getBoundingClientRect();
      const eyeCenterX = rect.left + rect.width / 2;
      const eyeCenterY = rect.top + rect.height / 2;

      const deltaX = clientX - eyeCenterX;
      const deltaY = clientY - eyeCenterY;

      const angle = Math.atan2(deltaY, deltaX);
      const distance = Math.hypot(deltaX, deltaY);

      // Max pupil travel radius inside visor
      const maxRadius = 26;
      const clampedRadius = Math.min(maxRadius, distance / 15);

      const targetX = Math.cos(angle) * clampedRadius;
      const targetY = Math.sin(angle) * clampedRadius;

      eyeXMotion.set(targetX);
      eyeYMotion.set(targetY);
    }
  };

  // Form State (ONLY Name & Username)
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loggingIn' | 'success'>('idle');

  const isFormValid = name.trim().length > 0 && username.trim().length > 0;

  // Runaway button flee logic
  const makeButtonFlee = () => {
    if (!isFormValid) {
      const randomX = (Math.random() - 0.5) * 260;
      const randomY = (Math.random() - 0.5) * 160;
      setButtonOffset({ x: randomX, y: randomY });
    }
  };

  useEffect(() => {
    if (isFormValid) {
      setButtonOffset({ x: 0, y: 0 });
    }
  }, [isFormValid]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      makeButtonFlee();
      return;
    }
    setLoginStatus('loggingIn');
    setTimeout(() => {
      setLoginStatus('success');
    }, 1300);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden font-sans select-none bg-black text-white"
    >
      {/* LEFT PANEL: Pitch Black (#000000) with Refined Tracking Character */}
      <div className="lg:w-1/2 h-full bg-black text-white relative flex flex-col items-center justify-center p-8 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#ff0055]/20">
        
        {/* Crimson Glow Orb Accent */}
        <div className="absolute w-96 h-96 bg-[#ff0055]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Minimalist Robot / Guard Head Container */}
        <div className="relative z-10 flex flex-col items-center justify-center perspective-1000">
          <motion.div
            style={{
              rotateX: headRotateX,
              rotateY: headRotateY,
              transformStyle: 'preserve-3d',
            }}
            className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-[#09030a] border-2 border-[#ff0055]/50 p-6 flex flex-col items-center justify-between shadow-[0_0_40px_rgba(255,0,85,0.3)] relative overflow-hidden"
          >
            {/* Top Status Lights */}
            <div className="w-full flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff0055] animate-ping" />
                <span className="w-2 h-2 rounded-full bg-[#e60039]" />
              </div>
              <span className="text-[10px] font-mono text-[#ff0055] tracking-widest uppercase">
                {isInputFocused ? 'OCULAR: FORM FOCUS' : 'OCULAR: LIVE TRACKING'}
              </span>
            </div>

            {/* Character Visor & Mechanical Eye */}
            <div 
              ref={eyeContainerRef}
              className="w-full h-36 rounded-2xl bg-[#030005] border border-[#ff0055]/40 p-4 relative flex items-center justify-center overflow-hidden shadow-inner"
            >
              {/* Visor Grid Background */}
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#ff0055_1px,transparent_1px),linear-gradient(to_bottom,#ff0055_1px,transparent_1px)] bg-[size:16px_16px]" />

              {/* Eye Outer Ring */}
              <div className="relative w-44 h-20 rounded-full bg-[#120410] border border-[#ff0055]/60 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(255,0,85,0.4)]">
                
                {/* Refined Mouse Tracking Eyeball */}
                <motion.div
                  style={{
                    x: finalEyeX,
                    y: finalEyeY,
                    scale: finalEyeScale,
                  }}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#800020] via-[#ff0055] to-pink-300 flex items-center justify-center shadow-[0_0_25px_#ff0055] relative border border-pink-200"
                >
                  {/* Inner Dark Pupil */}
                  <div className="w-7 h-7 rounded-full bg-[#050008] border-2 border-red-900 flex items-center justify-center relative overflow-hidden shadow-inner">
                    <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_#ff0000]" />
                    {/* Glare Reflection */}
                    <div className="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-white opacity-90" />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Bottom Speaker Detail */}
            <div className="w-full flex items-center justify-center gap-1.5 pt-2">
              <div className="w-8 h-1 bg-[#ff0055]/40 rounded-full" />
              <div className="w-12 h-1 bg-[#ff0055] rounded-full shadow-[0_0_6px_#ff0055]" />
              <div className="w-8 h-1 bg-[#ff0055]/40 rounded-full" />
            </div>
          </motion.div>

          {/* Subtext */}
          <div className="mt-8 text-center">
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#ff0055]" />
              Squid Game Ocular Grid
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">
              Refined viewport eye tracking active. Move cursor to test.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Pitch Black Dark Minimalist Auth Form (No White Panels) */}
      <div className="lg:w-1/2 h-full bg-[#030005] text-white relative flex flex-col justify-between p-8 lg:p-16 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-lg tracking-tight text-white">
            SQUID<span className="text-[#ff0055]">//</span>GAME
          </span>
          <span className="text-xs font-mono text-[#ff0055] px-2.5 py-1 rounded bg-[#ff0055]/20 border border-[#ff0055]/40">
            SYSTEM v456
          </span>
        </div>

        {/* Center Auth Form */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          
          {/* Header in Bright Neon Pink */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#ff0055] drop-shadow-[0_0_12px_rgba(255,0,85,0.6)]">
              Welcome back!
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              Please enter your details to sign in.
            </p>
          </div>

          {/* Login Success State */}
          {loginStatus === 'success' ? (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-10 flex flex-col items-center justify-center text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-[#ff0055]/20 border-2 border-[#ff0055] flex items-center justify-center shadow-[0_0_25px_#ff0055]">
                <CheckCircle2 className="w-10 h-10 text-[#ff0055]" />
              </div>
              <h2 className="text-2xl font-bold text-white">AUTHENTICATED</h2>
              <p className="text-sm text-zinc-300 max-w-xs">
                Player <span className="font-bold text-[#ff0055]">{name}</span> ({username}) access granted.
              </p>
              <button 
                onClick={() => setLoginStatus('idle')}
                className="mt-4 px-6 py-3 rounded-xl text-xs font-bold bg-[#ff0055] text-white hover:bg-[#e60039] transition-all shadow-[0_0_15px_#ff0055]"
              >
                Sign Out
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              
              {/* NAME FIELD ONLY */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block flex justify-between">
                  <span>Name</span>
                  <span className="text-[10px] font-mono text-[#ff0055]">REQUIRED</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ff0055]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Abdurrehman"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl text-sm focus:outline-none focus:border-[#ff0055] focus:ring-2 focus:ring-[#ff0055]/30 transition-all"
                  />
                </div>
              </div>

              {/* USERNAME FIELD ONLY */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block flex justify-between">
                  <span>Username</span>
                  <span className="text-[10px] font-mono text-[#ff0055]">PLAYER_ID</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ff0055]">
                    <AtSign className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setIsInputFocused(false)}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="@abdurrehman"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl text-sm focus:outline-none focus:border-[#ff0055] focus:ring-2 focus:ring-[#ff0055]/30 transition-all"
                  />
                </div>
              </div>

              {/* Fleeing Warning Hint */}
              <div className="min-h-[20px]">
                {!isFormValid && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-[#ff0055] flex items-center gap-1.5 font-medium"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Please fill in both Name and Username to click Log in.</span>
                  </motion.div>
                )}
              </div>

              {/* RUNAWAY NEON PINK/RED 'LOG IN' BUTTON */}
              <div className="relative h-14 flex items-center justify-center">
                <motion.div
                  animate={{
                    x: buttonOffset.x,
                    y: buttonOffset.y,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                  }}
                  onMouseEnter={makeButtonFlee}
                  onMouseMove={makeButtonFlee}
                  className="w-full"
                >
                  <button
                    type="submit"
                    disabled={loginStatus === 'loggingIn'}
                    className={`w-full py-4 px-6 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                      isFormValid
                        ? 'bg-gradient-to-r from-[#ff0055] via-[#e60039] to-[#ff0055] text-white hover:shadow-[0_0_25px_#ff0055] cursor-pointer active:scale-95 border border-white/20'
                        : 'bg-gradient-to-r from-red-950 to-pink-950 text-pink-300/40 border border-pink-500/20 cursor-not-allowed'
                    }`}
                  >
                    {loginStatus === 'loggingIn' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Log in
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.div>
              </div>
            </form>
          )}
        </div>

        {/* Bottom Minimalist Footer */}
        <div className="text-center text-xs text-zinc-500 border-t border-zinc-900 pt-6">
          Need access? Contact Frontman Administrator.
        </div>
      </div>
    </div>
  );
}
