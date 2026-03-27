import type { Metadata } from 'next';
import ChaosGame from '@/components/ChaosGame';

export const metadata: Metadata = {
  title: 'Kid Chaos — Free Browser Game for Kids',
  description: 'Play Kid Chaos free in your browser — escape parents, dodge Grandma, outrun Rex the dinosaur. Levels get harder. How far can Guy run?',
  alternates: { canonical: 'https://www.annoyingkids.com/game' },
};

export default function GamePage() {
  return (
    <div className="overflow-hidden touch-none">
      <ChaosGame fullPage />
    </div>
  );
}
