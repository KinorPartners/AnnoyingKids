# Static E-Commerce Site Building Guide
### Derived from: Shirt-Tucker.com — A Production Static Site

This document captures every architectural decision, SEO pattern, content strategy, and hard-won lesson from building shirt-tucker.com. Use it to accelerate future static site projects and avoid repeating solved problems.

---

## 1. Stack & Architecture

### The Core Model
- **Pure static HTML/CSS/vanilla JS** — no framework, no bundler, no build step
- **No Shopify** — payment via Stripe Payment Links (hardcoded URLs per SKU/variant)
- **Hosting:** Azure Static Web Apps (auto-deploys on push to `main`)
- **CI automation:** A Python script (`update_site.py`) runs pre-deploy, syncing the footer and GA tag across all HTML pages, then auto-commits

### Why This Stack Works
Static sites index faster, load faster, and have no moving parts to break. For a single-product e-commerce store, the complexity of Shopify or a framework is unnecessary overhead. Stripe handles checkout entirely — the site's only job is to convert visitors.

### File Structure Convention
```
/                     ← Root pages (core, use-case, audience pages)
/compare/             ← Comparison articles (Product vs alternatives)
/guide/               ← Product-specific guides (sizing, washing, etc.)
/learn/               ← How-to articles (how to keep shirt tucked in X situation)
/lifestyle/           ← Broader topical content (style tips, gift guides, etc.)
/for/                 ← Independent pages targeting alternate keyword angles for the same audiences (NOT redirects — each self-canonicalizes)
/questions/           ← Single-question Q&A pages (AI/SGE optimized)
/css/styles.css       ← ONE stylesheet for the entire site
/js/                  ← JS modules (nav.js, cart.js, affiliate.js, contact.js, sticky-bar.js)
/images/              ← Local images
/_shared.html         ← Master template: nav + cart drawer + footer HTML
/pages/_shared.html   ← Alternate shared template (legacy/subset)
/shop.html            ← Canonical source for footer HTML (CI copies from here)
/sitemap.xml
/robots.txt
/staticwebapp.config.json
```

---

## 2. The CI/CD Constraint — Read This First

**The CI script (`update_site.py`) automatically overwrites three things in every HTML file on each push:**
1. The `<footer>` block
2. The Google Analytics `<script>` tag block (GA4, ID: `G-BCM8GM8R6E`)
3. The Microsoft Clarity `<script>` tag (ID: `vzxetyyb6b`)

**Consequences:**
- **Never manually edit the footer in individual content pages.** Changes will be wiped on next push.
- **The footer is hardcoded in `update_site.py` as `CANONICAL_FOOTER`** — it is NOT pulled live from `shop.html`. Updating `shop.html`'s footer is necessary but not sufficient. You must also update `CANONICAL_FOOTER` in `update_site.py`. See Section 19 for the full picture.
- `_shared.html` is the human-readable template reference — keep it in sync manually.
- New pages created locally will lack the GA and Clarity tags until after the next push — this is fine, do not add them manually to new page templates.
- The nav is NOT managed by CI. Nav changes must either be made in every file individually, or a script written. See Section 19 for options.

---

## 3. CSS System

### Single File: `/css/styles.css`

Every page includes `/css/styles.css`. Page-specific styles go in an inline `<style>` block in the page's `<head>`. This avoids extra HTTP requests while keeping shared styles centralized.

### CSS Custom Properties (Variables)
```css
:root {
  --navy: #0d1b2e;        /* Primary dark — backgrounds, headings */
  --navy-mid: #162540;    /* Mid-dark navy */
  --navy-light: #1e3355;  /* Hover states on navy backgrounds */
  --navy-pale: #e8edf3;   /* Light section backgrounds, card backgrounds */
  --white: #ffffff;
  --accent: #1a73e8;      /* Primary blue — CTAs, links, highlights */
  --accent-dark: #1557b0; /* Hover state for accent */
  --gold: #f5c518;        /* Emphasis — ratings, "best value" badges */
  --text: #0d1b2e;        /* Body text (same as navy) */
  --muted: #5a6a7a;       /* Secondary text, captions */
  --border: #d0dae6;      /* Borders, dividers */
  --radius: 12px;         /* Default border radius */
}
```

Always use these variables. Never hardcode hex values in page-level styles — the entire site's palette is controllable from these 11 lines.

### Typography
- **Headings:** `Barlow Condensed`, weight 900, `text-transform: uppercase`
- **Body:** `DM Sans`, weights 400/500/700
- **Heading sizes:** Use `clamp()` for responsive scaling, e.g. `font-size: clamp(36px, 6vw, 64px)`
- **Eyebrow labels:** `font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--accent)`

### Breakpoints
```
900px  — tablet: footer goes 2-col, product layout stacks
600px  — mobile: nav links hide (hamburger shows), most grids go 1-col
480px  — small mobile: font/padding adjustments
360px  — ultra-small: tightest padding, smallest fonts
```

### Google Fonts — Required in Every Page Head
```html
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet"/>
```

---

## 4. Page Head Template (Copy This Exactly)

Every page must have this structure in `<head>`. The order matters for performance.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<!-- Google tag (gtag.js) -->
<script async="" src="https://www.googletagmanager.com/gtag/js?id=G-BCM8GM8R6E"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-BCM8GM8R6E');
</script>
<meta charset="utf-8"/>
<meta content="width=device-width,initial-scale=1.0" name="viewport"/>
<title>Page Title — Site Name</title>
<meta name="description" content="Unique, compelling description. No double quotes inside this attribute — use inch or in instead of the inch symbol."/>
<link rel="canonical" href="https://www.shirt-tucker.com/path/to/page.html"/>
<meta content="index,follow,max-snippet:-1,max-image-preview:large" name="robots"/>

<!-- Open Graph -->
<meta property="og:title" content="Page Title"/>
<meta property="og:description" content="Description without double quotes."/>
<meta property="og:type" content="article"/><!-- or "product" for shop pages, "website" for index -->
<meta property="og:url" content="https://www.shirt-tucker.com/path/to/page.html"/>
<meta property="og:image" content="https://kinorpartners.com/cdn/shop/files/MainPDP-Black.png?v=1773081951"/>

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="Page Title"/>
<meta name="twitter:description" content="Description."/>
<meta name="twitter:image" content="https://kinorpartners.com/cdn/shop/files/MainPDP-Black.png?v=1773081951"/>

