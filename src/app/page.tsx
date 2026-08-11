'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  User, 
  Mail, 
  Circle, 
  Triangle, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';

// Digital Rain / Droplets Component (Left side: Crimson Red, Right side: Cyan/Teal)
const MatrixDigitalRain = () => {
  const [droplets, setDroplets] = useState<Array<{ id: number; x: number; isLeft: boolean; duration: number; delay: number; size: number; characters: string }>>([]);

  useEffect(() => {
    const chars = '01456OΔ□XЖ¥$#';
    const generated = Array.from({ length: 42 }).map((_, i) => {
      const xPercent = (i / 42) * 100 + (Math.random() * 2 - 1);
      const isLeft = xPercent < 50;
      const charCount = Math.floor(Math.random() * 8) + 4;
      let randomString = '';
      for (let j = 0; j < charCount; j++) {
        randomString += chars[Math.floor(Math.random() * chars.length)];
      }
      return {
        id: i,
        x: xPercent,
        isLeft,
        duration: Math.random() * 6 + 5,
        delay: Math.random() * 4,
        size: Math.random() * 4 + 10,
        characters: randomString,
      };
    });
    setDroplets(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {droplets.map((droplet) => (
        <motion.div
          key={droplet.id}
          className="absolute font-mono flex flex-col items-center leading-none"
          style={{
            left: `${droplet.x}%`,
            top: '-10%',
            fontSize: `${droplet.size}px`,
            color: droplet.isLeft ? '#ff0055' : '#00f0ff',
            textShadow: droplet.isLeft 
              ? '0 0 8px rgba(255, 0, 85, 0.8)' 
              : '0 0 8px rgba(0, 240, 255, 0.8)',
          }}
          animate={{
            y: ['0vh', '110vh'],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: droplet.duration,
            repeat: Infinity,
            delay: droplet.delay,
            ease: 'linear',
          }}
        >
          {droplet.characters.split('').map((char, index) => (
            <span 
              key={index}
              style={{
                opacity: (index + 1) / droplet.characters.length,
                color: index === droplet.characters.length - 1 ? '#ffffff' : undefined,
              }}
            >
              {char}
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default function CyberEmulatorPage() {
  // Global Mouse Tracking
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const springConfig = { stiffness: 140, damping: 20 };

  // Gameboy 3D Tilt
  const rotateX = useSpring(useTransform(rawMouseY, [-0.5, 0.5], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(rawMouseX, [-0.5, 0.5], [-14, 14]), springConfig);
  const translateZ = useSpring(useTransform(rawMouseY, [-0.5, 0.5], [6, -6]), springConfig);

  // Focus State Logic for Mechanical Eye
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Eye Tracking Motions
  const eyeTargetX = useTransform(rawMouseX, [-0.5, 0.5], [-26, 26]);
  const eyeTargetY = useTransform(rawMouseY, [-0.5, 0.5], [-18, 18]);

  const smoothEyeX = useSpring(eyeTargetX, springConfig);
  const smoothEyeY = useSpring(eyeTargetY, springConfig);

  // When focused, lock eye to gaze towards right side (+28px) and shrink scale
  const finalEyeX = isInputFocused ? 28 : smoothEyeX;
  const finalEyeY = isInputFocused ? 0 : smoothEyeY;
  const finalEyeScale = useSpring(isInputFocused ? 0.65 : 1.0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    rawMouseX.set(clientX / innerWidth - 0.5);
    rawMouseY.set(clientY / innerHeight - 0.5);
  };

  // Auth Form State
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
    }, 1400);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen h-screen flex flex-col bg-black text-white relative overflow-hidden font-sans select-none"
    >
      {/* Background Matrix Digital Rain (Crimson Left / Cyan Right) */}
      <MatrixDigitalRain />

      {/* Background Side Glow Accents */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#ff0055]/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-[#00f0ff]/15 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Top Center Minimalist Header (All Nav Links Removed) */}
      <header className="h-16 px-6 lg:px-12 flex items-center justify-between border-b border-[#ff0055]/30 bg-black/80 backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff0055] animate-ping" />
          <span className="text-xs font-mono text-gray-400">GRID MONITORED</span>
        </div>

        {/* Minimalist Top Center Header */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-[#ff0055] flex items-center justify-center bg-[#ff0055]/10 shadow-[0_0_12px_#ff0055]">
            <Circle className="w-4 h-4 text-[#ff0055]" />
          </div>
          <span className="font-mono text-sm sm:text-base font-extrabold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-[#ff0055] via-white to-[#00f0ff] drop-shadow-[0_0_10px_#ff0055]">
            GRID ACCESS CONTROL
          </span>
          <div className="w-7 h-7 border-2 border-[#00f0ff] rotate-45 flex items-center justify-center bg-[#00f0ff]/10 shadow-[0_0_12px_#00f0ff]">
            <Triangle className="w-3.5 h-3.5 text-[#00f0ff] -rotate-45" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#ff0055]/20 border border-[#ff0055]/40 text-[#ff0055]">
            SYS.v456
          </span>
        </div>
      </header>

      {/* Main 50/50 Split Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-6xl w-full mx-auto p-6 lg:p-12 z-20 relative overflow-hidden">
        
        {/* LEFT PANEL: Sleek Dark Gameboy Console & Mechanical Eye */}
        <div className="flex items-center justify-center relative perspective-1000">
          <motion.div
            style={{
              rotateX,
              rotateY,
              translateZ,
              transformStyle: 'preserve-3d',
            }}
            className="w-[310px] gameboy-console rounded-3xl p-5 relative border-2 border-[#ff0055]/50 shadow-2xl transition-shadow duration-300"
          >
            {/* Gameboy Top Bezel & Power LED */}
            <div className="flex items-center justify-between pb-3 border-b border-[#ff0055]/30 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff0055] animate-pulse shadow-[0_0_8px_#ff0055]" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#ff0055]">
                  GAMEBOY // MECHANICAL EYE
                </span>
              </div>
              <div className="text-[9px] font-mono text-cyan-400">
                {isInputFocused ? 'TARGET LOCKED →' : 'TRACKING'}
              </div>
            </div>

            {/* Gameboy Screen Container */}
            <div className="relative rounded-2xl bg-[#050008] border border-[#ff0055]/60 p-4 overflow-hidden shadow-inner scanlines min-h-[190px] flex flex-col justify-between items-center">
              {/* Screen Top Status */}
              <div className="w-full flex justify-between items-center text-[9px] font-mono text-[#ff0055] z-10">
                <span>OCULAR SENSOR</span>
                <span className="animate-pulse text-cyan-400">
                  {isInputFocused ? 'MODE: FORM FOCUS' : 'MODE: SCANNING'}
                </span>
              </div>

              {/* MECHANICAL RED EYE (Mouse Tracking + Focus Shrink Logic) */}
              <div className="my-2 relative flex items-center justify-center w-36 h-36 z-10">
                <motion.div
                  style={{
                    scale: finalEyeScale,
                  }}
                  className="relative w-32 h-32 flex items-center justify-center"
                >
                  {/* Outer Metallic Ring Frame */}
                  <svg className="w-32 h-32 absolute inset-0" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" stroke="#ff0055" strokeWidth="2" fill="none" strokeDasharray="6 3" className="animate-spin-slow opacity-80" />
                    <circle cx="50" cy="50" r="42" stroke="#00f0ff" strokeWidth="1" fill="none" opacity="0.4" />
                    <circle cx="50" cy="50" r="38" fill="#0c0012" stroke="#ff0055" strokeWidth="2" />
                  </svg>

                  {/* Movable Mechanical Eyeball & Pupil */}
                  <motion.div
                    style={{
                      x: finalEyeX,
                      y: finalEyeY,
                    }}
                    className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#990022] via-[#ff0055] to-[#ff4d88] flex items-center justify-center shadow-[0_0_25px_#ff0055] border-2 border-red-400"
                  >
                    {/* Mechanical Iris Aperture Lines */}
                    <div className="absolute inset-0 rounded-full border border-pink-300/40" />
                    <div className="absolute w-16 h-16 rounded-full border border-black/40" />

                    {/* Dark Center Pupil & Lens Reflections */}
                    <div className="w-9 h-9 rounded-full bg-[#050008] border-2 border-red-900 flex items-center justify-center relative overflow-hidden shadow-inner">
                      <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_#ff0000]" />
                      {/* Gloss Glint */}
                      <div className="absolute top-1 right-1.5 w-2.5 h-2.5 rounded-full bg-white/80 blur-[0.5px]" />
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              {/* Screen Bottom Status text */}
              <div className="w-full font-mono text-[9px] text-center text-gray-400 z-10">
                {activeConsoleBtn 
                  ? `INPUT [${activeConsoleBtn}] REGISTERED` 
                  : isInputFocused 
                    ? 'EYE GAZE LOCKED ON REGISTRATION FORM' 
                    : 'MOVING EYE TRACKS CURSOR'}
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
                  
                  <button 
                    onClick={() => setActiveConsoleBtn('UP')}
                    className="absolute top-0.5 w-5 h-5 bg-slate-800 hover:bg-[#ff0055] text-gray-300 hover:text-black rounded-t text-[10px] flex items-center justify-center transition-all"
                  >
                    ▲
                  </button>
                  <button 
                    onClick={() => setActiveConsoleBtn('DOWN')}
                    className="absolute bottom-0.5 w-5 h-5 bg-slate-800 hover:bg-[#ff0055] text-gray-300 hover:text-black rounded-b text-[10px] flex items-center justify-center transition-all"
                  >
                    ▼
                  </button>
                  <button 
                    onClick={() => setActiveConsoleBtn('LEFT')}
                    className="absolute left-0.5 w-5 h-5 bg-slate-800 hover:bg-[#ff0055] text-gray-300 hover:text-black rounded-l text-[10px] flex items-center justify-center transition-all"
                  >
                    ◀
                  </button>
                  <button 
                    onClick={() => setActiveConsoleBtn('RIGHT')}
                    className="absolute right-0.5 w-5 h-5 bg-slate-800 hover:bg-[#ff0055] text-gray-300 hover:text-black rounded-r text-[10px] flex items-center justify-center transition-all"
                  >
                    ▶
                  </button>
                  <div className="z-10 w-3 h-3 rounded-full bg-slate-950" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-mono text-gray-400 mb-1">BUTTONS</span>
                <div className="relative w-20 h-20 flex items-center justify-center gap-3">
                  <button 
                    onClick={() => setActiveConsoleBtn('B')}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff0055] to-rose-950 hover:scale-110 text-white font-bold text-[10px] flex items-center justify-center border border-[#ff0055] shadow-[0_0_8px_#ff0055] transition-all transform -translate-y-1"
                  >
                    B
                  </button>
                  <button 
                    onClick={() => setActiveConsoleBtn('A')}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00f0ff] to-cyan-950 hover:scale-110 text-black font-extrabold text-[10px] flex items-center justify-center border border-[#00f0ff] shadow-[0_0_8px_#00f0ff] transition-all transform translate-y-1"
                  >
                    A
                  </button>
                </div>
              </div>
            </div>

            {/* Gameboy Select / Start Slanted Pills */}
            <div className="mt-3 pt-2 border-t border-[#ff0055]/20 flex justify-center gap-4">
              <button 
                onClick={() => setActiveConsoleBtn('SELECT')}
                className="px-3 py-0.5 rounded-full bg-slate-900 border border-slate-700 hover:border-[#ff0055] text-[9px] font-mono text-gray-400 hover:text-[#ff0055] transition-all transform -rotate-12"
              >
                SELECT
              </button>
              <button 
                onClick={() => setActiveConsoleBtn('START')}
                className="px-3 py-0.5 rounded-full bg-slate-900 border border-slate-700 hover:border-[#00f0ff] text-[9px] font-mono text-gray-400 hover:text-[#00f0ff] transition-all transform -rotate-12"
              >
                START
              </button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT PANEL: Dark Glassmorphism Auth Form (NAME & USERNAME) */}
        <div className="flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md dual-glass-panel rounded-3xl p-8 lg:p-10 relative overflow-hidden"
          >
            {/* Top Glowing Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-[#00f0ff]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#00f0ff]">
                  SQUID GAME SECURITY
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#ff0055] via-white to-[#00f0ff]">
                REGISTRATION / AUTHENTICATION
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Enter your details to request access to the grid.
              </p>
            </div>

            {/* Login Success View */}
            {loginStatus === 'success' ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-10 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#00f0ff]/20 border-2 border-[#00f0ff] flex items-center justify-center shadow-[0_0_25px_#00f0ff]">
                  <CheckCircle2 className="w-10 h-10 text-[#00f0ff]" />
                </div>
                <h3 className="text-xl font-bold text-[#00f0ff]">AUTHENTICATED</h3>
                <p className="text-xs text-gray-300 max-w-xs">
                  Welcome to the Grid, <span className="text-white font-bold">{name}</span> ({username}). Session initiated.
                </p>
                <button 
                  onClick={() => setLoginStatus('idle')}
                  className="mt-4 px-6 py-2 rounded-xl text-xs font-bold bg-[#ff0055] hover:bg-[#00f0ff] hover:text-black transition-all shadow-[0_0_15px_#ff0055]"
                >
                  New Session
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                
                {/* NAME FIELD (Placeholder: "Abdurrehman", User Icon) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                    <span>NAME</span>
                    <span className="text-[10px] font-mono text-[#ff0055]">REQUIRED</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#ff0055]">
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
                      className="w-full pl-10 pr-4 py-3 bg-[#05000a]/80 rounded-xl border border-[#ff0055]/40 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00f0ff] focus:ring-2 focus:ring-[#00f0ff]/30 transition-all"
                    />
                  </div>
                </div>

                {/* USERNAME FIELD (Mail Icon) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
                    <span>USERNAME</span>
                    <span className="text-[10px] font-mono text-[#00f0ff]">PLAYER_ID</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#00f0ff]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="@abdurrehman"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#05000a]/80 rounded-xl border border-[#00f0ff]/40 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00f0ff] focus:ring-2 focus:ring-[#00f0ff]/30 transition-all"
                    />
                  </div>
                </div>

                {/* Fleeing Hint */}
                <div className="min-h-[20px]">
                  {!isFormValid && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[11px] font-mono text-[#ff0055] flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Fill both Name & Username to capture button!</span>
                    </motion.div>
                  )}
                </div>

                {/* RUNAWAY "LOG IN TO GRID ->" BUTTON */}
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
                          ? 'bg-gradient-to-r from-[#ff0055] via-[#990022] to-[#00f0ff] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] text-white cursor-pointer active:scale-95 border border-white/20'
                          : 'bg-gradient-to-r from-pink-950 to-slate-900 text-pink-300/50 border border-pink-500/20 cursor-not-allowed'
                      }`}
                    >
                      {loginStatus === 'loggingIn' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          AUTHENTICATING...
                        </>
                      ) : (
                        <>
                          LOG IN TO GRID -&gt;
                        </>
                      )}
                    </button>
                  </motion.div>
                </div>
              </form>
            )}

            {/* Footer Info */}
            <div className="mt-8 pt-4 border-t border-[#ff0055]/20 text-center text-xs text-gray-400">
              Need assistance?{' '}
              <a href="#support" className="text-[#00f0ff] hover:underline font-semibold">
                Grid System Operator
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
