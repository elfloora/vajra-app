'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSessionStore } from '@/lib/store/session-store'

const AGREEMENTS = [
  'I will answer honestly, not optimally.',
  'I understand there are no correct responses.',
  'I accept that clarity may be uncomfortable.',
]

export default function EnterPage() {
  const [agreedItems, setAgreedItems] = useState<Set<number>>(new Set())
  const [entering, setEntering] = useState(false)
  const router = useRouter()
  const initSession = useSessionStore((s) => s.initSession)

  const toggleAgreement = (index: number) => {
    setAgreedItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const allAgreed = agreedItems.size === AGREEMENTS.length

  const handleEnter = async () => {
    if (!allAgreed) return
    setEntering(true)
    initSession('lucy-core-v1')
    await new Promise((r) => setTimeout(r, 1200))
    router.push('/session')
  }

  return (
    <main className="relative min-h-screen cosmic-bg noise-overlay scanline-effect flex items-center justify-center px-6">
      {/* Ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="orb absolute w-64 h-64 opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(0,245,255,0.5) 0%, transparent 70%)',
            top: '20%',
            right: '10%',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="font-mono text-xs text-ghost-text/50 tracking-widest uppercase hover:text-neon-cyan/70 transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span>Return</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-10"
        >
          <p className="font-mono text-[10px] tracking-[0.5em] text-neon-cyan/60 uppercase mb-3">
            Pre-Protocol
          </p>
          <h1 className="font-display text-3xl text-white mb-4">
            Before you begin
          </h1>
          <p className="text-ghost-text font-light text-sm leading-relaxed">
            The following session will ask questions that move inward.
            Some answers may be unfamiliar — even to you.
          </p>
        </motion.div>

        {/* What to expect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-10 p-4 insight-card rounded-sm"
        >
          <p className="font-mono text-[10px] tracking-widest text-neon-cyan/50 uppercase mb-3">
            What this is
          </p>
          <div className="space-y-2">
            {[
              '12–15 minutes of structured self-inquiry',
              'Pattern detection across your responses',
              'No stored data — session ends when you leave',
              'AI-enhanced reflection (when API configured)',
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <span className="text-neon-cyan/40 text-xs mt-0.5 font-mono">◈</span>
                <span className="text-ghost-text text-xs font-light leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Agreement checkboxes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="space-y-3 mb-10"
        >
          <p className="font-mono text-[10px] tracking-widest text-ghost-text/40 uppercase mb-4">
            Acknowledge to proceed
          </p>
          {AGREEMENTS.map((text, i) => (
            <button
              key={i}
              onClick={() => toggleAgreement(i)}
              className="w-full flex items-center gap-3 group text-left"
            >
              <div
                className={`w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                  agreedItems.has(i)
                    ? 'border-neon-cyan bg-neon-cyan/10'
                    : 'border-ghost-border group-hover:border-neon-cyan/40'
                }`}
              >
                {agreedItems.has(i) && (
                  <span className="text-neon-cyan text-[10px]">✓</span>
                )}
              </div>
              <span
                className={`text-sm font-light transition-colors duration-200 ${
                  agreedItems.has(i) ? 'text-white/70' : 'text-ghost-text/60 group-hover:text-ghost-text'
                }`}
              >
                {text}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Enter button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <button
            onClick={handleEnter}
            disabled={!allAgreed || entering}
            className={`w-full btn-neon py-4 transition-all duration-500 ${
              !allAgreed ? 'opacity-30 cursor-not-allowed' : ''
            } ${entering ? 'opacity-60' : ''}`}
          >
            {entering ? (
              <span className="flex items-center gap-3">
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  ◈
                </motion.span>
                <span>Entering Protocol</span>
              </span>
            ) : (
              'Begin Session'
            )}
          </button>
        </motion.div>
      </div>
    </main>
  )
}
