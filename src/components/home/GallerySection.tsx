'use client'

import { useState } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import { X } from 'lucide-react'
import { TextReveal, LineReveal } from '@/components/ui/AnimatedSection'

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=600&q=80',
    alt: 'Ezra Annex wellness area',
    tall: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1545579133-99bb5ad189be?auto=format&fit=crop&w=600&q=80',
    alt: 'Ezra Annex spa treatment',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80',
    alt: 'Ezra Annex fitness centre',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
    alt: 'Ezra Annex massage therapy',
    tall: true,
  },
  {
    src: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?auto=format&fit=crop&w=600&q=80',
    alt: 'Ezra Annex pool area',
    tall: false,
  },
  {
    src: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=600&q=80',
    alt: 'Ezra Annex accommodation',
    tall: false,
  },
]

export function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const gridRef = useRef(null)
  const isInView = useInView(gridRef, { once: true, margin: '-50px' })

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-navy font-semibold">
            <TextReveal text="A Glimpse Inside" delay={0.2} />
          </h2>
          <LineReveal className="mx-auto mt-6 w-20" delay={0.5} />
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px] md:auto-rows-[250px]"
        >
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, scale: 0.88, filter: 'blur(6px)' }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
                  : {}
              }
              transition={{
                duration: 1,
                delay: index * 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={image.tall ? 'row-span-2' : ''}
            >
              <button
                onClick={() => setSelectedImage(image.src)}
                className="relative w-full h-full rounded-xl overflow-hidden group cursor-pointer"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-all duration-[1.2s] ease-out group-hover:scale-110"
                />
                {/* Cinematic hover overlay */}
                <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/30 transition-all duration-700" />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold/40 rounded-xl transition-all duration-500" />

                {/* Reveal text on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="font-sans text-sm text-white/90 tracking-widest uppercase bg-navy/40 px-4 py-2 rounded-full backdrop-blur-sm">
                    View
                  </span>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Lightbox with cinematic transition */}
        <Dialog.Root
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <AnimatePresence>
            {selectedImage && (
              <Dialog.Portal forceMount>
                <Dialog.Overlay asChild>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 bg-black/90 z-50 backdrop-blur-md"
                  />
                </Dialog.Overlay>
                <Dialog.Content asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <Dialog.Title className="sr-only">
                      Gallery image
                    </Dialog.Title>
                    <Image
                      src={selectedImage.replace('w=600', 'w=1200')}
                      alt="Gallery full view"
                      fill
                      className="object-cover"
                    />
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
      </div>
    </section>
  )
}
