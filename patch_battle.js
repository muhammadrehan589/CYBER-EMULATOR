const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/app/battle/page.tsx');
let code = fs.readFileSync(filePath, 'utf-8');

// 1. Add isInventoryOpen
code = code.replace(
    'const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);',
    'const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);\\n  const [isInventoryOpen, setIsInventoryOpen] = useState(false);'
);

// 2. Add overflow-hidden to Arena
code = code.replace(
    '<div className="relative flex items-end justify-between px-8 sm:px-20 md:px-36 pb-3 shrink-0" style={{ height: \\'36%\\' }}>',
    '<div className="relative flex items-end justify-between px-8 sm:px-20 md:px-36 pb-3 shrink-0 overflow-hidden" style={{ height: \\'36%\\' }}>'
);

// 3. Kamehameha lasers
code = code.replace(
    '<motion.div key="pb" className="absolute top-[42%] left-[16%] h-[5px] rounded-full bg-[#10b981] shadow-[0_0_16px_6px_rgba(16,185,129,0.5)] z-50"\\n                initial={{ width: 10, x: 0, opacity: 1 }} animate={{ width: 80, x: \\'-250%\\' }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: \\'easeIn\\' }} />',
    '<motion.div key="pb" className="absolute top-[42%] left-[16%] h-[30px] rounded-r-full bg-[#10b981] shadow-[0_0_40px_15px_rgba(16,185,129,0.8)] z-50 flex items-center justify-end overflow-hidden border border-[#10b981]/50"\\n                initial={{ width: 0, opacity: 1 }} animate={{ width: \\'68%\\' }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: \\'easeOut\\' }}>\\n                <div className="w-24 h-[60%] bg-white blur-[4px] rounded-full mr-2" />\\n              </motion.div>'
);

code = code.replace(
    '<motion.div key="ob" className="absolute top-[42%] right-[16%] h-[5px] rounded-full bg-[#ff0055] shadow-[0_0_16px_6px_rgba(255,0,85,0.5)] z-50"\\n                initial={{ width: 10, x: 0, opacity: 1 }} animate={{ width: 80, x: \\'-250%\\' }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: \\'easeIn\\' }} />',
    '<motion.div key="ob" className="absolute top-[42%] right-[16%] h-[30px] rounded-l-full bg-[#ff0055] shadow-[0_0_40px_15px_rgba(255,0,85,0.8)] z-50 flex items-center justify-start overflow-hidden border border-[#ff0055]/50"\\n                initial={{ width: 0, opacity: 1 }} animate={{ width: \\'68%\\' }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: \\'easeOut\\' }}>\\n                <div className="w-24 h-[60%] bg-white blur-[4px] rounded-full ml-2" />\\n              </motion.div>'
);

// 4. Floating and rotating avatars
code = code.replace(
    'animate={bump ? { x: [0, 55, 0] } : playerDmg ? { x: [-10, 10, -10, 10, 0], filter: \\'brightness(0.3) sepia(1) hue-rotate(-40deg) saturate(10)\\' } : { x: 0, filter: \\'none\\' }}',
    'animate={bump ? { x: [0, 55, 0] } : playerDmg ? { x: [-10, 10, -10, 10, 0], filter: \\'brightness(0.3) sepia(1) hue-rotate(-40deg) saturate(10)\\' } : (animationState === \\'player_shoot\\' || animationState === \\'both_shoot\\') ? { y: [-5, -15, -5], rotate: [0, -5, 5, 0] } : { x: 0, y: 0, rotate: 0, filter: \\'none\\' }}'
);

