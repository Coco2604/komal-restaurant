require('dotenv').config();
const mongoose = require('mongoose');

async function updateTax() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await mongoose.connection.collection('settings').updateMany({}, { $set: { taxRate: 0 } });
    console.log('Successfully updated taxRate to 0 in live DB!');
  } catch (err) {
    console.log('Error:', err.message);
  } finally {
    process.exit(0);
  }
}
updateTax();
