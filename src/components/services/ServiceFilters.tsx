'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const categories = [
  { value: 'All', label: 'All' },
  { value: 'WELLNESS', label: 'Personal care' },
  { value: 'FITNESS', label: 'Fitness' },
  { value: 'EVENTS', label: 'Events' },
  { value: 'BUSINESS', label: 'Business' },
]

interface ServiceFiltersProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function ServiceFilters({
  activeCategory,
  onCategoryChange,
}: ServiceFiltersProps) {
  return (
    <div className="sticky top-20 z-10 bg-white/80 backdrop-blur-sm py-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={cn(
              'relative px-5 py-2 rounded-full font-sans text-sm font-medium whitespace-nowrap transition-colors duration-300',
              activeCategory === cat.value
                ? 'text-navy-dark'
                : 'text-charcoal/60 border border-charcoal/20 hover:border-gold'
            )}
          >
            {activeCategory === cat.value && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-gold rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
