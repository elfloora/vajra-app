'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { ProtocolNode } from '@/types'
import { useSessionStore } from '@/lib/store/session-store'
import { useTypewriter } from '@/lib/hooks/useTypewriter'

interface InsightNodeProps {
  node: ProtocolNode
  onComplete: () => void
}

export function InsightNode({ node, onComplete }: InsightNodeProps) {
  const session = useSessionStore((s) => s.session)
  const latestInsight = session?.insights[session.insights.length - 1]

  const insightText = latestInsight?.content ?? node.content
  const { displayText, isComplete } = useTypewriter(insightText, { speed: 25 })

  useEffect(() => {
    if (isComplete) {
      const t = setTimeout(onComplete, 3000)
      return () => clearTimeout(t)
    }
  }, [isComplete, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full"
    >
      <div className="insight-card p-8 rounded-sm">
        <div className="flex items-center gap-2 mb-6">
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border border-neon-cyan/40"
          />
          <span className="font-mono text-[10px] tracking-widest text-neon-cyan/50 uppercase">
            Pattern Detected
          </span>
        </div>

        <p className="font-display text-xl text-white/85 leading-relaxed">
          {displayText}
          {!isComplete && (
            <span className="animate-cursor-blink text-neon-cyan/60">|</span>
          )}
        </p>

        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 pt-6 border-t border-white/5"
          >
            <p className="font-mono text-[10px] text-ghost-text/30 tracking-widest">
              Continuing in a moment...
            </p>
          </motion.div>
        )}
      </div>

      {/* Pattern data visualization */}
      {session && session.patterns.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 flex flex-wrap gap-2"
        >
          {session.patterns.slice(0, 4).map((pattern) => (
            <div
              key={pattern.key}
              className="flex items-center gap-1 px-2 py-1 border border-neon-violet/20 bg-neon-violet/5"
            >
              <span className="font-mono text-[9px] text-neon-violet/60 tracking-wider uppercase">
                {pattern.key}
              </span>
              <span className="font-mono text-[9px] text-neon-violet/40">
                ×{pattern.frequency}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
