'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { TextReveal } from '@/components/ui/AnimatedSection'

export function CTASection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.2])

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80"
          alt="Ezra Annex booking"
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Cinematic overlay with vignette */}
      <div className="absolute inset-0 bg-navy/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(8,25,46,0.5)_100%)]" />

      {/* Decorative top line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent origin-center"
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-semibold leading-tight">
          <TextReveal text="Ready to Experience" delay={0} />
          <br />
          <TextReveal text="Ezra Annex?" delay={0.3} className="text-gold" />
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : {}
          }
          transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-lg text-white/70 font-sans"
        >
          Book any service online in minutes. No queues, no calls needed.
        </motion.p>

        {/* Gold accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 w-16 h-px bg-gold/60 origin-center"
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/services"
            className="group relative inline-flex items-center mt-10 px-10 py-4 bg-gold text-navy-dark font-sans font-medium text-lg rounded-lg overflow-hidden transition-all duration-500 shadow-lg hover:shadow-gold/25 hover:shadow-2xl"
          >
            <span className="relative z-10">Book Your Experience &rarr;</span>
            <span className="absolute inset-0 bg-gold-light translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-8 flex items-center justify-center gap-2 text-white/40 font-sans text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          Or chat with our AI assistant 24/7
        </motion.p>
      </div>
    </section>
  )
}
