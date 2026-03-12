'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Crown, Gift, Star, Phone, Cake, Zap } from 'lucide-react'
import CountUp from 'react-countup'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'
import { CURRENT_USER, LOYALTY_HISTORY } from '@/lib/dashboard-data'

const tiers = [
  { name: 'Bronze', threshold: 0, color: 'bg-orange-700' },
  { name: 'Silver', threshold: 2500, color: 'bg-gray-400' },
  { name: 'Gold', threshold: 4000, color: 'bg-gold' },
  { name: 'Platinum', threshold: 5000, color: 'bg-navy' },
]

const benefits = [
  { icon: Gift, title: '10% off all bookings', description: 'Automatic discount on every booking' },
  { icon: Star, title: 'Priority booking', description: '48hr advance access to new slots' },
  { icon: Cake, title: 'Birthday bonus', description: '500 points on your birthday month' },
  { icon: Phone, title: 'Dedicated WhatsApp', description: 'Personal concierge line' },
]

const earnMethods = [
  { action: 'Per KES 100 spent', points: '1 point' },
  { action: 'Review a visit', points: '50 bonus points' },
  { action: 'Refer a friend', points: '200 points' },
  { action: 'Birthday month', points: 'Double points' },
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

export default function MembershipPage() {
  const progressPercent = (CURRENT_USER.loyaltyPoints / 5000) * 100

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <h1 className="font-display text-2xl lg:text-3xl text-navy font-semibold">
          Your Membership
        </h1>
      </AnimatedSection>

      {/* Membership Card */}
      <AnimatedSection delay={0.08}>
        <div className="flex justify-center">
          <div className="relative w-full max-w-md aspect-[1.6/1] rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A3C5E] via-navy to-[#0A1F33] p-6 flex flex-col justify-between shadow-xl">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/10 to-transparent animate-shimmer" />
            </div>

            {/* Card chip */}
            <div className="absolute top-6 right-20 w-10 h-7 rounded-md bg-gradient-to-br from-gold/40 to-gold/20 border border-gold/30" />

            <div className="relative z-10 flex items-start justify-between">
              <Image
                src="/ezralogo.jpeg"
                alt="Ezra Annex"
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold/20 border border-gold/30">
                <Crown className="w-3.5 h-3.5 text-gold" />
                <span className="font-sans text-xs font-bold text-gold">GOLD</span>
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

      {/* Tier Progress */}
      <AnimatedSection delay={0.16}>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
          <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-6">Tier Progress</h3>

          <div className="relative">
            {/* Track */}
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            {/* Tier markers */}
            <div className="flex justify-between mt-3">
              {tiers.map((tier) => {
                const isActive = CURRENT_USER.loyaltyPoints >= tier.threshold
                const isCurrent = tier.name.toUpperCase() === CURRENT_USER.loyaltyTier
                return (
                  <div key={tier.name} className="flex flex-col items-center">
                    <div className={cn(
                      'w-4 h-4 rounded-full border-2 transition-all',
                      isCurrent ? 'border-gold bg-gold scale-125 shadow-gold' :
                      isActive ? `border-gold ${tier.color}` : 'border-gray-200 bg-white'
                    )} />
                    <p className={cn(
                      'font-sans text-xs mt-1',
                      isCurrent ? 'text-navy font-bold' : isActive ? 'text-navy font-medium' : 'text-gray-400'
                    )}>
                      {tier.name}
                    </p>
                    <p className="font-sans text-[10px] text-gray-400">{tier.threshold.toLocaleString()}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <p className="mt-6 text-center font-sans text-sm text-charcoal/60">
            <span className="font-semibold text-navy">{CURRENT_USER.pointsToNextTier}</span> points to {CURRENT_USER.nextTier}
          </p>
        </div>
      </AnimatedSection>

      {/* Benefits */}
      <AnimatedSection delay={0.24}>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
          <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-6">Gold Member Benefits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, i) => (
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
            <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-4">How to Earn</h3>
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
            <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-4">How to Redeem</h3>
            <div className="p-4 rounded-xl bg-navy/5 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-gold" />
                <span className="font-sans text-sm font-medium text-navy">500 points = KES 500 off</span>
              </div>
              <p className="font-sans text-xs text-gray-400">Any booking, any service</p>
            </div>
            <button className="w-full py-3 bg-gold text-navy font-sans font-semibold text-sm rounded-xl hover:bg-gold-light transition-all duration-300 shadow-md hover:shadow-gold">
              Redeem Points
            </button>
          </div>
        </AnimatedSection>
      </div>

      {/* Points History */}
      <AnimatedSection delay={0.4}>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
          <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-6">Points History</h3>
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
                      <span className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        pointTypeBg[entry.type],
                        pointTypeColors[entry.type]
                      )}>
                        {entry.points > 0 ? '+' : ''}{entry.points}
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
