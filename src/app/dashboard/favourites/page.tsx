'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star, ArrowRight } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'
import { FAVOURITE_SERVICES } from '@/lib/dashboard-data'
import { SERVICES } from '@/lib/services'

const visitedSlugs = ['salon-spa', 'gym', 'swimming-pool', 'barbershop']
const recommended = SERVICES.filter(s => !visitedSlugs.includes(s.slug)).slice(0, 4)

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function FavouritesPage() {
  const [saved, setSaved] = useState<Record<string, boolean>>(
    Object.fromEntries(FAVOURITE_SERVICES.map(s => [s.slug, true]))
  )

  const toggleSaved = (slug: string) => {
    setSaved(prev => ({ ...prev, [slug]: !prev[slug] }))
  }

  const activeCount = Object.values(saved).filter(Boolean).length

  return (
    <div className="space-y-8">
      <AnimatedSection>
        <h1 className="font-display text-2xl lg:text-3xl text-navy font-semibold">
          Saved Services
        </h1>
        <p className="mt-1 font-sans text-sm text-gray-400">
          {activeCount} favourite{activeCount !== 1 ? 's' : ''}
        </p>
      </AnimatedSection>

      {/* Favourites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FAVOURITE_SERVICES.map((service, i) => (
          <AnimatedSection key={service.slug} delay={i * 0.08}>
            <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group">
              <div className="relative h-[180px]">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
                <button
                  onClick={() => toggleSaved(service.slug)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Heart
                    className={cn(
                      'w-5 h-5 transition-colors',
                      saved[service.slug] ? 'text-gold fill-gold' : 'text-gray-400'
                    )}
                  />
                </button>
              </div>
              <div className="p-5">
                <p className="font-display text-lg font-semibold text-navy">{service.name}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="flex items-center gap-1 font-sans text-sm text-gold-dark">
                    <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                    {service.rating}
                  </span>
                  <span className="font-sans text-sm text-gray-400">
                    Starting from KShs 0
                  </span>
                </div>
                <p className="mt-2 font-sans text-xs text-gray-400">
                  Last visited {formatDate(service.lastVisited)}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-gold text-navy font-sans text-sm font-semibold rounded-xl hover:bg-gold-light transition-all duration-300"
                >
                  Book Again
                </Link>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Recommended */}
      {recommended.length > 0 && (
        <>
          <AnimatedSection delay={0.32}>
            <div className="flex items-center gap-4">
              <h2 className="font-display text-xl text-navy font-semibold">Recommended For You</h2>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <p className="font-sans text-sm text-gray-400 mt-1">Based on your visits</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommended.map((service, i) => (
              <AnimatedSection key={service.id} delay={0.4 + i * 0.08}>
                <Link
                  href={`/services/${service.slug}`}
                  className="block bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group"
                >
                  <div className="relative h-[140px]">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
                  </div>
                  <div className="p-4">
                    <p className="font-display text-base font-semibold text-navy">{service.name}</p>
                    <p className="font-sans text-xs text-gray-400 mt-1">You haven&apos;t tried this yet</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-sans text-sm text-navy font-medium">
                        KShs 0+
                      </span>
                      <span className="font-sans text-xs text-gold font-medium flex items-center gap-1">
                        Explore <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
