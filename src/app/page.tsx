'use client';

import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { User, AtSign, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MinimalistAuthPage() {
  // Global Mouse Tracking
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 22 };

  // Character 3D Rotation & Eye Tracking
  const headRotateX = useSpring(useTransform(rawMouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const headRotateY = useSpring(useTransform(rawMouseX, [-0.5, 0.5], [-16, 16]), springConfig);

  // Focus State Logic
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Eye Motion
  const eyeTargetX = useTransform(rawMouseX, [-0.5, 0.5], [-24, 24]);
  const eyeTargetY = useTransform(rawMouseY, [-0.5, 0.5], [-16, 16]);

  const smoothEyeX = useSpring(eyeTargetX, springConfig);
  const smoothEyeY = useSpring(eyeTargetY, springConfig);

  // When focused on inputs, lock gaze to the right (+28px) and shrink scale slightly
  const finalEyeX = isInputFocused ? 28 : smoothEyeX;
  const finalEyeY = isInputFocused ? 0 : smoothEyeY;
  const finalHeadScale = useSpring(isInputFocused ? 0.92 : 1.0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    rawMouseX.set(clientX / innerWidth - 0.5);
    rawMouseY.set(clientY / innerHeight - 0.5);
  };

  // Form State (ONLY Name & Username)
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loggingIn' | 'success'>('idle');

  const isFormValid = name.trim().length > 0 && username.trim().length > 0;

  // Runaway button evade logic
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
    }, 1200);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="h-screen w-screen flex flex-col lg:flex-row overflow-hidden font-sans select-none bg-black text-black"
    >
      {/* LEFT PANEL: Pitch Black (#000000) with Minimalist Tracking Character */}
      <div className="lg:w-1/2 h-full bg-black text-white relative flex flex-col items-center justify-center p-8 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-900">
        
        {/* Subtle Background Glow Accent (No Blue) */}
        <div className="absolute w-96 h-96 bg-zinc-900/60 rounded-full blur-3xl pointer-events-none" />

        {/* Minimalist Robot / Character Container */}
        <div className="relative z-10 flex flex-col items-center justify-center perspective-1000">
          <motion.div
            style={{
              rotateX: headRotateX,
              rotateY: headRotateY,
              scale: finalHeadScale,
              transformStyle: 'preserve-3d',
            }}
            className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-zinc-950 border-2 border-zinc-800 p-6 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden"
          >
            {/* Robot Head Top Light Bar */}
            <div className="w-full flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-zinc-700" />
              </div>
              <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
                {isInputFocused ? 'GAZE: LOCKED' : 'GAZE: TRACKING'}
              </span>
            </div>

            {/* Character Visor & Mechanical Eye */}
            <div className="w-full h-36 rounded-2xl bg-black border border-zinc-800 p-4 relative flex items-center justify-center overflow-hidden shadow-inner">
              {/* Visor Grid Background Lines */}
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:16px_16px]" />

              {/* Eye Visor Container */}
              <div className="relative w-44 h-20 rounded-full bg-zinc-900/90 border border-zinc-700 flex items-center justify-center overflow-hidden">
                
                {/* Mouse Tracking Pupil & Lens */}
                <motion.div
                  style={{
                    x: finalEyeX,
                    y: finalEyeY,
                  }}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-zinc-800 via-white to-zinc-300 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.8)] relative border border-white"
                >
                  {/* Inner Dark Lens */}
                  <div className="w-7 h-7 rounded-full bg-black border-2 border-zinc-600 flex items-center justify-center relative">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                    {/* Glare Reflection */}
                    <div className="absolute top-0.5 right-1 w-2 h-2 rounded-full bg-white opacity-90" />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Robot Lower Mouth/Speaker Detail */}
            <div className="w-full flex items-center justify-center gap-1.5 pt-2">
              <div className="w-8 h-1 bg-zinc-800 rounded-full" />
              <div className="w-12 h-1 bg-zinc-700 rounded-full" />
              <div className="w-8 h-1 bg-zinc-800 rounded-full" />
            </div>
          </motion.div>

          {/* Minimalist Subtext */}
          <div className="mt-8 text-center">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Interactive Access Grid
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs">
              Character tracks your cursor movements across the screen.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Clean White (#FFFFFF) Auth Form */}
      <div className="lg:w-1/2 h-full bg-white text-black relative flex flex-col justify-between p-8 lg:p-16 overflow-y-auto">
        
        {/* Top Minimalist Header */}
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-lg tracking-tight text-black">
            CYBER<span className="text-red-600">//</span>EMULATOR
          </span>
          <span className="text-xs font-mono text-gray-400">
            SYSTEM v2.0
          </span>
        </div>

        {/* Center Auth Form Container */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          
          {/* Form Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
              Welcome back!
            </h1>
            <p className="text-sm text-gray-500 mt-2">
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
              <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-black">Welcome, {name}!</h2>
              <p className="text-sm text-gray-500 max-w-xs">
                You have successfully authenticated as <span className="font-semibold text-black">{username}</span>.
              </p>
              <button 
                onClick={() => setLoginStatus('idle')}
                className="mt-4 px-6 py-3 rounded-xl text-xs font-semibold bg-black text-white hover:bg-zinc-800 transition-all shadow-md"
              >
                Sign Out
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              
              {/* NAME FIELD ONLY */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
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
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
              </div>

              {/* USERNAME FIELD ONLY */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
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
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 transition-all"
                  />
                </div>
              </div>

              {/* Fleeing Warning Hint */}
              <div className="min-h-[20px]">
                {!isFormValid && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-red-600 flex items-center gap-1.5 font-medium"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Please fill in both Name and Username to click Log in.</span>
                  </motion.div>
                )}
              </div>

              {/* RUNAWAY DARK 'LOG IN' BUTTON */}
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
                    className={`w-full py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                      isFormValid
                        ? 'bg-black text-white hover:bg-zinc-800 cursor-pointer active:scale-95'
                        : 'bg-zinc-300 text-zinc-500 cursor-not-allowed border border-zinc-200'
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
        <div className="text-center text-xs text-gray-400 border-t border-gray-100 pt-6">
          Need access? Contact administrator.
        </div>
      </div>
    </div>
  );
}
