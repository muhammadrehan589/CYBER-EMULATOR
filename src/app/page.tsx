'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  User, 
  Hash, 
  Circle, 
  Triangle, 
  Square, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Radio
} from 'lucide-react';

// Floating particles component with Squid Game red/pink palette
const FloatingParticles = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; duration: number; delay: number }>>([]);

  useEffect(() => {
    const colors = ['#ff0055', '#e60039', '#ff007f', '#ff1493', '#990022'];
    const generated = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 4,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
          }}
          animate={{
            y: ['0%', '-120%'],
            opacity: [0, 0.7, 0],
            scale: [1, 1.4, 0.7],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

export default function SquidGameLoginPage() {
  // Mouse tracking for 3D Parallax Console & Guard Eye Movement
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const springConfig = { stiffness: 120, damping: 22 };

  // Console 3D Tilt
  const rotateX = useSpring(useTransform(rawMouseY, [-0.5, 0.5], [16, -16]), springConfig);
  const rotateY = useSpring(useTransform(rawMouseX, [-0.5, 0.5], [-16, 16]), springConfig);
  const translateZ = useSpring(useTransform(rawMouseY, [-0.5, 0.5], [8, -8]), springConfig);

  // Guard Head & Mask Tracking
  const guardHeadX = useSpring(useTransform(rawMouseX, [-0.5, 0.5], [-22, 22]), springConfig);
  const guardHeadY = useSpring(useTransform(rawMouseY, [-0.5, 0.5], [-16, 16]), springConfig);
  const guardMaskRotate = useSpring(useTransform(rawMouseX, [-0.5, 0.5], [-18, 18]), springConfig);
  const guardSymbolX = useSpring(useTransform(rawMouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  const guardSymbolY = useSpring(useTransform(rawMouseY, [-0.5, 0.5], [-8, 8]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Map to -0.5 to 0.5
    rawMouseX.set(clientX / innerWidth - 0.5);
    rawMouseY.set(clientY / innerHeight - 0.5);
  };

  // Form State: ONLY Name & Username
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loggingIn' | 'success'>('idle');
  const [activeConsoleBtn, setActiveConsoleBtn] = useState<string | null>(null);

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
    }, 1500);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen h-screen flex flex-col bg-[#05050a] text-white relative overflow-hidden font-sans select-none"
    >
      {/* Squid Game Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 squid-grid animate-grid z-0" />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#ff0055]/20 via-[#e60039]/10 to-transparent pointer-events-none z-0" />

      {/* Crimson Glow Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#ff0055]/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#e60039]/15 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Navigation Header (Middle Nav Links Removed) */}
      <header className="h-16 px-6 lg:px-12 flex items-center justify-between border-b border-[#ff0055]/30 bg-[#05050a]/85 backdrop-blur-md z-30 shrink-0">
        {/* Left Side: Logo/Title with Iconic Squid Game Shapes */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#ff0055] to-[#e60039] shadow-[0_0_15px_#ff0055]">
            <Gamepad2 className="w-5 h-5 text-black" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-wider text-white drop-shadow-[0_0_10px_#ff0055]">
              SQUID<span className="text-[#ff0055]">//</span>GAME
            </span>
            {/* Iconic Shapes */}
            <div className="flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-[#1c0816] border border-[#ff0055]/40 text-[#ff0055]">
              <Circle className="w-3 h-3 fill-current" />
              <Triangle className="w-3 h-3 fill-current" />
              <Square className="w-3 h-3 fill-current" />
            </div>
          </div>
        </div>

        {/* Right Side: Status & Enter Buttons */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c0816] border border-[#ff0055]/40 text-xs font-mono text-[#ff0055]">
            <span className="w-2 h-2 rounded-full bg-[#ff0055] animate-ping" />
            GAME #456: READY
          </div>
          <button className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#ff0055] to-[#e60039] hover:from-[#e60039] hover:to-[#ff0055] text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,0,85,0.5)] border border-white/20">
            ENTER GAME
          </button>
        </div>
      </header>

      {/* Main 50/50 Split Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl w-full mx-auto p-6 lg:p-12 z-20 relative overflow-hidden">
        
        {/* LEFT SIDE: Smaller Parallax Retro Gaming Console with Guard Cursor Tracking */}
        <div className="flex items-center justify-center relative perspective-1000">
          <motion.div
            style={{
              rotateX,
              rotateY,
              translateZ,
              transformStyle: 'preserve-3d',
            }}
            /* Noticeably smaller console width: w-[310px] */
            className="w-[310px] glass-console rounded-2xl p-4 relative border-2 border-[#ff0055]/50 shadow-[0_0_35px_rgba(255,0,85,0.4)] transition-shadow duration-300"
          >
            {/* Top Metallic Console Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#ff0055]/30 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff0055] animate-pulse shadow-[0_0_6px_#ff0055]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#e60039]" />
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#ff0055] ml-1">
                  GUARD-CAM // 001
                </span>
              </div>
              <div className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#ff0055]/20 border border-[#ff0055]/40 text-[#ff0055]">
                LIVE
              </div>
            </div>

            {/* CRT Display Screen containing Squid Game Guard Illustration */}
            <div className="relative rounded-xl bg-[#070308] border border-[#ff0055]/60 p-3 overflow-hidden shadow-inner scanlines min-h-[170px] flex flex-col justify-between items-center">
              {/* Screen Top Status */}
              <div className="w-full flex justify-between items-center text-[9px] font-mono text-[#ff0055] z-10">
                <span>SECTOR: 06</span>
                <span className="animate-pulse text-red-500">● TARGET LOCK</span>
                <span>P456</span>
              </div>

              {/* SQUID GAME GUARD ILLUSTRATION (Mouse Cursor Tracking) */}
              <div className="my-2 relative flex items-center justify-center w-32 h-32 z-10">
                {/* Outer Red Hood */}
                <motion.div 
                  style={{ x: guardHeadX, y: guardHeadY, rotate: guardMaskRotate }}
                  className="relative w-28 h-28 rounded-t-full rounded-b-3xl bg-gradient-to-b from-[#ff0055] via-[#e60039] to-[#80001f] p-1.5 shadow-[0_0_25px_rgba(255,0,85,0.6)] flex items-center justify-center"
                >
                  {/* Hood Seam & Shadow Details */}
                  <div className="absolute top-0 w-full h-full rounded-t-full border-t-2 border-pink-400/40 pointer-events-none" />
                  
                  {/* Black Oval Face Mask Shield */}
                  <div className="w-22 h-22 w-full h-full rounded-t-[40%] rounded-b-[45%] bg-[#08080c] border-2 border-[#1a1a24] flex items-center justify-center relative overflow-hidden shadow-inner">
                    {/* Face Shield Gloss Highlight */}
                    <div className="absolute top-1 left-2 w-12 h-4 bg-gradient-to-b from-white/20 to-transparent rounded-full transform -rotate-12 pointer-events-none" />
                    
                    {/* Guard Symbol: White Circle (Continuously Tracks Cursor) */}
                    <motion.div 
                      style={{ x: guardSymbolX, y: guardSymbolY }}
                      className="relative flex items-center justify-center"
                    >
                      <svg className="w-12 h-12" viewBox="0 0 100 100">
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="36" 
                          stroke="white" 
                          strokeWidth="10" 
                          fill="none" 
                          className="drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                        />
                      </svg>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Screen Footer Status */}
              <div className="w-full font-mono text-[9px] text-center text-gray-400 z-10">
                {activeConsoleBtn ? `COMMAND [${activeConsoleBtn}] LOGGED` : 'GUARD EYE: TRACKING OPERATOR'}
              </div>
            </div>

            {/* Console Control Panel Section */}
            <div className="mt-4 grid grid-cols-2 gap-2 items-center">
              
              {/* Left Side: D-PAD */}
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-mono text-gray-400 mb-1">NAV PAD</span>
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <div className="absolute w-16 h-5 bg-slate-900 rounded border border-[#ff0055]/30 shadow-inner" />
                  <div className="absolute w-5 h-16 bg-slate-900 rounded border border-[#ff0055]/30 shadow-inner" />
                  
                  {/* Up */}
                  <button 
                    onClick={() => setActiveConsoleBtn('UP')}
                    className="absolute top-0.5 w-5 h-5 bg-slate-800 hover:bg-[#ff0055] text-gray-300 hover:text-black rounded-t text-[10px] flex items-center justify-center transition-all"
                  >
                    ▲
                  </button>
                  {/* Down */}
                  <button 
                    onClick={() => setActiveConsoleBtn('DOWN')}
                    className="absolute bottom-0.5 w-5 h-5 bg-slate-800 hover:bg-[#ff0055] text-gray-300 hover:text-black rounded-b text-[10px] flex items-center justify-center transition-all"
                  >
                    ▼
                  </button>
                  {/* Left */}
                  <button 
                    onClick={() => setActiveConsoleBtn('LEFT')}
                    className="absolute left-0.5 w-5 h-5 bg-slate-800 hover:bg-[#ff0055] text-gray-300 hover:text-black rounded-l text-[10px] flex items-center justify-center transition-all"
                  >
                    ◀
                  </button>
                  {/* Right */}
                  <button 
                    onClick={() => setActiveConsoleBtn('RIGHT')}
                    className="absolute right-0.5 w-5 h-5 bg-slate-800 hover:bg-[#ff0055] text-gray-300 hover:text-black rounded-r text-[10px] flex items-center justify-center transition-all"
                  >
                    ▶
                  </button>
                  <div className="z-10 w-3 h-3 rounded-full bg-slate-950" />
                </div>
              </div>

              {/* Right Side: ABXY Action Buttons */}
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-mono text-gray-400 mb-1">ACTIONS</span>
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <button 
                    onClick={() => setActiveConsoleBtn('Y')}
                    className="absolute top-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-[#ff0055] to-rose-950 hover:scale-110 text-white font-bold text-[10px] flex items-center justify-center border border-[#ff0055] shadow-[0_0_8px_#ff0055] transition-all"
                  >
                    Y
                  </button>
                  <button 
                    onClick={() => setActiveConsoleBtn('A')}
                    className="absolute bottom-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-[#e60039] to-red-950 hover:scale-110 text-white font-bold text-[10px] flex items-center justify-center border border-red-500 shadow-[0_0_8px_#e60039] transition-all"
                  >
                    A
                  </button>
                  <button 
                    onClick={() => setActiveConsoleBtn('X')}
                    className="absolute left-0.5 w-6 h-6 rounded-full bg-slate-800 hover:scale-110 text-pink-400 font-bold text-[10px] flex items-center justify-center border border-pink-500/50 transition-all"
                  >
                    X
                  </button>
                  <button 
                    onClick={() => setActiveConsoleBtn('B')}
                    className="absolute right-0.5 w-6 h-6 rounded-full bg-slate-800 hover:scale-110 text-pink-400 font-bold text-[10px] flex items-center justify-center border border-pink-500/50 transition-all"
                  >
                    B
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Utility Controls */}
            <div className="mt-3 pt-2 border-t border-[#ff0055]/20 flex justify-center gap-4">
              <button 
                onClick={() => setActiveConsoleBtn('SELECT')}
                className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 hover:border-[#ff0055] text-[9px] font-mono text-gray-400 hover:text-[#ff0055] transition-all"
              >
                SELECT
              </button>
              <button 
                onClick={() => setActiveConsoleBtn('START')}
                className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 hover:border-[#ff0055] text-[9px] font-mono text-gray-400 hover:text-[#ff0055] transition-all"
              >
                START
              </button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Squid Game Auth Form (ONLY Name and Username) */}
        <div className="flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md glass-panel rounded-3xl p-8 lg:p-10 relative overflow-hidden border border-[#ff0055]/40 shadow-[0_0_40px_rgba(255,0,85,0.25)]"
          >
            {/* Top Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="w-5 h-5 text-[#ff0055]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#ff0055]">
                  PLAYER ENTRY PROTOCOL
                </span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-[#ff0055]">
                Player Registration
              </h2>
              <p className="text-xs text-gray-300 mt-1">
                Enter your Name & Player Username to participate in Game #456.
              </p>
            </div>

            {/* Login Success Overlay */}
            {loginStatus === 'success' ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#ff0055]/20 border-2 border-[#ff0055] flex items-center justify-center shadow-[0_0_25px_#ff0055]">
                  <CheckCircle2 className="w-10 h-10 text-[#ff0055]" />
                </div>
                <h3 className="text-xl font-bold text-[#ff0055]">PLAYER REGISTERED</h3>
                <p className="text-xs text-gray-300 max-w-xs">
                  Welcome to the arena, <span className="text-white font-bold">{name}</span> ({username}). Preparing Round 1...
                </p>
                <button 
                  onClick={() => setLoginStatus('idle')}
                  className="mt-4 px-6 py-2 rounded-xl text-xs font-bold bg-[#ff0055] hover:bg-[#e60039] text-white transition-all shadow-[0_0_15px_#ff0055]"
                >
                  Register Another Player
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                
                {/* Name Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-200 flex items-center justify-between">
                    <span>PLAYER NAME</span>
                    <span className="text-[10px] font-mono text-[#ff0055]">REQUIRED</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seong Gi-hun"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#0a050d]/80 rounded-xl border border-[#ff0055]/40 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff0055] focus:ring-2 focus:ring-[#ff0055]/30 transition-all"
                    />
                  </div>
                </div>

                {/* Username Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-200 flex items-center justify-between">
                    <span>PLAYER USERNAME</span>
                    <span className="text-[10px] font-mono text-[#ff0055]">PLAYER_ID</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-500">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Player456"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#0a050d]/80 rounded-xl border border-[#ff0055]/40 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff0055] focus:ring-2 focus:ring-[#ff0055]/30 transition-all"
                    />
                  </div>
                </div>

                {/* Fleeing Warning Hint */}
                <div className="min-h-[20px]">
                  {!isFormValid && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[11px] font-mono text-[#ff0055] flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Enter Name & Username to capture the Join button!</span>
                    </motion.div>
                  )}
                </div>

                {/* RUNAWAY BUTTON WRAPPER */}
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
                      className={`w-full py-3.5 px-6 rounded-xl font-bold uppercase tracking-wider text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                        isFormValid
                          ? 'bg-gradient-to-r from-[#ff0055] via-[#e60039] to-[#ff007f] hover:shadow-[0_0_25px_#ff0055] text-white cursor-pointer active:scale-95 border border-white/20'
                          : 'bg-gradient-to-r from-red-950 to-pink-950 text-pink-300/60 border border-pink-500/20 cursor-not-allowed'
                      }`}
                    >
                      {loginStatus === 'loggingIn' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          CONFIRMING PLAYER ENTRY...
                        </>
                      ) : (
                        <>
                          JOIN THE GAME
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.div>
                </div>
              </form>
            )}

            {/* Footer info */}
            <div className="mt-8 pt-4 border-t border-[#ff0055]/20 text-center text-xs text-gray-400">
              Need assistance?{' '}
              <a href="#help" className="text-[#ff0055] hover:underline font-semibold">
                Contact Frontman Desk
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
