'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { 
  AtSign, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Eye,
  EyeOff,
  Hash
} from 'lucide-react';
// import { GoogleLoginButton } from './GoogleLoginButton';

interface AuthFormProps {
  setIsInputFocused: (focused: boolean) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  setIsInputFocused,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  const [email, setEmail] = useState('');
  const [empId, setEmpId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [buttonOffset, setButtonOffset] = useState({ x: 0, y: 0 });
  const [loginStatus, setLoginStatus] = useState<'idle' | 'loggingIn' | 'success'>('idle');

  const isFormValid = authMode === 'signup'
    ? email.trim().length > 0 && username.trim().length > 0 && password.trim().length > 0 && empId.trim().length > 0
    : username.trim().length > 0 && password.trim().length > 0;

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

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'AccountNotFound') {
      setAuthMode('signup');
      setLoginError('Account not found. Please sign up to create a new profile.');
      
      // clean the URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      makeButtonFlee();
      return;
    }

    setLoginError('');
    setLoginStatus('loggingIn');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: email.trim(),
        empId: empId.trim(),
        username: username.trim(),
        password: password.trim(),
        isSignup: authMode === 'signup' ? 'true' : 'false'
      });

      if (res?.error) {
        setLoginStatus('idle');
        setLoginError(res.error);
        return;
      }

      setLoginStatus('success');
      setTimeout(() => {
        router.push('/');
      }, 800);
    } catch (err) {
      setLoginStatus('idle');
      setLoginError('Connection error. Please try again.');
    }
  };

  return (
    <div className="w-full h-full bg-[#030005] text-white relative flex flex-col justify-between p-8 lg:p-16 overflow-y-auto select-none">
      <div className="flex items-center justify-between">
        <span className="font-extrabold text-lg tracking-tight text-white">
          CYBER<span className="text-[#ff0055]">//</span>SIMULATOR
        </span>
        <span className="text-xs font-mono text-[#ff0055] px-2.5 py-1 rounded bg-[#ff0055]/20 border border-[#ff0055]/40">
          SYSTEM v2.0
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-12">
        <div className="mb-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-[#ff0055]/10 border-2 border-[#ff0055] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,0,85,0.2)]"
          >
            <Key className="w-8 h-8 text-[#ff0055]" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">
            {authMode === 'login' ? 'System Login' : 'Request Access'}
          </h1>
          <p className="text-sm text-zinc-400">
            {authMode === 'login' ? 'Enter your credentials to breach the mainframe.' : 'Create an operative identity to enter the Matrix.'}
          </p>
        </div>

        {loginStatus === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">Access Granted</h2>
            <p className="text-sm text-zinc-300 max-w-xs">
              Redirecting you to the Player Arena...
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            
            {authMode === 'signup' && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block flex justify-between">
                    <span>Email</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ff0055]">
                      <AtSign className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operative@matrix.com"
                      required={authMode === 'signup'}
                      className="w-full pl-11 pr-4 py-3.5 bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl text-sm focus:outline-none focus:border-[#ff0055] focus:ring-2 focus:ring-[#ff0055]/30 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block flex justify-between">
                    <span>Employee ID</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ff0055]">
                      <Hash className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={empId}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      onChange={(e) => setEmpId(e.target.value)}
                      placeholder="EMP-XXXX"
                      required={authMode === 'signup'}
                      className="w-full pl-11 pr-4 py-3.5 bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl text-sm focus:outline-none focus:border-[#ff0055] focus:ring-2 focus:ring-[#ff0055]/30 transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block flex justify-between">
                <span>Username</span>
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
                  placeholder="Enter Operator ID"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl text-sm focus:outline-none focus:border-[#ff0055] focus:ring-2 focus:ring-[#ff0055]/30 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block flex justify-between">
                <span>Password</span>
                {authMode === 'login' && (
                  <button type="button" className="text-[10px] font-mono text-[#ff0055] hover:underline">
                    FORGOT?
                  </button>
                )}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ff0055]">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl text-sm focus:outline-none focus:border-[#ff0055] focus:ring-2 focus:ring-[#ff0055]/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-[#ff0055] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-[#ff0055] text-xs font-medium bg-[#ff0055]/10 p-3 rounded-lg border border-[#ff0055]/20"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {loginError}
              </motion.div>
            )}

            <div className="relative h-12 w-full pt-4">
              <motion.button
                type="submit"
                animate={{ x: buttonOffset.x, y: buttonOffset.y }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onMouseEnter={() => !isFormValid && makeButtonFlee()}
                className={`absolute inset-0 w-full h-12 rounded-xl text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 group ${
                  isFormValid 
                    ? 'bg-[#ff0055] hover:bg-white text-white hover:text-[#ff0055] shadow-[0_0_20px_rgba(255,0,85,0.4)]' 
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <span>{loginStatus === 'loggingIn' ? 'AUTHENTICATING...' : (authMode === 'login' ? 'BREACH MAINFRAME' : 'INITIALIZE OPERATIVE')}</span>
                {loginStatus !== 'loggingIn' && (
                  <ArrowRight className={`w-4 h-4 ${isFormValid ? 'group-hover:translate-x-1 transition-transform' : ''}`} />
                )}
              </motion.button>
            </div>

            {/* <div className="pt-2 text-center">
              <div className="flex items-center justify-center gap-4 py-4 w-full">
                <div className="h-[1px] bg-zinc-800 flex-1"></div>
                <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">OR</span>
                <div className="h-[1px] bg-zinc-800 flex-1"></div>
              </div>
              <div className="flex justify-center w-full mt-2">
                 <GoogleLoginButton mode={authMode} />
              </div>
            </div> */}

            {authMode === 'login' ? (
              <div className="pt-6 text-center">
                <p className="text-zinc-500 text-xs">
                  NO CLEARANCE?{' '}
                  <button 
                    type="button" 
                    onClick={() => { setAuthMode('signup'); setLoginError(''); }}
                    className="text-[#ff0055] font-bold hover:underline"
                  >
                    SIGNUP
                  </button>
                </p>
              </div>
            ) : (
              <div className="pt-6 text-center">
                <p className="text-zinc-500 text-xs">
                  ALREADY CLEARED?{' '}
                  <button 
                    type="button" 
                    onClick={() => { setAuthMode('login'); setLoginError(''); }}
                    className="text-[#ff0055] font-bold hover:underline"
                  >
                    LOGIN
                  </button>
                </p>
              </div>
            )}

          </form>
        )}
      </div>

      <div className="text-center">
        <p className="text-[10px] font-mono text-zinc-600">
          WARNING: UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED
        </p>
      </div>
    </div>
  );
};
