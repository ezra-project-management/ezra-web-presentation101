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
    alt: 'Ezra Annex ballroom tables',
    label: 'Grand Ballroom',
  },
  {
    src: '/images/image-resizing.jpeg',
    alt: 'Ezra Annex dining',
    label: 'Fine Dining',
  },
  {
    src: '/images/image-resizing-9.avif',
    alt: 'Ezra Annex luxury suite',
    label: 'Premium Suites',
  },
  {
    src: '/images/image-resizing-8.avif',
    alt: 'Ezra Annex pool sunset',
    label: 'Poolside',
  },
  {
    src: '/images/image-resizing-6.avif',
    alt: 'Ezra Annex lobby',
    label: 'Luxury Lounge',
  },
  {
    src: '/images/image-resizing-11.avif',
    alt: 'Ezra Annex gym',
    label: 'Fitness Centre',
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
  const y = useTransform(scrollYProgress, [0, 1], [20, -20])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="aspect-square md:aspect-[4/5]"
    >
      <motion.button
        onClick={onClick}
        style={{ y }}
        whileHover={{ scale: 1.02 }}
        className="relative w-full h-full rounded-2xl overflow-hidden group cursor-pointer"
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
        
        {/* Label on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <p className="font-display text-2xl text-white font-semibold tracking-wide">
            {image.label}
          </p>
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
    <section ref={sectionRef} className="py-20 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Header */}
        <div className="mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold font-sans text-xs font-bold uppercase tracking-[0.3em] inline-block mb-4"
          >
            Gallery
          </motion.span>
          <h2 className="font-display text-5xl md:text-7xl text-navy font-semibold">
            A Glimpse <span className="text-gold italic">Inside</span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-charcoal/60 font-sans max-w-lg mx-auto leading-relaxed"
          >
            Take a look around our space and see where the magic happens.
          </motion.p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto px-4">
          {galleryImages.map((image, index) => (
            <GalleryCard
              key={image.src}
              image={image}
              index={index}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
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
