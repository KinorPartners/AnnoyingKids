'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

type Pos = { x: number; y: number };
type Dir = { x: number; y: number };
type GameState = 'idle' | 'playing' | 'dead' | 'won' | 'gameover';

const COLS = 15;
const ROWS = 15;
const CELL = 36;

// 1=wall, 0=candy, 2=empty, 3=bonus item
const BASE_MAZE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,0,1,0,1,3,1,0,1,0,1,1,1],
  [1,3,0,0,0,0,0,2,0,0,0,0,0,3,1],
  [1,1,1,0,1,0,1,0,1,0,1,0,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
  [1,0,1,0,0,0,0,3,0,0,0,0,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Bonus icons that appear at cell value 3
const BONUS_ICONS = ['🍕','🍭','🎮','🍦','🧃','🍟','🎯','🕹️'];

const TOTAL_CANDIES = BASE_MAZE.flat().filter(c => c === 0).length;
const TOTAL_BONUS   = BASE_MAZE.flat().filter(c => c === 3).length;

function cloneMaze(m: number[][]): number[][] { return m.map(r => [...r]); }
function isWall(maze: number[][], x: number, y: number): boolean {
  if (x < 0 || x >= COLS || y < 0 || y >= ROWS) return true;
  return maze[y][x] === 1;
}

function bfsStep(maze: number[][], from: Pos, to: Pos): Dir {
  if (from.x === to.x && from.y === to.y) return { x: 0, y: 0 };
  const dirs: Dir[] = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
  const visited = new Set<string>([`${from.x},${from.y}`]);
  const queue: Array<{ pos: Pos; first: Dir }> = [];
  for (const d of dirs) {
    const nx = from.x + d.x, ny = from.y + d.y;
    if (!isWall(maze, nx, ny)) {
      const key = `${nx},${ny}`;
      if (!visited.has(key)) {
        visited.add(key);
        if (nx === to.x && ny === to.y) return d;
        queue.push({ pos: { x: nx, y: ny }, first: d });
      }
    }
  }
  while (queue.length) {
    const { pos, first } = queue.shift()!;
    for (const d of dirs) {
      const nx = pos.x + d.x, ny = pos.y + d.y;
      const key = `${nx},${ny}`;
      if (!isWall(maze, nx, ny) && !visited.has(key)) {
        visited.add(key);
        if (nx === to.x && ny === to.y) return first;
        queue.push({ pos: { x: nx, y: ny }, first });
      }
    }
  }
  return { x: 0, y: 0 };
}

const DIR_KEYS: Record<string, Dir> = {
  ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
  a: { x: -1, y: 0 }, d: { x: 1, y: 0 },
};

/** Kid emoji with red tongue sticking out */
function Kid({ size, dead }: { size: number; dead: boolean }) {
  if (dead) {
    return (
      <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Crying animation */}
        <style>{`
          @keyframes tear-l { 0%{transform:translate(0,0);opacity:1} 100%{transform:translate(-10px,16px);opacity:0} }
          @keyframes tear-r { 0%{transform:translate(0,0);opacity:1} 100%{transform:translate(10px,16px);opacity:0} }
          @keyframes tear-l2 { 0%{transform:translate(0,0);opacity:1} 100%{transform:translate(-14px,20px);opacity:0} }
          @keyframes tear-r2 { 0%{transform:translate(0,0);opacity:1} 100%{transform:translate(14px,20px);opacity:0} }
          .tear-l  { animation: tear-l  0.7s ease-in infinite; }
          .tear-r  { animation: tear-r  0.7s ease-in infinite; animation-delay:0.1s; }
          .tear-l2 { animation: tear-l2 0.7s ease-in infinite; animation-delay:0.35s; }
          .tear-r2 { animation: tear-r2 0.7s ease-in infinite; animation-delay:0.45s; }
        `}</style>
        <span style={{ fontSize: size * 0.72, lineHeight: 1, zIndex: 2, position: 'relative' }}>😢</span>
        {/* Left tears */}
        <div className="tear-l"  style={{ position:'absolute', top:'38%', left:'22%', width:5, height:7, background:'#3b82f6', borderRadius:'50% 50% 50% 50% / 40% 40% 60% 60%', zIndex:3 }} />
        <div className="tear-l2" style={{ position:'absolute', top:'38%', left:'18%', width:4, height:6, background:'#60a5fa', borderRadius:'50% 50% 50% 50% / 40% 40% 60% 60%', zIndex:3 }} />
        {/* Right tears */}
        <div className="tear-r"  style={{ position:'absolute', top:'38%', right:'22%', width:5, height:7, background:'#3b82f6', borderRadius:'50% 50% 50% 50% / 40% 40% 60% 60%', zIndex:3 }} />
        <div className="tear-r2" style={{ position:'absolute', top:'38%', right:'18%', width:4, height:6, background:'#60a5fa', borderRadius:'50% 50% 50% 50% / 40% 40% 60% 60%', zIndex:3 }} />
      </div>
    );
  }
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: size * 0.72, lineHeight: 1 }}>🧒</span>
      {/* Red tongue */}
      <div style={{
        position: 'absolute', bottom: '14%', left: '50%',
        transform: 'translateX(-50%)',
        width: size * 0.18, height: size * 0.16,
        background: '#ef4444',
        borderRadius: '0 0 50% 50%',
        boxShadow: '0 1px 4px rgba(239,68,68,0.6)',
        zIndex: 3,
      }} />
    </div>
  );
}

