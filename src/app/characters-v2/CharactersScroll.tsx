'use client'
import { useRef, useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { CHARACTERS } from '@/lib/characters'
import { Kid, Dad, Mom, Grandma, Grandpa, Dinosaur } from '@/components/Characters'

const CHAR_COMPONENTS: Record<string, React.ReactNode> = {
  guy:   <Kid size={120} />,
  buddy: <span style={{ fontSize: 100, lineHeight: 1 }}>🐕</span>,
  pap:   <Dad size={120} />,
  mal:   <Mom size={120} />,
  mimi:  <Grandma size={120} />,
  barry: <Grandpa size={120} />,
}

// Rex bonus character
const REX = {
  slug: 'rex', name: 'Rex', role: 'Uninvited Guest', age: 'Old. Very old.',
  color: '#ef4444', tagline: 'Nobody knows where it came from. It shows up at level 10.',
  facts: ['Technically not a family member.', 'Does not come in peace.', 'Story unlocks at Level 10.'],
}

interface CharSection {
  slug: string; name: string; role: string; age: string; color: string;
  tagline: string; facts: string[]; origin?: string;
}

const ALL_CHARS: CharSection[] = [
  ...CHARACTERS.map(c => ({ slug: c.slug, name: c.name, role: c.role, age: c.age, color: c.color, tagline: c.tagline, facts: c.facts, origin: c.origin })),
  REX as CharSection,
]

export default function CharactersScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const totalSections = ALL_CHARS.length + 1 // +1 for intro

  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const scrollTop = window.scrollY - el.offsetTop
    const scrollHeight = el.scrollHeight - window.innerHeight
    const progress = Math.max(0, Math.min(1, scrollTop / scrollHeight))
    setScrollProgress(progress)
    const idx = Math.min(Math.floor(progress * totalSections), totalSections - 1)
    setActiveIndex(idx)
  }, [totalSections])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Per-section progress (0-1 within each section)
  const sectionProgress = (scrollProgress * totalSections) - activeIndex

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
          transition: 'width 0.1s linear',
        }} />
      </div>

      {/* Fixed viewport */}
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', pointerEvents: 'none',
      }}>
        {/* Intro section */}
        {activeIndex === 0 && (
          <IntroSection progress={sectionProgress} />
        )}

        {/* Character sections */}
        {activeIndex > 0 && activeIndex <= ALL_CHARS.length && (
          <CharacterSection
            char={ALL_CHARS[activeIndex - 1]}
            component={CHAR_COMPONENTS[ALL_CHARS[activeIndex - 1].slug]}
            progress={sectionProgress}
            index={activeIndex - 1}
          />
        )}
      </div>

      {/* Dot navigation */}
      <div style={{
        position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 10, zIndex: 100,
        pointerEvents: 'auto',
      }}>
        {['Intro', ...ALL_CHARS.map(c => c.name)].map((label, i) => (
          <button
            key={i}
            onClick={() => {
              const el = containerRef.current
              if (!el) return
              const targetScroll = el.offsetTop + ((el.scrollHeight - window.innerHeight) * (i / totalSections))
              window.scrollTo({ top: targetScroll, behavior: 'smooth' })
            }}
            title={label}
            style={{
              width: activeIndex === i ? 12 : 8,
              height: activeIndex === i ? 12 : 8,
              borderRadius: '50%',
              border: 'none',
              cursor: 'pointer',
              background: activeIndex === i
                ? (i === 0 ? '#fff' : ALL_CHARS[i - 1]?.color || '#fff')
                : 'rgba(255,255,255,0.25)',
              boxShadow: activeIndex === i ? `0 0 10px ${i === 0 ? '#fff' : ALL_CHARS[i - 1]?.color || '#fff'}` : 'none',
              transition: 'all 0.3s ease',
              pointerEvents: 'auto',
            }}
          />
        ))}
      </div>

      {/* Bottom CTA - visible at end */}
      {activeIndex >= ALL_CHARS.length && (
        <div style={{
          position: 'fixed', bottom: 40, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', zIndex: 100, pointerEvents: 'auto',
        }}>
          <Link
            href="/game"
            style={{
              padding: '16px 40px', background: '#ff2d78', color: '#fff',
              fontFamily: 'var(--font-bungee, Bungee, sans-serif)', fontSize: 20,
              textTransform: 'uppercase', borderRadius: 16, textDecoration: 'none',
              boxShadow: '0 0 30px rgba(255,45,120,0.5)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            🎮 Play Kid Chaos
          </Link>
        </div>
      )}
    </div>
  )
}

