'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { SERVICES } from '@/lib/services'
import { AnimatedSection, TextReveal, LineReveal } from '@/components/ui/AnimatedSection'

export function ServicesGrid() {
  const router = useRouter()

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <AnimatedSection variant="blurIn">
            <span className="text-gold font-sans text-sm font-medium uppercase tracking-[0.25em]">
              Everything under one roof
            </span>
          </AnimatedSection>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-navy font-semibold">
            <TextReveal text="Something for everyone" delay={0.2} />
          </h2>
          <LineReveal className="mx-auto mt-6 w-20" delay={0.6} />
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service) => (
            <a
              key={service.id}
              href={`/services/${service.slug}`}
              onClick={(e) => {
                e.preventDefault()
                router.push(`/services/${service.slug}`)
              }}
              className="group block cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg bg-white border-t-2 border-transparent hover:border-gold transition-all duration-700 hover:-translate-y-2">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.15]"
                  />
                  {/* Localized content gradient for better image and text visibility */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 transition-opacity duration-700" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-2xl mb-1 transition-transform duration-500 group-hover:scale-110 inline-block" suppressHydrationWarning>
                    {service.icon}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {service.name}
                  </h3>
                  <p className="font-sans text-xs text-white/90 mt-1 line-clamp-2 transition-colors duration-500 group-hover:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    {service.tagline}
                  </p>
                  <p className="font-sans text-[10px] text-gold font-bold mt-2 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    Starting from KShs 0
                  </p>

                  {/* Hover CTA */}
                  <div className="overflow-hidden">
                    <div className="translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                      <div className="w-8 h-px bg-gold mt-3 mb-2 transition-all duration-700 group-hover:w-full" />
                      <p className="font-sans text-sm text-gold-light font-medium">
                        Book Now &rarr;
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
