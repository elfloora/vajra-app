'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSessionStore } from '@/lib/store/session-store'
import { buildSessionSummary } from '@/lib/engine/session-engine'
import { ALL_FLOWS } from '@/lib/engine/protocol-flows'
import { formatDuration } from '@/lib/utils'

export function SessionComplete() {
  const session = useSessionStore((s) => s.session)
  const resetSession = useSessionStore((s) => s.resetSession)

  const summary = useMemo(() => {
    if (!session) return null
    const flow = ALL_FLOWS[session.flowId]
    if (!flow) return null
    return buildSessionSummary(session, flow)
  }, [session])

  if (!summary || !session) return null

  const duration = formatDuration(
    (session.completedAt ?? Date.now()) - session.startedAt
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="w-full max-w-lg mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center border border-neon-cyan/30"
          style={{
            background: 'radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)',
            boxShadow: '0 0 40px rgba(0,245,255,0.15)',
          }}
        >
          <span className="text-neon-cyan text-xl">◎</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-mono text-[10px] tracking-[0.5em] text-neon-cyan/60 uppercase mb-3"
        >
          Protocol Complete
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-display text-4xl text-white mb-4"
        >
          Session Closed
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="font-body font-light text-sm text-ghost-text/60 italic max-w-sm mx-auto"
        >
          {`"What you brought here remains. What you discovered — that is yours now."`}
        </motion.p>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-3 gap-px bg-white/5 mb-8"
      >
        {[
          { label: 'Duration', value: duration },
          { label: 'Depth', value: `${summary.depthReached}/5` },
          { label: 'Responses', value: String(summary.totalResponses) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-void-surface p-4 text-center">
            <div className="font-display text-2xl text-neon-cyan mb-1">{value}</div>
            <div className="font-mono text-[9px] text-ghost-text/40 tracking-widest uppercase">
              {label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Dominant patterns */}
      {summary.dominantPatterns.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mb-8 p-5 insight-card"
        >
          <p className="font-mono text-[10px] tracking-widest text-neon-cyan/50 uppercase mb-4">
            Detected Patterns
          </p>
          <div className="space-y-2">
            {summary.dominantPatterns.map((pattern, i) => (
              <div key={pattern.key} className="flex items-center gap-3">
                <div
                  className="h-1 bg-gradient-to-r from-neon-cyan to-neon-violet rounded-full"
                  style={{
                    width: `${Math.min(100, (pattern.frequency / 4) * 100)}%`,
                    opacity: 1 - i * 0.2,
                  }}
                />
                <span className="font-mono text-[10px] text-ghost-text/50 capitalize whitespace-nowrap">
                  {pattern.key} ×{pattern.frequency}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Insights generated */}
      {summary.insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mb-8 space-y-3"
        >
          <p className="font-mono text-[10px] tracking-widest text-ghost-text/30 uppercase mb-3">
            {summary.insights.length} insight{summary.insights.length !== 1 ? 's' : ''} surfaced
          </p>
          {summary.insights.map((insight) => (
            <div
              key={insight.id}
              className="p-4 border-l-2 border-neon-violet/30 bg-neon-violet/5"
            >
              <p className="text-sm text-ghost-text/70 font-light leading-relaxed italic">
                {insight.content}
              </p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="flex flex-col gap-3"
      >
        <Link href="/enter" onClick={resetSession}>
          <button className="w-full btn-neon py-3">
            Begin Another Session
          </button>
        </Link>
        <Link href="/" onClick={resetSession}>
          <button className="w-full py-3 font-mono text-xs text-ghost-text/40 tracking-widest hover:text-ghost-text/70 transition-colors uppercase">
            Return to Protocol Index
          </button>
        </Link>
      </motion.div>
    </motion.div>
  )
}