function IntroSection({ progress }: { progress: number }) {
  const opacity = progress < 0.7 ? 1 : 1 - ((progress - 0.7) / 0.3)
  const scale = 1 + progress * 0.15
  const y = progress * -60

  return (
    <div style={{
      textAlign: 'center', opacity, transform: `translateY(${y}px) scale(${scale})`,
      transition: 'opacity 0.05s linear',
    }}>
      <div style={{
        fontFamily: 'var(--font-space, "Space Grotesk", sans-serif)', fontSize: 12,
        color: '#22c55e', textTransform: 'uppercase', letterSpacing: 4, marginBottom: 12,
      }}>
        Kid Chaos Universe
      </div>
      <h1 style={{
        fontFamily: 'var(--font-bungee, Bungee, sans-serif)', fontSize: 'clamp(48px, 8vw, 96px)',
        color: '#fff', textTransform: 'uppercase', lineHeight: 0.95, margin: '0 0 16px',
      }}>
        MEET THE<br /><span style={{ color: '#ff2d78' }}>GANG</span>
      </h1>
      <p style={{
        fontFamily: 'var(--font-space, "Space Grotesk", sans-serif)',
        color: 'rgba(255,255,255,0.5)', fontSize: 18, maxWidth: 500, margin: '0 auto 24px',
        lineHeight: 1.6,
      }}>
        Scroll down to meet each character.<br />
        Every one of them has a story. Most of them are trouble.
      </p>
      <div style={{
        fontSize: 28, animation: 'bounce 1.5s ease infinite',
        color: 'rgba(255,255,255,0.3)',
      }}>
        ↓
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}`}</style>
    </div>
  )
}

function CharacterSection({ char, component, progress, index }: {
  char: CharSection; component?: React.ReactNode; progress: number; index: number
}) {
  // 3D transforms driven by scroll progress within this section
  const enterPhase = Math.min(progress / 0.3, 1) // 0-1 during first 30%
  const holdPhase = progress >= 0.3 && progress <= 0.7 ? 1 : 0
  const exitPhase = progress > 0.7 ? (progress - 0.7) / 0.3 : 0 // 0-1 during last 30%

  const opacity = enterPhase * (1 - exitPhase)

  // Character avatar: rotates in 3D, scales up, then slides away
  const avatarRotateY = (1 - enterPhase) * 90 - exitPhase * 45
  const avatarRotateX = (1 - enterPhase) * -20
  const avatarScale = 0.3 + enterPhase * 0.7
  const avatarX = exitPhase * -200

  // Info panel: slides in from right, parallax offset
  const infoX = (1 - enterPhase) * 100 - exitPhase * 150
  const infoOpacity = enterPhase * (1 - exitPhase * 1.5)

  // Facts: stagger in from bottom
  const visibleFacts = Math.floor(enterPhase * (char.facts?.length || 0))

  // Alternating layout: even chars have avatar on left, odd on right
  const isFlipped = index % 2 === 1

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 60, width: '100%', maxWidth: 1100, padding: '0 40px',
      opacity, flexDirection: isFlipped ? 'row-reverse' : 'row',
    }}>
      {/* Avatar with 3D transform */}
      <div style={{
        flex: '0 0 auto',
        perspective: 800,
      }}>
        <div style={{
          transform: `rotateY(${avatarRotateY}deg) rotateX(${avatarRotateX}deg) scale(${avatarScale}) translateX(${avatarX}px)`,
          transition: 'transform 0.05s linear',
          transformStyle: 'preserve-3d',
        }}>
          <div style={{
            width: 200, height: 200, borderRadius: 32,
            background: char.color + '15',
            border: `2px solid ${char.color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 20px 60px ${char.color}33, inset 0 0 40px ${char.color}11`,
          }}>
            {component || <span style={{ fontSize: 80 }}>🦕</span>}
          </div>
          {/* Shadow beneath */}
          <div style={{
            width: 140, height: 20, margin: '16px auto 0',
            borderRadius: '50%',
            background: `radial-gradient(ellipse, ${char.color}33 0%, transparent 70%)`,
            filter: 'blur(4px)',
          }} />
        </div>
      </div>

      {/* Info panel */}
      <div style={{
        flex: '1 1 auto', maxWidth: 500,
        transform: `translateX(${infoX}px)`,
        opacity: Math.max(0, infoOpacity),
        transition: 'transform 0.05s linear, opacity 0.05s linear',
      }}>
        <div style={{
          fontFamily: 'var(--font-space, "Space Grotesk", sans-serif)',
          fontSize: 11, textTransform: 'uppercase', letterSpacing: 3,
          color: char.color, marginBottom: 6,
        }}>
          {char.role} · Age {char.age}
        </div>
        <h2 style={{
          fontFamily: 'var(--font-bungee, Bungee, sans-serif)',
          fontSize: 'clamp(40px, 6vw, 72px)', color: '#fff',
          textTransform: 'uppercase', lineHeight: 0.95, margin: '0 0 12px',
        }}>
          {char.name}
        </h2>
        <p style={{
          fontFamily: 'var(--font-space, "Space Grotesk", sans-serif)',
          fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7,
          marginBottom: 20, maxWidth: 440,
        }}>
          {char.tagline}
        </p>

        {/* Origin snippet */}
        {char.origin && (
          <p style={{
            fontFamily: 'var(--font-space, "Space Grotesk", sans-serif)',
            fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7,
            marginBottom: 20, maxWidth: 440,
            opacity: holdPhase + enterPhase > 1 ? 1 : Math.max(0, enterPhase - 0.5) * 2,
          }}>
            {char.origin.split('\n')[0].slice(0, 200)}...
          </p>
        )}

        {/* Facts that appear one by one */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(char.facts || []).slice(0, 3).map((fact, i) => (
            <div
              key={i}
              style={{
                fontFamily: 'var(--font-space, "Space Grotesk", sans-serif)',
                fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5,
                padding: '8px 14px', borderRadius: 10,
                background: i < visibleFacts ? `${char.color}12` : 'transparent',
                borderLeft: i < visibleFacts ? `3px solid ${char.color}` : '3px solid transparent',
                opacity: i < visibleFacts ? 1 : 0,
                transform: i < visibleFacts ? 'translateX(0)' : 'translateX(20px)',
                transition: `all 0.4s ease ${i * 0.1}s`,
              }}
            >
              {fact}
            </div>
          ))}
        </div>

        {/* Read more link */}
        {char.slug !== 'rex' && (
          <div style={{ marginTop: 20, pointerEvents: 'auto' }}>
            <Link
              href={`/characters/${char.slug}`}
              style={{
                fontFamily: 'var(--font-bungee, Bungee, sans-serif)',
                fontSize: 12, textTransform: 'uppercase', letterSpacing: 1,
                color: char.color, textDecoration: 'none',
                opacity: enterPhase > 0.5 ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              Read their story →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
