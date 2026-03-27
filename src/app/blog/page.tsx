import Link from 'next/link';
import { ARTICLES } from '@/lib/blog';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Pranks, School Survival & Chaos',
  description: 'Articles for kids who live life at maximum chaos. Pranks, school survival guides, gaming tips and gift ideas.',
  alternates: { canonical: 'https://www.annoyingkids.com/blog' },
};

const CATEGORY_COLORS: Record<string, string> = {
  'Pranks & Chaos': 'text-neon-pink border-neon-pink/30 bg-neon-pink/10',
  'School Survival': 'text-neon-blue border-neon-blue/30 bg-neon-blue/10',
  'Personality & Identity': 'text-neon-green border-neon-green/30 bg-neon-green/10',
  'Gaming & Screen Culture': 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  'Gift Guides': 'text-neon-yellow border-neon-yellow/30 bg-neon-yellow/10',
  'Seasonal': 'text-orange-400 border-orange-400/30 bg-orange-400/10',
};

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-bungee text-5xl sm:text-7xl text-white mb-4 leading-tight">
          THE{' '}
          <span className="text-neon-pink" style={{ textShadow: '0 0 20px rgba(255,45,120,0.6)' }}>
            BLOG
          </span>
        </h1>
        <p className="font-space text-gray-400 text-lg max-w-2xl mx-auto">
          Pranks. School survival. Gaming. Chaos.{' '}
          <span className="text-neon-green">Advice for professional troublemakers.</span>
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex flex-col gap-6">
          {ARTICLES.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group block bg-dark-card border border-dark-border rounded-2xl p-6
                hover:border-neon-pink/40 hover:shadow-[0_0_30px_rgba(255,45,120,0.1)] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full text-xs font-space font-bold border ${CATEGORY_COLORS[article.category] ?? 'text-gray-400 border-gray-700'}`}>
                  {article.category}
                </span>
                <span className="font-space text-gray-600 text-xs">{article.readingTime}</span>
                <span className="font-space text-gray-600 text-xs">{new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <h2 className="font-bungee text-white text-xl sm:text-2xl leading-tight mb-2 group-hover:text-neon-pink transition-colors">
                {article.title}
              </h2>
              <p className="font-space text-gray-400 text-sm leading-relaxed mb-3">
                {article.excerpt}
              </p>
              <span className="font-space text-neon-pink text-sm group-hover:underline">
                Read more →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
