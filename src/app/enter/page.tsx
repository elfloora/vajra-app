'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSessionStore } from '@/lib/store/session-store'

const AGREEMENTS = [
  'Optimal değil, dürüstçe cevaplayacağım.',
  'Doğru ya da yanlış cevap olmadığını anlıyorum.',
  'Netliğin bazen rahatsız edici olabileceğini kabul ediyorum.',
]

export default function EnterPage() {
  const [agreedItems, setAgreedItems] = useState<Set<number>>(new Set())
  const [entering, setEntering] = useState(false)
  const router = useRouter()
  const initSession = useSessionStore((s) => s.initSession)

  const toggleAgreement = (index: number) => {
    setAgreedItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const allAgreed = agreedItems.size === AGREEMENTS.length

  const handleEnter = async () => {
    if (!allAgreed) return
    setEntering(true)
    initSession('lucy-core-v1')
    await new Promise((r) => setTimeout(r, 1200))
    router.push('/session')
  }

  return (
    <main style={{ minHeight: '100vh', background: '#07030f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 28px', fontFamily: 'Raleway, sans-serif', position: 'relative' }}>
      {/* Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.25), transparent 70%)', top: -100, left: -100, filter: 'blur(90px)' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.12), transparent 70%)', bottom: -80, right: -60, filter: 'blur(80px)' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 440 }}>
        {/* Back */}
        <Link href="/" style={{ fontFamily: 'Raleway, sans-serif', fontWeight: 300, fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.4em', textTransform: 'uppercase', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 48 }}>
          ← Geri
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontWeight: 300, fontSize: 9, letterSpacing: '0.5em', color: 'rgba(201,168,76,0.5)', textTransform: 'uppercase', marginBottom: 12 }}>
            Protokol Öncesi
          </p>
          <h1 style={{ fontFamily: 'Cinzel, serif', fontWeight: 400, fontSize: 28, color: 'white', marginBottom: 16, letterSpacing: '0.05em' }}>
            Başlamadan önce
          </h1>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8 }}>
            Bu seans içe doğru ilerleyen sorular sorar. Bazı cevaplar — sana bile yabancı gelebilir.
          </p>
        </div>

        {/* What to expect */}
        <div style={{ marginBottom: 40, padding: '20px 24px', background: 'linear-gradient(135deg, rgba(124,58,237,0.06), rgba(201,168,76,0.04))', border: '1px solid rgba(201,168,76,0.1)' }}>
          <p style={{ fontWeight: 300, fontSize: 9, letterSpacing: '0.4em', color: 'rgba(201,168,76,0.5)', textTransform: 'uppercase', marginBottom: 16 }}>
            Bu nedir
          </p>
          {[
            '9 soruluk yapılandırılmış öz-sorgu',
            'Cevaplarında desen tespiti',
            'Nefes aralığı ve AI değerlendirmesi',
            'Seans kapanınca veri silinmez — kaydedilir',
          ].map((item) => (
            <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
              <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: 10, marginTop: 3 }}>✦</span>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Agreements */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontWeight: 300, fontSize: 9, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: 20 }}>
            Devam etmek için onayla
          </p>
          {AGREEMENTS.map((text, i) => (
            <button key={i} onClick={() => toggleAgreement(i)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px 0', textAlign: 'left' }}>
              <div style={{ width: 16, height: 16, border: `1px solid ${agreedItems.has(i) ? 'rgba(201,168,76,0.7)' : 'rgba(255,255,255,0.15)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: agreedItems.has(i) ? 'rgba(201,168,76,0.1)' : 'transparent', transition: 'all 0.2s' }}>
                {agreedItems.has(i) && <span style={{ color: 'rgba(201,168,76,0.9)', fontSize: 9 }}>✓</span>}
              </div>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 15, color: agreedItems.has(i) ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)', lineHeight: 1.6, transition: 'color 0.2s' }}>
                {text}
              </span>
            </button>
          ))}
        </div>

        {/* Enter button */}
        <button onClick={handleEnter} disabled={!allAgreed || entering} style={{
          width: '100%', padding: '15px', background: 'transparent',
          border: `1px solid ${allAgreed ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.08)'}`,
          color: allAgreed ? 'rgba(201,168,76,0.9)' : 'rgba(255,255,255,0.15)',
          fontFamily: 'Raleway, sans-serif', fontWeight: 300, fontSize: 11,
          letterSpacing: '0.35em', textTransform: 'uppercase', cursor: allAgreed ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease'
        }}>
          {entering ? 'Protokole Giriliyor...' : 'Seansa Başla ⟶'}
        </button>
      </div>
    </main>
  )
}
