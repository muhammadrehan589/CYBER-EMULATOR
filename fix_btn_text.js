const fs = require('fs');
let content = fs.readFileSync('src/components/quiz/QuizEngine.tsx', 'utf8');

content = content.replace(
  /SAVE AND EXIT/,
  "SAVE AND ABORT"
);

fs.writeFileSync('src/components/quiz/QuizEngine.tsx', content);
console.log('Fixed button text');
