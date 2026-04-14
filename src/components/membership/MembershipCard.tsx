'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MembershipCardProps {
  emoji: string
  title: string
  description: string
  price: string
  period: string
  features: string[]
  isSelected: boolean
  onClick: () => void
}

export function MembershipCard({
  emoji,
  title,
  description,
  price,
  period,
  features,
  isSelected,
  onClick,
}: MembershipCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'relative cursor-pointer rounded-2xl border-2 p-8 transition-all duration-300',
        isSelected
          ? 'border-gold bg-white shadow-gold'
          : 'border-charcoal/5 bg-white hover:border-gold/30 hover:shadow-card'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Emoji/Icon */}
        <div className="mb-6 text-4xl" suppressHydrationWarning>
          {emoji}
        </div>

        {/* Title & Description */}
        <h3 className="font-display text-2xl font-bold text-navy mb-2">{title}</h3>
        <p className="font-sans text-sm text-charcoal/60 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Price */}
        <div className="mb-8">
          <span className="font-display text-3xl font-bold text-gold-dark">{price}</span>
          <span className="font-sans text-sm text-charcoal/40 ml-2">/ {period}</span>
        </div>

        {/* Features */}
        <ul className="space-y-4 flex-grow">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <span className="font-sans text-sm text-charcoal/80">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Selected Indicator */}
        <div className={cn(
          "mt-8 h-12 w-full rounded-xl border flex items-center justify-center font-sans text-sm font-semibold transition-all duration-300",
          isSelected 
            ? "bg-gold text-navy-dark border-gold" 
            : "bg-transparent text-charcoal/40 border-charcoal/10"
        )}>
          {isSelected ? 'Selected Plan' : 'Select Plan'}
        </div>
      </div>
    </motion.div>
  )
}
