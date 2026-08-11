'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  Terminal, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Radio, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Layers, 
  Monitor, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// Floating particle background component
const FloatingParticles = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; color: string; duration: number; delay: number }>>([]);

  useEffect(() => {
    const colors = ['#ff007f', '#00f0ff', '#6b11ff', '#e024c3'];
    const generated = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
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
            opacity: [0, 0.8, 0],
            scale: [1, 1.5, 0.8],
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

export default function SynthwaveLoginPage() {
  // Mouse tracking for 3D Parallax Console
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const springConfig = { stiffness: 100, damping: 20 };
  const rotateX = useSpring(useTransform(rawMouseY, [-0.5, 0.5], [18, -18]), springConfig);
  const rotateY = useSpring(useTransform(rawMouseX, [-0.5, 0.5], [-18, 18]), springConfig);
  const translateZ = useSpring(useTransform(rawMouseY, [-0.5, 0.5], [10, -10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    // Map mouse position to -0.5 to 0.5
    rawMouseX.set(clientX / innerWidth - 0.5);
    rawMouseY.set(clientY / innerHeight - 0.5);
  };

  // Form State & Runaway Button Logic
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [isFleeing, setIsFleeing] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loggingIn' | 'success'>('idle');
  const [activeConsoleBtn, setActiveConsoleBtn] = useState<string | null>(null);

  const isFormValid = email.trim().length > 0 && password.trim().length > 0;

  // Runaway button flee effect
  const makeButtonFlee = () => {
    if (!isFormValid) {
      setIsFleeing(true);
      // Generate runaway coordinates within safe range
      const randomX = (Math.random() - 0.5) * 280;
      const randomY = (Math.random() - 0.5) * 180;
      setButtonOffset({ x: randomX, y: randomY });
    }
  };

  // Reset button position when form becomes valid
  useEffect(() => {
    if (isFormValid) {
      setButtonOffset({ x: 0, y: 0 });
      setIsFleeing(false);
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
      className="min-h-screen h-screen flex flex-col bg-[#0a001a] text-white relative overflow-hidden font-sans select-none"
    >
      {/* Background Synthwave Horizon Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 synth-grid animate-grid z-0" />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#ff007f]/20 via-[#6b11ff]/10 to-transparent pointer-events-none z-0" />

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#ff007f]/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#00f0ff]/15 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Top Navbar */}
      <header className="h-16 px-6 lg:px-12 flex items-center justify-between border-b border-[#ff007f]/25 bg-[#0a001a]/80 backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-[#ff007f] to-[#00f0ff] shadow-glow-magenta">
            <Gamepad2 className="w-6 h-6 text-black" />
          </div>
          <span className="font-extrabold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#ff007f] via-[#00f0ff] to-white drop-shadow-[0_0_10px_rgba(255,0,127,0.5)]">
            CYBER//EMULATOR
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
          {['Home', 'Webinar', 'Services', 'Games', 'Community', 'Docs'].map((item, idx) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className={`transition-all duration-300 hover:text-[#00f0ff] hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] relative group ${
                idx === 0 ? 'text-[#ff007f]' : 'text-gray-300'
              }`}
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#00f0ff] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Action / Status */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#15002a] border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff]">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            SYSTEM: ONLINE
          </div>
          <button className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#ff007f] to-[#6b11ff] hover:from-[#00f0ff] hover:to-[#ff007f] text-white transition-all duration-300 shadow-glow-magenta hover:shadow-glow-cyan border border-white/20">
            Enter Grid
          </button>
        </div>
      </header>

      {/* Main 50/50 Split Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl w-full mx-auto p-6 lg:p-12 z-20 relative overflow-hidden">
        
        {/* LEFT SIDE: Retro-Futuristic Gaming Console with 3D Mouse Parallax */}
        <div className="flex items-center justify-center relative perspective-1000">
          <motion.div
            style={{
              rotateX,
              rotateY,
              translateZ,
              transformStyle: 'preserve-3d',
            }}
            className="w-full max-w-md glass-console rounded-3xl p-6 relative border-2 border-[#00f0ff]/50 shadow-[0_0_50px_rgba(255,0,127,0.3)] transition-shadow duration-300"
          >
            {/* Top Metallic Console Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#00f0ff]/30 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff007f] animate-pulse shadow-[0_0_8px_#ff007f]" />
                <span className="w-3 h-3 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
                <span className="w-3 h-3 rounded-full bg-[#6b11ff]" />
                <span className="text-xs font-mono font-bold tracking-widest text-[#00f0ff] ml-2">
                  NEXUS-84 // CONSOLE
                </span>
              </div>
              <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff007f]/20 border border-[#ff007f]/40 text-[#ff007f]">
                60 FPS
              </div>
            </div>

            {/* Retro CRT Display Screen */}
            <div className="relative rounded-2xl bg-black border-2 border-[#ff007f]/60 p-4 overflow-hidden shadow-inner scanlines min-h-[200px] flex flex-col justify-between">
              {/* Screen Header Info */}
              <div className="flex justify-between items-center text-[10px] font-mono text-[#00f0ff] z-10">
                <span>SIGNAL: 100%</span>
                <span className="animate-pulse">● REC</span>
                <span>CH: 84</span>
              </div>

              {/* CRT Retro Sun Graphic & Grid */}
              <div className="my-4 flex flex-col items-center justify-center relative z-10">
                {/* Glowing Sun */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#ff007f] via-[#ff5e00] to-[#ff007f] flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_#ff007f]">
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(10,0,26,0.9)_50%)] bg-[length:100%_8px]" />
                </div>
                <div className="font-mono text-xs font-bold text-[#00f0ff] tracking-widest mt-3 drop-shadow-[0_0_50px_#00f0ff]">
                  {activeConsoleBtn ? `BUTTON [${activeConsoleBtn}] PRESSED` : 'READY FOR OPERATOR...'}
                </div>
                <div className="text-[10px] font-mono text-gray-400 mt-1">
                  CYBER-WAVE OS v4.2.0
                </div>
              </div>

              {/* Screen Footer Grid Bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#ff007f] via-[#00f0ff] to-[#6b11ff] rounded-full animate-pulse z-10" />
            </div>

            {/* Console Control Panel Section */}
            <div className="mt-6 grid grid-cols-2 gap-4 items-center">
              
              {/* Left Side: D-PAD */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-gray-400 mb-2 tracking-wider">DIRECTIONAL</span>
                <div className="relative w-28 h-28 flex items-center justify-center">
                  {/* Cross Backplate */}
                  <div className="absolute w-24 h-8 bg-slate-900 rounded-md border border-[#00f0ff]/40 shadow-inner" />
                  <div className="absolute w-8 h-24 bg-slate-900 rounded-md border border-[#00f0ff]/40 shadow-inner" />
                  
                  {/* Up */}
                  <button 
                    onClick={() => setActiveConsoleBtn('UP')}
                    className="absolute top-1 w-7 h-7 bg-gradient-to-b from-slate-700 to-slate-900 hover:from-[#00f0ff] hover:to-[#6b11ff] hover:text-black text-gray-300 rounded-t flex items-center justify-center transition-all duration-150 active:scale-90 border-t border-[#00f0ff]/50"
                  >
                    ▲
                  </button>
                  {/* Down */}
                  <button 
                    onClick={() => setActiveConsoleBtn('DOWN')}
                    className="absolute bottom-1 w-7 h-7 bg-gradient-to-b from-slate-700 to-slate-900 hover:from-[#00f0ff] hover:to-[#6b11ff] hover:text-black text-gray-300 rounded-b flex items-center justify-center transition-all duration-150 active:scale-90 border-b border-[#00f0ff]/50"
                  >
                    ▼
                  </button>
                  {/* Left */}
                  <button 
                    onClick={() => setActiveConsoleBtn('LEFT')}
                    className="absolute left-1 w-7 h-7 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-[#00f0ff] hover:to-[#6b11ff] hover:text-black text-gray-300 rounded-l flex items-center justify-center transition-all duration-150 active:scale-90 border-l border-[#00f0ff]/50"
                  >
                    ◀
                  </button>
                  {/* Right */}
                  <button 
                    onClick={() => setActiveConsoleBtn('RIGHT')}
                    className="absolute right-1 w-7 h-7 bg-gradient-to-r from-slate-700 to-slate-900 hover:from-[#00f0ff] hover:to-[#6b11ff] hover:text-black text-gray-300 rounded-r flex items-center justify-center transition-all duration-150 active:scale-90 border-r border-[#00f0ff]/50"
                  >
                    ▶
                  </button>
                  {/* Center Dot */}
                  <div className="z-10 w-4 h-4 rounded-full bg-slate-950 border border-slate-700" />
                </div>
              </div>

              {/* Right Side: ABXY Action Buttons */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-gray-400 mb-2 tracking-wider">ACTION MATRIX</span>
                <div className="relative w-28 h-28 flex items-center justify-center">
                  {/* Button Y (Top) */}
                  <button 
                    onClick={() => setActiveConsoleBtn('Y')}
                    className="absolute top-1 w-8 h-8 rounded-full bg-gradient-to-br from-[#ff007f] to-purple-900 hover:scale-110 text-white font-bold text-xs flex items-center justify-center border border-[#ff007f] shadow-[0_0_10px_#ff007f] active:scale-95 transition-all"
                  >
                    Y
                  </button>
                  {/* Button A (Bottom) */}
                  <button 
                    onClick={() => setActiveConsoleBtn('A')}
                    className="absolute bottom-1 w-8 h-8 rounded-full bg-gradient-to-br from-[#00f0ff] to-blue-900 hover:scale-110 text-black font-extrabold text-xs flex items-center justify-center border border-[#00f0ff] shadow-[0_0_10px_#00f0ff] active:scale-95 transition-all"
                  >
                    A
                  </button>
                  {/* Button X (Left) */}
                  <button 
                    onClick={() => setActiveConsoleBtn('X')}
                    className="absolute left-1 w-8 h-8 rounded-full bg-gradient-to-br from-[#6b11ff] to-indigo-900 hover:scale-110 text-white font-bold text-xs flex items-center justify-center border border-[#6b11ff] shadow-[0_0_10px_#6b11ff] active:scale-95 transition-all"
                  >
                    X
                  </button>
                  {/* Button B (Right) */}
                  <button 
                    onClick={() => setActiveConsoleBtn('B')}
                    className="absolute right-1 w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-900 hover:scale-110 text-white font-bold text-xs flex items-center justify-center border border-pink-400 shadow-[0_0_10px_#ff007f] active:scale-95 transition-all"
                  >
                    B
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Utility Controls (SELECT / START) */}
            <div className="mt-4 pt-3 border-t border-[#00f0ff]/20 flex justify-center gap-6">
              <button 
                onClick={() => setActiveConsoleBtn('SELECT')}
                className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-[#00f0ff] text-[10px] font-mono text-gray-400 hover:text-[#00f0ff] transition-all"
              >
                SELECT
              </button>
              <button 
                onClick={() => setActiveConsoleBtn('START')}
                className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-[#ff007f] text-[10px] font-mono text-gray-400 hover:text-[#ff007f] transition-all"
              >
                START
              </button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: Magenta/Cyan Glassmorphism Login Form */}
        <div className="flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md glass-panel rounded-3xl p-8 lg:p-10 relative overflow-hidden border border-[#ff007f]/40 shadow-glow-magenta"
          >
            {/* Top Glowing Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-[#00f0ff]" />
                <span className="text-xs font-mono uppercase tracking-widest text-[#00f0ff]">
                  SECURE ACCESS PROTOCOL
                </span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-[#ff007f]">
                User Authentication
              </h2>
              <p className="text-xs text-gray-300 mt-1">
                Enter your credentials to override security grid and gain system access.
              </p>
            </div>

            {/* Login Success Overlay */}
            {loginStatus === 'success' ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#00f0ff]/20 border-2 border-[#00f0ff] flex items-center justify-center shadow-glow-cyan">
                  <CheckCircle2 className="w-10 h-10 text-[#00f0ff]" />
                </div>
                <h3 className="text-xl font-bold text-[#00f0ff]">ACCESS GRANTED</h3>
                <p className="text-xs text-gray-300 max-w-xs">
                  Welcome back, Operator. Initializing virtual workstation environment...
                </p>
                <button 
                  onClick={() => setLoginStatus('idle')}
                  className="mt-4 px-6 py-2 rounded-xl text-xs font-bold bg-[#ff007f] hover:bg-[#00f0ff] hover:text-black transition-all"
                >
                  Reset Session
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-200 flex items-center justify-between">
                    <span>EMAIL ADDRESS</span>
                    <span className="text-[10px] font-mono text-[#00f0ff]">NET_ID</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@cybernet.io"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#0a001a]/80 rounded-xl border border-[#ff007f]/40 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00f0ff] focus:ring-2 focus:ring-[#00f0ff]/30 transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-200 flex items-center justify-between">
                    <span>SECURITY KEY</span>
                    <a href="#forgot" className="text-[10px] font-mono text-[#ff007f] hover:underline">
                      FORGOT KEY?
                    </a>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-pink-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-10 py-3 bg-[#0a001a]/80 rounded-xl border border-[#ff007f]/40 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#00f0ff] focus:ring-2 focus:ring-[#00f0ff]/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#00f0ff] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Fleeing Warning Hint */}
                <div className="min-h-[20px]">
                  {!isFormValid && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[11px] font-mono text-[#ff007f] flex items-center gap-1.5"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Fill both Email & Security Key to unlock Log In button!</span>
                    </motion.div>
                  )}
                </div>

                {/* RUNAWAY LOG IN BUTTON WRAPPER */}
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
                          ? 'bg-gradient-to-r from-[#ff007f] via-[#6b11ff] to-[#00f0ff] hover:shadow-glow-cyan text-white cursor-pointer active:scale-95'
                          : 'bg-gradient-to-r from-pink-900 to-purple-950 text-pink-300 border border-pink-500/30 cursor-not-allowed'
                      }`}
                    >
                      {loginStatus === 'loggingIn' ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          VERIFYING CREDENTIALS...
                        </>
                      ) : (
                        <>
                          LOG IN TO GRID
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.div>
                </div>
              </form>
            )}

            {/* Footer info */}
            <div className="mt-8 pt-4 border-t border-[#ff007f]/20 text-center text-xs text-gray-400">
              Need an operator account?{' '}
              <a href="#register" className="text-[#00f0ff] hover:underline font-semibold">
                Request Grid Access
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
