import type { Metadata } from 'next';
import StoriesClient from './StoriesClient';

export const metadata: Metadata = {
  title: 'Kid Stories — Naughty by Nature, Good at Heart',
  description: 'Short stories about kids who cause chaos but always mean well — pranks, misunderstandings and last-minute saves. Every story ends with a smile, not a lecture.',
  alternates: { canonical: 'https://annoyingkids.com/stories' },
  openGraph: {
    title: 'Kid Stories — Naughty by Nature, Good at Heart',
    description: 'Short stories about kids who cause chaos but always mean well — pranks, misunderstandings and last-minute saves. Every story ends with a smile, not a lecture.',
    url: 'https://annoyingkids.com/stories',
    siteName: 'AnnoyingKids',
    type: 'website',
    images: [{ url: 'https://annoyingkids.com/opengraph-image.png', width: 1200, height: 630, alt: 'AnnoyingKids Stories' }],
  },
  twitter: { card: 'summary_large_image', images: ['https://annoyingkids.com/opengraph-image.png'] },
};

export default function StoriesPage() {
  return <StoriesClient />;
}
