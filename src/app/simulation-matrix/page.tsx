'use client';

import React, { useEffect } from 'react';
import QuizEngine from '@/components/quiz/QuizEngine';
import { ArrowLeft } from 'lucide-react';
import { useQuizStore } from '@/store/quizStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const resetQuiz = useQuizStore((state) => state.resetQuiz);
  const router = useRouter();

  useEffect(() => {
    resetQuiz();
  }, [resetQuiz]);

  const handleAbort = () => {
    resetQuiz();
    router.push('/');
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white font-sans overflow-x-hidden flex flex-col items-center relative">
      
      {/* Background Neon Elements */}
      <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] bg-[#ff003c]/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#e60039]/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Global Navigation - Elevated */}
      
      
      <div className="w-full flex-grow p-4 sm:p-8 pt-24 relative z-10 flex justify-center items-start max-w-5xl mx-auto">
        {/* Main Quiz Engine, no outer constrained container to fix layout spillage */}
        <QuizEngine />
      </div>
    </div>
  );
}

