'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Crown, Gift, Star, Phone, Cake, Zap, Check } from 'lucide-react'
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

const tiers = [
  { id: 'BASIC' as const, name: 'Basic', threshold: 0, color: 'bg-stone-400' },
  { id: 'PREMIUM' as const, name: 'Premium', threshold: LOYALTY_TIER_PREMIUM_POINTS, color: 'bg-gold' },
  { id: 'VIP' as const, name: 'VIP', threshold: LOYALTY_TIER_VIP_POINTS, color: 'bg-navy' },
]

const premiumBenefits = [
  { icon: Gift, title: '10% off every booking', description: 'Your discount applies on its own. No codes to remember.' },
  { icon: Star, title: 'First pick on new slots', description: 'Get 48-hour early access before slots open to everyone.' },
  { icon: Cake, title: 'Birthday treat', description: 'We add 500 bonus points to your account in your birthday month.' },
  { icon: Phone, title: 'Your own WhatsApp line', description: 'Message us directly. A real person will respond.' },
]

const earnMethods = [
  { action: 'Every KES 100 you spend', points: '1 point' },
  { action: 'Leave a review after a visit', points: '50 bonus points' },
  { action: 'Bring a friend along', points: '200 points' },
  { action: 'Your birthday month', points: 'Double points on everything' },
]

const pointTypeColors: Record<string, string> = {
  earn: 'text-emerald-600',
  deduct: 'text-red-500',
  bonus: 'text-gold-dark',
  redeem: 'text-purple-600',
}

const pointTypeBg: Record<string, string> = {
  earn: 'bg-emerald-50',
  deduct: 'bg-red-50',
  bonus: 'bg-gold/10',
  redeem: 'bg-purple-50',
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
    name: 'Basic',
    subtitle: 'Included with your account',
    priceLine: 'No annual fee',
    bullets: [
      'Earn points on every visit',
      'Member updates and reminders',
      'Standard booking and cancellation rules',
    ],
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    subtitle: 'Where most of our regulars land',
    priceLine: `KES 3,500 / year, or reach ${LOYALTY_TIER_PREMIUM_POINTS.toLocaleString()}+ points`,
    bullets: [
      'Everything in Basic',
      '10% off qualifying bookings',
      '48-hour early access to new slots',
      'Birthday bonus points',
      'WhatsApp concierge line',
    ],
  },
  {
    id: 'VIP',
    name: 'VIP',
    subtitle: 'Our warmest welcome',
    priceLine: `KES 9,500 / year, or reach ${LOYALTY_TIER_VIP_POINTS.toLocaleString()}+ points`,
    bullets: [
      'Everything in Premium',
      'Priority holds for same-day requests when possible',
      'First notice on events and new services',
      'Dedicated line for changes and special requests',
    ],
  },
]

function tierDisplayName(id: TierId): string {
  return plans.find((p) => p.id === id)?.name ?? id
}

