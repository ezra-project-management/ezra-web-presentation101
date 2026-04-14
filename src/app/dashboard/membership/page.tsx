'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Crown, Gift, Star, Phone, Cake, Zap } from 'lucide-react'
import CountUp from 'react-countup'
import { toast } from 'sonner'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'
import {
  CURRENT_USER,
  LOYALTY_HISTORY,
  LOYALTY_TIER_PREMIUM_POINTS,
  LOYALTY_TIER_VIP_POINTS,
} from '@/lib/dashboard-data'

/** Executive-facing labels; tier ids stay BASIC / PREMIUM / VIP in data. */
const tierLabel = (id: 'BASIC' | 'PREMIUM' | 'VIP') =>
  (
    {
      BASIC: 'Foundation',
      PREMIUM: 'Executive',
      VIP: 'Signature',
    } as const
  )[id]

const tiers = [
  { id: 'BASIC' as const, threshold: 0, color: 'bg-[#8a8679]' },
  { id: 'PREMIUM' as const, threshold: LOYALTY_TIER_PREMIUM_POINTS, color: 'bg-[#b89c6a]' },
  { id: 'VIP' as const, threshold: LOYALTY_TIER_VIP_POINTS, color: 'bg-[#d4b98a]' },
]

const premiumBenefits = [
  {
    icon: Gift,
    title: 'Preferred pricing',
    description: 'A standing allowance on qualifying bookings — applied quietly, without codes.',
  },
  {
    icon: Star,
    title: 'First access to new availability',
    description: 'Reserve before slots open to the general list.',
  },
  {
    icon: Cake,
    title: 'Anniversary recognition',
    description: 'Bonus points in your birthday month, with our compliments.',
  },
  {
    icon: Phone,
    title: 'Direct concierge line',
    description: 'WhatsApp to our team — discreet, human, and prompt.',
  },
]

const earnMethods = [
  { action: 'Every KSh 100 on property', points: '1 point' },
  { action: 'Thoughtful review after your visit', points: '+50' },
  { action: 'Introduce a guest', points: '+200' },
  { action: 'Birthday month', points: 'Double accrual' },
]

const pointTypeColors: Record<string, string> = {
  earn: 'text-emerald-300',
  deduct: 'text-red-300',
  bonus: 'text-[#d4b98a]',
  redeem: 'text-purple-300',
}

const pointTypeBg: Record<string, string> = {
  earn: 'bg-emerald-500/15',
  deduct: 'bg-red-500/15',
  bonus: 'bg-[#b89c6a]/15',
  redeem: 'bg-purple-500/15',
}

type TierId = 'BASIC' | 'PREMIUM' | 'VIP'

const plans: {
  id: TierId
  name: string
  subtitle: string
  priceLine: string
  bullets: string[]
}[] = [
  {
    id: 'BASIC',
    name: 'Foundation',
    subtitle: 'Where every membership begins',
    priceLine: 'No annual fee',
    bullets: [
      'Earn points on each visit',
      'Timely reminders and member updates',
      'Standard booking and cancellation terms',
    ],
  },
  {
    id: 'PREMIUM',
    name: 'Executive',
    subtitle: 'Refined access for regular guests',
    priceLine: `KSh 3,500 / year, or ${LOYALTY_TIER_PREMIUM_POINTS.toLocaleString()}+ points`,
    bullets: [
      'Everything in Foundation',
      '10% off qualifying bookings',
      'Early access to new slots',
      'Birthday bonus points',
      'Concierge WhatsApp line',
    ],
  },
  {
    id: 'VIP',
    name: 'Signature',
    subtitle: 'Our most considered experience',
    priceLine: `KSh 9,500 / year, or ${LOYALTY_TIER_VIP_POINTS.toLocaleString()}+ points`,
    bullets: [
      'Everything in Executive',
      'Priority consideration for same-day requests',
      'First notice on events and new services',
      'Dedicated channel for changes and requests',
    ],
  },
]

function tierDisplayName(id: TierId): string {
  return tierLabel(id)
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 my-8">
      <div className="h-px flex-1 bg-[rgba(184,156,106,0.2)]" />
      <span className="text-[0.68rem] tracking-[0.2em] uppercase text-[#8a8679] whitespace-nowrap">{label}</span>
      <div className="h-px flex-1 bg-[rgba(184,156,106,0.2)]" />
    </div>
  )
}

