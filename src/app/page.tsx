'use client';

import React, { useState } from 'react';
import QuizEngine from '@/components/quiz/QuizEngine';
import { ArrowLeft } from 'lucide-react';

export default function Home() {
  const [isQuizActive, setIsQuizActive] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#050505] text-white font-sans overflow-hidden flex flex-col items-center justify-center relative">
      
      {/* Background Neon Elements */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#ff0055]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#e60039]/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {!isQuizActive ? (
        <div className="flex flex-col items-center justify-center z-10 bg-black/40 p-12 rounded-3xl border border-white/5 backdrop-blur-md shadow-2xl">
          <h1 className="text-3xl font-black uppercase tracking-[0.4em] mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-[#ff0055]">
            Simulation Matrix
          </h1>
          <button 
            onClick={() => setIsQuizActive(true)}
            className="px-10 py-5 bg-[#0a0a0a] border border-[#ff0055]/80 text-[#ff0055] font-black uppercase tracking-widest hover:bg-[#ff0055] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,0,85,0.2)] hover:shadow-[0_0_40px_rgba(255,0,85,0.6)] rounded-2xl flex items-center gap-3"
          >
            <span className="w-2 h-2 rounded-full bg-[#ff0055] animate-pulse group-hover:bg-white" />
            Initialize Quiz Sequence
          </button>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col relative z-10">
          <div className="absolute top-6 left-6 z-50">
            <button 
              onClick={() => setIsQuizActive(false)}
              className="flex items-center gap-3 px-5 py-2.5 bg-black/50 border border-[#ff0055]/40 text-[#ff0055] hover:bg-[#ff0055] hover:text-white hover:border-[#ff0055] rounded-xl transition-all font-mono text-xs tracking-widest uppercase backdrop-blur-md shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            >
              <ArrowLeft className="w-4 h-4" /> Abort / Back
            </button>
          </div>
          <QuizEngine />
        </div>
      )}
    </div>
  );
}
