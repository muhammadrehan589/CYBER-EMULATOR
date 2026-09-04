const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'src/app/battle/page.tsx');
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/const \[localUser, setLocalUser\] = useState<any>\(null\);/, 
  'const [localUser, setLocalUser] = useState<any>(null);\n  const [isInventoryOpen, setIsInventoryOpen] = useState(false);');

code = code.replace(/if \(myAnswer\.isCorrect && oppAnswer\.isCorrect\).*?else \{ setAnimationState\('both_shoot'\); setTimeout\(\(\) => \{ if \(isMounted\) setAnimationState\('both_damage'\); \}, 500\); \}/s,
`if (myAnswer.isCorrect && oppAnswer.isCorrect) { setAnimationState('both_correct'); }
          else if (myAnswer.isCorrect && !oppAnswer.isCorrect) { setAnimationState('player_shoot'); setTimeout(() => { if (isMounted) setAnimationState('opponent_damage'); }, 1200); }
          else if (!myAnswer.isCorrect && oppAnswer.isCorrect) { setAnimationState('opponent_shoot'); setTimeout(() => { if (isMounted) setAnimationState('player_damage'); }, 1200); }
          else { setAnimationState('both_shoot'); setTimeout(() => { if (isMounted) setAnimationState('both_damage'); }, 1200); }`);

code = code.replace(/setTimeout\(\(\) => \{\s*if \(\!isMounted\) return;\s*if \(parsedUser\.empId === challengerId\) \{ setPlayerHp\(data\.p1Hp\); setOpponentHp\(data\.p2Hp\); \}\s*else \{ setPlayerHp\(data\.p2Hp\); setOpponentHp\(data\.p1Hp\); \}\s*\}, 500\);/s,
`setTimeout(() => {
            if (!isMounted) return;
            setAnimationState('idle');
            if (isChallenger) { setPlayerHp(data.p1Hp); setOpponentHp(data.p2Hp); }
            else { setPlayerHp(data.p2Hp); setOpponentHp(data.p1Hp); }
          }, 1200);`);

code = code.replace(/if \(data\.nextRound\) \{\s*setTimeout\(\(\) => \{\s*if \(\!isMounted\) return;\s*setAnimationState\('idle'\); setCurrentRound\(prev => prev \+ 1\);\s*setTimer\(30\); setHasAnswered\(false\); setSelectedOption\(null\); setIsCorrect\(null\); setEliminatedOptions\(\[\]\);\s*\}, 2500\);\s*\} else \{ setTimeout\(\(\) => \{ if \(isMounted\) setAnimationState\('idle'\); \}, 2500\); \}/s,
`if (data.gameOver) {
            setTimeout(() => { if (isMounted) router.push(\`/battle/results?matchId=\${matchId}\`); }, 3000);
          } else {
            setTimeout(() => { 
              if (isMounted) {
                 setCurrentRound(prev => prev + 1);
                 setTimer(30); setHasAnswered(false); setSelectedOption(null); setIsCorrect(null); setEliminatedOptions([]);
              }
            }, 3000);
          }`);

