'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { TextReveal, LineReveal } from '@/components/ui/AnimatedSection'

const galleryImages = [
  {
    src: '/images/image-resizing-2.jpeg',
    alt: 'Ezra Annex grand ballroom',
    label: 'The Ballroom',
    span: 'col-span-2 row-span-2',
  },
  {
    src: '/images/image-resizing.jpeg',
    alt: 'Ezra Annex banquet table setting',
    label: 'Fine Dining',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/image-resizing-3.avif',
    alt: 'Ezra Annex premium lounge',
    label: 'Lounge',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/image-resizing-10.avif',
    alt: 'Ezra Annex wellness centre',
    label: 'Wellness',
    span: 'col-span-1 row-span-2',
  },
  {
    src: '/images/image-resizing-8.avif',
    alt: 'Ezra Annex pool area',
    label: 'Pool',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/image-resizing-9.avif',
    alt: 'Ezra Annex accommodation suite',
    label: 'Suites',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/image-resizing-11.avif',
    alt: 'Ezra Annex fitness centre',
    label: 'Fitness',
    span: 'col-span-1 row-span-1',
  },
  {
    src: '/images/image-resizing-12.avif',
    alt: 'Ezra Annex spa treatment',
    label: 'Spa',
    span: 'col-span-1 row-span-1',
  },
]

function GalleryCard({
  image,
  index,
  onClick,
}: {
  image: (typeof galleryImages)[0]
  index: number
  onClick: () => void
}) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: '-60px' })
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : {}
      }
      transition={{
        duration: 1.2,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`${image.span} min-h-[200px] md:min-h-[280px]`}
    >
      <motion.button
        onClick={onClick}
        style={{ y }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full rounded-2xl overflow-hidden group cursor-pointer"
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-all duration-[1.8s] ease-out group-hover:scale-110"
        />

        {/* Multi-layer hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent opacity-30 group-hover:opacity-70 transition-all duration-700" />

        {/* Animated border glow on hover */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold/50 transition-all duration-700" />
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-[inset_0_0_40px_rgba(201,168,76,0.15)]" />

        {/* Label with slide-up reveal */}
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <div className="w-8 h-px bg-gold mb-3 transition-all duration-700 group-hover:w-12" />
          <p className="font-display text-xl text-white font-semibold tracking-wide">
            {image.label}
          </p>
        </div>

        {/* View indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white/90 text-xs font-sans tracking-wider uppercase">
            View
          </span>
        </div>
      </motion.button>
    </motion.div>
  )
}

export function GallerySection() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const sectionRef = useRef(null)

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (selectedIndex === null) return
    if (direction === 'next') {
      setSelectedIndex((selectedIndex + 1) % galleryImages.length)
    } else {
      setSelectedIndex((selectedIndex - 1 + galleryImages.length) % galleryImages.length)
    }
  }

  return (
    <section ref={sectionRef} className="py-32 bg-cream relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            whileInView={{ opacity: 1, letterSpacing: '0.25em' }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-gold font-sans text-sm font-medium uppercase inline-block"
          >
            Gallery
          </motion.span>
          <h2 className="mt-4 font-display text-4xl md:text-6xl text-navy font-semibold">
            <TextReveal text="A Glimpse Inside" delay={0.2} />
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-charcoal/60 font-sans max-w-lg mx-auto"
          >
            Step into the world of Ezra Annex — where every detail is crafted for excellence.
          </motion.p>
          <LineReveal className="mx-auto mt-8 w-20" delay={0.5} />
        </div>

        {/* Bento Grid Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[240px]">
          {galleryImages.map((image, index) => (
            <GalleryCard
              key={image.src}
              image={image}
              index={index}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>

        {/* Stats bar below gallery */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16"
        >
          {[
            { value: '8', label: 'Premium Services' },
            { value: '15+', label: 'Expert Staff' },
            { value: '24/7', label: 'Available' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl md:text-4xl text-gold font-semibold">{stat.value}</p>
              <p className="font-sans text-sm text-charcoal/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <Dialog.Root
        open={selectedIndex !== null}
        onOpenChange={() => setSelectedIndex(null)}
      >
        <AnimatePresence>
          {selectedIndex !== null && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="fixed inset-0 bg-black/95 z-50 backdrop-blur-xl"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-5xl aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl"
                >
                  <Dialog.Title className="sr-only">
                    {galleryImages[selectedIndex].label}
                  </Dialog.Title>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={galleryImages[selectedIndex].src}
                        alt={galleryImages[selectedIndex].alt}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Bottom info bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-8 py-6">
                    <p className="font-display text-2xl text-white font-semibold">
                      {galleryImages[selectedIndex].label}
                    </p>
                    <p className="font-sans text-sm text-white/60 mt-1">
                      {selectedIndex + 1} / {galleryImages.length}
                    </p>
                  </div>

                  {/* Navigation */}
                  <button
                    onClick={() => navigateLightbox('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => navigateLightbox('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300"
                    aria-label="Next"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  {/* Close */}
                  <Dialog.Close asChild>
                    <button
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Close>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </section>
  )
}
