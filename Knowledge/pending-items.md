# Pending Items

These require input or assets from the team before they can be implemented.

## Needs Team Input

| Item | Where to update | Notes |
|------|----------------|-------|
| **Social media URLs** (Instagram, TikTok, X) | `src/components/Footer.tsx` (3 `<span>` → `<a>`), `src/app/layout.tsx` (`sameAs` array in Organization schema) | Icons are visible but disabled until URLs confirmed |
| **Shipping policy** (free? flat-rate? calculated?) | `src/app/page.tsx`, `src/components/ProductDetail.tsx`, `src/app/faq/page.tsx`, `src/app/shipping/page.tsx` | Currently neutral: "US & Intl Shipping / Calculated at checkout" |
| **About page content** | `src/app/about/page.tsx` | Needs bios for Oz, Matan, Sagie + content from kinorpartners.com |
| **Facebook Pixel ID** | `src/app/layout.tsx` | Not yet integrated |
| **TikTok Pixel ID** | `src/app/layout.tsx` | Not yet integrated |
| **GA4 env var** | Deployment dashboard | `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-RE32GFCT3H` — must be set in Vercel/host |

## Needs Assets

| Asset | Spec | Used in |
|-------|------|---------|
| `public/og-image.png` | 1200×630px | Site-wide social share card (og:image in layout metadata) |

## Deployment

The site has not been deployed yet. No CI/CD pipeline has been configured.
Recommended host: **Vercel** (first-class Next.js support, free tier available).
