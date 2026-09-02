import type { Metadata } from 'next';
import ChaosLabClient from './ChaosLabClient';

export const metadata: Metadata = {
  title: 'Chaos Lab — Unleash Your Inner Troublemaker',
  description:
    'Generate your chaos name, take the troublemaker personality quiz and unlock your chaos rank. Free interactive tools from AnnoyingKids — no sign-up, just chaos.',
  alternates: { canonical: 'https://annoyingkids.com/chaos-lab' },
  openGraph: {
    title: 'Chaos Lab — Unleash Your Inner Troublemaker',
    description:
      'Generate your chaos name, take the troublemaker personality quiz and unlock your chaos rank. Free interactive tools — no sign-up needed, just chaos.',
    url: 'https://annoyingkids.com/chaos-lab',
    siteName: 'AnnoyingKids',
    type: 'website',
    images: [{ url: 'https://annoyingkids.com/opengraph-image.png', width: 1200, height: 630, alt: 'AnnoyingKids Chaos Lab' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://annoyingkids.com/opengraph-image.png'] },
};

export default function ChaosLabPage() {
  return <ChaosLabClient />;
}
