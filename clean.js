const mongoose = require('mongoose');
async function run() {
  await mongoose.connect('mongodb+srv://muhammadrehann589_db_user:Rehan371868@cluster0.wqfnxzt.mongodb.net/cyber_emulator?appName=Cluster0');
  const User = mongoose.model('User', new mongoose.Schema({ empId: String }));
  const result = await User.deleteMany({ empId: { $ne: 'EMP-4961' } });
  console.log('Deleted:', result.deletedCount);
  process.exit(0);
}
run().catch(console.error);
