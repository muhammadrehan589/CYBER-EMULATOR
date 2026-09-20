const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../questions.json');
const outputFile = path.join(__dirname, '../enterprise-bank.json');

function main() {
  const data = fs.readFileSync(inputFile, 'utf-8');
  const questions = JSON.parse(data);

  const dropRegex = /(what is|define|stands for|meaning of|port \d+|subnet|osi model|packet|handshake|hash algorithm|rsa|aes|sql injection|xss|csrf|buffer overflow|firewall rule|what type of|name the|identify the|which attack|which malware|which vulnerability|wireshark|nmap|metasploit|burp suite)/i;

  let totalOriginal = questions.length;
  let totalDropped = 0;
  let validScenariosKept = 0;

  const newQuestions = [];

  for (const q of questions) {
    const p = q.prompt || "";
    if (dropRegex.test(p)) {
      totalDropped++;
      continue;
    }
    
    // Inject the new schema
    q.difficulty = 'easy';
    
    if (q.correctOrder && Array.isArray(q.correctOrder)) {
      q.type = 'sequence';
    } else {
      q.type = 'mcq';
    }

    newQuestions.push(q);
    validScenariosKept++;
  }

  fs.writeFileSync(outputFile, JSON.stringify(newQuestions, null, 2), 'utf-8');

  console.log(`Total Original: ${totalOriginal}`);
  console.log(`Total Dropped: ${totalDropped}`);
  console.log(`Valid Scenarios Kept: ${validScenariosKept}`);
}

main();
