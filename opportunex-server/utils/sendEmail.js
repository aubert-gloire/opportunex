import nodemailer from 'nodemailer';

// ---------------------------------------------------------------------------
// Transporter — Brevo (formerly Sendinblue) SMTP
// Free tier: 300 emails / day, no custom domain required.
// Setup: brevo.com → Account → SMTP & API → Generate SMTP key
// ---------------------------------------------------------------------------
const createTransporter = () => {
  if (!process.env.BREVO_SMTP_KEY || !process.env.BREVO_SMTP_USER) {
    return null; // credentials not configured — fall back to console mock
  }
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,   // your Brevo account email
      pass: process.env.BREVO_SMTP_KEY,    // SMTP key from Brevo dashboard
    },
  });
};

// ---------------------------------------------------------------------------
// Base layout wrapper
// ---------------------------------------------------------------------------
const layout = (bodyHtml) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OpportuneX</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:#1E3A5F;padding:28px 40px;">
              <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.45);font-weight:500;">
                OpportuneX
              </p>
              <p style="margin:4px 0 0;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.25);">
                Rwanda's Career Platform
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#ffffff;padding:40px 40px 32px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e7e5e4;">
              <p style="margin:0;font-size:11px;color:#a8a29e;line-height:1.6;">
                You're receiving this because you have an account on OpportuneX.<br />
                © ${new Date().getFullYear()} OpportuneX. Kigali, Rwanda.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ---------------------------------------------------------------------------
// Shared style tokens
// ---------------------------------------------------------------------------
const label  = 'font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:#a8a29e;font-weight:500;';
const h1     = 'margin:0 0 24px;font-size:26px;font-weight:300;color:#1c1917;letter-spacing:-0.022em;line-height:1.2;';
const body   = 'margin:0 0 16px;font-size:14px;color:#57534e;line-height:1.7;font-weight:300;';
const divider= 'border:none;border-top:1px solid #f5f5f4;margin:28px 0;';
const pill   = (bg, fg) =>
  `display:inline-block;padding:4px 12px;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;font-weight:500;background:${bg};color:${fg};`;

