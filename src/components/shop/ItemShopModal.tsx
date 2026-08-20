'use client';

import React, { useState } from 'react';
import { useQuizStore } from '@/store/quizStore';

interface ItemShopModalProps {
  onClose: () => void;
}

export default function ItemShopModal({ onClose }: ItemShopModalProps) {
  const { coinsEarned, xpEarned, buyItem } = useQuizStore();
  const [feedback, setFeedback] = useState<{ id: string, message: string, type: 'success' | 'error' } | null>(null);

  const handlePurchase = (itemType: 'hints' | 'timeFreezes' | 'shields', cost: number, id: string) => {
    const success = buyItem(itemType, cost);
    if (success) {
      setFeedback({ id, message: 'ACQUIRED', type: 'success' });
    } else {
      setFeedback({ id, message: 'INSUFFICIENT FUNDS', type: 'error' });
    }
    setTimeout(() => setFeedback(null), 2000);
  };

  const boosters = [
    {
      id: 'hint-hacker',
      type: 'hints' as const,
      name: 'Hint Hacker',
      cost: 50,
      description: 'Scrambles and eliminates 50% of incorrect choices.',
      icon: '🧠'
    },
    {
      id: 'chronos-freeze',
      type: 'timeFreezes' as const,
      name: 'Chronos Freeze',
      cost: 30,
      description: 'Freezes question countdown timer for 15 seconds.',
      icon: '⏱️'
    },
    {
      id: 'firewall-shield',
      type: 'shields' as const,
      name: 'Firewall Shield',
      cost: 100,
      description: 'Absorbs 1 wrong answer penalty without breaking streak.',
      icon: '🛡️'
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-black/90 p-4">
      <div className="w-full max-w-4xl bg-gray-900 border-2 border-red-500/40 rounded-xl shadow-[0_0_30px_rgba(239,68,68,0.2)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-red-500/40 bg-black/50 flex-col md:flex-row gap-4">
          <h2 className="text-3xl font-black text-red-500 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">
            Black Market
          </h2>
          <div className="flex gap-6 font-mono font-bold text-lg">
            <span className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">🪙 Coins: {coinsEarned}</span>
            <span className="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">⚡ XP: {xpEarned}</span>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {boosters.map((booster) => (
            <div key={booster.id} className="flex flex-col bg-black/60 border border-gray-700 hover:border-red-500/60 p-6 rounded-lg transition-all duration-300 shadow-lg relative group">
              <div className="text-4xl mb-4 text-center drop-shadow-md">{booster.icon}</div>
              <h3 className="text-xl font-black text-white text-center uppercase mb-2 group-hover:text-red-400 transition-colors">
                {booster.name}
              </h3>
              <p className="text-gray-400 text-sm text-center mb-6 flex-grow font-mono">
                {booster.description}
              </p>
              <div className="flex justify-between items-center mb-4 font-mono font-bold">
                <span className="text-yellow-400">Cost:</span>
                <span className="text-white bg-gray-800 px-3 py-1 rounded border border-gray-600">{booster.cost} 🪙</span>
              </div>
              <button
                onClick={() => handlePurchase(booster.type, booster.cost, booster.id)}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded transition-colors active:scale-95 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_20px_rgba(220,38,38,0.8)]"
              >
                Purchase
              </button>
              
              {/* Visual Feedback Overlay */}
              {feedback?.id === booster.id && (
                <div className={`absolute inset-0 flex items-center justify-center bg-black/90 rounded-lg border-2 z-10 backdrop-blur-sm ${feedback.type === 'success' ? 'border-green-500' : 'border-red-600'}`}>
                  <span className={`text-xl font-black tracking-widest uppercase p-4 text-center ${feedback.type === 'success' ? 'text-green-500 animate-pulse drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'text-red-600 animate-bounce drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]'}`}>
                    {feedback.message}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer / Close Button */}
        <div className="p-6 border-t border-red-500/40 bg-black/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 border border-gray-500 text-gray-300 hover:text-white hover:border-red-500 hover:bg-red-900/20 font-mono font-bold uppercase tracking-widest transition-all"
          >
            EXIT SHOP // RETURN TO MATRIX
          </button>
        </div>
      </div>
    </div>
  );
}