/** Dad emoji with blue hat */
function Dad({ size }: { size: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: size * 0.72, lineHeight: 1 }}>👨</span>
      {/* Hat brim */}
      <div style={{
        position: 'absolute', top: '2%', left: '50%',
        transform: 'translateX(-50%)',
        width: size * 0.7, height: size * 0.09,
        background: '#00f0ff',
        borderRadius: 3,
        boxShadow: '0 0 6px #00f0ff',
        zIndex: 3,
      }} />
      {/* Hat crown */}
      <div style={{
        position: 'absolute', top: 0, left: '50%',
        transform: 'translateX(-50%) translateY(-45%)',
        width: size * 0.42, height: size * 0.18,
        background: '#00f0ff',
        borderRadius: '4px 4px 0 0',
        boxShadow: '0 0 6px #00f0ff',
        zIndex: 3,
      }} />
    </div>
  );
}

/** Mom emoji with pink bow */
function Mom({ size }: { size: number }) {
  const w = size * 0.22, h = size * 0.18;
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: size * 0.72, lineHeight: 1 }}>👩</span>
      {/* Bow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%) translateY(-30%)', zIndex: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        {/* Left wing */}
        <div style={{ width: w, height: h, background: '#ff2d78', borderRadius: '50% 0 50% 50%', transform: 'rotate(20deg)', boxShadow: '0 0 5px #ff2d78' }} />
        {/* Knot */}
        <div style={{ width: size * 0.1, height: size * 0.1, background: '#ff69b4', borderRadius: '50%', flexShrink: 0 }} />
        {/* Right wing */}
        <div style={{ width: w, height: h, background: '#ff2d78', borderRadius: '0 50% 50% 50%', transform: 'rotate(-20deg)', boxShadow: '0 0 5px #ff2d78' }} />
      </div>
    </div>
  );
}

