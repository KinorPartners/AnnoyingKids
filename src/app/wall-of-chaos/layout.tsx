import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Wall of Chaos — Real Kids, Real Merch',
  description: 'Real kids wearing AnnoyingKids merch. Show off your gear, get on the wall, and join the community of professional troublemakers.',
  alternates: { canonical: 'https://annoyingkids.com/wall-of-chaos' },
  openGraph: {
    title: 'Wall of Chaos — Real Kids, Real Merch',
    description: 'Real kids wearing AnnoyingKids merch. Submit your photo and join the community.',
    url: 'https://annoyingkids.com/wall-of-chaos',
    siteName: 'AnnoyingKids',
    type: 'website',
    images: [{ url: 'https://annoyingkids.com/opengraph-image.png', width: 1200, height: 630, alt: 'Wall of Chaos — AnnoyingKids' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wall of Chaos — Real Kids, Real Merch',
    description: 'Real kids in AnnoyingKids gear. Submit yours and get on the wall.',
    images: ['https://annoyingkids.com/opengraph-image.png'],
  },
};

export default function WallOfChaosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
