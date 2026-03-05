import type { Metadata } from 'next'
import { Space_Grotesk, Space_Mono, IM_Fell_English } from 'next/font/google'
import '@/styles/globals.css'

const displayFont = IM_Fell_English({
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
})

const monoFont = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
})

const bodyFont = Space_Grotesk({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Lucy Consciousness Protocol',
  description: 'A structured journey through the architecture of self.',
  keywords: ['consciousness', 'self-inquiry', 'protocol', 'introspection'],
  openGraph: {
    title: 'Lucy Consciousness Protocol',
    description: 'Enter the Protocol.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${displayFont.variable} ${monoFont.variable} ${bodyFont.variable} font-body bg-void text-white antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
