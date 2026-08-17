'use client';

import React, { useState } from 'react';
import { useQuizStore } from '@/store/quizStore';
import quizData from '@/data/questions.json';
import LiveLeaderboard from './LiveLeaderboard';

const questions = quizData.questions;

export default function QuizEngine() {
  const { currentQuestionIndex, advanceQuestion, score } = useQuizStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const activeQuestion = questions[currentQuestionIndex];

  if (!activeQuestion) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <h1 className="text-3xl text-[#ff0055] font-black uppercase tracking-widest mb-4">Simulation Complete</h1>
        <p className="text-gray-400 font-mono">Final Score: {score}</p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!selectedOption) return;

    let pointsEarned = 0;
    
    if (selectedOption === activeQuestion.correctAnswer) {
      pointsEarned = 10;
    }
    
    setSelectedOption(null);
    advanceQuestion(pointsEarned);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto min-h-screen overflow-y-auto p-6 pb-32">
      <div className="lg:col-span-2 flex flex-col items-center w-full">
        <div className="w-full max-w-md flex justify-between mb-8 text-gray-500 font-mono text-sm uppercase tracking-wider">
          <span>Unit {currentQuestionIndex + 1} / {questions.length}</span>
          <span className="text-[#ff0055]">Score {score}</span>
        </div>

        <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl text-white">
          <div className="mb-4 text-xs font-mono text-[#ff0055] uppercase tracking-widest flex justify-between border-b border-gray-800 pb-2">
            <span>{activeQuestion.category}</span>
            <span>{activeQuestion.difficulty}</span>
          </div>
          
          <h2 className="text-xl font-bold mb-6 leading-relaxed">
            {activeQuestion.question}
          </h2>

          {(activeQuestion.type === 'mcq' || activeQuestion.type === 'true_false') && (
            <div className="space-y-3 mb-8">
              {activeQuestion.options.map((option: string, index: number) => {
                const isSelected = selectedOption === option;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(option)}
                    className={`w-full text-left p-4 rounded border transition-colors ${
                      isSelected 
                        ? 'bg-[#ff0055]/20 border-[#ff0055] text-white' 
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-750'
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="w-full py-4 bg-[#ff0055] text-white font-black uppercase tracking-widest hover:bg-[#cc0044] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Submit Intel
          </button>
        </div>
      </div>

      <div className="lg:col-span-1 w-full">
        <LiveLeaderboard />
      </div>
    </div>
  );
}
