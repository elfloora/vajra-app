'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
      if (error) setMessage(error.message)
      else setMessage('Doğrulama emaili gönderildi.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage('Email veya şifre hatalı.')
      else router.push('/enter')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#07030f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)', top: -150, left: -150, filter: 'blur(90px)' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.15), transparent 70%)', bottom: -100, right: -80, filter: 'blur(80px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 52, fontWeight: 400, letterSpacing: '0.12em', background: 'linear-gradient(135deg, #ffffff 20%, #e8c97a 60%, #c9a84c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}>VAJRA</h1>
          <p style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 300, fontSize: 9, letterSpacing: '0.5em', color: 'rgba(201,168,76,0.5)', textTransform: 'uppercase', marginTop: 10 }}>Consciousness Protocol</p>
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', marginBottom: 36, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          {(['login', 'signup'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '14px', background: 'transparent', border: 'none', borderBottom: mode === m ? '1px solid rgba(201,168,76,0.7)' : '1px solid transparent', color: mode === m ? '#c9a84c' : 'rgba(255,255,255,0.3)', fontFamily: 'Raleway, sans-serif', fontWeight: 400, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: -1 }}>
              {m === 'login' ? 'Giriş' : 'Kayıt'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleAuth}>
          {mode === 'signup' && (
            <div style={{ marginBottom: 24 }}>
              <input type="text" placeholder="Adın" value={name} onChange={e => setName(e.target.value)} required style={inp} />
            </div>
          )}
          <div style={{ marginBottom: 24 }}>
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inp} />
          </div>
          <div style={{ marginBottom: 36 }}>
            <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} required style={inp} />
          </div>

          {message && <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 15, color: message.includes('gönderildi') ? '#c9a84c' : '#ff6b6b', marginBottom: 20, lineHeight: 1.6 }}>{message}</p>}

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '15px', background: 'transparent', border: '1px solid rgba(201,168,76,0.5)', color: '#c9a84c', fontFamily: 'Raleway, sans-serif', fontWeight: 400, fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase', cursor: 'pointer' }}>
            {loading ? '...' : mode === 'login' ? 'Giriş Yap ⟶' : 'Kayıt Ol ⟶'}
          </button>
        </form>

        <div style={{ margin: '28px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 300, fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.3em' }}>VEYA</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        </div>

        <button onClick={async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/enter` } }) }} style={{ width: '100%', padding: '15px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.6)', fontFamily: 'Raleway, sans-serif', fontWeight: 300, fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer' }}>
          G &nbsp; Google ile Devam Et
        </button>
      </div>
    </div>
  )
}

const inp: React.CSSProperties = {
  width: '100%', background: 'transparent', border: 'none',
  borderBottom: '1px solid rgba(201,168,76,0.25)',
  color: 'white', fontFamily: 'Cormorant Garamond, serif',
  fontSize: 18, fontWeight: 400, padding: '10px 0',
  outline: 'none', caretColor: '#c9a84c', boxSizing: 'border-box'
}
