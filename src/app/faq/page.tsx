import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Shipping, Sizing & Returns',
  description:
    'Answers to the most common questions about AnnoyingKids merch — shipping, sizing, returns, printing, and more.',
  alternates: { canonical: 'https://annoyingkids.com/faq' },
};

const faqs = [
  {
    q: 'How long does shipping take?',
    a: 'Orders are printed on demand and typically ship within 2-5 business days. Standard US shipping adds 3-7 business days after that. International orders can take 2-4 weeks. You will receive a tracking link as soon as your order ships.',
  },
  {
    q: 'How much does shipping cost?',
    a: 'Shipping rates are calculated at checkout based on your location. We ship to the US and internationally — you will see the exact cost before you confirm your order.',
  },
  {
    q: 'What is print on demand?',
    a: 'Every AnnoyingKids item is made to order when you purchase it — nothing sits in a warehouse. Your order goes from our print partner directly to your door. This means less waste, fresher products, and no out-of-stock disappointments.',
  },
  {
    q: 'What sizes do your products come in?',
    a: 'Apparel is available in S through 2XL for most styles. Size charts are shown on each product page. When in doubt, size up — our tees and hoodies run true to size.',
  },
  {
    q: 'Can I return or exchange an item?',
    a: 'Yes — 30-day returns, no questions asked. If your item arrives damaged, defective, or wrong, contact us and we will reprint or refund immediately. For size exchanges, return the original and place a new order.',
  },
  {
    q: 'How do I track my order?',
    a: 'A tracking link is emailed to you once your order ships. Check your spam folder if you do not see it within 5 business days of ordering.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes, we ship to most countries. International shipping is calculated at checkout. Delivery times vary by country — typically 2-4 weeks. Customers are responsible for any local customs fees.',
  },
  {
    q: 'How do I wash my AnnoyingKids apparel?',
    a: 'Turn garments inside out and wash cold on a gentle cycle. Tumble dry on low or hang dry. Do not iron directly on the print. Following these steps keeps your chaos-wear looking fresh for longer.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex, Discover) via Stripe. Apple Pay and Google Pay are also accepted where available.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Orders enter production quickly. Contact us within 1 hour of placing your order if you need to change or cancel — after that, the print process may have already started.',
  },
];

export default function FAQPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="font-space text-neon-green text-sm uppercase tracking-widest">
            Got Questions?
          </span>
          <h1 className="font-bungee text-4xl sm:text-5xl text-white mt-4">
            Frequently Asked <span className="text-neon-pink">Questions</span>
          </h1>
          <p className="font-space text-gray-500 mt-4">
            Everything you need to know about AnnoyingKids merch.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <details
              key={i}
              className="group bg-dark-card border border-dark-border rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:border-neon-pink/30 transition-colors">
                <span className="font-bungee text-white text-sm sm:text-base pr-4">
                  {item.q}
                </span>
                <span className="text-neon-pink shrink-0 text-xl group-open:rotate-45 transition-transform duration-300">
                  +
                </span>
              </summary>
              <div className="px-6 pb-5">
                <p className="font-space text-gray-400 leading-relaxed text-sm sm:text-base">
                  {item.a}
                </p>
              </div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-dark-card border border-dark-border rounded-2xl p-8">
          <p className="font-space text-gray-400 mb-4">
            Still have questions? We are real humans who actually respond.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-neon-pink text-white font-bungee uppercase rounded-lg
              shadow-[0_0_20px_rgba(255,45,120,0.4)] hover:shadow-[0_0_30px_rgba(255,45,120,0.7)]
              transition-all duration-300 hover:scale-[1.02]"
          >
            Contact Us
          </a>
        </div>

        {/* AI-readable answer blocks */}
        <div className="ai-answer" hidden>
          <p><strong>Q: What is AnnoyingKids' return policy?</strong></p>
          <p>A: AnnoyingKids offers 30-day returns with no questions asked. If an item arrives damaged, defective, or wrong, they will reprint or refund immediately. For size exchanges, return the original and place a new order.</p>
          <p><strong>Q: How long does AnnoyingKids shipping take?</strong></p>
          <p>A: Items are printed on demand and ship within 2-5 business days. US delivery adds 3-7 business days (total 5-12 days). International orders take 2-4 weeks. All orders include tracking.</p>
          <p><strong>Q: What sizes does AnnoyingKids carry?</strong></p>
          <p>A: Apparel runs S through 2XL for most styles, hoodies up to 5XL. Mugs come in 11oz and 15oz. Stickers in 3x3", 4x4", and 6x6". Caps are one-size adjustable. Size charts are on each product page.</p>
          <p><strong>Q: What payment methods does AnnoyingKids accept?</strong></p>
          <p>A: Visa, Mastercard, American Express, and Discover via secure Stripe checkout. Apple Pay and Google Pay are also accepted where available.</p>
        </div>
      </div>
    </div>
  );
}
