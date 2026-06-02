import Stripe from 'stripe';
import crypto from 'crypto';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();
    if (!email) {
      return new Response(JSON.stringify({ error: 'E-mailová adresa je povinná.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stripeSecret = import.meta.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
    const agentMailApiKey = import.meta.env.AGENT_MAIL_API_KEY || process.env.AGENT_MAIL_API_KEY;

    if (!stripeSecret) {
      return new Response(JSON.stringify({ error: 'Stripe platobný systém nie je nakonfigurovaný.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stripe = new Stripe(stripeSecret);
    
    // Search completed Stripe Checkout Sessions for this email
    console.log(`Searching Stripe completed sessions for email: ${email}`);
    const searchResult = await stripe.checkout.sessions.search({
      query: `customer_details.email:'${email}' AND status:'complete'`,
      limit: 1
    });

    if (searchResult.data.length === 0) {
      // Return 200 to prevent email harvesting, but don't send any email
      console.log(`No completed checkout sessions found for email: ${email}`);
      return new Response(JSON.stringify({ success: true, message: 'Ak e-mail evidujeme, odkaz bol odoslaný.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const session = searchResult.data[0];
    const courseName = session.metadata?.course_name || 'Kurz: Automatizácia firiem pomocou AI agentov v roku 2026';
    const customerName = session.customer_details?.name || 'Vzdelávateľ';

    // Generate secure temporary signature (magic token)
    const expires = Date.now() + 15 * 60 * 1000; // valid for 15 minutes
    const payload = Buffer.from(JSON.stringify({ email, courseName, expires })).toString('base64');
    const signature = crypto.createHmac('sha256', stripeSecret).update(payload).digest('hex');
    const token = `${payload}.${signature}`;

    const origin = new URL(request.url).origin;
    const magicLink = `${origin}/api/verify-magic-link?token=${token}`;

    if (agentMailApiKey) {
      console.log(`Sending magic login link to ${email} via AgentMail...`);
      const agentMailResponse = await fetch('https://api.agentmail.to/v0/inboxes/ascentia@agentmail.to/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${agentMailApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: email,
          subject: 'Prihlasovací odkaz do Vášho kurzu Ascentia',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #fafafa;">
              <h2 style="color: #7c3aed;">Ahoj, ${customerName}!</h2>
              <p>Kliknutím na tlačidlo nižšie sa bezpečne prihlásite do svojho kurzu <strong>${courseName}</strong> a obnovíte prístup:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${magicLink}" style="background-color: #7c3aed; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 8px; display: inline-block;">Prihlásiť sa do kurzu</a>
              </div>
              <p style="font-size: 12px; color: #666; text-align: center;">Tento odkaz je platný nasledujúcich 15 minút.</p>
              <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
              <p style="font-size: 11px; color: #999;">Ak ste toto prihlásenie nevyžiadali, e-mail môžete ignorovať.</p>
            </div>
          `
        })
      });

      if (!agentMailResponse.ok) {
        const errText = await agentMailResponse.text();
        throw new Error(`AgentMail sending error: ${errText}`);
      }
      console.log(`Magic link successfully sent.`);
    } else {
      console.warn(`AGENT_MAIL_API_KEY is missing. Mock Link generated: ${magicLink}`);
    }

    return new Response(JSON.stringify({ success: true, message: 'Odkaz bol odoslaný.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Magic link request error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
