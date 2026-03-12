'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Service } from '@/lib/services'
import { BookingWidget } from '@/components/booking/BookingWidget'

interface BookPageClientProps {
  service: Service
}

export function BookPageClient({ service }: BookPageClientProps) {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-1.5 font-sans text-sm text-charcoal/50 hover:text-gold transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {service.name}
        </Link>

        {/* Service summary */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-cream rounded-xl">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
            <Image
              src={service.image}
              alt={service.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-navy">
              Book {service.name}
            </h1>
            <p className="font-sans text-sm text-charcoal/60 mt-0.5">
              {service.tagline}
            </p>
          </div>
        </div>

        {/* Booking Widget */}
        <BookingWidget
          serviceName={service.name}
          serviceSlug={service.slug}
          basePrice={service.basePrice}
          duration={service.duration}
        />
      </div>
    </div>
  )
}
