'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface EditUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onSuccess: () => void;
}

export default function EditUsernameModal({ isOpen, onClose, currentUser, onSuccess }: EditUsernameModalProps) {
  const { update } = useSession();
  const [newUsername, setNewUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Calculate cooldown
  const lastChange = currentUser?.lastUsernameChange ? new Date(currentUser.lastUsernameChange) : null;
  const now = new Date();
  let daysSinceChange = 11; // safe default
  if (lastChange) {
    const diffTime = Math.abs(now.getTime() - lastChange.getTime());
    daysSinceChange = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  const isCooldownActive = lastChange && daysSinceChange <= 10;
  const daysLeft = 11 - daysSinceChange;

  useEffect(() => {
    if (isOpen) {
      setNewUsername('');
      setError('');
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCooldownActive || !newUsername.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/users/username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername.trim() })
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to update username.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      await update(); // refresh session
      onSuccess(); // refresh leaderboard/trigger socket
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError('Connection error. Try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#030303] border border-[#ff0055]/50 w-full max-w-md rounded-2xl shadow-[0_0_30px_rgba(255,0,85,0.3)] overflow-hidden"
        >
          <div className="p-4 border-b border-[#ff0055]/20 flex justify-between items-center bg-[#ff0055]/5">
            <h3 className="text-lg font-black tracking-widest text-[#ff0055] uppercase font-mono">
              Update Alias
            </h3>
            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="mb-6 flex items-start gap-3 bg-yellow-950/40 p-4 rounded-lg border border-yellow-500/50">
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
              <div>
                <p className="text-xs font-mono text-yellow-200 uppercase tracking-widest font-bold mb-1">
                  Warning: Action locked
                </p>
                <p className="text-xs text-yellow-500/80 leading-relaxed font-mono">
                  Changing your username locks it for 10 days. Choose wisely, operative.
                </p>
              </div>
            </div>

            {success ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-[#ff0055] mb-4 shadow-[0_0_15px_#ff0055] rounded-full" />
                <p className="font-mono text-white text-lg font-black uppercase">Identity Updated</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 block mb-2 font-mono">
                    New Username
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder={currentUser?.username || "Enter new alias"}
                    disabled={!!isCooldownActive}
                    className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl text-sm font-mono focus:outline-none focus:border-[#ff0055] focus:ring-1 focus:ring-[#ff0055]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {isCooldownActive && (
                  <p className="text-xs text-red-500 font-mono text-center">
                    Cooldown active. You can change your alias in {daysLeft} days.
                  </p>
                )}

                {error && (
                  <div className="flex items-center gap-2 text-[#ff0055] text-xs font-medium bg-[#ff0055]/10 p-3 rounded-lg border border-[#ff0055]/20 font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || isCooldownActive || !newUsername.trim()}
                  className="w-full py-3 bg-[#ff0055] hover:bg-white text-white hover:text-[#ff0055] font-black font-mono tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(255,0,85,0.4)] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Confirm Change'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
