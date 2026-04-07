import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Your Cart — AnnoyingKids',
  description: 'Review your AnnoyingKids order before checkout.',
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