<!-- JSON-LD Structured Data blocks go here (see Section 6) -->

<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet"/>
<link href="/css/styles.css" rel="stylesheet"/>
<style>
/* Page-specific styles here */
</style>
</head>
```

### CRITICAL: The Double-Quote Trap
**Never use the `"` (inch/quote) symbol inside HTML attribute values.** This is the single most common and damaging bug found in this codebase.

Wrong — this breaks the meta tag completely, scattering words as phantom attributes:
```html
<meta name="description" content="Fits 22" waist belts"/>
```
Result in browser: `<meta content="Fits 22" waist="" belts=""/>`

Correct:
```html
<meta name="description" content="Fits 22 inch waist belts"/>
<meta name="description" content="Fits 22-inch waist belts"/>
<meta name="description" content="Fits 22&quot; waist belts"/>
```

This bug is invisible in source view but destroys the meta tag entirely. Grep for `content=".*"` patterns (where " appears mid-string) after writing any page with measurements or quotes.

---

## 5. Nav & Footer HTML

### Nav (Paste Into Every Page)
```html
<nav>
  <div class="nav-inner">
    <a class="logo" href="/index.html">SHIRT<span class="logo-dot">.</span>TUCKER</a>
    <ul class="nav-links">
      <li><a href="/index.html">Home</a></li>
      <li><a href="/shop.html">Shop</a></li>
      <li><a href="/about.html">About</a></li>
      <li><a href="/reviews.html">Reviews</a></li>
      <li><a href="/faq.html">FAQ</a></li>
      <li><a href="/questions/">Questions</a></li>
      <li><a href="/influencer.html">Earn Commission</a></li>
      <li><a class="nav-cta" href="/shop.html">Buy Now — $19.99</a></li>
      <li>
        <button class="nav-cart" onclick="openCart()">
          <svg viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span id="navCartLabel">Cart</span>
          <span class="cart-count" id="cartCount">0</span>
        </button>
      </li>
    </ul>
    <button class="menu-btn" id="menuBtn" onclick="toggleMenu()">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="mobile-menu" id="mobileMenu">
  <a href="/index.html">Home</a>
  <a href="/shop.html">Shop</a>
  <a href="/about.html">About</a>
  <a href="/reviews.html">Reviews</a>
  <a href="/faq.html">FAQ</a>
  <a href="/questions/">Questions</a>
  <a href="/influencer.html">Earn Commission</a>
  <a href="/shop.html">Buy Now — $19.99 →</a>
  <a href="#" onclick="openCart();toggleMenu()">Cart (<span id="mobileCartCount">0</span>)</a>
</div>
```

### Cart Drawer (Paste After Footer, Before Scripts)
```html
<div class="cart-overlay" id="cartOverlay" onclick="closeCart()"></div>
<div class="cart-drawer" id="cartDrawer">
  <div class="cart-header">
    <h3>Your Cart</h3>
    <button class="cart-close" onclick="closeCart()">
      <svg viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <line x1="18" x2="6" y1="6" y2="18"></line>
        <line x1="6" x2="18" y1="6" y2="18"></line>
      </svg>
    </button>
  </div>
  <div class="cart-items" id="cartItems">
    <div class="cart-empty" id="cartEmpty">
      <svg viewbox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      <p>Your cart is empty</p>
    </div>
  </div>
  <div class="cart-footer">
    <div class="cart-subtotal"><span>Subtotal</span><strong id="cartTotal">$0.00</strong></div>
    <div class="cart-subtotal"><span>Shipping</span><strong>Free</strong></div>
    <button class="checkout-btn" disabled="" id="checkoutBtn" onclick="proceedToCheckout()">PROCEED TO CHECKOUT</button>
  </div>
</div>
<div class="toast" id="toast"></div>
```

### End-of-Body Scripts (All Content Pages)
```html
<script src="/js/nav.js"></script>
<script src="/js/cart.js"></script>
```

For shop.html, `cart.js` is replaced by extensive inline JS (Stripe links, gallery, color picker, bundle selector, shipping countdown). Do not include `cart.js` on shop.html.

---

## 6. JSON-LD Structured Data

Every page needs 4 JSON-LD blocks. Order them as shown below, immediately after the twitter:image meta tag and before Google Fonts.

### Block 1: Article (for all content pages)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Page Title Here",
  "description": "Page description here.",
  "author": {"@type": "Organization", "name": "Shirt Tucker"},
  "publisher": {"@type": "Organization", "name": "Shirt Tucker", "url": "https://www.shirt-tucker.com"},
  "mainEntityOfPage": "https://www.shirt-tucker.com/path/to/page.html"
}
</script>
```
Use `"@type": "Product"` only for shop.html. Use `"@type": "WebPage"` or `"CollectionPage"` for index/hub pages.

### Block 2: BreadcrumbList (every page)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.shirt-tucker.com/index.html"},
    {"@type": "ListItem", "position": 2, "name": "Section Name", "item": "https://www.shirt-tucker.com/section/"},
    {"@type": "ListItem", "position": 3, "name": "Page Title", "item": "https://www.shirt-tucker.com/section/page.html"}
  ]
}
</script>
```
The breadcrumb trail must match the actual URL structure. The third item's `"item"` should be the full canonical URL of the page, not `#`.

