'use client';

import React from 'react';

interface VisualAnomalyProps {
  question: any;
  onComplete: (isCorrect: boolean) => void;
}

export default function VisualAnomaly({ question, onComplete }: VisualAnomalyProps) {
  // Placeholder implementation for spot_difference
  const handleSubmit = () => {
    onComplete(true);
  };

  return (
    <div className="w-full max-w-md mx-auto text-white">
      <h2 className="text-xl font-bold mb-6">{question.text}</h2>
      <div className="w-full h-64 bg-[#111] border-2 border-gray-800 rounded-xl flex items-center justify-center text-gray-500 font-mono text-sm mb-8">
        [Visual Render: {question.imageUrl}]
      </div>
      <button 
        onClick={handleSubmit}
        className="w-full py-4 bg-gradient-to-r from-[#ff0055] to-[#e60039] hover:from-[#e60039] hover:to-[#ff0055] text-white font-bold rounded-xl uppercase tracking-widest transition-all"
      >
        Simulate Correct Spot
      </button>
    </div>
  );
}
