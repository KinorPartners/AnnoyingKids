import type { Metadata } from 'next';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import Link from 'next/link';
import Script from 'next/script';

// Register the <patch-designer> custom element from the PatchDesign.AI SDK
// so TSX accepts its hyphenated attributes.
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'patch-designer': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        'client-key'?: string;
        theme?: string;
        width?: string;
      };
    }
  }
}

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
    <div className="min-h-screen py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumbs + hero kept in a readable-width container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 font-space text-sm mb-8" aria-label="Breadcrumb">
          <Link href="/" className="text-gray-500 hover:text-neon-pink transition-colors">
            Home
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-neon-pink">Patch Designer</span>
        </nav>

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
      </div>

      {/* Embed container — spans the full viewport with only minimal breathing room */}
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-2 sm:p-3 lg:p-4 shadow-[0_0_40px_rgba(255,16,240,0.08)]">
          {/* PatchDesign.AI SDK */}
          <patch-designer
            client-key="mfr-annoyingkids-com-ba1d"
            theme="auto"
            width="100%"
          ></patch-designer>
          {/* end PatchDesign.AI SDK */}
        </div>
      </div>

      {/* Fallback note */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center font-space text-xs text-gray-600 mt-6">
          Having trouble loading the designer?{' '}
          <Link href="/contact" className="text-neon-blue hover:text-neon-pink transition-colors">
            Get in touch
          </Link>{' '}
          and we&apos;ll help you out.
        </p>
      </div>

      {/* PatchDesign.AI SDK loader */}
      <Script
        src="https://patchdesign.ai/sdk/patch-designer.sdk.latest.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
