'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { Shield, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock avatars for the battle if user doesn't have one
const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/pixel-art/svg?seed=';

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
    // 1. Fetch Local User
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    setLocalUser(parsedUser);

    // 2. Fetch Opponent Info
    const oppId = parsedUser.empId === challengerId ? targetId : challengerId;
    fetch(`/api/users?search=${oppId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setOpponent(data.data[0]);
        }
      });

    // 3. Connect Socket
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join_battle', { matchId, empId: parsedUser.empId });
      
      // If I am the challenger, fetch questions and initialize battle (endless mode, so we fetch 50)
      if (parsedUser.empId === challengerId) {
        fetch('/api/questions?random=true&limit=50')
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              newSocket.emit('init_battle_data', { matchId, questions: data.data });
              setQuestions(data.data);
            }
          });
      }
    });

    // Listeners
    newSocket.on('battle_data_sync', (data) => {
      setQuestions(data.questions);
    });

    newSocket.on('battle_update', (data) => {
      // Determine my answer and opp answer
      const myAnswer = (parsedUser.empId === challengerId) ? data.p1Answer : data.p2Answer;
      const oppAnswer = (parsedUser.empId === challengerId) ? data.p2Answer : data.p1Answer;

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
          setAnimationState('idle');
          setCurrentRound(prev => prev + 1);
          setTimer(15);
          setHasAnswered(false);
          setSelectedOption(null);
          setIsCorrect(null);
        }, 2500);
      } else {
        setTimeout(() => {
           setAnimationState('idle');
        }, 2500);
      }
    });

    newSocket.on('battle_over', async (data) => {
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
          parsedUser.coins = (parsedUser.coins || 0) + 300;
          parsedUser.xp = (parsedUser.xp || 0) + 200;
          localStorage.setItem('user', JSON.stringify(parsedUser));
        } catch (err) {}
      } else if (data.winner === 'draw') {
        alert('Draw!');
      } else {
        alert('Defeat!');
      }
      router.push('/');
    });

    return () => {
      newSocket.disconnect();
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
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-cyan-400">Loading Battle Interface...</div>;
  }

  const currentQ = questions[currentRound];

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white flex flex-col font-mono relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-[#0a0a1a] to-[#0a0a1a]"></div>

      {/* Top HUD */}
      <div className="flex justify-between items-center p-6 z-10">
        {/* Player 1 (You) */}
        <div className="flex items-center space-x-4 w-1/3">
          <img src={`${DEFAULT_AVATAR}${localUser.username}`} className="w-16 h-16 rounded-lg bg-cyan-900 p-1 border-2 border-cyan-500" />
          <div className="flex-1">
            <h3 className="text-cyan-400 font-bold">@{localUser.username}</h3>
            <div className="w-full bg-gray-800 h-4 rounded-full mt-1 border border-cyan-900 overflow-hidden">
              <motion.div 
                className="bg-cyan-500 h-full" 
                initial={{ width: '100%' }}
                animate={{ width: `${Math.max(0, playerHp)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-cyan-500 mt-1">{Math.max(0, playerHp)} HP</p>
          </div>
        </div>

        {/* Center Round / Timer */}
        <div className="flex flex-col items-center justify-center w-1/3 z-10">
          <div className="bg-gray-800/80 px-6 py-2 rounded-t-xl border-t border-x border-gray-700">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">ROUND {currentRound + 1}</p>
          </div>
          <div className="bg-gray-900 border-2 border-cyan-500 px-10 py-3 rounded-b-xl shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <span className={`text-4xl font-black ${timer <= 5 ? 'text-red-500' : 'text-white'}`}>{timer}</span>
          </div>
        </div>

        {/* Player 2 (Opponent) */}
        <div className="flex items-center space-x-4 w-1/3 flex-row-reverse space-x-reverse">
          <img src={`${DEFAULT_AVATAR}${opponent.username}`} className="w-16 h-16 rounded-lg bg-purple-900 p-1 border-2 border-purple-500" />
          <div className="flex-1 text-right">
            <h3 className="text-purple-400 font-bold">@{opponent.username}</h3>
            <div className="w-full bg-gray-800 h-4 rounded-full mt-1 border border-purple-900 overflow-hidden flex justify-end">
              <motion.div 
                className="bg-purple-500 h-full" 
                initial={{ width: '100%' }}
                animate={{ width: `${Math.max(0, opponentHp)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-xs text-purple-500 mt-1">{Math.max(0, opponentHp)} HP</p>
          </div>
        </div>
      </div>

      {/* Avatars Arena */}
      <div className="flex-1 flex justify-center items-center relative z-10 px-20">
        
        {/* Bullet Animations */}
        <AnimatePresence>
          {(animationState === 'player_shoot' || animationState === 'both_shoot') && (
            <motion.div
              key="player_bullet"
              initial={{ x: -100, opacity: 0, scale: 0.5 }}
              animate={{ x: window.innerWidth / 3, opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeIn" }}
              className="absolute top-1/2 left-[30%] w-16 h-3 bg-cyan-400 rounded-full shadow-[0_0_20px_#22d3ee] z-50"
            />
          )}
          {(animationState === 'opponent_shoot' || animationState === 'both_shoot') && (
            <motion.div
              key="opponent_bullet"
              initial={{ x: 100, opacity: 0, scale: 0.5 }}
              animate={{ x: -window.innerWidth / 3, opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeIn" }}
              className="absolute top-1/2 right-[30%] w-16 h-3 bg-purple-400 rounded-full shadow-[0_0_20px_#c084fc] z-50"
            />
          )}
        </AnimatePresence>

        <div className="flex justify-between w-full max-w-4xl relative">
          {/* Player Avatar */}
          <div className="flex flex-col items-center z-10">
            <motion.div
              animate={
                animationState === 'both_correct' ? { x: [0, 80, 0] } :
                (animationState === 'player_damage' || animationState === 'both_damage') ? { x: [-15, 15, -15, 15, 0], filter: 'brightness(0.5) sepia(1) hue-rotate(-50deg) saturate(5)' } :
                { x: 0, filter: 'none' }
              }
              transition={{ duration: 0.5 }}
            >
              <img 
                src={`${DEFAULT_AVATAR}${localUser.username}`} 
                className="w-48 h-48 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]"
                alt="Player"
              />
            </motion.div>
            <div className="w-48 h-12 rounded-[100%] bg-cyan-900/50 shadow-[0_0_30px_rgba(6,182,212,0.4)] mt-4"></div>
          </div>
          
          {/* Opponent Avatar */}
          <div className="flex flex-col items-center z-10">
            <motion.div
              animate={
                animationState === 'both_correct' ? { x: [0, -80, 0] } :
                (animationState === 'opponent_damage' || animationState === 'both_damage') ? { x: [-15, 15, -15, 15, 0], filter: 'brightness(0.5) sepia(1) hue-rotate(-50deg) saturate(5)' } :
                { x: 0, filter: 'none' }
              }
              transition={{ duration: 0.5 }}
            >
              <img 
                src={`${DEFAULT_AVATAR}${opponent.username}`} 
                className="w-48 h-48 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] transform scale-x-[-1]"
                alt="Opponent"
              />
            </motion.div>
            <div className="w-48 h-12 rounded-[100%] bg-purple-900/50 shadow-[0_0_30px_rgba(168,85,247,0.4)] mt-4"></div>
          </div>
        </div>
      </div>

      {/* Question Panel */}
      {currentQ && (
        <div className="bg-[#111122] border-t border-gray-800 p-8 z-10 h-2/5 flex flex-col justify-end pb-12 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="max-w-5xl mx-auto w-full">
            <div className="mb-6 flex items-center justify-center">
              <span className="bg-blue-900/50 text-blue-400 border border-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                {currentQ.category}
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 text-gray-100">
              {currentQ.question}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {currentQ.options.map((option: string, i: number) => {
                let btnStyle = "bg-[#1a1a3a] hover:bg-[#2a2a5a] border-gray-700 text-gray-300";
                
                if (hasAnswered) {
                  if (option === currentQ.correctAnswer) {
                    btnStyle = "bg-green-900/80 border-green-500 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.5)]";
                  } else if (option === selectedOption) {
                    btnStyle = "bg-red-900/80 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.5)]";
                  } else {
                    btnStyle = "bg-[#1a1a3a] border-gray-800 text-gray-600 opacity-50";
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={hasAnswered}
                    onClick={() => handleOptionClick(option)}
                    className={`py-5 px-6 rounded-xl border-2 transition-all duration-300 font-medium text-lg ${btnStyle}`}
                  >
                    {option}
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
