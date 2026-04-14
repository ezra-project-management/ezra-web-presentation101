'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { btnGlassOnDark } from '@/lib/button-styles'

const heroImages = [
  '/images/image-resizing-2.jpeg',
  '/images/image-resizing-8.avif',
  '/images/image-resizing.jpeg',
  '/images/image-resizing-2.avif',
]

const stats = 'Nairobi · Est. 2020 · Seven guest experiences under one roof'

export function HeroSection() {
  const sectionRef = useRef(null)
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
      className="relative isolate min-h-[100dvh] flex flex-col justify-end overflow-hidden bg-[#060d14]"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <motion.div
              animate={{ scale: [1, 1.05] }}
              transition={{ duration: 28, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
              className="relative h-full w-full"
            >
              <Image
                src={heroImages[currentImage]}
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Cinematic grade: legibility without flattening the photograph */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_95%_130%_at_18%_52%,rgba(4,10,18,0.38)_0%,rgba(4,10,18,0.1)_52%,transparent_72%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/48 via-transparent to-black/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.1)_100%)]"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end px-5 pb-14 pt-32 sm:px-8 md:px-12 md:pb-20 lg:pb-24">
        <motion.div style={{ y: contentY, opacity: contentOpacity }} className="w-full">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-8">
            {/* Copy column */}
            <div className="lg:col-span-7 xl:col-span-6">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2"
              >
                <span className="h-px w-8 bg-gold/80 sm:w-12" aria-hidden />
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-gold/95">
                  Nairobi · Est. 2020
                </span>
              </motion.div>

              {/* Title — solid fills + shadow so “Ezra Center” reads on bright/gold photography */}
              <div className="relative overflow-hidden">
                <div
                  className="pointer-events-none absolute -left-6 -right-4 -top-3 -bottom-3 z-0 rounded-2xl bg-gradient-to-r from-black/55 via-black/35 to-transparent sm:-left-8 sm:rounded-3xl"
                  aria-hidden
                />
                <motion.h1
                  className="relative z-[1] font-display text-[clamp(2.75rem,8vw,6.25rem)] font-semibold leading-[0.95] tracking-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.85),0_4px_48px_rgba(0,0,0,0.45),0_0_1px_rgba(0,0,0,1)]"
                  initial={{ y: '108%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                >
                  <span className="block">
                    <span className="text-[#f5e6bc]">
                      Ezra
                    </span>{' '}
                    <span className="font-light text-white">Center</span>
                  </span>
                </motion.h1>
              </div>

              {/* Tight subcopy */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 max-w-[34rem] space-y-3"
              >
                <p className="text-pretty font-sans text-lg font-normal leading-snug text-white/90 md:text-xl md:leading-snug">
                  Premier Conferencing and Wellness hub
                </p>
                <p className="font-sans text-sm font-medium leading-relaxed tracking-wide text-white/45 md:text-[15px]">
                  International polish · Local warmth · Someone always answers
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10 flex flex-col gap-3 sm:mt-11 sm:flex-row sm:items-center sm:gap-4"
              >
                <Link
                  href="/services"
                  className="group inline-flex items-center justify-center gap-2 rounded-sm bg-white px-8 py-4 font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-navy shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] transition-all duration-300 hover:bg-gold hover:text-navy hover:shadow-[0_24px_60px_-10px_rgba(201,168,76,0.35)]"
                >
                  View services
                  <ArrowUpRight className="h-4 w-4 opacity-70 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link href="/services" className={btnGlassOnDark}>
                  Book a visit
                </Link>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="mt-8 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-white/35"
              >
                {stats}
              </motion.p>
            </div>

            {/* Slide control + stat — desktop */}
            <div className="flex flex-col items-stretch gap-8 pb-1 lg:col-span-5 lg:items-end xl:col-span-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="hidden w-full max-w-xs flex-col gap-3 lg:ml-auto lg:flex"
              >
                <div className="flex justify-end gap-1.5">
                  {heroImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentImage(i)}
                      className={`h-[3px] rounded-full transition-all duration-500 ease-out ${
                        i === currentImage ? 'w-10 bg-gold shadow-[0_0_12px_rgba(201,168,76,0.5)]' : 'w-2 bg-white/20 hover:bg-white/40'
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
                <p className="text-right font-sans text-[10px] font-medium uppercase tracking-[0.35em] text-white/30">
                  {String(currentImage + 1).padStart(2, '0')} / {String(heroImages.length).padStart(2, '0')}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 right-6 z-10 hidden md:flex md:flex-col md:items-center md:gap-5 lg:right-10"
      >
        <motion.span
          className="block h-16 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent"
          animate={{ scaleY: [0.85, 1, 0.85], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
        />
        <span className="font-sans text-[9px] uppercase tracking-[0.45em] text-white/25 [writing-mode:vertical-lr]">
          Scroll
        </span>
      </motion.div>
    </section>
  )
}
