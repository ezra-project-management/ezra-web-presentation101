'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

const heroImages = [
  '/images/image-resizing-2.jpeg',
  '/images/image-resizing-8.avif',
  '/images/image-resizing.jpeg',
  '/images/image-resizing-2.avif',
]

const floatingPills = [
  '5,000+ visits and counting',
  'Seven services in one place',
  'Est. 2020 in Nairobi',
]

export function HeroSection() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const [currentImage, setCurrentImage] = useState(0)

  // Auto-rotate background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Parallax
  const contentY = useTransform(scrollYProgress, [0, 0.5], ['0%', '10%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-dark"
    >
      {/* Background Carousel */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentImage}
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
                src={heroImages[currentImage]}
                alt=""
                fill
                priority
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cinematic Overlays */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full h-full flex items-end pb-12 md:pb-20">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="max-w-7xl mx-auto px-6 md:px-12 w-full grid grid-cols-1 md:grid-cols-2 items-end gap-12 mb-12"
        >
          {/* Main Text Content */}
          <div className="max-w-2xl">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="bg-gold/90 text-navy-dark px-4 py-1 text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm shadow-xl">
                Nairobi · Serene · International · Welcoming
              </span>
            </motion.div>

            {/* Heading */}
            <div className="overflow-hidden">
              <motion.h1
                className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-white"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="block font-bold italic"><span className="text-gold">Ezra</span> <span className="text-white">Center</span></span>
              </motion.h1>
            </div>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="mt-6 font-sans text-white/80 text-lg md:text-xl leading-relaxed max-w-lg"
            >
              Room to breathe. Set in a gracious church building, Ezra brings together salon and spa care, fitness, meeting rooms, and spaces for celebrations. One calm address for guests from Nairobi and abroad. We still answer the phone.
            </motion.p>

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
                See What We Offer
              </Link>
              <Link
                href="/services"
                className="group flex items-center gap-4 text-white font-sans font-bold text-xs uppercase tracking-widest"
              >
                <span className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-500">
                  <ChevronDown className="w-5 h-5 -rotate-90" />
                </span>
                Book a Visit
              </Link>
            </motion.div>
          </div>

          {/* Side Info */}
          <div className="hidden md:flex flex-col items-end gap-12 pb-6">
            <div className="flex gap-1">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`h-0.5 transition-all duration-700 ${
                    i === currentImage ? 'w-12 bg-gold' : 'w-4 bg-white/20 hover:bg-white/40'
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

      {/* Scroll Indicator */}
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
