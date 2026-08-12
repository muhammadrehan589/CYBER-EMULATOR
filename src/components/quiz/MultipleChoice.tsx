'use client';

import React, { useState } from 'react';

interface MultipleChoiceProps {
  question: any;
  onComplete: (isCorrect: boolean) => void;
}

export default function MultipleChoice({ question, onComplete }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selected) {
      onComplete(selected === question.answer);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6 text-white">{question.text}</h2>
      <div className="space-y-3">
        {question.options.map((opt: string) => (
          <button
            key={opt}
            onClick={() => setSelected(opt)}
            className={`w-full p-4 rounded-xl text-left font-medium transition-colors ${
              selected === opt 
                ? 'bg-[#ff0055] text-white border-2 border-[#ff0055]' 
                : 'bg-[#111] text-gray-300 border-2 border-gray-800 hover:border-gray-600'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <button 
        onClick={handleSubmit}
        disabled={!selected}
        className="mt-8 w-full py-4 bg-gradient-to-r from-[#ff0055] to-[#e60039] hover:from-[#e60039] hover:to-[#ff0055] text-white font-bold rounded-xl disabled:opacity-50 transition-all uppercase tracking-widest"
      >
        Submit Answer
      </button>
    </div>
  );
}
