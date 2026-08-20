const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'questions.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 1. Duplicate IDs
const seenIds = new Set();
let maxId = 0;
data.questions.forEach(q => {
    if (typeof q.id === 'number' && q.id > maxId) maxId = q.id;
});

data.questions.forEach(q => {
    if (seenIds.has(q.id)) {
        maxId++;
        q.id = maxId;
    }
    seenIds.add(q.id);
});

// 2 & 3. Fix MCQs
data.questions.forEach(q => {
    if (q.type === 'mcq') {
        // Array lengths
        if (!q.options) q.options = [];
        while (q.options.length < 4) {
            q.options.push(`Placeholder Option ${q.options.length + 1}`);
        }
        if (q.options.length > 4) {
            q.options = q.options.slice(0, 4);
        }

        // Answer Mismatches
        const answer = (q.correctAnswer || '').toString().trim();
        let matchedOption = q.options.find(opt => opt.trim() === answer);

        if (!matchedOption) {
            // Try case insensitive
            matchedOption = q.options.find(opt => opt.trim().toLowerCase() === answer.toLowerCase());
        }

        if (!matchedOption && answer.length === 1) {
            // e.g. "B" matches "B. Something"
            matchedOption = q.options.find(opt => opt.trim().startsWith(answer + '.') || opt.trim().startsWith(answer + ')'));
        }

        if (matchedOption) {
            q.correctAnswer = matchedOption;
        } else {
            // If it's A, B, C, D fallback by index
            if (answer.length === 1) {
                const index = answer.toUpperCase().charCodeAt(0) - 65;
                if (index >= 0 && index < 4) {
                    q.correctAnswer = q.options[index];
                }
            }
        }
    } else if (q.type === 'drag_and_drop') {
        // 4. Drag and Drop Validation
        if (Array.isArray(q.draggableItems)) {
            const validIds = new Set(q.draggableItems.map(item => item.id));
            if (Array.isArray(q.correctOrder)) {
                q.correctOrder = q.correctOrder.filter(id => validIds.has(id));
            }
        }
    }
});

// 5. Valid JSON without trailing commas is guaranteed by JSON.stringify
fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
console.log('Sanitization complete!');
