'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import confetti from 'canvas-confetti'
import { ArrowRight } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export default function BookingConfirmedPage() {
  const confettiFired = useRef(false)

  useEffect(() => {
    if (confettiFired.current) return
    confettiFired.current = true

    const fire = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C9A84C', '#0F2C4A', '#E2C87A', '#FFFFFF', '#1A3C5E'],
      })
    }
    fire()
    const timer = setTimeout(fire, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-md w-full">
        {/* Animated checkmark */}
        <AnimatedSection variant="scaleUp">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center mb-6">
            <motion.svg
              className="w-10 h-10 text-emerald-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M20 6L9 17l-5-5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.svg>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <h1 className="font-display text-3xl text-navy font-semibold">
            Booking Confirmed!
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <p className="mt-4 font-mono text-2xl font-bold text-navy">EZR-A1B2C3</p>
          <p className="mt-2 font-sans text-charcoal/60">
            Salon & Spa &middot; Suite 1
          </p>
          <p className="font-sans text-charcoal/60">
            Saturday 15 March 2026 &middot; 10:00 AM
          </p>
        </AnimatedSection>

        {/* QR Code */}
        <AnimatedSection delay={0.3}>
          <div className="mt-8 inline-block p-6 bg-white rounded-2xl shadow-card border border-gray-100">
            <QRCodeSVG
              value="EZR-A1B2C3"
              size={180}
              level="M"
              bgColor="transparent"
              fgColor="#0F2C4A"
            />
            <p className="mt-3 font-sans text-xs text-gray-400">
              Show at reception for check-in
            </p>
          </div>
        </AnimatedSection>

        {/* SMS confirmation */}
        <AnimatedSection delay={0.4}>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-sans text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Confirmation SMS sent to +254712***678
          </div>
        </AnimatedSection>

        {/* Points earned */}
        <AnimatedSection delay={0.45}>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold-dark font-sans text-sm font-medium">
            You earned 35 points from this booking!
          </div>
        </AnimatedSection>

        {/* Actions */}
        <AnimatedSection delay={0.5}>
          <div className="mt-8 flex items-center gap-4 justify-center">
            <Link
              href="/dashboard/bookings"
              className="px-6 py-3 border border-charcoal/20 text-navy font-sans font-medium text-sm rounded-xl hover:border-gold hover:shadow-sm transition-all duration-300"
            >
              View My Bookings
            </Link>
            <Link
              href="/services"
              className="flex items-center gap-2 px-6 py-3 bg-gold text-navy font-sans font-semibold text-sm rounded-xl hover:bg-gold-light transition-all duration-300 shadow-md"
            >
              Book Another Service <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
