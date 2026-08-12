'use client';

import React from 'react';
import QuizEngine from '@/components/quiz/QuizEngine';

export default function Home() {
  return (
    <div className="h-screen w-screen bg-black text-white font-sans overflow-hidden">
      <QuizEngine />
    </div>
  );
}
