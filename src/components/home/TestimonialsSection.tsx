'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { TESTIMONIALS } from '@/lib/services'
import { TextReveal, LineReveal } from '@/components/ui/AnimatedSection'

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <section className="py-28 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.25em' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-gold font-sans text-sm font-medium uppercase inline-block"
          >
            Testimonials
          </motion.span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-navy font-semibold">
            <TextReveal text="What Our Guests Say" delay={0.2} />
          </h2>
          <LineReveal className="mx-auto mt-6 w-20" delay={0.5} />
        </div>

        {/* Cards */}
        <div
          ref={ref}
          className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0"
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 60, rotateX: 8 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, rotateX: 0 }
                  : {}
              }
              transition={{
                duration: 0.9,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="min-w-[300px] md:min-w-0 snap-center"
              style={{ perspective: '1000px' }}
            >
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-gold h-full flex flex-col hover:shadow-lg transition-shadow duration-500 group">
                {/* Stars — animate in sequentially */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.15 + 0.3 + i * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-gold text-lg"
                    >
                      ★
                    </motion.span>
                  ))}
                </div>

                {/* Quote */}
                <p className="font-sans text-charcoal/80 italic leading-relaxed flex-1">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-charcoal/5">
                  <div className="w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-sans font-medium text-sm group-hover:bg-gold group-hover:text-navy-dark transition-colors duration-500">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-semibold text-navy">
                      {testimonial.name}
                    </p>
                    <p className="font-sans text-xs text-charcoal/50">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
