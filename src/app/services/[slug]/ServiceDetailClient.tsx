'use client'

import Image from 'next/image'
import Link from 'next/link'
import * as Accordion from '@radix-ui/react-accordion'
import { CheckCircle, ChevronDown, Star, Clock, LogIn } from 'lucide-react'
import type { Service } from '@/lib/services'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { formatServicePrice } from '@/lib/utils'

interface ServiceDetailClientProps {
  service: Service
}

export function ServiceDetailClient({ service }: ServiceDetailClientProps) {
  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 font-sans text-sm text-charcoal/50">
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-gold transition-colors">
            Services
          </Link>
          <span>/</span>
          <span className="text-navy font-medium">{service.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-3">
            <AnimatedSection>
              {/* Hero Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Title & Rating */}
              <div className="mt-6">
                <h1 className="font-display text-3xl md:text-4xl font-semibold text-navy">
                  {service.name}
                </h1>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-gold text-gold"
                      />
                    ))}
                  </div>
                  <span className="font-sans text-sm font-medium text-navy">
                    5.0
                  </span>
                  <span className="font-sans text-sm text-charcoal/50">
                    (247 reviews)
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-6 font-sans text-charcoal/80 leading-relaxed">
                {service.description}
              </p>

              {/* Highlights */}
              <div className="mt-8">
                <h2 className="font-display text-xl font-semibold text-navy mb-4">
                  Highlights
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {service.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-center gap-2 px-4 py-2.5 bg-cream rounded-lg"
                    >
                      <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                      <span className="font-sans text-sm text-navy">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div className="mt-8">
                <h2 className="font-display text-xl font-semibold text-navy mb-4">
                  What&apos;s Included
                </h2>
                <Accordion.Root
                  type="multiple"
                  className="space-y-2"
                >
                  {service.services.map((item, index) => (
                    <Accordion.Item
                      key={item}
                      value={`item-${index}`}
                      className="bg-white border border-charcoal/10 rounded-lg overflow-hidden"
                    >
                      <Accordion.Header>
                        <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 font-sans text-sm font-medium text-navy hover:text-gold transition-colors group">
                          {item}
                          <ChevronDown className="w-4 h-4 text-charcoal/40 group-data-[state=open]:rotate-180 transition-transform" />
                        </Accordion.Trigger>
                      </Accordion.Header>
                      <Accordion.Content className="px-4 pb-3">
                        <p className="font-sans text-sm text-charcoal/60">
                          Experience our premium {item.toLowerCase()} service
                          with expert professionals and top-quality products.
                        </p>
                      </Accordion.Content>
                    </Accordion.Item>
                  ))}
                </Accordion.Root>
              </div>
            </AnimatedSection>
          </div>

          {/* Right — Book Now Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gold/20 p-6 sticky top-24">
              <h3 className="font-display text-xl font-semibold text-navy">
                {service.name}
              </h3>
              <div className="mt-1 mb-5">
                <p className="font-display text-2xl text-gold font-semibold">
                  {formatServicePrice(service.basePrice)}
                </p>
                <div className="flex items-center gap-1.5 mt-1 text-charcoal/50">
                  <Clock className="w-4 h-4" />
                  <span className="font-sans text-sm">{service.duration}</span>
                </div>
              </div>

              {/* Service highlights mini */}
              <div className="space-y-2 mb-6">
                {service.highlights.slice(0, 3).map((h) => (
                  <div key={h} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-gold shrink-0" />
                    <span className="font-sans text-sm text-charcoal/70">{h}</span>
                  </div>
                ))}
              </div>

              {/* Login to Book CTA */}
              <Link
                href={`/auth/login?redirect=/services/${service.slug}/book`}
                className="flex items-center justify-center gap-2 w-full py-4 bg-gold text-navy-dark font-sans font-bold text-base rounded-xl hover:bg-gold-light transition-all duration-300 shadow-gold hover:shadow-lg"
              >
                <LogIn className="w-5 h-5" />
                Sign in to Book
              </Link>

              <p className="mt-3 text-center font-sans text-xs text-charcoal/45">
                Don&apos;t have an account?{' '}
                <Link
                  href={`/auth/register?redirect=/services/${service.slug}/book`}
                  className="text-gold font-medium hover:text-gold-dark"
                >
                  Register here
                </Link>
              </p>

              {/* Trust badges */}
              <div className="mt-5 pt-5 border-t border-charcoal/10 flex flex-wrap gap-x-4 gap-y-1.5">
                <p className="flex items-center gap-1.5 font-sans text-xs text-charcoal/45">
                  <CheckCircle className="w-3.5 h-3.5" /> Free cancellation
                </p>
                <p className="flex items-center gap-1.5 font-sans text-xs text-charcoal/45">
                  <CheckCircle className="w-3.5 h-3.5" /> Instant confirmation
                </p>
                <p className="flex items-center gap-1.5 font-sans text-xs text-charcoal/45">
                  <CheckCircle className="w-3.5 h-3.5" /> Secure M-Pesa payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