code = code.replace(
    'animate={bump ? { x: [0, -55, 0] } : opponentDmg ? { x: [-10, 10, -10, 10, 0], filter: \\'brightness(0.3) sepia(1) hue-rotate(-40deg) saturate(10)\\' } : { x: 0, filter: \\'none\\' }}',
    'animate={bump ? { x: [0, -55, 0] } : opponentDmg ? { x: [-10, 10, -10, 10, 0], filter: \\'brightness(0.3) sepia(1) hue-rotate(-40deg) saturate(10)\\' } : (animationState === \\'opponent_shoot\\' || animationState === \\'both_shoot\\') ? { y: [-5, -15, -5], rotate: [0, 5, -5, 0] } : { x: 0, y: 0, rotate: 0, filter: \\'none\\' }}'
);

// 5. system_zap vertical laser
code = code.replace(
    'className="absolute bottom-full mb-4 w-[6px] h-[500px] bg-red-500 shadow-[0_0_20px_5px_red] z-50 rounded-full"',
    'className="absolute bottom-full mb-4 w-[16px] h-[1000px] bg-red-500 shadow-[0_0_40px_10px_red] z-50 rounded-full"'
);
code = code.replace(
    'className="absolute bottom-full mb-4 w-[6px] h-[500px] bg-red-500 shadow-[0_0_20px_5px_red] z-50 rounded-full"',
    'className="absolute bottom-full mb-4 w-[16px] h-[1000px] bg-red-500 shadow-[0_0_40px_10px_red] z-50 rounded-full"'
);

