'use client'

import { useEffect, useCallback } from 'react'

export function useKeyPress(
  key: string,
  callback: (event: KeyboardEvent) => void,
  deps: unknown[] = []
) {
  const handler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === key) {
        callback(event)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, ...deps]
  )

  useEffect(() => {
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handler])
}

export function useCtrlEnter(callback: () => void, deps: unknown[] = []) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        callback()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
