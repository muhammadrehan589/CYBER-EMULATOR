'use client';

import React from 'react';
import { useQuizStore } from '@/store/quizStore';
import questions from '@/data/questions.json';

import MultipleChoice from './MultipleChoice';
import SequenceOrdering from './SequenceOrdering';
import VisualAnomaly from './VisualAnomaly';

export default function QuizEngine() {
  const { currentQuestionIndex, incrementScore, advanceQuestion, addLog } = useQuizStore();

  const question = questions[currentQuestionIndex];

  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <h1 className="text-3xl text-[#ff0055] font-black uppercase tracking-widest mb-4">Simulation Complete</h1>
        <p className="text-gray-400 font-mono">Final Score: {useQuizStore((s) => s.score)}</p>
      </div>
    );
  }

  const handleComplete = (isCorrect: boolean) => {
    addLog({
      questionId: question.id,
      isCorrect,
      timeSpent: 0 // Mocked for now
    });
    
    if (isCorrect) {
      incrementScore(10);
    }
    
    advanceQuestion();
  };

  const renderQuestion = () => {
    switch (question.type) {
      case 'mcq':
        return <MultipleChoice question={question} onComplete={handleComplete} key={question.id} />;
      case 'drag_and_drop':
        return <SequenceOrdering question={question} onComplete={handleComplete} key={question.id} />;
      case 'spot_difference':
        return <VisualAnomaly question={question} onComplete={handleComplete} key={question.id} />;
      default:
        return <div className="text-white">Unknown question type: {question.type}</div>;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6">
      <div className="w-full max-w-md flex justify-between mb-8 text-gray-500 font-mono text-sm uppercase tracking-wider">
        <span>Unit {currentQuestionIndex + 1} / {questions.length}</span>
        <span className="text-[#ff0055]">Score {useQuizStore((s) => s.score)}</span>
      </div>
      {renderQuestion()}
    </div>
  );
}
