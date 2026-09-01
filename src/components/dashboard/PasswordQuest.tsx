'use client';

import React, { useState } from 'react';
import { useQuizStore } from '@/store/quizStore';

interface PasswordQuestProps {
  onClose: () => void;
  onClaimed?: () => void;
}

export default function PasswordQuest({ onClose, onClaimed }: PasswordQuestProps) {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [success, setSuccess] = useState(false);
  const { addCoins, addXP } = useQuizStore();

  const evaluatePassword = (pass: string) => {
    setPassword(pass);
    let score = 0;
    if (pass.length > 8) score += 25;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 25;
    setStrength(score);
  };

  const claimReward = async () => {
    if (strength === 100) {
      const currentEmpId = localStorage.getItem('currentUserEmpId');
      if (currentEmpId) {
        await fetch('/api/users', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ empId: currentEmpId, inc: { coins: 50, xp: 100 } }),
        });
      }
      
      addCoins(50);
      addXP(100);
      setSuccess(true);
      if (onClaimed) onClaimed();
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const getStrengthColor = () => {
    if (strength < 50) return 'bg-red-500';
    if (strength < 100) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-md bg-black/90 p-4">
      <div className="w-full max-w-lg bg-[#0a030d] border border-blue-500/50 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] overflow-hidden flex flex-col font-mono">
        <div className="flex justify-between items-center p-4 border-b border-blue-500/30 bg-blue-900/20">
          <h2 className="text-xl font-black text-blue-400 tracking-widest uppercase">
            🛡️ Side Quest: Password Forge
          </h2>
          <button onClick={onClose} className="text-blue-400 hover:text-white">X</button>
        </div>
        
        <div className="p-6">
          {success ? (
            <div className="text-center animate-pulse">
              <h3 className="text-2xl font-black text-green-500 mb-4">ACCESS GRANTED</h3>
              <p className="text-white">+50 🪙 | +100 ✨</p>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-sm mb-6">
                Forge a master key. Requires length {'>'} 8, uppercase, number, and special character.
              </p>
              
              <input 
                type="text" 
                value={password}
                onChange={(e) => evaluatePassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-black border border-gray-700 text-white p-3 rounded mb-4 focus:outline-none focus:border-blue-500 transition-colors"
              />
              
              <div className="w-full h-2 bg-gray-800 rounded overflow-hidden mb-2">
                <div 
                  className={`h-full transition-all duration-300 ${getStrengthColor()}`} 
                  style={{ width: `${strength}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mb-6">
                <span>Strength: {strength}%</span>
                <span>{strength === 100 ? 'UNBREAKABLE' : 'VULNERABLE'}</span>
              </div>
              
              <button 
                onClick={claimReward}
                disabled={strength < 100}
                className={`w-full py-3 rounded font-black uppercase tracking-widest transition-all ${strength === 100 ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
              >
                Claim Bounty
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
