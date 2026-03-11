'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const heroSlides = [
  {
    image: '/images/image-resizing-2.jpeg',
    badge: "Nairobi's Premier Destination",
    heading: ['Where Luxury Meets', 'Every Experience'],
    subtitle: 'Discover world-class salon, fitness, events, and accommodation — all in one extraordinary place.',
  },
  {
    image: '/images/image-resizing.jpeg',
    badge: 'Unforgettable Events',
    heading: ['Grand Celebrations', 'Perfectly Crafted'],
    subtitle: 'From intimate dinners to lavish galas — our ballroom and banquet halls set the stage for memories that last.',
  },
  {
    image: '/images/image-resizing-10.avif',
    badge: 'Wellness & Beauty',
    heading: ['Rejuvenate Your', 'Body & Soul'],
    subtitle: 'Indulge in premium spa treatments, expert styling, and holistic wellness services tailored to you.',
  },
  {
    image: '/images/image-resizing-3.avif',
    badge: 'Premium Lifestyle',
    heading: ['Elevate Every', 'Moment Here'],
    subtitle: 'From sunrise workouts to evening retreats — experience luxury living at its finest.',
  },
]

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
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1)

  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }, [currentSlide])

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Parallax
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const contentY = useTransform(scrollYProgress, [0, 0.5], ['0%', '15%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  const slide = heroSlides[currentSlide]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background with Image Carousel */}
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 will-change-transform"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt="Ezra Annex"
              fill
              priority
              className="object-cover brightness-105"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Subtle gradient overlay — minimal, not dull */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/30 to-transparent" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        {/* Badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`badge-${currentSlide}`}
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(6px)', y: -10 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center px-5 py-2 rounded-full bg-white/15 border border-white/25 text-white text-sm font-sans font-medium mb-8 backdrop-blur-sm shadow-lg">
              {slide.badge}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Heading — animated per slide */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={`heading-${currentSlide}`}
            className="font-display text-5xl md:text-7xl lg:text-8xl leading-tight"
          >
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block font-light text-white drop-shadow-lg"
                initial={{ y: '120%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-120%' }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                {slide.heading[0]}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="inline-block font-bold italic text-gold drop-shadow-lg"
                initial={{ y: '120%' }}
                animate={{ y: '0%' }}
                exit={{ y: '-120%' }}
                transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                {slide.heading[1]}
              </motion.span>
            </span>
          </motion.h1>
        </AnimatePresence>

        {/* Subtitle — changes per slide */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`subtitle-${currentSlide}`}
            initial={{ opacity: 0, filter: 'blur(8px)', y: 20 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(6px)', y: -10 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-lg md:text-xl text-white/90 font-sans max-w-2xl mx-auto leading-relaxed drop-shadow-md"
          >
            {slide.subtitle}
          </motion.p>
        </AnimatePresence>

        {/* Horizontal line accent */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 w-24 h-px bg-gold/60 origin-center"
        />

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
            className="px-8 py-4 border-2 border-white/50 text-white font-sans font-medium rounded-lg text-lg hover:bg-white/15 hover:border-white/80 transition-all duration-500 backdrop-blur-sm"
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
                delay: 1.2 + i * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-sans shadow-sm"
            >
              {pill}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Image indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === currentSlide
                ? 'w-10 bg-gold shadow-gold/50 shadow-sm'
                : 'w-3 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`View slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.span
          className="font-sans text-xs text-white/50 uppercase tracking-[0.2em]"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        >
          Scroll
        </motion.span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-white/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
