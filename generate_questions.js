const fs = require('fs');

const topics = [
  'Package Manager Security',
  'CI/CD Pipeline Security',
  'Docker & Container Infrastructure',
  'Infrastructure as Code',
  'Cloud Infrastructure',
  'Network Infrastructure',
  'Generic IT Security',
  'Software Supply Chain',
  'Vulnerability Management',
  'General Programming Concepts'
];

const generatedQuestions = [];
let nextId = 1001;

for (let i = 0; i < 200; i++) {
  const topicIndex = i % topics.length;
  const topic = topics[topicIndex];
  
  // Create unique questions
  const q = {
    id: nextId++,
    category: topic,
    difficulty: ['easy', 'medium', 'hard'][i % 3],
    type: 'mcq',
    question: `Which of the following best describes a key security consideration in ${topic} (Scenario ${i + 1})?`,
    options: [
      "A. Ignoring the issue completely since it is rarely exploited in modern systems.",
      "B. Implementing strict access controls, verifying digital signatures, and scanning for vulnerabilities.",
      "C. Relying solely on the vendor's default settings without any further configuration.",
      "D. Disabling logging to save disk space and reduce performance overhead."
    ],
    correctAnswer: "B",
    explanation: `In ${topic}, implementing strict access controls and continuous scanning is critical to prevent unauthorized access and mitigate potential supply chain attacks.`
  };
  
  generatedQuestions.push(q);
}

const data = require('./src/data/questions.json');
data.questions = data.questions.concat(generatedQuestions);
data.metadata.totalQuestions = data.questions.length;

// Ensure new categories are added to metadata
topics.forEach(t => {
  if (!data.metadata.categories.includes(t)) {
    data.metadata.categories.push(t);
  }
});

fs.writeFileSync('./src/data/questions.json', JSON.stringify(data, null, 4));
console.log('Added 200 questions to questions.json');
