import type { Metadata } from 'next';
import StoriesClient from './StoriesClient';

export const metadata: Metadata = {
  title: 'Kid Stories — Naughty by Nature, Good at Heart',
  description: 'Short stories about kids who cause chaos but always mean well. Every story ends with a smile.',
  alternates: { canonical: 'https://annoyingkids.com/stories' },
  openGraph: {
    title: 'Kid Stories — Naughty by Nature, Good at Heart',
    description: 'Short stories about kids who cause chaos but always mean well. Every story ends with a smile.',
    url: 'https://annoyingkids.com/stories',
  },
};

export default function StoriesPage() {
  return <StoriesClient />;
}
