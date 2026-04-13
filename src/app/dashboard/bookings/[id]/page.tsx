'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  Users,
  CalendarDays,
  Download,
  RefreshCw,
  X,
  ChevronDown,
  AlertTriangle,
  UserPlus,
  Bell,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import { useBooking, DEFAULT_SPECIALIST_BY_SERVICE } from '@/lib/booking-context'
import { isVenueSlug } from '@/lib/venue-booking'
import { BookingCancellationNote } from '@/components/booking/BookingCancellationNote'

const timelineSteps = ['Booked', 'Confirmed', 'Checked In', 'Completed']

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
]

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

function generateICS(booking: { date: string; time: string; service: string; reference: string }) {
  const start = new Date(`${booking.date}T${convertTo24(booking.time)}`).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start}
SUMMARY:${booking.service} at Ezra Center
DESCRIPTION:Booking ref ${booking.reference}
LOCATION:Ezra Center
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
  const { bookings, cancelBooking, rescheduleBooking } = useBooking()
  const [qrExpanded, setQrExpanded] = useState(false)

  // Modal state
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')

  const booking = useMemo(() => bookings.find(b => b.id === params.id), [bookings, params.id])

  const specialistName =
    booking?.staff?.trim() ||
    (booking ? DEFAULT_SPECIALIST_BY_SERVICE[booking.serviceSlug] : '') ||
    ''

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
  const today = new Date().toISOString().split('T')[0]

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

  const handleCancel = () => {
    cancelBooking(booking.id)
    toast.success(`Booking ${booking.reference} cancelled. The time slot is now available.`)
    setShowCancelModal(false)
  }

  const handleReschedule = () => {
    if (!newDate || !newTime) {
      toast.error('Please select a new date and time')
      return
    }
    rescheduleBooking(booking.id, newDate, newTime)
    toast.success(`Booking rescheduled to ${formatDate(newDate)} at ${newTime}`)
    setShowRescheduleModal(false)
    setNewDate('')
    setNewTime('')
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
          {booking.image ? (
            <Image src={booking.image} alt={booking.service} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-navy/10" />
          )}
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

      {/* Who is looking after you — prominent, hotel-style */}
      <AnimatedSection delay={0.04}>
        <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-navy/[0.03] via-white to-cream/40 p-6 shadow-card">
          <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-gold-dark/90 mb-2">Your specialist</p>
          {specialistName ? (
            <>
              <p className="font-display text-2xl font-semibold text-navy">{specialistName}</p>
              <p className="font-sans text-sm text-charcoal/60 mt-2 max-w-xl">
                Scheduled for your service. For any change, speak with reception — they coordinate the team.
              </p>
            </>
          ) : (
            <p className="font-sans text-sm text-charcoal/70 max-w-xl">
              Your specialist will be confirmed before you arrive. Mention a preference at check-in and we will do our best
              to match it.
            </p>
          )}
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cancelled banner */}
          {booking.status === 'CANCELLED' && (
            <AnimatedSection delay={0.06}>
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="font-sans text-sm font-medium text-red-700">This booking has been cancelled</p>
                  <p className="font-sans text-xs text-red-500 mt-0.5">
                    The time slot is now available for other customers.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Status Timeline */}
          {booking.status !== 'CANCELLED' && (
            <AnimatedSection delay={0.08}>
              <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6">
                <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-6">Status</h3>
                <div className="flex flex-col gap-0">
                  {timelineSteps.map((step, i) => (
                    <div key={step} className="flex items-start gap-4">
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
          )}

          {/* Booking Details */}
          <AnimatedSection delay={0.16}>
            <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6">
              <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-6">Booking Details</h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: CalendarDays, label: 'Date', value: formatDate(booking.date) },
                  { icon: Clock, label: 'Time', value: `${booking.time}${booking.endTime ? ` - ${booking.endTime}` : ''}` },
                  { icon: Clock, label: 'Duration', value: booking.duration },
                  { icon: MapPin, label: 'Location', value: booking.resource || 'Ezra Center' },
                  {
                    icon: Users,
                    label: isVenueSlug(booking.serviceSlug) ? 'Expected guests' : 'Guests',
                    value: String(booking.guests),
                  },
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

              {isVenueSlug(booking.serviceSlug) && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="font-sans text-xs text-gray-400 uppercase tracking-wider mb-2">Event &amp; space</p>
                  <p className="font-sans text-sm text-charcoal/70 leading-relaxed">
                    This reservation is for a meeting or event space. The headcount above helps us prepare seating, AV, and
                    catering. Our events team will confirm layout details with you before the date.
                  </p>
                  {booking.eventNotes && (
                    <div className="mt-4 rounded-xl border border-gold/20 bg-navy/[0.03] p-4">
                      <p className="font-sans text-xs font-semibold text-navy uppercase tracking-wide mb-1">
                        Your event notes
                      </p>
                      <p className="font-sans text-sm text-navy/90 whitespace-pre-wrap">{booking.eventNotes}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Multi-service info */}
              {booking.services.length > 1 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="font-sans text-xs text-gray-400 uppercase tracking-wider mb-2">Services Included</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.services.map(svc => (
                      <span key={svc} className="px-3 py-1 bg-gold/10 text-gold-dark rounded-full font-sans text-xs font-medium">
                        {svc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Booked for someone else */}
              {booking.bookedFor && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <UserPlus className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <div>
                      <p className="font-sans text-xs text-gray-400 uppercase tracking-wider">Booked For</p>
                      <p className="font-sans text-sm text-navy font-medium mt-0.5">{booking.bookedFor.name}</p>
                      <p className="font-sans text-xs text-charcoal/50">{booking.bookedFor.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* SMS Reminder */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <p className="font-sans text-xs text-gray-400 uppercase tracking-wider">SMS Reminder</p>
                    <p className="font-sans text-sm text-navy font-medium mt-0.5">
                      {booking.smsReminder ? 'Enabled — 24 hours before' : 'Disabled'}
                    </p>
                  </div>
                </div>
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
          {booking.status !== 'CANCELLED' && (
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
          )}

          {/* Action buttons */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-3">
              {booking.status !== 'CANCELLED' && (
                <button
                  onClick={() => generateICS(booking)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-white to-cream/40 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 text-left"
                >
                  <CalendarDays className="w-5 h-5 text-navy" />
                  <span className="font-sans text-sm font-medium text-navy">Add to Calendar</span>
                </button>
              )}

              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-white to-cream/40 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 text-left">
                <Download className="w-5 h-5 text-navy" />
                <span className="font-sans text-sm font-medium text-navy">Download Receipt</span>
              </button>

              {booking.canReschedule && (
                <button
                  onClick={() => {
                    setNewDate(booking.date)
                    setNewTime(booking.time)
                    setShowRescheduleModal(true)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-white to-cream/40 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 text-left"
                >
                  <RefreshCw className="w-5 h-5 text-teal" />
                  <span className="font-sans text-sm font-medium text-teal">Reschedule</span>
                </button>
              )}

              {booking.canCancel && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-white to-cream/40 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 text-left"
                >
                  <X className="w-5 h-5 text-red-500" />
                  <span className="font-sans text-sm font-medium text-red-500">Cancel Booking</span>
                </button>
              )}

              {booking.status === 'CANCELLED' && (
                <Link
                  href={`/services/${booking.serviceSlug}`}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gold text-navy rounded-xl shadow-md hover:bg-gold-light transition-all duration-300 text-left"
                >
                  <CalendarDays className="w-5 h-5" />
                  <span className="font-sans text-sm font-semibold">Book Again</span>
                </Link>
              )}
            </div>
          </AnimatedSection>

          {/* Cancellation policy */}
          <AnimatedSection delay={0.28}>
            <BookingCancellationNote
              status={booking.status}
              cancellationDeadline={booking.cancellationDeadline}
              variant="detail"
            />
          </AnimatedSection>
        </div>
      </div>

      {/* ── Cancel Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {showCancelModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCancelModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-navy">Cancel Booking</h3>
                </div>

                <p className="font-sans text-sm text-charcoal/70">
                  Are you sure you want to cancel your <strong>{booking.service}</strong> booking
                  on <strong>{formatDate(booking.date)}</strong> at <strong>{booking.time}</strong>?
                </p>

                <p className="mt-3 font-sans text-xs text-charcoal/50">Ref: {booking.reference}</p>

                {booking.cancellationDeadline && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                    <p className="font-sans text-xs text-amber-700">
                      {new Date(booking.cancellationDeadline) > new Date()
                        ? 'Free cancellation — no fees apply.'
                        : '50% cancellation fee applies as the deadline has passed.'}
                    </p>
                  </div>
                )}

                <p className="mt-3 font-sans text-xs text-emerald-600">
                  The freed time slot will automatically become available for other customers.
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-2.5 border border-charcoal/15 text-navy font-sans text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-2.5 bg-red-500 text-white font-sans text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Reschedule Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {showRescheduleModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRescheduleModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 text-teal" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-navy">Reschedule Booking</h3>
                  </div>
                  <button onClick={() => setShowRescheduleModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="font-sans text-sm text-charcoal/70 mb-1">
                  <strong>{booking.service}</strong>
                </p>
                <p className="font-sans text-xs text-charcoal/50 mb-4">
                  Currently: {formatDate(booking.date)} at {booking.time}
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block font-sans text-sm font-medium text-navy mb-2">New Date</label>
                    <input
                      type="date"
                      value={newDate}
                      min={today}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-4 py-3 border border-charcoal/20 rounded-lg font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm font-medium text-navy mb-2">New Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map(time => (
                        <button
                          key={time}
                          onClick={() => setNewTime(time)}
                          className={cn(
                            'px-3 py-2 rounded-lg font-sans text-sm transition-all duration-200',
                            newTime === time
                              ? 'bg-gold text-white shadow-sm'
                              : 'border border-charcoal/20 text-charcoal hover:border-gold'
                          )}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="mt-4 font-sans text-xs text-emerald-600">
                  Your original time slot will be freed up for other customers.
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setShowRescheduleModal(false)}
                    className="flex-1 py-2.5 border border-charcoal/15 text-navy font-sans text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReschedule}
                    className="flex-1 py-2.5 bg-gold text-navy font-sans text-sm font-semibold rounded-lg hover:bg-gold-light transition-colors shadow-md"
                  >
                    Confirm Reschedule
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
