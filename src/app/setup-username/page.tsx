'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowRight, AlertCircle, AtSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SetupUsernamePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      const currentUsername = (session?.user as any)?.username;
      if (currentUsername && !currentUsername.startsWith('init_')) {
        router.push('/');
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/users/username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to claim username.');
        setLoading(false);
        return;
      }

      await update(); // Update NextAuth session
      router.push('/');
    } catch (err) {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="h-screen flex items-center justify-center bg-[#030005] text-[#ff0055] font-mono">LOADING...</div>;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#030005] text-white select-none">
      <div className="max-w-md w-full p-8 border border-[#ff0055]/30 rounded-xl bg-black/50 shadow-[0_0_30px_rgba(255,0,85,0.2)]">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#ff0055] mb-2 drop-shadow-[0_0_8px_rgba(255,0,85,0.6)]">
          CLAIM ALIAS
        </h1>
        <p className="text-sm text-zinc-400 mb-8 font-mono">
          You have successfully initialized via Google.
          Assign your unique operative handle to enter the Matrix.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#ff0055]">
                <AtSign className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="shadow_weaver"
                required
                className="w-full pl-11 pr-4 py-3.5 bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl text-sm focus:outline-none focus:border-[#ff0055] focus:ring-2 focus:ring-[#ff0055]/30 transition-all"
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-[#ff0055] text-xs font-medium bg-[#ff0055]/10 p-3 rounded-lg border border-[#ff0055]/20"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full h-12 rounded-xl text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 bg-[#ff0055] hover:bg-white text-white hover:text-[#ff0055] shadow-[0_0_20px_rgba(255,0,85,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'SYNCING...' : 'CONFIRM ALIAS'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
