'use client'

import { useState, useEffect, useRef } from 'react'

interface TypewriterOptions {
  speed?: number
  onComplete?: () => void
  startDelay?: number
}

export function useTypewriter(
  text: string,
  options: TypewriterOptions = {}
): { displayText: string; isComplete: boolean; reset: () => void } {
  const { speed = 28, onComplete, startDelay = 0 } = options
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const indexRef = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const reset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    indexRef.current = 0
    setDisplayText('')
    setIsComplete(false)
  }

  useEffect(() => {
    reset()

    const startTyping = () => {
      const tick = () => {
        if (indexRef.current < text.length) {
          const char = text[indexRef.current]
          setDisplayText((prev) => prev + char)
          indexRef.current++

          // Variable speed for natural feel
          const nextSpeed = char === '.' || char === ',' || char === '—'
            ? speed * 8
            : char === ' '
            ? speed * 0.5
            : speed + (Math.random() * 10 - 5)

          timeoutRef.current = setTimeout(tick, nextSpeed)
        } else {
          setIsComplete(true)
          onComplete?.()
        }
      }
      timeoutRef.current = setTimeout(tick, 0)
    }

    const delayTimeout = setTimeout(startTyping, startDelay)

    return () => {
      clearTimeout(delayTimeout)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return { displayText, isComplete, reset }
}