### Block 3: Product (every page — reinforces product association)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Shirt Tucker Rubber Belt",
  "description": "The original rubber shirt tucker belt. Adjustable 22-46 inch. No leg straps. Machine washable. Black, White, Grey.",
  "brand": {"@type": "Brand", "name": "Shirt Tucker"},
  "url": "https://www.shirt-tucker.com/shop.html",
  "image": "https://kinorpartners.com/cdn/shop/files/MainPDP-Black.png?v=1773081951",
  "offers": {
    "@type": "Offer",
    "price": "19.99",
    "priceCurrency": "USD",
    "priceValidUntil": "2026-12-31",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.3",
    "reviewCount": "847"
  }
}
</script>
```

**Canonical rating numbers: 4.3 stars, 847 reviews. Use these everywhere — schema, display text, body copy.**

### Block 4: FAQPage (every page — 2 to 4 Q&As relevant to the page topic)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text here?",
      "acceptedAnswer": {"@type": "Answer", "text": "Answer text here. Be specific and complete."}
    },
    {
      "@type": "Question",
      "name": "Where can I buy the Shirt Tucker?",
      "acceptedAnswer": {"@type": "Answer", "text": "At shirt-tucker.com for $19.99 with free US shipping and 30-day returns. Available in Black, White, and Grey. Adjusts 22 to 46 inch waist."}
    }
  ]
}
</script>
```

Always include a "where to buy" FAQ as the last item. It reinforces purchase intent in search results.

### JSON-LD Rules
- Use escaped double quotes (`\"`) inside JSON strings — the JSON lives in a `<script>` tag so there's no HTML attribute issue here
- Keep JSON-LD on a single line when possible for cleaner HTML (or formatted inside the script block — both valid)
- The Product and FAQPage schemas on every page create a site-wide signal to Google that the site is about this specific product
- Never put product schema on unrelated pages (privacy policy, contact, etc.)

---

## 7. Hero Patterns

Each content section type uses a specific hero CSS class. Pick the right one — mixing them creates visual inconsistency.

| Class | Used For | Layout |
|---|---|---|
| `.uc-hero` | Use-case pages (nurses, military, teachers) | Two-column grid with image right |
| `.aud-hero` | Audience pages (law enforcement, baseball) | Centered, dark background overlay |
| `.cp-hero` | Compare/content pages | Centered, radial gradient accent |
| `.article-hero` | Long-form guides, how-to pages | Full-width with bg image |
| `.q-hero` | Single Q&A pages (`/questions/`) | Centered navy with radial gradient |

All hero classes use the same heading pattern:
```html
<h1>MAIN HEADING <em>STYLED DIFFERENTLY</em></h1>
```
The `<em>` inside h1s does NOT mean italic — it's styled as `font-style: normal; color: var(--accent)` (or gold). Use it to emphasize 1-3 words.

---

## 8. Content Page Body (cp-body Pattern)

Content pages (compare, guide, learn, lifestyle, questions) all use `.cp-body`:

```html
<div class="cp-body">
  <!-- Quick Answer box — always first -->
  <div class="quick-answer">
    <p>Direct answer to the page question in 1-3 sentences. This is what AI citation tools will quote.</p>
  </div>

  <h2>SECTION HEADING <em>WITH EMPHASIS</em></h2>
  <p>Body text. Line height 1.85. Font size 15px. Color var(--muted).</p>

  <!-- Callout box -->
  <div class="callout">
    <p><strong>Key point:</strong> Use callouts for critical information that shouldn't be missed.</p>
  </div>

  <!-- Inline CTA (mid-page) -->
  <div class="inline-cta">
    <h3>READY TO STAY SHARP?</h3>
    <div class="price">$19.99</div>
    <p>Free US shipping · 30-day returns · Fits 22–46 inch waist</p>
    <div class="icta-perks"><span>Free US Shipping</span><span>30-Day Returns</span><span>Black · White · Grey</span></div>
    <a href="/shop.html" class="btn-accent-lg">Shop Now — $19.99</a>
  </div>

  <!-- Related articles grid (always end content pages) -->
  <div class="related-grid">
    <a class="rel-card" href="/compare/shirt-tucker-vs-suspenders.html">
      <div class="rel-tag">Compare</div>
      <div class="rel-title">Shirt Tucker vs Suspenders</div>
    </a>
    <!-- 3-5 related cards -->
  </div>
</div>
```

---

## 9. SEO — Complete Implementation Checklist

Run through this for every page created.

### Meta Tags
- [ ] `<title>` — unique per page, 50-60 chars, contains primary keyword
- [ ] `<meta name="description">` — unique per page, 140-160 chars, compelling (not just title repeat), **no double quotes in content**
- [ ] `<link rel="canonical">` — full absolute URL, matches the page's actual URL exactly
- [ ] `<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large"/>`
- [ ] `og:title`, `og:description`, `og:type`, `og:url`, `og:image` — all present, no double quotes in content values
- [ ] `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` — all present
- [ ] **og:type values:** `product` (shop.html only), `article` (all content pages), `website` (homepage, hub pages)

### Structured Data
- [ ] Article/Product/WebPage schema (page-appropriate type)
- [ ] BreadcrumbList — correct trail, third item uses full canonical URL (not `#`)
- [ ] Product schema with `ratingValue: "4.3"` and `reviewCount: "847"`
- [ ] FAQPage with 2-4 relevant Q&As including a "where to buy" item
- [ ] Validate with Google's Rich Results Test after major structural changes

### Technical
- [ ] `sitemap.xml` updated with new page
- [ ] `robots.txt` allows the page (default: allow all)
- [ ] All `<img>` tags have descriptive `alt` attributes
- [ ] No heading level skips (h1 → h2 → h3, never h1 → h3)
- [ ] One `<h1>` per page only
- [ ] Page uses semantic HTML (section, article, nav, footer, main)
- [ ] No `display:none` on content that should be indexed

### After Pushing
- [ ] Submit `https://www.yourdomain.com/sitemap.xml` in Google Search Console
- [ ] Manually request indexing for new pages via URL Inspection tool
- [ ] Do the same in Bing Webmaster Tools (import from GSC — takes 2 min)

---

## 10. pSEO (Programmatic SEO) Strategy

This site's content architecture is the primary SEO engine. The model:

### Directory → Intent Mapping
```
/compare/   → Comparison queries: "Shirt Tucker vs X", "best shirt stays for Y"
/guide/     → Product queries: "shirt tucker sizing", "how to wash shirt tucker"
/learn/     → How-to queries: "how to keep shirt tucked in while golfing"
/lifestyle/ → Topical/lifestyle queries: "best dressed man at work", "golf dress code"
/for/       → Audience queries: "shirt stay for nurses", alternate URLs for use-case pages
/questions/ → Direct question queries: "why does my shirt untuck when I sit down"
```

