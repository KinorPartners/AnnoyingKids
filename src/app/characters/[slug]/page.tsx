import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CHARACTERS, getCharacter } from '@/lib/characters';
import { Kid, Dad, Mom, Grandma, Grandpa, Dinosaur } from '@/components/Characters';

interface Props {
  params: Promise<{ slug: string }>;
}

const CHARACTER_COMPONENTS: Record<string, React.ReactNode> = {
  guy:   <Kid size={120} />,
  buddy: <span style={{ fontSize: 108, lineHeight: 1 }}>🐕</span>,
  pap:   <Dad size={120} />,
  mal:   <Mom size={120} />,
  mimi:  <Grandma size={120} />,
  barry: <Grandpa size={120} />,
};

export function generateStaticParams() {
  return CHARACTERS.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const char = getCharacter(slug);
  if (!char) return {};
  return {
    title: `${char.name} — ${char.role}`,
    description: char.tagline,
    alternates: { canonical: `https://www.annoyingkids.com/characters/${slug}` },
  };
}

const FACT_COLORS = [
  { bg: 'rgba(255,45,120,0.10)',  border: 'rgba(255,45,120,0.25)',  num: '#ff2d78' },
  { bg: 'rgba(0,240,255,0.08)',   border: 'rgba(0,240,255,0.25)',   num: '#00f0ff' },
  { bg: 'rgba(57,255,20,0.08)',   border: 'rgba(57,255,20,0.25)',   num: '#39ff14' },
  { bg: 'rgba(255,242,0,0.08)',   border: 'rgba(255,242,0,0.25)',   num: '#fff200' },
  { bg: 'rgba(168,85,247,0.10)',  border: 'rgba(168,85,247,0.25)',  num: '#a855f7' },
  { bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.25)',  num: '#f59e0b' },
];

export default async function CharacterPage({ params }: Props) {
  const { slug } = await params;
  const char = getCharacter(slug);
  if (!char) notFound();

  const otherChars = CHARACTERS.filter(c => c.slug !== slug);

  return (
    <div className="min-h-screen">

      {/* Back */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <Link href="/characters" className="font-space text-gray-500 text-sm hover:text-neon-pink transition-colors">
          ← Back to the Gang
        </Link>
      </div>

      {/* Character hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">

          {/* Big character display */}
          <div
            className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-3xl flex items-center justify-center flex-shrink-0"
            style={{
              background: char.color + '15',
              border: `2px solid ${char.color}40`,
              boxShadow: `0 0 60px ${char.color}25`,
            }}
          >
            {CHARACTER_COMPONENTS[char.slug] ?? <span style={{ fontSize: 108 }}>{char.emoji}</span>}
          </div>

          {/* Name / role */}
          <div className="text-center sm:text-left">
            <p className="font-space text-xs uppercase tracking-widest mb-1" style={{ color: char.color }}>
              {char.role} · Age {char.age}
            </p>
            <h1 className="font-bungee text-5xl sm:text-7xl text-white leading-none mb-4">
              {char.name}
            </h1>
            <p
              className="font-space text-lg sm:text-xl leading-relaxed max-w-lg"
              style={{ color: char.color + 'cc' }}
            >
              {char.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px mb-12" style={{ background: `linear-gradient(90deg, transparent, ${char.color}50, transparent)` }} />
      </div>

      {/* Origin story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <h2 className="font-bungee text-2xl sm:text-3xl text-white mb-6">
          Origin <span style={{ color: char.color }}>Story</span>
        </h2>
        <div className="space-y-5">
          {char.origin.split('\n\n').map((para, i) => (
            <p key={i} className="font-space text-gray-300 leading-relaxed text-base">
              {para}
            </p>
          ))}
        </div>
      </section>

      {/* Relationship with Guy */}
      {char.slug !== 'guy' && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: char.color + '0d', border: `1px solid ${char.color}30` }}
          >
            <h2 className="font-bungee text-xl sm:text-2xl text-white mb-4 flex items-center gap-2">
              <Kid size={28} />
              <span>With <span style={{ color: char.color }}>Guy</span></span>
            </h2>
            <div className="space-y-4">
              {char.relationship.split('\n\n').map((para, i) => (
                <p key={i} className="font-space text-gray-300 leading-relaxed text-base">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {char.slug === 'guy' && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: char.color + '0d', border: `1px solid ${char.color}30` }}
          >
            <h2 className="font-bungee text-xl sm:text-2xl text-white mb-4">
              The <span style={{ color: char.color }}>Cast</span> Around Him
            </h2>
            <div className="space-y-4">
              {char.relationship.split('\n\n').map((para, i) => (
                <p key={i} className="font-space text-gray-300 leading-relaxed text-base">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fun facts */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <h2 className="font-bungee text-2xl sm:text-3xl text-white mb-6">
          Fun <span style={{ color: char.color }}>Facts</span>
        </h2>
        <div className="space-y-4">
          {char.facts.map((fact, i) => {
            const col = FACT_COLORS[i % FACT_COLORS.length];
            return (
              <div
                key={i}
                className="rounded-2xl p-5 flex gap-4 items-start"
                style={{ background: col.bg, border: `1px solid ${col.border}` }}
              >
                <div
                  className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bungee text-lg"
                  style={{ background: col.bg, border: `2px solid ${col.border}`, color: col.num, boxShadow: `0 0 10px ${col.border}` }}
                >
                  {i + 1}
                </div>
                <p className="font-space text-gray-300 text-sm leading-relaxed pt-1">{fact}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Merch CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-dark-card border border-neon-pink/20 rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-bungee text-white text-lg">Rep the chaos 😈</p>
            <p className="font-space text-gray-400 text-sm mt-1">
              Wear the energy. Browse the full AnnoyingKids merch collection.
            </p>
          </div>
          <Link
            href="/products"
            className="px-6 py-3 bg-neon-pink font-bungee text-white text-sm uppercase rounded-lg
              hover:shadow-[0_0_20px_rgba(255,45,120,0.5)] transition-all duration-300 hover:scale-105 whitespace-nowrap"
          >
            Shop the Merch →
          </Link>
        </div>
      </section>

      {/* Other characters */}
      <section className="border-t border-dark-border bg-dark-surface/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-bungee text-xl text-white mb-6">The Rest of the <span className="text-neon-pink">Gang</span></h2>
          <div className="flex flex-wrap gap-3">
            {otherChars.map(c => (
              <Link
                key={c.slug}
                href={`/characters/${c.slug}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 hover:scale-105"
                style={{ borderColor: c.color + '33', background: c.color + '0a', color: c.color }}
              >
                <span className="font-bungee text-sm">{c.name}</span>
                <span className="font-space text-xs opacity-70">{c.role}</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4 flex-wrap">
            <Link
              href="/game"
              className="px-8 py-3 bg-neon-pink font-bungee text-white uppercase rounded-xl
                hover:shadow-[0_0_20px_rgba(255,45,120,0.4)] hover:scale-105 transition-all"
            >
              🎮 Play Kid Chaos
            </Link>
            <Link
              href="/characters"
              className="px-8 py-3 border border-dark-border font-bungee text-gray-400 uppercase rounded-xl hover:border-gray-500 hover:text-white transition-all"
            >
              ← All Characters
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
