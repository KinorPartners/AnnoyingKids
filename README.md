# AnnoyingKids.com 😈

**Merch for Professional Troublemakers** — A bold, neon-themed e-commerce site for kids aged 6-16.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)
![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?style=flat-square&logo=stripe)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Payments:** Stripe Checkout
- **Fulfillment:** Printify (print-on-demand)
- **Deployment:** Azure Static Web Apps

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Stripe account (for payments)
- Printify account (for fulfillment, optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/annoyingkids-com.git
cd annoyingkids-com

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your actual keys
nano .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `STRIPE_SECRET_KEY` | Stripe secret API key | Yes (for checkout) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes (for checkout) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | Yes (for production) |
| `PRINTIFY_API_KEY` | Printify API key | No (falls back to mock data) |
| `PRINTIFY_SHOP_ID` | Printify shop ID | No (falls back to mock data) |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | Yes |

## Features

- 🎨 **Neon Design System** — Dark theme with electric pink, neon green, electric blue, hot yellow
- ⚡ **Glitch Effects** — Animated glitch text, chromatic aberration, scanline overlays
- 🛒 **Full Cart System** — Add/remove/update items, persisted to localStorage
- 💳 **Stripe Checkout** — Secure payment processing with Stripe Checkout Sessions
- 🖨️ **Printify Integration** — Automatic order fulfillment via Printify API
- 📱 **Fully Responsive** — Mobile-first design that looks great on all devices
- ♿ **Accessible** — Proper ARIA labels, keyboard navigation, semantic HTML

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── products/          # Products listing & detail
│   ├── cart/              # Shopping cart
│   ├── about/             # Brand story
│   ├── checkout/          # Success & cancel pages
│   └── api/               # API routes (checkout, products, webhooks)
├── components/            # Reusable UI components
├── context/               # React Context (Cart state)
├── lib/                   # Utilities (Stripe, Printify, product data)
└── types/                 # TypeScript type definitions
```

## Deployment

### Azure Static Web Apps

1. Fork this repo to your GitHub account
2. Create an Azure Static Web App resource
3. Connect it to your GitHub repo
4. Add these secrets to your GitHub repo:
   - `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. Add environment variables in Azure portal:
   - All variables from `.env.example`
6. Push to `main` — CI/CD handles the rest!

### Stripe Webhook Setup

1. Install the Stripe CLI: `brew install stripe/stripe-cli/stripe`
2. For local development: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. For production: Create a webhook endpoint in the Stripe Dashboard pointing to `https://yourdomain.com/api/webhooks/stripe`
4. Subscribe to the `checkout.session.completed` event

## Development

```bash
# Start dev server
npm run dev

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Start production server
npm start
```

## License

MIT

---

Built with 💜 and maximum chaos energy by the AnnoyingKids team. 😈
