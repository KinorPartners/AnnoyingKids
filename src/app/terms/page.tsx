import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — AnnoyingKids',
  description: 'AnnoyingKids terms of service — use of the site, purchases, and content.',
  alternates: { canonical: 'https://www.annoyingkids.com/terms' },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-bungee text-4xl text-white">
            Terms of <span className="text-neon-blue">Service</span>
          </h1>
          <p className="font-space text-gray-500 mt-4 text-sm">
            Last updated: March 2026
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              title: '1. Use of This Site',
              body: `By using annoyingkids.com, you agree to these terms. The site and its contents are provided for lawful personal and commercial use only. You may not use the site to infringe on intellectual property, transmit harmful content, or interfere with site operations.`,
            },
            {
              title: '2. Products and Orders',
              body: `All products on this site are sold subject to availability. Because items are printed on demand, we reserve the right to cancel orders we cannot fulfill. Prices are subject to change without notice. We are not responsible for typographic errors in product descriptions or pricing.`,
            },
            {
              title: '3. Payment',
              body: `All payments are processed securely through Stripe. By placing an order, you authorize us to charge your selected payment method for the full order amount. All prices are in US dollars.`,
            },
            {
              title: '4. Shipping and Delivery',
              body: `Estimated shipping times are provided as a guide only and are not guaranteed. We are not responsible for delays caused by carriers, customs, weather, or other factors outside our control. Risk of loss passes to you upon delivery to the carrier.`,
            },
            {
              title: '5. Returns and Refunds',
              body: `Our return policy is described in detail on the Returns page. Refunds will be issued to the original payment method. We reserve the right to refuse returns that do not meet our policy criteria.`,
            },
            {
              title: '6. Intellectual Property',
              body: `All designs, graphics, and content on this site are the property of AnnoyingKids or its licensors. You may not reproduce, distribute, or create derivative works from our content without written permission.`,
            },
            {
              title: '7. Limitation of Liability',
              body: `AnnoyingKids is not liable for indirect, incidental, or consequential damages arising from use of this site or our products. Our maximum liability for any claim related to a purchase is limited to the amount you paid for that purchase.`,
            },
            {
              title: '8. Changes to These Terms',
              body: `We may update these terms at any time. Continued use of the site after changes constitutes acceptance of the new terms. The date at the top of this page indicates when the terms were last updated.`,
            },
            {
              title: '9. Contact',
              body: `Questions about these terms? Email legal@annoyingkids.com.`,
            },
          ].map((section) => (
            <div key={section.title} className="bg-dark-card border border-dark-border rounded-xl p-6">
              <h2 className="font-bungee text-white text-base mb-3">{section.title}</h2>
              <p className="font-space text-gray-400 text-sm leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
