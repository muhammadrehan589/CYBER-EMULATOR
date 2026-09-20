'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuizStore } from '@/store/quizStore';
import { useRouter } from 'next/navigation';
import LiveLeaderboard from './LiveLeaderboard';
import SequenceOrdering from './SequenceOrdering';
import { PreGameBriefing } from '@/components/PreGameBriefing';
import { QRCodeSVG } from 'qrcode.react';
import { DIFFICULTY_TIME_LIMITS, DIFFICULTY_XP_REWARDS, DIFFICULTY_COIN_REWARDS } from '@/config/quiz';
import { useAuth } from '@/hooks/useAuth';

const shuffleArray = (array: any[]) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// QuizEngine owns its own local question index (soloQuestionIndex) that is
// always bounded to the local 10-question shuffled array.
// The store's advanceQuestion is called only for score/streak side-effects.
// This keeps solo mode fully decoupled from the battle page which has its
// own socket-fetched question list and no dependency on quizStore.
export default function QuizEngine() {
  const router = useRouter();
  const { empId } = useAuth();
  const { advanceQuestion, score, multiplier, resetStreak, coinsEarned, xpEarned, inventory } = useQuizStore();

  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [soloQuestionIndex, setSoloQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      const burnedQuestions = JSON.parse(localStorage.getItem('burned_questions') || '[]');
      const excludeParam = burnedQuestions.length > 0 ? `&exclude=${burnedQuestions.join(',')}` : '';
      const url = `/api/questions?batch=711${excludeParam}&t=${Date.now()}`;
      
      try {
        const res = await fetch(url, { cache: 'no-store' });
        const data = await res.json();
        let dbQuestions = data.data || [];
        
        if (dbQuestions.length === 0) {
           console.log("Database exhausted. Resetting matrix...");
           localStorage.setItem('burned_questions', JSON.stringify([]));
           const resetRes = await fetch(`/api/questions?batch=711&t=${Date.now()}`, { cache: 'no-store' });
           const resetData = await resetRes.json();
           dbQuestions = resetData.data || [];
        }
        
        setAllQuestions(dbQuestions);
        if (dbQuestions.length > 0) {
          setQuestions([dbQuestions[0]]);
        } else {
          setQuestions([]);
        }
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const [qrEvent, setQrEvent] = useState({ active: false, payload: "" });

  const [wagerOffered, setWagerOffered] = useState(false);
  const [isWagerActive, setIsWagerActive] = useState(false);
  const [wagerAmount, setWagerAmount] = useState({ coins: 0, xp: 0 });

  const publicAssets = [
    "/secret-gadget-blueprint.png",
    "/classified-intel-01.jpg",
    "/black-market-voucher.pdf"
  ];

  useEffect(() => {
    // Spawns much less frequently (30s to 90s delay)
    const popTime = Math.floor(Math.random() * 60000) + 30000; 
    
    const dropTimer = setTimeout(() => {
      const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://cyber-emulator.vercel.app'}/black-market?secret=qr_discovery`;
      
      setQrEvent({ active: true, payload: fullUrl });

      // Auto close after 5 seconds
      setTimeout(() => {
        setQrEvent(prev => prev.active ? { active: false, payload: "" } : prev);
      }, 5000);

    }, popTime);

    return () => clearTimeout(dropTimer);
  }, []);
  const [isBriefing, setIsBriefing] = useState(true);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [skipTimer, setSkipTimer] = useState(0);
  const [skipsUsed, setSkipsUsed] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const skipHistory = JSON.parse(localStorage.getItem('skip_history') || '[]');
      const tenMinsAgo = Date.now() - 10 * 60 * 1000;
      const validSkips = skipHistory.filter((time: number) => time > tenMinsAgo);
      setSkipsUsed(validSkips.length);
      localStorage.setItem('skip_history', JSON.stringify(validSkips));
    }
  }, [soloQuestionIndex]);

  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);

  const [activeMedia, setActiveMedia] = useState<{ type: 'video'|'image'|'audio', url: string } | null>(null);

  const activeQuestion = questions[soloQuestionIndex];

  // For sequence challenges
  const [currentSequence, setCurrentSequence] = useState<any[]>([]);
  
  // For text challenges
  const [textInputAnswer, setTextInputAnswer] = useState('');

  // 1. Timer Logic
  const [timeLeft, setTimeLeft] = useState(999);
  const [isTimeout, setIsTimeout] = useState(false);
  
  const getInitialTime = (q: any) => {
    if (!q || !q.difficulty) return 30;
    const diff = q.difficulty.toLowerCase();
    if (diff === 'hard') return 60;
    if (diff === 'medium') return 45;
    return 30; // default easy
  };

  useEffect(() => {
    if (!activeQuestion || isSubmitted) return;
    
    // Initialize Timer
    if (timeLeft === 999) {
      setTimeLeft(getInitialTime(activeQuestion));
      return; 
    }

    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [activeQuestion, timeLeft, isSubmitted]);
  
  const [isTimerFrozen, setIsTimerFrozen] = useState(false);
  
  const [isSabotaged, setIsSabotaged] = useState(false);
  const [sabotageMessage, setSabotageMessage] = useState<string | null>(null);
    const [autoSolvedCount, setAutoSolvedCount] = useState(0);
  const [socket, setSocket] = useState<any>(null);
  // Removed duplicate wagerAmount

  useEffect(() => {
    import('socket.io-client').then(({ io }) => {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || `http://${window.location.hostname}:3001`;
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
    
    if (selected.type === 'image') {
      setTimeout(() => setActiveMedia(null), 5000); // 5-second hard lock
    } else if (selected.type === 'audio') {
      const audio = new Audio(selected.url);
      audio.play().catch(() => setActiveMedia(null)); // Fallback if browser blocks audio
      audio.onended = () => setActiveMedia(null); // Unlock when audio finishes
    }
  };

  // Hydration check since we use localStorage persist
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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
      setAutoSolvedCount(0);
      setCurrentSequence(activeQuestion.draggableItems || []);
    
    const initialTime = getInitialTime(activeQuestion);    
    setTimeLeft(initialTime);
  }, [soloQuestionIndex, activeQuestion]);

  // Countdown Logic
  useEffect(() => {
    if (isSubmitted || !activeQuestion || timeLeft <= 0 || isTimerFrozen) return;

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
  }, [isSubmitted, activeQuestion, timeLeft, isTimerFrozen]);

  // Timeout Trigger
  useEffect(() => {
    if (timeLeft === 0 && !isSubmitted && activeQuestion) {
      resetStreak();
      setIsTimeout(true);
      setIsCorrect(false);
      setIsSubmitted(true);

      const diff = (activeQuestion.difficulty?.toLowerCase() || 'easy') as keyof typeof DIFFICULTY_TIME_LIMITS;
      const initialTime = DIFFICULTY_TIME_LIMITS[diff] ?? 30;

      useQuizStore.getState().addLog({
        questionId: String(activeQuestion.questionId),
        isCorrect: false,
        timeSpent: initialTime,
      });
    }
  }, [timeLeft, isSubmitted, activeQuestion, resetStreak]);

  // Handle Simulation Complete - Save Session
  useEffect(() => {
    if (mounted && !activeQuestion) {
      const saveSession = async () => {
        const state = useQuizStore.getState();
        const sessionEmpId = empId || 'EMP-456'; 
        
        try {
          await fetch('/api/quiz-sessions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              empId: sessionEmpId,
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
  }, [activeQuestion, mounted, score, empId]);

  useEffect(() => {
    if (isSkipping && skipTimer > 0) {
      const timer = setTimeout(() => {
        setSkipTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isSkipping && skipTimer === 0) {
      setIsSkipping(false);
      handleAction(true);
    }
  }, [isSkipping, skipTimer]);

  const handleTimeout = () => {
    if (isSubmitted) return;
    setIsTimeout(true);
    setIsSubmitted(true);
    setIsCorrect(false);

    const initialTime = getInitialTime(activeQuestion);

    useQuizStore.getState().addLog({
      questionId: String(activeQuestion.questionId),
      isCorrect: false,
      timeSpent: initialTime,
    });
  };

  const handleSkip = () => {
    if (isSubmitted || isSkipping) return;
    
    if (typeof window !== 'undefined') {
      const skipHistory = JSON.parse(localStorage.getItem('skip_history') || '[]');
      const tenMinsAgo = Date.now() - 10 * 60 * 1000;
      const validSkips = skipHistory.filter((time: number) => time > tenMinsAgo);
      if (validSkips.length >= 5) {
        alert("Skip limit reached (5 per 10 minutes).");
        return;
      }
      validSkips.push(Date.now());
      localStorage.setItem('skip_history', JSON.stringify(validSkips));
      setSkipsUsed(validSkips.length);
    }

    const initialTime = getInitialTime(activeQuestion);

    useQuizStore.getState().addLog({
      questionId: String(activeQuestion.questionId),
      isCorrect: false,
      timeSpent: initialTime - timeLeft,
    });

    setIsSubmitted(true);
    setIsCorrect(false);
    setIsSkipping(true);
    setSkipTimer(5);
  };

  const submitAnswer = (selected: string | null) => {
    const answer = activeQuestion.correctAnswer || '';
    let correct = false;
    
    if (activeQuestion.type === 'sequence') {
      try {
        const defaultOrder = JSON.stringify(activeQuestion.items?.map((i: any) => i.id) || []);
        const orderIds = JSON.parse(selected || defaultOrder);
        correct = JSON.stringify(orderIds) === JSON.stringify(activeQuestion.correctOrder);
      } catch(e) { correct = false; }
    } else if (activeQuestion.type === 'text_input') {
      const userInput = (selected || '').toLowerCase();
      const keywords = (activeQuestion.keywords || []).map((k: string) => k.toLowerCase());
      if (keywords.length > 0) {
        let matched = 0;
        keywords.forEach((k: string) => {
           if (userInput.includes(k)) matched++;
        });
        correct = (matched / keywords.length) >= 0.5;
      } else {
        correct = false;
      }
    } else {
      correct = selected === answer;
    }
      
    setIsCorrect(correct);
    setIsTimeout(false);
    setIsSubmitted(true);

    const initialTime = getInitialTime(activeQuestion);

    useQuizStore.getState().addLog({
      questionId: String(activeQuestion.questionId),
      isCorrect: correct,
      timeSpent: initialTime - timeLeft,
    });

    if (correct) {
      const diff = (activeQuestion.difficulty?.toLowerCase() || 'easy') as keyof typeof DIFFICULTY_XP_REWARDS;
      const xpEarned = DIFFICULTY_XP_REWARDS[diff] ?? 20;
      const coinsEarned = DIFFICULTY_COIN_REWARDS[diff] ?? 10;

      useQuizStore.setState((state) => ({
        coinsEarned: state.coinsEarned + coinsEarned,
        xpEarned: state.xpEarned + xpEarned
      }));

      const userEmpId = empId || 'EMP-456';
      fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empId: userEmpId,
          inc: { coins: coinsEarned, xp: xpEarned, 'metrics.correctAnswers': 1 }
        })
      }).then(() => {
        // Broadcast to all connected clients that the leaderboard has updated
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || `http://${window.location.hostname}:3001`;
        const tempSocket = require('socket.io-client').io(socketUrl, { transports: ['websocket', 'polling'] });
        tempSocket.emit('trigger_refresh');
        setTimeout(() => tempSocket.disconnect(), 1000);
      }).catch(err => console.error('[QuizEngine] Real-time reward sync failed:', err));
    }
  };

  const handleAction = (forceAdvance: boolean | string = false) => {
    if (!isSubmitted && typeof forceAdvance !== 'boolean') {
      if (!forceAdvance) return;
      submitAnswer(forceAdvance as string);
    } else if (!isSubmitted && forceAdvance === true) {
      // It's a skip!
      setIsSubmitted(true);
      setIsCorrect(false);
      
      setSelectedOption(null);
      setIsSubmitted(false);
      setIsTimeout(false);
      setEliminatedOptions([]);
      setTimeLeft(999); 
      
      advanceQuestion(false, 10);
      
      if (soloQuestionIndex >= 9) {
         setQuestions(prev => [...prev, null]);
         setSoloQuestionIndex(prev => prev + 1);
      } else {
         const usedIds = questions.map(q => q?.questionId);
         let nextQ = allQuestions.find(q => !usedIds.includes(q.questionId));
         if (nextQ) {
            setQuestions(prev => [...prev, nextQ]);
            setSoloQuestionIndex(prev => prev + 1);
         } else {
            setQuestions(prev => [...prev, null]);
            setSoloQuestionIndex(prev => prev + 1);
         }
      }
    } else {
      // --- WAGER RESOLUTION ---
      if (isWagerActive) {
        if (isCorrect) {
          useQuizStore.getState().addCoins(wagerAmount.coins);
          useQuizStore.getState().addXP(wagerAmount.xp);
          alert(`WAGER WON! You doubled your streak earnings: +${wagerAmount.coins} Coins, +${wagerAmount.xp} XP!`);
        } else {
          useQuizStore.getState().deductXP(wagerAmount.xp);
          useQuizStore.getState().addCoins(-wagerAmount.coins);
          alert(`WAGER LOST! The Matrix reclaimed your recent earnings: -${wagerAmount.coins} Coins, -${wagerAmount.xp} XP.`);
        }
        setIsWagerActive(false);
      }

      // Log question ID to the permanent burn list ONLY if correct!
      if (isCorrect) {
        const burnedQuestions = JSON.parse(localStorage.getItem('burned_questions') || '[]');
        if (activeQuestion && !burnedQuestions.includes(activeQuestion.questionId)) {
          burnedQuestions.push(activeQuestion.questionId);
          localStorage.setItem('burned_questions', JSON.stringify(burnedQuestions));
        }
      }

      setSelectedOption(null);
      setIsSubmitted(false);
      setIsTimeout(false);
      setEliminatedOptions([]);
      setTimeLeft(999); 
      
      // Call store for score/streak/multiplier side-effects only
      if (!isCorrect && useQuizStore.getState().inventory.shields > 0) {
         useQuizStore.getState().consumeItem('shields');
         advanceQuestion(true, 0); 
      } else {
         advanceQuestion(isCorrect || false, 10);
      }

      // --- WAGER TRIGGER ---
      const newStreak = useQuizStore.getState().streak;
      if (newStreak > 0 && newStreak % 5 === 0 && !wagerOffered && !isWagerActive) {
         setWagerAmount({ coins: 50, xp: 100 });
         setWagerOffered(true);
         return; 
      }

      // Advance or reload seamlessly
      if (soloQuestionIndex >= 9) {
         setQuestions(prev => [...prev, null]); 
         setSoloQuestionIndex(prev => prev + 1);
      } else {
         const usedIds = questions.map(q => q?.questionId);
         let nextQ = allQuestions.find(q => !usedIds.includes(q.questionId));

         if (nextQ) {
            setQuestions(prev => [...prev, nextQ]);
            setSoloQuestionIndex(prev => prev + 1);
         } else {
            setQuestions(prev => [...prev, null]); 
            setSoloQuestionIndex(prev => prev + 1);
         }
      }
    }
  };

  const handleWagerDecision = (accept: boolean) => {
    setWagerOffered(false);
    if (accept) {
      setIsWagerActive(true);
    }
    // Proceed to next question
    if (soloQuestionIndex >= 9) {
       setQuestions(prev => [...prev, null]);
       setSoloQuestionIndex(prev => prev + 1);
    } else {
       const usedIds = questions.map(q => q?.questionId);
       let nextQ = allQuestions.find(q => !usedIds.includes(q.questionId));

       if (nextQ) {
          setQuestions(prev => [...prev, nextQ]);
          setSoloQuestionIndex(prev => prev + 1);
       } else {
          setQuestions(prev => [...prev, null]);
          setSoloQuestionIndex(prev => prev + 1);
       }
    }
  };

  const handleSaveAndExit = async () => {
    const state = useQuizStore.getState();
    const exitEmpId = empId || 'EMP-456'; 
    
    try {
      await fetch('/api/quiz-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empId: exitEmpId,
          finalScore: state.score,
          highestStreak: state.highestStreak || 0,
          questionsPlayed: state.playedQuestions,
          sessionLogs: state.sessionLogs,
        }),
      });

      // Increment total player coins and xp by the amounts earned in this session
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empId,
          inc: { 
            coins: state.coinsEarned,
            xp: state.xpEarned 
          }
        }),
      });
      
      console.log("Progress saved. Aborting simulation...");

    } catch (error) {
      console.error('[QuizEngine] Failed to save session:', error);
    }
    
    if (socket) {
      socket.emit('player_extracted', { targetId: socket.id });
    }

    useQuizStore.getState().resetQuiz();
    router.push('/');
  };

  if (!mounted) return <div className="min-h-screen w-full bg-[#050505]" />;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#050505]">
        <p className="text-[#ff0055] font-black tracking-[0.3em] text-xl uppercase animate-pulse">
          Initializing Matrix...
        </p>
      </div>
    );
  }

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

  if (isBriefing) {
    return <PreGameBriefing onAcknowledge={() => setIsBriefing(false)} isFirstTime={true} />;
  }

  return (
    <div className={`flex flex-col items-center justify-center w-full max-w-4xl mx-auto min-h-[85vh] p-6 relative transition-all ${isSabotaged ? 'animate-cyber-shake border-4 border-red-600' : ''}`}>
      <button 
        onClick={handleSaveAndExit}
        className="absolute top-6 left-6 bg-red-600 hover:bg-red-700 text-white font-mono text-xs px-4 py-2 rounded flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] z-50"
      >
        <span className="text-lg font-bold">←</span> SAVE AND ABORT
      </button>
      
      {/* QUIZ UI */}
      <div className="flex flex-col w-full h-auto mt-12">

        <div className="w-full flex justify-end mb-4 text-gray-500 font-mono text-sm uppercase tracking-wider">
          <div className="flex items-center gap-4">
            {multiplier > 1 && (
              <span className="text-[#ff9900] font-black animate-pulse">🔥 {multiplier}X ACTIVE</span>
            )}
            <span className="text-yellow-400">🪙 {coinsEarned}</span>
            <span className="text-blue-400">✨ {xpEarned} XP</span>
          </div>
        </div>

        <div className="conic-border-box w-full h-auto p-6 pb-24 rounded-2xl shadow-[0_0_30px_rgba(255,0,60,0.2)] text-white flex flex-col relative min-h-[500px]">
          <div className="mb-4 text-xs font-mono text-[#ff0055] uppercase tracking-widest flex items-center justify-between border-b border-gray-800 pb-2">
            <div className="flex gap-4">
              <span>{activeQuestion.difficulty}</span>
            </div>
            <div className={`font-black text-lg ${timeLeft <= 5 && !isSubmitted ? 'text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]' : 'text-gray-400'}`}>
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
          </div>
          
          <h2 className="text-xl font-bold mb-6 leading-relaxed">
            {activeQuestion.question}
          </h2>


          {activeQuestion.type === 'sequence' && (
              <SequenceOrdering 
                items={currentSequence.length > 0 ? currentSequence : (activeQuestion.items || [])}
                onChange={(val: any) => !isSubmitted && setSelectedOption(val)}
                disabled={isSubmitted}
                solvedCount={autoSolvedCount}
              />
            )}

            {activeQuestion.type === 'text_input' && (
              <div className="mb-8">
                <textarea
                  disabled={isSubmitted}
                  value={selectedOption || ''}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  placeholder="Enter your analysis..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-4 text-white font-mono focus:border-[#ff0055] focus:ring-1 focus:ring-[#ff0055] outline-none min-h-[120px]"
                />
              </div>
            )}

            {activeQuestion.type === 'multiple_choice' && (
            activeQuestion.options && activeQuestion.options.length > 0 ? (
                <div className="space-y-3 mb-8">
                  {activeQuestion.options.map((option: string, index: number) => {
                    if (eliminatedOptions.includes(option)) return null;
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
            ) : (
              <div className="bg-red-900/20 border border-red-500 p-6 rounded-lg text-center font-mono mb-8">
                <span className="text-red-500 text-xl block mb-2">⚠️ DATA CORRUPTION DETECTED</span>
                <p className="text-gray-300 text-sm">No operational parameters loaded for this sequence. (Check database payload for this question).</p>
                <button 
                  onClick={() => advanceQuestion(false, 0)}
                  className="mt-4 bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded text-xs tracking-widest cursor-pointer"
                >
                  FORCE SKIP →
                </button>
              </div>
            )
          )}

          {isSubmitted && (
            <div className={`mb-8 p-4 border rounded ${isCorrect ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500'}`}>
              <h3 className={`text-lg font-black uppercase tracking-widest mb-2 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                {isTimeout ? 'INCORRECT - TIME EXPIRED' : (isCorrect ? 'CORRECT' : 'INCORRECT')}
              </h3>
              <p className="text-gray-300 mb-2 font-bold">
                Correct Answer: {activeQuestion.correctAnswer || (activeQuestion.type === 'sequence' ? 'Valid Sequence Order' : 'Valid Text')}
              </p>
              <p className="text-gray-400 text-sm">
                {activeQuestion.explanation}
              </p>
              {isCorrect && (
                <p className="mt-4 font-black text-blue-400 text-sm animate-pulse tracking-widest">
                  + {DIFFICULTY_XP_REWARDS[(activeQuestion.difficulty?.toLowerCase() || 'easy') as keyof typeof DIFFICULTY_XP_REWARDS] ?? 20} XP
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => handleAction(selectedOption || undefined)}
              disabled={(!isSubmitted && !selectedOption && activeQuestion.type !== 'sequence') || isSkipping}
              className="w-full mt-4 py-4 bg-[#ff0055] text-white font-black uppercase tracking-widest hover:bg-[#cc0044] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSkipping ? `ADVANCING IN ${skipTimer}S...` : (isSubmitted ? 'NEXT QUESTION' : 'Submit Intel')}
            </button>
            {!isSubmitted && !isSkipping && (
              <button
                onClick={handleSkip}
                disabled={skipsUsed >= 5}
                className={`w-full py-3 bg-transparent border font-bold uppercase tracking-widest transition-all rounded ${
                  skipsUsed >= 5 
                    ? 'border-gray-800 text-gray-700 cursor-not-allowed opacity-50' 
                    : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white'
                }`}
              >
                {skipsUsed >= 5 ? 'SKIP LIMIT REACHED (MAX 5 / 10 MIN)' : `SKIP QUESTION (${5 - skipsUsed} REMAINING)`}
              </button>
            )}
          </div>


        </div>
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



      {wagerOffered && (
        <div className="fixed inset-0 z-[99999] bg-red-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="bg-black border-4 border-red-600 p-8 rounded-xl max-w-lg text-center shadow-[0_0_50px_rgba(220,38,38,0.5)]">
            <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-widest drop-shadow-[0_0_10px_red]">Double or Nothing!</h2>
            <h3 className="text-xl text-red-500 font-bold mb-6">WAGER ROUND INITIATED</h3>
            <p className="text-gray-300 mb-8 text-lg font-mono leading-relaxed">
              You are on a 5-round win streak! You can wager your recent earnings (<strong>{wagerAmount.coins} Coins & {wagerAmount.xp} XP</strong>).<br/><br/>
              Answer the next question correctly to <span className="text-green-400 font-bold">DOUBLE</span> them. Answer wrong, and you <span className="text-red-500 font-bold">LOSE</span> them completely!
            </p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => handleWagerDecision(true)} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded font-black tracking-widest shadow-[0_0_15px_red] transition-all hover:scale-105">
                ACCEPT WAGER
              </button>
              <button onClick={() => handleWagerDecision(false)} className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-6 py-3 rounded font-bold tracking-widest transition-all">
                PLAY IT SAFE
              </button>
            </div>
          </div>
        </div>
      )}
      {qrEvent.active && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-950 border-2 border-yellow-500 p-8 rounded-lg shadow-[0_0_50px_rgba(234,179,8,0.4)] z-50 text-center animate-pulse w-[90%] max-w-md">
          
          <button 
            onClick={() => setQrEvent({ active: false, payload: "" })} 
            className="absolute top-3 right-4 text-gray-500 hover:text-white font-mono text-2xl transition-colors"
          >
            &times;
          </button>

          <h3 className="text-yellow-500 font-bold font-mono text-3xl mb-2 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]">
            🎁 LOOT DROP 🎁
          </h3>
          
          <p className="text-gray-200 text-sm mb-4 font-mono leading-relaxed">
            Scan immediately to claim:
            <br/>
            <span className="text-blue-400 font-bold text-lg drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]">⚡ FREE XP</span> | 
            <span className="text-green-400 font-bold text-lg drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]"> 💰 BONUS COINS</span>
          </p>
          
          <div className="bg-white p-4 inline-block rounded-xl shadow-[0_0_25px_rgba(255,255,255,0.3)] mb-6">
            <QRCodeSVG 
              value={qrEvent.payload} 
              size={200} 
              bgColor={"#ffffff"} 
              fgColor={"#000000"} 
              level={"H"}
            />
          </div>
          
          <button 
            onClick={() => setQrEvent({ active: false, payload: "" })} 
            className="block w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white py-4 rounded font-mono text-sm tracking-[0.2em] transition-all"
          >
            SKIP & RETURN TO QUIZ
          </button>
        </div>
      )}
    </div>
  );
}











