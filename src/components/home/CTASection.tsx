'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { TextReveal } from '@/components/ui/AnimatedSection'

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
    <section ref={sectionRef} className="relative py-32 md:py-40 overflow-hidden">
      {/* Parallax Background — brighter */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="/images/image-resizing-10.avif"
          alt="Ezra Annex booking"
          fill
          className="object-cover brightness-110"
        />
      </motion.div>

      {/* Lighter, warmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy/60 via-navy/40 to-navy/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />

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
          className="inline-flex items-center px-5 py-2 rounded-full bg-gold/20 border border-gold/30 text-gold text-sm font-sans font-medium mb-8 backdrop-blur-sm"
        >
          Start Your Journey
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <Image
            src="/ezralogo.jpeg"
            alt="Ezra Annex"
            width={80}
            height={80}
            className="rounded-full object-cover mx-auto"
          />
        </motion.div>
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-semibold leading-tight">
          <TextReveal text="Ready to Experience" delay={0} />
          <br />
          <TextReveal text="Excellence?" delay={0.3} className="text-gold" />
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
          Book any service online in minutes. No queues, no calls needed.
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
            <span className="relative z-10">Book Your Experience</span>
            <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            <span className="absolute inset-0 bg-gold-light translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white/40 text-white font-sans font-medium text-lg rounded-lg hover:bg-white/10 hover:border-white/60 transition-all duration-500 backdrop-blur-sm"
          >
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
          Or chat with our AI assistant 24/7
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
