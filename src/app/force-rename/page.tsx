'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ForceRenamePage() {
  const router = useRouter();
  const { empId, isAuthenticated, isAuthReady } = useAuth();
  const [newUsername, setNewUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthReady && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthReady, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          empId, 
          updates: { 
            username: newUsername.trim(),
            forceUsernameChange: false
          } 
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        router.push('/');
      } else {
        setError(data.error || 'Failed to update username. It might be taken.');
      }
    } catch (err: any) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthReady || !isAuthenticated) return <div className="h-screen w-full bg-black text-[#ff0055] flex items-center justify-center font-mono">Loading...</div>;

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center p-4 select-none">
      <div className="max-w-md w-full bg-[#0a0a0a] border border-[#ff0055] p-8 rounded-xl shadow-[0_0_30px_rgba(255,0,85,0.2)]">
        <h1 className="text-2xl font-bold text-[#ff0055] mb-4 font-mono tracking-widest text-center uppercase">System Directive</h1>
        <p className="text-gray-400 mb-6 text-sm text-center">
          Your current username has been flagged by an Administrator. You must change your username to continue accessing the system.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="New Username" 
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-[#ff0055]"
              required
            />
          </div>
          {error && <div className="text-red-500 text-xs font-mono">{error}</div>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#ff0055] hover:bg-white text-white hover:text-[#ff0055] font-bold py-3 rounded transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'CONFIRM NEW USERNAME'}
          </button>
        </form>
      </div>
    </div>
  );
}
