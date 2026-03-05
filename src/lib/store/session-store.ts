import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  ProtocolSession,
  ProtocolFlow,
  ResponseValue,
  UIState,
  UIPhase,
} from '@/types'
import {
  createSession,
  advanceSession,
  getCurrentNode,
} from '@/lib/engine/session-engine'
import { ALL_FLOWS } from '@/lib/engine/protocol-flows'

// ─── Store Shape ──────────────────────────────────────────────────────────────

interface SessionStore {
  session: ProtocolSession | null
  flow: ProtocolFlow | null
  ui: UIState
  nodeStartTime: number

  // Actions
  initSession: (flowId: string) => void
  submitResponse: (value: ResponseValue, choiceId?: string) => void
  skipNode: () => void
  resetSession: () => void
  setUIPhase: (phase: UIPhase) => void
  triggerGlitch: () => void
  setAmbientMode: (mode: UIState['ambientMode']) => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      session: null,
      flow: null,
      nodeStartTime: Date.now(),
      ui: {
        phase: 'idle',
        glitchActive: false,
        scanlineActive: true,
        ambientMode: 'default',
      },

      initSession: (flowId: string) => {
        const flow = ALL_FLOWS[flowId]
        if (!flow) return

        const session = createSession(flowId)
        set({
          session,
          flow,
          nodeStartTime: Date.now(),
          ui: {
            phase: 'question',
            glitchActive: false,
            scanlineActive: true,
            ambientMode: 'default',
          },
        })
      },

      submitResponse: (value: ResponseValue, choiceId?: string) => {
        const { session, flow } = get()
        if (!session || !flow) return

        set((state) => ({
          ui: { ...state.ui, phase: 'transitioning' },
        }))

        setTimeout(() => {
          const updated = advanceSession(session, flow, value, choiceId)
          const nextNode = getCurrentNode(updated, flow)

          let nextPhase: UIPhase = 'question'
          if (updated.status === 'complete') nextPhase = 'complete'
          else if (nextNode?.type === 'insight') nextPhase = 'insight'
          else if (nextNode?.type === 'transition') nextPhase = 'question'

          const ambientMode: UIState['ambientMode'] =
            (updated.depthReached ?? 0) >= 4
              ? 'deep'
              : updated.status === 'complete'
              ? 'emergence'
              : 'default'

          set({
            session: updated,
            nodeStartTime: Date.now(),
            ui: {
              phase: nextPhase,
              glitchActive: false,
              scanlineActive: true,
              ambientMode,
            },
          })
        }, 800)
      },

      skipNode: () => {
        const { submitResponse } = get()
        submitResponse('— skipped —')
      },

      resetSession: () => {
        set({
          session: null,
          flow: null,
          nodeStartTime: Date.now(),
          ui: {
            phase: 'idle',
            glitchActive: false,
            scanlineActive: true,
            ambientMode: 'default',
          },
        })
      },

      setUIPhase: (phase: UIPhase) => {
        set((state) => ({ ui: { ...state.ui, phase } }))
      },

      triggerGlitch: () => {
        set((state) => ({ ui: { ...state.ui, glitchActive: true } }))
        setTimeout(() => {
          set((state) => ({ ui: { ...state.ui, glitchActive: false } }))
        }, 400)
      },

      setAmbientMode: (mode) => {
        set((state) => ({ ui: { ...state.ui, ambientMode: mode } }))
      },
    }),
    {
      name: 'lucy-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        session: state.session,
        flow: state.flow,
      }),
    }
  )
)

// ─── Derived Selectors ────────────────────────────────────────────────────────

export function useCurrentNode() {
  const session = useSessionStore((s) => s.session)
  const flow = useSessionStore((s) => s.flow)
  if (!session || !flow) return null
  return getCurrentNode(session, flow)
}

export function useSessionProgress() {
  const session = useSessionStore((s) => s.session)
  const flow = useSessionStore((s) => s.flow)
  if (!session || !flow) return { current: 0, total: 0, percent: 0 }

  const total = Object.keys(flow.nodes).length
  const current = session.responses.length
  return {
    current,
    total,
    percent: Math.round((current / total) * 100),
  }
}
