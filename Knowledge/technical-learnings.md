# Technical Learnings & Gotchas

## Next.js / Static Export

**`og:type: 'product'` is not supported in Next.js Metadata API**
The type union only includes standard OGP types (website, article, etc.). Adding og:type=product requires injecting raw `<meta>` tags via the `other` field. Minor SEO gain, non-trivial workaround — skip unless specifically needed.

**Sitemap auto-updates with new content**
`src/app/sitemap.ts` imports `ARTICLES` and `CHARACTERS` arrays directly. Adding new blog posts or characters automatically includes them in `/sitemap.xml` — no manual update needed.

**`images: { unoptimized: true }` is load-bearing**
Required for static export. Product images come from Printify CDN anyway, so Next.js image optimisation wouldn't help them regardless. Do not remove this.

**Product images are external (Printify CDN)**
All product images come from `images-api.printify.com`. They are not local files. Converting to WebP is not applicable — Printify controls their format and CDN optimisation.

## SEO Patterns

- **Title format:** `"Product Name — AnnoyingKids"` — brand suffix improves SERP recognition
- **Meta description length:** 150–160 chars optimal
- **Canonical URLs:** Every page needs `alternates: { canonical: '...' }` — all pages have this
- **JSON-LD schemas in use:** Organization + WebSite (layout), Product + BreadcrumbList (PDPs), Article (blog), FAQPage (/faq)
- **Sitemap reference in robots.txt:** `Sitemap: https://www.annoyingkids.com/sitemap.xml`

## Honesty Rules (Non-Negotiable)

**No fake ratings or reviews.**
A "4.9/5" claim was removed from the site. `aggregateRating` must not be added to Product JSON-LD schema without real review data — Google can penalise fabricated ratings.

**No unconfirmed shipping claims.**
"Free US Shipping" was removed because the Printify shipping policy was not confirmed. All references now say "US & Intl Shipping / Calculated at checkout." Update once policy is confirmed.

## Accessibility

- Product card "Add to Cart" button uses `aria-label="Add [product name] to cart"` for screen readers
- Footer social icons use `aria-label` and `aria-hidden` on SVGs
- Breadcrumb nav uses `aria-label="Breadcrumb"`
- Quantity +/- buttons use `aria-label="Increase/Decrease quantity"`
