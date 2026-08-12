'use client';

import React, { useState } from 'react';
import QuizEngine from '@/components/quiz/QuizEngine';
import LiveLeaderboard from '@/components/quiz/LiveLeaderboard';
import { ArrowLeft } from 'lucide-react';
import { useQuizStore } from '@/store/quizStore';

export default function Home() {
  const [isQuizActive, setIsQuizActive] = useState(false);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  const handleAbort = () => {
    setIsQuizActive(false);
    resetQuiz();
  };

  return (
    <div className="h-screen w-screen bg-[#050505] text-white font-sans overflow-hidden flex flex-col items-center justify-center relative">
      
      {/* Background Neon Elements */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#ff003c]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#e60039]/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {!isQuizActive ? (
        <div className="flex flex-col items-center justify-center z-10 bg-black/40 p-12 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl">
          <h1 className="text-3xl font-black uppercase tracking-[0.4em] mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-[#ff003c]">
            Simulation Matrix
          </h1>
          <button 
            onClick={() => setIsQuizActive(true)}
            className="px-10 py-5 bg-[#0a0a0a] border border-[#ff003c]/80 text-[#ff003c] font-black uppercase tracking-widest hover:bg-[#ff003c] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,0,60,0.2)] hover:shadow-[0_0_40px_rgba(255,0,60,0.6)] rounded-2xl flex items-center gap-3 group"
          >
            <span className="w-2 h-2 rounded-full bg-[#ff003c] animate-pulse group-hover:bg-white" />
            Initialize Quiz Sequence
          </button>
        </div>
      ) : (
        <>
          {/* Global Navigation - Elevated */}
          <button 
            onClick={handleAbort}
            className="fixed top-4 left-4 z-50 flex items-center gap-3 px-5 py-2.5 bg-black/80 border border-[#ff003c]/40 text-[#ff003c] hover:bg-[#ff003c] hover:text-white hover:border-[#ff003c] rounded-xl transition-all font-mono text-xs tracking-widest uppercase backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          >
            <ArrowLeft className="w-4 h-4" /> Abort / Back
          </button>
          
          <div className="w-full h-full p-6 pt-20 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Main Quiz Engine */}
            <div className="lg:col-span-2 h-full bg-black/40 rounded-2xl border border-white/5 backdrop-blur-md shadow-2xl overflow-hidden relative">
              <QuizEngine />
            </div>

            {/* Live Leaderboard */}
            <div className="lg:col-span-1 h-full">
              <LiveLeaderboard />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
