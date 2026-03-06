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
  const { displayText, isComplete } = useTypewriter(node.content, { speed: 40 })

  // Auto-advance after 2.5s once text is done
  useEffect(() => {
    if (isComplete) {
      const t = setTimeout(onComplete, 2500)
      return () => clearTimeout(t)
    }
  }, [isComplete, onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onComplete}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: 300, cursor: 'pointer', padding: '0 20px' }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{ width: 8, height: 8, borderRadius: '50%', background: '#c9a84c', marginBottom: 32, boxShadow: '0 0 20px rgba(201,168,76,0.8)' }}
      />
      <p style={{ fontFamily: 'Cinzel, serif', fontWeight: 400, fontSize: 22, color: 'rgba(255,255,255,0.85)', marginBottom: 16, letterSpacing: '0.04em', lineHeight: 1.5 }}>
        {displayText}
        {!isComplete && <span style={{ color: '#c9a84c', opacity: 0.8 }}>|</span>}
      </p>
      {isComplete && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 24 }}
        >
          devam etmek için dokun
        </motion.p>
      )}
    </motion.div>
  )
}
