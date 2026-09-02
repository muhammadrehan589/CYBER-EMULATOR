/**
 * Script to remove dummy seeded users from MongoDB.
 * Keeps only real sign-up accounts.
 * Run: node scripts/remove_dummy_users.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex > 0) {
        const key = trimmed.substring(0, eqIndex).trim();
        let value = trimmed.substring(eqIndex + 1).trim();
        // Strip surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        process.env[key] = value;
      }
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}

// These are the EMP IDs from the seed script that need to be removed
const DUMMY_EMP_IDS = ['EMP-001', 'EMP-007', 'EMP-456', 'EMP-067', 'EMP-218', 'EMP-199', 'EMP-101'];

async function removeDummyUsers() {
  console.log('\n\x1b[36m╔══════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[36m║   REMOVING DUMMY SEED USERS           ║\x1b[0m');
  console.log('\x1b[36m╚══════════════════════════════════════╝\x1b[0m\n');

  try {
    console.log('\x1b[33m⟳ Connecting to MongoDB...\x1b[0m');
    await mongoose.connect(MONGODB_URI);
    console.log('\x1b[32m✓ Connected\x1b[0m\n');

    const db = mongoose.connection.db;

    // Show what we're about to delete
    const toDelete = await db.collection('users').find({ empId: { $in: DUMMY_EMP_IDS } }).toArray();
    console.log(`\x1b[33m⟳ Found ${toDelete.length} dummy users to remove:\x1b[0m`);
    toDelete.forEach(u => console.log(`  \x1b[90m- ${u.name} (${u.empId} / @${u.username})\x1b[0m`));
    console.log('');

    // Delete them
    const result = await db.collection('users').deleteMany({ empId: { $in: DUMMY_EMP_IDS } });
    console.log(`\x1b[32m✓ Deleted ${result.deletedCount} dummy users\x1b[0m\n`);

    // Show what remains
    const remaining = await db.collection('users').find({}).toArray();
    console.log(`\x1b[36m Remaining real users (${remaining.length}):\x1b[0m`);
    remaining.forEach(u => console.log(`  \x1b[32m✓ ${u.name} (${u.empId} / @${u.username})\x1b[0m`));

    if (remaining.length === 0) {
      console.log('  \x1b[90m(No users in database — leaderboard will be empty until new sign-ups)\x1b[0m');
    }

    console.log('\n\x1b[32m✓ Done.\x1b[0m');
  } catch (error) {
    console.error('\x1b[31m✗ Error:\x1b[0m', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

removeDummyUsers();