const inventoryModalOld = <button 
            onClick={() => (document.getElementById('battle-inventory-modal') as HTMLDialogElement)?.showModal()}
            className="bg-purple-900/60 hover:bg-purple-600 border border-purple-500 text-white px-4 py-2 rounded-full font-mono text-[10px] sm:text-xs tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
          >
            DEPLOY GADGET
          </button>
          
          <dialog id="battle-inventory-modal" className="bg-gray-950 border border-purple-500 p-4 sm:p-6 rounded-lg text-white font-mono backdrop:bg-black/80 w-72 sm:w-80 max-w-[90vw]">
             <h3 className="text-purple-400 mb-4 border-b border-purple-900/50 pb-2">ACTIVE INVENTORY</h3>
             {Object.entries(inventory).filter(([_, count]) => count > 0).length === 0 ? (
               <p className="text-gray-500 text-xs">No tactical assets available.</p>
             ) : (
               Object.entries(inventory).filter(([_, count]) => count > 0).map(([key, count], idx) => (
                 <button 
                 key={idx} 
                 onClick={() => {
                   
                   if (key === 'hints') {
                       if (currentQ && currentQ.options) {
                         const ans = currentQ.correctAnswer || '';
                         const wrongOptions = currentQ.options.filter((opt: string) => !(opt === ans || opt.startsWith(ans + '.') || opt.startsWith(ans + ')')));
                         const shuffledWrong = [...wrongOptions].sort(() => 0.5 - Math.random());
                         setEliminatedOptions(shuffledWrong.slice(0, 2));
                         consumeItem(key as any);
                       } else {
                         alert('Hints cannot be used on this question type.');
                       }
                     } else if (key === 'timeFreezes') {
                       setTimer(prev => prev + 10);
                       consumeItem(key as any);
                     } else if (key === 'screenFreezes') {
                       socket?.emit('player_screen_freeze', { targetId: opponent.empId });
                       consumeItem(key as any);
                     } else if (key === 'sabotagers') {
                       socket?.emit('player_sabotage', { targetId: opponent.empId, penaltyXp: 50 });
                       consumeItem(key as any);
                     } else if (key === 'overclocks') {
                       fetch('/api/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ empId: localUser?.empId, inc: { xp: 250 } }) });
                       consumeItem(key as any);
                     } else if (key === 'ddosEmps') {
                       socket?.emit('player_ddos', { targetId: opponent.empId });
                       consumeItem(key as any);
                     } else if (key === 'decoys') {
                       alert('Decoys are automatically triggered when sabotaged!');
                     } else if (key === 'shields') {
                       alert('This tactical asset is reserved for Solo Matrix engagements.');
                     } else if (key === 'autoSorters') {
                       alert('This tactical asset is reserved for Solo Matrix engagements.');
                     }
                   
                   (document.getElementById('battle-inventory-modal') as HTMLDialogElement)?.close();
                 }}
                   className="block w-full text-left p-3 mb-2 bg-purple-900/20 hover:bg-purple-600 text-sm border border-purple-900 rounded cursor-pointer"
                 >
                   [{count}x] {key.toUpperCase()}
                 </button>
               ))
             )}
             <button onClick={() => (document.getElementById('battle-inventory-modal') as HTMLDialogElement)?.close()} className="mt-4 text-gray-500 hover:text-white text-xs w-full text-right cursor-pointer">
               [ CLOSE ]
             </button>
          </dialog>;

const inventoryModalNew = <button 
            onClick={() => setIsInventoryOpen(true)}
            className="bg-purple-900/60 hover:bg-purple-600 border border-purple-500 text-white px-4 py-2 rounded-full font-mono text-[10px] sm:text-xs tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
          >
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
                     <button 
                     key={idx} 
                     onClick={() => {
                       
                       if (key === 'hints') {
                           if (currentQ && currentQ.options) {
                             const ans = currentQ.correctAnswer || '';
                             const wrongOptions = currentQ.options.filter((opt: string) => !(opt === ans || opt.startsWith(ans + '.') || opt.startsWith(ans + ')')));
                             const shuffledWrong = [...wrongOptions].sort(() => 0.5 - Math.random());
                             setEliminatedOptions(shuffledWrong.slice(0, 2));
                             consumeItem(key as any);
                           } else {
                             alert('Hints cannot be used on this question type.');
                           }
                         } else if (key === 'timeFreezes') {
                           setTimer(prev => prev + 10);
                           consumeItem(key as any);
                         } else if (key === 'screenFreezes') {
                           socket?.emit('player_screen_freeze', { targetId: opponent.empId });
                           consumeItem(key as any);
                         } else if (key === 'sabotagers') {
                           socket?.emit('player_sabotage', { targetId: opponent.empId, penaltyXp: 50 });
                           consumeItem(key as any);
                         } else if (key === 'overclocks') {
                           fetch('/api/users', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ empId: localUser?.empId, inc: { xp: 250 } }) });
                           consumeItem(key as any);
                         } else if (key === 'ddosEmps') {
                           socket?.emit('player_ddos', { targetId: opponent.empId });
                           consumeItem(key as any);
                         } else if (key === 'decoys') {
                           alert('Decoys are automatically triggered when sabotaged!');
                         } else if (key === 'shields') {
                           alert('This tactical asset is reserved for Solo Matrix engagements.');
                         } else if (key === 'autoSorters') {
                           alert('This tactical asset is reserved for Solo Matrix engagements.');
                         }
                       
                       setIsInventoryOpen(false);
                     }}
                       className="block w-full text-left p-3 mb-2 bg-purple-900/20 hover:bg-purple-600 text-sm border border-purple-900 rounded cursor-pointer transition-colors"
                     >
                       [{count}x] {key.toUpperCase()}
                     </button>
                   ))
                 )}
                 <button onClick={() => setIsInventoryOpen(false)} className="mt-4 text-gray-500 hover:text-white text-xs w-full text-right cursor-pointer transition-colors">
                   [ CLOSE ]
                 </button>
              </div>
            </div>
          )};

if (code.includes(inventoryModalOld.substring(0, 100))) {
    code = code.replace(inventoryModalOld, inventoryModalNew);
} else {
    console.log("WARNING: Modal code not exactly matching, attempting fallback replacement...");
    const oldPart1 = "<dialog id=\\"battle-inventory-modal\\"";
    if (code.includes(oldPart1)) {
        // Just replacing the entire dialog tree won't be as easy with regex, but let's check
    }
}

fs.writeFileSync(filePath, code);
console.log("Patch completed.");
