'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuizStore } from '@/store/quizStore';
import quizData from '@/data/questions.json';
import { useRouter } from 'next/navigation';
import LiveLeaderboard from './LiveLeaderboard';

const questions = quizData.questions;

export default function QuizEngine() {
  const router = useRouter();
  const { currentQuestionIndex, advanceQuestion, score, multiplier, resetStreak, coinsEarned, xpEarned } = useQuizStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [activeMedia, setActiveMedia] = useState<{ type: 'video' | 'image' | 'audio', url: string } | null>(null);
  const [showQR, setShowQR] = useState(false);
  
  const [isSabotaged, setIsSabotaged] = useState(false);
  const [sabotageMessage, setSabotageMessage] = useState<string | null>(null);
  const [socket, setSocket] = useState<any>(null);

  const [quizMode, setQuizMode] = useState<'standard' | 'wager'>('standard');
  const [wagerAmount, setWagerAmount] = useState(0);

  useEffect(() => {
    import('socket.io-client').then(({ io }) => {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
      const newSocket = io(socketUrl, { transports: ['websocket', 'polling'] });
      setSocket(newSocket);
    });
  }, []);

  const triggerGotcha = () => {
    const mediaArsenal = [
      { type: 'video', url: '/videos/hack1.mp4' },
      { type: 'image', url: '/images/scary1.jpg' },
      { type: 'audio', url: '/sounds/screech.mp3' }
    ];
    const selected = mediaArsenal[Math.floor(Math.random() * mediaArsenal.length)];
    setActiveMedia(selected as any);
    setShowQR(false); // Hide QR immediately on click
    
    if (selected.type === 'image') {
      setTimeout(() => setActiveMedia(null), 5000); // 5-second hard lock
    } else if (selected.type === 'audio') {
      const audio = new Audio(selected.url);
      audio.play().catch(() => setActiveMedia(null)); // Fallback if browser blocks audio
      audio.onended = () => setActiveMedia(null); // Unlock when audio finishes
    }
  };

  const initiateWagerRound = () => {
    setQuizMode('wager');
    // Logic to pause standard timer and render the betting UI
  };

  useEffect(() => {
    const handlePhysicalSmash = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && quizMode === 'standard') {
        initiateWagerRound();
      }
    };
    window.addEventListener('keydown', handlePhysicalSmash);
    return () => window.removeEventListener('keydown', handlePhysicalSmash);
  }, [quizMode]);
  
  // Hydration check since we use localStorage persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const activeQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    let spawnTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    const scheduleQR = () => {
      const delay = Math.floor(Math.random() * (180000 - 120000 + 1)) + 120000; // 2 to 3 mins
      spawnTimer = setTimeout(() => {
        setShowQR(true);
        hideTimer = setTimeout(() => {
          setShowQR(false);
          scheduleQR(); // Restart the cycle
        }, 60000); // 1 minute visibility
      }, delay);
    };

    scheduleQR();

    return () => {
      clearTimeout(spawnTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('sabotage_received', (data: { attackerName: string, penaltyXp: number }) => {
      // Check if player has active decoy proxy
      const store = useQuizStore.getState();
      if (store.inventory.decoys > 0) {
        store.consumeDecoy();
        socket.emit('sabotage_deflected', { attackerId: data.attackerName });
        return;
      }

      // Trigger shake and red glitch
      setIsSabotaged(true);
      setSabotageMessage(`⚠️ ZERO-DAY EXPLOIT INJECTED BY ${data.attackerName || 'ANONYMOUS'} (-${data.penaltyXp} XP)`);
      
      // Deduct XP locally
      store.deductXP(data.penaltyXp || 150);

      // Clear effect after 2.5 seconds
      setTimeout(() => {
        setIsSabotaged(false);
        setSabotageMessage(null);
      }, 2500);
    });

    return () => {
      socket.off('sabotage_received');
    };
  }, [socket]);

  // Timer Initialization
  useEffect(() => {
    if (!activeQuestion) return;
    
    const diff = activeQuestion.difficulty?.toLowerCase() || '';
    let initialTime = 30;
    
    if (diff.includes('hard') || diff.includes('expert') || diff.includes('difficult')) {
      initialTime = 60;
    } else if (diff.includes('medium')) {
      initialTime = 45;
    } else if (diff.includes('easy')) {
      initialTime = 30;
    }
    
    setTimeLeft(initialTime);
  }, [currentQuestionIndex, activeQuestion]);

  // Countdown Logic
  useEffect(() => {
    if (isSubmitted || !activeQuestion || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, activeQuestion, timeLeft]);

  // Timeout Trigger
  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted && activeQuestion) {
      resetStreak();
      setIsTimeout(true);
      setIsCorrect(false);
      setIsSubmitted(true);

      const diff = activeQuestion.difficulty?.toLowerCase() || '';
      let initialTime = 30;
      if (diff.includes('hard') || diff.includes('expert') || diff.includes('difficult')) initialTime = 60;
      else if (diff.includes('medium')) initialTime = 45;

      useQuizStore.getState().addLog({
        questionId: String(activeQuestion.id),
        isCorrect: false,
        timeSpent: initialTime,
      });
    }
  }, [timeLeft, isSubmitted, activeQuestion, resetStreak]);

  // Handle Simulation Complete - Save Session
  useEffect(() => {
    if (mounted && !activeQuestion && score > 0) {
      const saveSession = async () => {
        const state = useQuizStore.getState();
        const empId = localStorage.getItem('currentUserEmpId') || 'EMP-456'; 
        
        try {
          await fetch('/api/quiz-sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              empId,
              finalScore: state.score,
              highestStreak: state.highestStreak || 0,
              questionsPlayed: state.playedQuestions,
              sessionLogs: state.sessionLogs,
            }),
          });

          await fetch('/api/users', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              empId,
              updates: { score: state.score }
            }),
          });
        } catch (error) {
          console.error('[QuizEngine] Failed to save session:', error);
        }
      };
      saveSession();
    }
  }, [activeQuestion, mounted, score]);

  if (!mounted) return <div className="min-h-screen w-full bg-[#050505]" />;

  if (!activeQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full">
        <h1 className="text-3xl text-[#ff0055] font-black uppercase tracking-widest mb-4">Simulation Complete</h1>
        <p className="text-gray-400 font-mono mb-2">Final Score: {score}</p>
        <p className="text-yellow-400 font-mono mb-2">Coins Earned: {coinsEarned}</p>
        <p className="text-blue-400 font-mono mb-8">XP Earned: {xpEarned}</p>
        <button 
          onClick={() => {
            useQuizStore.getState().resetQuiz();
            router.push('/');
          }}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const submitAnswer = (selected: string | null) => {
    const answer = activeQuestion.correctAnswer || '';
    let correct = false;
    
    if (selected) {
      correct = 
        selected === answer || 
        selected.startsWith(answer + '.') || 
        selected.startsWith(answer + ')') ||
        selected.includes(answer);
    }
      
    setIsCorrect(correct);
    setIsTimeout(false);
    setIsSubmitted(true);

    const diff = activeQuestion.difficulty?.toLowerCase() || '';
    let initialTime = 30;
    if (diff.includes('hard') || diff.includes('expert') || diff.includes('difficult')) initialTime = 60;
    else if (diff.includes('medium')) initialTime = 45;

    useQuizStore.getState().addLog({
      questionId: String(activeQuestion.id),
      isCorrect: correct,
      timeSpent: initialTime - timeLeft,
    });

    if (correct) {
      let xpEarned = 20;
      let coinsEarned = 10;
      if (diff.includes('hard') || diff.includes('expert') || diff.includes('difficult')) {
        xpEarned = 100;
        coinsEarned = 50;
      } else if (diff.includes('medium')) {
        xpEarned = 50;
        coinsEarned = 20;
      }

      useQuizStore.setState((state) => ({
        coinsEarned: state.coinsEarned + coinsEarned,
        xpEarned: state.xpEarned + xpEarned
      }));

      const empId = localStorage.getItem('currentUserEmpId') || 'EMP-456';
      fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empId,
          inc: { coins: coinsEarned, xp: xpEarned }
        })
      }).catch(err => console.error('[QuizEngine] Real-time reward sync failed:', err));
    }
  };

  const handleAction = () => {
    if (!isSubmitted) {
      if (!selectedOption) return;
      submitAnswer(selectedOption);
    } else {
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsTimeout(false);
      advanceQuestion(isCorrect, 10);
    }
  };

  const handleSaveAndAbort = () => {
    router.push('/');
  };

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto min-h-screen overflow-y-auto p-6 pb-8 relative transition-all ${isSabotaged ? 'animate-cyber-shake border-4 border-red-600' : ''}`}>
      
      {/* LEFT SIDE: QUIZ UI */}
      <div className="lg:col-span-2 flex flex-col w-full h-auto">
        <div className="w-full flex justify-between items-center mb-6">
          <button 
            onClick={handleSaveAndAbort}
            className="px-4 py-2 bg-gray-800 hover:bg-red-900/50 text-gray-300 hover:text-white border border-gray-700 hover:border-red-500 rounded text-xs font-mono uppercase tracking-widest transition-colors"
          >
            Save & Abort
          </button>
        </div>

        <div className="w-full flex justify-between mb-4 text-gray-500 font-mono text-sm uppercase tracking-wider">
          <span>Unit {currentQuestionIndex + 1} / {questions.length}</span>
          <div className="flex items-center gap-4">
            {multiplier > 1 && (
              <span className="text-[#ff9900] font-black animate-pulse">🔥 {multiplier}X ACTIVE</span>
            )}
            <span className="text-yellow-400">🪙 {coinsEarned}</span>
            <span className="text-blue-400">✨ {xpEarned} XP</span>
            <span className="text-[#ff0055]">Score {score}</span>
          </div>
        </div>

        <div className="w-full h-auto bg-gray-900 border border-gray-800 p-6 pb-8 rounded-lg shadow-xl text-white flex flex-col">
          <div className="mb-4 text-xs font-mono text-[#ff0055] uppercase tracking-widest flex items-center justify-between border-b border-gray-800 pb-2">
            <div className="flex gap-4">
              <span>{activeQuestion.category}</span>
              <span className="text-gray-700">•</span>
              <span>{activeQuestion.difficulty}</span>
            </div>
            <div className={`font-black text-lg ${timeLeft <= 5 && !isSubmitted ? 'text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]' : 'text-gray-400'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
          </div>
          
          <h2 className="text-xl font-bold mb-6 leading-relaxed">
            {activeQuestion.question}
          </h2>
          {showQR && (
            <div onClick={triggerGotcha} className="my-6 p-4 bg-white rounded flex justify-center items-center mx-auto border-4 border-gray-300 cursor-pointer shadow-lg hover:bg-gray-50 transition-colors">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=CyberShield_Gotcha_Test" alt="Phishing Test QR" className="rounded" />
              <div className="ml-4 text-left">
                <p className="text-black font-extrabold text-xl">SCAN OR CLICK</p>
                <p className="text-gray-600 text-sm">Testing Phase 7 Triggers</p>
              </div>
            </div>
          )}

          {(activeQuestion.type === 'mcq' || activeQuestion.type === 'true_false') && (
            <div className="space-y-3 mb-8">
              {activeQuestion.options?.map((option: string, index: number) => {
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
                {isTimeout ? 'INCORRECT - TIME EXPIRED' : (isCorrect ? 'CORRECT' : 'INCORRECT')}
              </h3>
              <p className="text-gray-300 mb-2 font-bold">
                Correct Answer: {activeQuestion.correctAnswer}
              </p>
              <p className="text-gray-400 text-sm">
                {activeQuestion.explanation}
              </p>
            </div>
          )}

          <div className="mt-auto">
            <button
              onClick={handleAction}
              disabled={!isSubmitted && !selectedOption}
              className="w-full mt-4 py-4 bg-[#ff0055] text-white font-black uppercase tracking-widest hover:bg-[#cc0044] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitted ? 'NEXT QUESTION' : 'Submit Intel'}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: LEADERBOARD */}
      <div className="lg:col-span-1 w-full h-full bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden flex flex-col">
        <LiveLeaderboard />
      </div>

      {activeMedia && (
        <div className="fixed inset-0 z-[10000] bg-black flex justify-center items-center pointer-events-none">
          {activeMedia.type === 'video' && (
            <video src={activeMedia.url} autoPlay playsInline onEnded={() => setActiveMedia(null)} className="w-full h-full object-cover" />
          )}
          {activeMedia.type === 'image' && (
            <img src={activeMedia.url} className="max-h-[80vh] w-full object-contain animate-pulse" alt="Compromised" />
          )}
          {activeMedia.type === 'audio' && (
            <div className="text-center">
              <h1 className="text-red-600 text-6xl font-black animate-ping mb-4">⚠️ MALWARE DETECTED ⚠️</h1>
              <p className="text-white text-2xl font-bold">Listen carefully...</p>
            </div>
          )}
        </div>
      )}

      {isSabotaged && (
        <div className="fixed inset-0 z-[9999] pointer-events-none bg-red-900/30 backdrop-hue-rotate-90 flex flex-col items-center justify-center">
          <div className="bg-black/90 border border-red-500 p-6 rounded-lg shadow-[0_0_50px_rgba(239,68,68,0.8)] text-center animate-pulse">
            <h2 className="text-red-500 font-mono text-3xl font-black tracking-widest mb-2">SYSTEM COMPROMISED</h2>
            <p className="text-white font-mono text-lg">{sabotageMessage}</p>
          </div>
        </div>
      )}

      {quizMode === 'wager' && (
        <div className="absolute inset-0 bg-red-900/90 z-40 flex flex-col items-center justify-center border-8 border-red-600 animate-pulse">
          <h2 className="text-4xl font-black text-white">🔥 HIGH STAKES WAGER 🔥</h2>
          <p className="text-xl text-red-200 mt-2">Bet your coins. Double the payout, or lose it all.</p>
          {/* Betting input and Wager Question component go here */}
        </div>
      )}
    </div>
  );
}
