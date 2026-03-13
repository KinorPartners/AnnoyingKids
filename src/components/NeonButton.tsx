'use client';

import React from 'react';
import Link from 'next/link';

interface NeonButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'pink' | 'green' | 'blue' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
  fullWidth?: boolean;
}

const colorMap = {
  pink: {
    bg: 'bg-neon-pink',
    text: 'text-white',
    shadow: 'shadow-[0_0_20px_rgba(255,45,120,0.5)]',
    hoverShadow: 'hover:shadow-[0_0_30px_rgba(255,45,120,0.8),0_0_60px_rgba(255,45,120,0.4)]',
    border: 'border-neon-pink',
  },
  green: {
    bg: 'bg-neon-green',
    text: 'text-dark-bg',
    shadow: 'shadow-[0_0_20px_rgba(57,255,20,0.5)]',
    hoverShadow: 'hover:shadow-[0_0_30px_rgba(57,255,20,0.8),0_0_60px_rgba(57,255,20,0.4)]',
    border: 'border-neon-green',
  },
  blue: {
    bg: 'bg-neon-blue',
    text: 'text-dark-bg',
    shadow: 'shadow-[0_0_20px_rgba(0,240,255,0.5)]',
    hoverShadow: 'hover:shadow-[0_0_30px_rgba(0,240,255,0.8),0_0_60px_rgba(0,240,255,0.4)]',
    border: 'border-neon-blue',
  },
  yellow: {
    bg: 'bg-neon-yellow',
    text: 'text-dark-bg',
    shadow: 'shadow-[0_0_20px_rgba(255,242,0,0.5)]',
    hoverShadow: 'hover:shadow-[0_0_30px_rgba(255,242,0,0.8),0_0_60px_rgba(255,242,0,0.4)]',
    border: 'border-neon-yellow',
  },
};

const sizeMap = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export default function NeonButton({
  children,
  href,
  onClick,
  variant = 'pink',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
}: NeonButtonProps) {
  const colors = colorMap[variant];
  const sizeClass = sizeMap[size];

  const baseClasses = `
    inline-flex items-center justify-center
    font-bungee uppercase tracking-wider
    ${colors.bg} ${colors.text}
    ${sizeClass}
    ${colors.shadow}
    ${colors.hoverShadow}
    border-2 ${colors.border}
    rounded-lg
    transition-all duration-300 ease-out
    hover:scale-105 active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  if (href) {
    return (
      <Link href={href} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={baseClasses}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
