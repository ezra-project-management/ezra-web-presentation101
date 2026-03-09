'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  Users,
  CalendarDays,
  CreditCard,
  FileText,
  Download,
  RefreshCw,
  X,
  ChevronDown,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import { UPCOMING_BOOKINGS, PAST_BOOKINGS } from '@/lib/dashboard-data'

const allBookings = [
  ...UPCOMING_BOOKINGS.map(b => ({
    ...b,
    rating: null as number | null,
    review: null as string | null,
  })),
  ...PAST_BOOKINGS.map(b => ({
    ...b,
    endTime: '',
    resource: '',
    staff: '',
    guests: 1,
    notes: null as string | null,
    canReschedule: false,
    canCancel: false,
    cancellationDeadline: null as string | null,
    mpesaRef: null as string | null,
    serviceCategory: '',
  })),
]

const timelineSteps = ['Booked', 'Confirmed', 'Checked In', 'Completed']

function getStepIndex(status: string) {
  switch (status) {
    case 'CONFIRMED': return 1
    case 'PENDING_PAYMENT': return 0
    case 'COMPLETED': return 3
    case 'CANCELLED': return -1
    default: return 0
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function generateICS(booking: typeof allBookings[0]) {
  const start = new Date(`${booking.date}T${convertTo24(booking.time)}`).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start}
SUMMARY:${booking.service} at Ezra Annex
DESCRIPTION:Booking ref ${booking.reference}
LOCATION:Ezra Annex
END:VEVENT
END:VCALENDAR`
  const blob = new Blob([ics], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${booking.reference}.ics`
  a.click()
  URL.revokeObjectURL(url)
}

function convertTo24(time12: string) {
  const [time, modifier] = time12.split(' ')
  const [h, m] = time.split(':')
  let hours = parseInt(h, 10)
  if (modifier === 'PM' && hours < 12) hours += 12
  if (modifier === 'AM' && hours === 12) hours = 0
  return `${hours.toString().padStart(2, '0')}:${m}:00`
}

export default function BookingDetailPage() {
  const params = useParams()
  const [qrExpanded, setQrExpanded] = useState(false)
  const booking = useMemo(() => allBookings.find(b => b.id === params.id), [params.id])

  if (!booking) {
    return (
      <div className="text-center py-20">
        <p className="font-display text-2xl text-navy font-semibold">Booking not found</p>
        <Link href="/dashboard/bookings" className="font-sans text-sm text-gold mt-4 inline-block">
          Back to bookings
        </Link>
      </div>
    )
  }

  const currentStep = getStepIndex(booking.status)

  const statusLabel: Record<string, string> = {
    CONFIRMED: 'Confirmed',
    PENDING_PAYMENT: 'Pending Payment',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  }

  const statusBadge: Record<string, string> = {
    CONFIRMED: 'bg-emerald-50 text-emerald-700',
    PENDING_PAYMENT: 'bg-amber-50 text-amber-700',
    COMPLETED: 'bg-navy/5 text-navy',
    CANCELLED: 'bg-red-50 text-red-600',
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/dashboard/bookings"
        className="inline-flex items-center gap-2 font-sans text-sm text-gray-400 hover:text-navy transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to My Bookings
      </Link>

      {/* Hero image */}
      <AnimatedSection>
        <div className="relative h-[200px] rounded-2xl overflow-hidden">
          <Image src={booking.image} alt={booking.service} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
            <div>
              <p className="font-display text-2xl lg:text-3xl font-semibold text-white">
                {booking.service}
                {booking.resource && <span className="font-light text-white/60 ml-2">{booking.resource}</span>}
              </p>
              <p className="font-mono text-sm text-white/60 mt-1">{booking.reference}</p>
            </div>
            <span className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium',
              statusBadge[booking.status]
            )}>
              {statusLabel[booking.status]}
            </span>
          </div>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Timeline */}
          <AnimatedSection delay={0.08}>
            <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6">
              <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-6">Status</h3>
              <div className="flex flex-col gap-0">
                {timelineSteps.map((step, i) => (
                  <div key={step} className="flex items-start gap-4">
                    {/* Step indicator */}
                    <div className="flex flex-col items-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 + i * 0.15 }}
                        className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all',
                          i <= currentStep
                            ? 'bg-gold text-white'
                            : i === currentStep + 1
                            ? 'border-2 border-gold bg-white'
                            : 'border-2 border-gray-200 bg-white'
                        )}
                      >
                        {i <= currentStep ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <span className="font-sans text-xs text-gray-300">{i + 1}</span>
                        )}
                      </motion.div>
                      {i < timelineSteps.length - 1 && (
                        <div className={cn(
                          'w-0.5 h-8',
                          i < currentStep ? 'bg-gold' : 'bg-gray-200'
                        )} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={cn(
                        'font-sans text-sm font-medium',
                        i <= currentStep ? 'text-navy' : 'text-gray-400'
                      )}>
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Booking Details */}
          <AnimatedSection delay={0.16}>
            <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6">
              <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-6">Booking Details</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: CalendarDays, label: 'Date', value: formatDate(booking.date) },
                  { icon: Clock, label: 'Time', value: `${booking.time}${booking.endTime ? ` - ${booking.endTime}` : ''}` },
                  { icon: Clock, label: 'Duration', value: booking.duration },
                  { icon: MapPin, label: 'Location', value: booking.resource || 'Ezra Annex' },
                  { icon: Users, label: 'Staff', value: booking.staff || '-' },
                  { icon: Users, label: 'Guests', value: String(booking.guests) },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <item.icon className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-sans text-xs text-gray-400 uppercase tracking-wider">{item.label}</p>
                      <p className="font-sans text-sm text-navy font-medium mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {booking.notes && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="font-sans text-xs text-gray-400 uppercase tracking-wider mb-1">Notes</p>
                  <p className="font-sans text-sm text-charcoal/70">{booking.notes}</p>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Payment */}
          <AnimatedSection delay={0.24}>
            <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6">
              <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-6">Payment</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="font-sans text-xs text-gray-400">Amount</p>
                  <p className="font-display text-2xl font-bold text-navy mt-0.5">
                    {formatCurrency(booking.amount)}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-xs text-gray-400">Method</p>
                  <p className="font-sans text-sm text-navy font-medium mt-0.5">
                    {booking.paymentMethod || 'Not paid'}
                  </p>
                </div>
                {booking.mpesaRef && (
                  <div>
                    <p className="font-sans text-xs text-gray-400">M-Pesa Reference</p>
                    <p className="font-mono text-sm text-navy mt-0.5">{booking.mpesaRef}</p>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* Right column — Actions */}
        <div className="space-y-6">
          {/* QR Code */}
          <AnimatedSection delay={0.12}>
            <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 text-center">
              <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-4">QR Check-in</h3>
              <div
                className="inline-block p-4 bg-white rounded-xl border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setQrExpanded(!qrExpanded)}
              >
                <QRCodeSVG
                  value={booking.reference}
                  size={qrExpanded ? 200 : 140}
                  level="M"
                  bgColor="transparent"
                  fgColor="#0F2C4A"
                />
              </div>
              <p className="mt-3 font-mono text-sm font-bold text-navy">{booking.reference}</p>
              <p className="mt-1 font-sans text-xs text-gray-400">Show at reception for check-in</p>
              <button
                onClick={() => setQrExpanded(!qrExpanded)}
                className="mt-3 font-sans text-xs text-gold hover:text-gold-dark flex items-center gap-1 mx-auto"
              >
                {qrExpanded ? 'Collapse' : 'Expand'} <ChevronDown className={cn('w-3 h-3 transition-transform', qrExpanded && 'rotate-180')} />
              </button>
            </div>
          </AnimatedSection>

          {/* Action buttons */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-3">
              <button
                onClick={() => generateICS(booking)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-white to-cream/40 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 text-left"
              >
                <CalendarDays className="w-5 h-5 text-navy" />
                <span className="font-sans text-sm font-medium text-navy">Add to Calendar</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-white to-cream/40 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 text-left">
                <Download className="w-5 h-5 text-navy" />
                <span className="font-sans text-sm font-medium text-navy">Download Receipt</span>
              </button>

              {booking.canReschedule && (
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-white to-cream/40 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 text-left">
                  <RefreshCw className="w-5 h-5 text-teal" />
                  <span className="font-sans text-sm font-medium text-teal">Reschedule</span>
                </button>
              )}

              {booking.canCancel && (
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-white to-cream/40 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 text-left">
                  <X className="w-5 h-5 text-red-500" />
                  <span className="font-sans text-sm font-medium text-red-500">Cancel Booking</span>
                </button>
              )}
            </div>
          </AnimatedSection>

          {/* Cancellation policy */}
          {booking.cancellationDeadline && (
            <AnimatedSection delay={0.28}>
              <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4">
                <p className="font-sans text-xs uppercase tracking-widest text-amber-700 mb-2">
                  Cancellation Policy
                </p>
                <p className="font-sans text-xs text-amber-700/70">
                  Free cancellation before {new Date(booking.cancellationDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}.
                  50% fee applies after that date.
                </p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </div>
  )
}
