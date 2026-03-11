'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SERVICES } from '@/lib/services'
import { formatCurrency } from '@/lib/utils'
import { AnimatedSection, TextReveal, LineReveal } from '@/components/ui/AnimatedSection'

export function ServicesGrid() {
  const gridRef = useRef(null)
  const isGridInView = useInView(gridRef, { once: true, margin: '-50px' })

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <AnimatedSection variant="blurIn">
            <span className="text-gold font-sans text-sm font-medium uppercase tracking-[0.25em]">
              Our Services
            </span>
          </AnimatedSection>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-navy font-semibold">
            <TextReveal text="Experience the Extraordinary" delay={0.2} />
          </h2>
          <LineReveal className="mx-auto mt-6 w-20" delay={0.6} />
        </div>

        {/* Services Grid */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 80, scale: 0.92 }}
              animate={
                isGridInView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 80, scale: 0.92 }
              }
              transition={{
                duration: 0.9,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link href={`/services/${service.slug}`} className="group block">
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative overflow-hidden rounded-xl shadow-lg bg-white border-t-2 border-transparent hover:border-gold transition-colors duration-700"
                >
                  {/* Image with parallax-style zoom */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.15]"
                    />
                    {/* Subtle gradient — keeps images vibrant */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-700" />
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <motion.p
                      className="text-2xl mb-1 transition-transform duration-500 group-hover:scale-110 inline-block"
                    >
                      {service.icon}
                    </motion.p>
                    <h3 className="font-display text-xl font-semibold text-white">
                      {service.name}
                    </h3>
                    <p className="font-sans text-sm text-white/60 mt-1 line-clamp-1 transition-colors duration-500 group-hover:text-white/80">
                      {service.tagline}
                    </p>
                    <p className="font-sans text-sm text-gold font-medium mt-2">
                      Starting from KShs 0
                    </p>

                    {/* Hover CTA — slides up with gold line */}
                    <div className="overflow-hidden">
                      <div className="translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                        <div className="w-8 h-px bg-gold mt-3 mb-2 transition-all duration-700 group-hover:w-full" />
                        <p className="font-sans text-sm text-gold-light font-medium">
                          Book Now &rarr;
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
