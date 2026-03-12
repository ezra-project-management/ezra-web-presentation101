'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { TESTIMONIALS } from '@/lib/services'
import { TextReveal, LineReveal } from '@/components/ui/AnimatedSection'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  // Auto-scroll animation
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    let animationId: number
    let scrollSpeed = 0.5 // pixels per frame
    let isPaused = false

    const step = () => {
      if (!isPaused && container) {
        container.scrollLeft += scrollSpeed
        // Loop back when reaching the end
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
          container.scrollLeft = 0
        }
      }
      animationId = requestAnimationFrame(step)
    }

    const pause = () => { isPaused = true }
    const resume = () => { isPaused = false }

    container.addEventListener('mouseenter', pause)
    container.addEventListener('mouseleave', resume)
    container.addEventListener('touchstart', pause)
    container.addEventListener('touchend', resume)

    animationId = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(animationId)
      container.removeEventListener('mouseenter', pause)
      container.removeEventListener('mouseleave', resume)
      container.removeEventListener('touchstart', pause)
      container.removeEventListener('touchend', resume)
    }
  }, [])

  const updateScrollState = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
  }

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = direction === 'left' ? -360 : 360
    el.scrollBy({ left: amount, behavior: 'smooth' })
  }

  // Duplicate testimonials for seamless loop
  const loopedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS]

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
            Testimonials
          </motion.span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-navy font-semibold">
            <TextReveal text="What Our Guests Say" delay={0.2} />
          </h2>
          <LineReveal className="mx-auto mt-6 w-20" delay={0.5} />
        </div>

        {/* Navigation arrows */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal/40 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-300"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal/40 hover:border-gold hover:text-gold hover:bg-gold/5 transition-all duration-300"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Sliding cards */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-6 overflow-x-hidden pb-4"
        >
          {loopedTestimonials.map((testimonial, index) => (
            <motion.div
              key={`${testimonial.name}-${index}`}
              ref={index === 0 ? ref : undefined}
              initial={{ opacity: 0, x: 80 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: Math.min(index, 4) * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="min-w-[340px] max-w-[340px] flex-shrink-0"
            >
              <div className="bg-white rounded-2xl shadow-sm p-7 border border-charcoal/5 h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden">
                {/* Decorative gold accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold via-gold/60 to-transparent rounded-l-2xl" />

                {/* Quote mark */}
                <span className="text-gold/15 text-6xl font-display leading-none absolute top-4 right-6 select-none">
                  &ldquo;
                </span>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        duration: 0.4,
                        delay: Math.min(index, 4) * 0.12 + 0.3 + i * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-gold text-sm"
                    >
                      ★
                    </motion.span>
                  ))}
                </div>

                {/* Quote */}
                <p className="font-sans text-charcoal/75 leading-relaxed flex-1 text-[15px] relative z-10">
                  {testimonial.text}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-charcoal/5">
                  <div className="w-11 h-11 rounded-full bg-navy text-white flex items-center justify-center font-sans font-semibold text-sm group-hover:bg-gold group-hover:text-navy-dark transition-colors duration-500 shadow-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-sans text-sm font-semibold text-navy">
                      {testimonial.name}
                    </p>
                    <p className="font-sans text-xs text-charcoal/45">
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
