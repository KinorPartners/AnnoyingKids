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
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      url: `https://www.annoyingkids.com/blog/${article.slug}`,
    },
  };
}

// Render plain text content — bold (**text**) and paragraphs
function renderContent(content: string) {
  return content.split('\n\n').map((para, i) => {
    // Heading: starts with **text** on its own line
    if (para.startsWith('**') && para.endsWith('**') && !para.slice(2).includes('**')) {
      return (
        <h3 key={i} className="font-bungee text-neon-pink text-lg mt-8 mb-2">
          {para.slice(2, -2)}
        </h3>
      );
    }
    // Paragraph with inline bold
    const parts = para.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className="font-space text-gray-300 leading-relaxed mb-4">
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} className="text-white font-bold">{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    );
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <div className="min-h-screen">
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

      {/* Article body */}
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
