const fs = require('fs');
let content = fs.readFileSync('scripts/seed.js', 'utf8');

content = content.replace(
  /type: \{ type: String, required: true, enum: \['mcq', 'true_false', 'sequence', 'visual'\] \}/,
  "type: { type: String, required: true, enum: ['mcq', 'true_false', 'sequence', 'visual', 'drag_and_drop'] }"
);
content = content.replace(
  /correctAnswer: \{ type: String, required: true \}/,
  "correctAnswer: { type: String, required: false }"
);

fs.writeFileSync('scripts/seed.js', content);
console.log('Fixed schema in seed.js');
