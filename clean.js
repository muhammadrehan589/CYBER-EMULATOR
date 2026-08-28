require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in .env.local');
  }

  await mongoose.connect(uri);
  const User = mongoose.model('User', new mongoose.Schema({ empId: String }));
  const result = await User.deleteMany({ empId: { $ne: 'EMP-4961' } });
  console.log('Deleted:', result.deletedCount);
  process.exit(0);
}
run().catch(console.error);
