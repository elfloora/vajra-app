'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSessionStore, useSessionProgress } from '@/lib/store/session-store'

export function SessionHeader() {
  const ui = useSessionStore((s) => s.ui)
  const session = useSessionStore((s) => s.session)
  const resetSession = useSessionStore((s) => s.resetSession)
  const progress = useSessionProgress()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      {/* Progress line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/5">
        <div
          className="progress-line h-full"
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={resetSession}>
          <span className="font-mono text-[10px] tracking-[0.4em] text-ghost-text/40 uppercase hover:text-ghost-text/70 transition-colors cursor-pointer">
            Lucy ◈
          </span>
        </Link>

        {/* Center status */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-neon-cyan"
          />
          <span className="font-mono text-[10px] text-ghost-text/30 tracking-widest uppercase">
            {ui.ambientMode === 'deep'
              ? 'Deep Inquiry'
              : ui.ambientMode === 'emergence'
              ? 'Emergence'
              : 'Active Session'}
          </span>
        </div>

        {/* Response counter */}
        <div className="font-mono text-[10px] text-ghost-text/30 tracking-widest">
          {String(progress.current).padStart(2, '0')} / {String(progress.total).padStart(2, '0')}
        </div>
      </div>
    </header>
  )
}
