const Stripe = require('stripe');

const PRINTIFY_API_BASE = 'https://api.printify.com/v1';

module.exports = async function (context, req) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    context.res = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Stripe is not configured.' }),
    };
    return;
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2024-06-20',
  });

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    const body = req.rawBody || req.body;
    const signature = req.headers['stripe-signature'];

    if (endpointSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } else {
      event = typeof body === 'string' ? JSON.parse(body) : body;
      context.log.warn(
        'Stripe webhook signature verification skipped (no STRIPE_WEBHOOK_SECRET set).'
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    context.log.error(`Webhook signature verification failed: ${errorMessage}`);
    context.res = {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Webhook Error: ${errorMessage}` }),
    };
    return;
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      context.log('Checkout session completed:', session.id);

      let orderItems = [];
      try {
        if (session.metadata && session.metadata.items) {
          orderItems = JSON.parse(session.metadata.items);
        }
      } catch (parseError) {
        context.log.error('Failed to parse order items from metadata:', parseError);
      }

      const printifyApiKey = process.env.PRINTIFY_API_KEY;
      const printifyShopId = process.env.PRINTIFY_SHOP_ID;

      if (printifyApiKey && printifyShopId && orderItems.length > 0) {
        try {
          const shippingDetails = session.shipping_details;
          const customerDetails = session.customer_details;

          const printifyOrder = {
            external_id: session.id,
            line_items: orderItems.map((item) => ({
              product_id: item.pid,
              variant_id: parseInt(item.vid, 10),
              quantity: item.qty,
            })),
            shipping_method: 1,
            send_shipping_notification: true,
            address_to: {
              first_name:
                (shippingDetails && shippingDetails.name && shippingDetails.name.split(' ')[0]) ||
                (customerDetails && customerDetails.name && customerDetails.name.split(' ')[0]) ||
                'Customer',
              last_name:
                (shippingDetails && shippingDetails.name && shippingDetails.name.split(' ').slice(1).join(' ')) ||
                (customerDetails && customerDetails.name && customerDetails.name.split(' ').slice(1).join(' ')) ||
                '',
              email: (customerDetails && customerDetails.email) || '',
              phone: (customerDetails && customerDetails.phone) || '',
              country:
                (shippingDetails && shippingDetails.address && shippingDetails.address.country) || 'US',
              region:
                (shippingDetails && shippingDetails.address && shippingDetails.address.state) || '',
              address1:
                (shippingDetails && shippingDetails.address && shippingDetails.address.line1) || '',
              address2:
                (shippingDetails && shippingDetails.address && shippingDetails.address.line2) || undefined,
              city:
                (shippingDetails && shippingDetails.address && shippingDetails.address.city) || '',
              zip:
                (shippingDetails && shippingDetails.address && shippingDetails.address.postal_code) || '',
            },
          };

          const res = await fetch(
            `${PRINTIFY_API_BASE}/shops/${printifyShopId}/orders.json`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${printifyApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(printifyOrder),
            }
          );

          if (!res.ok) {
            const errorBody = await res.text();
            throw new Error(
              `Failed to create Printify order: ${res.status} ${res.statusText} - ${errorBody}`
            );
          }

          const result = await res.json();
          context.log('Printify order created:', result.id);
        } catch (printifyError) {
          context.log.error('Failed to create Printify order:', printifyError);
        }
      } else {
        context.log('Printify not configured or no items — skipping order creation.');
      }

      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      context.log('Payment succeeded:', paymentIntent.id);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      context.log('Payment failed:', paymentIntent.id);
      break;
    }

    default:
      context.log(`Unhandled event type: ${event.type}`);
  }

  context.res = {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ received: true }),
  };
};
