# Project Stack & Architecture

## Tech Stack
- **Framework:** Next.js App Router with `output: 'export'` (fully static — no server)
- **Styling:** Tailwind CSS with custom neon tokens: `neon-pink`, `neon-blue`, `neon-green`, `neon-yellow`
- **Fonts:** Bungee (headings), Space Grotesk (body) via next/font
- **Payments:** Stripe (client-side checkout)
- **Print fulfillment:** Printify (print-on-demand, ships direct to customer)
- **Analytics:** GA4 (`G-RE32GFCT3H`) — needs `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var in deployment dashboard

## Key Constraints

`output: 'export'` means fully static HTML at build time:
- `images: { unoptimized: true }` is required — Next.js image optimisation needs a server
- No API routes that run at request time
- `export const dynamic = 'force-static'` used on pages that fetch data at build time

## Data Sources

| Data | Location | How it's loaded |
|------|----------|-----------------|
| Products | Printify API | `src/lib/products.ts` → `getProductsForBuild()` at build time |
| Blog articles | Hardcoded | `src/lib/blog.ts` → `ARTICLES` array |
| Characters | Hardcoded | `src/lib/characters.ts` → `CHARACTERS` array |

## Key Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Global metadata, Organization + WebSite JSON-LD schema, GA4 |
| `src/app/sitemap.ts` | Auto-generated sitemap — picks up all pages, products, blog, characters |
| `src/app/not-found.tsx` | Custom 404 page |
| `public/robots.txt` | Disallows /api/, /checkout/, /cart; includes Sitemap reference |
| `src/lib/products.ts` | Printify integration + mock fallback products |
| `src/components/ChaosGame.tsx` | Full browser game (Kid Chaos) |
| `src/components/Footer.tsx` | Global footer with newsletter, nav, social icons |
