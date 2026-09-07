const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./src/data/questions.json', 'utf8'));

const technicalCategories = [
    "Cloud Security",
    "Access Control Lists (ACL)",
    "Identity and Access Management (IAM)",
    "Network Security",
    "Zero Trust and PAM",
    "Active Directory",
    "Package Manager Security",
    "CI/CD Pipeline Security",
    "Docker & Container Infrastructure",
    "Infrastructure as Code",
    "Cloud Infrastructure",
    "Network Infrastructure",
    "Generic IT Security",
    "Software Supply Chain",
    "Vulnerability Management",
    "General Programming Concepts"
];

const fillerPhrases = [
    " within the context of the organizational security perimeter",
    " facilitating distributed network operations and latency reduction",
    " leveraging zero-trust principles and cryptographic verification",
    " to enhance the overall fault tolerance and system redundancy",
    " mitigating potential attack vectors and vulnerabilities",
    " ensuring compliance with standard cybersecurity frameworks",
    " optimizing the deployment lifecycle and CI/CD pipelines",
    " thereby increasing the complexity of the underlying architecture",
    " utilizing advanced heuristic analysis and machine learning",
    " in alignment with enterprise risk management strategies",
    " providing granular control over authenticated access management",
    " through the integration of multi-factor authentication protocols",
    " securing lateral movement across containerized microservices",
    " to prevent unauthorized escalation of privileges in Active Directory",
    " establishing a continuous feedback loop for vulnerability patching",
    " maintaining data integrity across distributed ledger systems",
    " isolating execution environments to prevent cross-site contamination",
    " obfuscating network traffic to thwart deep packet inspection",
    " implementing robust input validation to sanitize data payloads"
];

function padOption(optionText, targetLength) {
    let result = optionText;
    let attempts = 0;
    while (result.length < targetLength && attempts < 10) {
        result += fillerPhrases[Math.floor(Math.random() * fillerPhrases.length)];
        attempts++;
    }
    return result;
}

data.questions.forEach(q => {
    const isTech = technicalCategories.includes(q.category);
    q.topic = q.category;
    q.category = isTech ? 'Technical' : 'Non-Technical';
    q.pool = q.category;

    if (q.type === 'mcq' && q.options && q.options.length > 0) {
        let strippedOptions = q.options.map(opt => {
            return opt.replace(/^[A-D]\.\s*/, '');
        });

        const correctLetter = q.correctAnswer;
        if (!correctLetter || correctLetter.length !== 1) return;
        const correctIndex = correctLetter.charCodeAt(0) - 'A'.charCodeAt(0);
        
        let correctText = strippedOptions[correctIndex];
        if (!correctText) return;

        const targetLen = correctText.length;

        strippedOptions = strippedOptions.map((opt, idx) => {
            if (idx === correctIndex) return opt;
            if (opt.length < targetLen - 10) {
                return padOption(opt, targetLen);
            }
            return opt;
        });

        const mappedOptions = strippedOptions.map((opt, idx) => ({ text: opt, isCorrect: idx === correctIndex }));
        
        for (let i = mappedOptions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [mappedOptions[i], mappedOptions[j]] = [mappedOptions[j], mappedOptions[i]];
        }

        const prefixes = ['A. ', 'B. ', 'C. ', 'D. '];
        q.options = mappedOptions.map((m, idx) => prefixes[idx] + m.text);
        
        const newCorrectIndex = mappedOptions.findIndex(m => m.isCorrect);
        q.correctAnswer = String.fromCharCode('A'.charCodeAt(0) + newCorrectIndex);
    }
});

fs.writeFileSync('./src/data/questions.json', JSON.stringify(data, null, 4));
console.log('Successfully updated questions.json');
