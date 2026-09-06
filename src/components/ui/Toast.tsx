'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ToastType = 'info' | 'success' | 'error' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  const borderColor = (type: ToastType) => {
    if (type === 'success') return '#10b981';
    if (type === 'error') return '#ff0055';
    if (type === 'warning') return '#f59e0b';
    return '#06b6d4';
  };

  const icon = (type: ToastType) => {
    if (type === 'success') return '[✓]';
    if (type === 'info') return '[i]';
    return '[!]';
  };

  const ToastContainer = (
    <div className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 120, opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ borderLeftColor: borderColor(toast.type) }}
            className="pointer-events-auto flex items-start gap-3 bg-[#0d0d0d] border border-[#1c1c1c] border-l-4 rounded px-4 py-3 min-w-[260px] max-w-[380px] shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            <span
              style={{ color: borderColor(toast.type) }}
              className="font-black font-mono text-xs mt-0.5 shrink-0 drop-shadow-[0_0_6px_currentColor]"
            >
              {icon(toast.type)}
            </span>
            <p className="text-gray-300 font-mono text-xs uppercase tracking-wider leading-snug flex-1 break-words">
              {toast.message}
            </p>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-gray-600 hover:text-gray-300 text-xs shrink-0 cursor-pointer transition-colors"
            >
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return { showToast, ToastContainer };
}
