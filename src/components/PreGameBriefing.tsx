import React from 'react';
import { ShieldAlert, Terminal, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onAcknowledge: () => void;
  isFirstTime?: boolean;
}

export const PreGameBriefing = ({ onAcknowledge, isFirstTime = true }: Props) => {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-4xl bg-[#030005] border-2 border-[#ff0055] rounded-xl shadow-[0_0_60px_rgba(255,0,85,0.3)] overflow-hidden flex flex-col max-h-full"
      >
        {/* Header */}
        <div className="bg-black border-b border-[#ff0055]/50 p-6 flex justify-between items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[#ff0055]/10 animate-pulse pointer-events-none"></div>
          <div className="flex items-center gap-4 relative z-10">
            <ShieldAlert className="w-10 h-10 text-[#ff0055]" strokeWidth={2} />
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-mono text-white tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(255,0,85,0.8)]">
                CYBER//SIMULATOR: TACTICAL BRIEFING
              </h2>
            </div>
          </div>
          {!isFirstTime && (
            <button onClick={onAcknowledge} className="text-[#ff0055]/50 hover:text-[#ff0055] transition-colors relative z-10 cursor-pointer">
              <X className="w-8 h-8" strokeWidth={2.5} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto cyber-scrollbar flex flex-col gap-8 text-gray-300 font-mono text-sm leading-relaxed flex-1">
          
          <div className="p-4 bg-[#ff0055]/10 border border-[#ff0055]/30 rounded-lg">
            <p className="font-bold text-white text-base">
              <span className="text-[#ff0055]">Solo Matrix Initialization:</span> You are entering a highly volatile simulation environment. Your cyber-defense instincts will be tested against dynamically scaling threat scenarios.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-black text-xl mb-4 tracking-widest uppercase border-l-4 border-[#ff0055] pl-4 flex items-center shadow-sm">
              Operational Guidelines
            </h3>
            <ul className="space-y-4 pl-4">
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-[#ff0055] shrink-0 mt-0.5" />
                <span><strong className="text-white">Answering Protocols:</strong> Analyze each scenario carefully. Select the most secure course of action before the timer expires to secure the node.</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-[#ff0055] shrink-0 mt-0.5" />
                <span><strong className="text-white">Ranking & Progression:</strong> Correct actions yield XP and Matrix Coins. Consecutive correct responses build your streak, multiplying your rewards and helping you climb the global leaderboard.</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-[#ff0055] shrink-0 mt-0.5" />
                <span><strong className="text-white">Tactical Skips:</strong> If you encounter an unknown threat, you may skip the node. A 5-second penalty lock will engage, revealing the correct resolution protocol before you can proceed.</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-[#ff0055] shrink-0 mt-0.5" />
                <span><strong className="text-white">The Solo Matrix:</strong> This is an adaptive training ground. Question difficulty scales automatically based on your performance. Keep your guard up—certain actions may trigger wagers or sabotage anomalies.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        {isFirstTime && (
          <div className="bg-black border-t border-[#ff0055]/50 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto">
            <div className="flex items-center gap-2 text-[#ff0055] font-mono text-xs font-bold tracking-widest">
              <Terminal className="w-4 h-4 animate-pulse" />
              <span>AWAITING CONFIRMATION...</span>
            </div>
            
            <button 
              onClick={onAcknowledge}
              className="w-full sm:w-auto bg-[#ff0055] hover:bg-[#ff007f] text-white font-black font-mono tracking-widest uppercase px-8 py-5 rounded-none border border-[#ff0055] shadow-[0_0_30px_rgba(255,0,85,0.6)] hover:shadow-[0_0_50px_rgba(255,0,85,1)] transition-all flex items-center justify-center gap-3 active:scale-95 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" /> Acknowledge & Initialize Matrix
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};
