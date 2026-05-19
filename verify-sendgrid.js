import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

// Read your existing .env.server file
dotenv.config({ path: '.env.server' });

const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey) {
  console.error('❌ Error: SENDGRID_API_KEY could not be read from .env.server');
  process.exit(1);
}

// Authenticate with SendGrid
sgMail.setApiKey(apiKey);

// Onboarding verification payload
const msg = {
  to: 'attetechindustry@coverletter.work', // 👈 Change this to your personal Gmail or Zoho email to see it land
  from: 'hello@coverletter.work',         // 👈 This MUST be an email from your verified domain
  subject: 'Onboarding Verification Email',
  text: 'Verifying the SendGrid API integration for coverletter.work.',
  html: '<strong>Verifying the SendGrid API integration for coverletter.work.</strong>',
};

console.log('📡 Sending data payload to SendGrid infrastructure...');

sgMail
  .send(msg)
  .then(() => {
    console.log('🚀 Success! The message bypassed local checks and hit SendGrid.');
    console.log('👉 You can now go back to your browser and click "Next" or "Verify Integration".');
  })
  .catch((error) => {
    console.error('❌ Integration Error:');
    if (error.response) {
      console.error(JSON.stringify(error.response.body, null, 2));
    } else {
      console.error(error.message);
    }
  });