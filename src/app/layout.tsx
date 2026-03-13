import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'AnnoyingKids — Merch for Professional Troublemakers',
  description:
    'Bold, loud merch for kids 6-16 who live life at maximum volume. Tees, hoodies, mugs, stickers & more. Annoying by design, awesome by default. 😈',
  keywords: [
    'kids clothing',
    'graphic tees',
    'hoodies',
    'kids merch',
    'annoying kids',
    'streetwear',
    'neon',
    'youth fashion',
  ],
  openGraph: {
    title: 'AnnoyingKids — Merch for Professional Troublemakers',
    description:
      'Bold, loud merch for kids 6-16 who live life at maximum volume.',
    url: 'https://www.annoyingkids.com',
    siteName: 'AnnoyingKids',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-bg text-white antialiased noise-overlay">
        <CartProvider>
          <Header />
          <main className="min-h-screen pt-16 sm:pt-20">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