### Page Targeting Rules
- **One topic per page, one primary keyword cluster per page.** A page about keeping shirts tucked while golfing should not also try to rank for military shirt stays.
- **Use the keyword in the URL slug.** `/learn/how-to-keep-shirt-tucked-in-golf.html` beats `/learn/article-47.html`. The URL is a ranking signal.
- **Each directory should have an index page** (`/compare/`, `/questions/`, `/blog/`) that links to all pages in that directory. This is the hub that passes authority to the spokes.
- **Hub pages need to be linked from nav or footer**, otherwise they (and everything under them) are orphaned.

### Content Page Length
- Use-case pages, audience pages: 600-1000 words visible content
- How-to guides: 800-1400 words
- Comparison articles: 500-900 words
- Q&A pages: 300-600 words (answer-first, tightly scoped)

---

## 11. AI Search Optimization (Distinct from Traditional SEO)

Google SGE, ChatGPT, Perplexity, and other AI answers pull from pages differently than traditional search. Optimize for this explicitly.

### What AI Systems Look For
1. **Direct answer in the first paragraph.** The answer to the page's question must appear in plain language within the first 150 words, before any context or backstory.
2. **One clear question per page.** Pages trying to answer multiple questions get their answer diluted or misattributed.
3. **FAQPage schema.** AI systems read structured Q&A schema directly. Write schema answers as complete, self-contained sentences — they will be quoted verbatim.
4. **No jargon barriers.** The answer should be comprehensible without reading the rest of the page.

### Quick Answer Box Pattern
Every Q&A and how-to page should open with:
```html
<div class="quick-answer">
  <p>Your shirt untucks when you sit because sitting changes your body angle, pulling shirt fabric upward from the back. The fix is a rubber belt shirt tucker worn over the tucked shirt — it holds the fabric through friction regardless of body position.</p>
</div>
```
CSS makes this render with a blue left border and "Quick Answer" eyebrow label. AI systems will cite this box.

### Format Variety
AI training data includes a wide range of formats. Vary page structure across the directory:
- Answer-first (state the answer, then explain why)
- Problem/solution (describe the problem thoroughly, then solutions ranked by effectiveness)
- Step-by-step (numbered process with a result at each step)
- Comparison table (structured data AI can extract)
- Cost comparison with actual dollar amounts

---

## 12. Internal Linking Architecture

Internal linking is free and most sites underinvest in it. Every link from an existing indexed page to a new page accelerates the new page's crawl and indexing.

### Minimum Internal Link Requirements Per Page
- Breadcrumb nav: links to home + parent directory
- Body content: 2-4 contextual links to related pages
- Related articles grid: 3-5 cards at bottom linking to the same topic cluster
- Mid-page inline CTA: always links to `/shop.html`

### Hub-and-Spoke Model
Every content directory must have a hub (`/questions/`, `/compare/`, etc.) that:
1. Lists all pages in the directory
2. Is linked from the footer (so every page on the site links to it)
3. Links back to individual pages

Without this, orphaned pages rely entirely on the sitemap for discovery.

### Footer "Learn" Column — The Crawl Highway
The footer is on every page. Every link in the footer gets linked from ~150 pages simultaneously. Prioritize it for:
- High-value hub pages
- Key comparison/guide pages
- New sections that need rapid indexing

The CI script copies the footer from `shop.html` to all pages on push. **Footer changes go in `shop.html` first, then `_shared.html` for reference sync.**

---

## 13. Stripe Payment Integration

### Payment Links (Static — No Backend Required)
```javascript
const STRIPE_LINKS = {
  'Black': 'https://buy.stripe.com/...',
  'White': 'https://buy.stripe.com/...',
  'Grey':  'https://buy.stripe.com/...'
};
const STRIPE_BUNDLE_LINKS = {
  2: 'https://buy.stripe.com/...', // 2-pack
  3: 'https://buy.stripe.com/...'  // 3-pack
};
```

Links are hardcoded in `js/cart.js` (for the cart drawer) and also inlined in `shop.html` (for the PDP). Keep them in sync. Affiliate tracking (`js/affiliate.js`) reads `?via=` URL params and rewrites Stripe links with affiliate metadata via a 30-day cookie.

### Checkout Flow
- **shop.html:** `handleBuy(event)` → `window.location.href = STRIPE_LINKS[color]` (direct redirect, no cart)
- **All other pages:** Cart drawer → `proceedToCheckout()` → `window.open(STRIPE_LINKS[lastColor])` in new tab

---

## 14. Common Bugs Reference

### Bug: Meta tags explode from double quotes
**Symptom:** `<meta content="Fits 22" waist="" belts=""/>` — extra attributes in DevTools
**Cause:** `"` symbol inside a double-quoted HTML attribute value
**Fix:** Replace `"` with `in`, `inch`, `-inch`, or `&quot;`
**Detection:** `grep -rn 'content=".*".*"' *.html` — finds content attributes with interior quotes

### Bug: Shipping line missing from cart footer
**Symptom:** Cart drawer shows Subtotal but not Shipping
**Cause:** Old template used `<p class="cart-note">Shipping & taxes calculated at checkout</p>` — new template uses a proper row
**Fix:** Replace with `<div class="cart-subtotal"><span>Shipping</span><strong>Free</strong></div>`
**Detection:** `grep -rl "cart-note" . --include="*.html"`

### Bug: New pages are orphaned (not linked from anywhere)
**Symptom:** Pages exist but get no organic traffic or crawl
**Cause:** Pages added to sitemap but not linked from any other page
**Fix:** Always add new pages to (1) the relevant hub index, (2) the footer, and/or (3) related pages' "related articles" grids

### Bug: BreadcrumbList third item points to `#`
**Symptom:** Breadcrumb schema fails Rich Results Test
**Cause:** Template placeholder `"item": "https://www.shirt-tucker.com#"` not updated
**Fix:** Set the third item's `"item"` to the full canonical URL of the current page

