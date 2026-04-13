'use client'

import { motion } from 'framer-motion'
import { TESTIMONIALS } from '@/lib/services'
import { TextReveal, LineReveal } from '@/components/ui/AnimatedSection'

// Duplicate testimonials for infinite horizontal scroll
const ALL_TESTIMONIALS = [...TESTIMONIALS, ...TESTIMONIALS]

export function TestimonialsSection() {
  return (
    <section className="py-28 bg-cream overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.25em' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-gold font-sans text-sm font-medium uppercase inline-block"
          >
            Real People, Real Stories
          </motion.span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-navy font-semibold">
            <TextReveal text="Hear it from our guests" delay={0.2} />
          </h2>
          <LineReveal className="mx-auto mt-6 w-20" delay={0.5} />
        </div>

        {/* Infinite Moving Carousel */}
        <div className="relative group">
          <motion.div
            className="flex gap-6"
            animate={{
              x: ['0%', '-50%'],
            }}
            transition={{
              duration: 40,
              ease: 'linear',
              repeat: Infinity,
            }}
            whileHover={{ transition: { duration: 60 } }} // Slow down on hover
          >
            {ALL_TESTIMONIALS.map((testimonial, index) => (
              <div
                key={`testimonial-${index}`}
                className="w-[320px] md:w-[400px] shrink-0"
                style={{ perspective: '1000px' }}
              >
                <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-gold h-full flex flex-col hover:shadow-lg transition-shadow duration-500 group/card">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="text-gold text-lg">
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="font-sans text-charcoal/80 italic leading-relaxed flex-1">
                    &ldquo;{testimonial.text}&rdquo;
                  </p>

                  {/* Role */}
                  <div className="mt-6 pt-4 border-t border-charcoal/5">
                    <p className="font-sans text-xs text-charcoal/50">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Gradient Overlays for smooth edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-cream to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-cream to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  )
}
