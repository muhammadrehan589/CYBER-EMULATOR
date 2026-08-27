import React from 'react';

interface DuelArenaProps {
  myScore: number;
  enemyScore: number;
  timer: number;
  currentQuestion: { text: string; options: string[] };
  handleCombatAnswer: (option: string) => void;
}

export default function DuelArena({
  myScore,
  enemyScore,
  timer,
  currentQuestion,
  handleCombatAnswer
}: DuelArenaProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-950 p-6 text-white font-mono shadow-[inset_0_0_100px_rgba(220,38,38,0.1)]">
      
      {/* HUD: Scores and Timer */}
      <div className="flex justify-between items-center border-b border-gray-800 pb-6 mb-12 mt-4">
        <div className="text-left bg-black/50 p-4 border border-blue-900 rounded">
          <p className="text-blue-400 text-xs tracking-widest mb-1">YOUR SCORE</p>
          <p className="text-3xl font-bold">{myScore}</p>
        </div>
        
        <div className="text-center">
           <p className="text-gray-500 text-xs tracking-[0.2em] mb-2">SYSTEM TIMER</p>
           <p className="text-6xl text-red-500 font-bold drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">{timer}</p>
        </div>
        
        <div className="text-right bg-black/50 p-4 border border-purple-900 rounded">
          <p className="text-purple-400 text-xs tracking-widest mb-1">OPPONENT SCORE</p>
          <p className="text-3xl font-bold">{enemyScore}</p>
        </div>
      </div>

      {/* Active Questionnaire */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
        <div className="text-center mb-12 w-full">
          <span className="bg-red-900/30 border border-red-500/50 text-red-400 text-xs px-4 py-1 rounded-full mb-6 inline-block tracking-widest">
            LIVE COMBAT FEED
          </span>
          <h2 className="text-2xl md:text-3xl text-gray-200 leading-relaxed">
            {currentQuestion.text}
          </h2>
        </div>

        {/* 2x2 Tactical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {currentQuestion.options.map((option, idx) => (
            <button 
              key={idx}
              onClick={() => handleCombatAnswer(option)}
              className="bg-black border border-gray-800 p-8 rounded hover:bg-gray-900 hover:border-red-500 transition-all text-left group"
            >
              <span className="text-red-500 mr-4 font-bold opacity-50 group-hover:opacity-100">{(idx + 1).toString().padStart(2, '0')}</span>
              <span className="text-gray-300 text-lg group-hover:text-white">{option}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
