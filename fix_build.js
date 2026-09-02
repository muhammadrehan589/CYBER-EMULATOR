const fs = require('fs');
let content = fs.readFileSync('src/components/quiz/QuizEngine.tsx', 'utf8');

content = content.replace(
  /const \[wagerAmount, setWagerAmount\] = useState\(0\);/,
  "// Removed duplicate wagerAmount"
);

fs.writeFileSync('src/components/quiz/QuizEngine.tsx', content);
console.log('Fixed build error');
