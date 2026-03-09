'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './Footer'

export function ConditionalFooter() {
  const pathname = usePathname()
  const hide = pathname.startsWith('/auth') || pathname.startsWith('/dashboard')
  if (hide) return null
  return <Footer />
}