### Bug: Cart drawer hidden site-wide
**Symptom:** Cart icon does nothing, drawer never opens
**Cause:** `css/styles.css` contains `.cart-overlay,.cart-drawer{display:none!important}` — this exists intentionally for shop.html (which uses direct Stripe links) but blocks content page carts
**Note:** This is a known architectural quirk. Shop.html bypasses the cart entirely via direct Stripe redirects. Content pages with the cart drawer need to override this with page-level CSS if the cart is intended to be active.

### Bug: Sitemap not accepted by Search Console
**Symptom:** "Please enter a valid path to a sitemap in your site"
**Fix:** Enter the full URL including protocol: `https://www.yourdomain.com/sitemap.xml` — not just `sitemap.xml`

### Bug: Page not indexing after push
**Cause:** Sitemap updated but Google hasn't recrawled yet
**Fix:** Use Search Console URL Inspection → Request Indexing for new pages. Don't wait passively.

---

## 15. Product Copy & Social Proof Numbers

### Canonical Product Facts (Use These Exactly — Consistent Across Site)
- **Price:** $19.99
- **Rating:** 4.3 stars
- **Review count:** 847 reviews
- **Waist range:** 22–46 inches (use en dash, not hyphen: `22–46`)
- **Colors:** Black, White, Grey
- **Shipping:** Free US shipping
- **Returns:** 30-day money-back guarantee

### Standard Trust Badges
```
✓ Free US Shipping    ✓ 30-Day Returns    ✓ Secure Checkout via Stripe
```

### Standard Short Description (for meta descriptions, schema)
> The original rubber shirt tucker belt. Adjustable 22–46 inch waist. No leg straps. Machine washable. Black, White, Grey. $19.99 with free US shipping.

### OG Image (All Pages)
```
https://kinorpartners.com/cdn/shop/files/MainPDP-Black.png?v=1773081951
```

---

## 16. Sitemap Management

`sitemap.xml` uses human-readable section comments:
```xml
<!-- ── CORE PAGES ── -->
<!-- ── USE CASE / AUDIENCE PAGES ── -->
<!-- ── GUIDE PAGES ── -->
<!-- ── COMPARE PAGES ── -->
<!-- ── LEARN PAGES ── -->
<!-- ── LIFESTYLE PAGES ── -->
<!-- ── QUESTIONS (AI / FAQ PAGES) ── -->
```

Priority values:
- `1.0` — homepage
- `0.95` — shop page
- `0.8` — core pages (reviews, FAQ, how-to-wear)
- `0.75` — hub/index pages, high-traffic use-case pages
- `0.7` — Q&A, guide, learn, compare pages
- `0.6` — lifestyle/topical content

Always validate with `python3 -c "import xml.etree.ElementTree as ET; ET.parse('sitemap.xml'); print('valid')"` before pushing.

---

## 17. Deployment Workflow

1. Edit files locally
2. Run `git add` for specific changed files (avoid `git add -A` to prevent accidentally committing `.env` or other sensitive files)
3. Commit with a descriptive message following the pattern of recent commits
4. `git push origin main`
5. GitHub Actions triggers:
   - `update_site.py` — syncs footer + GA tag, auto-commits
   - Azure Static Web Apps deploy
6. Site is live in ~2 minutes
7. Go to Google Search Console → submit sitemap → request indexing on new pages

**Never push a broken sitemap.** Validate XML first. A malformed sitemap drops all pages from Google's index update queue.

---

## 18. Quality Checklist Before Any Push

### HTML Validity
- [ ] No double-quote characters inside HTML attribute values (especially meta content)
- [ ] All `<img>` tags have `alt` attributes
- [ ] Canonical URL matches the actual page URL exactly
- [ ] BreadcrumbList third item URL is not `#`
- [ ] Heading hierarchy: one h1, then h2, then h3 — no skips

### SEO
- [ ] Page added to sitemap.xml
- [ ] Meta description is unique (not just the page title repeated)
- [ ] og:type is correct (article/product/website)
- [ ] All 4 JSON-LD blocks present and valid JSON
- [ ] Page linked from at least one other page on the site (not just sitemap)

### Content
- [ ] Rating numbers are 4.3 / 847 (not outdated or invented)
- [ ] Price is $19.99
- [ ] Waist range uses en dash: 22–46 (not hyphen: 22-46)

### After Push
- [ ] Sitemap submitted / resubmitted in Search Console
- [ ] New pages manually requested for indexing

---

## 19. The CI Pipeline — Complete Behavior (Critical)

This section fills in what Section 2 summarized. Read it before touching the footer, analytics tags, or any shared content.

### What `update_site.py` Actually Does (Three Things, Not Two)

The script does **three** things on every run:
1. **Replaces `<footer>…</footer>`** with the canonical footer embedded in the script
2. **Injects the Google Analytics `<script>` block** after `<head>` (if not already present, detected by checking for `G-BCM8GM8R6E`)
3. **Injects Microsoft Clarity** before `</head>` (if not already present, detected by checking for `clarity.ms/tag/vzxetyyb6b`)

### The Footer Is Hardcoded IN THE SCRIPT — Not Pulled From shop.html

This is the most important thing to understand about the CI:

```
update_site.py contains a variable: CANONICAL_FOOTER = """<footer>...</footer>"""
```

The GitHub Actions workflow runs: `python update_site.py --dir .`
This uses the **embedded** `CANONICAL_FOOTER` string — it does NOT read from shop.html.

**Consequence:** If you update the footer in `shop.html`, nothing happens at CI time. The old footer from `CANONICAL_FOOTER` overwrites your change on the next push.

**The correct footer update process:**
1. Edit the footer in `shop.html` (user-facing canonical)
2. Edit `_shared.html` to match (human-readable reference)
3. **Edit `CANONICAL_FOOTER` in `update_site.py`** to match (what CI actually uses)

All three must be in sync. Forgetting step 3 means your footer change will be silently reverted on every push. The `--source` flag exists (`python update_site.py --source shop.html`) but the GitHub Actions workflow does not use it.

### GitHub Actions Sequence After Every Push to Main

