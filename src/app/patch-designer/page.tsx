import type { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Patch Designer — Design Your Own Patch',
  description:
    'Design your own custom patch with our AI-powered patch designer. Pick a style, describe your idea, and get a one-of-a-kind patch made just for you.',
  alternates: { canonical: 'https://annoyingkids.com/patch-designer' },
  openGraph: {
    title: 'Patch Designer — AnnoyingKids',
    description:
      'Design your own custom patch with our AI-powered patch designer. Bold, loud, one-of-a-kind.',
    url: 'https://annoyingkids.com/patch-designer',
    type: 'website',
  },
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://annoyingkids.com' },
    { '@type': 'ListItem', position: 2, name: 'Patch Designer', item: 'https://annoyingkids.com/patch-designer' },
  ],
};

export default function PatchDesignerPage() {
  return (
    <div className="min-h-screen py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 font-space text-sm mb-8" aria-label="Breadcrumb">
          <Link href="/" className="text-gray-500 hover:text-neon-pink transition-colors">
            Home
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-neon-pink">Patch Designer</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-10 sm:mb-14">
          <span className="font-space text-neon-green text-sm uppercase tracking-widest">
            Design Studio
          </span>
          <h1 className="font-bungee text-4xl sm:text-5xl lg:text-6xl text-white mt-4">
            Design Your Own <span className="text-neon-pink">Patch</span>
          </h1>
          <p className="font-space text-gray-400 mt-4 max-w-2xl mx-auto">
            Pick a style, describe your idea, and we&apos;ll generate a one-of-a-kind patch
            design in seconds. Powered by PatchDesign.ai.
          </p>
        </div>

        {/* Embed container */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-4 sm:p-6 lg:p-8 shadow-[0_0_40px_rgba(255,16,240,0.08)]">
          <div id="patchdesign-embed" className="min-h-[640px]">
            {/* PatchDesign.ai embed iframe mounts here via data-target */}
          </div>
        </div>

        {/* Fallback note */}
        <p className="text-center font-space text-xs text-gray-600 mt-6">
          Having trouble loading the designer?{' '}
          <Link href="/contact" className="text-neon-blue hover:text-neon-pink transition-colors">
            Get in touch
          </Link>{' '}
          and we&apos;ll help you out.
        </p>
      </div>

      {/* PatchDesign.ai embed script — mounts iframe inside #patchdesign-embed */}
      <Script
        src="https://patchdesign.ai/embed.js"
        data-client="mfr-annoyingkids-com-ba1d"
        data-target="#patchdesign-embed"
        data-height="auto"
        data-min-height="640"
        data-max-height="1800"
        data-theme="dark"
        data-referrer="annoyingkids-patch-designer"
        strategy="afterInteractive"
      />
    </div>
  );
}
