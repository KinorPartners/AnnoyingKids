'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { CHARACTERS } from '@/lib/characters'
import Image from 'next/image'

// 3D character images — transparent PNGs
const CHAR_IMAGES: Record<string, string> = {
  guy: '/characters/guy.png',
  buddy: '/characters/buddy.png',
  pap: '/characters/pap.png',
  mal: '/characters/mal.png',
  mimi: '/characters/mimi.png',
  barry: '/characters/barry.png',
  rex: '/characters/rex.png',
}

// Short punchy descriptions — just a few words each
const SHORT_TAGLINES: Record<string, string> = {
  guy: 'Born to cause chaos.',
  buddy: 'Loyal. Chaotic. Zero regrets.',
  pap: 'Was a good kid. Karma noticed.',
  mal: 'Already knows where you are.',
  mimi: 'Retired PE teacher. Still fast.',
  barry: 'Slow feet. Fast brain.',
  rex: 'Uninvited. Unstoppable.',
}

const SHORT_FACTS: Record<string, string[]> = {
  guy: ['Convinced his class it was a snow day — in July', 'Buddy responds to 12 commands Guy taught him', 'School nickname: "The Question"'],
  buddy: ['Has 3 secret sock hiding spots', 'Barked at a ceramic frog for 11 minutes', 'Treats "sit" as a suggestion'],
  pap: ['The blue hat has never fallen off', 'Makes the same 3 dinners on rotation', 'Once fixed Wi-Fi in under 2 minutes'],
  mal: ['Has a mental map of every hiding spot', 'Can identify 12 types of silence', 'Has never needed to count to three'],
  mimi: ['Holds the neighbourhood 100m record (over-65s)', 'Calls Guy "trouble" — he answers to it', 'Secret biscuit recipe since 1987'],
  barry: ['The unlit cigar — carried since 1987', 'Beaten Guy at chess 23 times', 'His advice: "The best chaos looks like an accident"'],
  rex: ['Appears at Level 10', 'Does not come in peace', 'Nobody invited it'],
}

const REX = {
  slug: 'rex', name: 'Rex', role: 'Uninvited Guest', age: '???',
  color: '#ef4444',
}

interface CharSection {
  slug: string; name: string; role: string; age: string; color: string;
}

const ALL_CHARS: CharSection[] = [
  ...CHARACTERS.map(c => ({ slug: c.slug, name: c.name, role: c.role, age: c.age, color: c.color })),
  REX as CharSection,
]

// Floating chaos dots — red/pink particles that drift around
function ChaosDots({ color, count, seed }: { color: string; count: number; seed: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => {
        const size = 4 + (((seed + i * 7) % 5) * 2)
        const x = ((seed + i * 37) % 90) + 5
        const y = ((seed + i * 53) % 80) + 10
        const dur = 3 + ((seed + i * 11) % 4)
        const delay = ((seed + i * 23) % 3)
        return (
          <div key={i} style={{
            position: 'absolute',
            width: size, height: size, borderRadius: '50%',
            background: i % 3 === 0 ? '#ff2d78' : i % 3 === 1 ? color : '#ef4444',
            left: `${x}%`, top: `${y}%`,
            opacity: 0.4 + (i % 3) * 0.15,
            boxShadow: `0 0 ${size * 2}px ${i % 3 === 0 ? '#ff2d78' : color}`,
            animation: `chaosDot${i % 4} ${dur}s ease-in-out ${delay}s infinite alternate`,
            pointerEvents: 'none',
          }} />
        )
      })}
      <style>{`
        @keyframes chaosDot0{0%{transform:translate(0,0) scale(1)}100%{transform:translate(20px,-30px) scale(1.3)}}
        @keyframes chaosDot1{0%{transform:translate(0,0) scale(1)}100%{transform:translate(-25px,15px) scale(0.7)}}
        @keyframes chaosDot2{0%{transform:translate(0,0) scale(1)}100%{transform:translate(15px,25px) scale(1.5)}}
        @keyframes chaosDot3{0%{transform:translate(0,0) scale(1)}100%{transform:translate(-20px,-20px) scale(0.8)}}
      `}</style>
    </>
  )
}

