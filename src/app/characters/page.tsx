import type { Metadata } from 'next';
import Link from 'next/link';
import { CHARACTERS } from '@/lib/characters';
import { Kid, Dad, Mom, Grandma, Grandpa, Dinosaur } from '@/components/Characters';

export const metadata: Metadata = {
  title: 'Meet the Gang',
  description: 'Guy, Buddy, Pap, Mal, Mimi, Barry — the cast behind Kid Chaos. Origin stories, fun facts, and the full chaos family.',
  alternates: { canonical: 'https://www.annoyingkids.com/characters' },
};

const CHARACTER_COMPONENTS: Record<string, React.ReactNode> = {
  guy:      <Kid size={72} />,
  buddy:    <span style={{ fontSize: 64, lineHeight: 1 }}>🐕</span>,
  pap:      <Dad size={72} />,
  mal:      <Mom size={72} />,
  mimi:     <Grandma size={72} />,
  barry:    <Grandpa size={72} />,
};

export default function CharactersPage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-neon-pink/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-blue/8 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="font-space text-neon-green text-xs uppercase tracking-widest">Kid Chaos Universe</span>
          <h1 className="font-bungee text-4xl sm:text-6xl text-white mt-3 mb-4 leading-none">
            MEET THE <span className="text-neon-pink">GANG</span>
          </h1>
          <p className="font-space text-gray-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Every great chaos story has a cast. Here&apos;s ours — the kid who started it all,
            the family trying to stop him, and the dog who definitely isn&apos;t helping.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/game"
              className="px-8 py-3 bg-neon-pink font-bungee text-white uppercase rounded-xl
                hover:shadow-[0_0_20px_rgba(255,45,120,0.5)] transition-all hover:scale-105"
            >
              🎮 Play the Game
            </Link>
            <Link
              href="/products"
              className="px-8 py-3 border border-neon-blue/40 font-bungee text-neon-blue uppercase rounded-xl
                hover:bg-neon-blue/10 hover:border-neon-blue/70 transition-all"
            >
              Shop the Merch
            </Link>
          </div>
        </div>
      </section>

      {/* Character cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHARACTERS.map((char) => (
            <Link
              key={char.slug}
              href={`/characters/${char.slug}`}
              className="group relative bg-dark-card border rounded-2xl overflow-hidden
                transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
              style={{ borderColor: char.color + '33' }}
            >
              {/* Color glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ boxShadow: `inset 0 0 40px ${char.color}22` }}
              />

              {/* Top accent bar */}
              <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, transparent, ${char.color}, transparent)` }} />

              <div className="p-6">
                {/* Character display */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: char.color + '15', border: `1px solid ${char.color}33` }}
                  >
                    {CHARACTER_COMPONENTS[char.slug]}
                  </div>
                  <div>
                    <p className="font-space text-xs uppercase tracking-widest mb-1" style={{ color: char.color }}>
                      {char.role}
                    </p>
                    <h2 className="font-bungee text-white text-2xl leading-none">{char.name}</h2>
                    <p className="font-space text-gray-500 text-xs mt-1">Age {char.age}</p>
                  </div>
                </div>

                <p className="font-space text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                  {char.tagline}
                </p>

                <div
                  className="flex items-center gap-1 font-bungee text-xs uppercase tracking-wider transition-all duration-300"
                  style={{ color: char.color }}
                >
                  Read their story
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </div>
            </Link>
          ))}

          {/* Dinosaur teaser card */}
          <div
            className="group relative bg-dark-card border border-red-500/20 rounded-2xl overflow-hidden
              opacity-80 hover:opacity-100 transition-all duration-300"
          >
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, transparent, #ef4444, transparent)' }} />
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 bg-red-500/10 border border-red-500/20">
                  <Dinosaur size={72} />
                </div>
                <div>
                  <p className="font-space text-xs uppercase tracking-widest mb-1 text-red-400">Uninvited Guest</p>
                  <h2 className="font-bungee text-white text-2xl leading-none">???</h2>
                  <p className="font-space text-gray-500 text-xs mt-1">Age: Old. Very old.</p>
                </div>
              </div>
              <p className="font-space text-gray-500 text-sm leading-relaxed mb-4">
                Nobody knows where it came from. Nobody asked. It shows up at level 10 and it does not come in peace.
              </p>
              <div className="font-space text-xs text-gray-600 italic">
                🔒 Story unlocks at Level 10
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Game CTA strip */}
      <section className="border-t border-dark-border bg-dark-surface/40 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-bungee text-2xl sm:text-3xl text-white mb-2">
            Now you know the <span className="text-neon-pink">cast</span>.
          </p>
          <p className="font-space text-gray-400 mb-6">
            Time to play. Can Guy outrun all of them?
          </p>
          <Link
            href="/game"
            className="inline-block px-10 py-4 bg-neon-pink font-bungee text-white text-xl uppercase rounded-xl
              shadow-[0_0_30px_rgba(255,45,120,0.4)] hover:scale-105 hover:shadow-[0_0_50px_rgba(255,45,120,0.6)] transition-all"
          >
            🎮 Play Kid Chaos
          </Link>
        </div>
      </section>
    </div>
  );
}
