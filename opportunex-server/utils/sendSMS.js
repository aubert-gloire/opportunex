import AfricasTalking from 'africastalking';

// ---------------------------------------------------------------------------
// Africa's Talking SMS — Free sandbox for development, live for Rwanda (+250)
// Setup: africastalking.com → Register → My Apps → Create App → Get API Key
// Sandbox: AT_USERNAME=sandbox, AT_API_KEY=<key from sandbox dashboard>
// ---------------------------------------------------------------------------

let smsClient = null;

const getSMSClient = () => {
  if (!process.env.AT_API_KEY || !process.env.AT_USERNAME) return null;
  if (!smsClient) {
    const at = AfricasTalking({
      apiKey: process.env.AT_API_KEY,
      username: process.env.AT_USERNAME,
    });
    smsClient = at.SMS;
  }
  return smsClient;
};

export const sendSMS = async (phone, message) => {
  if (!phone) return { success: false, reason: 'No phone number provided' };

  const sms = getSMSClient();

  if (!sms) {
    console.log(`\n[SMS] ──────────────────────────────────`);
    console.log(`  To     : ${phone}`);
    console.log(`  Message: ${message}`);
    console.log(`  (Africa's Talking not configured — set AT_API_KEY and AT_USERNAME in .env)`);
    console.log(`──────────────────────────────────────────\n`);
    return { success: true, messageId: `dev-${Date.now()}` };
  }

  try {
    const result = await sms.send({
      to: [phone],
      message,
      from: 'OpportuneX',
    });
    console.log(`[SMS sent] ${phone}`);
    return { success: true, result };
  } catch (error) {
    console.error(`[SMS error] ${phone} — ${error.message}`);
    return { success: false, error: error.message };
  }
};

// ---------------------------------------------------------------------------
// SMS Templates
// ---------------------------------------------------------------------------
export const smsTemplates = {
  applicationStatusUpdate: (jobTitle, status) =>
    `OpportuneX: Your application for "${jobTitle}" status: ${status.toUpperCase()}. Log in to view details. opportunex.rw`,

  mentorshipConfirmed: (mentorName, topic, scheduledAt) =>
    `OpportuneX: Mentorship session with ${mentorName} on "${topic}" confirmed for ${new Date(scheduledAt).toLocaleString('en-RW')}. opportunex.rw`,

  applicationReceived: (jobTitle, companyName) =>
    `OpportuneX: Application submitted for ${jobTitle} at ${companyName}. We'll notify you of any updates. opportunex.rw`,
};
