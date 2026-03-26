'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Kid, Dad, Mom } from '@/components/Characters';

const MC = 24; // mini cell size px

// Small 7×5 maze — 1=wall, 0=dot, 2=empty
const MINI = [
  [1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1],
];

// Kid loops: (1,1)→(5,1)→(5,3)→(1,3)→back  4 s total
// Dad follows same path, delayed −1 s
// Mom follows same path, delayed −2 s
const PATH_CSS = `
  @keyframes mini-run {
    0%   { left:${1*MC}px; top:${1*MC}px; }
    24%  { left:${5*MC}px; top:${1*MC}px; }
    26%  { left:${5*MC}px; top:${1*MC}px; }
    49%  { left:${5*MC}px; top:${3*MC}px; }
    51%  { left:${5*MC}px; top:${3*MC}px; }
    74%  { left:${1*MC}px; top:${3*MC}px; }
    76%  { left:${1*MC}px; top:${3*MC}px; }
    99%  { left:${1*MC}px; top:${1*MC}px; }
    100% { left:${1*MC}px; top:${1*MC}px; }
  }
  @keyframes flash-screen {
    0%   { opacity: 0.85; }
    100% { opacity: 0; }
  }
  @keyframes preview-pop {
    0%   { transform: scale(1); }
    40%  { transform: scale(1.08); }
    70%  { transform: scale(0.97); }
    100% { transform: scale(1.04); }
  }
  .mini-kid { animation: mini-run 4s linear infinite; }
  .mini-dad { animation: mini-run 4s linear infinite; animation-delay: -1s; }
  .mini-mom { animation: mini-run 4s linear infinite; animation-delay: -2s; }
  .preview-pop { animation: preview-pop 0.45s ease-out forwards; }
`;

export default function GamePreview() {
  const [popping, setPopping] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (popping) return;
    setPopping(true);
    setFlashing(true);
    setTimeout(() => {
      router.push('/game');
    }, 320);
    setTimeout(() => { setPopping(false); setFlashing(false); }, 700);
  };

  const boardW = 7 * MC;
  const boardH = 5 * MC;

  return (
    <>
      <style>{PATH_CSS}</style>

      {/* Full-screen neon flash on click */}
      {flashing && (
        <div
          className="fixed inset-0 pointer-events-none z-50 bg-neon-pink"
          style={{ animation: 'flash-screen 0.55s ease-out forwards' }}
        />
      )}

      <div className="flex flex-col items-center gap-3 py-6">
        {/* Label */}
        <p className="font-space text-gray-500 text-xs uppercase tracking-widest">
          🎮 click to play
        </p>

        {/* Preview card */}
        <button
          onClick={handleClick}
          className={`group relative cursor-pointer rounded-2xl overflow-hidden
            border-2 border-neon-pink/40 hover:border-neon-pink/80
            shadow-[0_0_20px_rgba(255,45,120,0.15)] hover:shadow-[0_0_40px_rgba(255,45,120,0.4)]
            transition-shadow duration-300 focus:outline-none
            ${popping ? 'preview-pop' : ''}`}
          style={{ width: boardW + 160, background: '#0a0a1a' }}
          aria-label="Play Kid Chaos game"
        >
          <div className="flex items-center gap-4 px-5 py-4">

            {/* Mini maze */}
            <div className="relative flex-shrink-0" style={{ width: boardW, height: boardH }}>
              {MINI.map((row, y) => row.map((cell, x) => (
                <div key={`${x}-${y}`} className="absolute" style={{
                  left: x*MC, top: y*MC, width: MC, height: MC,
                  background: cell === 1
                    ? 'linear-gradient(135deg,#12124a,#1a1a6e)'
                    : '#0a0a1a',
                  border: cell === 1 ? '1px solid #2d2d9f' : undefined,
                  borderRadius: cell === 1 ? 2 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxSizing: 'border-box',
                }}>
                  {cell === 0 && (
                    <div style={{ width:5, height:5, borderRadius:'50%',
                      background:'#ff2d78', boxShadow:'0 0 4px #ff2d78' }} />
                  )}
                </div>
              )))}

              {/* Animated characters */}
              <div className="mini-mom absolute" style={{ zIndex:10, filter:'drop-shadow(0 0 4px #ff2d78)' }}>
                <Mom size={MC} />
              </div>
              <div className="mini-dad absolute" style={{ zIndex:10, filter:'drop-shadow(0 0 4px #00f0ff)' }}>
                <Dad size={MC} />
              </div>
              <div className="mini-kid absolute" style={{ zIndex:11, filter:'drop-shadow(0 0 5px rgba(255,255,255,0.6))' }}>
                <Kid size={MC} />
              </div>
            </div>

            {/* Right: text */}
            <div className="flex flex-col items-start gap-1 flex-1">
              <span className="font-bungee text-white text-lg leading-none">
                KID <span className="text-neon-pink">CHAOS</span>
              </span>
              <span className="font-space text-gray-400 text-xs leading-relaxed">
                Escape Mom &amp; Dad<br/>through the maze!
              </span>
              <span
                className="mt-2 px-3 py-1 bg-neon-green text-dark-bg font-bungee text-xs uppercase rounded-lg
                  shadow-[0_0_10px_rgba(57,255,20,0.4)]
                  group-hover:shadow-[0_0_20px_rgba(57,255,20,0.7)] transition-all"
              >
                🎮 Play Now
              </span>
            </div>
          </div>

          {/* Scan-line shimmer on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,45,120,0.03) 3px,rgba(255,45,120,0.03) 4px)' }}
          />
        </button>
      </div>
    </>
  );
}
