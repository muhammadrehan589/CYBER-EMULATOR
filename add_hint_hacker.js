const fs = require('fs');
let content = fs.readFileSync('src/app/battle/page.tsx', 'utf8');

// 1. Add eliminatedOptions state
content = content.replace(
  /const \[screenFrozen, setScreenFrozen\] = useState\(false\);/,
  "const [screenFrozen, setScreenFrozen] = useState(false);\n  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);"
);

// 2. Add hints logic to item consumption
const hintsLogic = `
                     if (key === 'hints') {
                       if (currentQ) {
                         const wrongOptions = currentQ.options.filter((opt: string) => !opt.startsWith(currentQ.correctAnswer + '.'));
                         const shuffledWrong = [...wrongOptions].sort(() => 0.5 - Math.random());
                         setEliminatedOptions(shuffledWrong.slice(0, 2));
                       }
                     } else if (key === 'timeFreezes') {
`;
content = content.replace(
  /if \(key === 'timeFreezes'\) \{/,
  hintsLogic.trim()
);

// 3. Remove 'hints' from the restricted items alert
content = content.replace(
  /if \(key === 'hints' \|\| key === 'shields'\) \{/,
  "if (key === 'shields') {"
);

// 4. Reset eliminatedOptions on next round
content = content.replace(
  /setTimer\(30\); setHasAnswered\(false\); setSelectedOption\(null\); setIsCorrect\(null\);/,
  "setTimer(30); setHasAnswered(false); setSelectedOption(null); setIsCorrect(null); setEliminatedOptions([]);"
);

// 5. Apply eliminated visual styling to options
content = content.replace(
  /const isCorrectOpt = isCorrect !== null && option\.startsWith\(currentQ\.correctAnswer \+ '\.'\);/,
  "const isCorrectOpt = isCorrect !== null && option.startsWith(currentQ.correctAnswer + '.');\n                    const isEliminated = eliminatedOptions.includes(option);"
);

content = content.replace(
  /<button\s+key=\{idx\}\s+onClick=\{\(\) => handleOptionClick\(option\)\}\s+disabled=\{hasAnswered \|\| screenFrozen\}\s+className=\{`\nw-full text-left p-4 rounded bg-\[#0a0a0a\] border border-\[#333\] transition-all duration-300 hover:bg-\[#1a1a1a\] hover:border-\[#10b981\] hover:shadow-\[0_0_15px_rgba\(16,185,129,0\.15\)\] group\n\$\{cls\}\n`\}/,
  `<button
                      key={idx}
                      onClick={() => handleOptionClick(option)}
                      disabled={hasAnswered || screenFrozen || isEliminated}
                      className={\`
w-full text-left p-4 rounded bg-[#0a0a0a] border border-[#333] transition-all duration-300 hover:bg-[#1a1a1a] hover:border-[#10b981] hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] group
\${cls} \${isEliminated ? 'opacity-20 pointer-events-none grayscale line-through' : ''}
\`}
                    >`
);

// Since the exact formatting of the button might be hard to match with a regex, let's do a more robust replace for the button classes:
content = content.replace(
  /\$\{cls\}\n`\}/,
  "${cls} ${isEliminated ? 'opacity-20 pointer-events-none grayscale line-through' : ''}\n`}"
);
content = content.replace(
  /disabled=\{hasAnswered \|\| screenFrozen\}/g,
  "disabled={hasAnswered || screenFrozen || (typeof isEliminated !== 'undefined' ? isEliminated : false)}"
);


fs.writeFileSync('src/app/battle/page.tsx', content);
console.log('Hint hacker added to 1v1 matrix');
