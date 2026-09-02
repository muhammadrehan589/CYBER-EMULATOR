const fs = require('fs');
let content = fs.readFileSync('src/models/Question.ts', 'utf8');
content = content.replace(
  /correctOrder\?: string\[\];/,
  "correctOrder?: string[];\n  correctSequence?: string[];"
);
fs.writeFileSync('src/models/Question.ts', content);
console.log('Fixed Question.ts interface');
