const fs = require('fs');
let code = fs.readFileSync('src/app/battle/page.tsx', 'utf8');

// 1. Add isInventoryOpen state
code = code.replace(/const \[eliminatedOptions, setEliminatedOptions\] = useState<string\[\]>\(\[\]\);/, "const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);\n    const [isInventoryOpen, setIsInventoryOpen] = useState(false);");

// 2. Fix the inventory modal rendering
const oldModal = /<button \n          onClick=\{\(\) => \(document\.getElementById\('battle-inventory-modal'\) as HTMLDialogElement\)\?\.showModal\(\)\}[\s\S]*?<\/dialog>/;
const newModal = \<button onClick={() => setIsInventoryOpen(true)} className="bg-purple-900/60 hover:bg-purple-600 border border-purple-500 text-white px-4 py-2 rounded-full font-mono text-[10px] sm:text-xs tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer">DEPLOY GADGET</button>
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
        )}\;
code = code.replace(oldModal, newModal);

// 3. Sequence Clipping Fix
code = code.replace(/<div className="flex-1 bg-\\[#070707\\] border-t border-\\[#111\\] flex flex-col justify-center px-4 md:px-8 py-4 overflow-y-auto">/, '<div className="flex-1 bg-[#070707] border-t border-[#111] flex flex-col justify-start px-4 md:px-8 py-4 overflow-y-auto">');
code = code.replace(/<div className="max-w-4xl mx-auto w-full">/, '<div className="max-w-4xl mx-auto w-full my-auto">');

// 4. Randomize sequence on load
const oldFetch = /fetch\(\\\/api\\/questions\?random=true&limit=50&exclude=\\\$\{useQuizStore\.getState\(\)\.playedQuestions\.join\(\',\'\)\}\\)\.then\(r => r\.json\(\)\)\.then\(data => \{\n\s*if \(data\.success && isMounted\) \{\n\s*currentSocket!\.emit\('init_battle_data', \{ matchId, questions: data\.data \}\);\n\s*setQuestions\(data\.data\);\n\s*\}\n\s*\}\);/;
const newFetch = \etch(\\\/api/questions?random=true&limit=50&exclude=\\\\).then(r => r.json()).then(data => {
            if (data.success && isMounted) {
              const randomizedQuestions = data.data.map((q: any) => {
                if ((q.type === 'sequence' || q.type === 'drag_and_drop') && q.draggableItems) {
                  return { ...q, draggableItems: [...q.draggableItems].sort(() => 0.5 - Math.random()) };
                }
                return q;
              });
              currentSocket!.emit('init_battle_data', { matchId, questions: randomizedQuestions });
              setQuestions(randomizedQuestions);
            }
          });\;
code = code.replace(oldFetch, newFetch);

// 5. Apply the hover animation & timeout logic
const helpers = \
    const opponentDmg = animationState === 'opponent_damage' || animationState === 'both_damage';
    const bump        = animationState === 'both_correct';

    const getPlayerAnimation = () => {
      if (bump) return { x: [0, 55, 0], transition: { duration: 0.4 } };
      if (playerDmg) return { x: [-10, 10, -10, 10, 0], filter: 'brightness(0.3) sepia(1) hue-rotate(-40deg) saturate(10)', transition: { duration: 0.4 } };
      if (animationState === 'player_shoot' || animationState === 'both_shoot') return { y: [0, -20, 0], rotate: [0, -10, 10, 0], transition: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' } };
      return { x: 0, y: 0, rotate: 0, filter: 'none', transition: { duration: 0.4 } };
    };

    const getOpponentAnimation = () => {
      if (bump) return { x: [0, -55, 0], transition: { duration: 0.4 } };
      if (opponentDmg) return { x: [-10, 10, -10, 10, 0], filter: 'brightness(0.3) sepia(1) hue-rotate(-40deg) saturate(10)', transition: { duration: 0.4 } };
      if (animationState === 'opponent_shoot' || animationState === 'both_shoot') return { y: [0, -20, 0], rotate: [0, 10, -10, 0], transition: { repeat: Infinity, duration: 0.6, ease: 'easeInOut' } };
      return { x: 0, y: 0, rotate: 0, filter: 'none', transition: { duration: 0.4 } };
    };
\;

code = code.replace("    const bump        = animationState === 'both_correct';", helpers);

const oldPlayerAnim = /<motion\.div className="flex flex-col items-center z-10 relative"[\s\n]*animate=\{bump \? \{ x: \[0, 55, 0\] \} : playerDmg \? \{ x: \[-10, 10, -10, 10, 0\], filter: 'brightness\\(0\.3\\) sepia\\(1\\) hue-rotate\\(-40deg\\) saturate\\(10\\)' \} : \\(animationState === 'player_shoot' \|\| animationState === 'both_shoot'\\) \? \{ y: \[-5, -15, -5\], rotate: \[0, -5, 5, 0\] \} : \{ x: 0, y: 0, rotate: 0, filter: 'none' \}\}[\s\n]*transition=\{\{ duration: 0\.4 \}\}>/;
code = code.replace(oldPlayerAnim, '<motion.div className="flex flex-col items-center z-10 relative" animate={getPlayerAnimation()}>');

const oldOpponentAnim = /<motion\.div className="flex flex-col items-center z-10 relative"[\s\n]*animate=\{bump \? \{ x: \[0, -55, 0\] \} : opponentDmg \? \{ x: \[-10, 10, -10, 10, 0\], filter: 'brightness\\(0\.3\\) sepia\\(1\\) hue-rotate\\(-40deg\\) saturate\\(10\\)' \} : \\(animationState === 'opponent_shoot' \|\| animationState === 'both_shoot'\\) \? \{ y: \[-5, -15, -5\], rotate: \[0, 5, -5, 0\] \} : \{ x: 0, y: 0, rotate: 0, filter: 'none' \}\}[\s\n]*transition=\{\{ duration: 0\.4 \}\}>/;
code = code.replace(oldOpponentAnim, '<motion.div className="flex flex-col items-center z-10 relative" animate={getOpponentAnimation()}>');

// Update timeouts for better laser duration
code = code.replace(/setAnimationState\('opponent_damage'\); \}, 500\);/g, "setAnimationState('opponent_damage'); }, 1200);");
code = code.replace(/setAnimationState\('player_damage'\); \}, 500\);/g, "setAnimationState('player_damage'); }, 1200);");
code = code.replace(/else \{ setPlayerHp\(data\.p2Hp\); setOpponentHp\(data\.p1Hp\); \}\n          \}, 500\);/g, "else { setPlayerHp(data.p2Hp); setOpponentHp(data.p1Hp); }\n          }, 1200);");
code = code.replace(/setCurrentRound\(r => r \+ 1\);\n            \}, 2500\);/g, "setCurrentRound(r => r + 1);\n            }, 3000);");

fs.writeFileSync('src/app/battle/page.tsx', code);
console.log("Patched everything.");
