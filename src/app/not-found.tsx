import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 — Page Not Found | AnnoyingKids',
  description: 'This page escaped. Try the homepage or browse our chaos merch.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="max-w-xl w-full text-center">
        <p className="font-bungee text-neon-pink text-9xl leading-none mb-4">404</p>
        <h1 className="font-bungee text-3xl sm:text-4xl text-white mb-4">
          This Page <span className="text-neon-pink">Escaped</span>
        </h1>
        <p className="font-space text-gray-400 text-lg mb-10">
          Even Guy can&apos;t find it — and he finds everything. The page you&apos;re looking for isn&apos;t here.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="px-8 py-3 bg-neon-pink font-bungee text-white uppercase rounded-xl
              shadow-[0_0_20px_rgba(255,45,120,0.4)] hover:shadow-[0_0_30px_rgba(255,45,120,0.7)]
              hover:scale-105 transition-all duration-300"
          >
            Back to Home
          </Link>
          <Link
            href="/products"
            className="px-8 py-3 border border-neon-blue/40 font-bungee text-neon-blue uppercase rounded-xl
              hover:bg-neon-blue/10 hover:border-neon-blue/70 transition-all duration-300"
          >
            Shop the Chaos
          </Link>
        </div>
      </div>
    </div>
  );
}
