import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Returns & Exchanges — 30-Day Hassle-Free Policy',
  description:
    '30-day hassle-free returns on all AnnoyingKids orders. Damaged item? Wrong size? We make it right.',
  alternates: { canonical: 'https://annoyingkids.com/returns' },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://annoyingkids.com' },
    { '@type': 'ListItem', position: 2, name: 'Returns & Exchanges', item: 'https://annoyingkids.com/returns' },
  ],
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="max-w-3xl mx-auto">
        <nav className="flex items-center gap-2 font-space text-sm mb-10" aria-label="Breadcrumb">
          <Link href="/" className="text-gray-500 hover:text-neon-pink transition-colors">Home</Link>
          <span className="text-gray-700">/</span>
          <span className="text-neon-pink">Returns &amp; Exchanges</span>
        </nav>
        <div className="text-center mb-16">
          <span className="font-space text-neon-green text-sm uppercase tracking-widest">
            No Drama
          </span>
          <h1 className="font-bungee text-4xl sm:text-5xl text-white mt-4">
            Returns <span className="text-neon-pink">&</span> Exchanges
          </h1>
          <p className="font-space text-gray-500 mt-4">
            30-day returns. No questions asked.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-neon-green/10 border border-neon-green/30 rounded-xl p-6">
            <h2 className="font-bungee text-neon-green text-lg mb-2">
              🔄 Our Policy
            </h2>
            <p className="font-space text-gray-400 text-sm leading-relaxed">
              If you are not happy with your order for any reason, contact us
              within 30 days of delivery and we will make it right — full refund,
              reprint, or exchange. No hoops to jump through.
            </p>
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl divide-y divide-dark-border">
            {[
              {
                title: 'Damaged or Defective Item',
                desc: 'Send us a photo of the issue within 30 days. We will reprint and ship a replacement at no cost, or issue a full refund — your choice.',
                color: 'neon-pink',
              },
              {
                title: 'Wrong Item Received',
                desc: 'If you received something different from what you ordered, contact us immediately. We will ship the correct item and arrange return of the wrong one.',
                color: 'neon-blue',
              },
              {
                title: 'Size Exchange',
                desc: 'Return the original item within 30 days and place a new order in the correct size. We will refund the returned item once it is received.',
                color: 'neon-green',
              },
              {
                title: 'Changed Your Mind',
                desc: 'Because items are printed on demand, we can accept returns within 30 days as long as the item is unworn and unwashed. Contact us to start the process.',
                color: 'neon-yellow',
              },
            ].map((item) => (
              <div key={item.title} className="px-6 py-5">
                <h3 className={`font-bungee text-${item.color} text-sm mb-2`}>
                  {item.title}
                </h3>
                <p className="font-space text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="font-bungee text-white text-lg mb-2">How to Start a Return</h2>
            <ol className="space-y-3 mt-4">
              {[
                'Email us at support@annoyingkids.com with your order number and reason',
                'Include a photo if the item is damaged or defective',
                'We will respond within 1 business day with next steps',
                'Refunds are processed within 5-10 business days of approval',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-neon-pink/20 border border-neon-pink/30 flex items-center justify-center font-bungee text-neon-pink text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="font-space text-gray-400 text-sm">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-neon-pink text-white font-bungee uppercase rounded-lg
              shadow-[0_0_20px_rgba(255,45,120,0.4)] hover:shadow-[0_0_30px_rgba(255,45,120,0.7)]
              transition-all duration-300 hover:scale-[1.02]"
          >
            Start a Return
          </Link>
        </div>
      </div>
    </div>
  );
}
