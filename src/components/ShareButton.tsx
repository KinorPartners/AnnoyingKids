'use client';

import React, { useState } from 'react';

interface ShareButtonProps {
  title: string;
  description: string;
  url: string;
}

export default function ShareButton({ title, description, url }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
      } catch {
        // User cancelled or error — do nothing
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard not available
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="px-4 py-2 bg-dark-surface border border-dark-border rounded-lg text-gray-400 hover:text-neon-green hover:border-neon-green/50 font-space text-sm flex items-center gap-2 transition-all"
      aria-label="Share this product"
    >
      {copied ? 'Copied! 📋' : 'Share 🔗'}
    </button>
  );
}
