# AnnoyingKids.com — Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd annoyingkids-com
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

```env
# Stripe (required for checkout)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Printify (optional — app works with mock data without this)
PRINTIFY_API_KEY=your_key
PRINTIFY_SHOP_ID=your_shop_id

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Stripe Setup

### Getting API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy the **Publishable key** → `STRIPE_PUBLISHABLE_KEY`
3. Copy the **Secret key** → `STRIPE_SECRET_KEY`

### Webhook Setup (Local Development)

1. Install the Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### Webhook Setup (Production)

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events: `checkout.session.completed`
5. Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

## Printify Setup

### Getting API Key

1. Go to https://printify.com/app/account/api
2. Generate a new API token
3. Copy it → `PRINTIFY_API_KEY`

### Getting Shop ID

1. Go to https://printify.com/app/store
2. Your shop ID is in the URL or can be retrieved via:
   ```bash
   curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.printify.com/v1/shops.json
   ```
3. Copy the shop ID → `PRINTIFY_SHOP_ID`

### Without Printify

The app works perfectly without Printify configuration! It uses mock product data as a fallback. The checkout flow completes via Stripe, but no fulfillment order is created.

## Azure Static Web Apps Deployment

### Prerequisites

- Azure account
- GitHub repository with this code

### Steps

1. **Create Azure resource:**
   - Go to Azure Portal → Create Resource → Static Web App
   - Connect to your GitHub repo
   - Build details: Next.js preset

2. **Configure secrets in GitHub:**
   - `AZURE_STATIC_WEB_APPS_API_TOKEN` (from Azure portal)

3. **Configure environment in Azure:**
   - Go to your Static Web App → Configuration
   - Add all environment variables from `.env.example`

4. **Deploy:**
   - Push to `main` branch
   - GitHub Actions handles the build and deploy automatically

## Architecture Notes

### Cart State
- Uses React Context with `useReducer` for state management
- Persisted to `localStorage` for cross-session persistence
- Cart state includes product data, selected variant, and quantity

### Product Data Flow
1. `/api/products` route tries Printify API first
2. Falls back to mock data in `src/lib/products.ts`
3. Products page uses client-side mock data directly for instant loading

### Checkout Flow
1. User clicks "Checkout" in cart
2. Frontend POSTs cart items to `/api/checkout`
3. API creates a Stripe Checkout Session
4. User is redirected to Stripe's hosted checkout
5. On success → redirected to `/checkout/success`
6. Stripe webhook hits `/api/webhooks/stripe`
7. Webhook handler creates Printify order (if configured)

### Design System
- **Colors:** Dark bg (#0a0a0a), neon pink (#ff2d78), neon green (#39ff14), electric blue (#00f0ff), hot yellow (#fff200)
- **Fonts:** Bungee (headings), Space Grotesk (body)
- **Effects:** CSS glitch animations, glow shadows, scanline overlays, gradient animations
