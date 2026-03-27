import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ARTICLES, getArticle } from '@/lib/blog';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `https://www.annoyingkids.com/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      url: `https://www.annoyingkids.com/blog/${article.slug}`,
      siteName: 'AnnoyingKids',
    },
  };
}

const CARD_COLORS = [
  { bg: 'rgba(255,45,120,0.12)',  border: 'rgba(255,45,120,0.3)',  text: '#ff2d78',  num: '#ff2d78'  },
  { bg: 'rgba(0,240,255,0.10)',   border: 'rgba(0,240,255,0.3)',   text: '#00f0ff',  num: '#00f0ff'  },
  { bg: 'rgba(57,255,20,0.10)',   border: 'rgba(57,255,20,0.3)',   text: '#39ff14',  num: '#39ff14'  },
  { bg: 'rgba(255,242,0,0.10)',   border: 'rgba(255,242,0,0.3)',   text: '#fff200',  num: '#fff200'  },
  { bg: 'rgba(168,85,247,0.12)',  border: 'rgba(168,85,247,0.3)',  text: '#a855f7',  num: '#a855f7'  },
];

// Render article content with infographic-style numbered cards
function renderContent(content: string) {
  const paragraphs = content.split('\n\n');
  const nodes: React.ReactNode[] = [];
  let cardIndex = 0;
  let i = 0;

  while (i < paragraphs.length) {
    const para = paragraphs[i];

    // Numbered heading like **1. Title** or **Stage 1: Title**
    const numberedHeading = para.match(/^\*\*(\d+)[.:]\s*(.+)\*\*$/);
    if (numberedHeading) {
      const num = numberedHeading[1];
      const title = numberedHeading[2];
      const body = paragraphs[i + 1] && !paragraphs[i + 1].startsWith('**') ? paragraphs[i + 1] : '';
      const col = CARD_COLORS[cardIndex % CARD_COLORS.length];
      cardIndex++;

      nodes.push(
        <div
          key={i}
          className="rounded-2xl p-5 flex gap-4 items-start mb-4"
          style={{ background: col.bg, border: `1px solid ${col.border}` }}
        >
          {/* Number badge */}
          <div
            className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-bungee text-xl"
            style={{ background: col.bg, border: `2px solid ${col.border}`, color: col.num, boxShadow: `0 0 12px ${col.border}` }}
          >
            {num}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bungee text-white text-base leading-snug mb-2" style={{ textShadow: `0 0 12px ${col.text}55` }}>
              {title}
            </p>
            {body && (
              <p className="font-space text-gray-300 text-sm leading-relaxed">
                {inlineBold(body, col.text)}
              </p>
            )}
          </div>
        </div>
      );

      i += body ? 2 : 1;
      continue;
    }

    // Non-numbered heading **Some Title**
    if (para.startsWith('**') && para.endsWith('**') && !para.slice(2).includes('**')) {
      nodes.push(
        <h3 key={i} className="font-bungee text-neon-pink text-lg mt-8 mb-3">
          {para.slice(2, -2)}
        </h3>
      );
      i++;
      continue;
    }

    // Plain paragraph (intro / outro)
    nodes.push(
      <p key={i} className="font-space text-gray-300 leading-relaxed mb-5 text-base">
        {inlineBold(para, '#ff2d78')}
      </p>
    );
    i++;
  }

  return nodes;
}

function inlineBold(text: string, color: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, j) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={j} style={{ color, fontWeight: 700 }}>{part.slice(2, -2)}</strong>
      : part
  );
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    url: `https://www.annoyingkids.com/blog/${article.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'AnnoyingKids',
      url: 'https://www.annoyingkids.com',
      logo: 'https://www.annoyingkids.com/logo.png',
    },
    mainEntityOfPage: `https://www.annoyingkids.com/blog/${article.slug}`,
  };

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Header */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <Link href="/blog" className="font-space text-gray-500 text-sm hover:text-neon-pink transition-colors">
          ← Back to Blog
        </Link>
        <div className="flex items-center gap-3 mt-6 mb-4 flex-wrap">
          <span className="px-2 py-0.5 rounded-full text-xs font-space font-bold border text-neon-pink border-neon-pink/30 bg-neon-pink/10">
            {article.category}
          </span>
          <span className="font-space text-gray-600 text-xs">{article.readingTime}</span>
          <span className="font-space text-gray-600 text-xs">
            {new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        <h1 className="font-bungee text-3xl sm:text-5xl text-white leading-tight mb-6">
          {article.title}
        </h1>
        <p className="font-space text-gray-400 text-lg leading-relaxed border-l-4 border-neon-pink/40 pl-4">
          {article.excerpt}
        </p>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-px bg-gradient-to-r from-transparent via-neon-pink/40 to-transparent mb-10" />
      </div>

      {/* Article body — infographic style */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {renderContent(article.content)}
      </article>

      {/* Related product CTA */}
      {article.relatedProduct && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="bg-dark-card border border-neon-pink/20 rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="font-bungee text-white text-lg">Dress the part 😈</p>
              <p className="font-space text-gray-400 text-sm mt-1">Merch for professional troublemakers.</p>
            </div>
            <Link
              href={article.relatedProduct.href}
              className="px-6 py-3 bg-neon-pink font-bungee text-white text-sm uppercase rounded-lg
                hover:shadow-[0_0_20px_rgba(255,45,120,0.5)] transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              {article.relatedProduct.label}
            </Link>
          </div>
        </div>
      )}

      {/* More articles */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="font-bungee text-neon-blue text-xl mb-6">More chaos →</h2>
        <div className="flex flex-col gap-4">
          {ARTICLES.filter(a => a.slug !== slug).map(a => (
            <Link
              key={a.slug}
              href={`/blog/${a.slug}`}
              className="group flex items-start gap-4 bg-dark-card border border-dark-border rounded-xl p-4
                hover:border-neon-blue/30 transition-all duration-300"
            >
              <div>
                <p className="font-bungee text-white text-sm group-hover:text-neon-blue transition-colors">{a.title}</p>
                <p className="font-space text-gray-500 text-xs mt-1">{a.excerpt.slice(0, 80)}…</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
