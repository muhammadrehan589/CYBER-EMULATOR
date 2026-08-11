'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  User, 
  AtSign, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  Key, 
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';

export default function CyberSimulatorAuthPage() {
  const router = useRouter();

  // Global Mouse Coordinates
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  // Eyeball Center Ref for Viewport Tracking
  const eyeContainerRef = useRef<HTMLDivElement>(null);

  // Viewport Delta Motion Values for Outer Eyeball
  const eyeXMotion = useMotionValue(0);
  const eyeYMotion = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 24 };

  // Outer Eyeball Translation Springs
  const smoothEyeX = useSpring(eyeXMotion, springConfig);
  const smoothEyeY = useSpring(eyeYMotion, springConfig);

  // ISOLATED INNER PUPIL PARALLAX: 1.65x Multiplier for deep inner lens movement
  const pupilX = useTransform(smoothEyeX, (v) => v * 1.65);
  const pupilY = useTransform(smoothEyeY, (v) => v * 1.65);

  // 3D Head & Console Rotation Springs
  const headRotateX = useSpring(useTransform(rawMouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const headRotateY = useSpring(useTransform(rawMouseX, [-0.5, 0.5], [-16, 16]), springConfig);

  // Focus & Typing State for Iris Focus Reaction
  const [isInputFocused, setIsInputFocused] = useState(false);

  // When focused on inputs, lock gaze toward the right panel (+28px)
  const finalEyeX = isInputFocused ? 28 : smoothEyeX;
  const finalEyeY = isInputFocused ? 0 : smoothEyeY;

  const finalPupilX = isInputFocused ? 38 : pupilX;
  const finalPupilY = isInputFocused ? 0 : pupilY;

  // Viewport Mouse Tracker
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

      // Max outer eyeball travel radius inside visor
      const maxRadius = 18;
      const clampedRadius = Math.min(maxRadius, distance / 18);

      const targetX = Math.cos(angle) * clampedRadius;
      const targetY = Math.sin(angle) * clampedRadius;

      eyeXMotion.set(targetX);
      eyeYMotion.set(targetY);
    }
  };

  // Form & Admin Trapdoor States
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loggingIn' | 'success'>('idle');

  // Admin Trapdoor Password States
  const [isAdminTrapdoor, setIsAdminTrapdoor] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');

  const isFormValid = isAdminTrapdoor
    ? adminPassword.trim().length > 0
    : name.trim().length > 0 && username.trim().length > 0;

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

  // Two-Step Authentication Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      makeButtonFlee();
      return;
    }

    // Step 2: Handle Admin Password Verification
    if (isAdminTrapdoor) {
      if (adminPassword.trim() === 'admin123') {
        setAdminAuthError('');
        setLoginStatus('loggingIn');
        setTimeout(() => {
          setLoginStatus('success');
          router.push('/admin');
        }, 1000);
      } else {
        setAdminAuthError('SECURITY OVERRIDE FAILED: INVALID ADMIN KEY');
      }
      return;
    }

    // Step 1: Check if user is Admin ('abdurrehman' or '@abdurrehman')
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
    if (cleanUsername === 'abdurrehman') {
      // Trigger Admin Trapdoor Mode
      setIsAdminTrapdoor(true);
      setAdminAuthError('');
      return;
    }

    // Normal Player Login -> Redirect to Player Arena Dashboard
    setLoginStatus('loggingIn');
    setTimeout(() => {
      setLoginStatus('success');
      router.push('/dashboard');
    }, 1000);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden font-sans select-none bg-black text-white"
    >
      {/* LEFT PANEL: Pitch Black (#000000) with High-Fidelity Gameboy Console & Eye */}
      <div className="lg:w-1/2 h-full bg-black text-white relative flex flex-col items-center justify-center p-8 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#ff0055]/20">
        
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
              <div className="text-[9px] font-mono px-2 py-0.5 rounded bg-[#ff0055]/20 border border-[#ff0055]/40 text-[#ff0055]">
                {isAdminTrapdoor ? 'TRAPDOOR' : isInputFocused ? 'FOCUS' : 'LIVE'}
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
                      ? 'MODE: IRIS FOCUS' 
                      : 'MODE: PARALLAX'}
                </span>
              </div>

              {/* MECHANICAL EYE WITH PRECISE IRIS FOCUS ANIMATION */}
              <div className="my-2 relative flex items-center justify-center w-36 h-36 z-10">
                {/* SUBTLE PREMIUM IRIS FOCUS CONTAINER */}
                <motion.div
                  animate={{
                    scaleX: isInputFocused ? 1.02 : 1.0,
                    scaleY: isInputFocused ? 0.94 : 1.0,
                    scale: isInputFocused ? 0.96 : 1.0,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 240,
                    damping: 22,
                  }}
                  style={{
                    x: finalEyeX,
                    y: finalEyeY,
                  }}
                  className="relative w-32 h-32 flex items-center justify-center"
                >
                  {/* Outer Ring Frame */}
                  <svg className="w-32 h-32 absolute inset-0" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" stroke="#ff0055" strokeWidth="2" fill="none" strokeDasharray="6 3" className="animate-spin-slow opacity-80" />
                    <circle cx="50" cy="50" r="38" fill="#0c0012" stroke="#ff0055" strokeWidth="2" />
                  </svg>

                  {/* Outer Eyeball Lens with Dynamic Neon Iris Glow Boost */}
                  <motion.div
                    animate={{
                      boxShadow: isInputFocused 
                        ? '0 0 35px #ff0055, 0 0 70px rgba(255, 0, 85, 0.6)' 
                        : '0 0 25px #ff0055',
                    }}
                    transition={{ duration: 0.3 }}
                    className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#800020] via-[#ff0055] to-pink-300 flex items-center justify-center border-2 border-pink-200"
                  >
                    
                    {/* ISOLATED INNER PUPIL WITH HIGHER PARALLAX MULTIPLIER */}
                    <motion.div
                      style={{
                        x: finalPupilX,
                        y: finalPupilY,
                      }}
                      className="w-9 h-9 rounded-full bg-[#050008] border-2 border-red-900 flex items-center justify-center relative overflow-hidden shadow-inner"
                    >
                      {/* Glowing Red Core */}
                      <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_10px_#ff0000]" />
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
                    ? 'SUBTLE IRIS FOCUS LOCKED ON AUTH FORM' 
                    : 'PUPIL PARALLAX TRACKS CURSOR POSITION'}
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
                : 'Advanced pupil parallax & subtle iris focus enabled.'}
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Pitch Black Dark Glassmorphism Auth Form */}
      <div className="lg:w-1/2 h-full bg-[#030005] text-white relative flex flex-col justify-between p-8 lg:p-16 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-lg tracking-tight text-white">
            CYBER<span className="text-[#ff0055]">//</span>SIMULATOR
          </span>
          <span className="text-xs font-mono text-[#ff0055] px-2.5 py-1 rounded bg-[#ff0055]/20 border border-[#ff0055]/40">
            SYSTEM v1.0
          </span>
        </div>

        {/* Center Auth Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          
          {/* Header in Bright Neon Pink */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#ff0055] drop-shadow-[0_0_12px_rgba(255,0,85,0.6)]">
              {isAdminTrapdoor ? 'Admin Override' : 'Welcome back!'}
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              {isAdminTrapdoor 
                ? 'Security clearance required for Administrator Abdurrehman.' 
                : 'Please enter your details to sign in.'}
            </p>
          </div>

          {/* Login Success View */}
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
                Redirecting <span className="font-bold text-[#ff0055]">{name || 'Abdurrehman'}</span> to {isAdminTrapdoor ? 'Admin Control Room' : 'Player Arena'}...
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              
              {/* STEP 2: ADMIN PASSWORD TRAPDOOR INPUT */}
              {isAdminTrapdoor ? (
                <div className="space-y-4">
                  {/* Admin User Info Pill */}
                  <div className="p-3 rounded-xl bg-[#120315] border border-[#ff0055]/40 flex items-center justify-between font-mono text-xs">
                    <span className="text-zinc-400">OPERATOR:</span>
                    <span className="font-bold text-[#ff0055]">Abdurrehman (@abdurrehman)</span>
                  </div>

                  {/* Password Input Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block flex justify-between">
                      <span>SECURITY KEY (PASSWORD)</span>
                      <span className="text-[10px] font-mono text-[#ff0055]">ADMIN_ONLY</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ff0055]">
                        <Key className="w-4 h-4" />
                      </div>
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        value={adminPassword}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() => setIsInputFocused(false)}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Enter Admin Password (e.g. admin123)"
                        autoFocus
                        required
                        className="w-full pl-11 pr-10 py-3.5 bg-zinc-900/80 border border-[#ff0055]/50 text-white placeholder-zinc-500 rounded-xl text-sm focus:outline-none focus:border-[#ff0055] focus:ring-2 focus:ring-[#ff0055]/40 transition-all font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-[#ff0055] transition-colors"
                      >
                        {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Notification */}
                  {adminAuthError && (
                    <div className="p-3 rounded-xl bg-red-950/80 border border-red-600 text-xs font-mono text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{adminAuthError}</span>
                    </div>
                  )}

                  {/* Back to Normal Login Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminTrapdoor(false);
                      setAdminPassword('');
                      setAdminAuthError('');
                    }}
                    className="text-xs font-mono text-zinc-400 hover:text-[#ff0055] flex items-center gap-1.5 transition-colors pt-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Normal Login</span>
                  </button>
                </div>
              ) : (
                /* STEP 1: NORMAL NAME & USERNAME INPUTS */
                <>
                  {/* NAME FIELD */}
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

                  {/* USERNAME FIELD */}
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
                </>
              )}

              {/* Fleeing Warning Hint */}
              <div className="min-h-[20px]">
                {!isFormValid && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-[#ff0055] flex items-center gap-1.5 font-medium"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      {isAdminTrapdoor 
                        ? 'Please enter Admin Password to proceed.' 
                        : 'Please fill in both Name and Username to click Log in.'}
                    </span>
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
                        Authenticating...
                      </>
                    ) : isAdminTrapdoor ? (
                      <>
                        OVERRIDE & ENTER ADMIN
                        <ArrowRight className="w-4 h-4" />
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
          Need access? Contact System Administrator.
        </div>
      </div>
    </div>
  );
}
