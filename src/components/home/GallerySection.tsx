'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, useInView, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const galleryImages = [
  {
    src: '/images/image-resizing-2.jpeg',
    alt: 'Ezra Center ballroom tables',
    label: 'Grand Ballroom',
  },
  {
    src: '/images/image-resizing.jpeg',
    alt: 'Ezra Center dining',
    label: 'Fine Dining',
  },
  {
    src: '/images/image-resizing-9.avif',
    alt: 'Ezra Center luxury suite',
    label: 'Premium Suites',
  },
  {
    src: '/images/image-resizing-6.avif',
    alt: 'Ezra Center lobby',
    label: 'Luxury Lounge',
  },
  {
    src: '/images/image-resizing-10.avif',
    alt: 'Ezra Center pool',
    label: 'Poolside',
  },
  {
    src: '/images/image-resizing-4.avif',
    alt: 'Ezra Center premium lounge',
    label: 'Relaxation Zone',
  },
  {
    src: '/images/image-resizing-5.avif',
    alt: 'Ezra Center gym',
    label: 'Fitness Centre',
  },
  {
    src: '/images/image-resizing-8.avif',
    alt: 'Ezra Center exterior',
    label: 'Modern Facade',
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
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={
        reduceMotion
          ? { duration: 0.25, delay: index * 0.06, ease: 'easeOut' }
          : {
              type: 'spring',
              stiffness: 260,
              damping: 28,
              mass: 0.7,
              delay: index * 0.09,
            }
      }
      className="relative group aspect-square md:aspect-[4/3]"
    >
      <motion.button
        onClick={onClick}
        whileHover={reduceMotion ? undefined : { scale: 1.03, y: -4 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        className="relative w-full h-full rounded-2xl overflow-hidden cursor-pointer"
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />

        {/* Subtle Hover Overlay */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-700" />
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
    <section ref={sectionRef} className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold font-sans text-[10px] font-bold uppercase tracking-[0.4em] inline-block mb-4"
          >
            GALLERY
          </motion.span>
          <h2 className="font-display text-5xl md:text-6xl text-navy-dark font-medium mb-4">
            A Glimpse <span className="text-gold italic">Inside</span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-charcoal/60 font-sans max-w-xl mx-auto leading-relaxed text-sm"
          >
            Take a look around our space and see where the magic happens.
          </motion.p>
        </div>

        {/* 4-column Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
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
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <AnimatePresence>
          {selectedIndex !== null && (() => {
            const selectedImage = galleryImages[selectedIndex]
            if (!selectedImage) return null

            return (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 bg-black/95 z-[9999] backdrop-blur-xl"
                  />
                </Dialog.Overlay>
                <Dialog.Content asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10000] w-[92vw] max-w-6xl aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                  >
                    <Dialog.Title className="sr-only">
                      {selectedImage.alt}
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
                          src={selectedImage.src}
                          alt={selectedImage.alt}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation & Controls */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-6">
                      <button
                        onClick={() => navigateLightbox('prev')}
                        className="pointer-events-auto w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-gold hover:text-navy-dark transition-all duration-300"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="w-8 h-8" />
                      </button>
                      <button
                        onClick={() => navigateLightbox('next')}
                        className="pointer-events-auto w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-gold hover:text-navy-dark transition-all duration-300"
                        aria-label="Next"
                      >
                        <ChevronRight className="w-8 h-8" />
                      </button>
                    </div>

                    {/* Close */}
                    <Dialog.Close asChild>
                      <button
                        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500/50 transition-all duration-300"
                        aria-label="Close"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </Dialog.Close>

                    {/* Caption */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-12">
                      <motion.p 
                        key={selectedIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-display text-3xl text-white font-bold"
                      >
                        {selectedImage.label}
                      </motion.p>
                      <p className="font-sans text-white/50 mt-2 text-sm uppercase tracking-widest">
                        {selectedIndex + 1} of {galleryImages.length}
                      </p>
                    </div>
                  </motion.div>
                </Dialog.Content>
              </Dialog.Portal>
            )
          })()}
        </AnimatePresence>
      </Dialog.Root>
    </section>
  )
}
