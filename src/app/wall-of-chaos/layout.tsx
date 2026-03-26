import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Wall of Chaos — Fan Photos',
  description: 'Real kids wearing AnnoyingKids merch. Submit your photo and join the Wall of Chaos.',
  alternates: { canonical: 'https://www.annoyingkids.com/wall-of-chaos' },
};

export default function WallOfChaosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
