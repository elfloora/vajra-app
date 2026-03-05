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
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      })
      if (error) setMessage(error.message)
      else setMessage('Doğrulama emaili gönderildi. Gelen kutunu kontrol et.')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage('Email veya şifre hatalı.')
      else router.push('/enter')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07030f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Raleway, sans-serif',
      padding: '20px'
    }}>
      {/* Background orbs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)', top: -100, left: -100, filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.1), transparent 70%)', bottom: -80, right: -60, filter: 'blur(80px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 48,
            fontWeight: 400,
            letterSpacing: '0.12em',
            background: 'linear-gradient(135deg, #fff 30%, #e8c97a 70%, #c9a84c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>VAJRA</h1>
          <p style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 200, fontSize: 9, letterSpacing: '0.5em', color: 'rgba(201,168,76,0.4)', textTransform: 'uppercase', marginTop: 8 }}>
            Consciousness Protocol
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {(['login', 'signup'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: '12px', background: 'transparent', border: 'none',
              borderBottom: mode === m ? '1px solid rgba(201,168,76,0.6)' : '1px solid transparent',
              color: mode === m ? 'rgba(201,168,76,0.9)' : 'rgba(255,255,255,0.25)',
              fontFamily: 'Raleway, sans-serif', fontWeight: 300, fontSize: 10,
              letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer',
              transition: 'all 0.3s ease', marginBottom: -1
            }}>
              {m === 'login' ? 'Giriş' : 'Kayıt'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleAuth}>
          {mode === 'signup' && (
            <div style={{ marginBottom: 20 }}>
              <input
                type="text"
                placeholder="Adın"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
          )}
          <div style={{ marginBottom: 20 }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 32 }}>
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {message && (
            <p style={{
              fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
              fontSize: 14, color: message.includes('gönderildi') ? 'rgba(201,168,76,0.7)' : 'rgba(255,100,100,0.7)',
              marginBottom: 20, lineHeight: 1.6
            }}>{message}</p>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '14px', background: 'transparent',
            border: '1px solid rgba(201,168,76,0.3)',
            color: loading ? 'rgba(201,168,76,0.3)' : 'rgba(201,168,76,0.9)',
            fontFamily: 'Raleway, sans-serif', fontWeight: 300, fontSize: 10,
            letterSpacing: '0.35em', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}>
            {loading ? '...' : mode === 'login' ? 'Giriş Yap ⟶' : 'Kayıt Ol ⟶'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ margin: '28px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 300, fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.3em' }}>VEYA</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Google */}
        <button onClick={async () => {
          await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/enter` }
          })
        }} style={{
          width: '100%', padding: '14px', background: 'transparent',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: 'Raleway, sans-serif', fontWeight: 300, fontSize: 10,
          letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'pointer',
          transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
        }}>
          <span>G</span> Google ile Devam Et
        </button>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid rgba(201,168,76,0.15)',
  color: 'rgba(255,255,255,0.85)',
  fontFamily: 'Cormorant Garamond, serif',
  fontSize: 16,
  fontWeight: 300,
  padding: '10px 0',
  outline: 'none',
  caretColor: '#c9a84c',
  letterSpacing: '0.02em',
  boxSizing: 'border-box'
}
