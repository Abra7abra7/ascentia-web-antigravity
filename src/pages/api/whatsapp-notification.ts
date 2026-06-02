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

      const amountTotal = session.amount_total ? (session.amount_total / 100).toFixed(2) : '249.00';
      const orderId = 'ASC-2026-' + session.id.slice(-5).toUpperCase();

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
              subject: `Potvrdenie objednávky ${orderId} a faktúra k prístupu: ${courseName}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #333333;">
                  <div style="text-align: center; border-bottom: 2px solid #7c3aed; padding-bottom: 15px; margin-bottom: 20px;">
                    <h1 style="color: #7c3aed; margin: 0; font-size: 24px;">ASCENTIA</h1>
                    <p style="margin: 5px 0 0 0; font-size: 12px; color: #666; font-weight: bold; uppercase; tracking-wider;">Potvrdenie objednávky a doklad o úhrade</p>
                  </div>

                  <h2 style="color: #10b981; font-size: 18px; margin-top: 0;">Gratulujeme, Váš prístup bol úspešne odomknutý!</h2>
                  <p>Ahoj <strong>${customerName}</strong>,</p>
                  <p>Vaša platba prebehla úspešne a získali ste doživotný prístup k online vzdelávaciemu kurzu: <strong>${courseName}</strong>.</p>
                  <p>Prístupové materiály a členská sekcia sú Vám k dispozícii po prihlásení na našom webe.</p>

                  <div style="background-color: #fafafa; border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 13px; line-height: 1.5;">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="vertical-align: top; width: 50%; padding-bottom: 10px;">
                          <strong>Dodávateľ:</strong><br />
                          ASCENTIA s. r. o.<br />
                          Klincová 37/B<br />
                          821 08 Bratislava<br />
                          IČO: 51 858 959<br />
                          DIČ: 2120815124<br />
                          <span style="font-size: 11px; color: #777;">Zapísaná v OR Okresného súdu Bratislava I, Oddiel: Sro, Vložka č.: 130325/B</span>
                        </td>
                        <td style="vertical-align: top; width: 50%; padding-bottom: 10px; text-align: right;">
                          <strong>Odberateľ:</strong><br />
                          ${customerName}<br />
                          ${customerEmail}<br />
                          ${phoneNumber ? `Tel: ${phoneNumber}` : ''}
                        </td>
                      </tr>
                      <tr style="border-top: 1px solid #e5e7eb;">
                        <td style="padding-top: 10px;">
                          <strong>Číslo objednávky:</strong> ${orderId}<br />
                          <strong>Dátum úhrady:</strong> ${new Date().toLocaleDateString('sk-SK')}<br />
                          <strong>Forma úhrady:</strong> Platobná karta (Stripe)
                        </td>
                        <td style="padding-top: 10px; text-align: right; vertical-align: bottom;">
                          <span style="font-size: 16px; font-weight: bold; color: #10b981;">Cena celkom: ${amountTotal} EUR</span><br />
                          <span style="font-size: 10px; color: #777;">Dodávateľ nie je platiteľom DPH.</span>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
                  <p style="font-size: 11px; color: #777; text-align: center; margin: 0;">
                    Tento e-mail slúži ako potvrdenie o uzatvorení zmluvy a doklad o zaplatení. V prípade otázok nás neváhajte kontaktovať.
                  </p>
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
