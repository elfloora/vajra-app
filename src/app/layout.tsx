import type { Metadata } from 'next'
import { Cinzel, Cormorant_Garamond, Raleway } from 'next/font/google'
import '@/styles/globals.css'

const displayFont = Cinzel({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-display',
})

const bodyFont = Cormorant_Garamond({
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-body',
})

const monoFont = Raleway({
  weight: ['300', '400'],
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'VAJRA',
  description: 'İllüzyonu kes. Gerçeği gör. Taahhüt et.',
  keywords: ['consciousness', 'self-inquiry', 'vajra', 'protocol'],
  openGraph: {
    title: 'VAJRA',
    description: 'Consciousness Protocol',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr" className="dark">
      <body
        className={`${displayFont.variable} ${monoFont.variable} ${bodyFont.variable} font-body bg-void text-white antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
