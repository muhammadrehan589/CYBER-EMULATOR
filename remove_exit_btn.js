const fs = require('fs');
let content = fs.readFileSync('src/components/quiz/QuizEngine.tsx', 'utf8');

content = content.replace(
  /<button onClick=\{\(\) => window\.location\.href = '\/'\} className="bg-red-900\/60 hover:bg-red-600 border border-red-500 text-white px-3 py-1 rounded font-mono text-xs tracking-widest transition-colors cursor-pointer mr-2">\s*EXIT MATRIX\s*<\/button>/,
  ""
);

fs.writeFileSync('src/components/quiz/QuizEngine.tsx', content);
console.log('Removed duplicate exit button');
