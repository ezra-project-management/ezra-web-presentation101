'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { TextReveal } from '@/components/ui/AnimatedSection'
import { btnGlassOnDarkLg } from '@/lib/button-styles'

export function CTASection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.15])

  return (
    <section ref={sectionRef} className="relative py-24 md:py-28 overflow-hidden">
      {/* Parallax Background — brighter */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="/images/image-resizing-6.avif"
          alt="Ezra Center lobby"
          fill
          className="object-cover brightness-110"
        />
      </motion.div>

      {/* Cinematic Overlays */}
      {/* 1. Base darkened overlay for legibility */}
      <div className="absolute inset-0 bg-black/40 z-[1]" />

      {/* 2. Deep bottom vignetting for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-[2]" />

      {/* 3. Side vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-[2]" />

      {/* 4. Subtle Film Grain / Noise Overlay for premium texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-[3]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Gold accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px]" />

      {/* Decorative top line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent origin-center"
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center px-5 py-2 rounded-full border border-white/25 bg-white/[0.08] text-gold text-sm font-sans font-medium mb-8 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
        >
          Book a Visit Today
        </motion.div>

        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-semibold leading-tight">
          <TextReveal text="We're ready" delay={0} />
          <br />
          <TextReveal text="when you are." delay={0.3} className="text-gold" />
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : {}
          }
          transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-lg md:text-xl text-white/85 font-sans leading-relaxed"
        >
          Pick a service, choose your time, and we&apos;ll take care of everything else. It takes less than two minutes.
        </motion.p>

        {/* Gold accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 w-20 h-px bg-gold/70 origin-center"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/services"
            className="group relative inline-flex items-center gap-2 px-10 py-4 bg-gold text-navy-dark font-sans font-semibold text-lg rounded-lg overflow-hidden transition-all duration-500 shadow-lg hover:shadow-gold/30 hover:shadow-2xl"
          >
            <span className="relative z-10">Book an Appointment</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            <span className="absolute inset-0 bg-gold-light translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
          <Link href="/about" className={btnGlassOnDarkLg}>
            Learn More
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-10 flex items-center justify-center gap-2 text-white/50 font-sans text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          Or send us a message. We are always here.
        </motion.p>
      </div>

      {/* Bottom decorative line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent origin-center"
      />
    </section>
  )
}
