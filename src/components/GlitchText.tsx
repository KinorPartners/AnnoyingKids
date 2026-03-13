'use client';

import React from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p';
}

export default function GlitchText({ text, className = '', as: Tag = 'h1' }: GlitchTextProps) {
  return (
    <Tag className={`glitch-text relative inline-block ${className}`} data-text={text}>
      {text}
      <style jsx>{`
        .glitch-text {
          position: relative;
          display: inline-block;
        }
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .glitch-text::before {
          left: 2px;
          text-shadow: -2px 0 #ff2d78;
          clip-path: inset(0 0 0 0);
          animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        .glitch-text::after {
          left: -2px;
          text-shadow: 2px 0 #00f0ff;
          clip-path: inset(0 0 0 0);
          animation: glitch-anim-2 2s infinite linear alternate-reverse;
        }
        @keyframes glitch-anim-1 {
          0% { clip-path: inset(20% 0 60% 0); }
          5% { clip-path: inset(50% 0 20% 0); }
          10% { clip-path: inset(10% 0 70% 0); }
          15% { clip-path: inset(80% 0 5% 0); }
          20% { clip-path: inset(25% 0 55% 0); }
          25% { clip-path: inset(60% 0 10% 0); }
          30% { clip-path: inset(5% 0 85% 0); }
          35% { clip-path: inset(70% 0 15% 0); }
          40% { clip-path: inset(15% 0 65% 0); }
          45% { clip-path: inset(45% 0 30% 0); }
          50% { clip-path: inset(35% 0 40% 0); }
          55% { clip-path: inset(75% 0 10% 0); }
          60% { clip-path: inset(5% 0 80% 0); }
          65% { clip-path: inset(55% 0 25% 0); }
          70% { clip-path: inset(30% 0 50% 0); }
          75% { clip-path: inset(65% 0 20% 0); }
          80% { clip-path: inset(10% 0 75% 0); }
          85% { clip-path: inset(40% 0 35% 0); }
          90% { clip-path: inset(85% 0 5% 0); }
          95% { clip-path: inset(20% 0 60% 0); }
          100% { clip-path: inset(50% 0 30% 0); }
        }
        @keyframes glitch-anim-2 {
          0% { clip-path: inset(60% 0 20% 0); }
          5% { clip-path: inset(10% 0 70% 0); }
          10% { clip-path: inset(80% 0 5% 0); }
          15% { clip-path: inset(30% 0 50% 0); }
          20% { clip-path: inset(70% 0 15% 0); }
          25% { clip-path: inset(5% 0 85% 0); }
          30% { clip-path: inset(45% 0 30% 0); }
          35% { clip-path: inset(15% 0 65% 0); }
          40% { clip-path: inset(55% 0 25% 0); }
          45% { clip-path: inset(85% 0 5% 0); }
          50% { clip-path: inset(25% 0 55% 0); }
          55% { clip-path: inset(40% 0 35% 0); }
          60% { clip-path: inset(75% 0 10% 0); }
          65% { clip-path: inset(20% 0 60% 0); }
          70% { clip-path: inset(50% 0 30% 0); }
          75% { clip-path: inset(35% 0 40% 0); }
          80% { clip-path: inset(65% 0 20% 0); }
          85% { clip-path: inset(5% 0 80% 0); }
          90% { clip-path: inset(30% 0 50% 0); }
          95% { clip-path: inset(70% 0 15% 0); }
          100% { clip-path: inset(10% 0 75% 0); }
        }
      `}</style>
    </Tag>
  );
}
