import crypto from 'crypto';
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies }) => {
  try {
    const token = url.searchParams.get('token');
    if (!token) {
      return new Response('Chýba autentifikačný token.', { status: 400 });
    }

    const stripeSecret = import.meta.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return new Response('Platobný systém nie je nakonfigurovaný.', { status: 500 });
    }

    const parts = token.split('.');
    if (parts.length !== 2) {
      return new Response('Neplatný formát tokenu.', { status: 400 });
    }

    const [payloadBase64, signature] = parts;
    const computedSignature = crypto.createHmac('sha256', stripeSecret).update(payloadBase64).digest('hex');

    if (computedSignature !== signature) {
      return new Response('Neplatný prihlasovací odkaz.', { status: 403 });
    }

    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf8'));
    if (Date.now() > payload.expires) {
      return new Response('Platnosť prihlasovacieho odkazu vypršala. Požiadajte o nový.', { status: 403 });
    }

    // Set the course cookie to grant access
    cookies.set('ascentia_purchased_course', payload.courseName, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
    });

    const successUrl = `${url.origin}/nakupe-uspesny?course=${encodeURIComponent(payload.courseName)}`;
    return new Response(null, {
      status: 302,
      headers: {
        'Location': successUrl
      }
    });
  } catch (error: any) {
    console.error('Magic link verification error:', error.message);
    return new Response(`Chyba overenia: ${error.message}`, { status: 500 });
  }
};
