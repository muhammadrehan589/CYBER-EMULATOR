const fs = require('fs');
let content = fs.readFileSync('src/components/quiz/QuizEngine.tsx', 'utf8');

const oldHandleActionRegex = /const handleAction = \(\) => \{[\s\S]*?setSoloQuestionIndex\(prev => prev \+ 1\);\n\s*\}\n\s*\}\n\s*\};/;

const newHandleAction = `const handleAction = () => {
    if (!isSubmitted) {
      if (!selectedOption) return;
      submitAnswer(selectedOption);
    } else {
      // --- WAGER RESOLUTION ---
      if (isWagerActive) {
        if (isCorrect) {
          useQuizStore.getState().addCoins(wagerAmount.coins);
          useQuizStore.getState().addXP(wagerAmount.xp);
          alert(\`WAGER WON! You doubled your streak earnings: +\${wagerAmount.coins} Coins, +\${wagerAmount.xp} XP!\`);
        } else {
          useQuizStore.getState().deductXP(wagerAmount.xp);
          useQuizStore.getState().addCoins(-wagerAmount.coins);
          alert(\`WAGER LOST! The Matrix reclaimed your recent earnings: -\${wagerAmount.coins} Coins, -\${wagerAmount.xp} XP.\`);
        }
        setIsWagerActive(false);
      }

      // Log question ID to the permanent burn list
      const burnedQuestions = JSON.parse(localStorage.getItem('burned_questions') || '[]');
      if (activeQuestion && !burnedQuestions.includes(activeQuestion.id)) {
        burnedQuestions.push(activeQuestion.id);
        localStorage.setItem('burned_questions', JSON.stringify(burnedQuestions));
      }

      setSelectedOption(null);
      setIsSubmitted(false);
      setIsTimeout(false);
      setEliminatedOptions([]);
      
      // Call store for score/streak/multiplier side-effects only
      if (!isCorrect && useQuizStore.getState().inventory.shields > 0) {
         useQuizStore.getState().consumeItem('shields');
         advanceQuestion(true, 0); // Shield prevents streak loss
      } else {
         advanceQuestion(isCorrect || false, 10);
      }

      // --- WAGER TRIGGER ---
      const newStreak = useQuizStore.getState().streak;
      if (newStreak > 0 && newStreak % 5 === 0 && !wagerOffered && !isWagerActive) {
         setWagerAmount({ coins: 50, xp: 100 });
         setWagerOffered(true);
         return; // Pause advancement for the popup
      }

      // Advance or reload seamlessly
      if (soloQuestionIndex === questions.length - 1) {
         const burned = JSON.parse(localStorage.getItem('burned_questions') || '[]');
         let fresh = initialQuestions.filter((q: any) => !burned.includes(q.id));
         if (fresh.length === 0) {
            localStorage.removeItem('burned_questions');
            fresh = initialQuestions;
         }
         setQuestions(shuffleArray(fresh).slice(0, 10));
         setSoloQuestionIndex(0);
      } else {
         setSoloQuestionIndex(prev => prev + 1);
      }
    }
  };

  const handleWagerDecision = (accept: boolean) => {
    setWagerOffered(false);
    if (accept) {
      setIsWagerActive(true);
    }
    // Proceed to next question
    if (soloQuestionIndex === questions.length - 1) {
       const burned = JSON.parse(localStorage.getItem('burned_questions') || '[]');
       let fresh = initialQuestions.filter((q: any) => !burned.includes(q.id));
       if (fresh.length === 0) {
          localStorage.removeItem('burned_questions');
          fresh = initialQuestions;
       }
       setQuestions(shuffleArray(fresh).slice(0, 10));
       setSoloQuestionIndex(0);
    } else {
       setSoloQuestionIndex(prev => prev + 1);
    }
  };`;

content = content.replace(oldHandleActionRegex, newHandleAction);

// Now inject the Wager Popup UI. I will append it before the very last `</div>`
// A safer way is to find `{qrEvent.active && (` and insert it right above that.
const wagerPopup = `
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
`;

content = content.replace(/\{qrEvent\.active && \(/, wagerPopup.trim() + "\n      {qrEvent.active && (");

fs.writeFileSync('src/components/quiz/QuizEngine.tsx', content);
console.log('Fixed handleAction and wager popup!');
