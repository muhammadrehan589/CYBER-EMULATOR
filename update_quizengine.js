const fs = require('fs');
let content = fs.readFileSync('src/components/quiz/QuizEngine.tsx', 'utf8');

// 1. Add "Exit Matrix" button
const exitButton = `
        <div className="flex items-center gap-2">
          <button onClick={() => window.location.href = '/'} className="bg-red-900/60 hover:bg-red-600 border border-red-500 text-white px-3 py-1 rounded font-mono text-xs tracking-widest transition-colors cursor-pointer mr-2">
            EXIT MATRIX
          </button>
          <div className="text-right">
`;
content = content.replace(/<div className="text-right">/, exitButton.trim());

// 2. Fix QR URL 404 issue
content = content.replace(
  /const fullUrl = `\$\{typeof window !== 'undefined' \? window\.location\.origin : 'https:\/\/cyber-emulator\.vercel\.app'\}\$\{randomAsset\}`;/,
  "const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://cyber-emulator.vercel.app'}/black-market?secret=qr_discovery`;"
);

// 3. Add Wager logic
// We need state: wagerOffered, isWagerActive, wagerAmount
const stateVars = `
  const [wagerOffered, setWagerOffered] = useState(false);
  const [isWagerActive, setIsWagerActive] = useState(false);
  const [wagerAmount, setWagerAmount] = useState({ coins: 0, xp: 0 });
`;
content = content.replace(
  /const \[qrEvent, setQrEvent\] = useState\(\{ active: false, payload: "" \}\);/,
  "const [qrEvent, setQrEvent] = useState({ active: false, payload: \"\" });\n" + stateVars
);

// We need to trigger the wager popup when streak == 5.
// Inside advance() or handleOptionSelect? 
// The streak is stored in useQuizStore.getState().streak.
// Let's hook into advance():
const advanceLogic = `
  const advance = () => {
    const store = useQuizStore.getState();
    // Check wager conditions
    if (store.streak > 0 && store.streak % 5 === 0 && !wagerOffered && !isWagerActive) {
      // Calculate earnings from the last 5 rounds (approximate: 5 * base points * multiplier)
      // We can just grab a static wager amount or calculate exactly
      setWagerAmount({ coins: 50, xp: 100 });
      setWagerOffered(true);
      return; // Pause advancement to show popup
    }

    if (soloQuestionIndex < sessionQuestions.length - 1) {
      setSoloQuestionIndex(prev => prev + 1);
    } else {
      const played = store.playedQuestions || [];
      let available = initialQuestions.filter((q: any) => !played.includes(q.id));
      if (available.length < 10) available = initialQuestions; // Reset if out of questions
      const nextBatch = shuffleArray(available).slice(0, 10);
      setSessionQuestions(nextBatch);
      setSoloQuestionIndex(0);
    }
  };

  const handleWagerDecision = (accept: boolean) => {
    setWagerOffered(false);
    if (accept) {
      setIsWagerActive(true);
    }
    // Proceed to next question
    if (soloQuestionIndex < sessionQuestions.length - 1) {
      setSoloQuestionIndex(prev => prev + 1);
    } else {
      const store = useQuizStore.getState();
      const played = store.playedQuestions || [];
      let available = initialQuestions.filter((q: any) => !played.includes(q.id));
      if (available.length < 10) available = initialQuestions;
      const nextBatch = shuffleArray(available).slice(0, 10);
      setSessionQuestions(nextBatch);
      setSoloQuestionIndex(0);
    }
  };
`;
// Replace the entire advance function
content = content.replace(
  /const advance = \(\) => \{[\s\S]*?setSoloQuestionIndex\(0\);\n    \}\n  \};/,
  advanceLogic.trim()
);

// Handle Wager resolution in handleOptionSelect
const wagerResolution = `
      // Wager resolution
      if (isWagerActive) {
        if (isCorrect) {
          store.addCoins(wagerAmount.coins); // Double!
          store.addXP(wagerAmount.xp);
          alert(\`WAGER WON! You doubled your streak earnings: +\${wagerAmount.coins} Coins, +\${wagerAmount.xp} XP!\`);
        } else {
          // Manually deduct since the store handles deduction via buyItem usually, we have deductXP
          store.deductXP(wagerAmount.xp);
          // For coins, we need to subtract directly:
          store.addCoins(-wagerAmount.coins);
          alert(\`WAGER LOST! The Matrix reclaimed your recent earnings: -\${wagerAmount.coins} Coins, -\${wagerAmount.xp} XP.\`);
        }
        setIsWagerActive(false);
      }
`;
// Insert into handleOptionSelect right after `store.advanceQuestion(isCorrect, basePoints);`
content = content.replace(
  /store\.advanceQuestion\(isCorrect, basePoints\);/,
  "store.advanceQuestion(isCorrect, basePoints);\n" + wagerResolution
);


// 4. Render Wager Popup
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
// Insert right before the last closing </div>
content = content.replace(
  /    <\/div>\n  \);\n\}\n/,
  wagerPopup.trim() + "\n    </div>\n  );\n}\n"
);

fs.writeFileSync('src/components/quiz/QuizEngine.tsx', content);
console.log('QuizEngine.tsx updated with Wager, Exit Button, and QR fix.');