code = code.replace(/if \(data\.success && isMounted\) \{\s*setQuestions\(data\.data\);/, 
`if (data.success && isMounted) {
                  const randomizedQuestions = data.data.map((q: any) => {
                    if ((q.type === 'sequence' || q.type === 'drag_and_drop') && q.draggableItems) {
                      return { ...q, draggableItems: [...q.draggableItems].sort(() => 0.5 - Math.random()) };
                    }
                    return q;
                  });
                  setQuestions(randomizedQuestions);`);

code = code.replace(/let correct = false;\s*if \(currentQ\.type === 'sequence' \|\| currentQ\.type === 'drag_and_drop'\) \{\s*const expected = currentQ\.correctOrder \|\| currentQ\.correctAnswer;\s*correct = \(option === expected\);\s*\}/s,
`let correct = false;
        if (currentQ.type === 'sequence' || currentQ.type === 'drag_and_drop') {
          try {
            const expected = currentQ.correctOrder || currentQ.correctAnswer;
            const orderIds = JSON.parse(option);
            correct = JSON.stringify(orderIds) === JSON.stringify(expected);
          } catch(e) { correct = false; }
        }`);

code = code.replace(/const playerDmg = .*?;/s, 
`const playerDmg = animationState === 'player_damage' || animationState === 'both_damage';
  const getPlayerAnimation = () => {
    if (playerDmg) return { x: [-10, 10, -10, 10, 0], filter: ['brightness(1)', 'brightness(2) drop-shadow(0 0 20px red)', 'brightness(1)'], transition: { duration: 0.4 } };
    if (animationState === 'player_shoot' || animationState === 'both_shoot') return { y: [-15, -25, -15], rotate: [-2, 2, -2], transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' } };
    return { y: [-5, 5, -5], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } };
  };`);
code = code.replace(/const opponentDmg = .*?;/s,
`const opponentDmg = animationState === 'opponent_damage' || animationState === 'both_damage';
  const getOpponentAnimation = () => {
    if (opponentDmg) return { x: [-10, 10, -10, 10, 0], filter: ['brightness(1)', 'brightness(2) drop-shadow(0 0 20px red)', 'brightness(1)'], transition: { duration: 0.4 } };
    if (animationState === 'opponent_shoot' || animationState === 'both_shoot') return { y: [-15, -25, -15], rotate: [-2, 2, -2], transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' } };
    return { y: [-5, 5, -5], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 } };
  };`);
code = code.replace(/<motion\.div className="flex flex-col items-center z-10 relative" animate={{.*?(?=>\s*<div)/s, `<motion.div className="flex flex-col items-center z-10 relative" animate={getPlayerAnimation()}`);
code = code.replace(/<motion\.div className="flex flex-col items-center z-10 relative" animate={{.*?(?=>\s*<div)/s, `<motion.div className="flex flex-col items-center z-10 relative" animate={getOpponentAnimation()}`);

code = code.replace(/<motion\.div key="pb" className="absolute top-\[42%\] left-\[16%\] h-\[5px\] rounded-full bg-\[#10b981\] shadow-\[0_0_16px_6px_rgba\(16,185,129,0\.5\)\] z-50"/s,
`<motion.div key="pb" className="absolute top-[35%] left-[16%] h-[40px] rounded-r-full bg-gradient-to-r from-transparent via-[#10b981] to-white shadow-[0_0_30px_10px_rgba(16,185,129,0.8)] z-50 border-t border-b border-[#10b981]/50 backdrop-blur-sm"`);
code = code.replace(/animate={{ width: 80, x: '250%' }}/, `animate={{ width: 180, x: '180%' }}`);

code = code.replace(/<motion\.div key="ob" className="absolute top-\[42%\] right-\[16%\] h-\[5px\] rounded-full bg-\[#ff0055\] shadow-\[0_0_16px_6px_rgba\(255,0,85,0\.5\)\] z-50"/s,
`<motion.div key="ob" className="absolute top-[35%] right-[16%] h-[40px] rounded-l-full bg-gradient-to-l from-transparent via-[#ff0055] to-white shadow-[0_0_30px_10px_rgba(255,0,85,0.8)] z-50 border-t border-b border-[#ff0055]/50 backdrop-blur-sm"`);
code = code.replace(/animate={{ width: 80, x: '-250%' }}/, `animate={{ width: 180, x: '-180%' }}`);

code = code.replace(/<motion\.div className="absolute top-0 bottom-\[40%\] left-\[25%\] w-\[10px\] bg-red-500 shadow-\[0_0_30px_10px_red\]"/s,
`<motion.div className="absolute top-0 bottom-[60%] left-[25%] w-[16px] bg-red-500 shadow-[0_0_40px_10px_red] rounded-b-full"`);
code = code.replace(/<motion\.div className="absolute top-0 bottom-\[40%\] right-\[25%\] w-\[10px\] bg-red-500 shadow-\[0_0_30px_10px_red\]"/s,
`<motion.div className="absolute top-0 bottom-[60%] right-[25%] w-[16px] bg-red-500 shadow-[0_0_40px_10px_red] rounded-b-full"`);

code = code.replace(/<div className="flex-1 bg-\[#070707\] border-t border-\[#111\] flex flex-col justify-center px-4 md:px-8 py-4 overflow-y-auto">/s,
`<div className="flex-1 bg-[#070707] border-t border-[#111] flex flex-col justify-start px-4 md:px-8 py-4 overflow-y-auto">`);
code = code.replace(/<div className="max-w-4xl mx-auto w-full">/, `<div className="max-w-4xl mx-auto w-full my-auto">`);

code = code.replace(/<button\s*onClick=\{\(\) => \(document\.getElementById\('battle-inventory-modal'\) as HTMLDialogElement\)\?\.showModal\(\)\}\s*className="bg-purple-900\/60.*?<\/dialog>/s,
`<button onClick={() => setIsInventoryOpen(true)} className="bg-purple-900/60 hover:bg-purple-600 border border-purple-500 text-white px-4 py-2 rounded-full font-mono text-[10px] sm:text-xs tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer">
          DEPLOY GADGET
        </button>
        {isInventoryOpen && (
          <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4">
            <div className="bg-gray-950 border border-purple-500 p-4 sm:p-6 rounded-lg text-white font-mono w-72 sm:w-80 max-w-[90vw] shadow-[0_0_30px_rgba(168,85,247,0.3)]">
               <h3 className="text-purple-400 mb-4 border-b border-purple-900/50 pb-2">ACTIVE INVENTORY</h3>
               {Object.entries(inventory).filter(([_, count]) => count > 0).length === 0 ? (
                 <p className="text-gray-500 text-xs">No tactical assets available.</p>
               ) : (
                 Object.entries(inventory).filter(([_, count]) => count > 0).map(([key, count], idx) => (
                   <button key={idx} onClick={() => {
                     if (key === 'hints') {
                         if (currentQ && currentQ.options) {
                           const ans = currentQ.correctAnswer || '';
                           const wrongOptions = currentQ.options.filter((opt: any) => !(opt === ans || opt.startsWith(ans + '.') || opt.startsWith(ans + ')')));
                           const shuffledWrong = [...wrongOptions].sort(() => 0.5 - Math.random());
                           setEliminatedOptions(shuffledWrong.slice(0, 2));
                           consumeItem(key as any);
                         } else { alert('Hints cannot be used on this question type.'); }
                     } else if (key === 'timeFreezes') { setTimer(prev => prev + 10); consumeItem(key as any);
                     } else if (key === 'screenFreezes') { socket?.emit('player_screen_freeze', { targetId: opponent.empId }); consumeItem(key as any);
                     } else if (key === 'sabotagers') { socket?.emit('player_sabotage', { targetId: opponent.empId, penaltyXp: 50 }); consumeItem(key as any);
                     } else if (key === 'overclocks') { fetch('/api/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ empId: localUser?.empId, inc: { xp: 250 } }) }); consumeItem(key as any);
                     } else if (key === 'ddosEmps') { socket?.emit('player_ddos', { targetId: opponent.empId }); consumeItem(key as any);
                     } else if (key === 'decoys') { alert('Decoys are automatically triggered when sabotaged!');
                     } else if (key === 'shields' || key === 'autoSorters') { alert('This tactical asset is reserved for Solo Matrix engagements.'); }
                     setIsInventoryOpen(false);
                   }} className="block w-full text-left p-3 mb-2 bg-purple-900/20 hover:bg-purple-600 text-sm border border-purple-900 rounded cursor-pointer transition-colors">
                     [{count}x] {key.toUpperCase()}
                   </button>
                 ))
               )}
               <button onClick={() => setIsInventoryOpen(false)} className="mt-4 text-gray-500 hover:text-white text-xs w-full text-right cursor-pointer transition-colors">[ CLOSE ]</button>
            </div>
          </div>
        )}`);

fs.writeFileSync(file, code);
console.log('Successfully patched page.tsx');
