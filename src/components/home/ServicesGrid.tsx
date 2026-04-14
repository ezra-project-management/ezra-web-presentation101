'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { SERVICES } from '@/lib/services'
import type { Service } from '@/lib/services'
import { formatCurrency, cn } from '@/lib/utils'
import { btnGlassOnPhoto } from '@/lib/button-styles'
import { AnimatedSection, TextReveal, LineReveal } from '@/components/ui/AnimatedSection'

const CATEGORY_LABEL: Record<Service['category'], string> = {
  WELLNESS: 'Wellness',
  FITNESS: 'Fitness',
  BUSINESS: 'Business',
  EVENTS: 'Events',
}

/** Readable colour accents on photo cards (category-tinted titles). */
const TITLE_BY_CATEGORY: Record<Service['category'], string> = {
  WELLNESS:
    'bg-gradient-to-br from-gold-light via-[#fff8e7] to-gold bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]',
  FITNESS:
    'bg-gradient-to-br from-teal-light via-cyan-100 to-teal bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]',
  BUSINESS:
    'bg-gradient-to-br from-white via-mist to-white bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]',
  EVENTS:
    'bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]',
}

const CHIP_BY_CATEGORY: Record<Service['category'], string> = {
  WELLNESS: 'border-emerald-400/35 bg-emerald-950/30 text-emerald-50',
  FITNESS: 'border-cyan-400/35 bg-cyan-950/25 text-cyan-50',
  BUSINESS: 'border-slate-300/40 bg-slate-900/35 text-slate-50',
  EVENTS: 'border-amber-400/40 bg-amber-950/30 text-amber-50',
}

export function ServicesGrid() {
  const router = useRouter()
  const reduceMotion = useReducedMotion()

  return (
    <section className="pt-24 md:pt-28 pb-8 md:pb-10 bg-gradient-to-b from-cream/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-12">
          <AnimatedSection variant="blurIn">
            <span className="text-gold font-sans text-sm font-medium uppercase tracking-[0.25em]">
              Everything under one roof
            </span>
          </AnimatedSection>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-navy font-semibold">
            <TextReveal text="Something for everyone" delay={0.2} />
          </h2>
          <LineReveal className="mx-auto mt-6 w-20" delay={0.6} />
          <p className="mt-5 max-w-2xl mx-auto font-sans text-sm md:text-base text-charcoal/60 leading-relaxed">
            Clear starting prices, one booking flow. Slide through every line below — same figures at checkout and on our
            team consoles.
          </p>
        </div>
      </div>

      {/* Horizontal strip — all services without vertical scrolling */}
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-8 w-8 z-[1] bg-gradient-to-r from-cream/90 to-transparent md:w-12 md:from-white" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-8 w-8 z-[1] bg-gradient-to-l from-cream/90 to-transparent md:w-12 md:from-white" />

        <div
          className={cn(
            'overflow-x-auto overflow-y-visible snap-x snap-mandatory scrollbar-hide scroll-pl-4 scroll-pr-4',
            'pb-8 pt-1 [-webkit-overflow-scrolling:touch]',
            'flex gap-5 md:gap-6 px-4 sm:px-6 lg:px-10 xl:px-[max(1.5rem,calc((100vw-80rem)/2+1rem))]'
          )}
        >
          {SERVICES.map((service) => (
            <motion.a
              key={service.id}
              href={`/services/${service.slug}`}
              onClick={(e) => {
                e.preventDefault()
                router.push(`/services/${service.slug}`)
              }}
              whileHover={reduceMotion ? undefined : { y: -10 }}
              whileTap={reduceMotion ? undefined : { scale: 0.985 }}
              transition={{ type: 'spring', stiffness: 400, damping: 26, mass: 0.65 }}
              className={cn(
                'group relative flex w-[min(88vw,360px)] shrink-0 snap-center snap-always cursor-pointer',
                'md:w-[340px] lg:w-[360px]'
              )}
            >
              <div
                className={cn(
                  'relative flex h-full min-h-[420px] w-full flex-col overflow-hidden rounded-2xl',
                  'shadow-[0_20px_50px_-12px_rgba(15,44,74,0.2)] ring-1 ring-white/20',
                  'transition-shadow duration-500 ease-out group-hover:shadow-[0_28px_60px_-12px_rgba(15,44,74,0.28)] group-hover:ring-gold/30'
                )}
              >
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.05]"
                  sizes="360px"
                />

                {/* Lighter scrim so photography reads clearly */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/78 via-navy/22 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-gold/10" />

                <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      'inline-flex max-w-[78%] items-center rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] backdrop-blur-md',
                      CHIP_BY_CATEGORY[service.category]
                    )}
                  >
                    {CATEGORY_LABEL[service.category]}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-1 flex-col justify-end p-5 md:p-6">
                  <div className="flex gap-3.5">
                    <div
                      className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border border-white/35 bg-white/15 text-2xl shadow-lg backdrop-blur-md transition-transform duration-500 group-hover:scale-[1.04]"
                      suppressHydrationWarning
                    >
                      {service.icon}
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <h3
                        className={cn(
                          'font-display text-[1.35rem] font-semibold leading-snug md:text-[1.45rem]',
                          TITLE_BY_CATEGORY[service.category]
                        )}
                      >
                        {service.name}
                      </h3>
                      <p className="mt-2 font-sans text-[13px] md:text-sm leading-relaxed text-white/92 [text-shadow:0_1px_8px_rgba(0,0,0,0.65)] line-clamp-2">
                        {service.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 border-t border-white/15 pt-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                      <span className="inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-xl border border-gold/50 bg-black/40 px-4 py-2.5 text-center font-sans text-sm font-bold tabular-nums tracking-wide text-gold-light shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md sm:w-auto sm:min-w-[11.5rem] sm:justify-center">
                        From {formatCurrency(service.basePrice)}
                      </span>
                      <span className={cn(btnGlassOnPhoto, 'min-h-[2.75rem] w-full shrink-0 justify-center sm:w-auto')}>
                        Book now
                        <ArrowRight className="h-4 w-4 opacity-95 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-2 flex items-center justify-center gap-2 text-xs font-medium text-charcoal/45">
          <ChevronRight className="h-3.5 w-3.5 rotate-180 text-gold/70" aria-hidden />
          <span>Swipe or drag sideways to explore all services</span>
          <ChevronRight className="h-3.5 w-3.5 text-gold/70" aria-hidden />
        </div>
      </div>
    </section>
  )
}
