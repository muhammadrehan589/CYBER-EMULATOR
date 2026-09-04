const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/app/battle/page.tsx');
let code = fs.readFileSync(filePath, 'utf-8');

// 1. Add getPlayerAnimation and getOpponentAnimation helpers
const helpers = 
    const opponentDmg = animationState === 'opponent_damage' || animationState === 'both_damage';
    const bump        = animationState === 'both_correct';

    const getPlayerAnimation = () => {
      if (bump) return { x: [0, 55, 0], transition: { duration: 0.4 } };
      if (playerDmg) return { x: [-10, 10, -10, 10, 0], filter: 'brightness(0.3) sepia(1) hue-rotate(-40deg) saturate(10)', transition: { duration: 0.4 } };
      if (animationState === 'player_shoot' || animationState === 'both_shoot') return { y: [0, -20, 0], rotate: [0, -10, 10, 0], transition: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' } };
      return { x: 0, y: 0, rotate: 0, filter: 'none', transition: { duration: 0.4 } };
    };

    const getOpponentAnimation = () => {
      if (bump) return { x: [0, -55, 0], transition: { duration: 0.4 } };
      if (opponentDmg) return { x: [-10, 10, -10, 10, 0], filter: 'brightness(0.3) sepia(1) hue-rotate(-40deg) saturate(10)', transition: { duration: 0.4 } };
      if (animationState === 'opponent_shoot' || animationState === 'both_shoot') return { y: [0, -20, 0], rotate: [0, 10, -10, 0], transition: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' } };
      return { x: 0, y: 0, rotate: 0, filter: 'none', transition: { duration: 0.4 } };
    };
;

code = code.replace(
    "    const bump        = animationState === 'both_correct';",
    helpers.trim()
);

// 2. Replace Player motion.div
const playerRegex = /<motion\.div className="flex flex-col items-center z-10 relative"[\s\S]*?animate=\{bump \? \{ x: \[0, 55, 0\] \} : playerDmg \? \{ x: \[-10, 10, -10, 10, 0\], filter: 'brightness\(0\.3\) sepia\(1\) hue-rotate\(-40deg\) saturate\(10\)' \} : \(animationState === 'player_shoot' \|\| animationState === 'both_shoot'\) \? \{ y: \[-5, -15, -5\], rotate: \[0, -5, 5, 0\] \} : \{ x: 0, y: 0, rotate: 0, filter: 'none' \}\}[\s\S]*?transition=\{\{ duration: 0\.4, repeat: \(animationState === 'player_shoot' \|\| animationState === 'both_shoot'\) \? Infinity : 0 \}\}>/g;

code = code.replace(playerRegex, '<motion.div className="flex flex-col items-center z-10 relative" animate={getPlayerAnimation()}>');

// 3. Replace Opponent motion.div
const opponentRegex = /<motion\.div className="flex flex-col items-center z-10 relative"[\s\S]*?animate=\{bump \? \{ x: \[0, -55, 0\] \} : opponentDmg \? \{ x: \[-10, 10, -10, 10, 0\], filter: 'brightness\(0\.3\) sepia\(1\) hue-rotate\(-40deg\) saturate\(10\)' \} : \(animationState === 'opponent_shoot' \|\| animationState === 'both_shoot'\) \? \{ y: \[-5, -15, -5\], rotate: \[0, 5, -5, 0\] \} : \{ x: 0, y: 0, rotate: 0, filter: 'none' \}\}[\s\S]*?transition=\{\{ duration: 0\.4, repeat: \(animationState === 'opponent_shoot' \|\| animationState === 'both_shoot'\) \? Infinity : 0 \}\}>/g;

code = code.replace(opponentRegex, '<motion.div className="flex flex-col items-center z-10 relative" animate={getOpponentAnimation()}>');

// 4. Update Timeouts
code = code.replace(/setAnimationState\('opponent_damage'\); \}, 500\);/g, "setAnimationState('opponent_damage'); }, 1200);");
code = code.replace(/setAnimationState\('player_damage'\); \}, 500\);/g, "setAnimationState('player_damage'); }, 1200);");
code = code.replace(/else \{ setPlayerHp\(data\.p2Hp\); setOpponentHp\(data\.p1Hp\); \}\n          \}, 500\);/g, "else { setPlayerHp(data.p2Hp); setOpponentHp(data.p1Hp); }\n          }, 1200);");
code = code.replace(/setCurrentRound\(r => r \+ 1\);\n            \}, 2500\);/g, "setCurrentRound(r => r + 1);\n            }, 3000);");

fs.writeFileSync(filePath, code);
console.log("Animation fix applied.");
