import { ImageResponse } from 'next/og';

export const alt = 'AnnoyingKids — Merch for Professional Troublemakers';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0d0d0d',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Glow blobs */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(255,45,120,0.12)',
            filter: 'blur(80px)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(0,240,255,0.10)',
            filter: 'blur(80px)',
            display: 'flex',
          }}
        />

        {/* Top label */}
        <p
          style={{
            fontSize: 20,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#39ff14',
            margin: 0,
            marginBottom: 20,
          }}
        >
          MERCH FOR PROFESSIONAL TROUBLEMAKERS
        </p>

        {/* Brand name */}
        <p
          style={{
            fontSize: 100,
            fontWeight: 900,
            color: '#ffffff',
            margin: 0,
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          ANNOYING<span style={{ color: '#ff2d78' }}>KIDS</span>
        </p>

        {/* Sub-label */}
        <p
          style={{
            fontSize: 26,
            color: '#888888',
            margin: 0,
            marginTop: 28,
            letterSpacing: 2,
          }}
        >
          Tees · Hoodies · Mugs · Stickers · Caps
        </p>

        {/* Bottom URL */}
        <p
          style={{
            position: 'absolute',
            bottom: 36,
            fontSize: 18,
            color: '#444444',
            letterSpacing: 1,
            margin: 0,
          }}
        >
          annoyingkids.com
        </p>
      </div>
    ),
    { ...size }
  );
}
