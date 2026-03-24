'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const heroSlides = [
  {
    image: '/images/image-resizing-2.jpeg',
    badge: "Welcome to Ezra Annex",
    heading: ['The Heart of', 'Nairobi Style'],
    subtitle: 'Your local spot for a fresh look, a great workout, and a place to stay — all in one building.',
  },
  {
    image: '/images/image-resizing-8.avif',
    badge: 'A Better Way to Live',
    heading: ['Make the Most', 'of Every Day'],
    subtitle: 'Start with a morning workout and end with a relaxing evening retreat — we handle the rest.',
  },
  {
    image: '/images/image-resizing.jpeg',
    badge: 'Host Your Next Event',
    heading: ['Celebrations Made', 'Just for You'],
    subtitle: "Whether it's a family dinner or a big party, we'll help you make it a night to remember.",
  },
  {
    image: '/images/image-resizing-2.avif',
    badge: 'Take a Break',
    heading: ['Refresh Your', 'Look & Feel'],
    subtitle: 'Treat yourself to a new style or a relaxing day at the spa designed for exactly what you need.',
  },
]

const floatingPills = [
  '5,000+ Happy Clients',
  '7 Premium Services',
  'Est. 2020',
]

export function HeroSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(0) // 0 for initial, 1 for next, -1 for prev

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
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.2])
  const contentY = useTransform(scrollYProgress, [0, 0.5], ['0%', '10%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  const slide = heroSlides[currentSlide]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-dark"
    >
      {/* Background Carousel */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <motion.div 
              animate={{ scale: [1, 1.1] }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="relative w-full h-full"
            >
              <Image
                src={slide.image}
                alt=""
                fill
                priority
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cinematic Overlays (Local to Background) */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

      {/* Content Layered for Premium Look */}
      <div className="relative z-10 w-full h-full flex items-end pb-12 md:pb-20">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-2 items-end gap-12 mb-12"
        >
          {/* Main Text Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`badge-${currentSlide}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <span className="bg-gold/90 text-navy-dark px-4 py-1 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm shadow-xl">
                  {slide.badge}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Heading */}
            <AnimatePresence mode="wait">
              <div key={`heading-container-${currentSlide}`} className="overflow-hidden">
                <motion.h1
                  className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-white"
                >
                  <motion.span
                    className="block font-light"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {slide.heading[0]}
                  </motion.span>
                  <motion.span
                    className="block font-bold italic text-gold mt-2"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {slide.heading[1]}
                  </motion.span>
                </motion.h1>
              </div>
            </AnimatePresence>

            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`subtitle-${currentSlide}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="mt-8 text-lg font-sans text-white/90 max-w-xl leading-relaxed border-l-2 border-gold/50 pl-6"
              >
                {slide.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center gap-6"
            >
              <Link
                href="/services"
                className="px-12 py-5 bg-white text-navy-dark font-sans font-bold rounded-sm text-xs uppercase tracking-widest transition-all duration-500 hover:bg-gold hover:text-navy-dark shadow-2xl"
              >
                Explore Services
              </Link>
              <Link
                href="/services"
                className="group flex items-center gap-4 text-white font-sans font-bold text-xs uppercase tracking-widest"
              >
                <span className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-500">
                  <ChevronDown className="w-5 h-5 -rotate-90" />
                </span>
                Book Now
              </Link>
            </motion.div>
          </div>

          {/* Side Info / Stats Layer */}
          <div className="hidden md:flex flex-col items-end gap-12 pb-6">
            <div className="flex gap-1">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`h-0.5 transition-all duration-700 ${
                    i === currentSlide ? 'w-12 bg-gold' : 'w-4 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`View slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex flex-col items-end gap-4">
              {floatingPills.map((pill, i) => (
                <motion.span
                  key={pill}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + i * 0.1 }}
                  className="text-white/60 font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-right"
                >
                  {pill}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>


      {/* Refined Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 right-12 z-10 hidden md:flex flex-col items-center gap-6"
      >
        <motion.div
          className="w-px h-20 bg-gradient-to-b from-transparent via-gold/50 to-transparent"
          animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
        <span className="font-sans text-[10px] text-white/40 uppercase tracking-[0.5em] [writing-mode:vertical-lr]">
          Explore
        </span>
      </motion.div>
    </section>
  )
}