export default function MembershipPage() {
  const current = CURRENT_USER.loyaltyTier as TierId
  const progressPercent = Math.min(100, (CURRENT_USER.loyaltyPoints / LOYALTY_TIER_VIP_POINTS) * 100)
  const nextTierName = tierLabel(CURRENT_USER.nextTier)

  const benefitsHeading =
    current === 'VIP'
      ? 'Signature member privileges'
      : current === 'PREMIUM'
        ? 'Executive member privileges'
        : 'Foundation member privileges'

  const handleUpgrade = (target: TierId) => {
    if (target === current) {
      toast.message('This is already your tier.')
      return
    }
    const order: TierId[] = ['BASIC', 'PREMIUM', 'VIP']
    if (order.indexOf(target) <= order.indexOf(current)) {
      toast.message('You are already at or above this level.')
      return
    }
    toast.success('Request received. We will confirm your upgrade by SMS or WhatsApp shortly.')
  }

  const shell = 'rounded-2xl border border-[rgba(184,156,106,0.2)] bg-[#1a1916]'

  return (
    <div className="rounded-3xl overflow-hidden border border-[rgba(184,156,106,0.15)] bg-[#0e0d0b] shadow-[0_12px_48px_rgba(0,0,0,0.4)]">
      {/* Hero */}
      <AnimatedSection className="relative text-center px-6 lg:px-12 pt-10 pb-12 border-b border-[rgba(184,156,106,0.15)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(184,156,106,0.08),transparent_70%)]"
          aria-hidden
        />
        <p className="relative text-[0.7rem] tracking-[0.25em] uppercase text-[#b89c6a] mb-4 font-sans">
          Ezra Center · Membership
        </p>
        <h1 className="relative font-display text-[clamp(2rem,5vw,3.25rem)] font-light leading-[1.1] text-[#f5f2eb]">
          Become a{' '}
          <span className="italic text-[#d4b98a]">Member</span>
          <br />
          of Ezra Center
        </h1>
        <p className="relative mt-5 font-sans text-sm text-[#8a8679] max-w-md mx-auto leading-relaxed font-light">
          Three considered levels. Earn as you visit, or step up when you wish — always with quiet, consistent care.
        </p>
      </AnimatedSection>

      <div className="px-5 lg:px-10 py-8 lg:py-10 space-y-10">
        {/* Membership Card */}
        <AnimatedSection delay={0.06}>
          <div className="flex justify-center">
            <div
              className={cn(
                'relative w-full max-w-md aspect-[1.6/1] rounded-sm overflow-hidden p-6 flex flex-col justify-between',
                'bg-gradient-to-br from-[#1a1916] via-[#141311] to-[#0e0d0b] border border-[rgba(184,156,106,0.25)]',
                'shadow-[0_8px_32px_rgba(0,0,0,0.45)]'
              )}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#b89c6a]/[0.07] to-transparent animate-shimmer" />
              </div>
              <div className="absolute top-6 right-16 w-10 h-7 rounded-sm bg-gradient-to-br from-[#b89c6a]/50 to-[#b89c6a]/15 border border-[#b89c6a]/35" />
              <div className="relative z-10 flex items-start justify-between">
                <Image
                  src="/ezralogo.jpeg"
                  alt="Ezra Center"
                  width={48}
                  height={48}
                  className="rounded-full object-cover ring-1 ring-[rgba(184,156,106,0.3)]"
                />
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#b89c6a]/15 border border-[#b89c6a]/35">
                  <Crown className="w-3.5 h-3.5 text-[#d4b98a]" />
                  <span className="font-sans text-[0.65rem] font-semibold text-[#d4b98a] tracking-[0.12em] uppercase">
                    {tierDisplayName(current)}
                  </span>
                </span>
              </div>
              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <p className="font-display text-[#f5f2eb] text-xl font-medium tracking-tight">
                    {CURRENT_USER.firstName} {CURRENT_USER.lastName}
                  </p>
                  <p className="font-sans text-[#8a8679] text-xs mt-1 tracking-wide">Member since {CURRENT_USER.memberSince}</p>
                </div>
                <p className="font-display text-[#b89c6a] text-2xl font-light tabular-nums">
                  <CountUp end={CURRENT_USER.loyaltyPoints} duration={1.5} separator="," />
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <SectionDivider label="Membership levels" />

        {/* Choose your level */}
        <AnimatedSection delay={0.1}>
          <div className={cn(shell, 'p-6 lg:p-8')}>
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.25em] text-[#b89c6a] mb-2">Choose your level</p>
            <p className="font-sans text-sm text-[#8a8679] mb-8 max-w-2xl leading-relaxed font-light">
              Select an annual plan for immediate tier benefits, or continue visiting — points advance you with grace.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => {
                const isCurrent = plan.id === current
                const isHigher =
                  ['BASIC', 'PREMIUM', 'VIP'].indexOf(plan.id) > ['BASIC', 'PREMIUM', 'VIP'].indexOf(current)
                return (
                  <div
                    key={plan.id}
                    className={cn(
                      'rounded-sm border p-5 flex flex-col h-full transition-all duration-300 relative',
                      isCurrent
                        ? 'border-[#b89c6a] bg-[rgba(184,156,106,0.06)] shadow-[0_0_0_1px_rgba(184,156,106,0.15)]'
                        : 'border-[rgba(184,156,106,0.2)] bg-[#242320] hover:border-[#b89c6a]/60'
                    )}
                  >
                    {isCurrent && (
                      <span
                        className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#b89c6a] text-[#0e0d0b] text-xs font-bold flex items-center justify-center"
                        aria-hidden
                      >
                        ✓
                      </span>
                    )}
                    <p className="font-display text-lg font-medium text-[#f5f2eb] pr-8">{plan.name}</p>
                    <p className="font-sans text-xs text-[#8a8679] mt-1 leading-relaxed">{plan.subtitle}</p>
                    <p className="font-display text-base font-light text-[#b89c6a] mt-4">{plan.priceLine}</p>
                    <ul className="mt-4 space-y-2 flex-1">
                      {plan.bullets.map((b) => (
                        <li key={b} className="flex gap-2 font-sans text-[0.78rem] text-[#8a8679] leading-snug">
                          <span className="text-[#b89c6a] shrink-0 mt-0.5">—</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      disabled={isCurrent || !isHigher}
                      onClick={() => handleUpgrade(plan.id)}
                      className={cn(
                        'mt-6 w-full py-2.5 rounded-sm font-sans text-[0.78rem] font-medium tracking-[0.1em] uppercase transition-all',
                        isCurrent
                          ? 'bg-[#242320] text-[#8a8679]/60 cursor-default border border-[rgba(184,156,106,0.15)]'
                          : !isHigher
                            ? 'bg-[#1a1916] text-[#8a8679]/40 cursor-not-allowed border border-[rgba(184,156,106,0.1)]'
                            : 'bg-[#b89c6a] text-[#0e0d0b] hover:bg-[#d4b98a] shadow-[0_4px_24px_rgba(184,156,106,0.2)]'
                      )}
                    >
                      {isCurrent ? 'Your current plan' : !isHigher ? 'Included in your tier' : `Request ${plan.name}`}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </AnimatedSection>

        {/* Tier Progress */}
        <AnimatedSection delay={0.14}>
          <div className={cn(shell, 'p-6 lg:p-8')}>
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.25em] text-[#b89c6a] mb-6">Your journey</p>
            <div className="relative">
              <div className="h-2 rounded-full overflow-hidden bg-[#242320] border border-[rgba(184,156,106,0.12)]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#8a6f3a] to-[#b89c6a]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div className="flex justify-between mt-4 gap-2">
                {tiers.map((tier) => {
                  const isActive = CURRENT_USER.loyaltyPoints >= tier.threshold
                  const isCurrentTier = tier.id === CURRENT_USER.loyaltyTier
                  return (
                    <div key={tier.id} className="flex flex-col items-center max-w-[100px]">
                      <div
                        className={cn(
                          'w-3.5 h-3.5 rounded-full border-2 transition-all',
                          isCurrentTier
                            ? 'border-[#b89c6a] bg-[#b89c6a] scale-125 shadow-[0_0_12px_rgba(184,156,106,0.35)]'
                            : isActive
                              ? `border-[#b89c6a] ${tier.color}`
                              : 'border-[#4a473f] bg-[#242320]'
                        )}
                      />
                      <p
                        className={cn(
                          'font-sans text-[0.7rem] mt-2 text-center leading-tight',
                          isCurrentTier ? 'text-[#f5f2eb] font-semibold' : isActive ? 'text-[#e8e4da]' : 'text-[#5c5950]'
                        )}
                      >
                        {tierLabel(tier.id)}
                      </p>
                      <p className="font-sans text-[10px] text-[#8a8679] mt-0.5">{tier.threshold.toLocaleString()} pts</p>
                    </div>
                  )
                })}
              </div>
            </div>
            <p className="mt-8 text-center font-sans text-sm text-[#8a8679] font-light">
              <span className="font-medium text-[#d4b98a]">{CURRENT_USER.pointsToNextTier.toLocaleString()}</span> points to{' '}
              {nextTierName}
            </p>
          </div>
        </AnimatedSection>

        {/* Benefits */}
        <AnimatedSection delay={0.2}>
          <div className={cn(shell, 'p-6 lg:p-8')}>
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.25em] text-[#b89c6a] mb-6">{benefitsHeading}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {premiumBenefits.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.06 }}
                  className="flex items-start gap-3 p-4 rounded-sm bg-[rgba(184,156,106,0.04)] border border-[rgba(184,156,106,0.15)]"
                >
                  <div className="w-10 h-10 rounded-full bg-[rgba(184,156,106,0.1)] flex items-center justify-center shrink-0 border border-[rgba(184,156,106,0.15)]">
                    <benefit.icon className="w-5 h-5 text-[#d4b98a]" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-medium text-[#f5f2eb]">{benefit.title}</p>
                    <p className="font-sans text-xs text-[#8a8679] mt-1 leading-relaxed">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Earn & Redeem */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatedSection delay={0.26}>
            <div className={cn(shell, 'p-6 h-full')}>
              <p className="font-sans text-[0.7rem] uppercase tracking-[0.25em] text-[#b89c6a] mb-4">Earn points</p>
              <div className="space-y-0">
                {earnMethods.map((method) => (
                  <div
                    key={method.action}
                    className="flex items-center justify-between py-3 border-b border-[rgba(184,156,106,0.12)] last:border-0"
                  >
                    <span className="font-sans text-sm text-[#8a8679] font-light">{method.action}</span>
                    <span className="font-sans text-sm font-medium text-[#d4b98a]">{method.points}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className={cn(shell, 'p-6 h-full flex flex-col')}>
              <p className="font-sans text-[0.7rem] uppercase tracking-[0.25em] text-[#b89c6a] mb-4">Redeem</p>
              <div className="p-4 rounded-sm bg-[rgba(184,156,106,0.05)] border border-[rgba(184,156,106,0.15)] mb-4 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-[#d4b98a]" />
                  <span className="font-sans text-sm font-medium text-[#f5f2eb]">500 points = KSh 500</span>
                </div>
                <p className="font-sans text-xs text-[#8a8679]">Applicable across bookings and services.</p>
              </div>
              <button
                type="button"
                className="w-full py-3 bg-[#b89c6a] text-[#0e0d0b] font-sans font-medium text-[0.78rem] tracking-[0.12em] uppercase rounded-sm hover:bg-[#d4b98a] transition-all shadow-[0_4px_20px_rgba(184,156,106,0.15)]"
              >
                Redeem points
              </button>
            </div>
          </AnimatedSection>
        </div>

        {/* Points History */}
        <AnimatedSection delay={0.34}>
          <div className={cn(shell, 'p-6 lg:p-8')}>
            <p className="font-sans text-[0.7rem] uppercase tracking-[0.25em] text-[#b89c6a] mb-6">Points history</p>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="w-full min-w-[520px]">
                <thead>
                  <tr className="border-b border-[rgba(184,156,106,0.15)]">
                    <th className="text-left font-sans text-[0.65rem] uppercase tracking-[0.15em] text-[#8a8679] pb-3 font-medium">
                      Date
                    </th>
                    <th className="text-left font-sans text-[0.65rem] uppercase tracking-[0.15em] text-[#8a8679] pb-3 font-medium">
                      Description
                    </th>
                    <th className="text-right font-sans text-[0.65rem] uppercase tracking-[0.15em] text-[#8a8679] pb-3 font-medium">
                      Points
                    </th>
                    <th className="text-right font-sans text-[0.65rem] uppercase tracking-[0.15em] text-[#8a8679] pb-3 font-medium">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {LOYALTY_HISTORY.map((entry) => (
                    <tr key={entry.id} className="border-b border-[rgba(184,156,106,0.08)] last:border-0">
                      <td className="py-3 font-sans text-sm text-[#8a8679]">
                        {new Date(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="py-3 font-sans text-sm text-[#e8e4da]">{entry.description}</td>
                      <td className="py-3 text-right">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            pointTypeBg[entry.type],
                            pointTypeColors[entry.type]
                          )}
                        >
                          {entry.points > 0 ? '+' : ''}
                          {entry.points}
                        </span>
                      </td>
                      <td className="py-3 text-right font-sans text-sm font-medium text-[#f5f2eb] tabular-nums">
                        {entry.balance.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
