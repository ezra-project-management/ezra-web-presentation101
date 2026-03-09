'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const floatingPills = [
  '5,000+ Happy Clients',
  '8 Premium Services',
  'Est. 2020',
]

export function HeroSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Parallax: image moves slower than scroll
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  // Content fades and rises as you scroll past
  const contentY = useTransform(scrollYProgress, [0, 0.5], ['0%', '15%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  // Overlay intensifies on scroll
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 0.9])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background Image */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 will-change-transform"
      >
        <Image
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=85"
          alt="Ezra Annex luxury interior"
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      {/* Animated Gradient Overlay */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-br from-navy via-navy/70 to-navy/30"
      />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(8,25,46,0.4)_100%)]" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Badge — blur in */}
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-gold/15 border border-gold/25 text-gold text-sm font-sans font-medium mb-8 backdrop-blur-sm">
            Nairobi&apos;s Premier Destination
          </span>
        </motion.div>

        {/* Heading — word-by-word clip reveal */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-tight">
          <span className="block overflow-hidden">
            <motion.span
              className="inline-block font-light text-white"
              initial={{ y: '120%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Where Luxury Meets
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="inline-block font-bold italic text-gold"
              initial={{ y: '120%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Every Experience
            </motion.span>
          </span>
        </h1>

        {/* Subtitle — fade + blur */}
        <motion.p
          initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
          animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-lg md:text-xl text-white/80 font-sans max-w-2xl mx-auto leading-relaxed"
        >
          Discover world-class salon, fitness, events, and accommodation — all
          in one extraordinary place.
        </motion.p>

        {/* Horizontal line accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 w-24 h-px bg-gold/50 origin-center"
        />

        {/* CTA Buttons — staggered scale+fade */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/services"
            className="group relative px-8 py-4 bg-gold text-navy-dark font-sans font-medium rounded-lg text-lg overflow-hidden transition-all duration-500 shadow-lg hover:shadow-gold/25 hover:shadow-2xl"
          >
            <span className="relative z-10">Explore Our Services</span>
            <span className="absolute inset-0 bg-gold-light translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Link>
          <Link
            href="/services"
            className="px-8 py-4 border-2 border-white/40 text-white font-sans font-medium rounded-lg text-lg hover:bg-white/10 hover:border-white/70 transition-all duration-500 backdrop-blur-sm"
          >
            Book Now
          </Link>
        </motion.div>

        {/* Floating Stat Pills */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
          {floatingPills.map((pill, i) => (
            <motion.span
              key={pill}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.8,
                delay: 1.7 + i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="px-5 py-2 rounded-full bg-white/8 backdrop-blur-md border border-white/15 text-white/90 text-sm font-sans"
            >
              {pill}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.span
          className="font-sans text-xs text-white/40 uppercase tracking-[0.2em]"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          Scroll
        </motion.span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
