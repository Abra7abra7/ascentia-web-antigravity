import Stripe from 'stripe';
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { courseName, price } = await request.json();
    const stripeSecret = import.meta.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;

    // Fallback if the user has placeholder key
    if (!stripeSecret || stripeSecret.startsWith('sk_test_51Pxxxxxxxxxxxxxxxx')) {
      console.warn("STRIPE_SECRET_KEY is not configured. Falling back to Mock Session redirect.");
      
      const mockSuccessUrl = `${new URL(request.url).origin}/nakupe-uspesny?course=${encodeURIComponent(courseName)}`;
      return new Response(JSON.stringify({ url: mockSuccessUrl, isMock: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stripe = new Stripe(stripeSecret);
    const origin = new URL(request.url).origin;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      phone_number_collection: {
        enabled: true,
      },
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: courseName,
              description: 'Prémiové vzdelávanie Ascentia s doživotným prístupom a certifikátom.',
            },
            unit_amount: price * 100, // price in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      invoice_creation: {
        enabled: true,
      },
      custom_fields: [
        {
          key: 'ico',
          label: {
            type: 'custom',
            custom: 'IČO (nepovinné - len pre firmy)',
          },
          type: 'text',
          optional: true,
        },
        {
          key: 'dic_icdph',
          label: {
            type: 'custom',
            custom: 'DIČ / IČ DPH (nepovinné - len pre firmy)',
          },
          type: 'text',
          optional: true,
        },
      ],
      success_url: `${origin}/nakupe-uspesny?course=${encodeURIComponent(courseName)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
      metadata: {
        course_name: courseName
      }
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
