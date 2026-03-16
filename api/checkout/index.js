const Stripe = require('stripe');

module.exports = async function (context, req) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY in your environment variables.',
      }),
    };
    return;
  }

  try {
    const items = req.body && req.body.items;

    if (!items || items.length === 0) {
      context.res = {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No items provided for checkout.' }),
      };
      return;
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.annoyingkids.com';

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          description:
            item.variantTitle !== item.title
              ? `Variant: ${item.variantTitle}`
              : undefined,
          metadata: {
            product_id: item.productId,
            variant_id: item.variantId,
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK'],
      },
      metadata: {
        source: 'annoyingkids-com',
        items: JSON.stringify(
          items.map((i) => ({
            pid: i.productId,
            vid: i.variantId,
            qty: i.quantity,
          }))
        ),
      },
    });

    context.res = {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    context.log.error('Checkout session creation error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: `Failed to create checkout session: ${errorMessage}`,
      }),
    };
  }
};
