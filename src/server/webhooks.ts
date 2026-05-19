import { emailSender } from "wasp/server/email";
import { type PaymongoWebhook } from "wasp/server/api";
import crypto from "crypto";

export const paymongoWebhook: PaymongoWebhook = async (request, response, context) => {
  console.log('\n\n <<<< custom webhook route >>>> \n\n');

  // Verify PayMongo Signature
  const signatureHeader = request.headers['paymongo-signature'] as string;
  const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET;

  if (webhookSecret && signatureHeader) {
    const parts = signatureHeader.split(',');
    let timestamp = '';
    let testSignature = '';
    let liveSignature = '';

    parts.forEach(part => {
      const [prefix, value] = part.split('=');
      if (prefix === 't') timestamp = value;
      if (prefix === 'te') testSignature = value;
      if (prefix === 'li') liveSignature = value;
    });

    const signatureToMatch = liveSignature || testSignature;
    // Wasp API might not have rawBody by default, we fallback to stringified body
    const rawBody = (request as any).rawBody || JSON.stringify(request.body);
    const signaturePayload = `${timestamp}.${rawBody}`;
    
    const computedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(signaturePayload)
      .digest('hex');

    // Due to stringify, if whitespace is different from original payload, this could fail.
    // If it fails frequently, Wasp middleware for rawBody parsing needs to be configured.
    if (computedSignature !== signatureToMatch) {
      console.error('Invalid Webhook Signature');
      return response.status(400).send('Invalid signature');
    }
  } else if (webhookSecret && !signatureHeader) {
    console.warn('Webhook secret is set but no signature header found.');
  }

  let event = request.body;
  let userPaymongoId: string | null = null;
  
  try {
    const eventType = event?.data?.attributes?.type;
    console.log('Webhook event type:', eventType);

    if (eventType === 'checkout_session.payment.paid') {
      const session = event.data.attributes.data;
      userPaymongoId = session.id as string; // We saved this in paymongoId field
      const description = session.attributes?.description || '';
      const line_items = session.attributes?.line_items || [];
      const planName = line_items.length > 0 ? line_items[0].name : '';

      console.log('checkout_session.payment.paid', eventType, '\n\n', session);

      if (planName === 'The Tester') {
        console.log('The Tester plan purchased');
        await context.entities.User.updateMany({
          where: { paymongoId: userPaymongoId },
          data: {
            hasPaid: true,
            datePaid: new Date(),
            credits: { increment: 5 },
          },
        });
      } else if (planName === 'The Job Hunter') {
        console.log('The Job Hunter plan purchased');
        await context.entities.User.updateMany({
          where: { paymongoId: userPaymongoId },
          data: {
            hasPaid: true,
            datePaid: new Date(),
            credits: { increment: 20 },
          },
        });
      } else if (planName === 'The Aggressive Freelancer') {
        console.log('The Aggressive Freelancer plan purchased');
        await context.entities.User.updateMany({
          where: { paymongoId: userPaymongoId },
          data: {
            hasPaid: true,
            datePaid: new Date(),
            credits: { increment: 45 },
          },
        });
      }
    } else {
      console.log(`Unhandled event type ${eventType}`);
    }
  } catch (error) {
    console.log('error', error);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({ received: true });
};
