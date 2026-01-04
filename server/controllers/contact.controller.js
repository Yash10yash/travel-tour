import { sendEmail } from '../utils/emailService.js';

// @desc    Send contact form message
// @route   POST /api/contact
// @access  Public
export const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Email to admin (yg745192@gmail.com)
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px; background: #f9f9f9; border: 1px solid #e0e0e0; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #555; margin-bottom: 5px; display: block; }
          .value { color: #333; padding: 10px; background: white; border-radius: 4px; border-left: 3px solid #ef4444; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Message</h1>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name:</span>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <div class="value">${email}</div>
            </div>
            <div class="field">
              <span class="label">Subject:</span>
              <div class="value">${subject}</div>
            </div>
            <div class="field">
              <span class="label">Message:</span>
              <div class="value" style="white-space: pre-wrap;">${message}</div>
            </div>
          </div>
          <div class="footer">
            <p>This message was sent from the Travel Tour website contact form.</p>
            <p>&copy; ${new Date().getFullYear()} Travel Tour. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to admin
    try {
      await sendEmail({
        email: process.env.ADMIN_EMAIL || 'yash971331@gmail.com',
        subject: `Contact Form: ${subject}`,
        html: adminEmailHtml
      });
      console.log('✅ Contact form email sent to admin successfully');
    } catch (emailError) {
      console.error('❌ Failed to send email to admin:', emailError.message);
      console.error('   Error details:', emailError);
      // Re-throw the error so the user knows it failed
      throw new Error(`Failed to send email: ${emailError.message}. Please check server email configuration.`);
    }

    // Confirmation email to user
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px; background: #f9f9f9; border: 1px solid #e0e0e0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Contacting Us!</h1>
          </div>
          <div class="content">
            <p>Hello ${name},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p><strong>Your Message:</strong></p>
            <p style="background: white; padding: 15px; border-radius: 4px; border-left: 3px solid #ef4444;">${message}</p>
            <p>Best regards,<br>Travel Tour Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Travel Tour. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send confirmation email to user
    try {
      await sendEmail({
        email: email,
        subject: 'We Received Your Message - Travel Tour',
        html: userEmailHtml
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email to user:', emailError);
      // Don't fail the request if confirmation email fails
    }

    res.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    next(error);
  }
};

