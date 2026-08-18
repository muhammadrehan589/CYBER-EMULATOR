'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  AtSign, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthFormProps {
  setIsInputFocused: (focused: boolean) => void;
  isAdminTrapdoor: boolean;
  setIsAdminTrapdoor: (trapdoor: boolean) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  setIsInputFocused,
  isAdminTrapdoor,
  setIsAdminTrapdoor,
}) => {
  const router = useRouter();

  // Form & Admin Trapdoor States
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loggingIn' | 'success'>('idle');

  // Admin Trapdoor Password States
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
      router.push('/');
    }, 1000);
  };

  return (
    <div className="w-full h-full bg-[#030005] text-white relative flex flex-col justify-between p-8 lg:p-16 overflow-y-auto select-none">
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
                  className="text-xs font-mono text-zinc-400 hover:text-[#ff0055] flex items-center gap-1.5 transition-colors pt-1 cursor-pointer"
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
                      ? 'bg-gradient-to-r from-[#ff0055] via-[#e60039] to-[#ff0055] text-[#ffffff] hover:shadow-[0_0_25px_#ff0055] cursor-pointer active:scale-95 border border-white/20'
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
                      OVERRIDE &amp; ENTER ADMIN
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
  );
};
