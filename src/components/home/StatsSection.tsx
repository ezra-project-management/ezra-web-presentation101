'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import CountUp from 'react-countup'
import { STATS } from '@/lib/services'

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  // Parallax background
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  // Helper to parse stats like "5,000+" or "99%"
  const parseStatValue = (value: string) => {
    const number = parseInt(value.replace(/[^0-9]/g, ''), 10)
    const suffix = value.replace(/[0-9,]/g, '')
    return { number, suffix }
  }

  return (
    <section ref={ref} className="relative py-16 md:py-20 overflow-hidden bg-white">
      {/* Subtle architectural background element */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-cream/50 skew-x-[-12deg] translate-x-1/2" />
      
      {/* Refined gold accent lines */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, index) => {
            const { number, suffix } = parseStatValue(stat.value)
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                    : {}
                }
                transition={{
                  duration: 0.9,
                  delay: index * 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="text-center relative"
              >
                {/* Gold Divider */}
                {index > 0 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.4 + index * 0.15,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-px h-16 bg-gradient-to-b from-transparent via-gold/40 to-transparent origin-center"
                  />
                )}

                <div className="font-display text-5xl md:text-6xl font-bold bg-gradient-to-b from-gold to-gold-light bg-clip-text text-transparent">
                  <CountUp
                    end={number}
                    duration={2.5}
                    suffix={suffix}
                    separator=","
                    enableScrollSpy={true}
                    scrollSpyOnce={true}
                  />
                </div>
                <p className="mt-3 font-sans text-xs text-charcoal/50 uppercase tracking-[0.3em]">
                  {stat.label}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
