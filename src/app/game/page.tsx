import type { Metadata } from 'next';
import ChaosGame from '@/components/ChaosGame';

export const metadata: Metadata = {
  title: 'Kid Chaos — Free Browser Game for Kids',
  description: 'Play Kid Chaos free in your browser — escape your parents, dodge Grandma, collect candy, and outrun Rex the dinosaur. How far can you run?',
  alternates: { canonical: 'https://annoyingkids.com/game' },
  openGraph: {
    title: 'Kid Chaos — Free Browser Game for Kids',
    description: 'Play Kid Chaos free in your browser — escape your parents, dodge Grandma, collect candy, and outrun Rex. Free, no download needed.',
    url: 'https://annoyingkids.com/game',
    siteName: 'AnnoyingKids',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kid Chaos — Free Browser Game for Kids',
    description: 'Escape your parents, dodge Grandma, outrun Rex the dinosaur. Free browser game.',
  },
};

const gameSchema = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Kid Chaos',
  description: 'A free browser game where you escape your parents, dodge Grandma, collect candy, and outrun Rex the dinosaur.',
  url: 'https://annoyingkids.com/game',
  genre: 'Arcade',
  playMode: 'SinglePlayer',
  gamePlatform: 'Web browser',
  applicationCategory: 'Game',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'AnnoyingKids', url: 'https://annoyingkids.com' },
};

export default function GamePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }} />
      <div className="overflow-hidden touch-none">
        <ChaosGame fullPage />
      </div>
    </>
  );
}
