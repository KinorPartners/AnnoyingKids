'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dad as DadChar, Mom as MomChar, Grandma as GrandmaChar, Grandpa as GrandpaChar } from '@/components/Characters';

type Pos = { x: number; y: number };
type Dir = { x: number; y: number };
type GameState = 'idle' | 'playing' | 'dead' | 'levelup' | 'won' | 'gameover';
type CharType = 'dad' | 'mom' | 'grandma' | 'grandpa';
type DogState = 'available' | 'chasing' | 'done';

interface Chaser { pos: Pos; type: CharType; stunned?: boolean; }
interface DogData { state: DogState; pos: Pos; targetIdx: number; lastDir: Dir; spawnedAt: number; }
interface HeartData { pos: Pos; spawnedAt: number; }

// Return a random passable cell away from the kid and chasers
function findOpenCell(maze: number[][], chasers: Chaser[], kid: Pos): Pos {
  const open: Pos[] = [];
  maze.forEach((row, y) => row.forEach((cell, x) => {
    if (cell === 1 || cell === 4) return;
    if (x === kid.x && y === kid.y) return;
    if (chasers.some(c => c.pos.x===x && c.pos.y===y)) return;
    // Keep away from starting corners too
    if ((x<=2&&y<=2)||(x>=12&&y<=2)||(x<=2&&y>=12)||(x>=12&&y>=12)) return;
    open.push({x, y});
  }));
  if (open.length === 0) return { x:7, y:5 };
  return open[Math.floor(Math.random()*open.length)];
}

const COLS = 15;
const ROWS = 15;
const BASE_CELL = 36;
const BIG_CELL  = 52;
const TUNNEL_ROW = 7;

// 1=wall, 0=candy, 2=empty, 3=bonus, 4=tunnel
// All mazes: 1-cell-wide corridors only, no 2×2 open areas.

// Levels 1-2: easy — open layout, clear corridors
const MAZE_EASY: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,0,1,1,1,1,0,1],
  [1,0,0,0,1,0,0,3,0,0,1,0,0,0,1],
  [1,1,0,1,1,0,1,0,1,0,1,1,0,1,1],
  [4,2,2,2,2,2,2,2,2,2,2,2,2,2,4],
  [1,1,0,1,1,0,1,0,1,0,1,1,0,1,1],
  [1,0,0,0,1,0,0,3,0,0,1,0,0,0,1],
  [1,0,1,1,1,1,0,1,0,1,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Levels 3-5: moderate — more walls, strategic routing
const BASE_MAZE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,1,0,0,1,0,1,0,0,1,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,3,0,0,1,0,0,0,1],
  [1,1,1,0,1,0,1,0,1,0,1,0,1,1,1],
  [4,2,2,2,1,1,1,2,1,1,1,2,2,2,4],
  [1,1,1,0,1,0,1,0,1,0,1,0,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,0,1,0,0,1,3,1,0,0,1,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Levels 6-9: hard — dense walls, tight corridors
const MAZE_HARD: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,1,0,0,1,0,1,0,0,1,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,0,1,1,0,1,0,1,1,0,1,1,1],
  [1,0,0,0,1,0,0,3,0,0,1,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [4,2,2,2,1,1,1,2,1,1,1,2,2,2,4],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,0,1,1,0,1,0,1,1,0,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,0,1,0,0,1,3,1,0,0,1,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Levels 10+: expert — maximum walls, narrow winding paths
const MAZE_EXPERT: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,1,0,1,0,0,0,0,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,0,1,1,0,1,1,0,1,1,1,1],
  [1,0,0,0,0,0,1,3,1,0,0,0,0,0,1],
  [1,1,0,1,0,1,1,0,1,1,0,1,0,1,1],
  [4,2,2,2,1,1,1,2,1,1,1,2,2,2,4],
  [1,1,0,1,0,1,1,0,1,1,0,1,0,1,1],
  [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,0,3,0,0,1,0,1,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

function getMazeForLevel(level: number): number[][] {
  if (level <= 2) return MAZE_EASY;
  if (level <= 5) return BASE_MAZE;
  if (level <= 9) return MAZE_HARD;
  return MAZE_EXPERT;
}

const BONUS_ICONS = ['🍕','🍭','🎮','🍦','🧃','🍟','🎯','🕹️'];

const PARENT_QUOTES = [
  "Come here!",
  "Organize your room!",
  "It's time for dinner!",
  "Time for bed!",
  "Get off video-games!",
  "It's shower time!",
];

const DOG_SPAWN_TICKS = 25;

function cloneMaze(m: number[][]): number[][] { return m.map(r => [...r]); }

function wrapX(x: number): number { return ((x % COLS) + COLS) % COLS; }

function isWall(m: number[][], x: number, y: number): boolean {
  if (y < 0 || y >= ROWS) return true;
  return m[y][wrapX(x)] === 1;
}

function resolvePos(x: number, y: number): Pos { return { x: wrapX(x), y }; }

function randomStep(maze: number[][], pos: Pos, lastDir: Dir): Dir {
  const dirs: Dir[] = [{x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}];
  if ((lastDir.x!==0||lastDir.y!==0) && Math.random()<0.5) {
    const nx=pos.x+lastDir.x, ny=pos.y+lastDir.y;
    if (!isWall(maze,nx,ny)) return lastDir;
  }
  const reverse = {x:-lastDir.x, y:-lastDir.y};
  const shuffled = dirs.sort(()=>Math.random()-0.5);
  const nonReverse = shuffled.filter(d=>!(d.x===reverse.x&&d.y===reverse.y));
  for (const d of nonReverse) { if (!isWall(maze,pos.x+d.x,pos.y+d.y)) return d; }
  for (const d of shuffled)   { if (!isWall(maze,pos.x+d.x,pos.y+d.y)) return d; }
  return {x:0,y:0};
}

function bfsStep(maze: number[][], from: Pos, to: Pos): Dir {
  if (from.x === to.x && from.y === to.y) return { x: 0, y: 0 };
  const dirs: Dir[] = [{ x:0,y:-1},{x:0,y:1},{x:-1,y:0},{x:1,y:0}];
  const visited = new Set<string>([`${from.x},${from.y}`]);
  const queue: Array<{ pos: Pos; first: Dir }> = [];
  for (const d of dirs) {
    const raw = { x: from.x+d.x, y: from.y+d.y };
    if (!isWall(maze, raw.x, raw.y)) {
      const np = resolvePos(raw.x, raw.y);
      const k=`${np.x},${np.y}`; if (visited.has(k)) continue; visited.add(k);
      if (np.x===to.x&&np.y===to.y) return d;
      queue.push({ pos:np, first:d });
    }
  }
  while (queue.length) {
    const {pos,first}=queue.shift()!;
    for (const d of dirs) {
      const raw = { x: pos.x+d.x, y: pos.y+d.y };
      if (!isWall(maze, raw.x, raw.y)) {
        const np = resolvePos(raw.x, raw.y);
        const k=`${np.x},${np.y}`;
        if (!visited.has(k)) {
          visited.add(k);
          if (np.x===to.x&&np.y===to.y) return first;
          queue.push({pos:np,first});
        }
      }
    }
  }
  return { x:0,y:0 };
}

function getInitialChasers(level: number): Chaser[] {
  const c: Chaser[] = [
    { pos:{x:1,y:1},   type:'dad' },
    { pos:{x:13,y:1},  type:'mom' },
  ];
  if (level >= 3)  c.push({ pos:{x:1,y:13},  type:'grandma' });
  if (level >= 5)  c.push({ pos:{x:13,y:13}, type:'grandpa' });
  return c;
}

function moveEvery(type: CharType, level: number): number {
  const base = Math.max(1, 7 - Math.floor((level - 1) / 2));
  switch (type) {
    case 'dad':     return base;
    case 'mom':     return Math.max(1, base + 1);
    case 'grandma': return Math.max(1, base + 3);
    case 'grandpa': return Math.max(1, base + 4);
  }
}

function skipChance(type: CharType, level: number): number {
  switch (type) {
    case 'dad':     return Math.max(0,    0.70 - level * 0.06);
    case 'mom':     return Math.max(0.05, 0.80 - level * 0.07);
    case 'grandma': return Math.max(0.15, 0.90 - level * 0.06);
    case 'grandpa': return Math.max(0.20, 0.95 - (Math.max(0,level-10)) * 0.05);
  }
}

const DIR_KEYS: Record<string, Dir> = {
  ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1},
  ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0},
  w:{x:0,y:-1}, s:{x:0,y:1}, a:{x:-1,y:0}, d:{x:1,y:0},
};

