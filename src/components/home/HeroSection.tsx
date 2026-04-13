'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { membershipEntryHref } from '@/lib/web-session'
import { useWebLoggedIn } from '@/lib/use-web-logged-in'

const heroImages = [
  '/images/image-resizing-2.jpeg',
  '/images/image-resizing-8.avif',
  '/images/image-resizing.jpeg',
  '/images/image-resizing-2.avif',
]

export function HeroSection() {
  const sectionRef = useRef(null)
  const loggedIn = useWebLoggedIn()
  const membershipHref = membershipEntryHref(loggedIn)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const contentY = useTransform(scrollYProgress, [0, 0.45], ['0%', '6%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden bg-navy-dark"
    >
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <motion.div
              animate={{ scale: [1, 1.04] }}
              transition={{ duration: 28, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
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

      {/* Light scrims so photography stays visible */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/25 via-transparent to-black/55 pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-navy-dark/85 via-navy-dark/15 to-transparent pointer-events-none" />

      <div className="relative z-10 w-full pb-16 pt-28 md:pt-32 md:pb-20">
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8"
        >
          <div className="max-w-xl lg:max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl border border-gold/30 bg-gradient-to-br from-navy-dark/95 via-navy-dark/88 to-black/70 px-5 py-6 sm:px-7 sm:py-8 shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-[14px] ring-1 ring-white/10"
            >
              <div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-90"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, transparent 42%, transparent 58%, rgba(201,168,76,0.08) 100%)',
                }}
              />
              <div className="relative">
                <p className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.22em] text-gold font-medium mb-3 drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
                  Nairobi · wellness · work · celebrations
                </p>
                <h1 className="font-display text-4xl sm:text-5xl md:text-[3.35rem] font-semibold leading-[1.06]">
                  <span className="text-white [text-shadow:0_3px_28px_rgba(0,0,0,0.88)]">Room to </span>
                  <span className="italic text-gold [text-shadow:0_0_32px_rgba(201,168,76,0.45),0_4px_20px_rgba(0,0,0,0.92)]">
                    breathe
                  </span>
                  <span className="text-white [text-shadow:0_3px_28px_rgba(0,0,0,0.88)]">.</span>
                </h1>
                <p className="mt-4 font-sans text-base sm:text-lg text-white/88 leading-relaxed [text-shadow:0_2px_18px_rgba(0,0,0,0.8)]">
                  Spa, gym, boardrooms, and parties — one address, one crew who still answer the phone.
                </p>
                <p className="mt-3 font-sans text-sm text-white/70 [text-shadow:0_2px_14px_rgba(0,0,0,0.75)]">
                  5k+ visits back · Seven venues · Est. 2020
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3"
            >
              <Link
                href="/services"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-gold text-navy-dark font-sans font-semibold text-sm shadow-[0_8px_30px_rgba(201,168,76,0.4)] hover:bg-gold-light transition-colors"
              >
                Explore services
              </Link>
              <Link
                href={membershipHref}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-white/40 text-white font-sans font-medium text-sm bg-black/20 hover:bg-black/35 backdrop-blur-[2px] transition-colors [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]"
              >
                <ChevronDown className="w-4 h-4 -rotate-90 shrink-0" aria-hidden />
                Membership
              </Link>
            </motion.div>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4 shrink-0">
            <div className="flex gap-1.5">
              {heroImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentImage(i)}
                  className={`h-1 rounded-full transition-all duration-700 ${
                    i === currentImage ? 'w-10 bg-gold' : 'w-3 bg-white/35 hover:bg-white/55'
                  }`}
                  aria-label={`Show image ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 right-6 md:right-12 z-10 hidden sm:flex flex-col items-center gap-2"
      >
        <motion.span
          className="h-10 w-px rounded-full bg-gradient-to-b from-transparent via-gold/50 to-transparent"
          animate={{ scaleY: [0.7, 1, 0.7], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
        <span className="font-sans text-[10px] text-white/50 uppercase tracking-[0.3em]">Scroll</span>
      </motion.div>
    </section>
  )
}
