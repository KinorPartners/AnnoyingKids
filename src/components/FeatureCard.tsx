'use client';

import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  accentColor: 'pink' | 'green' | 'blue' | 'yellow';
}

const accentMap = {
  pink: {
    border: 'border-neon-pink/30',
    glow: 'group-hover:shadow-[0_0_30px_rgba(255,45,120,0.3)]',
    text: 'text-neon-pink',
    iconBg: 'bg-neon-pink/10',
  },
  green: {
    border: 'border-neon-green/30',
    glow: 'group-hover:shadow-[0_0_30px_rgba(57,255,20,0.3)]',
    text: 'text-neon-green',
    iconBg: 'bg-neon-green/10',
  },
  blue: {
    border: 'border-neon-blue/30',
    glow: 'group-hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]',
    text: 'text-neon-blue',
    iconBg: 'bg-neon-blue/10',
  },
  yellow: {
    border: 'border-neon-yellow/30',
    glow: 'group-hover:shadow-[0_0_30px_rgba(255,242,0,0.3)]',
    text: 'text-neon-yellow',
    iconBg: 'bg-neon-yellow/10',
  },
};

export default function FeatureCard({ icon, title, description, accentColor }: FeatureCardProps) {
  const accent = accentMap[accentColor];

  return (
    <div
      className={`group relative bg-dark-card border ${accent.border} rounded-2xl p-8 
        transition-all duration-500 hover:-translate-y-2 ${accent.glow}
        overflow-hidden`}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }}
        />
      </div>

      {/* Icon */}
      <div
        className={`w-16 h-16 ${accent.iconBg} rounded-xl flex items-center justify-center mb-6 
          transition-transform duration-300 group-hover:scale-110`}
      >
        <span className={`text-3xl ${accent.text}`}>{icon}</span>
      </div>

      {/* Content */}
      <h3 className={`font-bungee text-xl ${accent.text} mb-3`}>{title}</h3>
      <p className="font-space text-gray-400 leading-relaxed">{description}</p>

      {/* Corner decoration */}
      <div
        className={`absolute top-0 right-0 w-20 h-20 ${accent.border} border-l border-b rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />
    </div>
  );
}