// ─── Character components ────────────────────────────────────────────

function Kid({ size, dead }: { size: number; dead: boolean }) {
  if (dead) return (
    <div style={{position:'relative',width:size,height:size,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <style>{`
        @keyframes tl{0%{transform:translate(0,0);opacity:1}100%{transform:translate(-10px,16px);opacity:0}}
        @keyframes tr{0%{transform:translate(0,0);opacity:1}100%{transform:translate(10px,16px);opacity:0}}
        @keyframes tl2{0%{transform:translate(0,0);opacity:1}100%{transform:translate(-14px,22px);opacity:0}}
        @keyframes tr2{0%{transform:translate(0,0);opacity:1}100%{transform:translate(14px,22px);opacity:0}}
        .ck-tl{animation:tl 0.7s ease-in infinite}
        .ck-tr{animation:tr 0.7s ease-in infinite;animation-delay:0.1s}
        .ck-tl2{animation:tl2 0.7s ease-in infinite;animation-delay:0.35s}
        .ck-tr2{animation:tr2 0.7s ease-in infinite;animation-delay:0.45s}
      `}</style>
      <span style={{fontSize:size*0.864,lineHeight:1,zIndex:2,position:'relative'}}>😢</span>
      <div className="ck-tl"  style={{position:'absolute',top:'38%',left:'22%',width:5,height:7,background:'#3b82f6',borderRadius:'50% 50% 50% 50%/40% 40% 60% 60%',zIndex:3}}/>
      <div className="ck-tl2" style={{position:'absolute',top:'38%',left:'17%',width:4,height:6,background:'#60a5fa',borderRadius:'50% 50% 50% 50%/40% 40% 60% 60%',zIndex:3}}/>
      <div className="ck-tr"  style={{position:'absolute',top:'38%',right:'22%',width:5,height:7,background:'#3b82f6',borderRadius:'50% 50% 50% 50%/40% 40% 60% 60%',zIndex:3}}/>
      <div className="ck-tr2" style={{position:'absolute',top:'38%',right:'17%',width:4,height:6,background:'#60a5fa',borderRadius:'50% 50% 50% 50%/40% 40% 60% 60%',zIndex:3}}/>
    </div>
  );
  return (
    <div style={{position:'relative',width:size,height:size,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <span style={{fontSize:size*0.864,lineHeight:1,filter:'brightness(1)'}}>🧒🏽</span>
      <div style={{position:'absolute',bottom:'14%',left:'50%',transform:'translateX(-50%)',width:size*0.18,height:size*0.16,background:'#ef4444',borderRadius:'0 0 50% 50%',boxShadow:'0 1px 4px rgba(239,68,68,0.6)',zIndex:3}}/>
    </div>
  );
}

const Dad = DadChar;
const Mom = MomChar;
const Grandma = GrandmaChar;
const Grandpa = GrandpaChar;

function ChaserChar({ chaser, size }: { chaser: Chaser; size: number }) {
  switch (chaser.type) {
    case 'dad':     return <Dad size={size} />;
    case 'mom':     return <Mom size={size} />;
    case 'grandma': return <Grandma size={size} />;
    case 'grandpa': return <Grandpa size={size} />;
  }
}

// ─── Leaderboard ─────────────────────────────────────────────────────

interface LeaderEntry { name: string; score: number; level: number; ts?: number; }
const LB_KEY = 'ak_chaos_leaderboard';

function loadLeaderboard(): LeaderEntry[] {
  try { return JSON.parse(localStorage.getItem(LB_KEY) || '[]'); }
  catch { return []; }
}
function saveLeaderboard(lb: LeaderEntry[]) {
  try { localStorage.setItem(LB_KEY, JSON.stringify(lb)); } catch {}
}
function isNewRecord(score: number, lb: LeaderEntry[]): boolean {
  if (score === 0) return false;
  return lb.length < 10 || score > lb[lb.length - 1].score;
}

const CHASER_GLOW: Record<CharType, string> = {
  dad:     'drop-shadow(0 0 6px #00f0ff)',
  mom:     'drop-shadow(0 0 6px #ff2d78)',
  grandma: 'drop-shadow(0 0 6px #a855f7)',
  grandpa: 'drop-shadow(0 0 6px #f59e0b)',
};

// ─── Main component ────────────────────────────────────────────────────

export default function ChaosGame({ fullPage = false }: { fullPage?: boolean }) {
  const mazeRef      = useRef(cloneMaze(BASE_MAZE));
  const kidRef       = useRef<Pos>({ x:7, y:7 });
  const chasersRef   = useRef<Chaser[]>(getInitialChasers(1));
  const kidDirRef    = useRef<Dir>({ x:0, y:0 });
  const nextDirRef   = useRef<Dir>({ x:0, y:0 });
  const scoreRef     = useRef(0);
  const livesRef     = useRef(3);
  const levelRef     = useRef(1);
  const tickRef      = useRef(0);
  const gameStateRef = useRef<GameState>('idle');
  const deadTimerRef = useRef<ReturnType<typeof setTimeout>|null>(null);
  const lvlTimerRef  = useRef<ReturnType<typeof setTimeout>|null>(null);
  const dogRef          = useRef<DogData|null>(null);
  const dogSpawnsRef    = useRef({ total:3, used:0, nextSpawnTick:25 });
  const heartRef        = useRef<HeartData|null>(null);
  const heartSpawnTickRef = useRef(0);
  const chaserBubblesRef = useRef<Record<string, {quote:string; showUntilTick:number}>>({});

  const [bigMode, setBigMode] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  useEffect(() => {
    const update = () => { setWindowWidth(window.innerWidth); setWindowHeight(window.innerHeight); };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  const isMobile = windowWidth > 0 && windowWidth < 640;
  const CS = (() => {
    if (windowWidth === 0) return BASE_CELL;
    const widthCS = Math.max(18, Math.floor((windowWidth - 32) / COLS));
    if (fullPage && windowHeight > 0) {
      // Reserve: header (64px mobile / 80px desktop) + title+HUD (~80px) + d-pad (~160px) + padding (~24px)
      const reserved = isMobile ? 340 : 320;
      const heightCS = Math.max(18, Math.floor((windowHeight - reserved) / ROWS));
      return Math.min(widthCS, heightCS);
    }
    if (isMobile) return widthCS;
    return bigMode ? BIG_CELL : BASE_CELL;
  })();
  const kidTeleportRef = useRef(false);
  const chaserLastDirRef = useRef<Record<string,Dir>>({});
  const bonusIconsRef = useRef<Record<string,string>>({});

  useEffect(() => {
    let idx = 0;
    [MAZE_EASY, BASE_MAZE, MAZE_HARD, MAZE_EXPERT].forEach(maze => {
      maze.forEach((row,y) => row.forEach((cell,x) => {
        const key = `${x},${y}`;
        if (cell===3 && !bonusIconsRef.current[key]) {
          bonusIconsRef.current[key] = BONUS_ICONS[idx++ % BONUS_ICONS.length];
        }
      }));
    });
  }, []);

  const [, forceRender] = useState(0);
  const render = useCallback(() => forceRender(n => n+1), []);

  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
  const [lbTab, setLbTab] = useState<'all'|'weekly'|'today'>('all');
  const [nameInput, setNameInput] = useState('');
  const [awaitingName, setAwaitingName] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<{score:number;level:number}|null>(null);

  useEffect(() => { setLeaderboard(loadLeaderboard()); }, []);

  const resetPositions = (level: number) => {
    kidRef.current     = { x:7, y:7 };
    chasersRef.current = getInitialChasers(level);
    kidDirRef.current  = { x:0, y:0 };
    nextDirRef.current = { x:0, y:0 };
    tickRef.current    = 0;
    dogRef.current        = null;
    dogSpawnsRef.current  = { total: Math.floor(Math.random()*4)+2, used:0, nextSpawnTick:25 };
    heartRef.current      = null;
    heartSpawnTickRef.current = Math.floor(Math.random()*40)+30; // spawn between tick 30-70
    chaserBubblesRef.current = {};
  };

  const startGame = useCallback(() => {
    mazeRef.current      = cloneMaze(getMazeForLevel(1));
    levelRef.current     = 1;
    scoreRef.current     = 0;
    livesRef.current     = 3;
    resetPositions(1);
    gameStateRef.current = 'playing';
    render();
  }, [render]);

  useEffect(() => {
    const handler = () => {
      const s = gameStateRef.current;
      if (s === 'idle' || s === 'gameover' || s === 'won') startGame();
    };
    window.addEventListener('chaos-game-autostart', handler);
    return () => window.removeEventListener('chaos-game-autostart', handler);
  }, [startGame]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = DIR_KEYS[e.key]; if (!d) return;
      e.preventDefault();
      nextDirRef.current = d;
      if (gameStateRef.current === 'playing') {
        const k = kidRef.current;
        if (!isWall(mazeRef.current, k.x + d.x, k.y + d.y)) kidDirRef.current = d;
      }
      if (gameStateRef.current === 'idle') startGame();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [startGame]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameStateRef.current !== 'playing') return;

      const maze = mazeRef.current;
      const kid  = kidRef.current;
      tickRef.current++;

      // Move kid — non-stunned parents block movement like walls
      const tryMove = (d: Dir): Pos|null => {
        const nx=kid.x+d.x, ny=kid.y+d.y;
        if (isWall(maze,nx,ny)) return null;
        const rp = resolvePos(nx, ny);
        if (chasersRef.current.some(c => !c.stunned && c.pos.x===rp.x && c.pos.y===rp.y)) return null;
        return rp;
      };
      let newKid = kid;
      const nextAttempt = tryMove(nextDirRef.current);
      if (nextAttempt && (nextDirRef.current.x!==0||nextDirRef.current.y!==0)) {
        newKid = nextAttempt; kidDirRef.current = nextDirRef.current;
      } else {
        const curr = tryMove(kidDirRef.current); if (curr) newKid = curr;
      }
      kidTeleportRef.current = Math.abs(newKid.x - kid.x) > 1;
      kidRef.current = newKid;

      // Collect
      const cell = maze[newKid.y][newKid.x];
      if (cell===0) { maze[newKid.y][newKid.x]=2; scoreRef.current+=10*levelRef.current; }
      else if (cell===3) { maze[newKid.y][newKid.x]=2; scoreRef.current+=50*levelRef.current; }

      // Dog: spawn on schedule (2-5 spawns per level)
      const ds = dogSpawnsRef.current;
      if (dogRef.current === null && ds.used < ds.total && tickRef.current === ds.nextSpawnTick) {
        const pos = findOpenCell(maze, chasersRef.current, newKid);
        dogRef.current = { state:'available', pos, targetIdx:-1, lastDir:{x:0,y:0}, spawnedAt:tickRef.current };
        ds.used++;
      }

      // Dog: timeout if not picked up after ~12s (100 ticks)
      const dog = dogRef.current;
      if (dog?.state === 'available' && tickRef.current - dog.spawnedAt >= 100) {
        dogRef.current = null;
        if (ds.used < ds.total) ds.nextSpawnTick = tickRef.current + Math.floor(Math.random()*20)+15;
      }

      // Dog: kid picks up
      if (dogRef.current?.state === 'available' && dogRef.current.pos.x===newKid.x && dogRef.current.pos.y===newKid.y) {
        const validTargets = chasersRef.current.map((c,i)=>({c,i})).filter(({c})=>!c.stunned);
        if (validTargets.length > 0) {
          const pick = validTargets[Math.floor(Math.random()*validTargets.length)];
          dogRef.current = { ...dogRef.current, state:'chasing', targetIdx:pick.i };
        } else {
          dogRef.current = { ...dogRef.current, state:'done' };
          if (ds.used < ds.total) ds.nextSpawnTick = tickRef.current + Math.floor(Math.random()*25)+20;
        }
      }

      // Dog: chase and catch parent
      const dogNow = dogRef.current;
      if (dogNow?.state === 'chasing' && tickRef.current % 3 === 0) {
        const target = chasersRef.current[dogNow.targetIdx];
        if (target && !target.stunned) {
          const step = bfsStep(maze, dogNow.pos, target.pos);
          const nx=dogNow.pos.x+step.x, ny=dogNow.pos.y+step.y;
          if (!isWall(maze,nx,ny)) { dogNow.pos=resolvePos(nx,ny); dogNow.lastDir=step; }
          if (dogNow.pos.x===target.pos.x && dogNow.pos.y===target.pos.y) {
            chasersRef.current = chasersRef.current.map((c,i) => i===dogNow.targetIdx ? {...c,stunned:true} : c);
            dogRef.current = { ...dogNow, state:'done' };
            if (ds.used < ds.total) ds.nextSpawnTick = tickRef.current + Math.floor(Math.random()*30)+25;
          }
        }
      }

      // Heart: spawn once per level
      if (!heartRef.current && tickRef.current === heartSpawnTickRef.current) {
        heartRef.current = { pos: findOpenCell(maze, chasersRef.current, newKid), spawnedAt: tickRef.current };
      }
      // Heart: despawn after 10 seconds (~83 ticks)
      if (heartRef.current && tickRef.current - heartRef.current.spawnedAt >= 83) {
        heartRef.current = null;
      }
      // Heart: kid picks up → +1 life
      if (heartRef.current && heartRef.current.pos.x===newKid.x && heartRef.current.pos.y===newKid.y) {
        livesRef.current++;
        heartRef.current = null;
      }

      // Level complete?
      if (maze.flat().filter(c=>c===0||c===3).length===0) {
        gameStateRef.current = 'levelup';
        const lb = loadLeaderboard();
        if (isNewRecord(scoreRef.current, lb)) {
          setPendingEntry({ score:scoreRef.current, level:levelRef.current });
          setAwaitingName(true); setNameInput('');
        }
        if (lvlTimerRef.current) clearTimeout(lvlTimerRef.current);
        lvlTimerRef.current = setTimeout(() => {
          levelRef.current++;
          mazeRef.current = cloneMaze(getMazeForLevel(levelRef.current));
          resetPositions(levelRef.current);
          gameStateRef.current = 'playing';
          render();
        }, 2000);
        render(); return;
      }

      // Move chasers (skip stunned)
      const level = levelRef.current;
      chasersRef.current = chasersRef.current.map(ch => {
        if (ch.stunned) return ch;
        const every = moveEvery(ch.type, level);
        if (tickRef.current % every !== 0) return ch;
        const lastDir = chaserLastDirRef.current[ch.type] ?? {x:0,y:0};
        const step: Dir = Math.random() < skipChance(ch.type, level)
          ? randomStep(maze, ch.pos, lastDir)
          : bfsStep(maze, ch.pos, kidRef.current);
        const nx=ch.pos.x+step.x, ny=ch.pos.y+step.y;
        if (isWall(maze,nx,ny)) return ch;
        chaserLastDirRef.current[ch.type] = step;
        return { ...ch, pos:resolvePos(nx,ny) };
      });

      // Collision (stunned chasers are harmless)
      const caught = chasersRef.current.some(c=>!c.stunned&&c.pos.x===kidRef.current.x&&c.pos.y===kidRef.current.y);
      if (caught) {
        livesRef.current--;
        if (livesRef.current<=0) {
          gameStateRef.current='gameover';
          const lb = loadLeaderboard();
          if (isNewRecord(scoreRef.current, lb)) {
            setPendingEntry({ score:scoreRef.current, level:levelRef.current });
            setAwaitingName(true); setNameInput('');
          }
        } else {
          gameStateRef.current='dead';
          if (deadTimerRef.current) clearTimeout(deadTimerRef.current);
          deadTimerRef.current = setTimeout(() => {
            resetPositions(levelRef.current);
            gameStateRef.current='playing'; render();
          }, 1800);
        }
      }

      // Speech bubbles — staggered show/hide cycle per chaser
      chasersRef.current.forEach(ch => {
        if (ch.stunned) return;
        const stagger = ch.type==='dad'?8 : ch.type==='mom'?18 : ch.type==='grandma'?28 : 38;
        const cur = chaserBubblesRef.current[ch.type];
        if (!cur) {
          chaserBubblesRef.current[ch.type] = { quote:'', showUntilTick: stagger };
        } else if (tickRef.current >= cur.showUntilTick) {
          if (cur.quote==='') {
            const q = PARENT_QUOTES[Math.floor(Math.random()*PARENT_QUOTES.length)];
            chaserBubblesRef.current[ch.type] = { quote:q, showUntilTick:tickRef.current+22 };
          } else {
            chaserBubblesRef.current[ch.type] = { quote:'', showUntilTick:tickRef.current+18 };
          }
        }
      });

      render();
    }, 120);
    return () => clearInterval(interval);
  }, [render]);

  const gs      = gameStateRef.current;
  const maze    = mazeRef.current;
  const kid     = kidRef.current;
  const chasers = chasersRef.current;
  const score   = scoreRef.current;
  const lives   = livesRef.current;
  const level   = levelRef.current;

  const setDir = (d: Dir) => { nextDirRef.current = d; if (gs==='idle') startGame(); };
  const setDirWithHaptic = (d: Dir) => { try { navigator.vibrate?.(12); } catch {} setDir(d); };

  const submitName = () => {
    if (!pendingEntry || !nameInput.trim()) return;
    const entry: LeaderEntry = {
      name: nameInput.trim().slice(0,16),
      score: pendingEntry.score,
      level: pendingEntry.level,
      ts: Date.now(),
    };
    const updated = [...leaderboard, entry].sort((a,b)=>b.score-a.score).slice(0,10);
    saveLeaderboard(updated);
    setLeaderboard(updated);
    setAwaitingName(false); setPendingEntry(null); setNameInput('');
  };

  const resetToIdle = useCallback(() => {
    gameStateRef.current = 'idle';
    setAwaitingName(false); setPendingEntry(null);
    render();
  }, [render]);

  const newChasersAtLevel = (lvl: number) =>
    lvl===3 ? '👵 Grandma joins the chase!' :
    lvl===5 ? '👴 Grandpa joins the chaos!' : null;

  const touchStartRef = useRef<{x:number;y:number}|null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x:t.clientX, y:t.clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx=t.clientX-touchStartRef.current.x, dy=t.clientY-touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx)<20&&Math.abs(dy)<20) return;
    let d: Dir;
    if (Math.abs(dx)>Math.abs(dy)) { d=dx>0?{x:1,y:0}:{x:-1,y:0}; }
    else                           { d=dy>0?{x:0,y:1}:{x:0,y:-1}; }
    nextDirRef.current = d;
    if (gameStateRef.current==='playing'&&!isWall(mazeRef.current,kidRef.current.x+d.x,kidRef.current.y+d.y)) kidDirRef.current=d;
    if (gameStateRef.current==='idle') startGame();
  };

  // Leaderboard tab filtering
  const now = Date.now();
  const todayStart  = new Date(); todayStart.setHours(0,0,0,0);
  const weekStart   = new Date(todayStart); weekStart.setDate(weekStart.getDate()-6);
  const lbFiltered = (() => {
    if (lbTab==='today')  return leaderboard.filter(e=>e.ts!=null && e.ts>=todayStart.getTime()).sort((a,b)=>b.score-a.score).slice(0,10);
    if (lbTab==='weekly') return leaderboard.filter(e=>e.ts!=null && e.ts>=weekStart.getTime()).sort((a,b)=>b.score-a.score).slice(0,10);
    return leaderboard;
  })();

  return (
    <section className={fullPage
      ? 'flex flex-col items-center justify-center h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)] px-2 py-2 gap-2 overflow-hidden'
      : 'py-12 px-4'
    }>
      <div className={fullPage ? 'flex flex-col items-center gap-2 w-full' : 'max-w-2xl mx-auto flex flex-col items-center gap-5'}>

        {/* Title */}
        <div className="text-center">
          <h2 className={`font-bungee text-white ${fullPage ? 'text-xl sm:text-2xl' : 'text-3xl sm:text-4xl'}`}>
            KID <span className="text-neon-pink">CHAOS</span>
          </h2>
          {!fullPage && (
            <p className="font-space text-gray-400 text-sm mt-1">
              Escape your family — collect candy &amp; bonus items!
            </p>
          )}
        </div>

        {/* HUD */}
        <div className="flex items-center gap-4 font-bungee flex-wrap justify-center">
          <span className="text-neon-yellow text-sm border border-neon-yellow/30 px-3 py-1 rounded-lg">
            LVL {level}
          </span>
          <span className="text-neon-green">🍭 {score}</span>
          <span className="text-gray-600 text-xs font-space">{level*10}pts/candy</span>
          <span>
            {Array.from({length:Math.max(0,lives)}).map((_,i)=><span key={i}>🧒🏽</span>)}
          </span>
          {!isMobile && (
            <button
              onClick={() => setBigMode(b => !b)}
              title={bigMode ? 'Shrink game' : 'Expand game'}
              className="ml-2 px-3 py-1 bg-dark-surface border border-dark-border rounded-lg text-gray-400 hover:text-neon-blue hover:border-neon-blue/50 text-sm transition-all"
            >
              {bigMode ? '⊟ Small' : '⊞ Big'}
            </button>
          )}
        </div>

        {/* Board */}
        <div
          className="relative rounded-2xl overflow-hidden border-2 border-neon-pink/30 shadow-[0_0_40px_rgba(255,45,120,0.2)]"
          style={{ width:COLS*CS, height:ROWS*CS, touchAction:'none' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Cells */}
          {maze.map((row,y) => row.map((cell,x) => (
            <div key={`${x}-${y}`} className="absolute" style={{
              left:x*CS, top:y*CS, width:CS, height:CS,
              background: cell===1 ? 'linear-gradient(135deg,#12124a,#1a1a6e)' : '#0a0a1a',
              border: cell===1 ? '1px solid #2d2d9f' : undefined,
              borderRadius: cell===1 ? 3 : 0,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxSizing:'border-box',
              boxShadow: cell===4 ? (x===0 ? 'inset 6px 0 10px -4px #00f0ff55' : 'inset -6px 0 10px -4px #00f0ff55') : undefined,
            }}>
              {cell===0 && <div style={{width:7,height:7,borderRadius:'50%',background:'#ff2d78',boxShadow:'0 0 6px #ff2d78'}}/>}
              {cell===3 && <span style={{fontSize:CS*0.55,lineHeight:1}}>{bonusIconsRef.current[`${x},${y}`]??'🍭'}</span>}
            </div>
          )))}

          {/* Kid — z-index raised above chasers when dead */}
          <div className="absolute" style={{
            left:kid.x*CS, top:kid.y*CS, width:CS, height:CS,
            zIndex: gs==='dead' ? 30 : 20,
            transition: kidTeleportRef.current ? 'none'
              : gs==='playing' ? 'left 0.1s linear,top 0.1s linear,opacity 0.06s' : 'none',
            opacity: (kid.y===TUNNEL_ROW && (kid.x===0||kid.x===COLS-1)) ? 0 : 1,
          }}>
            <Kid size={CS} dead={gs==='dead'} />
          </div>

          {/* Chasers */}
          {chasers.map((ch, i) => {
            const inTunnel = ch.pos.y===TUNNEL_ROW && (ch.pos.x===0||ch.pos.x===COLS-1);
            return (
              <div key={`${ch.type}-${i}`} className="absolute" style={{
                left:ch.pos.x*CS, top:ch.pos.y*CS, width:CS, height:CS, zIndex:20,
                transition:'left 0.22s linear,top 0.22s linear,opacity 0.06s',
                opacity: inTunnel ? 0 : (ch.stunned ? 0.35 : 1),
                filter: ch.stunned ? 'grayscale(1)' : CHASER_GLOW[ch.type],
              }}>
                <ChaserChar chaser={ch} size={CS} />
                {ch.stunned && (
                  <span style={{position:'absolute',top:'4%',left:'50%',transform:'translateX(-50%)',fontSize:CS*0.38,zIndex:3,lineHeight:1}}>😵</span>
                )}
              </div>
            );
          })}

          {/* Dog */}
          {dogRef.current && dogRef.current.state !== 'done' && (
            <div className="absolute" style={{
              left:dogRef.current.pos.x*CS, top:dogRef.current.pos.y*CS,
              width:CS, height:CS, zIndex:22,
              display:'flex', alignItems:'center', justifyContent:'center',
              transition: dogRef.current.state==='chasing' ? 'left 0.12s linear,top 0.12s linear' : 'none',
              filter:'drop-shadow(0 0 6px #fbbf24)',
            }}>
              <span style={{fontSize:CS*0.72,lineHeight:1}}>🐕</span>
              {dogRef.current.state === 'available' && (
                <div style={{
                  position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)',
                  background:'#fbbf24', borderRadius:4, padding:'1px 5px',
                  fontSize:Math.max(7, CS*0.22), fontWeight:700, color:'#000',
                  whiteSpace:'nowrap', zIndex:3, lineHeight:1.4,
                  boxShadow:'0 0 6px #fbbf24',
                }}>PICK UP!</div>
              )}
            </div>
          )}

          {/* Heart / extra life pickup */}
          {heartRef.current && (() => {
            const h = heartRef.current!;
            const ticksLeft = 83 - (tickRef.current - h.spawnedAt);
            const urgentPulse = ticksLeft < 25;
            return (
              <div className="absolute" style={{
                left:h.pos.x*CS, top:h.pos.y*CS, width:CS, height:CS, zIndex:23,
                display:'flex', alignItems:'center', justifyContent:'center',
                filter:'drop-shadow(0 0 6px #ef4444)',
                animation: urgentPulse ? 'heart-pulse 0.4s ease-in-out infinite alternate' : 'heart-pulse 0.9s ease-in-out infinite alternate',
              }}>
                <style>{`@keyframes heart-pulse{0%{transform:scale(0.9)}100%{transform:scale(1.15)}}`}</style>
                <span style={{fontSize:CS*0.68,lineHeight:1}}>❤️</span>
                <div style={{
                  position:'absolute', top:-13, left:'50%', transform:'translateX(-50%)',
                  background:'#ef4444', borderRadius:4, padding:'1px 5px',
                  fontSize:Math.max(7,CS*0.22), fontWeight:700, color:'#fff',
                  whiteSpace:'nowrap', zIndex:3, lineHeight:1.4,
                  boxShadow:'0 0 6px #ef4444',
                }}>+LIFE!</div>
              </div>
            );
          })()}

          {/* Speech bubbles */}
          {chasers.map((ch) => {
            const bubble = chaserBubblesRef.current[ch.type];
            if (!bubble || !bubble.quote || ch.stunned) return null;
            const inTunnel = ch.pos.y===TUNNEL_ROW && (ch.pos.x===0||ch.pos.x===COLS-1);
            if (inTunnel) return null;
            const bx = ch.pos.x*CS - 8;
            const by = ch.pos.y*CS - 32;
            return (
              <div key={`bbl-${ch.type}`} className="absolute" style={{
                left:Math.max(2, Math.min(bx, COLS*CS-110)),
                top:Math.max(2, by),
                zIndex:27, pointerEvents:'none',
              }}>
                <div style={{
                  background:'#fff', color:'#111', borderRadius:7,
                  padding:'3px 7px', fontSize:Math.max(8,CS*0.25),
                  fontWeight:700, whiteSpace:'nowrap',
                  boxShadow:'0 2px 8px rgba(0,0,0,0.55)',
                  position:'relative', fontFamily:'sans-serif', lineHeight:1.4,
                }}>
                  {bubble.quote}
                  <div style={{
                    position:'absolute', bottom:-6, left:'38%',
                    width:0, height:0,
                    borderLeft:'6px solid transparent',
                    borderRight:'6px solid transparent',
                    borderTop:'6px solid #fff',
                  }}/>
                </div>
              </div>
            );
          })}

          {/* Idle overlay */}
          {gs==='idle' && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-4 z-30">
              <div className="flex items-center gap-1">
                <Grandpa size={55}/><Grandma size={55}/><Mom size={55}/><Dad size={55}/>
                <span className="text-gray-500 mx-2 font-bungee text-lg">vs</span>
                <Kid size={55} dead={false}/>
              </div>
              <h3 className="font-bungee text-white text-2xl">KID <span className="text-neon-pink">CHAOS</span></h3>
              <p className="font-space text-gray-300 text-xs text-center px-8 leading-relaxed">
                🍭 Candy = 10pts · Bonus items = 50pts<br/>
                🐕 Dog chases a parent away · ❤️ Heart = +1 life!<br/>
                👵 Grandma joins at Level 3 · 👴 Grandpa at Level 5
              </p>
              {fullPage ? (
                <button onClick={startGame}
                  className="px-8 py-3 bg-neon-pink font-bungee text-white text-lg uppercase rounded-xl shadow-[0_0_20px_rgba(255,45,120,0.6)] hover:scale-105 transition-all">
                  Play!
                </button>
              ) : (
                <Link href="/game"
                  className="px-8 py-3 bg-neon-pink font-bungee text-white text-lg uppercase rounded-xl shadow-[0_0_20px_rgba(255,45,120,0.6)] hover:scale-105 transition-all inline-block text-center">
                  Play!
                </Link>
              )}
              <p className="font-space text-gray-500 text-xs">{isMobile ? 'Swipe or tap buttons below' : 'Arrow keys · WASD · buttons below'}</p>
            </div>
          )}

          {/* Level up overlay */}
          {gs==='levelup' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 z-30">
              <div className="text-5xl animate-bounce">⭐</div>
              <h3 className="font-bungee text-neon-yellow text-3xl">LEVEL {level} CLEAR!</h3>
              <p className="font-space text-white">Score: {score}</p>
              {newChasersAtLevel(level+1) && (
                <p className="font-space text-neon-pink text-sm animate-pulse mt-1">⚠️ {newChasersAtLevel(level+1)}</p>
              )}
              <p className="font-space text-gray-400 text-sm">Get ready for Level {level+1}…</p>
            </div>
          )}

          {/* Won */}
          {gs==='won' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-30">
              <button onClick={resetToIdle} aria-label="Close"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-base transition-all">✕</button>
              <Link href="/products" className="block mb-1" onClick={e => e.stopPropagation()}>
                <Image src="/logo.png" alt="AnnoyingKids" width={140} height={34} className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity" />
              </Link>
              <div className="text-5xl animate-bounce">🎉</div>
              <h3 className="font-bungee text-neon-green text-3xl">YOU ESCAPED!</h3>
              <p className="font-space text-white text-lg">Score: {score}</p>
              <button onClick={startGame} className="px-8 py-3 bg-neon-green font-bungee text-dark-bg text-lg uppercase rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.6)] hover:scale-105 transition-all">Play Again!</button>
            </div>
          )}

          {/* Game over */}
          {gs==='gameover' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 z-30 px-4">
              <button onClick={resetToIdle} aria-label="Close"
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-base transition-all">✕</button>
              <Link href="/products" className="block mb-1" onClick={e => e.stopPropagation()}>
                <Image src="/logo.png" alt="AnnoyingKids" width={140} height={34} className="h-8 w-auto opacity-90 hover:opacity-100 transition-opacity" />
              </Link>
              <div className="text-5xl">😅</div>
              <h3 className="font-bungee text-neon-pink text-3xl">GROUNDED!</h3>
              <p className="font-space text-white text-lg">Score: {score} · Level {level}</p>
              {awaitingName ? (
                <>
                  <p className="font-bungee text-neon-yellow text-sm animate-pulse">🏆 NEW RECORD!</p>
                  <p className="font-space text-gray-300 text-xs">Enter your name:</p>
                  <input
                    autoFocus={!isMobile}
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key==='Enter' && submitName()}
                    maxLength={16}
                    placeholder="Your name…"
                    className="w-40 px-3 py-2 bg-dark-card border-2 border-neon-yellow/60 rounded-lg font-bungee text-white text-center text-sm focus:outline-none focus:border-neon-yellow"
                  />
                  <button onClick={submitName}
                    className="px-6 py-2 bg-neon-yellow font-bungee text-dark-bg text-sm uppercase rounded-lg hover:scale-105 transition-all">
                    Save Score!
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <button onClick={startGame} className="px-8 py-3 bg-neon-pink font-bungee text-white text-lg uppercase rounded-xl shadow-[0_0_20px_rgba(255,45,120,0.6)] hover:scale-105 transition-all">Try Again!</button>
                  {fullPage && (
                    <Link href="/products"
                      className="px-6 py-2 border border-neon-green/50 text-neon-green font-space text-sm rounded-lg hover:bg-neon-green/10 transition-all">
                      🛒 Shop the Merch
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* D-pad controls */}
        <div className="grid select-none" style={{ gridTemplateColumns:'repeat(3,1fr)', gap: fullPage ? 6 : 8, touchAction:'manipulation' }}>
          <div />
          <button className={`${fullPage ? 'w-12 h-12' : 'w-16 h-16 sm:w-14 sm:h-14'} bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center text-white text-2xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all`} onPointerDown={()=>setDirWithHaptic({x:0,y:-1})}>▲</button>
          <div />
          <button className={`${fullPage ? 'w-12 h-12' : 'w-16 h-16 sm:w-14 sm:h-14'} bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center text-white text-2xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all`} onPointerDown={()=>setDirWithHaptic({x:-1,y:0})}>◄</button>
          <div className={`${fullPage ? 'w-12 h-12' : 'w-16 h-16 sm:w-14 sm:h-14'} rounded-xl bg-dark-surface/30 border-2 border-dark-border/30 flex items-center justify-center`}>
            <span className="text-gray-700 text-xs font-bungee">D-PAD</span>
          </div>
          <button className={`${fullPage ? 'w-12 h-12' : 'w-16 h-16 sm:w-14 sm:h-14'} bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center text-white text-2xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all`} onPointerDown={()=>setDirWithHaptic({x:1,y:0})}>►</button>
          <div />
          <button className={`${fullPage ? 'w-12 h-12' : 'w-16 h-16 sm:w-14 sm:h-14'} bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center text-white text-2xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all`} onPointerDown={()=>setDirWithHaptic({x:0,y:1})}>▼</button>
          <div />
        </div>

        {!fullPage && (
          <p className="font-space text-gray-600 text-xs">
            {isMobile ? 'Swipe on board or tap D-pad above' : 'Keyboard: Arrow keys or WASD'}
          </p>
        )}

        {/* Leaderboard with 3 tabs — hidden on the dedicated game page to save space */}
        {leaderboard.length > 0 && !fullPage && (
          <div className="w-full max-w-sm mt-2">
            <h3 className="font-bungee text-center text-neon-yellow text-lg mb-3">🏆 TOP ESCAPEES</h3>

            {/* Tabs */}
            <div className="flex rounded-xl overflow-hidden border border-dark-border mb-3">
              {(['all','weekly','today'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setLbTab(tab)}
                  className={`flex-1 py-2 font-bungee text-xs uppercase transition-all
                    ${lbTab===tab
                      ? 'bg-neon-yellow text-dark-bg'
                      : 'bg-dark-surface text-gray-500 hover:text-gray-300'
                    }`}
                >
                  {tab==='all' ? 'All Time' : tab==='weekly' ? 'Weekly' : 'Today'}
                </button>
              ))}
            </div>

            <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
              {lbFiltered.length === 0 ? (
                <p className="font-space text-gray-600 text-xs text-center py-4">No scores yet</p>
              ) : lbFiltered.map((entry, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-2 border-b border-dark-border/50 last:border-0
                  ${i===0?'bg-neon-yellow/5':i===1?'bg-gray-400/5':i===2?'bg-amber-700/5':''}`}>
                  <span className="font-bungee text-lg w-8 text-center" style={{
                    color: i===0?'#fbbf24':i===1?'#9ca3af':i===2?'#b45309':'#4b5563'
                  }}>
                    {i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}
                  </span>
                  <span className="font-bungee text-white flex-1 truncate">{entry.name}</span>
                  <span className="font-space text-gray-500 text-xs">Lvl {entry.level}</span>
                  <span className="font-bungee text-neon-green text-sm">{entry.score}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