// ---------------------------------------------------------------------------
// Email templates
// ---------------------------------------------------------------------------
export const emailTemplates = {

  welcome: (name, role) => layout(`
    <p style="${label}">Welcome</p>
    <h1 style="${h1}">Hello, ${name}.</h1>
    <p style="${body}">
      Your ${role === 'employer' ? 'employer' : ''} account on <strong>OpportuneX</strong> is now active.
      Rwanda's premier platform for connecting ambitious graduates with quality employers is ready for you.
    </p>
    <hr style="${divider}" />
    <p style="${body}">
      ${role === 'youth'
        ? 'Complete your profile, verify your skills, and start applying to curated opportunities today.'
        : 'Post your first job listing, search verified talent, and build your pipeline.'}
    </p>
    <p style="margin:28px 0 0;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}"
         style="display:inline-block;padding:12px 28px;background:#1E3A5F;color:#ffffff;text-decoration:none;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:500;">
        Go to Dashboard
      </a>
    </p>
  `),

  applicationReceived: (applicantName, jobTitle, companyName) => layout(`
    <p style="${label}">Application Submitted</p>
    <h1 style="${h1}">Application<br /><em style="font-style:italic;color:#1E3A5F;">received.</em></h1>
    <p style="${body}">Hi ${applicantName},</p>
    <p style="${body}">
      Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been successfully submitted.
      The employer will review your profile and reach out if your background is a strong match.
    </p>
    <hr style="${divider}" />
    <table cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:4px 0;">
          <span style="${label}">Position</span><br />
          <span style="font-size:14px;color:#1c1917;font-weight:300;">${jobTitle}</span>
        </td>
      </tr>
      <tr><td style="padding:8px 0;"></td></tr>
      <tr>
        <td style="padding:4px 0;">
          <span style="${label}">Company</span><br />
          <span style="font-size:14px;color:#1c1917;font-weight:300;">${companyName}</span>
        </td>
      </tr>
    </table>
    <p style="margin:28px 0 0;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/youth/applications"
         style="display:inline-block;padding:12px 28px;background:#1E3A5F;color:#ffffff;text-decoration:none;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:500;">
        View My Applications
      </a>
    </p>
  `),

  applicationStatusUpdate: (applicantName, jobTitle, status, companyName) => {
    const statusConfig = {
      shortlisted: { bg: '#dbeafe', fg: '#1d4ed8', msg: 'Congratulations — you have been shortlisted for this role. The employer may reach out to schedule an interview.' },
      interviewed: { bg: '#ede9fe', fg: '#6d28d9', msg: 'Your interview has been noted. The employer will be in touch with next steps.' },
      accepted:    { bg: '#dcfce7', fg: '#15803d', msg: 'Congratulations! You have been accepted for this position. The employer will contact you directly to discuss onboarding.' },
      rejected:    { bg: '#fee2e2', fg: '#b91c1c', msg: 'Thank you for applying. Unfortunately the employer has moved forward with other candidates for this role. Keep applying — new opportunities are posted daily.' },
      reviewed:    { bg: '#fef9c3', fg: '#a16207', msg: 'Your application has been reviewed by the employer and is under consideration.' },
    };
    const cfg = statusConfig[status] || { bg: '#f5f5f4', fg: '#57534e', msg: 'Your application status has been updated. Log in to view full details.' };

    return layout(`
      <p style="${label}">Application Update</p>
      <h1 style="${h1}">Status<br /><em style="font-style:italic;color:#1E3A5F;">update.</em></h1>
      <p style="${body}">Hi ${applicantName},</p>
      <p style="${body}">Your application for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has a new status:</p>
      <p style="margin:20px 0;">
        <span style="${pill(cfg.bg, cfg.fg)}">${status.toUpperCase()}</span>
      </p>
      <p style="${body}">${cfg.msg}</p>
      <p style="margin:28px 0 0;">
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/youth/applications"
           style="display:inline-block;padding:12px 28px;background:#1E3A5F;color:#ffffff;text-decoration:none;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:500;">
          View Application
        </a>
      </p>
    `);
  },

  mentorshipRequest: (mentorName, menteeName, topic, scheduledAt) => layout(`
    <p style="${label}">Mentorship</p>
    <h1 style="${h1}">New session<br /><em style="font-style:italic;color:#1E3A5F;">requested.</em></h1>
    <p style="${body}">Hi ${mentorName},</p>
    <p style="${body}">
      <strong>${menteeName}</strong> has requested a mentorship session with you on OpportuneX.
    </p>
    <hr style="${divider}" />
    <table cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:4px 0;">
          <span style="${label}">Topic</span><br />
          <span style="font-size:14px;color:#1c1917;font-weight:300;">${topic}</span>
        </td>
      </tr>
      <tr><td style="padding:8px 0;"></td></tr>
      <tr>
        <td style="padding:4px 0;">
          <span style="${label}">Requested Time</span><br />
          <span style="font-size:14px;color:#1c1917;font-weight:300;">${scheduledAt || 'To be confirmed'}</span>
        </td>
      </tr>
    </table>
    <p style="${body};margin-top:24px;">
      Log in to confirm or reschedule the session.
    </p>
    <p style="margin:28px 0 0;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/youth/mentorship"
         style="display:inline-block;padding:12px 28px;background:#1E3A5F;color:#ffffff;text-decoration:none;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:500;">
        Review Request
      </a>
    </p>
  `),

  resetPassword: (name, resetUrl) => layout(`
    <p style="${label}">Security</p>
    <h1 style="${h1}">Password<br /><em style="font-style:italic;color:#1E3A5F;">reset.</em></h1>
    <p style="${body}">Hi ${name},</p>
    <p style="${body}">
      We received a request to reset your OpportuneX password. Click below to set a new one.
      This link expires in <strong>10 minutes</strong>.
    </p>
    <p style="margin:28px 0;">
      <a href="${resetUrl}"
         style="display:inline-block;padding:12px 28px;background:#1E3A5F;color:#ffffff;text-decoration:none;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:500;">
        Reset Password
      </a>
    </p>
    <hr style="${divider}" />
    <p style="margin:0;font-size:12px;color:#a8a29e;line-height:1.6;">
      If you didn't request a password reset, you can safely ignore this email.
      Your password will not change until you click the link above.
    </p>
  `),

  courseComplete: (name, courseTitle, certificateId) => layout(`
    <p style="${label}">Certificate Issued</p>
    <h1 style="${h1}">Course<br /><em style="font-style:italic;color:#1E3A5F;">completed.</em></h1>
    <p style="${body}">Hi ${name},</p>
    <p style="${body}">
      Congratulations — you have successfully completed <strong>${courseTitle}</strong> on OpportuneX.
      Your certificate has been issued and is ready to download.
    </p>
    <hr style="${divider}" />
    <table cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:4px 0;">
          <span style="${label}">Certificate ID</span><br />
          <span style="font-size:13px;color:#1c1917;font-weight:400;letter-spacing:0.04em;font-family:monospace;">${certificateId}</span>
        </td>
      </tr>
    </table>
    <p style="margin:28px 0 0;">
      <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/youth/my-courses"
         style="display:inline-block;padding:12px 28px;background:#1E3A5F;color:#ffffff;text-decoration:none;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;font-weight:500;">
        Download Certificate
      </a>
    </p>
  `),

};

// ---------------------------------------------------------------------------
// sendEmail — uses Brevo SMTP, falls back to console log if unconfigured
// ---------------------------------------------------------------------------
export const sendEmail = async ({ email, subject, template, html }) => {
  const finalHtml = html || template || '';

  const transporter = createTransporter();

  if (!transporter) {
    // Dev fallback — log instead of sending
    console.log(`\n[Email] ──────────────────────────────────`);
    console.log(`  To      : ${email}`);
    console.log(`  Subject : ${subject}`);
    console.log(`  (Brevo SMTP not configured — set BREVO_SMTP_USER and BREVO_SMTP_KEY in .env)`);
    console.log(`──────────────────────────────────────────\n`);
    return { success: true, messageId: `dev-${Date.now()}` };
  }

  const info = await transporter.sendMail({
    from: `"OpportuneX" <${process.env.BREVO_SMTP_USER}>`,
    to: email,
    subject,
    html: finalHtml,
  });

  console.log(`[Email sent] ${email} — ${subject} (${info.messageId})`);
  return { success: true, messageId: info.messageId };
};
