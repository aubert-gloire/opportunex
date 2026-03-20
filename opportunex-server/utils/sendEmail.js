import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `OpportuneX <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      html: options.html || options.message,
      text: options.text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
export const emailTemplates = {
  welcome: (name) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1E3A5F;">Welcome to OpportuneX!</h2>
      <p>Hi ${name},</p>
      <p>Thank you for joining OpportuneX, Rwanda's premier platform connecting youth with employment opportunities.</p>
      <p>We're excited to have you on board and look forward to helping you achieve your career goals.</p>
      <p>Best regards,<br>The OpportuneX Team</p>
    </div>
  `,

  applicationReceived: (jobTitle, applicantName) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1E3A5F;">Application Received</h2>
      <p>Dear ${applicantName},</p>
      <p>Your application for <strong>${jobTitle}</strong> has been successfully submitted.</p>
      <p>We will review your application and get back to you soon.</p>
      <p>Best of luck!</p>
      <p>Best regards,<br>The OpportuneX Team</p>
    </div>
  `,

  applicationStatusUpdate: (jobTitle, status) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1E3A5F;">Application Status Update</h2>
      <p>Your application for <strong>${jobTitle}</strong> has been updated.</p>
      <p>Status: <strong style="color: #F59E0B;">${status.toUpperCase()}</strong></p>
      <p>Login to your OpportuneX account for more details.</p>
      <p>Best regards,<br>The OpportuneX Team</p>
    </div>
  `,

  mentorshipRequest: (menteeName, topic, dateTime) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1E3A5F;">New Mentorship Request</h2>
      <p>${menteeName} has requested a mentorship session with you.</p>
      <p><strong>Topic:</strong> ${topic}</p>
      <p><strong>Scheduled:</strong> ${dateTime}</p>
      <p>Please login to confirm or reschedule the session.</p>
      <p>Best regards,<br>The OpportuneX Team</p>
    </div>
  `,

  resetPassword: (name, resetUrl) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1E3A5F;">Password Reset Request</h2>
      <p>Hi ${name},</p>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <p><a href="${resetUrl}" style="background-color: #F59E0B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
      <p>This link will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <p>Best regards,<br>The OpportuneX Team</p>
    </div>
  `,
};
