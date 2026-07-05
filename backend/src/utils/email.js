const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 2525,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"KOMAL Restaurant" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error('Email send error:', error.message);
  }
};

exports.otpEmail = (otp, user) => ({
  subject: `Your Login Code: ${otp} - KOMAL Restaurant`,
  html: `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border-radius:12px;overflow:hidden;border:1px solid #eee">
      <div style="background:#0D4A4A;padding:30px;text-align:center">
        <h1 style="color:#D4A017;margin:0;font-size:28px">🍃 KOMAL Restaurant</h1>
        <p style="color:#a0d5d0;margin:8px 0 0">Pure Vegetarian • Bhatapara, CG</p>
      </div>
      <div style="padding:30px;background:#fff;text-align:center">
        <h2 style="color:#0D4A4A">Hi ${user.name || 'there'}!</h2>
        <p style="color:#555;font-size:16px">Here is your verification code to log in:</p>
        <div style="background:#f0faf9;border-radius:8px;padding:20px;margin:20px auto;max-width:300px">
          <p style="margin:0;font-size:32px;letter-spacing:5px;font-weight:bold;color:#0D4A4A">${otp}</p>
        </div>
        <p style="color:#888;font-size:14px">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        <br />
        <p style="color:#888;font-size:12px">KOMAL Juice Restaurant, Nayapara Ward, Bhatapara, CG 493118</p>
      </div>
    </div>
  `,
});

exports.orderConfirmationEmail = (order, user) => ({
  subject: `Order Confirmed! #${order.orderId} - KOMAL Restaurant`,
  html: `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border-radius:12px;overflow:hidden;border:1px solid #eee">
      <div style="background:#0D4A4A;padding:30px;text-align:center">
        <h1 style="color:#D4A017;margin:0;font-size:28px">🍃 KOMAL Restaurant</h1>
        <p style="color:#a0d5d0;margin:8px 0 0">Pure Vegetarian • Bhatapara, CG</p>
      </div>
      <div style="padding:30px;background:#fff">
        <h2 style="color:#0D4A4A">Hi ${user.name}! 🎉 Order Confirmed!</h2>
        <p style="color:#555">Your order has been placed successfully and our team will start preparing it shortly.</p>
        <div style="background:#f0faf9;border-left:4px solid #0D4A4A;border-radius:4px;padding:20px;margin:20px 0">
          <p style="margin:5px 0"><strong>Order ID:</strong> #${order.orderId}</p>
          <p style="margin:5px 0"><strong>Items:</strong> ${order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
          <p style="margin:5px 0"><strong>Subtotal:</strong> ₹${order.subtotal}</p>
          <p style="margin:5px 0"><strong>Delivery:</strong> ₹${order.deliveryCharge}</p>

          <p style="margin:5px 0;font-size:18px"><strong>Total: ₹${order.total}</strong></p>
          <p style="margin:5px 0"><strong>Payment:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</p>
          <p style="margin:5px 0"><strong>Estimated Delivery:</strong> ~${order.estimatedDeliveryTime} minutes</p>
        </div>
        <p style="color:#555">For any queries, call us at <a href="tel:9827483385" style="color:#0D4A4A">9827483385</a></p>
        <p style="color:#888;font-size:12px">KOMAL Juice Restaurant, Nayapara Ward, Bhatapara, CG 493118</p>
      </div>
    </div>
  `,
});

exports.restaurantOrderNotificationEmail = (order, user) => ({
  subject: `🚨 NEW ORDER #${order.orderId} - ₹${order.total}`,
  html: `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #ccc;padding:20px;border-radius:8px">
      <h2 style="color:#d32f2f;margin-top:0">🚨 New Order Received!</h2>
      <p><strong>Customer:</strong> ${user.name}</p>
      <p><strong>Phone Number:</strong> <a href="tel:${user.phone}" style="color:#0D4A4A;font-weight:bold">${user.phone}</a> (Call to verify)</p>
      <p><strong>Order ID:</strong> #${order.orderId}</p>
      <p><strong>Total Amount:</strong> ₹${order.total}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online'}</p>
      <hr/>
      <h3>Delivery Details</h3>
      <p><strong>Address:</strong> ${order.deliveryAddress?.fullAddress}, ${order.deliveryAddress?.city}</p>
      <p><strong>Instructions:</strong> ${order.specialInstructions || 'None'}</p>
      ${order.deliveryAddress?.lat ? `<p><a href="https://maps.google.com/?q=${order.deliveryAddress.lat},${order.deliveryAddress.lng}" target="_blank">View on Google Maps</a></p>` : ''}
      <hr/>
      <h3>Order Items</h3>
      <ul>
        ${order.items.map(i => `<li style="margin-bottom:8px"><strong>${i.quantity}x</strong> ${i.name} - ₹${i.price * i.quantity}</li>`).join('')}
      </ul>
      <hr/>
      <p style="font-size:12px;color:#888">Log in to the Admin Dashboard to accept or manage this order.</p>
    </div>
  `,
});
