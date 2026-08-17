'use client';

import React, { useState, useEffect } from 'react';
import { useQuizStore } from '@/store/quizStore';
import quizData from '@/data/questions.json';
import { useRouter } from 'next/navigation';

const questions = quizData.questions;

export default function QuizEngine() {
  const router = useRouter();
  const { currentQuestionIndex, advanceQuestion, incrementScore, score } = useQuizStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Hydration check since we use localStorage persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="min-h-screen w-full bg-[#050505]" />;

  const activeQuestion = questions[currentQuestionIndex];

  if (!activeQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <h1 className="text-3xl text-[#ff0055] font-black uppercase tracking-widest mb-4">Simulation Complete</h1>
        <p className="text-gray-400 font-mono mb-8">Final Score: {score}</p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleAction = () => {
    if (!isSubmitted) {
      if (!selectedOption) return;
      const correct = selectedOption === activeQuestion.correctAnswer;
      setIsCorrect(correct);
      if (correct) {
        incrementScore(10);
      }
      setIsSubmitted(true);
    } else {
      setSelectedOption(null);
      setIsSubmitted(false);
      advanceQuestion();
    }
  };

  const handleSaveAndAbort = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen overflow-y-auto p-6 pb-32 max-w-4xl mx-auto">
      <div className="w-full flex justify-between items-center mb-8">
        <button 
          onClick={handleSaveAndAbort}
          className="px-4 py-2 bg-gray-800 hover:bg-red-900/50 text-gray-300 hover:text-white border border-gray-700 hover:border-red-500 rounded text-xs font-mono uppercase tracking-widest transition-colors"
        >
          Save & Abort
        </button>
      </div>

      <div className="w-full flex justify-between mb-8 text-gray-500 font-mono text-sm uppercase tracking-wider">
        <span>Unit {currentQuestionIndex + 1} / {questions.length}</span>
        <span className="text-[#ff0055]">Score {score}</span>
      </div>

      <div className="w-full bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl text-white">
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
                  onClick={() => !isSubmitted && setSelectedOption(option)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-4 rounded border transition-colors ${
                    isSelected 
                      ? 'bg-[#ff0055]/20 border-[#ff0055] text-white' 
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-750'
                  } ${isSubmitted ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {isSubmitted && (
          <div className={`mb-8 p-4 border rounded ${isCorrect ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
            <h3 className={`text-lg font-black uppercase tracking-widest mb-2 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
              {isCorrect ? 'CORRECT' : 'INCORRECT'}
            </h3>
            <p className="text-gray-300 mb-2 font-bold">
              Correct Answer: {activeQuestion.correctAnswer}
            </p>
            <p className="text-gray-400 text-sm">
              {activeQuestion.explanation}
            </p>
          </div>
        )}

        <button
          onClick={handleAction}
          disabled={!isSubmitted && !selectedOption}
          className="w-full py-4 bg-[#ff0055] text-white font-black uppercase tracking-widest hover:bg-[#cc0044] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isSubmitted ? 'NEXT QUESTION' : 'Submit Intel'}
        </button>
      </div>
    </div>
  );
}
