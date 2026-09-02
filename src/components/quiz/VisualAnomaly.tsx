'use client';

import React from 'react';

interface VisualAnomalyProps {
  question: any;
  onComplete: (isCorrect: boolean) => void;
}

export default function VisualAnomaly({ onComplete }: VisualAnomalyProps) {
  return (
    <div className="w-full max-w-md mx-auto text-white text-center">
      <div className="w-full h-64 bg-[#111] border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 font-mono text-sm mb-8 gap-3">
        <span className="text-2xl">🔧</span>
        <span>VISUAL ANOMALY MODULE</span>
        <span className="text-xs text-gray-600">[ NOT YET IMPLEMENTED ]</span>
      </div>
      <button
        onClick={() => onComplete(false)}
        className="w-full py-4 bg-gray-800 text-gray-400 font-bold rounded-xl uppercase tracking-widest cursor-not-allowed"
        disabled
      >
        Skip Question (Module Offline)
      </button>
    </div>
  );
}
