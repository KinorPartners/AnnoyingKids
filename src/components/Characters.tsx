/**
 * Shared character display components — used in game, homepage teaser, footer, etc.
 * Each character renders an emoji with a CSS accessory overlay.
 */
import React from 'react';

export function Kid({ size }: { size: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: size * 0.864, lineHeight: 1 }}>🧒🏽</span>
      {/* red tongue */}
      <div style={{ position: 'absolute', bottom: '14%', left: '50%', transform: 'translateX(-50%)', width: size * 0.18, height: size * 0.16, background: '#ef4444', borderRadius: '0 0 50% 50%', boxShadow: '0 1px 4px rgba(239,68,68,0.6)', zIndex: 3 }} />
    </div>
  );
}

export function Dad({ size }: { size: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: size * 0.864, lineHeight: 1 }}>👨🏽</span>
      {/* blue hat brim */}
      <div style={{ position: 'absolute', top: '2%', left: '50%', transform: 'translateX(-50%)', width: size * 0.7, height: size * 0.09, background: '#00f0ff', borderRadius: 3, boxShadow: '0 0 6px #00f0ff', zIndex: 3 }} />
      {/* blue hat top */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%) translateY(-45%)', width: size * 0.42, height: size * 0.18, background: '#00f0ff', borderRadius: '4px 4px 0 0', boxShadow: '0 0 6px #00f0ff', zIndex: 3 }} />
    </div>
  );
}

export function Mom({ size }: { size: number }) {
  const w = size * 0.22, h = size * 0.18;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: size * 0.864, lineHeight: 1 }}>👩🏽</span>
      {/* pink ribbon / bow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%) translateY(-30%)', zIndex: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <div style={{ width: w, height: h, background: '#ff2d78', borderRadius: '50% 0 50% 50%', transform: 'rotate(20deg)', boxShadow: '0 0 5px #ff2d78' }} />
        <div style={{ width: size * 0.1, height: size * 0.1, background: '#ff69b4', borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ width: w, height: h, background: '#ff2d78', borderRadius: '0 50% 50% 50%', transform: 'rotate(-20deg)', boxShadow: '0 0 5px #ff2d78' }} />
      </div>
    </div>
  );
}

export function Grandma({ size }: { size: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: size * 0.864, lineHeight: 1 }}>👵</span>
      {/* white hair puff */}
      <div style={{ position: 'absolute', top: '3%', left: '50%', transform: 'translateX(-50%)', width: size * 0.6, height: size * 0.22, background: 'radial-gradient(ellipse,#ffffff 0%,#e0e0e0 60%,transparent 100%)', borderRadius: '50%', zIndex: 3, opacity: 0.95 }} />
      {/* cane */}
      <div style={{ position: 'absolute', right: '10%', top: '40%', width: 3, height: size * 0.42, background: '#6B3A2A', borderRadius: 2, zIndex: 3 }} />
      <div style={{ position: 'absolute', right: '10%', top: '38%', width: size * 0.16, height: 3, background: '#6B3A2A', borderRadius: '3px 3px 0 0', zIndex: 3, transformOrigin: 'right center', transform: 'translateX(-85%)' }} />
    </div>
  );
}

export function Grandpa({ size }: { size: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: size * 0.864, lineHeight: 1 }}>👴</span>
      {/* cigar */}
      <div style={{ position: 'absolute', bottom: '28%', right: '8%', width: size * 0.38, height: size * 0.1, background: 'linear-gradient(90deg,#7B3F00,#A0522D)', borderRadius: '2px 4px 4px 2px', transform: 'rotate(-18deg)', transformOrigin: 'right center', zIndex: 3 }} />
      <div style={{ position: 'absolute', bottom: '32%', right: '6%', width: size * 0.09, height: size * 0.08, background: '#ccc', borderRadius: '0 3px 3px 0', transform: 'rotate(-18deg)', transformOrigin: 'right center', zIndex: 3 }} />
      {/* smoke puffs */}
      <style>{`
        @keyframes gp-smoke-anim{0%{transform:translateY(0);opacity:0.7}100%{transform:translateY(-8px);opacity:0}}
        .gp-s1{animation:gp-smoke-anim 1.2s ease-out infinite}
        .gp-s2{animation:gp-smoke-anim 1.2s ease-out infinite;animation-delay:0.6s}
      `}</style>
      <div className="gp-s1" style={{ position: 'absolute', bottom: '55%', right: '4%', width: 5, height: 5, background: 'rgba(210,210,210,0.7)', borderRadius: '50%', zIndex: 3 }} />
      <div className="gp-s2" style={{ position: 'absolute', bottom: '55%', right: '8%', width: 4, height: 4, background: 'rgba(210,210,210,0.5)', borderRadius: '50%', zIndex: 3 }} />
    </div>
  );
}
