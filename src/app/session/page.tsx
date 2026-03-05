'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useSessionStore,
  useCurrentNode,
} from '@/lib/store/session-store'
import { QuestionRenderer } from '@/components/protocol/QuestionRenderer'
import { TransitionNode } from '@/components/protocol/TransitionNode'
import { InsightNode } from '@/components/protocol/InsightNode'
import { SessionComplete } from '@/components/protocol/SessionComplete'
import { SessionHeader } from '@/components/layout/SessionHeader'
import type { ResponseValue } from '@/types'

export default function SessionPage() {
  const router = useRouter()
  const session = useSessionStore((s) => s.session)
  const ui = useSessionStore((s) => s.ui)
  const submitResponse = useSessionStore((s) => s.submitResponse)
  const setUIPhase = useSessionStore((s) => s.setUIPhase)
  const triggerGlitch = useSessionStore((s) => s.triggerGlitch)
  const currentNode = useCurrentNode()

  // Guard: redirect if no session
  useEffect(() => {
    if (!session) {
      router.replace('/enter')
    }
  }, [session, router])

  // Occasional ambient glitch
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.15) triggerGlitch()
    }, 12000)
    return () => clearInterval(interval)
  }, [triggerGlitch])

  const handleResponse = useCallback(
    (value: ResponseValue, choiceId?: string) => {
      submitResponse(value, choiceId)
    },
    [submitResponse]
  )

  const handleTransitionComplete = useCallback(() => {
    submitResponse('— transition —')
  }, [submitResponse])

  const handleInsightComplete = useCallback(() => {
    if (!session || !currentNode?.nextNodeId) return
    setUIPhase('transitioning')
    setTimeout(() => {
      submitResponse('— insight-viewed —')
    }, 400)
  }, [session, currentNode, submitResponse, setUIPhase])

  if (!session || !currentNode) return null

  const isTransitioning = ui.phase === 'transitioning'

  // Ambient background color shifts based on depth
  const ambientGradient =
    ui.ambientMode === 'deep'
      ? 'radial-gradient(ellipse at 30% 40%, rgba(191,0,255,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(0,245,255,0.04) 0%, transparent 50%)'
      : ui.ambientMode === 'emergence'
      ? 'radial-gradient(ellipse at 50% 50%, rgba(255,170,0,0.05) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(0,245,255,0.03) 0%, transparent 50%)'
      : 'radial-gradient(ellipse at 15% 15%, rgba(0,245,255,0.04) 0%, transparent 45%), radial-gradient(ellipse at 85% 85%, rgba(191,0,255,0.03) 0%, transparent 45%)'

  return (
    <div
      className="relative min-h-screen bg-void noise-overlay scanline-effect transition-all duration-3000"
      style={{
        backgroundImage: `${ambientGradient}, linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`,
        backgroundSize: 'auto, auto, 60px 60px, 60px 60px',
      }}
    >
      <SessionHeader />

      {/* Main content */}
      <main className="min-h-screen flex items-center justify-center px-6 pt-16 pb-16">
        <div className="w-full max-w-xl">
          {/* Complete screen */}
          {session.status === 'complete' && (
            <SessionComplete />
          )}

          {/* Active session */}
          {session.status !== 'complete' && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentNode.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: isTransitioning ? 0 : 1, y: isTransitioning ? -10 : 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                {currentNode.type === 'transition' && (
                  <TransitionNode
                    node={currentNode}
                    onComplete={handleTransitionComplete}
                  />
                )}

                {currentNode.type === 'insight' && (
                  <InsightNode
                    node={currentNode}
                    onComplete={handleInsightComplete}
                  />
                )}

                {(currentNode.type === 'question' || currentNode.type === 'terminus') && (
                  <QuestionRenderer
                    node={currentNode}
                    onSubmit={handleResponse}
                    disabled={isTransitioning}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>

      {/* Glitch overlay */}
      <AnimatePresence>
        {ui.glitchActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className="fixed inset-0 pointer-events-none z-40 mix-blend-overlay"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(0,245,255,0.015) 3px,
                rgba(0,245,255,0.015) 4px
              )`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Depth orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {session.depthReached >= 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.08 }}
            transition={{ duration: 2 }}
            className="orb absolute w-96 h-96"
            style={{
              background: 'radial-gradient(circle, rgba(191,0,255,0.5) 0%, transparent 70%)',
              top: '-10%',
              right: '-5%',
            }}
          />
        )}
        {session.depthReached >= 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.06 }}
            transition={{ duration: 2 }}
            className="orb absolute w-64 h-64"
            style={{
              background: 'radial-gradient(circle, rgba(255,0,128,0.5) 0%, transparent 70%)',
              bottom: '5%',
              left: '-5%',
              animationDelay: '-4s',
            }}
          />
        )}
      </div>
    </div>
  )
}
