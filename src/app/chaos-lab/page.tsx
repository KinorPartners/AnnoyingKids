import type { Metadata } from 'next';
import ChaosLabClient from './ChaosLabClient';

export const metadata: Metadata = {
  title: 'Chaos Lab — Unleash Your Inner Troublemaker',
  description: 'Generate your chaos name, take the personality quiz, and unlock your inner troublemaker. AnnoyingKids Chaos Lab.',
  openGraph: {
    title: 'Chaos Lab — Unleash Your Inner Troublemaker',
    description: 'Generate your chaos name, take the personality quiz, and unlock your inner troublemaker.',
    url: 'https://www.annoyingkids.com/chaos-lab',
  },
};

export default function ChaosLabPage() {
  return <ChaosLabClient />;
}
