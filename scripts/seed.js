/**
 * Database Seed Script for CYBER-EMULATOR
 * 
 * Seeds MongoDB with initial users, questions, and activity logs.
 * Run with: node scripts/seed.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// ── Load .env.local manually ──
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex).trim();
        const value = trimmed.substring(eqIndex + 1).trim();
        process.env[key] = value;
      }
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('\x1b[31m✗ MONGODB_URI not found in .env.local\x1b[0m');
  process.exit(1);
}

// ── Define schemas inline (CommonJS compatible) ──
const UserSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: String,
  passwordHash: String,
  department: { type: String, default: 'Operations' },
  role: { type: String, enum: ['Admin', 'Player', 'VIP', 'Guard'], default: 'Player' },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  score: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
  activeAvatar: { type: mongoose.Schema.Types.Mixed, default: {} },
  wardrobe: { type: [mongoose.Schema.Types.Mixed], default: [] },
  unlockedOutfits: { type: [String], default: [] },
}, { timestamps: true });

const QuestionSchema = new mongoose.Schema({
  questionId: { type: Number, required: true, unique: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true, enum: ['easy', 'medium', 'difficult'] },
  type: { type: String, required: true, enum: ['mcq', 'true_false', 'sequence', 'visual', 'drag_and_drop'] },
  question: { type: String, required: true },
  options: [String],
  correctAnswer: { type: String, required: false },
  explanation: String,
  items: [mongoose.Schema.Types.Mixed],
  correctOrder: [String],
  imageUrl: String,
  pool: { type: String, enum: ['Technical', 'Non-Technical'] },
}, { timestamps: true });

const ActivityLogSchema = new mongoose.Schema({
  empId: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now },
  action: { type: String, required: true },
  type: { type: String, required: true, enum: ['login', 'score', 'flag', 'status_change'] },
  details: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Question = mongoose.model('Question', QuestionSchema);
const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

// ── Seed Data ──
const users = [
  { empId: 'EMP-001', name: 'Abdurrehman', username: 'abdurrehman', department: 'Security & Command', role: 'Admin', status: 'active', score: 9999, joinedAt: new Date('2025-01-01') },
  { empId: 'EMP-007', name: 'Oh Il-nam', username: 'ilnam007', department: 'VIP Lounge', role: 'VIP', status: 'active', score: 9000, joinedAt: new Date('2025-01-15') },
  { empId: 'EMP-456', name: 'Seong Gi-hun', username: 'gihun456', department: 'Operations', role: 'Player', status: 'active', score: 4560, joinedAt: new Date('2025-02-01') },
  { empId: 'EMP-067', name: 'Kang Sae-byeok', username: 'saebyeok067', department: 'Intelligence', role: 'VIP', status: 'active', score: 4100, joinedAt: new Date('2025-02-10') },
  { empId: 'EMP-218', name: 'Cho Sang-woo', username: 'sangwoo218', department: 'Engineering', role: 'Player', status: 'active', score: 3820, joinedAt: new Date('2025-02-15') },
  { empId: 'EMP-199', name: 'Ali Abdul', username: 'ali199', department: 'Operations', role: 'Player', status: 'active', score: 3000, joinedAt: new Date('2025-03-01') },
  { empId: 'EMP-101', name: 'Jang Deok-su', username: 'deoksu101', department: 'Security', role: 'VIP', status: 'active', score: 2500, joinedAt: new Date('2025-03-10') },
];

const logs = [
  { empId: 'EMP-001', action: 'Admin Authentication', type: 'login', details: 'Admin Abdurrehman authenticated via secure portal.' },
  { empId: 'EMP-456', action: 'Score Update', type: 'score', details: 'Seong Gi-hun completed Phishing Awareness module.' },
  { empId: 'EMP-067', action: 'Suspicious Pattern', type: 'flag', details: 'Kang Sae-byeok flagged for unusual login pattern.' },
  { empId: 'EMP-218', action: 'Account Suspended', type: 'status_change', details: 'Cho Sang-woo temporarily suspended for investigation.' },
  { empId: 'EMP-101', action: 'Force Login', type: 'login', details: 'Jang Deok-su forced entry through secondary auth.' },
];

// ── Main seed function ──
async function seed() {
  console.log('\n\x1b[36m╔══════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[36m║  CYBER-EMULATOR // DATABASE SEEDER   ║\x1b[0m');
  console.log('\x1b[36m╚══════════════════════════════════════╝\x1b[0m\n');

  try {
    // Connect
    console.log('\x1b[33m⟳ Connecting to MongoDB...\x1b[0m');
    await mongoose.connect(MONGODB_URI);
    console.log('\x1b[32m✓ Connected to MongoDB\x1b[0m\n');

    // Drop existing collections
    console.log('\x1b[33m⟳ Dropping existing collections...\x1b[0m');
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const col of collections) {
      await mongoose.connection.db.dropCollection(col.name);
      console.log(`  \x1b[90m  Dropped: ${col.name}\x1b[0m`);
    }
    console.log('\x1b[32m✓ Collections cleared\x1b[0m\n');

    // Seed Users
    console.log('\x1b[33m⟳ Seeding users...\x1b[0m');
    await User.insertMany(users);
    console.log(`\x1b[32m✓ Seeded ${users.length} users\x1b[0m`);

    // Seed Questions
    console.log('\x1b[33m⟳ Seeding questions...\x1b[0m');
    const questionsPath = path.resolve(__dirname, '..', 'src', 'data', 'questions.json');
    const questionsData = JSON.parse(fs.readFileSync(questionsPath, 'utf8'));
    const questions = questionsData.questions.map((q) => ({
      questionId: q.id,
      category: q.category,
      difficulty: q.difficulty,
      type: q.type === 'true_false' ? 'true_false' : q.type,
      question: q.question,
      options: q.options || [],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      items: q.items || [],
      correctOrder: q.correctOrder || [],
      imageUrl: q.imageUrl || '',
      pool: q.pool || 'Technical',
    }));
    await Question.insertMany(questions);
    console.log(`\x1b[32m✓ Seeded ${questions.length} questions\x1b[0m`);

    // Seed Activity Logs
    console.log('\x1b[33m⟳ Seeding activity logs...\x1b[0m');
    await ActivityLog.insertMany(logs);
    console.log(`\x1b[32m✓ Seeded ${logs.length} activity logs\x1b[0m`);

    // Summary
    console.log('\n\x1b[36m══════════════════════════════════════\x1b[0m');
    console.log('\x1b[32m✓ DATABASE SEEDING COMPLETE\x1b[0m');
    console.log(`\x1b[90m  Users:     ${users.length}`);
    console.log(`  Questions: ${questions.length}`);
    console.log(`  Logs:      ${logs.length}\x1b[0m`);
    console.log('\x1b[36m══════════════════════════════════════\x1b[0m\n');

  } catch (error) {
    console.error('\x1b[31m✗ Seeding failed:\x1b[0m', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\x1b[90mDisconnected from MongoDB.\x1b[0m');
  }
}

seed();
