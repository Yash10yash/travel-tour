import nodemailer from 'nodemailer';

// Create transporter with better error handling
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email credentials not configured');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

const transporter = createTransporter();

export const sendEmail = async (options) => {
  try {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  Email not configured. Skipping email send.');
      console.warn('   Set EMAIL_USER, EMAIL_PASS, EMAIL_HOST, and EMAIL_PORT in .env file');
      return { messageId: 'skipped' };
    }

    if (!transporter) {
      throw new Error('Email transporter not initialized. Check your email configuration.');
    }

    const message = {
      from: `${process.env.EMAIL_FROM || 'Travel Tour'} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(message);
    console.log('✅ Email sent successfully to:', options.email);
    console.log('   Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      console.error('   Authentication failed. This usually means:');
      console.error('   1. Your Gmail password is incorrect, OR');
      console.error('   2. You need to use a Gmail App Password instead of your regular password');
      console.error('   Get App Password: https://myaccount.google.com/apppasswords');
    } else if (error.code === 'ECONNECTION') {
      console.error('   Connection failed. Check your internet connection and email settings.');
    } else {
      console.error('   Full error:', error);
    }
    
    throw error;
  }
};

export const sendBookingConfirmation = async (user, booking, tour) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Booking Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hello ${user.name},</h2>
          <p>Your booking has been confirmed successfully!</p>
          <h3>Booking Details:</h3>
          <p><strong>Tour:</strong> ${tour.title}</p>
          <p><strong>Travel Date:</strong> ${new Date(booking.travelDate).toLocaleDateString()}</p>
          <p><strong>Travelers:</strong> ${booking.numberOfTravelers.adults} Adult(s), ${booking.numberOfTravelers.children} Child(ren)</p>
          <p><strong>Total Amount:</strong> ₹${booking.totalAmount}</p>
          <p><strong>Booking ID:</strong> ${booking._id}</p>
          <p>Thank you for choosing us!</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Travel Tour. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    email: user.email,
    subject: 'Booking Confirmation - Travel Tour',
    html
  });
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <a href="${resetUrl}" class="button">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    email: user.email,
    subject: 'Password Reset Request - Travel Tour',
    html
  });
};