export default function MembershipPage() {
  const current = CURRENT_USER.loyaltyTier as TierId
  const progressPercent = Math.min(100, (CURRENT_USER.loyaltyPoints / LOYALTY_TIER_VIP_POINTS) * 100)

  const benefitsHeading =
    current === 'VIP'
      ? 'What you enjoy as a VIP member'
      : current === 'PREMIUM'
        ? 'What you enjoy as a Premium member'
        : 'What you enjoy as a Basic member'

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

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <h1 className="font-display text-2xl lg:text-3xl text-navy font-semibold">
          Membership
        </h1>
        <p className="font-sans text-sm text-charcoal/50 mt-1 max-w-xl">
          Three clear levels. Real perks. Earn your way up with visits, or choose an annual plan whenever you are ready.
        </p>
      </AnimatedSection>

      {/* Membership Card */}
      <AnimatedSection delay={0.08}>
        <div className="flex justify-center">
          <div className="relative w-full max-w-md aspect-[1.6/1] rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A3C5E] via-navy to-[#0A1F33] p-6 flex flex-col justify-between shadow-xl">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent animate-shimmer" />
            </div>

            <div className="absolute top-6 right-20 w-10 h-7 rounded-md bg-gradient-to-br from-gold/40 to-gold/20 border border-gold/30" />

            <div className="relative z-10 flex items-start justify-between">
              <Image
                src="/ezralogo.jpeg"
                alt="Ezra Center"
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/20 border border-gold/30">
                <Crown className="w-3.5 h-3.5 text-gold" />
                <span className="font-sans text-xs font-bold text-gold tracking-wide">
                  {tierDisplayName(current).toUpperCase()}
                </span>
              </span>
            </div>

            <div className="relative z-10 flex items-end justify-between">
              <div>
                <p className="font-display text-white text-xl font-semibold">
                  {CURRENT_USER.firstName} {CURRENT_USER.lastName}
                </p>
                <p className="font-sans text-white/50 text-xs mt-0.5">
                  Member since {CURRENT_USER.memberSince}
                </p>
              </div>
              <p className="font-display text-gold text-2xl font-bold">
                <CountUp end={CURRENT_USER.loyaltyPoints} duration={1.5} separator="," />
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Choose your level */}
      <AnimatedSection delay={0.1}>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8 border border-gold/10">
          <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-2">Choose your level</h3>
          <p className="font-sans text-sm text-charcoal/60 mb-6 max-w-2xl">
            Pick an annual plan for instant access, or keep visiting and let points move you up. Either way, you are always welcome.
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
                    'rounded-2xl border p-5 flex flex-col h-full transition-shadow',
                    isCurrent ? 'border-gold bg-gold/5 shadow-md ring-1 ring-gold/20' : 'border-charcoal/10 bg-white hover:border-gold/30'
                  )}
                >
                  <p className="font-display text-lg font-semibold text-navy">{plan.name}</p>
                  <p className="font-sans text-xs text-charcoal/50 mt-0.5">{plan.subtitle}</p>
                  <p className="font-sans text-sm font-medium text-gold-dark mt-3">{plan.priceLine}</p>
                  <ul className="mt-4 space-y-2 flex-1">
                    {plan.bullets.map((b) => (
                      <li key={b} className="flex gap-2 font-sans text-xs text-charcoal/75">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    disabled={isCurrent || !isHigher}
                    onClick={() => handleUpgrade(plan.id)}
                    className={cn(
                      'mt-5 w-full py-2.5 rounded-xl font-sans text-sm font-semibold transition-all',
                      isCurrent
                        ? 'bg-charcoal/10 text-charcoal/50 cursor-default'
                        : !isHigher
                          ? 'bg-charcoal/5 text-charcoal/35 cursor-not-allowed'
                          : 'bg-gold text-navy hover:bg-gold-light shadow-sm'
                    )}
                  >
                    {isCurrent ? 'Your current plan' : !isHigher ? 'Included below your tier' : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Tier Progress */}
      <AnimatedSection delay={0.16}>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
          <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-6">Your journey</h3>

          <div className="relative">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <div className="flex justify-between mt-3">
              {tiers.map((tier) => {
                const isActive = CURRENT_USER.loyaltyPoints >= tier.threshold
                const isCurrentTier = tier.id === CURRENT_USER.loyaltyTier
                return (
                  <div key={tier.id} className="flex flex-col items-center max-w-[100px]">
                    <div
                      className={cn(
                        'w-4 h-4 rounded-full border-2 transition-all',
                        isCurrentTier
                          ? 'border-gold bg-gold scale-125 shadow-gold'
                          : isActive
                            ? `border-gold ${tier.color}`
                            : 'border-gray-200 bg-white'
                      )}
                    />
                    <p
                      className={cn(
                        'font-sans text-xs mt-1 text-center',
                        isCurrentTier ? 'text-navy font-bold' : isActive ? 'text-navy font-medium' : 'text-gray-400'
                      )}
                    >
                      {tier.name}
                    </p>
                    <p className="font-sans text-[10px] text-gray-400">{tier.threshold.toLocaleString()} pts</p>
                  </div>
                )
              })}
            </div>
          </div>

          <p className="mt-6 text-center font-sans text-sm text-charcoal/60">
            <span className="font-semibold text-navy">{CURRENT_USER.pointsToNextTier.toLocaleString()}</span> points to{' '}
            {CURRENT_USER.nextTier}. You are doing great.
          </p>
        </div>
      </AnimatedSection>

      {/* Benefits */}
      <AnimatedSection delay={0.24}>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
          <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-6">{benefitsHeading}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {premiumBenefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-gold/5 border border-gold/10"
              >
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <benefit.icon className="w-5 h-5 text-gold-dark" />
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-navy">{benefit.title}</p>
                  <p className="font-sans text-xs text-gray-400 mt-0.5">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Earn & Redeem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatedSection delay={0.32}>
          <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 h-full">
            <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-4">Ways to earn points</h3>
            <div className="space-y-3">
              {earnMethods.map((method) => (
                <div key={method.action} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="font-sans text-sm text-charcoal/70">{method.action}</span>
                  <span className="font-sans text-sm font-semibold text-gold-dark">{method.points}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.36}>
          <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 h-full">
            <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-4">Use your points</h3>
            <div className="p-4 rounded-xl bg-navy/5 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-gold" />
                <span className="font-sans text-sm font-medium text-navy">500 points = KES 500 off</span>
              </div>
              <p className="font-sans text-xs text-gray-400">Any booking, any service</p>
            </div>
            <button
              type="button"
              className="w-full py-3 bg-gold text-navy font-sans font-semibold text-sm rounded-xl hover:bg-gold-light transition-all duration-300 shadow-md hover:shadow-gold"
            >
              Redeem my points
            </button>
          </div>
        </AnimatedSection>
      </div>

      {/* Points History */}
      <AnimatedSection delay={0.4}>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
          <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-6">Your points history</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left font-sans text-xs uppercase tracking-widest text-gray-400 pb-3">Date</th>
                  <th className="text-left font-sans text-xs uppercase tracking-widest text-gray-400 pb-3">Description</th>
                  <th className="text-right font-sans text-xs uppercase tracking-widest text-gray-400 pb-3">Points</th>
                  <th className="text-right font-sans text-xs uppercase tracking-widest text-gray-400 pb-3">Balance</th>
                </tr>
              </thead>
              <tbody>
                {LOYALTY_HISTORY.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 font-sans text-sm text-gray-500">
                      {new Date(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="py-3 font-sans text-sm text-navy">{entry.description}</td>
                    <td className="py-3 text-right">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                          pointTypeBg[entry.type],
                          pointTypeColors[entry.type]
                        )}
                      >
                        {entry.points > 0 ? '+' : ''}
                        {entry.points}
                      </span>
                    </td>
                    <td className="py-3 text-right font-sans text-sm font-medium text-navy">
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
  )
}
