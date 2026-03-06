'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()

  return (
    <div style={{
      minHeight: '100vh', background: '#07030f', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '40px 28px', fontFamily: 'Raleway, sans-serif',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.35), transparent 70%)', top: -150, left: -150, filter: 'blur(90px)' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(88,28,135,0.3), transparent 70%)', bottom: -100, right: -80, filter: 'blur(90px)' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.18), transparent 70%)', top: '40%', left: '58%', filter: 'blur(80px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <p style={{ fontWeight: 300, fontSize: 10, letterSpacing: '0.55em', color: 'rgba(201,168,76,0.7)', textTransform: 'uppercase', marginBottom: 28 }}>
          Series One
        </p>
        <h1 style={{
          fontFamily: 'Cinzel, serif', fontWeight: 400,
          fontSize: 'clamp(64px, 12vw, 100px)', lineHeight: 1, marginBottom: 16,
          background: 'linear-gradient(135deg, #ffffff 20%, #e8c97a 60%, #c9a84c 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', letterSpacing: '0.12em'
        }}>VAJRA</h1>
        <p style={{ fontWeight: 200, fontSize: 10, letterSpacing: '0.5em', color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase', marginBottom: 44 }}>
          Consciousness Protocol
        </p>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontStyle: 'italic',
          fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.85,
          maxWidth: 360, margin: '0 auto 52px', letterSpacing: '0.02em'
        }}>
          İllüzyonu kes. Gerçeği gör. Taahhüt et.
        </p>
        <button onClick={() => router.push('/auth')} style={{
          padding: '16px 52px', background: 'transparent',
          border: '1px solid rgba(201,168,76,0.5)', color: 'rgba(201,168,76,1)',
          fontFamily: 'Raleway, sans-serif', fontWeight: 300, fontSize: 11,
          letterSpacing: '0.35em', textTransform: 'uppercase', cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          Vajra'ya Gir &nbsp;⟶
        </button>
      </div>
    </div>
  )
}
