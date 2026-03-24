'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

type Pos = { x: number; y: number };
type Dir = { x: number; y: number };
type GameState = 'idle' | 'playing' | 'dead' | 'levelup' | 'won' | 'gameover';
type CharType = 'dad' | 'mom' | 'grandma' | 'grandpa';

interface Chaser { pos: Pos; type: CharType; }

const COLS = 15;
const ROWS = 15;
const BASE_CELL = 36;
const BIG_CELL  = 52;
const TUNNEL_ROW = 7;

// 1=wall, 0=candy, 2=empty, 3=bonus, 4=tunnel (wraps to other side)
const BASE_MAZE: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,1,1,0,1,0,1,3,1,0,1,0,1,1,1],
  [4,2,2,2,1,1,1,2,1,1,1,2,2,2,4],  // ← tunnel row: open corridors left(x1-3)/right(x11-13) + center(x7)
  [1,1,1,0,1,0,1,0,1,0,1,0,1,1,1],
  [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
  [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
  [1,0,1,0,0,0,0,3,0,0,0,0,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const BONUS_ICONS = ['🍕','🍭','🎮','🍦','🧃','🍟','🎯','🕹️'];
const TOTAL_ITEMS = BASE_MAZE.flat().filter(c => c === 0 || c === 3).length;

function cloneMaze(m: number[][]): number[][] { return m.map(r => [...r]); }

// Wrap x so it always stays within [0, COLS-1]
function wrapX(x: number): number { return ((x % COLS) + COLS) % COLS; }

function isWall(m: number[][], x: number, y: number): boolean {
  if (y < 0 || y >= ROWS) return true;
  return m[y][wrapX(x)] === 1;
}

// Resolve a raw position to its canonical (possibly wrapped) position
function resolvePos(x: number, y: number): Pos { return { x: wrapX(x), y }; }

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
  if (level >= 5)  c.push({ pos:{x:1,y:13},  type:'grandma' });
  if (level >= 10) c.push({ pos:{x:13,y:13}, type:'grandpa' });
  return c;
}

// How often (in ticks) each chaser moves — decreases as level rises
function moveEvery(type: CharType, level: number): number {
  const speed = Math.max(1, 3 - Math.floor(level / 4)); // 3→2→1 at levels 1,4,8
  switch (type) {
    case 'dad':     return speed;
    case 'mom':     return speed;
    case 'grandma': return Math.max(1, speed + 1);
    case 'grandpa': return Math.max(1, speed + 2);
  }
}
// Chance grandma/grandpa wander randomly instead of chasing
function skipChance(type: CharType, level: number): number {
  switch (type) {
    case 'dad':     return 0;
    case 'mom':     return Math.max(0.05, 0.22 - level*0.015);
    case 'grandma': return Math.max(0.05, 0.40 - level*0.025);
    case 'grandpa': return Math.max(0.10, 0.50 - (level-10)*0.03);
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
      <span style={{fontSize:size*0.72,lineHeight:1,zIndex:2,position:'relative'}}>😢</span>
      <div className="ck-tl"  style={{position:'absolute',top:'38%',left:'22%',width:5,height:7,background:'#3b82f6',borderRadius:'50% 50% 50% 50%/40% 40% 60% 60%',zIndex:3}}/>
      <div className="ck-tl2" style={{position:'absolute',top:'38%',left:'17%',width:4,height:6,background:'#60a5fa',borderRadius:'50% 50% 50% 50%/40% 40% 60% 60%',zIndex:3}}/>
      <div className="ck-tr"  style={{position:'absolute',top:'38%',right:'22%',width:5,height:7,background:'#3b82f6',borderRadius:'50% 50% 50% 50%/40% 40% 60% 60%',zIndex:3}}/>
      <div className="ck-tr2" style={{position:'absolute',top:'38%',right:'17%',width:4,height:6,background:'#60a5fa',borderRadius:'50% 50% 50% 50%/40% 40% 60% 60%',zIndex:3}}/>
    </div>
  );
  return (
    <div style={{position:'relative',width:size,height:size,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <span style={{fontSize:size*0.72,lineHeight:1,filter:'saturate(0.25) brightness(0.85)'}}>🧒</span>
      <div style={{position:'absolute',bottom:'14%',left:'50%',transform:'translateX(-50%)',width:size*0.18,height:size*0.16,background:'#ef4444',borderRadius:'0 0 50% 50%',boxShadow:'0 1px 4px rgba(239,68,68,0.6)',zIndex:3}}/>
    </div>
  );
}

function Dad({ size }: { size: number }) {
  return (
    <div style={{position:'relative',width:size,height:size,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <span style={{fontSize:size*0.72,lineHeight:1,filter:'saturate(0.25) brightness(0.85)'}}>👨</span>
      <div style={{position:'absolute',top:'2%',left:'50%',transform:'translateX(-50%)',width:size*0.7,height:size*0.09,background:'#00f0ff',borderRadius:3,boxShadow:'0 0 6px #00f0ff',zIndex:3}}/>
      <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%) translateY(-45%)',width:size*0.42,height:size*0.18,background:'#00f0ff',borderRadius:'4px 4px 0 0',boxShadow:'0 0 6px #00f0ff',zIndex:3}}/>
    </div>
  );
}

function Mom({ size }: { size: number }) {
  const w=size*0.22, h=size*0.18;
  return (
    <div style={{position:'relative',width:size,height:size,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <span style={{fontSize:size*0.72,lineHeight:1,filter:'saturate(0.25) brightness(0.85)'}}>👩</span>
      <div style={{position:'absolute',top:0,left:'50%',transform:'translateX(-50%) translateY(-30%)',zIndex:3,display:'flex',alignItems:'center',gap:1}}>
        <div style={{width:w,height:h,background:'#ff2d78',borderRadius:'50% 0 50% 50%',transform:'rotate(20deg)',boxShadow:'0 0 5px #ff2d78'}}/>
        <div style={{width:size*0.1,height:size*0.1,background:'#ff69b4',borderRadius:'50%',flexShrink:0}}/>
        <div style={{width:w,height:h,background:'#ff2d78',borderRadius:'0 50% 50% 50%',transform:'rotate(-20deg)',boxShadow:'0 0 5px #ff2d78'}}/>
      </div>
    </div>
  );
}

function Grandma({ size }: { size: number }) {
  return (
    <div style={{position:'relative',width:size,height:size,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <span style={{fontSize:size*0.72,lineHeight:1}}>👵</span>
      {/* White hair puff */}
      <div style={{position:'absolute',top:'3%',left:'50%',transform:'translateX(-50%)',width:size*0.6,height:size*0.22,background:'radial-gradient(ellipse,#ffffff 0%,#e0e0e0 60%,transparent 100%)',borderRadius:'50%',zIndex:3,opacity:0.95}}/>
      {/* Cane vertical */}
      <div style={{position:'absolute',right:'10%',top:'40%',width:3,height:size*0.42,background:'#6B3A2A',borderRadius:2,zIndex:3}}/>
      {/* Cane hook */}
      <div style={{position:'absolute',right:'10%',top:'38%',width:size*0.16,height:3,background:'#6B3A2A',borderRadius:'3px 3px 0 0',zIndex:3,transformOrigin:'right center',transform:'translateX(-85%)'}}/>
    </div>
  );
}

function Grandpa({ size }: { size: number }) {
  return (
    <div style={{position:'relative',width:size,height:size,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <span style={{fontSize:size*0.72,lineHeight:1}}>👴</span>
      {/* Cigar body */}
      <div style={{position:'absolute',bottom:'28%',right:'8%',width:size*0.38,height:size*0.1,background:'linear-gradient(90deg,#7B3F00,#A0522D)',borderRadius:'2px 4px 4px 2px',transform:'rotate(-18deg)',transformOrigin:'right center',zIndex:3}}/>
      {/* Ash tip */}
      <div style={{position:'absolute',bottom:'32%',right:'6%',width:size*0.09,height:size*0.08,background:'#ccc',borderRadius:'0 3px 3px 0',transform:'rotate(-18deg)',transformOrigin:'right center',zIndex:3}}/>
      {/* Smoke puff */}
      <style>{`
        @keyframes smoke{0%{transform:translateY(0);opacity:0.7}100%{transform:translateY(-8px);opacity:0}}
        .gp-smoke{animation:smoke 1.2s ease-out infinite}
        .gp-smoke2{animation:smoke 1.2s ease-out infinite;animation-delay:0.6s}
      `}</style>
      <div className="gp-smoke"  style={{position:'absolute',bottom:'55%',right:'4%',width:5,height:5,background:'rgba(210,210,210,0.7)',borderRadius:'50%',zIndex:3}}/>
      <div className="gp-smoke2" style={{position:'absolute',bottom:'55%',right:'8%',width:4,height:4,background:'rgba(210,210,210,0.5)',borderRadius:'50%',zIndex:3}}/>
    </div>
  );
}

function ChaserChar({ chaser, size }: { chaser: Chaser; size: number }) {
  switch (chaser.type) {
    case 'dad':     return <Dad size={size} />;
    case 'mom':     return <Mom size={size} />;
    case 'grandma': return <Grandma size={size} />;
    case 'grandpa': return <Grandpa size={size} />;
  }
}

// ─── Leaderboard ─────────────────────────────────────────────────────

interface LeaderEntry { name: string; score: number; level: number; }
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

export default function ChaosGame() {
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

  const [bigMode, setBigMode] = useState(false);
  const CS = bigMode ? BIG_CELL : BASE_CELL;
  const kidTeleportRef = useRef(false);

  const bonusIconsRef = useRef<Record<string,string>>({});
  useEffect(() => {
    let idx = 0;
    BASE_MAZE.forEach((row,y) => row.forEach((cell,x) => {
      if (cell===3) { bonusIconsRef.current[`${x},${y}`] = BONUS_ICONS[idx++ % BONUS_ICONS.length]; }
    }));
  }, []);

  const [, forceRender] = useState(0);
  const render = useCallback(() => forceRender(n => n+1), []);

  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
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
  };

  const startGame = useCallback(() => {
    mazeRef.current      = cloneMaze(BASE_MAZE);
    levelRef.current     = 1;
    scoreRef.current     = 0;
    livesRef.current     = 3;
    resetPositions(1);
    gameStateRef.current = 'playing';
    render();
  }, [render]);

  // Auto-start when triggered from GamePreview hero click
  useEffect(() => {
    const handler = () => {
      if (gameStateRef.current === 'idle') startGame();
    };
    window.addEventListener('chaos-game-autostart', handler);
    return () => window.removeEventListener('chaos-game-autostart', handler);
  }, [startGame]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = DIR_KEYS[e.key]; if (!d) return;
      e.preventDefault();
      nextDirRef.current = d;
      // Immediately commit direction if the turn is valid right now
      if (gameStateRef.current === 'playing') {
        const k = kidRef.current;
        if (!isWall(mazeRef.current, k.x + d.x, k.y + d.y)) {
          kidDirRef.current = d;
        }
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

      // Move kid (with tunnel wrap)
      const tryMove = (d: Dir): Pos|null => {
        const nx=kid.x+d.x, ny=kid.y+d.y;
        return isWall(maze,nx,ny) ? null : resolvePos(nx,ny);
      };
      let newKid = kid;
      const nextAttempt = tryMove(nextDirRef.current);
      if (nextAttempt && (nextDirRef.current.x!==0||nextDirRef.current.y!==0)) {
        newKid = nextAttempt; kidDirRef.current = nextDirRef.current;
      } else {
        const curr = tryMove(kidDirRef.current); if (curr) newKid = curr;
      }
      // Detect tunnel teleport (large horizontal jump)
      kidTeleportRef.current = Math.abs(newKid.x - kid.x) > 1;
      kidRef.current = newKid;

      // Collect
      const cell = maze[newKid.y][newKid.x];
      if (cell===0) { maze[newKid.y][newKid.x]=2; scoreRef.current+=10; }
      else if (cell===3) { maze[newKid.y][newKid.x]=2; scoreRef.current+=50; }

      // Level complete?
      if (maze.flat().filter(c=>c===0||c===3).length===0) {
        gameStateRef.current = 'levelup';
        // Check record on level completion too (score keeps growing)
        const lb = loadLeaderboard();
        if (isNewRecord(scoreRef.current, lb)) {
          setPendingEntry({ score: scoreRef.current, level: levelRef.current });
          setAwaitingName(true);
          setNameInput('');
        }
        if (lvlTimerRef.current) clearTimeout(lvlTimerRef.current);
        lvlTimerRef.current = setTimeout(() => {
          levelRef.current++;
          mazeRef.current = cloneMaze(BASE_MAZE);
          resetPositions(levelRef.current);
          gameStateRef.current = 'playing';
          render();
        }, 2000);
        render(); return;
      }

      // Move chasers
      const level = levelRef.current;
      chasersRef.current = chasersRef.current.map(ch => {
        const every = moveEvery(ch.type, level);
        if (tickRef.current % every !== 0) return ch;
        if (Math.random() < skipChance(ch.type, level)) return ch;
        const step = bfsStep(maze, ch.pos, kidRef.current);
        const nx=ch.pos.x+step.x, ny=ch.pos.y+step.y;
        return isWall(maze,nx,ny) ? ch : { ...ch, pos: resolvePos(nx,ny) };
      });

      // Collision
      const caught = chasersRef.current.some(c=>c.pos.x===kidRef.current.x&&c.pos.y===kidRef.current.y);
      if (caught) {
        livesRef.current--;
        if (livesRef.current<=0) {
          gameStateRef.current='gameover';
          const lb = loadLeaderboard();
          if (isNewRecord(scoreRef.current, lb)) {
            setPendingEntry({ score: scoreRef.current, level: levelRef.current });
            setAwaitingName(true);
            setNameInput('');
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

  const setDir = (d: Dir) => {
    nextDirRef.current = d;
    if (gs==='idle') startGame();
  };

  const submitName = () => {
    if (!pendingEntry || !nameInput.trim()) return;
    const entry: LeaderEntry = { name: nameInput.trim().slice(0,16), score: pendingEntry.score, level: pendingEntry.level };
    const updated = [...leaderboard, entry].sort((a,b) => b.score - a.score).slice(0, 10);
    saveLeaderboard(updated);
    setLeaderboard(updated);
    setAwaitingName(false);
    setPendingEntry(null);
    setNameInput('');
  };

  const newChasersAtLevel = (lvl: number) =>
    lvl===5 ? '👵 Grandma joins the chase!' :
    lvl===10 ? '👴 Grandpa joins the chaos!' : null;

  // Swipe handling
  const touchStartRef = useRef<{x:number;y:number}|null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return; // tap, ignore
    let d: Dir;
    if (Math.abs(dx) > Math.abs(dy)) {
      d = dx > 0 ? {x:1,y:0} : {x:-1,y:0};
    } else {
      d = dy > 0 ? {x:0,y:1} : {x:0,y:-1};
    }
    nextDirRef.current = d;
    if (gameStateRef.current === 'playing' && !isWall(mazeRef.current, kidRef.current.x+d.x, kidRef.current.y+d.y)) {
      kidDirRef.current = d;
    }
    if (gameStateRef.current === 'idle') startGame();
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
            Escape your family — collect candy &amp; bonus items!
          </p>
        </div>

        {/* HUD */}
        <div className="flex items-center gap-4 font-bungee flex-wrap justify-center">
          <span className="text-neon-yellow text-sm border border-neon-yellow/30 px-3 py-1 rounded-lg">
            LVL {level}
          </span>
          <span className="text-neon-green">🍭 {score}</span>
          <span>
            {Array.from({length:Math.max(0,lives)}).map((_,i)=><span key={i}>🧒</span>)}
          </span>
          <button
            onClick={() => setBigMode(b => !b)}
            title={bigMode ? 'Shrink game' : 'Expand game'}
            className="ml-2 px-3 py-1 bg-dark-surface border border-dark-border rounded-lg text-gray-400 hover:text-neon-blue hover:border-neon-blue/50 text-sm transition-all"
          >
            {bigMode ? '⊟ Small' : '⊞ Big'}
          </button>
        </div>

        {/* Board */}
        <div
          className="relative rounded-2xl overflow-hidden border-2 border-neon-pink/30 shadow-[0_0_40px_rgba(255,45,120,0.2)]"
          style={{ width:COLS*CS, height:ROWS*CS }}
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
              // Tunnel entrance: glow from the edge inward
              boxShadow: cell===4 ? (x===0 ? 'inset 6px 0 10px -4px #00f0ff55' : 'inset -6px 0 10px -4px #00f0ff55') : undefined,
            }}>
              {cell===0 && <div style={{width:7,height:7,borderRadius:'50%',background:'#ff2d78',boxShadow:'0 0 6px #ff2d78'}}/>}
              {cell===3 && <span style={{fontSize:CS*0.55,lineHeight:1}}>{bonusIconsRef.current[`${x},${y}`]??'🍭'}</span>}
            </div>
          )))}

          {/* Kid */}
          <div className="absolute" style={{
            left:kid.x*CS, top:kid.y*CS, width:CS, height:CS, zIndex:20,
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
                opacity: inTunnel ? 0 : 1,
                filter: CHASER_GLOW[ch.type],
              }}>
                <ChaserChar chaser={ch} size={CS} />
              </div>
            );
          })}

          {/* Idle overlay */}
          {gs==='idle' && (
            <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-4 z-30">
              <div className="flex items-center gap-1">
                <Grandpa size={46}/><Grandma size={46}/><Mom size={46}/><Dad size={46}/>
                <span className="text-gray-500 mx-2 font-bungee text-lg">vs</span>
                <Kid size={46} dead={false}/>
              </div>
              <h3 className="font-bungee text-white text-2xl">KID <span className="text-neon-pink">CHAOS</span></h3>
              <p className="font-space text-gray-300 text-xs text-center px-8 leading-relaxed">
                🍭 Candy = 10pts · Bonus items = 50pts<br/>
                👵 Grandma joins at Level 5 · 👴 Grandpa at Level 10
              </p>
              <button onClick={startGame}
                className="px-8 py-3 bg-neon-pink font-bungee text-white text-lg uppercase rounded-xl shadow-[0_0_20px_rgba(255,45,120,0.6)] hover:scale-105 transition-all">
                Play!
              </button>
              <p className="font-space text-gray-500 text-xs">Arrow keys · WASD · buttons below</p>
            </div>
          )}

          {/* Level up overlay */}
          {gs==='levelup' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 z-30">
              <div className="text-5xl animate-bounce">⭐</div>
              <h3 className="font-bungee text-neon-yellow text-3xl">LEVEL {level} CLEAR!</h3>
              <p className="font-space text-white">Score: {score}</p>
              {newChasersAtLevel(level+1) && (
                <p className="font-space text-neon-pink text-sm animate-pulse mt-1">
                  ⚠️ {newChasersAtLevel(level+1)}
                </p>
              )}
              <p className="font-space text-gray-400 text-sm">Get ready for Level {level+1}…</p>
            </div>
          )}

          {/* Won */}
          {gs==='won' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-4 z-30">
              <div className="text-5xl animate-bounce">🎉</div>
              <h3 className="font-bungee text-neon-green text-3xl">YOU ESCAPED!</h3>
              <p className="font-space text-white text-lg">Score: {score}</p>
              <button onClick={startGame} className="px-8 py-3 bg-neon-green font-bungee text-dark-bg text-lg uppercase rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.6)] hover:scale-105 transition-all">Play Again!</button>
            </div>
          )}

          {/* Game over */}
          {gs==='gameover' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 z-30 px-4">
              <div className="text-5xl">😅</div>
              <h3 className="font-bungee text-neon-pink text-3xl">GROUNDED!</h3>
              <p className="font-space text-white text-lg">Score: {score} · Level {level}</p>
              {awaitingName ? (
                <>
                  <p className="font-bungee text-neon-yellow text-sm animate-pulse">🏆 NEW RECORD!</p>
                  <p className="font-space text-gray-300 text-xs">Enter your name:</p>
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => e.key==='Enter' && submitName()}
                    maxLength={16}
                    placeholder="Your name…"
                    className="w-40 px-3 py-2 bg-dark-card border-2 border-neon-yellow/60 rounded-lg
                      font-bungee text-white text-center text-sm focus:outline-none focus:border-neon-yellow"
                  />
                  <button onClick={submitName}
                    className="px-6 py-2 bg-neon-yellow font-bungee text-dark-bg text-sm uppercase rounded-lg hover:scale-105 transition-all">
                    Save Score!
                  </button>
                </>
              ) : (
                <button onClick={startGame} className="px-8 py-3 bg-neon-pink font-bungee text-white text-lg uppercase rounded-xl shadow-[0_0_20px_rgba(255,45,120,0.6)] hover:scale-105 transition-all">Try Again!</button>
              )}
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex flex-col items-center gap-2 select-none">
          <button className="w-14 h-14 bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center text-white text-xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all" onPointerDown={()=>setDir({x:0,y:-1})}>▲</button>
          <div className="flex gap-2">
            <button className="w-14 h-14 bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center text-white text-xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all" onPointerDown={()=>setDir({x:-1,y:0})}>◄</button>
            <button className="w-14 h-14 bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center text-white text-xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all" onPointerDown={()=>setDir({x:0,y:1})}>▼</button>
            <button className="w-14 h-14 bg-dark-surface border-2 border-dark-border rounded-xl flex items-center justify-center text-white text-xl hover:border-neon-pink/60 active:bg-neon-pink/20 transition-all" onPointerDown={()=>setDir({x:1,y:0})}>►</button>
          </div>
        </div>

        <p className="font-space text-gray-600 text-xs">Keyboard: Arrow keys or WASD</p>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="w-full max-w-sm mt-2">
            <h3 className="font-bungee text-center text-neon-yellow text-lg mb-3">
              🏆 TOP ESCAPEES
            </h3>
            <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
              {leaderboard.map((entry, i) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-2 border-b border-dark-border/50 last:border-0
                  ${i===0 ? 'bg-neon-yellow/5' : i===1 ? 'bg-gray-400/5' : i===2 ? 'bg-amber-700/5' : ''}`}>
                  <span className="font-bungee text-lg w-8 text-center" style={{
                    color: i===0 ? '#fbbf24' : i===1 ? '#9ca3af' : i===2 ? '#b45309' : '#4b5563'
                  }}>
                    {i===0 ? '🥇' : i===1 ? '🥈' : i===2 ? '🥉' : `#${i+1}`}
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