export default function ChaosGame() {
  const mazeRef       = useRef(cloneMaze(BASE_MAZE));
  const kidRef        = useRef<Pos>({ x: 7, y: 7 });
  const parentsRef    = useRef<Pos[]>([{ x: 1, y: 1 }, { x: 13, y: 1 }]);
  const kidDirRef     = useRef<Dir>({ x: 0, y: 0 });
  const nextDirRef    = useRef<Dir>({ x: 0, y: 0 });
  const scoreRef      = useRef(0);
  const livesRef      = useRef(3);
  const gameStateRef  = useRef<GameState>('idle');
  const parentTickRef = useRef(0);
  const deadTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Assign a fixed bonus icon per cell position
  const bonusIconsRef = useRef<Record<string, string>>({});

  const [, forceRender] = useState(0);
  const render = useCallback(() => forceRender(n => n + 1), []);

  // Assign bonus icons once
  useEffect(() => {
    let idx = 0;
    BASE_MAZE.forEach((row, y) => row.forEach((cell, x) => {
      if (cell === 3) {
        bonusIconsRef.current[`${x},${y}`] = BONUS_ICONS[idx % BONUS_ICONS.length];
        idx++;
      }
    }));
  }, []);

  const resetPositions = () => {
    kidRef.current      = { x: 7, y: 7 };
    parentsRef.current  = [{ x: 1, y: 1 }, { x: 13, y: 1 }];
    kidDirRef.current   = { x: 0, y: 0 };
    nextDirRef.current  = { x: 0, y: 0 };
    parentTickRef.current = 0;
  };

  const startGame = useCallback(() => {
    mazeRef.current    = cloneMaze(BASE_MAZE);
    resetPositions();
    scoreRef.current   = 0;
    livesRef.current   = 3;
    gameStateRef.current = 'playing';
    render();
  }, [render]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = DIR_KEYS[e.key];
      if (!d) return;
      e.preventDefault();
      nextDirRef.current = d;
      if (gameStateRef.current === 'idle') startGame();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [startGame]);

  // Single game loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameStateRef.current !== 'playing') return;

      const maze = mazeRef.current;
      const kid  = kidRef.current;

      // Move kid
      const tryMove = (d: Dir): Pos | null => {
        const nx = kid.x + d.x, ny = kid.y + d.y;
        return isWall(maze, nx, ny) ? null : { x: nx, y: ny };
      };

      let newKid = kid;
      const nextAttempt = tryMove(nextDirRef.current);
      if (nextAttempt && (nextDirRef.current.x !== 0 || nextDirRef.current.y !== 0)) {
        newKid = nextAttempt;
        kidDirRef.current = nextDirRef.current;
      } else {
        const curr = tryMove(kidDirRef.current);
        if (curr) newKid = curr;
      }
      kidRef.current = newKid;

      // Collect candy or bonus
      const cell = maze[newKid.y][newKid.x];
      if (cell === 0) {
        maze[newKid.y][newKid.x] = 2;
        scoreRef.current += 10;
      } else if (cell === 3) {
        maze[newKid.y][newKid.x] = 2;
        scoreRef.current += 50;
      }

      // Check win
      const remaining = maze.flat().filter(c => c === 0 || c === 3).length;
      if (remaining === 0) { gameStateRef.current = 'won'; render(); return; }

      // Move parents every 2 ticks
      parentTickRef.current++;
      if (parentTickRef.current % 2 === 0) {
        parentsRef.current = parentsRef.current.map((p, i) => {
          if (i === 1 && Math.random() < 0.25) return p;
          const step = bfsStep(maze, p, kidRef.current);
          const nx = p.x + step.x, ny = p.y + step.y;
          return isWall(maze, nx, ny) ? p : { x: nx, y: ny };
        });
      }

      // Collision
      const caught = parentsRef.current.some(p => p.x === kidRef.current.x && p.y === kidRef.current.y);
      if (caught) {
        livesRef.current -= 1;
        if (livesRef.current <= 0) {
          gameStateRef.current = 'gameover';
        } else {
          gameStateRef.current = 'dead';
          if (deadTimerRef.current) clearTimeout(deadTimerRef.current);
          deadTimerRef.current = setTimeout(() => {
            resetPositions();
            gameStateRef.current = 'playing';
            render();
          }, 1800);
        }
      }

      render();
    }, 160);
    return () => clearInterval(interval);
  }, [render]);

  const gs      = gameStateRef.current;
  const maze    = mazeRef.current;
  const kid     = kidRef.current;
  const parents = parentsRef.current;
  const score   = scoreRef.current;
  const lives   = livesRef.current;
  const isDead  = gs === 'dead';

  const setDir = (d: Dir) => {
    nextDirRef.current = d;
    if (gs === 'idle') startGame();
  };

  return (
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-5">
        {/* Title */}
        <div className="text-center">
          <h2 className="font-bungee text-3xl sm:text-4xl text-white">
            KID <span className="text-neon-pink">CHAOS</span>
          </h2>
          <p className="font-space text-gray-400 text-sm mt-1">
            Escape Mom &amp; Dad — collect candy &amp; bonus items!
          </p>
        </div>

        {/* HUD */}
        <div className="flex items-center gap-8 font-bungee text-lg">
          <span className="text-neon-green">🍭 {score}</span>
          <span>
            {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
              <span key={i}>🧒</span>
            ))}
          </span>
          <span className="text-gray-500 text-sm font-space">
            {(TOTAL_CANDIES + TOTAL_BONUS) - maze.flat().filter(c => c === 0 || c === 3).length}
            /{TOTAL_CANDIES + TOTAL_BONUS}
          </span>
        </div>

        {/* Board */}
        <div
          className="relative rounded-2xl overflow-hidden border-2 border-neon-pink/30 shadow-[0_0_40px_rgba(255,45,120,0.2)]"
          style={{ width: COLS * CELL, height: ROWS * CELL }}
        >
          {/* Cells */}
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className="absolute"
                style={{
                  left: x * CELL, top: y * CELL, width: CELL, height: CELL,
                  background: cell === 1 ? 'linear-gradient(135deg,#12124a,#1a1a6e)' : '#0a0a1a',
                  border: cell === 1 ? '1px solid #2d2d9f' : undefined,
                  borderRadius: cell === 1 ? 3 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxSizing: 'border-box',
                }}
              >
                {cell === 0 && (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff2d78', boxShadow: '0 0 6px #ff2d78' }} />
                )}
                {cell === 3 && (
                  <span style={{ fontSize: CELL * 0.55, lineHeight: 1 }}>
                    {bonusIconsRef.current[`${x},${y}`] ?? '🍭'}
                  </span>
                )}
              </div>
            ))
          )}

          {/* Kid */}
          <div
            className="absolute"
            style={{
              left: kid.x * CELL, top: kid.y * CELL,
              width: CELL, height: CELL, zIndex: 20,
              transition: gs === 'playing' ? 'left 0.13s linear, top 0.13s linear' : 'none',
            }}
          >
            <Kid size={CELL} dead={isDead} />
          </div>

          {/* Parents */}
          <div
            className="absolute"
            style={{
              left: parents[0].x * CELL, top: parents[0].y * CELL,
              width: CELL, height: CELL, zIndex: 20,
              transition: 'left 0.28s linear, top 0.28s linear',
              filter: 'drop-shadow(0 0 6px #00f0ff)',
            }}
          >
            <Dad size={CELL} />
          </div>
          <div
            className="absolute"
            style={{
              left: parents[1].x * CELL, top: parents[1].y * CELL,
              width: CELL, height: CELL, zIndex: 20,
              transition: 'left 0.28s linear, top 0.28s linear',
              filter: 'drop-shadow(0 0 6px #ff2d78)',
            }}
          >
            <Mom size={CELL} />
          </div>

          {/* Idle overlay */}
          {gs === 'idle' && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-4 z-30">
              <div className="flex items-center gap-1 text-5xl">
                <Mom size={52} /><Dad size={52} />
                <span className="text-gray-500 mx-1">vs</span>
                <Kid size={52} dead={false} />
              </div>
              <h3 className="font-bungee text-white text-2xl text-center px-4">
                KID <span className="text-neon-pink">CHAOS</span>
              </h3>
              <p className="font-space text-gray-300 text-sm text-center px-8 leading-relaxed">
                Collect 🍭 candy (+10pts) &amp; bonus items (+50pts)!<br />
                Don&apos;t get caught by Mom or Dad!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-neon-pink font-bungee text-white text-lg uppercase rounded-xl
                  shadow-[0_0_20px_rgba(255,45,120,0.6)] hover:shadow-[0_0_30px_rgba(255,45,120,0.9)]
                  hover:scale-105 transition-all"
              >
                Play!
              </button>
              <p className="font-space text-gray-500 text-xs">Arrow keys · WASD · buttons below</p>
            </div>
          )}

          {/* Won overlay */}
          {gs === 'won' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-30">
              <div className="text-5xl animate-bounce">🎉</div>
              <h3 className="font-bungee text-neon-green text-3xl">YOU ESCAPED!</h3>
              <p className="font-space text-white text-lg">Score: {score}</p>
              <button onClick={startGame}
                className="px-8 py-3 bg-neon-green font-bungee text-dark-bg text-lg uppercase rounded-xl
                  shadow-[0_0_20px_rgba(57,255,20,0.6)] hover:scale-105 transition-all">
                Play Again!
              </button>
            </div>
          )}

          {/* Game over overlay */}
          {gs === 'gameover' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-30">
              <div className="text-5xl">😅</div>
              <h3 className="font-bungee text-neon-pink text-3xl">GROUNDED!</h3>
              <p className="font-space text-gray-300 text-sm">Mom &amp; Dad caught you!</p>
              <p className="font-space text-white text-lg">Score: {score}</p>
              <button onClick={startGame}
                className="px-8 py-3 bg-neon-pink font-bungee text-white text-lg uppercase rounded-xl
                  shadow-[0_0_20px_rgba(255,45,120,0.6)] hover:scale-105 transition-all">
                Try Again!
              </button>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex flex-col items-center gap-2 select-none">
          <button className="w-14 h-14 bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center text-white text-xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all"
            onPointerDown={() => setDir({ x: 0, y: -1 })}>▲</button>
          <div className="flex gap-2">
            <button className="w-14 h-14 bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center text-white text-xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all"
              onPointerDown={() => setDir({ x: -1, y: 0 })}>◄</button>
            <button className="w-14 h-14 bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center text-white text-xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all"
              onPointerDown={() => setDir({ x: 0, y: 1 })}>▼</button>
            <button className="w-14 h-14 bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center text-white text-xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all"
              onPointerDown={() => setDir({ x: 1, y: 0 })}>►</button>
          </div>
        </div>

        <p className="font-space text-gray-600 text-xs">Keyboard: Arrow keys or WASD</p>
      </div>
    </section>
  );
}