```
Push to main
    │
    ├── Job 1: update-site.yml
    │       checkout repo
    │       pip install beautifulsoup4 lxml
    │       python update_site.py --dir .
    │           → replaces all <footer> blocks
    │           → injects GA tag where missing
    │           → injects Clarity tag where missing
    │       git add -A
    │       git diff --cached --quiet || git commit -m "Auto: inject gtag + update footer"
    │       git push    ← this is a second push to main from the bot
    │
    └── Job 2: Azure Static Web Apps deploy
            deploys from the latest main commit
            (which will be the bot's auto-commit if Job 1 changed anything)
```

**Critical:** The bot pushes a second commit. If you immediately pull after pushing, you may be behind. Always `git pull` before starting a new session if time has passed since your last push.

**What `git add -A` means here:** The CI stages everything — including any unintended files if they got created. Files like `.env`, temp files, or tool artifacts could be accidentally committed if they exist in the repo directory. Keep the repo clean.

### What the CI Does NOT Handle
- Nav bar links — must be edited per-page or via a custom script
- Page-specific `<style>` blocks
- JSON-LD structured data
- Canonical tags
- Any content outside `<footer>` and the analytics tags

### Adding a Nav Link Site-Wide

The CI has no nav sync. Options when you need to add a nav item everywhere:
1. **Write a one-off script** modeled on `update_site.py` that finds the nav block and adds the link (most reliable)
2. **Use `sed`** for a simple find-replace across all HTML files: `find . -name "*.html" -exec sed -i 's|<a href="/faq.html">FAQ</a>|<a href="/faq.html">FAQ</a>\n<li><a href="/new-page.html">New Page</a></li>|g' {} \;`
3. **Accept inconsistency** for low-priority nav additions — new pages get the new nav, old pages keep the old nav

Option 1 is the only one that handles both desktop nav and mobile menu correctly without manual double-checking.

### Microsoft Clarity

Clarity is a Microsoft heat-mapping and session recording tool. The tracking ID for this site is `vzxetyyb6b`. The CI injects it into every page. It is already present on:
- All content pages (injected by CI)
- shop.html (manually present, CI detects it and skips)

Pages created locally before pushing will be missing it until CI runs. This is fine — do not manually add it to new pages. CI handles it.

The Clarity tag is injected before `</head>`. Do not include it manually in new page templates; it will be duplicated if you do and CI tries to inject it again (the CI checks for the marker string first, so actually it won't duplicate — but it's cleaner to omit it from templates and let CI handle it).

---

## 20. `staticwebapp.config.json` — Routing, Caching, and Security

This file controls how Azure serves the site. Misunderstanding it causes confusing behavior.

### URL Rewrites (Extensionless URLs)
Currently configured rewrites:
```
/          → /index.html
/blog      → /blog/index.html
/shop      → /shop.html
/faq       → /faq.html
/reviews   → /reviews.html
/about     → /about.html
/contact   → /contact.html
/videos    → /videos.html
/how-to-wear → /how-to-wear.html
/influencer  → /influencer.html
/thank-you   → /thank-you.html
/privacy     → /privacy.html
/terms       → /terms.html
/compare     → /compare.html
```

**New pages do NOT get automatic extensionless rewrites.** If you want `/questions` to work alongside `/questions/index.html`, add an entry:
```json
{ "route": "/questions", "rewrite": "/questions/index.html" }
```
Without it, `/questions` hits the `navigationFallback` and silently serves `index.html`.

### The navigationFallback — The Silent 404 Trap
```json
"navigationFallback": {
  "rewrite": "/index.html",
  "exclude": ["/blog/*", "/css/*", "/js/*", "/images/*", "/*.png", ...]
}
```
Combined with:
```json
"404": { "rewrite": "/index.html", "statusCode": 200 }
```

**Effect:** Any URL that doesn't match a real file or configured route returns the homepage with a 200 status — not a 404. This means:
- Mistyped URLs silently serve the homepage instead of showing an error
- During development, a missing page won't obviously 404 — it will serve the homepage, which can be confusing
- Google will NOT index the homepage for those URLs because the canonical tags are correct, but crawler errors may not surface immediately

**New directories need to be added to the fallback exclusion list** if they contain non-HTML assets (otherwise Azure might try to serve them as rewritten HTML). The `/questions/` directory works fine because it only contains HTML.

### Cache Headers
```
CSS and JS files (/css/*, /js/*): 7 days (604800 seconds)
Image files (/images/*):          30 days (2592000 seconds)
HTML files:                        no explicit cache header (browser default, effectively no-cache)
```

**Implication:** CSS and JS changes won't be visible to returning visitors for up to 7 days unless you change the filename or add a cache-busting query string. HTML changes deploy immediately. If you update `styles.css`, consider whether returning users seeing the old CSS for a week is a problem.

### Security Headers (Applied to All Responses)
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
```

The dashboard route (`/dashboard`, `/dashboard.html`) gets additional headers: `X-Robots-Tag: noindex, nofollow` and `Cache-Control: no-store`.

**Pattern for any private/auth-required page:** Add both the extensionless route and the `.html` route to the config with `noindex, nofollow` and `no-store` headers. Do not rely on `<meta name="robots">` alone for private pages — the HTTP header is authoritative.

---

## 21. Utility CSS Classes — Full Reference

These classes are defined in `/css/styles.css` and are available on every page. Use them before writing new inline styles.

### Layout
```css
.container        /* max-width: 1140px, margin: auto — wraps section content */
```
Usage: `<div class="container"><h2>...</h2></div>`

### Typography
```css
.eyebrow          /* 11px, 700 weight, 3px letter-spacing, uppercase, accent color */
                  /* Used above section headings as a category label */

.section-heading  /* Barlow Condensed, clamp(38px–58px), 900 weight, uppercase */
                  /* The main h2 style for homepage/landing sections */
                  /* .section-heading em → accent color, not italic */
```

### Buttons
```css
.btn-primary      /* Blue filled pill — primary CTA on light backgrounds */
                  /* Hover: darkens + rises (translateY -2px) */

.btn-ghost        /* Transparent pill with white border — secondary CTA on dark backgrounds */
                  /* Hover: border and text brighten */

.btn-accent-lg    /* Larger blue pill — used in CTA banners and footers */
                  /* padding: 18px 52px — biggest button style */

