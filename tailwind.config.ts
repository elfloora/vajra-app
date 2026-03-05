import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#020408',
        'void-deep': '#010206',
        'void-surface': '#0a0f1a',
        'void-elevated': '#0f1520',
        'neon-cyan': '#00f5ff',
        'neon-violet': '#bf00ff',
        'neon-rose': '#ff0080',
        'neon-amber': '#ffaa00',
        'ghost-white': 'rgba(255,255,255,0.06)',
        'ghost-border': 'rgba(255,255,255,0.08)',
        'ghost-text': 'rgba(255,255,255,0.45)',
        'ghost-subtle': 'rgba(255,255,255,0.15)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      animation: {
        'glitch': 'glitch 3s infinite',
        'glitch-2': 'glitch2 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'breathe': 'breathe 6s ease-in-out infinite',
        'data-flow': 'dataflow 20s linear infinite',
        'orb-float': 'orbfloat 8s ease-in-out infinite',
        'fade-in-up': 'fadeinup 0.8s ease forwards',
        'cursor-blink': 'cursorblink 1.2s step-end infinite',
      },
      keyframes: {
        glitch: {
          '0%, 90%, 100%': { transform: 'translate(0)', clipPath: 'none', opacity: '1' },
          '92%': { transform: 'translate(-2px, 1px)', clipPath: 'polygon(0 20%, 100% 20%, 100% 40%, 0 40%)', opacity: '0.8' },
          '94%': { transform: 'translate(2px, -1px)', clipPath: 'polygon(0 60%, 100% 60%, 100% 80%, 0 80%)', opacity: '0.9' },
          '96%': { transform: 'translate(0)', clipPath: 'none', opacity: '1' },
        },
        glitch2: {
          '0%, 88%, 100%': { transform: 'translate(0)', opacity: '0' },
          '90%': { transform: 'translate(3px, -2px)', opacity: '0.4', clipPath: 'polygon(0 30%, 100% 30%, 100% 50%, 0 50%)' },
          '92%': { transform: 'translate(-3px, 2px)', opacity: '0.3', clipPath: 'polygon(0 70%, 100% 70%, 100% 90%, 0 90%)' },
          '94%': { transform: 'translate(0)', opacity: '0' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        dataflow: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        orbfloat: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-20px) translateX(10px)' },
          '50%': { transform: 'translateY(-10px) translateX(-5px)' },
          '75%': { transform: 'translateY(-25px) translateX(5px)' },
        },
        fadeinup: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        cursorblink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      backgroundImage: {
        'cosmic': 'radial-gradient(ellipse at 20% 20%, rgba(0,245,255,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(191,0,255,0.04) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(255,0,128,0.02) 0%, transparent 70%)',
        'grid-subtle': 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        'neon-glow-cyan': 'radial-gradient(ellipse at center, rgba(0,245,255,0.15) 0%, transparent 70%)',
        'neon-glow-violet': 'radial-gradient(ellipse at center, rgba(191,0,255,0.15) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0,245,255,0.3), 0 0 60px rgba(0,245,255,0.1)',
        'neon-violet': '0 0 20px rgba(191,0,255,0.3), 0 0 60px rgba(191,0,255,0.1)',
        'neon-rose': '0 0 20px rgba(255,0,128,0.3), 0 0 60px rgba(255,0,128,0.1)',
        'inner-glow': 'inset 0 0 30px rgba(0,245,255,0.05)',
      },
    },
  },
  plugins: [],
}

export default config
