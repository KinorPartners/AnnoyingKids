'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

type Pos = { x: number; y: number };
type Dir = { x: number; y: number };
type GameState = 'idle' | 'playing' | 'dead' | 'won' | 'gameover';

const COLS = 15;
const ROWS = 15;
const CELL = 36;

// 1=wall, 0=candy, 2=empty
const BASE_MAZE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,0,1,0,1,2,1,0,1,0,1,1,1],
  [1,2,0,0,0,0,0,2,0,0,0,0,0,2,1],
  [1,1,1,0,1,0,1,0,1,0,1,0,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const TOTAL_CANDIES = BASE_MAZE.flat().filter(c => c === 0).length;

function cloneMaze(m: number[][]): number[][] {
  return m.map(r => [...r]);
}

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

const PARENT_COLORS = ['#ff2d78', '#00f0ff'];
const PARENT_EMOJIS = ['👨', '👩'];

export default function ChaosGame() {
  // All mutable game state in refs so the single interval never goes stale
  const mazeRef = useRef(cloneMaze(BASE_MAZE));
  const kidRef = useRef<Pos>({ x: 7, y: 7 });
  const parentsRef = useRef<Pos[]>([{ x: 1, y: 1 }, { x: 13, y: 1 }]);
  const kidDirRef = useRef<Dir>({ x: 0, y: 0 });
  const nextDirRef = useRef<Dir>({ x: 0, y: 0 });
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const gameStateRef = useRef<GameState>('idle');
  const parentTickRef = useRef(0);
  const deadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // React state only for rendering
  const [, forceRender] = useState(0);
  const render = useCallback(() => forceRender(n => n + 1), []);

  const resetPositions = () => {
    kidRef.current = { x: 7, y: 7 };
    parentsRef.current = [{ x: 1, y: 1 }, { x: 13, y: 1 }];
    kidDirRef.current = { x: 0, y: 0 };
    nextDirRef.current = { x: 0, y: 0 };
    parentTickRef.current = 0;
  };

  const startGame = useCallback(() => {
    mazeRef.current = cloneMaze(BASE_MAZE);
    resetPositions();
    scoreRef.current = 0;
    livesRef.current = 3;
    gameStateRef.current = 'playing';
    render();
  }, [render]);

  // Key handler
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
      const kid = kidRef.current;

      // --- Move kid ---
      const tryMove = (d: Dir): Pos | null => {
        const nx = kid.x + d.x, ny = kid.y + d.y;
        if (!isWall(maze, nx, ny)) return { x: nx, y: ny };
        return null;
      };

      let newKid = kid;
      const nextAttempt = tryMove(nextDirRef.current);
      if (nextAttempt && (nextDirRef.current.x !== 0 || nextDirRef.current.y !== 0)) {
        newKid = nextAttempt;
        kidDirRef.current = nextDirRef.current;
      } else {
        const currAttempt = tryMove(kidDirRef.current);
        if (currAttempt) newKid = currAttempt;
      }
      kidRef.current = newKid;

      // Collect candy
      if (maze[newKid.y][newKid.x] === 0) {
        maze[newKid.y][newKid.x] = 2;
        scoreRef.current += 10;
        const remaining = maze.flat().filter(c => c === 0).length;
        if (remaining === 0) {
          gameStateRef.current = 'won';
          render();
          return;
        }
      }

      // --- Move parents every 2 ticks (slower than kid) ---
      parentTickRef.current++;
      if (parentTickRef.current % 2 === 0) {
        parentsRef.current = parentsRef.current.map((parent, i) => {
          // Second parent is slightly dumber (random skip)
          if (i === 1 && Math.random() < 0.25) return parent;
          const step = bfsStep(maze, parent, kidRef.current);
          const nx = parent.x + step.x, ny = parent.y + step.y;
          if (!isWall(maze, nx, ny)) return { x: nx, y: ny };
          return parent;
        });
      }

      // --- Collision ---
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
          }, 1500);
        }
      }

      render();
    }, 160);

    return () => clearInterval(interval);
  }, [render]);

  const gs = gameStateRef.current;
  const maze = mazeRef.current;
  const kid = kidRef.current;
  const parents = parentsRef.current;
  const score = scoreRef.current;
  const lives = livesRef.current;

  const setDir = (d: Dir) => {
    nextDirRef.current = d;
    if (gs === 'idle') startGame();
  };

  const boardW = COLS * CELL;
  const boardH = ROWS * CELL;

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-6">
        {/* Title */}
        <div className="text-center">
          <h2 className="font-bungee text-3xl sm:text-4xl text-white">
            KID <span className="text-neon-pink">CHAOS</span>
          </h2>
          <p className="font-space text-gray-400 text-sm mt-1">
            Escape Mom & Dad — collect all the candy!
          </p>
        </div>

        {/* HUD */}
        <div className="flex items-center gap-10 font-bungee text-lg">
          <span className="text-neon-green">
            🍭 {score}
          </span>
          <span className="text-white">
            {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
              <span key={i}>🧒</span>
            ))}
          </span>
          <span className="text-gray-500 text-sm font-space">
            {TOTAL_CANDIES - maze.flat().filter(c => c === 0).length}/{TOTAL_CANDIES}
          </span>
        </div>

        {/* Board */}
        <div
          className="relative rounded-2xl overflow-hidden border-2 border-neon-pink/30 shadow-[0_0_40px_rgba(255,45,120,0.2)]"
          style={{ width: boardW, height: boardH, maxWidth: '100%' }}
        >
          {/* Cells */}
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className="absolute"
                style={{
                  left: x * CELL,
                  top: y * CELL,
                  width: CELL,
                  height: CELL,
                  background: cell === 1
                    ? 'linear-gradient(135deg, #12124a 0%, #1a1a6e 100%)'
                    : '#0a0a1a',
                  border: cell === 1 ? '1px solid #2d2d9f' : undefined,
                  borderRadius: cell === 1 ? 3 : 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                }}
              >
                {cell === 0 && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: '#ff2d78',
                    boxShadow: '0 0 6px #ff2d78, 0 0 12px rgba(255,45,120,0.4)',
                  }} />
                )}
              </div>
            ))
          )}

          {/* Kid */}
          <div
            className="absolute flex items-center justify-center"
            style={{
              left: kid.x * CELL,
              top: kid.y * CELL,
              width: CELL,
              height: CELL,
              fontSize: CELL * 0.72,
              lineHeight: 1,
              zIndex: 20,
              transition: gs === 'playing' ? 'left 0.12s linear, top 0.12s linear' : 'none',
              filter: gs === 'dead' ? 'grayscale(1)' : 'drop-shadow(0 0 6px rgba(255,255,255,0.6))',
            }}
          >
            {gs === 'dead' ? '😵' : '🧒'}
          </div>

          {/* Parents */}
          {parents.map((p, i) => (
            <div
              key={i}
              className="absolute flex items-center justify-center"
              style={{
                left: p.x * CELL,
                top: p.y * CELL,
                width: CELL,
                height: CELL,
                fontSize: CELL * 0.72,
                lineHeight: 1,
                zIndex: 20,
                transition: 'left 0.25s linear, top 0.25s linear',
                filter: `drop-shadow(0 0 8px ${PARENT_COLORS[i]})`,
              }}
            >
              {PARENT_EMOJIS[i]}
            </div>
          ))}

          {/* Idle overlay */}
          {gs === 'idle' && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-5 z-30">
              <div className="text-6xl">🧒</div>
              <h3 className="font-bungee text-white text-2xl text-center px-4">
                KID <span className="text-neon-pink">CHAOS</span>
              </h3>
              <p className="font-space text-gray-300 text-sm text-center px-8 leading-relaxed">
                Collect all the 🍭 candy!<br />
                Don&apos;t get caught by 👨 Dad or 👩 Mom!
              </p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-neon-pink font-bungee text-white text-lg uppercase rounded-xl
                  shadow-[0_0_20px_rgba(255,45,120,0.6)] hover:shadow-[0_0_30px_rgba(255,45,120,0.9)]
                  hover:scale-105 transition-all"
              >
                Play!
              </button>
              <p className="font-space text-gray-500 text-xs">Arrow keys or buttons below</p>
            </div>
          )}

          {/* Won overlay */}
          {gs === 'won' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-30">
              <div className="text-6xl animate-bounce">🎉</div>
              <h3 className="font-bungee text-neon-green text-3xl">YOU ESCAPED!</h3>
              <p className="font-space text-white text-lg">Score: {score}</p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-neon-green font-bungee text-dark-bg text-lg uppercase rounded-xl
                  shadow-[0_0_20px_rgba(57,255,20,0.6)] hover:scale-105 transition-all"
              >
                Play Again!
              </button>
            </div>
          )}

          {/* Game over overlay */}
          {gs === 'gameover' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-30">
              <div className="text-6xl">😅</div>
              <h3 className="font-bungee text-neon-pink text-3xl">GROUNDED!</h3>
              <p className="font-space text-gray-300 text-sm">Mom & Dad caught you!</p>
              <p className="font-space text-white text-lg">Score: {score}</p>
              <button
                onClick={startGame}
                className="px-8 py-3 bg-neon-pink font-bungee text-white text-lg uppercase rounded-xl
                  shadow-[0_0_20px_rgba(255,45,120,0.6)] hover:scale-105 transition-all"
              >
                Try Again!
              </button>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex flex-col items-center gap-2 select-none">
          <button
            className="w-14 h-14 bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center
              text-white text-xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all"
            onPointerDown={() => setDir({ x: 0, y: -1 })}
          >▲</button>
          <div className="flex gap-2">
            <button
              className="w-14 h-14 bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center
                text-white text-xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all"
              onPointerDown={() => setDir({ x: -1, y: 0 })}
            >◄</button>
            <button
              className="w-14 h-14 bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center
                text-white text-xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all"
              onPointerDown={() => setDir({ x: 0, y: 1 })}
            >▼</button>
            <button
              className="w-14 h-14 bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center
                text-white text-xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all"
              onPointerDown={() => setDir({ x: 1, y: 0 })}
            >►</button>
          </div>
        </div>

        <p className="font-space text-gray-600 text-xs">
          Keyboard: Arrow keys or WASD
        </p>
      </div>
    </section>
  );
}
