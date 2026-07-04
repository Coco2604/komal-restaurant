require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const mongoose = require('mongoose');

async function dropIndex() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await mongoose.connection.collection('users').dropIndex('phone_1');
    console.log('Successfully dropped unique phone index!');
  } catch (err) {
    console.log('Index may not exist or error:', err.message);
  } finally {
    process.exit(0);
  }
}
dropIndex();
