'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, Heart, Lightbulb, Users } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

const values = [
  {
    icon: Star,
    title: 'Excellence',
    description:
      'We pursue the highest standards in every detail, from our facilities to our service delivery.',
  },
  {
    icon: Heart,
    title: 'Warmth',
    description:
      'Every guest is family. We create genuine connections and memorable experiences.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description:
      'We embrace technology and fresh ideas to continuously improve our offerings.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'We are deeply rooted in our community, contributing to growth and shared prosperity.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <Image
          src="/images/image-resizing-11.avif"
          alt="Ezra Center"
          fill
          priority
          className="object-cover brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/50 via-navy/40 to-navy/60" />
        <div className="relative z-10 text-center">
          <Image
            src="/ezralogo.jpeg"
            alt="Ezra Center"
            width={80}
            height={80}
            className="rounded-full object-cover mx-auto mb-4"
          />
          <h1 className="font-display text-4xl md:text-5xl text-white font-semibold">
            About Us
          </h1>
          <div className="mt-3 flex items-center justify-center gap-2 font-sans text-sm text-white/60">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gold">About</span>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <span className="text-gold font-sans text-sm font-medium uppercase tracking-widest">
                Our Story
              </span>
              <h2 className="mt-3 font-display text-3xl md:text-4xl text-navy font-semibold">
                Ezra Center
              </h2>
              <p className="mt-6 font-sans text-charcoal/80 leading-relaxed">
                We built Ezra Center as a calm, all-in-one place where beauty and personal
                care, fitness, meetings, and celebrations come together under one roof in
                Nairobi. Our guests include neighbours and visitors from around the world,
                and we aim to make every visit feel effortless and sincere.
              </p>
              <p className="mt-4 font-sans text-charcoal/80 leading-relaxed">
                Our team focuses on the details that matter, from a quiet hour in the salon
                to an evening you have been planning for months. Every moment here is
                arranged with care.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src="/images/image-resizing-12.avif"
                  alt="Ezra Center facility"
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-gold font-sans text-sm font-medium uppercase tracking-widest">
              Our Values
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl text-navy font-semibold">
              What We Stand For
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <AnimatedSection key={value.title} delay={index * 0.1}>
                <div className="bg-white rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto">
                    <value.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-semibold text-navy">
                    {value.title}
                  </h3>
                  <p className="mt-2 font-sans text-sm text-charcoal/70 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-navy">
        <div className="max-w-3xl mx-auto text-center px-4">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl text-white font-semibold">
              Join Our Family
            </h2>
            <p className="mt-4 font-sans text-white/70">
              Become part of the Ezra Center community and enjoy exclusive
              benefits, special offers, and premium experiences.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center mt-8 px-8 py-4 bg-gold text-navy-dark font-sans font-medium rounded-lg hover:bg-gold-light transition-all duration-300 shadow-lg"
            >
              Create Your Account
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
