import type { Metadata } from 'next';
import CharactersScroll from './CharactersScroll';

export const metadata: Metadata = {
  title: 'Meet the Gang V2 — Scroll Experience',
  robots: 'noindex, nofollow',
};

export default function CharactersV2Page() {
  return <CharactersScroll />;
}
