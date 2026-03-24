import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — AnnoyingKids',
  description: 'AnnoyingKids privacy policy — how we collect, use, and protect your data.',
  alternates: { canonical: 'https://www.annoyingkids.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-bungee text-4xl text-white">
            Privacy <span className="text-neon-pink">Policy</span>
          </h1>
          <p className="font-space text-gray-500 mt-4 text-sm">
            Last updated: March 2026
          </p>
        </div>

        <div className="prose prose-invert max-w-none space-y-8">
          {[
            {
              title: 'Information We Collect',
              body: `When you place an order, we collect your name, email address, shipping address, and payment information. Payment details are handled securely by Stripe and are never stored on our servers. We also collect standard web analytics data (page views, traffic sources) via Google Analytics to improve the site.`,
            },
            {
              title: 'How We Use Your Information',
              body: `We use your information solely to fulfill your order, communicate about your purchase, and improve our products and website. We do not sell, rent, or trade your personal information to third parties. We may share your shipping details with our print fulfillment partner (Printify) to produce and ship your order.`,
            },
            {
              title: 'Cookies',
              body: `We use cookies to remember your cart contents and for Google Analytics. You can disable cookies in your browser settings, though this may affect cart functionality. We do not use advertising or tracking cookies beyond standard analytics.`,
            },
            {
              title: 'Data Security',
              body: `All data transmission on annoyingkids.com is encrypted via HTTPS. Payment processing is handled by Stripe, which is PCI-DSS Level 1 compliant — the highest level of payment security available.`,
            },
            {
              title: 'Your Rights',
              body: `You can request a copy of any personal data we hold about you, request deletion of your data, or opt out of any marketing emails at any time by contacting us at privacy@annoyingkids.com.`,
            },
            {
              title: 'Third-Party Services',
              body: `Our site integrates with Stripe (payments), Printify (print fulfillment), and Google Analytics (site analytics). Each of these services has their own privacy policy governing how they use data passed to them.`,
            },
            {
              title: 'Contact',
              body: `Questions about this policy? Email privacy@annoyingkids.com and we will respond within 2 business days.`,
            },
          ].map((section) => (
            <div key={section.title} className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h2 className="font-bungee text-white text-lg mb-3">{section.title}</h2>
              <p className="font-space text-gray-400 text-sm leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
