import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';

const GA_ID = 'G-RE32GFCT3H';

export const metadata: Metadata = {
  metadataBase: new URL('https://annoyingkids.com'),
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  verification: {
    other: {
      'msvalidate.01': '3C176DEAB58B624C2461ACA33A256011',
    },
  },
  title: {
    default: 'AnnoyingKids — Merch for Professional Troublemakers',
    template: '%s | AnnoyingKids',
  },
  description:
    'Bold, loud merch for kids 6-16 who live life at maximum volume. Tees, hoodies, mugs, stickers and more. Annoying by design, awesome by default.',
  keywords: [
    'kids clothing',
    'graphic tees for kids',
    'funny kids merch',
    'hoodies for kids',
    'annoying kids',
    'kids streetwear',
    'neon kids fashion',
    'youth merch',
    'print on demand kids',
  ],
  openGraph: {
    title: 'AnnoyingKids — Merch for Professional Troublemakers',
    description:
      'Bold, loud merch for kids 6-16 who live life at maximum volume. Annoying by design, awesome by default.',
    url: 'https://annoyingkids.com',
    siteName: 'AnnoyingKids',
    type: 'website',
    images: ['/opengraph-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AnnoyingKids — Merch for Professional Troublemakers',
    description: 'Bold, loud merch for kids 6-16. Annoying by design, awesome by default.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
  alternates: {
    canonical: 'https://annoyingkids.com',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'AnnoyingKids',
  url: 'https://annoyingkids.com',
  logo: 'https://annoyingkids.com/logo.png',
  description: 'Bold, loud merch for kids 6-16. Print-on-demand apparel and accessories.',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://annoyingkids.com/contact',
    availableLanguage: 'English',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AnnoyingKids',
  url: 'https://annoyingkids.com',
  description: 'Bold, loud merch for kids 6-16 who live life at maximum volume.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <meta property="og:locale" content="en_US" />
      </head>
      <body className="bg-dark-bg text-white antialiased noise-overlay">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', { analytics_storage: 'denied' });
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
            // Restore granted consent if previously accepted
            try {
              var c = localStorage.getItem('ak_cookie_consent');
              if (c === 'granted') gtag('consent', 'update', { analytics_storage: 'granted' });
            } catch(e) {}
          `}
        </Script>
        <CartProvider>
          <Header />
          <main className="min-h-screen pt-16 sm:pt-20">{children}</main>
          <Footer />
          <CookieConsent />
        </CartProvider>
      </body>
    </html>
  );
}
