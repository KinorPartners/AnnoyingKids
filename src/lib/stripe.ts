import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeSecretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Please add it to your .env file.'
    );
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(stripeSecretKey, {
      apiVersion: '2024-06-20',
      typescript: true,
    });
  }
  return stripeInstance;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
