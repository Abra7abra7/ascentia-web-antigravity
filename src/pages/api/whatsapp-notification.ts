import Stripe from 'stripe';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const stripeSecret = import.meta.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
    const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET;

    const rawBody = await request.text();
    const stripeSignature = request.headers.get('stripe-signature') || '';

    let event: any;

    if (stripeSecret && !stripeSecret.startsWith('sk_test_51Pxxxx') && webhookSecret && !webhookSecret.startsWith('whsec_xxxx')) {
      const stripe = new Stripe(stripeSecret);
      event = stripe.webhooks.constructEvent(rawBody, stripeSignature, webhookSecret);
    } else {
      // Fallback for mock/test requests without real signature
      console.warn("Skipping real webhook signature verification. Parsing body directly.");
      event = JSON.parse(rawBody);
    }

    // Process checkout session completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerName = session.customer_details?.name || 'Vzdelávateľ';
      const customerEmail = session.customer_details?.email;
      const phoneNumber = session.customer_details?.phone || session.metadata?.phone;
      const courseName = session.metadata?.course_name || 'Automatizácia firiem pomocou AI agentov';

      const agentMailApiKey = import.meta.env.AGENT_MAIL_API_KEY || process.env.AGENT_MAIL_API_KEY;
      if (agentMailApiKey && customerEmail) {
        try {
          console.log(`Sending email notification to ${customerEmail} via AgentMail...`);
          const agentMailResponse = await fetch('https://api.agentmail.to/v0/inboxes/ascentia@agentmail.to/messages/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${agentMailApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              to: customerEmail,
              subject: `Prístup odomknutý: ${courseName}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #fafafa;">
                  <h2 style="color: #7c3aed;">Gratulujeme, ${customerName}!</h2>
                  <p>Vaša platba za kurz <strong>${courseName}</strong> prebehla úspešne a Váš prístup bol odomknutý.</p>
                  <p>Materiály ku kurzu a podrobnosti nájdete vo svojej členskej sekcii.</p>
                  <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                  <p style="font-size: 12px; color: #666;">Tento e-mail bol odoslaný automaticky platformou Ascentia.</p>
                </div>
              `
            })
          });
          if (agentMailResponse.ok) {
            console.log(`Email successfully sent to ${customerEmail} via AgentMail.`);
          } else {
            const errData = await agentMailResponse.json();
            console.error('Failed to send email via AgentMail:', errData);
          }
        } catch (mailErr: any) {
          console.error('Error during email sending via AgentMail:', mailErr.message);
        }
      } else {
        console.warn('AGENT_MAIL_API_KEY is not configured or customer email is missing. Skipping email notification.');
      }

      const whatsappToken = import.meta.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
      const whatsappPhoneId = import.meta.env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_PHONE_NUMBER_ID;
      const templateName = import.meta.env.WHATSAPP_TEMPLATE_NAME || process.env.WHATSAPP_TEMPLATE_NAME || 'ascentia_welcome_course';
      
      // Default to en_US for hello_world, else sk or custom env value
      const defaultLang = templateName === 'hello_world' ? 'en_US' : 'sk';
      const templateLang = import.meta.env.WHATSAPP_TEMPLATE_LANG || process.env.WHATSAPP_TEMPLATE_LANG || defaultLang;

      // hello_world template doesn't accept parameters
      const components = templateName === 'hello_world' ? [] : [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: customerName },
            { type: 'text', text: courseName }
          ]
        }
      ];

      const metaPayload = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'template',
        template: {
          name: templateName,
          language: { code: templateLang },
          components: components
        }
      };

      console.log('Processed Stripe checkout. Metadata details:', { customerName, phoneNumber, courseName });

      if (whatsappToken && !whatsappToken.startsWith('EAABxxx') && whatsappPhoneId && !whatsappPhoneId.startsWith('123456')) {
        // Real Meta API Call
        const url = `https://graph.facebook.com/v25.0/${whatsappPhoneId}/messages`;
        console.log(`Sending real WhatsApp template message via Meta API... Target: ${phoneNumber}`);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${whatsappToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(metaPayload)
        });

        const responseData = await response.json();
        console.log('Meta API response:', responseData);

        if (!response.ok) {
          throw new Error(`Meta API error: ${JSON.stringify(responseData)}`);
        }
      } else {
        console.warn('WHATSAPP credentials are not configured or are placeholders. Raw notification data logged below:');
        console.log(JSON.stringify(metaPayload, null, 2));
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