export default function CharactersScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const totalSections = ALL_CHARS.length + 1

  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const scrollTop = window.scrollY - el.offsetTop
    const scrollHeight = el.scrollHeight - window.innerHeight
    const progress = Math.max(0, Math.min(1, scrollTop / scrollHeight))
    setScrollProgress(progress)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const floatPos = scrollProgress * totalSections
  const activeIndex = Math.min(Math.floor(floatPos), totalSections - 1)
  const blend = floatPos - activeIndex

  const currColor = activeIndex === 0 ? '#ff2d78' : ALL_CHARS[Math.min(activeIndex - 1, ALL_CHARS.length - 1)]?.color || '#fff'
  const nextColor = activeIndex < ALL_CHARS.length ? ALL_CHARS[Math.min(activeIndex, ALL_CHARS.length - 1)]?.color || '#fff' : '#ef4444'

  return (
    <div ref={containerRef} style={{ minHeight: `${totalSections * 100}vh` }}>
      {/* Scroll progress bar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 9999,
        background: 'rgba(255,255,255,0.05)',
      }}>
        <div style={{
          height: '100%', width: `${scrollProgress * 100}%`,
          background: 'linear-gradient(90deg, #ff2d78, #00f0ff, #a855f7, #f59e0b)',
        }} />
      </div>

      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${currColor}15 0%, transparent 70%)`,
        transition: 'background 0.3s ease',
      }} />
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        opacity: blend,
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${nextColor}18 0%, transparent 70%)`,
      }} />

      {/* Chaos dots layer */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <ChaosDots
          color={activeIndex === 0 ? '#ff2d78' : ALL_CHARS[Math.min(activeIndex - 1, ALL_CHARS.length - 1)]?.color || '#ff2d78'}
          count={12}
          seed={activeIndex * 17}
        />
      </div>

      {/* Fixed viewport — top offset accounts for the fixed navbar (h-16 / h-20 = 64px/80px) */}
      <div style={{
        position: 'fixed', top: 80, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', pointerEvents: 'none', zIndex: 1,
      }}>
        {activeIndex === 0 && <IntroSection progress={blend} />}
        {activeIndex > 0 && activeIndex <= ALL_CHARS.length && (
          <CharacterSection
            char={ALL_CHARS[activeIndex - 1]}
            progress={blend}
            index={activeIndex - 1}
            phase="current"
          />
        )}
        {activeIndex > 0 && activeIndex < ALL_CHARS.length && blend > 0.55 && (
          <CharacterSection
            char={ALL_CHARS[activeIndex]}
            progress={(blend - 0.55) / 0.45}
            index={activeIndex}
            phase="incoming"
          />
        )}
        {activeIndex === 0 && blend > 0.6 && (
          <CharacterSection
            char={ALL_CHARS[0]}
            progress={(blend - 0.6) / 0.4}
            index={0}
            phase="incoming"
          />
        )}
      </div>

      {/* Dot navigation */}
      <div style={{
        position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 10, zIndex: 100, pointerEvents: 'auto',
      }}>
        {['Intro', ...ALL_CHARS.map(c => c.name)].map((label, i) => (
          <button key={i} onClick={() => {
            const el = containerRef.current
            if (!el) return
            window.scrollTo({ top: el.offsetTop + ((el.scrollHeight - window.innerHeight) * (i / totalSections)), behavior: 'smooth' })
          }} title={label} style={{
            width: activeIndex === i ? 12 : 8, height: activeIndex === i ? 12 : 8,
            borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: activeIndex === i ? (i === 0 ? '#fff' : ALL_CHARS[i - 1]?.color || '#fff') : 'rgba(255,255,255,0.25)',
            boxShadow: activeIndex === i ? `0 0 12px ${i === 0 ? '#fff' : ALL_CHARS[i - 1]?.color || '#fff'}` : 'none',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* Bottom CTA */}
      {activeIndex >= ALL_CHARS.length && (
        <div style={{
          position: 'fixed', bottom: 40, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', zIndex: 100, pointerEvents: 'auto',
        }}>
          <Link href="/game" style={{
            padding: '16px 40px', background: '#ff2d78', color: '#fff',
            fontFamily: 'var(--font-bungee, Bungee, sans-serif)', fontSize: 20,
            textTransform: 'uppercase', borderRadius: 16, textDecoration: 'none',
            boxShadow: '0 0 30px rgba(255,45,120,0.5)',
          }}>
            🎮 Play Kid Chaos
          </Link>
        </div>
      )}
    </div>
  )
}

function IntroSection({ progress }: { progress: number }) {
  const fadeOut = progress > 0.5 ? (progress - 0.5) / 0.5 : 0
  const opacity = 1 - fadeOut
  const scale = 1 + progress * 0.3
  const y = progress * -100

  return (
    <div style={{
      textAlign: 'center', position: 'absolute',
      opacity, transform: `translateY(${y}px) scale(${scale})`,
    }}>
      <div style={{
        fontFamily: 'var(--font-space, "Space Grotesk", sans-serif)', fontSize: 13,
        color: '#22c55e', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 12,
      }}>Kid Chaos Universe</div>
      <h1 style={{
        fontFamily: 'var(--font-bungee, Bungee, sans-serif)', fontSize: 'clamp(56px, 10vw, 120px)',
        color: '#fff', textTransform: 'uppercase', lineHeight: 0.9, margin: '0 0 16px',
      }}>
        MEET THE<br /><span style={{ color: '#ff2d78' }}>GANG</span>
      </h1>
      <p style={{
        fontFamily: 'var(--font-space, "Space Grotesk", sans-serif)',
        color: 'rgba(255,255,255,0.45)', fontSize: 16, maxWidth: 400, margin: '0 auto 24px',
      }}>
        Scroll to meet the chaos crew.
      </p>
      <div style={{ fontSize: 32, animation: 'bounce 1.5s ease infinite', color: 'rgba(255,255,255,0.3)' }}>↓</div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(10px)}}`}</style>
    </div>
  )
}

function CharacterSection({ char, progress, index, phase }: {
  char: CharSection; progress: number; index: number;
  phase: 'current' | 'incoming';
}) {
  const isIncoming = phase === 'incoming'
  const tagline = SHORT_TAGLINES[char.slug] || char.role
  const facts = SHORT_FACTS[char.slug] || []

  let opacity: number, avatarRotateY: number, avatarRotateX: number, avatarScale: number, avatarY: number

  if (isIncoming) {
    const ease = 1 - Math.pow(1 - progress, 3)
    opacity = progress
    avatarRotateY = (1 - ease) * 90
    avatarRotateX = (1 - ease) * 25
    avatarScale = 0.2 + ease * 0.8 // starts very small — big blow-up
    avatarY = (1 - ease) * 150
  } else {
    const enterDone = Math.min(progress / 0.15, 1)
    const exitStart = Math.max(0, (progress - 0.55) / 0.45)
    const exitEase = exitStart * exitStart * exitStart // cubic ease-in — accelerates fast

    opacity = enterDone * (1 - exitEase * 0.9)
    avatarRotateY = exitEase * -50
    avatarRotateX = exitEase * 20
    avatarScale = 1 + exitEase * 0.8 // BLOW UP on exit — gets bigger
    avatarY = exitEase * -120
  }

  const factReveal = isIncoming ? progress : Math.min(progress / 0.45, 1)
  const visibleFacts = Math.floor(factReveal * facts.length)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', width: '100%', maxWidth: 640, padding: '0 24px',
      opacity: Math.max(0, opacity), position: 'absolute',
    }}>
      {/* Name — big and bold */}
      <h2 style={{
        fontFamily: 'var(--font-bungee, Bungee, sans-serif)',
        fontSize: 'clamp(60px, 11vw, 110px)', color: '#fff',
        textTransform: 'uppercase', lineHeight: 0.9, margin: '0 0 4px',
        textShadow: `0 0 40px ${char.color}44`,
      }}>
        {char.name}
      </h2>

      {/* Short tagline */}
      <p style={{
        fontFamily: 'var(--font-space, "Space Grotesk", sans-serif)',
        fontSize: 18, color: char.color, marginBottom: 28,
        letterSpacing: 1, fontWeight: 600,
      }}>
        {tagline}
      </p>

      {/* 3D Character Image with dramatic blow-up */}
      <div style={{ perspective: 800, marginBottom: 32 }}>
        <div style={{
          transform: `rotateY(${avatarRotateY}deg) rotateX(${avatarRotateX}deg) scale(${avatarScale}) translateY(${avatarY}px)`,
          transformStyle: 'preserve-3d', willChange: 'transform',
        }}>
          <div style={{ width: 220, height: 280, margin: '0 auto', position: 'relative' }}>
            {CHAR_IMAGES[char.slug] ? (
              <img
                src={CHAR_IMAGES[char.slug]}
                alt={char.name}
                style={{
                  width: '100%', height: '100%', objectFit: 'contain',
                  filter: `drop-shadow(0 8px 24px ${char.color}66)`,
                }}
              />
            ) : (
              <span style={{ fontSize: 90 }}>🦕</span>
            )}
          </div>
          {/* Glow shadow beneath */}
          <div style={{
            width: 160, height: 24, margin: '8px auto 0', borderRadius: '50%',
            background: `radial-gradient(ellipse, ${char.color}55 0%, transparent 70%)`,
            filter: 'blur(8px)', opacity: Math.min(1, avatarScale),
          }} />
        </div>
      </div>

      {/* Short facts — punchy one-liners, fixed height to prevent overlap */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 480, minHeight: facts.length * 48 }}>
        {facts.map((fact, i) => (
          <div key={i} style={{
            fontFamily: 'var(--font-space, "Space Grotesk", sans-serif)',
            fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5,
            padding: '8px 16px', borderRadius: 10, textAlign: 'left',
            background: i < visibleFacts ? `${char.color}10` : 'transparent',
            borderLeft: i < visibleFacts ? `3px solid ${char.color}` : '3px solid transparent',
            opacity: i < visibleFacts ? 1 : 0,
            transform: i < visibleFacts ? 'none' : 'translateY(12px)',
            transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s`,
          }}>
            {fact}
          </div>
        ))}
      </div>

      {/* Read more */}
      {char.slug !== 'rex' && !isIncoming && (
        <div style={{ marginTop: 24, pointerEvents: 'auto' }}>
          <Link href={`/characters/${char.slug}`} style={{
            fontFamily: 'var(--font-bungee, Bungee, sans-serif)',
            fontSize: 14, textTransform: 'uppercase', letterSpacing: 1,
            color: char.color, textDecoration: 'none',
            opacity: progress > 0.2 && progress < 0.65 ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}>
            Full story →
          </Link>
        </div>
      )}
    </div>
  )
}
