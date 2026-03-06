'use client'

import { useSessionStore } from '@/lib/store/session-store'

export function SessionHeader() {
  const session = useSessionStore((s) => s.session)
  const ui = useSessionStore((s) => s.ui)

  const modeLabel = ui.ambientMode === 'deep' ? 'Derin Sorgu' : ui.ambientMode === 'emergence' ? 'Uyanış' : 'Aktif Seans'
  const totalNodes = session?.flow?.nodes ? Object.keys(session.flow.nodes).length : 0

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 28px',
      borderBottom: '1px solid rgba(201,168,76,0.06)',
      fontFamily: 'Raleway, sans-serif'
    }}>
      <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 400, fontSize: 13, letterSpacing: '0.15em', color: 'rgba(201,168,76,0.7)' }}>
        VAJRA ✦
      </span>
      <span style={{ fontWeight: 300, fontSize: 8, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
        ● {modeLabel}
      </span>
      <span style={{ fontFamily: 'Cinzel, serif', fontWeight: 400, fontSize: 11, color: 'rgba(201,168,76,0.35)', letterSpacing: '0.1em' }}>
        {String(totalNodes).padStart(2, '0')}
      </span>
    </header>
  )
}
