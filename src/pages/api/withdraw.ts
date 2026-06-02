import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, orderId } = await request.json();
    if (!email || !orderId) {
      return new Response(JSON.stringify({ error: 'E-mail aj číslo objednávky sú povinné.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const agentMailApiKey = import.meta.env.AGENT_MAIL_API_KEY || process.env.AGENT_MAIL_API_KEY;

    if (agentMailApiKey) {
      console.log(`Sending withdrawal notifications for order ${orderId}...`);
      
      // 1. Notify Customer
      await fetch('https://api.agentmail.to/v0/inboxes/ascentia@agentmail.to/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${agentMailApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: email,
          subject: `Potvrdenie prijatia žiadosti o odstúpenie od zmluvy - ${orderId}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #fafafa; color: #333333;">
              <h2 style="color: #dc2626; margin-top: 0;">Žiadosť o odstúpenie od zmluvy</h2>
              <p>Dobrý deň,</p>
              <p>Potvrdzujeme prijatie Vašej žiadosti o odstúpenie od zmluvy pre objednávku číslo <strong>${orderId}</strong>.</p>
              <p>Naše finančné oddelenie požiadavku spracuje. Finančné prostriedky Vám budú vrátené na kartu, z ktorej bola vykonaná platba, v lehote do 14 dní.</p>
              <p>Zároveň berte na vedomie, že prístup k online kurzom Ascentia pre e-mail <strong>${email}</strong> bol deaktivovaný.</p>
              <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
              <p style="font-size: 11px; color: #777; text-align: center; margin: 0;">
                Prevádzkovateľ: ASCENTIA s. r. o., Klincová 37/B, Bratislava, IČO: 51 858 959
              </p>
            </div>
          `
        })
      });

      // 2. Notify Admin
      await fetch('https://api.agentmail.to/v0/inboxes/ascentia@agentmail.to/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${agentMailApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: 'ascentia@agentmail.to',
          subject: `[ADMIN] Žiadosť o odstúpenie od zmluvy - ${orderId}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff; color: #333333;">
              <h2 style="color: #dc2626; margin-top: 0;">Nové odstúpenie od zmluvy online</h2>
              <p>Zákazník požiadal o odstúpenie od zmluvy prostredníctvom webového formulára.</p>
              <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #fafafa; border: 1px solid #eee; padding: 10px;">
                <tr>
                  <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Číslo objednávky:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">E-mail zákazníka:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Dátum požiadavky:</td>
                  <td style="padding: 8px;">${new Date().toLocaleString('sk-SK')}</td>
                </tr>
              </table>
              <p style="font-size: 13px; color: #555;">
                Skontrolujte platbu v Stripe dashboarde pre daný e-mail a vykonajte refundáciu (Refund).
              </p>
            </div>
          `
        })
      });
      
      console.log(`Withdrawal emails successfully queued/sent.`);
    }

    // Revoke local session cookie
    cookies.delete('ascentia_purchased_course', { path: '/' });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Withdrawal error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
