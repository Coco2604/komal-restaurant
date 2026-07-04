let twilio;
try {
  twilio = require('twilio');
} catch (e) {
  twilio = null;
}

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendSMSOTP = async (phone, otp) => {
  try {
    if (!twilio || !process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID.includes('xxxx')) {
      console.log(`[DEV] OTP for ${phone}: ${otp}`);
      return true;
    }
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `Your KOMAL Restaurant OTP is: ${otp}. Valid for 10 minutes. Do not share this with anyone.`,
      from: process.env.TWILIO_PHONE,
      to: phone.startsWith('+') ? phone : `+91${phone}`,
    });
    return true;
  } catch (error) {
    console.error('SMS OTP error:', error.message);
    return false;
  }
};

module.exports = { generateOTP, sendSMSOTP };
