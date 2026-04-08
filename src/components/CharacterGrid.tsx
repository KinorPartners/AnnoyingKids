'use client'
import { useRef, useEffect, useState, ReactNode } from 'react'

interface Props {
  children: ReactNode[]
}

function RevealCard({ children, index }: { children: ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el) } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(50px) scale(0.95)',
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
      }}
    >
      {children}
    </div>
  )
}

export default function CharacterGrid({ children }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {children.map((child, i) => (
        <RevealCard key={i} index={i}>{child}</RevealCard>
      ))}
    </div>
  )
}