.nav-cta          /* Blue pill in nav bar — "Buy Now" */
                  /* Applied as a modifier to a nav <a> tag */
```

**When to use which:**
- Hero section on dark background: `btn-primary` (main) + `btn-ghost` (secondary)
- CTA banner at page bottom: `btn-accent-lg`
- Mid-content CTA (inline-cta div): inline styles or `btn-accent-lg`
- Never use `btn-ghost` on a light/white background — it won't be visible

### Content Page Patterns
```css
.quick-answer     /* Blue-left-bordered box with "Quick Answer" eyebrow */
                  /* Use as first element in .cp-body for Q&A pages */

.callout          /* Navy-pale background, accent left border */
                  /* Use for important notes, warnings, key facts */

.inline-cta       /* Navy background rounded box — mid-page buy prompt */
                  /* Contains: h3, .price (big number), p, perks, button */

.related-grid     /* auto-fill grid of .rel-card links */
.rel-card         /* Individual related article card */
.rel-tag          /* Small accent-colored label above title in rel-card */
.rel-title        /* Barlow Condensed title inside rel-card */

.cp-body          /* Main content container: max-width 880px, padding 52px 20px */
.cp-hero          /* Dark navy hero for content/compare pages */
```

---

## 22. JavaScript — Per Page Type

Different page types load different scripts. Getting this wrong either breaks functionality or loads unnecessary code.

### shop.html (PDP)
```html
<script src="/js/nav.js"></script>
<script src="/js/affiliate.js"></script>
<script src="/js/sticky-bar.js"></script>
<!-- NO cart.js — shop.html uses inline Stripe handling -->
```
shop.html has extensive inline `<script>` at the bottom containing: `STRIPE_LINKS`, `STRIPE_BUNDLE_LINKS`, `GALLERY` object, `selectColor()`, `handleBuy()`, `showTab()`, gallery rendering, bundle option logic, and the shipping countdown timer.

### Standard Content Pages (compare, guide, learn, lifestyle, questions, use-case)
```html
<script src="/js/nav.js"></script>
<script src="/js/cart.js"></script>
```

### Pages With Affiliate Tracking (optional — for influencer landing pages)
```html
<script src="/js/nav.js"></script>
<script src="/js/affiliate.js"></script>
<script src="/js/cart.js"></script>
```

### Contact Page
```html
<script src="/js/nav.js"></script>
<script src="/js/contact.js"></script>
<script src="/js/cart.js"></script>
```

### What Each Script Does
| Script | Purpose |
|---|---|
| `nav.js` | Mobile menu toggle, scroll-reveal (`IntersectionObserver`), FAQ accordion (`toggleFaq()`), toast notifications |
| `cart.js` | Cart drawer state, `localStorage` persistence, `openCart()`, `closeCart()`, `addToCart()`, `proceedToCheckout()` |
| `affiliate.js` | Reads `?via=` URL param → 30-day cookie; exposes `window.getStripeLink(url)` globally; rewrites `.stripe-link` elements |
| `contact.js` | EmailJS form submission (service `service_qmhg44e`, template `template_gsu1hbe`) |
| `sticky-bar.js` | Watches scroll position; shows/hides fixed bottom buy bar when main buy button leaves viewport |

---

## 23. Affiliate Link Pattern

To make any buy button affiliate-trackable, use the `stripe-link` class with a `data-stripe-url` attribute instead of a plain `href`. `affiliate.js` rewrites the `href` on `DOMContentLoaded`.

```html
<!-- Affiliate-tracked buy button (any page that loads affiliate.js) -->
<a class="stripe-link btn-accent-lg"
   data-stripe-url="https://buy.stripe.com/6oU00lcs41MK2FffDO93y02"
   href="https://buy.stripe.com/6oU00lcs41MK2FffDO93y02">
  Buy Now — $19.99
