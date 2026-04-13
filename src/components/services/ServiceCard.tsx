'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Service } from '@/lib/services'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="bg-white rounded-xl overflow-hidden shadow-lg border border-transparent hover:border-gold/30 hover:shadow-xl transition-all duration-300 group flex flex-col hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={service.image}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <Badge className="absolute top-3 left-3" variant="cream">
          {service.category}
        </Badge>
        <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-gold/90 flex items-center justify-center text-lg" suppressHydrationWarning>
          {service.icon}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-display text-xl font-semibold text-navy">
          {service.name}
        </h3>
        <p className="font-sans text-sm text-charcoal/70 mt-1 line-clamp-2">
          {service.tagline}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="font-sans text-gold font-medium">
            From {formatCurrency(service.basePrice)}
          </span>
          <span className="font-sans text-sm text-charcoal/50">
            {service.duration}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <span className="block w-full text-center py-3 bg-navy text-white font-sans font-medium rounded-lg group-hover:bg-gold group-hover:text-navy-dark transition-all duration-300">
          View &amp; Book
        </span>
      </div>
    </Link>
  )
}
