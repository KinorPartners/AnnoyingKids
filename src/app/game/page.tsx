import type { Metadata } from 'next';
import ChaosGame from '@/components/ChaosGame';

export const metadata: Metadata = {
  title: 'Kid Chaos — Play the Game',
  description: 'Escape your family, collect candy and bonus items. The AnnoyingKids arcade game.',
};

export default function GamePage() {
  return (
    <div className="overflow-hidden touch-none">
      <ChaosGame fullPage />
    </div>
  );
}
