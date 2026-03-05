'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setLoading(false)
      // Don't auto-redirect, let user click
    })
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: '#07030f', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '40px 28px', fontFamily: 'Raleway, sans-serif',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.22), transparent 70%)', top: -110, left: -110, filter: 'blur(90px)' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(88,28,135,0.18), transparent 70%)', bottom: -90, right: -70, filter: 'blur(90px)' }} />
        <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.1), transparent 70%)', top: '40%', left: '58%', filter: 'blur(80px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <p style={{ fontWeight: 300, fontSize: 9, letterSpacing: '0.55em', color: 'rgba(201,168,76,0.4)', textTransform: 'uppercase', marginBottom: 28 }}>
          Series One
        </p>
        <h1 style={{
          fontFamily: 'Cinzel, serif', fontWeight: 400,
          fontSize: 'clamp(56px, 10vw, 88px)', lineHeight: 1, marginBottom: 10,
          background: 'linear-gradient(135deg, #fff 30%, #e8c97a 70%, #c9a84c 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', letterSpacing: '0.12em'
        }}>VAJRA</h1>
        <p style={{ fontWeight: 200, fontSize: 9, letterSpacing: '0.5em', color: 'rgba(201,168,76,0.35)', textTransform: 'uppercase', marginBottom: 40 }}>
          Consciousness Protocol
        </p>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontStyle: 'italic',
          fontSize: 16, color: 'rgba(255,255,255,0.28)', lineHeight: 1.85,
          maxWidth: 360, margin: '0 auto 44px', letterSpacing: '0.02em'
        }}>
          İllüzyonu kes. Gerçeği gör. Taahhüt et.
        </p>
        <button onClick={() => router.push('/auth')} style={{
          padding: '15px 44px', background: 'transparent',
          border: '1px solid rgba(201,168,76,0.3)', color: 'rgba(201,168,76,0.9)',
          fontFamily: 'Raleway, sans-serif', fontWeight: 300, fontSize: 10,
          letterSpacing: '0.35em', textTransform: 'uppercase', cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          Vajra'ya Gir &nbsp;⟶
        </button>
      </div>
    </div>
  )
}
