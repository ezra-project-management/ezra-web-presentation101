'use client'

import { useEffect, useState } from 'react'
import { CURRENT_USER } from '@/lib/dashboard-data'
import {
  MEMBERSHIP_LABELS,
  MEMBERSHIP_STORAGE_KEY,
  type MembershipTierId,
} from '@/lib/membership-tiers'

function storedTier(): MembershipTierId | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(MEMBERSHIP_STORAGE_KEY)
    if (raw === 'basic' || raw === 'premium' || raw === 'vip') return raw
  } catch {
    /* ignore */
  }
  return null
}

/** Label for nav / profile; stays in sync with membership page + localStorage. */
export function useMembershipTierLabel(pathname: string) {
  const [label, setLabel] = useState(MEMBERSHIP_LABELS[CURRENT_USER.membershipTierId])

  useEffect(() => {
    setLabel(MEMBERSHIP_LABELS[storedTier() ?? CURRENT_USER.membershipTierId])
  }, [pathname])

  useEffect(() => {
    const onTier = (e: Event) => {
      const tier = (e as CustomEvent<{ tier: MembershipTierId }>).detail?.tier
      if (tier && MEMBERSHIP_LABELS[tier]) setLabel(MEMBERSHIP_LABELS[tier])
    }
    window.addEventListener('ezra-membership-change', onTier)
    return () => window.removeEventListener('ezra-membership-change', onTier)
  }, [])

  return label
}
