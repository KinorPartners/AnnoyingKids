import { NextRequest, NextResponse } from 'next/server';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { isPrintifyConfigured, createOrder } from '@/lib/printify';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Stripe is not configured.' },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (endpointSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } else {
      // In development without webhook secret, parse directly
      event = JSON.parse(body) as Stripe.Event;
      console.warn(
        'Stripe webhook signature verification skipped (no STRIPE_WEBHOOK_SECRET set).'
      );
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('✅ Checkout session completed:', session.id);

      // Extract order items from metadata
      let orderItems: { pid: string; vid: string; qty: number }[] = [];
      try {
        if (session.metadata?.items) {
          orderItems = JSON.parse(session.metadata.items);
        }
      } catch (parseError) {
        console.error('Failed to parse order items from metadata:', parseError);
      }

      // If Printify is configured, create order
      if (isPrintifyConfigured() && orderItems.length > 0) {
        try {
          const shippingDetails = session.shipping_details;
          const customerDetails = session.customer_details;

          const printifyOrder = await createOrder({
            external_id: session.id,
            line_items: orderItems.map((item) => ({
              product_id: item.pid,
              variant_id: parseInt(item.vid, 10),
              quantity: item.qty,
            })),
            shipping_method: 1, // Standard shipping
            send_shipping_notification: true,
            address_to: {
              first_name: shippingDetails?.name?.split(' ')[0] || customerDetails?.name?.split(' ')[0] || 'Customer',
              last_name: shippingDetails?.name?.split(' ').slice(1).join(' ') || customerDetails?.name?.split(' ').slice(1).join(' ') || '',
              email: customerDetails?.email || '',
              phone: customerDetails?.phone || '',
              country: shippingDetails?.address?.country || 'US',
              region: shippingDetails?.address?.state || '',
              address1: shippingDetails?.address?.line1 || '',
              address2: shippingDetails?.address?.line2 || undefined,
              city: shippingDetails?.address?.city || '',
              zip: shippingDetails?.address?.postal_code || '',
            },
          });

          console.log('✅ Printify order created:', printifyOrder.id);
        } catch (printifyError) {
          console.error('❌ Failed to create Printify order:', printifyError);
          // Don't return an error — the payment was successful
          // Log and handle this in monitoring/alerts
        }
      } else {
        console.log(
          'ℹ️ Printify not configured or no items — skipping order creation.'
        );
      }

      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('💰 Payment succeeded:', paymentIntent.id);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('❌ Payment failed:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
