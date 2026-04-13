'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Crown, Gift, Star, Phone, Sparkles } from 'lucide-react'
import CountUp from 'react-countup'
import { toast } from 'sonner'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'
import { CURRENT_USER, LOYALTY_HISTORY } from '@/lib/dashboard-data'
import {
  MEMBERSHIP_TIERS,
  MEMBERSHIP_STORAGE_KEY,
  MEMBERSHIP_LABELS,
  getTierById,
  type MembershipTierId,
} from '@/lib/membership-tiers'

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

const rewardsMilestones = [
  { label: 'Welcome', points: 0 },
  { label: 'Regular guest', points: 1500 },
  { label: 'Frequent visitor', points: 3000 },
  { label: 'Inner circle', points: 5000 },
]

function tierOrder(id: MembershipTierId): number {
  return id === 'basic' ? 0 : id === 'premium' ? 1 : 2
}

export default function MembershipPage() {
  const [storedTier, setStoredTier] = useState<MembershipTierId | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MEMBERSHIP_STORAGE_KEY)
      if (raw === 'basic' || raw === 'premium' || raw === 'vip') setStoredTier(raw)
    } catch {
      /* ignore */
    }
  }, [])

  const activeTierId: MembershipTierId = storedTier ?? CURRENT_USER.membershipTierId
  const activeTier = getTierById(activeTierId)
  const progressPercent = Math.min(100, (CURRENT_USER.loyaltyPoints / 5000) * 100)

  const selectPlan = (id: MembershipTierId) => {
    if (id === activeTierId) return
    try {
      localStorage.setItem(MEMBERSHIP_STORAGE_KEY, id)
    } catch {
      /* ignore */
    }
    setStoredTier(id)
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ezra-membership-change', { detail: { tier: id } }))
    }
    toast.success(
      id === 'basic'
        ? 'Basic is yours — simple booking and rewards on every visit.'
        : `We’ve noted ${MEMBERSHIP_LABELS[id]} for you. Our team will confirm the details within one business day.`,
    )
  }

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-gold-dark/90">Membership</p>
        <h1 className="font-display text-2xl lg:text-3xl text-navy font-semibold mt-2">
          Stay a little longer in the good part
        </h1>
        <p className="font-sans text-sm text-charcoal/55 mt-2 max-w-xl leading-relaxed">
          Pick the level of care that fits your rhythm. Every tier includes honest perks — priority where it counts, and people who remember how you like things.
        </p>
        <Link
          href="/services"
          className="inline-flex mt-4 font-sans text-sm font-medium text-gold hover:text-gold-dark transition-colors"
        >
          Book something wonderful →
        </Link>
      </AnimatedSection>

      {/* Current card */}
      <AnimatedSection delay={0.06}>
        <div className="flex justify-center">
          <div
            className={cn(
              'relative w-full max-w-md aspect-[1.6/1] rounded-2xl overflow-hidden p-6 flex flex-col justify-between shadow-xl border',
              activeTierId === 'vip'
                ? 'bg-gradient-to-br from-navy via-navy-light to-navy-dark border-gold/40'
                : 'bg-gradient-to-br from-[#1A3C5E] via-navy to-[#0A1F33] border-white/10',
            )}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent animate-shimmer" />
            </div>
            <div className="absolute top-6 right-20 w-10 h-7 rounded-md bg-gradient-to-br from-gold/40 to-gold/20 border border-gold/30" />

            <div className="relative z-10 flex items-start justify-between">
              <Image src="/ezralogo.jpeg" alt="Ezra Center" width={48} height={48} className="rounded-full object-cover" />
              <span
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-sans text-xs font-bold uppercase tracking-wide',
                  activeTier.badgeClass,
                )}
              >
                <Crown className="w-3.5 h-3.5" />
                {MEMBERSHIP_LABELS[activeTierId]}
              </span>
            </div>

            <div className="relative z-10 flex items-end justify-between gap-4">
              <div>
                <p className={cn('font-display text-xl font-semibold', activeTierId === 'vip' ? 'text-white' : 'text-white')}>
                  {CURRENT_USER.firstName} {CURRENT_USER.lastName}
                </p>
                <p className={cn('font-sans text-xs mt-0.5', activeTierId === 'vip' ? 'text-white/55' : 'text-white/50')}>
                  Member since {CURRENT_USER.memberSince}
                </p>
              </div>
              <div className="text-right">
                <p className={cn('font-sans text-[10px] uppercase tracking-wider', activeTierId === 'vip' ? 'text-white/45' : 'text-white/45')}>
                  Rewards balance
                </p>
                <p className={cn('font-display text-2xl font-bold', activeTierId === 'vip' ? 'text-gold' : 'text-gold')}>
                  <CountUp end={CURRENT_USER.loyaltyPoints} duration={1.2} separator="," />
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Tier pickers */}
      <AnimatedSection delay={0.1}>
        <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal/40 mb-4">Choose your plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MEMBERSHIP_TIERS.map((tier) => {
            const isCurrent = tier.id === activeTierId
            return (
              <motion.div
                key={tier.id}
                layout
                className={cn(
                  'rounded-2xl p-6 flex flex-col h-full shadow-card transition-shadow duration-300',
                  tier.cardClass,
                  tier.id === 'vip' && 'text-white',
                  isCurrent && 'ring-2 ring-gold/50 shadow-gold/20',
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div>
                    <p className={cn('font-display text-xl font-semibold', tier.id === 'vip' ? 'text-white' : 'text-navy')}>
                      {tier.name}
                    </p>
                    <p className={cn('font-sans text-xs mt-1 leading-relaxed', tier.id === 'vip' ? 'text-white/65' : 'text-charcoal/55')}>
                      {tier.tagline}
                    </p>
                  </div>
                  {isCurrent && (
                    <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gold/25 text-gold border border-gold/40">
                      Current
                    </span>
                  )}
                </div>
                <p className={cn('font-sans text-sm font-medium mb-5', tier.id === 'vip' ? 'text-gold-light' : 'text-gold-dark')}>
                  {tier.priceNote}
                </p>
                <ul className="space-y-3 flex-1 mb-6">
                  {tier.benefits.map((b) => (
                    <li key={b.text} className="flex gap-2.5">
                      <span
                        className={cn(
                          'mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0',
                          tier.id === 'vip' ? 'bg-gold/20 text-gold' : b.highlight ? 'bg-gold/20 text-navy' : 'bg-navy/8 text-navy',
                        )}
                      >
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                      <span className={cn('font-sans text-sm leading-snug', tier.id === 'vip' ? 'text-white/85' : 'text-charcoal/75')}>
                        {b.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  disabled={isCurrent}
                  onClick={() => selectPlan(tier.id)}
                  className={cn(
                    'w-full py-3 rounded-xl font-sans font-semibold text-sm transition-all duration-300',
                    isCurrent &&
                      (tier.id === 'vip'
                        ? 'bg-white/10 text-white border border-white/25 cursor-not-allowed opacity-95'
                        : 'bg-navy/10 text-navy border border-navy/15 cursor-not-allowed opacity-90'),
                    !isCurrent &&
                      (tier.id === 'vip'
                        ? 'bg-gold text-navy-dark hover:bg-gold-light shadow-gold'
                        : 'bg-navy text-white hover:bg-navy-light'),
                  )}
                >
                  {isCurrent
                    ? 'Your plan'
                    : tierOrder(tier.id) < tierOrder(activeTierId)
                    ? `Switch to ${tier.name}`
                    : tierOrder(tier.id) > tierOrder(activeTierId)
                    ? `Upgrade to ${tier.name}`
                    : `Choose ${tier.name}`}
                </button>
              </motion.div>
            )
          })}
        </div>
        <p className="font-sans text-xs text-charcoal/45 mt-4 text-center max-w-lg mx-auto leading-relaxed">
          Upgrades here update what you see in the app; our front desk finalises payment and dates. Questions?{' '}
          <Link href="/contact" className="text-gold font-medium hover:underline">
            We’re one message away
          </Link>
          .
        </p>
      </AnimatedSection>

      {/* Rewards progress */}
      <AnimatedSection delay={0.14}>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
          <div className="flex items-start gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <div>
              <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal/40">Rewards</h3>
              <p className="font-sans text-sm text-charcoal/60 mt-1 leading-relaxed">
                Points stack on top of your membership — use them for savings whenever you like.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="h-3 bg-charcoal/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <div className="flex justify-between mt-3 gap-1">
              {rewardsMilestones.map((m) => (
                <div key={m.label} className="flex flex-col items-center text-center max-w-[4.5rem] sm:max-w-none">
                  <p
                    className={cn(
                      'font-sans text-[10px] sm:text-xs',
                      CURRENT_USER.loyaltyPoints >= m.points ? 'text-navy font-semibold' : 'text-charcoal/35',
                    )}
                  >
                    {m.label}
                  </p>
                  <p className="font-sans text-[9px] text-charcoal/30">{m.points.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Cross-benefits */}
      <AnimatedSection delay={0.18}>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
          <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal/40 mb-6">Little things that add up</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Gift, title: 'Birthday month', description: 'Bonus points and a small treat from our team.' },
              { icon: Star, title: 'Early access', description: 'Premium and VIP see new slots before everyone else.' },
              { icon: Phone, title: 'A real line to us', description: 'WhatsApp or call — no bots, no runaround.' },
            ].map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.2 + i * 0.06 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/80 border border-charcoal/5"
              >
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5 text-gold-dark" />
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-navy">{b.title}</p>
                  <p className="font-sans text-xs text-charcoal/50 mt-0.5 leading-relaxed">{b.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatedSection delay={0.22}>
          <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 h-full">
            <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal/40 mb-4">Earn points</h3>
            <div className="space-y-3">
              {[
                { action: 'Every KES 100 you spend with us', points: '1 point' },
                { action: 'Tell us how your visit went', points: '+50 points' },
                { action: 'Bring someone new through the door', points: '+200 points' },
                { action: 'Visit during your birthday month', points: 'Double points' },
              ].map((row) => (
                <div key={row.action} className="flex items-center justify-between py-2 border-b border-charcoal/5 last:border-0 gap-3">
                  <span className="font-sans text-sm text-charcoal/70">{row.action}</span>
                  <span className="font-sans text-sm font-semibold text-gold-dark shrink-0">{row.points}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.26}>
          <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 h-full">
            <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal/40 mb-4">Use points</h3>
            <div className="p-4 rounded-xl bg-navy/5 mb-4">
              <p className="font-sans text-sm font-medium text-navy">500 points → KES 500 off</p>
              <p className="font-sans text-xs text-charcoal/50 mt-1">Any booking, any service you love.</p>
            </div>
            <button
              type="button"
              className="w-full py-3 bg-gold text-navy font-sans font-semibold text-sm rounded-xl hover:bg-gold-light transition-all duration-300 shadow-md hover:shadow-gold"
            >
              Redeem points
            </button>
          </div>
        </AnimatedSection>
      </div>

      <AnimatedSection delay={0.3}>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
          <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal/40 mb-6">Points history</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-charcoal/10">
                  <th className="text-left font-sans text-xs uppercase tracking-widest text-charcoal/40 pb-3">Date</th>
                  <th className="text-left font-sans text-xs uppercase tracking-widest text-charcoal/40 pb-3">Note</th>
                  <th className="text-right font-sans text-xs uppercase tracking-widest text-charcoal/40 pb-3">Points</th>
                  <th className="text-right font-sans text-xs uppercase tracking-widest text-charcoal/40 pb-3">Balance</th>
                </tr>
              </thead>
              <tbody>
                {LOYALTY_HISTORY.map((entry) => (
                  <tr key={entry.id} className="border-b border-charcoal/5 last:border-0">
                    <td className="py-3 font-sans text-sm text-charcoal/50">
                      {new Date(entry.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="py-3 font-sans text-sm text-navy">{entry.description}</td>
                    <td className="py-3 text-right">
                      <span
                        className={cn(
                          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                          pointTypeBg[entry.type],
                          pointTypeColors[entry.type],
                        )}
                      >
                        {entry.points > 0 ? '+' : ''}
                        {entry.points}
                      </span>
                    </td>
                    <td className="py-3 text-right font-sans text-sm font-medium text-navy">{entry.balance.toLocaleString()}</td>
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
