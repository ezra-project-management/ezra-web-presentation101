'use client'

import { useEffect, useState } from 'react'
import { isWebSessionLoggedIn } from '@/lib/web-session'

export function useWebLoggedIn() {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(isWebSessionLoggedIn())
    const sync = () => setLoggedIn(isWebSessionLoggedIn())
    window.addEventListener('storage', sync)
    window.addEventListener('ezra-web-session', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('ezra-web-session', sync)
    }
  }, [])

  return loggedIn
}
