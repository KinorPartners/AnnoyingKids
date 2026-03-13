import { NextRequest, NextResponse } from 'next/server';
import { getStripe, isStripeConfigured } from '@/lib/stripe';

interface CheckoutItem {
  productId: string;
  variantId: string;
  title: string;
  variantTitle: string;
  price: number;
  quantity: number;
  image: string;
}

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          'Stripe is not configured. Please set STRIPE_SECRET_KEY in your environment variables.',
      },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { items } = body as { items: CheckoutItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided for checkout.' },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          description: item.variantTitle !== item.title ? `Variant: ${item.variantTitle}` : undefined,
          metadata: {
            product_id: item.productId,
            variant_id: item.variantId,
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
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

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session creation error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: `Failed to create checkout session: ${errorMessage}` },
      { status: 500 }
    );
  }
}
