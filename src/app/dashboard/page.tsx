'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getUserSessions, type VajraSession } from '@/lib/supabase/db'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [sessions, setSessions] = useState<VajraSession[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
      const s = await getUserSessions()
      setSessions(s)
      setLoading(false)
    }
    load()
  }, [])

  const topPattern = (patterns: Record<string, number>) => {
    const entries = Object.entries(patterns || {}).sort((a, b) => b[1] - a[1])
    return entries[0]?.[0] || null
  }

  return (
    <div style={{ minHeight: '100vh', background: '#07030f', color: 'white', fontFamily: 'Raleway, sans-serif', padding: '80px 28px 40px' }}>
      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.18), transparent 70%)', top: -100, left: -100, filter: 'blur(90px)' }} />
        <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.09), transparent 70%)', bottom: -80, right: -60, filter: 'blur(80px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 640, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 48 }}>
          <div>
            <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 400, fontSize: 28, letterSpacing: '0.08em', background: 'linear-gradient(135deg, #fff 40%, #e8c97a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}>VAJRA</h1>
            <p style={{ fontWeight: 300, fontSize: 10, letterSpacing: '0.4em', color: 'rgba(201,168,76,0.35)', textTransform: 'uppercase', marginTop: 4 }}>
              {user?.user_metadata?.full_name || user?.email}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => router.push('/enter')} style={btnStyle}>
              Yeni Seans ⟶
            </button>
            <button onClick={async () => { await supabase.auth.signOut(); router.push('/auth') }} style={{ ...btnStyle, borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }}>
              Çıkış
            </button>
          </div>
        </div>

        {/* Stats */}
        {sessions.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'rgba(201,168,76,0.06)', marginBottom: 40 }}>
            {[
              { value: sessions.length, label: 'Toplam Seans' },
              { value: Math.max(...sessions.map(s => s.depth_reached)) + '/5', label: 'Max Derinlik' },
              { value: sessions.reduce((a, s) => a + s.duration_minutes, 0) + 'm', label: 'Toplam Süre' }
            ].map(stat => (
              <div key={stat.label} style={{ background: '#110820', padding: '18px', textAlign: 'center' }}>
                <span style={{ fontFamily: 'Cinzel, serif', fontSize: 24, color: '#c9a84c', display: 'block', letterSpacing: '0.05em' }}>{stat.value}</span>
                <span style={{ fontWeight: 300, fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.35em', textTransform: 'uppercase', marginTop: 6, display: 'block' }}>{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Sessions list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#c9a84c', margin: '0 auto', boxShadow: '0 0 12px #c9a84c', animation: 'pulse 2s infinite' }} />
          </div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 20, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>
              Henüz seans yok.<br />İlk yolculuğuna başla.
            </p>
            <button onClick={() => router.push('/enter')} style={{ ...btnStyle, marginTop: 32, padding: '14px 40px' }}>
              Vajra'ya Gir ⟶
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <p style={{ fontWeight: 300, fontSize: 8, letterSpacing: '0.45em', color: 'rgba(201,168,76,0.35)', textTransform: 'uppercase', marginBottom: 16 }}>Seans Geçmişi</p>
            {sessions.map((session, i) => (
              <div key={session.id} onClick={() => router.push(`/dashboard/${session.id}`)} style={{
                background: 'linear-gradient(135deg, rgba(124,58,237,0.04), rgba(201,168,76,0.03))',
                border: '1px solid rgba(201,168,76,0.08)',
                padding: '20px 24px',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(201,168,76,0.08)')}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: 0, marginBottom: 8, fontStyle: 'italic', lineHeight: 1.6, maxWidth: 400 }}>
                      "{session.insight_text?.slice(0, 90)}{session.insight_text?.length > 90 ? '...' : ''}"
                    </p>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <span style={{ fontWeight: 300, fontSize: 9, color: 'rgba(201,168,76,0.4)', letterSpacing: '0.2em' }}>
                        {new Date(session.started_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span style={{ fontWeight: 300, fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}>
                        {session.duration_minutes}dk · Derinlik {session.depth_reached}/5
                      </span>
                      {topPattern(session.patterns) && (
                        <span style={{ fontWeight: 300, fontSize: 8, color: 'rgba(124,58,237,0.6)', border: '1px solid rgba(124,58,237,0.2)', padding: '2px 8px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                          {topPattern(session.patterns)}
                        </span>
                      )}
                    </div>
                  </div>
                  <span style={{ color: 'rgba(201,168,76,0.3)', fontSize: 18, marginLeft: 16 }}>⟶</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const btnStyle: React.CSSProperties = {
  padding: '10px 20px',
  background: 'transparent',
  border: '1px solid rgba(201,168,76,0.3)',
  color: 'rgba(201,168,76,0.8)',
  fontFamily: 'Raleway, sans-serif',
  fontWeight: 300,
  fontSize: 10,
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'all 0.25s ease'
}
