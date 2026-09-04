const fs = require('fs');
let code = fs.readFileSync('src/app/battle/page.tsx', 'utf8');

// The original lines before rendering:
//   const opponentDmg = animationState === 'opponent_damage' || animationState === 'both_damage';
//   const bump        = animationState === 'both_correct';
//
//   return ( ... )

// We will find "const bump        = animationState === 'both_correct';" and replace everything from there to the end of the file or just patch it cleanly.

// Let's replace the inline animations for player and opponent explicitly.
// Player:
code = code.replace(/<motion\.div className="flex flex-col items-center z-10 relative"[\s\n]*animate=\{bump \? \{ x: \[0, 55, 0\] \} : playerDmg \? \{ x: \[-10, 10, -10, 10, 0\], filter: 'brightness\\(0\.3\\) sepia\\(1\\) hue-rotate\\(-40deg\\) saturate\\(10\\)' \} : \\(animationState === 'player_shoot' \|\| animationState === 'both_shoot'\\) \? \{ y: \[-5, -15, -5\], rotate: \[0, -5, 5, 0\] \} : \{ x: 0, y: 0, rotate: 0, filter: 'none' \}\}[\s\n]*transition=\{\{ duration: 0\.4, repeat: \\(animationState === 'player_shoot' \|\| animationState === 'both_shoot'\\) \? Infinity : 0 \}\}>/, 
    '<motion.div className="flex flex-col items-center z-10 relative"\n          animate={bump ? { x: [0, 55, 0], transition: { duration: 0.4 } } : playerDmg ? { x: [-10, 10, -10, 10, 0], filter: "brightness(0.3) sepia(1) hue-rotate(-40deg) saturate(10)", transition: { duration: 0.4 } } : (animationState === "player_shoot" || animationState === "both_shoot") ? { y: [0, -15, 0], rotate: [0, -10, 10, 0], transition: { repeat: Infinity, duration: 0.5 } } : { x: 0, y: 0, rotate: 0, filter: "none", transition: { duration: 0.4 } }}>');

code = code.replace(/<motion\.div className="flex flex-col items-center z-10 relative" animate=\{getOpponentAnimation\(\)\}>/, 
    '<motion.div className="flex flex-col items-center z-10 relative"\n          animate={bump ? { x: [0, -55, 0], transition: { duration: 0.4 } } : opponentDmg ? { x: [-10, 10, -10, 10, 0], filter: "brightness(0.3) sepia(1) hue-rotate(-40deg) saturate(10)", transition: { duration: 0.4 } } : (animationState === "opponent_shoot" || animationState === "both_shoot") ? { y: [0, -15, 0], rotate: [0, 10, -10, 0], transition: { repeat: Infinity, duration: 0.5 } } : { x: 0, y: 0, rotate: 0, filter: "none", transition: { duration: 0.4 } }}>');

// And we must ensure there isn't an extra leftover line like <motion.div className="flex flex-col items-center z-10 relative" from the bad patch:
code = code.replace(/<motion\.div className="flex flex-col items-center z-10 relative"[\r\n\s]*<motion\.div className="flex flex-col items-center z-10 relative"/, '<motion.div className="flex flex-col items-center z-10 relative"');

fs.writeFileSync('src/app/battle/page.tsx', code);
