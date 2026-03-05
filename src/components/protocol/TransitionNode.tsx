'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { ProtocolNode } from '@/types'
import { useTypewriter } from '@/lib/hooks/useTypewriter'

interface TransitionNodeProps {
  node: ProtocolNode
  onComplete: () => void
}

export function TransitionNode({ node, onComplete }: TransitionNodeProps) {
  const { displayText, isComplete } = useTypewriter(node.content, { speed: 30 })
  const { displayText: subtextDisplay, isComplete: subtextComplete } = useTypewriter(
    node.subtext ?? '',
    { speed: 22, startDelay: isComplete ? 500 : 99999 }
  )

  useEffect(() => {
    if (subtextComplete || (isComplete && !node.subtext)) {
      const t = setTimeout(onComplete, 1800)
      return () => clearTimeout(t)
    }
  }, [subtextComplete, isComplete, node.subtext, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center text-center min-h-[200px]"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-2 h-2 rounded-full bg-neon-cyan mb-8"
        style={{ boxShadow: '0 0 20px rgba(0,245,255,0.8)' }}
      />
      <p className="font-display text-2xl text-white/80 mb-4">
        {displayText}
        {!isComplete && <span className="animate-cursor-blink text-neon-cyan">|</span>}
      </p>
      {node.subtext && (
        <p className="font-body font-light text-sm text-ghost-text/50 italic">
          {subtextDisplay}
        </p>
      )}
    </motion.div>
  )
}
