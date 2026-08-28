'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Shield, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AvatarSVG, DEFAULT_AVATAR as DEFAULT_AVATAR_OBJ, type AvatarState } from '@/components/Avatar';

export default function BattlePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const matchId = searchParams.get('matchId');
  const challengerId = searchParams.get('challengerId');
  const targetId = searchParams.get('targetId');
  
  const [socket, setSocket] = useState<Socket | null>(null);
  
  // Battle State
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [timer, setTimer] = useState(15);
  const [playerHp, setPlayerHp] = useState(100);
  const [opponentHp, setOpponentHp] = useState(100);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const [localUser, setLocalUser] = useState<any>(null);
  const [opponent, setOpponent] = useState<any>({ name: 'Opponent', username: 'opponent' });

  // Animation State
  const [animationState, setAnimationState] = useState<'idle' | 'both_correct' | 'player_shoot' | 'opponent_shoot' | 'both_shoot' | 'player_damage' | 'opponent_damage' | 'both_damage'>('idle');

  // Determine if I am the challenger
  const isChallenger = localUser?.empId === challengerId;

  useEffect(() => {
    let currentSocket: Socket | null = null;
    let isMounted = true;

    // 1. Fetch Local User ID
    const currentEmpId = localStorage.getItem('currentUserEmpId');
    if (!currentEmpId) {
      router.push('/login');
      return;
    }

    // Fetch both users
    const oppId = currentEmpId === challengerId ? targetId : challengerId;
    
    Promise.all([
      fetch(`/api/users?search=${currentEmpId}`).then(res => res.json()),
      fetch(`/api/users?search=${oppId}`).then(res => res.json())
    ]).then(([localRes, oppRes]) => {
      if (!isMounted) return;

      let parsedUser = null;
      if (localRes.success && localRes.data.length > 0) {
        parsedUser = localRes.data[0];
        setLocalUser(parsedUser);
      } else {
        router.push('/login');
        return;
      }

      if (oppRes.success && oppRes.data.length > 0) {
        setOpponent(oppRes.data[0]);
      }

      // 3. Connect Socket
      currentSocket = io('http://localhost:3001');
      setSocket(currentSocket);

      currentSocket.on('connect', () => {
        currentSocket?.emit('join_battle', { matchId, empId: parsedUser.empId });
        
        if (parsedUser.empId === challengerId) {
          fetch('/api/questions?random=true&limit=50')
            .then(res => res.json())
            .then(data => {
              if (data.success && isMounted) {
                currentSocket?.emit('init_battle_data', { matchId, questions: data.data });
                setQuestions(data.data);
              }
            });
        }
      });

      currentSocket.on('battle_data_sync', (data) => {
        setQuestions(data.questions);
      });

      currentSocket.on('battle_update', (data) => {
        const myAnswer = (parsedUser.empId === challengerId) ? data.p1Answer : data.p2Answer;
        const oppAnswer = (parsedUser.empId === challengerId) ? data.p2Answer : data.p1Answer;

        // If one of the answers is null (shouldn't happen, but just in case)
        if (!myAnswer || !oppAnswer) return;

        if (myAnswer.isCorrect && oppAnswer.isCorrect) {
          setAnimationState('both_correct');
        } else if (myAnswer.isCorrect && !oppAnswer.isCorrect) {
          setAnimationState('player_shoot');
          setTimeout(() => setAnimationState('opponent_damage'), 500);
        } else if (!myAnswer.isCorrect && oppAnswer.isCorrect) {
          setAnimationState('opponent_shoot');
          setTimeout(() => setAnimationState('player_damage'), 500);
        } else if (!myAnswer.isCorrect && !oppAnswer.isCorrect) {
          setAnimationState('both_shoot');
          setTimeout(() => setAnimationState('both_damage'), 500);
        }

        setTimeout(() => {
          if (parsedUser.empId === challengerId) {
            setPlayerHp(data.p1Hp);
            setOpponentHp(data.p2Hp);
          } else {
            setPlayerHp(data.p2Hp);
            setOpponentHp(data.p1Hp);
          }
        }, 500);

        if (data.nextRound) {
          setTimeout(() => {
            if (!isMounted) return;
            setAnimationState('idle');
            setCurrentRound(prev => prev + 1);
            setTimer(15);
            setHasAnswered(false);
            setSelectedOption(null);
            setIsCorrect(null);
          }, 2500);
        } else {
          setTimeout(() => {
             if (isMounted) setAnimationState('idle');
          }, 2500);
        }
      });

      currentSocket.on('battle_over', async (data) => {
        let iWon = false;
        if (data.winner === 'challenger' && parsedUser.empId === challengerId) iWon = true;
        else if (data.winner === 'target' && parsedUser.empId !== challengerId) iWon = true;

        if (iWon) {
          alert('Victory! You earned 300 Coins and 200 XP!');
          try {
            await fetch('/api/users', {
               method: 'PATCH',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                 empId: parsedUser.empId,
                 updates: {
                   coins: (parsedUser.coins || 0) + 300,
                   xp: (parsedUser.xp || 0) + 200
                 }
               })
            });
          } catch (err) {}
        } else if (data.winner === 'draw') {
          alert('Draw!');
        } else {
          alert('Defeat!');
        }
        router.push('/');
      });

    });

    return () => {
      isMounted = false;
      if (currentSocket) {
        currentSocket.disconnect();
      }
    };
  }, [matchId, challengerId, targetId, router]);



  // Timer Countdown
  useEffect(() => {
    if (questions.length === 0 || hasAnswered) return;
    
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !hasAnswered) {
      handleTimeOut();
    }
  }, [timer, questions.length, hasAnswered]);

  const handleTimeOut = () => {
    setHasAnswered(true);
    const difficultyDamage: Record<string, number> = {
      easy: 5,
      medium: 10,
      difficult: 15
    };
    const dmg = difficultyDamage[questions[currentRound]?.difficulty || 'medium'] || 10;
    socket?.emit('submit_battle_answer', {
      matchId,
      empId: localUser.empId,
      isCorrect: false,
      damage: dmg,
      isChallenger
    });
  };

  const handleOptionClick = (option: string) => {
    if (hasAnswered) return;
    
    setHasAnswered(true);
    setSelectedOption(option);
    
    const correct = option === questions[currentRound].correctAnswer;
    setIsCorrect(correct);

    const difficultyDamage: Record<string, number> = {
      easy: 5,
      medium: 10,
      difficult: 15
    };
    const damage = correct ? 0 : (difficultyDamage[questions[currentRound]?.difficulty || 'medium'] || 10);

    socket?.emit('submit_battle_answer', {
      matchId,
      empId: localUser.empId,
      isCorrect: correct,
      damage,
      isChallenger
    });
  };

  if (questions.length === 0 || !localUser) {
    return <div className="min-h-screen bg-[#030005] flex items-center justify-center text-[#ff0055] font-black tracking-widest text-2xl uppercase animate-pulse">Initializing Matrix Duel...</div>;
  }

  const currentQ = questions[currentRound];
  const myAvatar = (localUser?.activeAvatar && Object.keys(localUser.activeAvatar).length > 0) ? { ...DEFAULT_AVATAR_OBJ, ...localUser.activeAvatar } : DEFAULT_AVATAR_OBJ;
  const oppAvatar = (opponent?.activeAvatar && Object.keys(opponent.activeAvatar).length > 0) ? { ...DEFAULT_AVATAR_OBJ, ...opponent.activeAvatar } : DEFAULT_AVATAR_OBJ;

  return (
    <div className="min-h-screen bg-[#030005] text-white flex flex-col font-mono relative overflow-hidden select-none">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ff0055]/10 via-[#030005] to-[#030005]"></div>

      {/* Top HUD */}
      <div className="flex justify-between items-center p-6 z-10 border-b border-gray-900 bg-[#0a0a0a]/80 backdrop-blur-md">
        {/* Player 1 (You) - Emerald */}
        <div className="flex items-center space-x-4 w-1/3">
          <div className="w-16 h-16 rounded bg-[#10b981]/10 border border-[#10b981] flex items-center justify-center overflow-hidden shrink-0">
            <AvatarSVG avatar={myAvatar} size={60} mini={true} />
          </div>
          <div className="flex-1">
            <h3 className="text-[#10b981] font-bold tracking-wider">@{localUser.username}</h3>
            <div className="w-full bg-[#0a0a0a] h-4 rounded-full mt-1 border border-[#10b981]/30 overflow-hidden shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <motion.div 
                className="bg-[#10b981] h-full" 
                initial={{ width: '100%' }}
                animate={{ width: `${Math.max(0, playerHp)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-[#10b981]/80 mt-1 font-black">{Math.max(0, playerHp)} HP</p>
          </div>
        </div>

        {/* Center Round / Timer */}
        <div className="flex flex-col items-center justify-center w-1/3 z-10">
          <div className="bg-[#0a0a0a] px-8 py-2 rounded-t-xl border-t border-x border-gray-800">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.3em]">ENGAGEMENT {currentRound + 1}</p>
          </div>
          <div className={`bg-[#030005] border-2 ${timer <= 5 ? 'border-[#ff0055] shadow-[0_0_20px_rgba(255,0,85,0.6)]' : 'border-gray-700 shadow-[0_0_15px_rgba(0,0,0,0.5)]'} px-12 py-4 rounded-b-xl transition-all`}>
            <span className={`text-5xl font-black tracking-tighter ${timer <= 5 ? 'text-[#ff0055] animate-pulse' : 'text-gray-100'}`}>{timer}</span>
          </div>
        </div>

        {/* Player 2 (Opponent) - Neon Pink */}
        <div className="flex items-center space-x-4 w-1/3 flex-row-reverse space-x-reverse">
          <div className="w-16 h-16 rounded bg-[#ff0055]/10 border border-[#ff0055] flex items-center justify-center overflow-hidden shrink-0">
            <AvatarSVG avatar={oppAvatar} size={60} mini={true} />
          </div>
          <div className="flex-1 text-right">
            <h3 className="text-[#ff0055] font-bold tracking-wider">@{opponent.username}</h3>
            <div className="w-full bg-[#0a0a0a] h-4 rounded-full mt-1 border border-[#ff0055]/30 overflow-hidden flex justify-end shadow-[0_0_10px_rgba(255,0,85,0.2)]">
              <motion.div 
                className="bg-[#ff0055] h-full" 
                initial={{ width: '100%' }}
                animate={{ width: `${Math.max(0, opponentHp)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-[#ff0055]/80 mt-1 font-black">{Math.max(0, opponentHp)} HP</p>
          </div>
        </div>
      </div>

      {/* Avatars Arena */}
      <div className="flex-1 flex justify-center items-center relative z-10 px-4 md:px-10 overflow-hidden">
        
        {/* Bullet Animations */}
        <AnimatePresence>
          {(animationState === 'player_shoot' || animationState === 'both_shoot') && (
            <motion.div
              key="player_bullet"
              initial={{ left: '25%', opacity: 0, scale: 0.5 }}
              animate={{ left: '75%', opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
              className="absolute top-1/2 w-12 md:w-24 h-2 bg-[#10b981] rounded-full shadow-[0_0_30px_#10b981] z-50 -translate-y-1/2"
            />
          )}
          {(animationState === 'opponent_shoot' || animationState === 'both_shoot') && (
            <motion.div
              key="opponent_bullet"
              initial={{ right: '25%', opacity: 0, scale: 0.5 }}
              animate={{ right: '75%', opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeIn" }}
              className="absolute top-1/2 w-12 md:w-24 h-2 bg-[#ff0055] rounded-full shadow-[0_0_30px_#ff0055] z-50 -translate-y-1/2"
            />
          )}
        </AnimatePresence>

        <div className="flex justify-between w-full max-w-5xl relative px-2 sm:px-8 md:px-16">
          {/* Player Avatar */}
          <div className="flex flex-col items-center z-10">
            <motion.div
              animate={
                animationState === 'both_correct' ? { x: [0, 50, 0] } :
                (animationState === 'player_damage' || animationState === 'both_damage') ? { x: [-15, 15, -15, 15, 0], filter: 'brightness(0.5) sepia(1) hue-rotate(-50deg) saturate(5)' } :
                { x: 0, filter: 'none' }
              }
              transition={{ duration: 0.4 }}
              className="drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              <div className="transform scale-[0.6] sm:scale-75 md:scale-100 transition-transform">
                <AvatarSVG avatar={myAvatar} size={150} mini={false} />
              </div>
            </motion.div>
            <div className="w-24 sm:w-32 md:w-48 h-6 md:h-10 rounded-[100%] bg-[#10b981]/10 shadow-[0_0_40px_rgba(16,185,129,0.2)] mt-4"></div>
          </div>
          
          {/* Opponent Avatar */}
          <div className="flex flex-col items-center z-10">
            <motion.div
              animate={
                animationState === 'both_correct' ? { x: [0, -50, 0] } :
                (animationState === 'opponent_damage' || animationState === 'both_damage') ? { x: [-15, 15, -15, 15, 0], filter: 'brightness(0.5) sepia(1) hue-rotate(-50deg) saturate(5)' } :
                { x: 0, filter: 'none' }
              }
              transition={{ duration: 0.4 }}
              className="drop-shadow-[0_0_30px_rgba(255,0,85,0.3)]"
            >
              <div className="transform scale-x-[-0.6] scale-y-[0.6] sm:scale-x-[-0.75] sm:scale-y-[0.75] md:scale-x-[-1] md:scale-y-100 transition-transform">
                <AvatarSVG avatar={oppAvatar} size={150} mini={false} />
              </div>
            </motion.div>
            <div className="w-24 sm:w-32 md:w-48 h-6 md:h-10 rounded-[100%] bg-[#ff0055]/10 shadow-[0_0_40px_rgba(255,0,85,0.2)] mt-4"></div>
          </div>
        </div>
      </div>

      {/* Question Panel */}
      {currentQ && (
        <div className="bg-[#0a0a0a] border-t-2 border-[#1a1a1a] p-4 md:p-8 z-10 shrink-0 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] flex flex-col justify-center min-h-[35vh]">
          <div className="max-w-5xl mx-auto w-full">
            <div className="mb-6 flex items-center justify-center">
              <span className="bg-[#1a1a1a] text-gray-400 border border-gray-800 px-4 py-2 rounded font-black tracking-widest text-xs uppercase shadow-inner">
                {currentQ.category}
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-white drop-shadow-md">
              {currentQ.question}
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {currentQ.options.map((option: string, i: number) => {
                let btnStyle = "bg-[#111] hover:bg-[#1a1a1a] border-gray-800 text-gray-300 hover:border-gray-600";
                
                if (hasAnswered) {
                  if (option === currentQ.correctAnswer) {
                    btnStyle = "bg-[#10b981]/20 border-[#10b981] text-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.3)]";
                  } else if (option === selectedOption) {
                    btnStyle = "bg-[#ff0055]/20 border-[#ff0055] text-[#ff0055] shadow-[0_0_20px_rgba(255,0,85,0.3)]";
                  } else {
                    btnStyle = "bg-[#050505] border-gray-900 text-gray-700 opacity-50";
                  }
                } else if (option === selectedOption) {
                  btnStyle = "bg-gray-800 border-gray-500 text-white";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleOptionClick(option)}
                    disabled={hasAnswered}
                    className={`p-6 rounded-lg border-2 font-mono text-lg transition-all transform active:scale-95 flex flex-col items-center justify-center ${btnStyle}`}
                  >
                    <span className="opacity-50 text-sm mb-2 font-black">{String.fromCharCode(65 + i)}</span>
                    <span className="text-center">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
