const fs = require('fs');
let content = fs.readFileSync('src/app/battle/page.tsx', 'utf8');

content = content.replace(
  /\{currentQ\.options\.map\(\(option: string, i: number\) => \{/,
  "{currentQ.options.map((option: string, i: number) => {\n                const isEliminated = eliminatedOptions.includes(option);"
);

content = content.replace(
  /className=\{`p-3 md:p-4 rounded border-2 font-mono text-xs md:text-sm transition-all active:scale-95 text-left leading-snug \$\{cls\}`\}/,
  "className={`p-3 md:p-4 rounded border-2 font-mono text-xs md:text-sm transition-all active:scale-95 text-left leading-snug ${cls} ${isEliminated ? 'opacity-20 pointer-events-none grayscale line-through' : ''}`}"
);

fs.writeFileSync('src/app/battle/page.tsx', content);
console.log('Fixed eliminatedOptions visually in map');
