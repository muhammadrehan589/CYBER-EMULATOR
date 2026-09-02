const fs = require('fs');
let content = fs.readFileSync('src/models/Question.ts', 'utf8');
content = content.replace(/correctAnswer: \{ type: String, required: true \}/, 'correctAnswer: { type: String, required: false }');
fs.writeFileSync('src/models/Question.ts', content);
console.log('Fixed Question.ts');
