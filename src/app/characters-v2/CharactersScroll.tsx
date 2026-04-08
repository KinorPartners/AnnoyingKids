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
  const totalSections = ALL_CHARS.length + 1 // +1 for intro

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

  // Continuous float position through all sections
  const floatPos = scrollProgress * totalSections
  const activeIndex = Math.min(Math.floor(floatPos), totalSections - 1)

  // Interpolate background glow color between current and next character
  const currColor = activeIndex === 0 ? '#ff2d78' : ALL_CHARS[Math.min(activeIndex - 1, ALL_CHARS.length - 1)]?.color || '#fff'
  const nextColor = activeIndex < ALL_CHARS.length ? ALL_CHARS[Math.min(activeIndex, ALL_CHARS.length - 1)]?.color || '#fff' : '#ef4444'
  const blend = floatPos - activeIndex // 0-1 within section

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
          transition: 'width 0.05s linear',
        }} />
      </div>

      {/* Background glow that morphs between character colors */}
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

      {/* Fixed viewport — render TWO characters for crossfade */}
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', pointerEvents: 'none', zIndex: 1,
      }}>
        {/* Intro */}
        {activeIndex === 0 && <IntroSection progress={blend} />}

        {/* Current character (fading out) */}
        {activeIndex > 0 && activeIndex <= ALL_CHARS.length && (
          <CharacterSection
            char={ALL_CHARS[activeIndex - 1]}
            component={CHAR_COMPONENTS[ALL_CHARS[activeIndex - 1].slug]}
            progress={blend}
            index={activeIndex - 1}
            phase="current"
          />
        )}

        {/* Next character (fading in) — renders during transition zone */}
        {activeIndex > 0 && activeIndex < ALL_CHARS.length && blend > 0.55 && (
          <CharacterSection
            char={ALL_CHARS[activeIndex]}
            component={CHAR_COMPONENTS[ALL_CHARS[activeIndex].slug]}
            progress={(blend - 0.55) / 0.45} // 0-1 during last 45% of section
            index={activeIndex}
            phase="incoming"
          />
        )}

        {/* Intro to first character transition */}
        {activeIndex === 0 && blend > 0.6 && (
          <CharacterSection
            char={ALL_CHARS[0]}
            component={CHAR_COMPONENTS[ALL_CHARS[0].slug]}
            progress={(blend - 0.6) / 0.4}
            index={0}
            phase="incoming"
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
              borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: activeIndex === i
                ? (i === 0 ? '#fff' : ALL_CHARS[i - 1]?.color || '#fff')
                : 'rgba(255,255,255,0.25)',
              boxShadow: activeIndex === i ? `0 0 12px ${i === 0 ? '#fff' : ALL_CHARS[i - 1]?.color || '#fff'}` : 'none',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Bottom CTA */}
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
  // Fade out and zoom as user scrolls, but start earlier
  const fadeOut = progress > 0.5 ? (progress - 0.5) / 0.5 : 0
  const opacity = 1 - fadeOut
  const scale = 1 + progress * 0.2
  const y = progress * -80

  return (
    <div style={{
      textAlign: 'center', position: 'absolute',
      opacity, transform: `translateY(${y}px) scale(${scale})`,
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
      <div style={{ fontSize: 28, animation: 'bounce 1.5s ease infinite', color: 'rgba(255,255,255,0.3)' }}>↓</div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}`}</style>
    </div>
  )
}

function CharacterSection({ char, component, progress, index, phase }: {
  char: CharSection; component?: React.ReactNode; progress: number; index: number;
  phase: 'current' | 'incoming';
}) {
  const isFlipped = index % 2 === 1
  const isIncoming = phase === 'incoming'

  let opacity: number, avatarRotateY: number, avatarRotateX: number, avatarScale: number
  let avatarX: number, avatarY: number, infoX: number, infoOpacity: number

  if (isIncoming) {
    // Incoming: rise up from below with 3D rotation
    const ease = 1 - Math.pow(1 - progress, 3) // ease-out cubic
    opacity = progress
    avatarRotateY = (1 - ease) * 60
    avatarRotateX = (1 - ease) * 20
    avatarScale = 0.5 + ease * 0.5
    avatarX = 0
    avatarY = (1 - ease) * 120
    infoX = 0
    infoOpacity = Math.max(0, (progress - 0.3) / 0.7)
  } else {
    // Current: visible, then drift upward and fade
    const enterDone = Math.min(progress / 0.2, 1)
    const exitStart = Math.max(0, (progress - 0.55) / 0.45)
    const exitEase = exitStart * exitStart

    opacity = enterDone * (1 - exitEase * 0.8)
    avatarRotateY = exitEase * -30
    avatarRotateX = exitEase * 15
    avatarScale = 1 - exitEase * 0.2
    avatarX = 0
    avatarY = exitEase * -80
    infoX = 0
    infoOpacity = enterDone * (1 - exitEase * 1.2)
  }

  // Facts stagger (only for current phase, past the settle)
  const factReveal = isIncoming ? progress : Math.min(progress / 0.5, 1)
  const visibleFacts = Math.floor(factReveal * (Math.min(char.facts?.length || 0, 3)))

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', width: '100%', maxWidth: 640, padding: '0 24px',
      opacity: Math.max(0, opacity), position: 'absolute',
    }}>
      {/* Name */}
      <h2 style={{
        fontFamily: 'var(--font-bungee, Bungee, sans-serif)',
        fontSize: 'clamp(52px, 9vw, 96px)', color: '#fff',
        textTransform: 'uppercase', lineHeight: 0.92, margin: '0 0 8px',
      }}>
        {char.name}
      </h2>

      {/* Subtitle: role + tagline */}
      <div style={{
        fontFamily: 'var(--font-space, "Space Grotesk", sans-serif)',
        fontSize: 14, textTransform: 'uppercase', letterSpacing: 3,
        color: char.color, marginBottom: 6,
      }}>
        {char.role} · Age {char.age}
      </div>
      <p style={{
        fontFamily: 'var(--font-space, "Space Grotesk", sans-serif)',
        fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6,
        marginBottom: 24, maxWidth: 480,
      }}>
        {char.tagline}
      </p>

      {/* Avatar with 3D perspective */}
      <div style={{ perspective: 1000, marginBottom: 24 }}>
        <div style={{
          transform: `rotateY(${avatarRotateY}deg) rotateX(${avatarRotateX}deg) scale(${avatarScale}) translateY(${avatarY}px)`,
          transformStyle: 'preserve-3d', willChange: 'transform',
        }}>
          <div style={{
            width: 180, height: 180, borderRadius: 32,
            background: char.color + '15',
            border: `2px solid ${char.color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 20px 60px ${char.color}33, inset 0 0 40px ${char.color}11`,
            margin: '0 auto',
          }}>
            {component || <span style={{ fontSize: 80 }}>🦕</span>}
          </div>
          <div style={{
            width: 120, height: 16, margin: '12px auto 0', borderRadius: '50%',
            background: `radial-gradient(ellipse, ${char.color}33 0%, transparent 70%)`,
            filter: 'blur(4px)', opacity: avatarScale,
          }} />
        </div>
      </div>

      {/* Origin snippet */}
      {char.origin && !isIncoming && (
        <p style={{
          fontFamily: 'var(--font-space, "Space Grotesk", sans-serif)',
          fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75,
          marginBottom: 20, maxWidth: 500,
          opacity: Math.max(0, Math.min(1, (progress - 0.15) / 0.2)),
          transform: `translateY(${Math.max(0, (1 - Math.min(1, (progress - 0.15) / 0.2))) * 12}px)`,
        }}>
          {char.origin.split('\n')[0].slice(0, 180)}...
        </p>
      )}

      {/* Facts staggered in */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 500 }}>
        {(char.facts || []).slice(0, 3).map((fact, i) => (
          <div key={i} style={{
            fontFamily: 'var(--font-space, "Space Grotesk", sans-serif)',
            fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6,
            padding: '10px 18px', borderRadius: 10, textAlign: 'left',
            background: i < visibleFacts ? `${char.color}12` : 'transparent',
            borderLeft: i < visibleFacts ? `3px solid ${char.color}` : '3px solid transparent',
            opacity: i < visibleFacts ? 1 : 0,
            transform: i < visibleFacts ? 'translateY(0)' : 'translateY(15px)',
            transition: `all 0.4s ease ${i * 0.12}s`,
          }}>
            {fact}
          </div>
        ))}
      </div>

      {/* Read more link */}
      {char.slug !== 'rex' && !isIncoming && (
        <div style={{ marginTop: 20, pointerEvents: 'auto' }}>
          <Link
            href={`/characters/${char.slug}`}
            style={{
              fontFamily: 'var(--font-bungee, Bungee, sans-serif)',
              fontSize: 12, textTransform: 'uppercase', letterSpacing: 1,
              color: char.color, textDecoration: 'none',
              opacity: progress > 0.25 && progress < 0.7 ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            Read their story →
          </Link>
        </div>
      )}
    </div>
  )
}
