import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping Info — US & International Delivery',
  description:
    'AnnoyingKids shipping details — US and international rates, print-on-demand timelines, and tracking information.',
  alternates: { canonical: 'https://www.annoyingkids.com/shipping' },
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-space text-neon-green text-sm uppercase tracking-widest">
            Getting Your Chaos
          </span>
          <h1 className="font-bungee text-4xl sm:text-5xl text-white mt-4">
            Shipping <span className="text-neon-blue">Info</span>
          </h1>
        </div>

        <div className="space-y-8">
          {/* Print on demand note */}
          <div className="bg-neon-blue/10 border border-neon-blue/30 rounded-xl p-6">
            <h2 className="font-bungee text-neon-blue text-lg mb-2">
              🖨️ Made When You Order
            </h2>
            <p className="font-space text-gray-400 text-sm leading-relaxed">
              Every item is printed on demand after you place your order. This means
              zero waste and fresher products — but it also means orders need a
              production window before they ship.
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="font-bungee text-white text-lg mb-4">
              Estimated Timeline
            </h2>
            <div className="space-y-4">
              {[
                { step: '1', label: 'Production', time: '2–5 business days', color: 'neon-pink' },
                { step: '2', label: 'US Standard Shipping', time: '3–7 business days', color: 'neon-green' },
                { step: '3', label: 'International Shipping', time: '2–4 weeks', color: 'neon-blue' },
              ].map((row) => (
                <div key={row.step} className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full bg-${row.color}/20 border border-${row.color}/30 flex items-center justify-center font-bungee text-${row.color} text-sm shrink-0`}>
                    {row.step}
                  </span>
                  <div className="flex-1 flex items-center justify-between">
                    <span className="font-space text-gray-300 text-sm">{row.label}</span>
                    <span className="font-bungee text-white text-sm">{row.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rates */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="font-bungee text-white text-lg mb-4">Shipping Rates</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-dark-border">
                <span className="font-space text-gray-400 text-sm">US Standard</span>
                <span className="font-bungee text-neon-green">FREE</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-dark-border">
                <span className="font-space text-gray-400 text-sm">International</span>
                <span className="font-space text-gray-300 text-sm">Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="font-space text-gray-400 text-sm">Express (where available)</span>
                <span className="font-space text-gray-300 text-sm">Shown at checkout</span>
              </div>
            </div>
          </div>

          {/* Tracking */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="font-bungee text-white text-lg mb-2">Tracking Your Order</h2>
            <p className="font-space text-gray-400 text-sm leading-relaxed">
              You will receive a shipping confirmation email with a tracking link once
              your order leaves our print facility. Check your spam folder if you do
              not see it within 5 business days of ordering. You can also{' '}
              <Link href="/contact" className="text-neon-pink hover:underline">
                contact us
              </Link>{' '}
              with your order number for an update.
            </p>
          </div>

          {/* Customs */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h2 className="font-bungee text-white text-lg mb-2">International Orders & Customs</h2>
            <p className="font-space text-gray-400 text-sm leading-relaxed">
              International customers are responsible for any local customs, duties,
              or import taxes. These are not included in the product price or shipping
              fee and are collected by your local customs authority.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/faq"
            className="font-space text-neon-pink hover:underline text-sm"
          >
            More questions? See our FAQ →
          </Link>
        </div>
      </div>
    </div>
  );
}