</a>
```

On shop.html, `handleBuy()` calls `window.getStripeLink(stripeUrl)` directly before redirecting — the class pattern is not needed there.

The affiliate value flows: `?via=CODE` → `st_via` cookie (30 days) → `client_reference_id=CODE` appended to Stripe URL → Endorsely attribution.

**Pages that don't load `affiliate.js`:** The `getStripeLink()` function won't exist. `handleBuy()` on shop.html handles this with a fallback: `(typeof getStripeLink === 'function') ? getStripeLink(u) : u`.

---

## 24. The `/for/` Directory — What It Actually Is

This directory is frequently misunderstood. It is NOT:
- A redirect from `/for/X.html` to `/X.html`
- A set of canonical aliases
- Duplicate content pages

It IS:
- **Independently canonical pages** that each have their own `<link rel="canonical">` pointing to themselves
- **Different content and keyword angles** than the root version of the same topic
- A strategy for capturing multiple keyword clusters around the same audience

Example: `/military.html` and `/for/military.html` are both indexed, both canonical, both target slightly different queries. Neither redirects to the other.

**The naming convention:** `/for/X.html` pages often use slightly different titles, different hero copy, and different keyword targeting than root pages. They are separate pSEO pages that happen to share an audience with a root page.

**When to create a `/for/` page vs a root page:**
- Root page (`/military.html`): the primary, most comprehensive treatment of the topic, highest internal link priority
- `/for/military.html`: an alternate angle (different keyword cluster, slightly different framing) that captures searches the root page won't

**Do not set `/for/X.html` canonical to `/X.html`** — that signals to Google that the `/for/` page is a duplicate and should be ignored. Let both self-canonicalize.

---

## 25. Image Strategy — CDN vs Local

### CDN Images (Product Photography)
All product images are hosted on the Kinor Partners CDN:
```
https://kinorpartners.com/cdn/shop/files/FILENAME.png?v=1773081951
```

The `?v=` parameter is a cache-busting version string. Do not change it unless the image file itself changes on the CDN. All product image references across the site use this same version string — if it changes, search-and-replace across all HTML files.

Key product images:
```
MainPDP-Black.png     ← Primary product shot (OG image for entire site)
Features-Black.png    ← Feature callout graphic
FeelsRight-Black.png
SmartDesign-Black.png
Main_Image.png        ← Overview shot
LookYourBestAllDayLong.png
ComfortInAction.png
HowToWear.png
Before_After.png
```

### Local Images (`/images/`)
Supporting images that don't need CDN speed:
```
/images/belt-white.png
/images/belt-grey.png
/images/payment/amex.svg
/images/payment/apple-pay.svg
/images/payment/google-pay.svg
```

### Rule of Thumb
- Product photography → CDN URL
- Payment icons, UI elements, local assets → `/images/`
- Never hotlink images from external sites you don't control (they can change or block hotlinking)

### Alt Text Requirement
Every `<img>` needs a descriptive `alt` attribute. For product images, include the color variant:
```html
<img src="...MainPDP-Black.png" alt="Shirt Tucker rubber belt — Black"/>
<img alt="American Express" src="/images/payment/amex.svg"/>
```
Empty `alt=""` is valid only for purely decorative images with no informational content.

---

## 26. `_shared.html` — Three Files, One Purpose, Frequent Confusion

There are three template-related files and they serve distinct roles:

| File | Role | Authoritative For |
|---|---|---|
| `shop.html` | The actual product page AND the human-edited footer source | Footer content (what you intend) |
| `_shared.html` (root) | Full page template reference: nav + cart drawer + footer | Human reference; used when building new pages |
| `pages/_shared.html` | Older/subset template used by some legacy pages | Legacy reference only — prefer root `_shared.html` |
| `update_site.py` | Contains `CANONICAL_FOOTER` string | What CI actually deploys to all pages |

**The four-way sync problem:**
When you update the footer, you must update all four:
1. `shop.html` — the user-facing page
2. `_shared.html` — the template reference
3. `pages/_shared.html` — legacy template reference (if still in use)
4. `CANONICAL_FOOTER` in `update_site.py` — what actually gets deployed

Miss any one of these and either the template reference is stale (confusing for future development) or the CI reverts your changes.

**Practical approach:** Treat `update_site.py`'s `CANONICAL_FOOTER` as the ground truth for what's live. When in doubt, read that string — it's what every page actually contains after CI runs.

---

## 27. Heading Hierarchy and the `<em>` Pattern

This site uses a specific typographic convention that is not standard HTML semantics. Understanding it prevents writing visually broken pages.

### The `<em>` in Headings Is NOT Italic
```html
<h1>KEEP YOUR SHIRT <em>TUCKED IN</em></h1>
<h2>HOW IT <em>WORKS</em></h2>
```
CSS on this site sets `em { font-style: normal }` inside headings and applies `color: var(--accent)` (blue) or `color: var(--gold)` (yellow) to it. `<em>` is purely a styling hook here — it makes the last 1-3 words stand out in the accent color.

This is applied consistently across all hero h1s and section h2s. Breaking this pattern (using `<strong>` instead, or actual italic text) visually degrades the page.

### Correct Hierarchy
```
<h1>  One per page. The main topic. Always uses Barlow Condensed 900 via class or inline.
<h2>  Section headings. 3-6 per page. All-caps, Barlow Condensed, may have <em>.
<h3>  Subsection headings. Smaller, still Barlow Condensed 900 uppercase.
<h4>  Card/list item headings. Used inside components.
```

**Never skip a level.** h1 → h3 (skipping h2) is a Google quality signal against the page.

---

## 28. Adding New Sections/Directories — Full Procedure

When creating a new content section (like `/questions/` was created), follow this complete checklist to avoid the orphan/routing issues encountered.

### Step 1: Plan the Canonical URL Structure
Decide before creating files: will this be `/newdir/page.html` or `/page.html`? The canonical URL must match the file path exactly. Changing it later requires updating every page's canonical tag and all internal links.

### Step 2: Create the Pages
- Use `_shared.html` as the nav/cart/footer template
- Set canonical URL to final intended URL
- Set BreadcrumbList: Home → New Section → Page
- Set og:type appropriately

### Step 3: Create the Hub/Index Page
Every new directory needs a `index.html` hub:
- Lists all pages in the directory grouped by category
- Has its own canonical (`/newdir/`)
- Uses `CollectionPage` schema type
- Gets linked from footer before anything else

### Step 4: Wire Into Navigation
- Add to footer's "Learn" column in **shop.html** (CI propagates from here)
- Add to footer in **_shared.html** (template reference)
- Add to footer in **pages/_shared.html** if still in use
- Add to footer in **`CANONICAL_FOOTER` in `update_site.py`** (what CI actually deploys)
- Add link from most relevant existing page (e.g., faq.html → questions hub)
- Optionally add to nav — but that requires manual per-page edits or a script

### Step 5: Update staticwebapp.config.json
- Add extensionless URL rewrite if desired: `{ "route": "/newdir", "rewrite": "/newdir/index.html" }`
- If the directory contains non-HTML assets, add it to the `navigationFallback.exclude` list

### Step 6: Update Sitemap
- Add the hub page with priority 0.75
- Add all individual pages with priority appropriate to content type
- Validate XML before pushing

### Step 7: Push and Request Indexing
- Push to main
- Wait for CI auto-commit (check GitHub Actions tab)
- Pull the auto-commit locally
- Submit sitemap in Google Search Console
- Manually request indexing for the hub page and top 5–10 individual pages

---

## 29. The Soft-404 Development Trap

Because `staticwebapp.config.json` maps all unmatched routes to `/index.html` with a 200 status, missing pages are invisible during development:

```
You request: https://www.shirt-tucker.com/questions/missing-page.html
You get:     Homepage HTML with HTTP 200
```

This means:
- A broken link to a non-existent page looks like it "works" — it just loads the homepage
- If you mistype a file path in an `<href>`, you won't see a 404 error in the browser
- Google will eventually figure out these are soft 404s (same content as homepage, wrong canonical) but it takes time and wastes crawl budget

**How to detect soft 404s:**
- Check Google Search Console → Coverage → "Soft 404" category
- Compare `<title>` of the response to the expected page title
- Run `curl -s https://www.shirt-tucker.com/your-url.html | grep '<title>'` — if you get "Shirt Tucker — Never Re-Tuck Your Shirt Again" for a URL that should be a content page, it's a soft 404
