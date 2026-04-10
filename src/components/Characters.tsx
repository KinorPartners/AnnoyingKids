/**
 * Shared character display components — used in game, homepage teaser, footer, etc.
 * Each character renders a 3D transparent PNG at the requested size.
 */
import React from 'react';

export function Kid({ size }: { size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/characters/guy.png?v=4" alt="Guy" width={size} height={size} style={{ objectFit: 'contain', display: 'block' }} />
  );
}

export function Dad({ size }: { size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/characters/pap.png?v=4" alt="Dad" width={size} height={size} style={{ objectFit: 'contain', display: 'block' }} />
  );
}

export function Mom({ size }: { size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/characters/mal.png?v=4" alt="Mom" width={size} height={size} style={{ objectFit: 'contain', display: 'block' }} />
  );
}

export function Grandma({ size }: { size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/characters/mimi.png?v=4" alt="Grandma" width={size} height={size} style={{ objectFit: 'contain', display: 'block' }} />
  );
}

export function Dinosaur({ size }: { size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/characters/rex.png?v=4" alt="Rex" width={size} height={size} style={{ objectFit: 'contain', display: 'block' }} />
  );
}

export function Grandpa({ size }: { size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/characters/barry.png?v=4" alt="Grandpa" width={size} height={size} style={{ objectFit: 'contain', display: 'block' }} />
  );
}

export function Buddy({ size }: { size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/characters/buddy.png?v=4" alt="Buddy" width={size} height={size} style={{ objectFit: 'contain', display: 'block' }} />
  );
}
