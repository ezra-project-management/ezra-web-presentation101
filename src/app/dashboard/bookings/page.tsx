'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Star, ArrowRight, QrCode, LayoutGrid, List, X, RefreshCw, AlertTriangle, CalendarDays } from 'lucide-react'
import { toast } from 'sonner'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import { useBooking, type BookingStatus, type BookingRecord } from '@/lib/booking-context'
import { BookingCancellationNote } from '@/components/booking/BookingCancellationNote'

const tabs = [
  { key: 'All', filter: () => true },
  { key: 'Upcoming', filter: (s: BookingStatus) => s === 'CONFIRMED' || s === 'PENDING_PAYMENT' },
  { key: 'Completed', filter: (s: BookingStatus) => s === 'COMPLETED' },
  { key: 'Cancelled', filter: (s: BookingStatus) => s === 'CANCELLED' },
  { key: 'Pending Payment', filter: (s: BookingStatus) => s === 'PENDING_PAYMENT' },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const statusStyles: Record<BookingStatus, { dot: string; text: string; bg: string }> = {
  CONFIRMED: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  PENDING_PAYMENT: { dot: 'bg-amber-500 animate-pulse-dot', text: 'text-amber-700', bg: 'bg-amber-50' },
  COMPLETED: { dot: 'bg-navy', text: 'text-navy', bg: 'bg-navy/5' },
  CANCELLED: { dot: 'bg-gray-400', text: 'text-gray-500', bg: 'bg-gray-50' },
}

const statusLabel: Record<BookingStatus, string> = {
  CONFIRMED: 'Confirmed',
  PENDING_PAYMENT: 'Pending Payment',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
]

export default function BookingsPage() {
  const { bookings, cancelBooking, rescheduleBooking } = useBooking()
  const [activeTab, setActiveTab] = useState('All')
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards')

  // Modal state
  const [cancelModal, setCancelModal] = useState<BookingRecord | null>(null)
  const [rescheduleModal, setRescheduleModal] = useState<BookingRecord | null>(null)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')

  const getCount = (filter: (s: BookingStatus) => boolean) =>
    bookings.filter(b => filter(b.status)).length

  const activeFilter = tabs.find(t => t.key === activeTab)!.filter
  const filtered = activeTab === 'All'
    ? bookings
    : bookings.filter(b => activeFilter(b.status))

  const totalCount = bookings.length
  const upcomingCount = getCount(s => s === 'CONFIRMED' || s === 'PENDING_PAYMENT')
  const completedCount = getCount(s => s === 'COMPLETED')
  const cancelledCount = getCount(s => s === 'CANCELLED')

  const today = new Date().toISOString().split('T')[0]

  const handleCancel = () => {
    if (!cancelModal) return
    cancelBooking(cancelModal.id)
    toast.success(`Booking ${cancelModal.reference} cancelled. The time slot is now available for others.`)
    setCancelModal(null)
  }

  const handleReschedule = () => {
    if (!rescheduleModal || !newDate || !newTime) {
      toast.error('Please select a new date and time')
      return
    }
    rescheduleBooking(rescheduleModal.id, newDate, newTime)
    toast.success(`Booking rescheduled to ${formatDate(newDate)} at ${newTime}`)
    setRescheduleModal(null)
    setNewDate('')
    setNewTime('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl text-navy font-semibold">
              My Bookings
            </h1>
            <p className="mt-1 font-sans text-sm text-gray-400">
              {totalCount} total &middot; {upcomingCount} upcoming &middot; {completedCount} completed &middot; {cancelledCount} cancelled
            </p>
          </div>
          <Link
            href="/dashboard/bookings/new"
            className="flex items-center gap-2 bg-gold text-navy font-sans text-sm font-semibold rounded-lg px-5 py-2.5 hover:bg-gold-light transition-all duration-300 shadow-md"
          >
            <Plus className="w-4 h-4" />
            New Booking
          </Link>
        </div>
      </AnimatedSection>

      {/* Tabs + View Toggle */}
      <AnimatedSection delay={0.08}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {tabs.map((tab) => {
              const count = tab.key === 'All' ? totalCount : getCount(tab.filter)
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'relative flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-sm font-medium transition-all duration-200 whitespace-nowrap',
                    activeTab === tab.key
                      ? 'bg-navy text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {tab.key}
                  <span className={cn(
                    'text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center',
                    activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500'
                  )}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                viewMode === 'cards' ? 'bg-white shadow-sm text-navy' : 'text-gray-400'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded-md transition-colors',
                viewMode === 'list' ? 'bg-white shadow-sm text-navy' : 'text-gray-400'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* Bookings */}
      {filtered.length === 0 ? (
        <AnimatedSection delay={0.16}>
          <div className="text-center py-16 bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card">
            <p className="font-display text-xl text-navy font-semibold">No bookings found</p>
            <p className="font-sans text-sm text-gray-400 mt-1">Try a different filter</p>
          </div>
        </AnimatedSection>
      ) : viewMode === 'cards' ? (
        <div className="space-y-4">
          {filtered.map((booking, i) => (
            <AnimatedSection key={booking.id} delay={0.12 + i * 0.05}>
              <div className={cn(
                'bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 p-5',
                booking.status === 'PENDING_PAYMENT' && 'border-l-4 border-amber-400',
                booking.status === 'CANCELLED' && 'opacity-70'
              )}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative w-full md:w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    {booking.image ? (
                      <Image src={booking.image} alt={booking.service} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-navy/10 flex items-center justify-center">
                        <CalendarDays className="w-6 h-6 text-navy/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <p className={cn(
                          'font-display text-lg font-semibold text-navy',
                          booking.status === 'CANCELLED' && 'line-through text-gray-400'
                        )}>
                          {booking.service}
                        </p>
                        {booking.resource && (
                          <p className="font-sans text-xs text-gray-400">{booking.resource} · with {booking.staff}</p>
                        )}
                        {booking.bookedFor && (
                          <p className="font-sans text-xs text-gold mt-0.5">
                            Booked for: {booking.bookedFor.name} ({booking.bookedFor.phone})
                          </p>
                        )}
                        {booking.services.length > 1 && (
                          <p className="font-sans text-xs text-charcoal/50 mt-0.5">
                            {booking.services.length} services combined
                          </p>
                        )}
                      </div>
                      <span className={cn(
                        'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                        statusStyles[booking.status].bg,
                        statusStyles[booking.status].text
                      )}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', statusStyles[booking.status].dot)} />
                        {statusLabel[booking.status]}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-4 flex-wrap font-sans text-sm text-gray-500">
                      <span>{formatDate(booking.date)}</span>
                      <span>{booking.time}{booking.endTime ? ` - ${booking.endTime}` : ''}</span>
                      <span className="font-medium text-navy">{formatCurrency(booking.amount)}</span>
                      <span className="font-mono text-xs text-gray-400">{booking.reference}</span>
                    </div>

                    {booking.paymentMethod && (
                      <p className="mt-1 font-sans text-xs text-gray-400">
                        {booking.paymentMethod}{booking.mpesaRef ? ` · ${booking.mpesaRef}` : ''}
                      </p>
                    )}

                    <BookingCancellationNote
                      status={booking.status}
                      cancellationDeadline={booking.cancellationDeadline}
                      variant="card"
                    />

                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                      {booking.status === 'PENDING_PAYMENT' && (
                        <button className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white font-sans text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors">
                          Complete Payment
                        </button>
                      )}
                      {(booking.status === 'CONFIRMED' || booking.status === 'PENDING_PAYMENT') && (
                        <>
                          <Link
                            href={`/dashboard/bookings/${booking.id}`}
                            className="flex items-center gap-1.5 px-4 py-2 border border-charcoal/15 text-navy font-sans text-sm font-medium rounded-lg hover:border-gold hover:shadow-sm transition-all duration-300"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            QR Code
                          </Link>
                          {booking.canReschedule && (
                            <button
                              onClick={() => {
                                setRescheduleModal(booking)
                                setNewDate(booking.date)
                                setNewTime(booking.time)
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 border border-teal/30 text-teal font-sans text-sm font-medium rounded-lg hover:bg-teal/5 transition-all"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              Reschedule
                            </button>
                          )}
                          {booking.canCancel && (
                            <button
                              onClick={() => setCancelModal(booking)}
                              className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 font-sans text-sm font-medium rounded-lg hover:bg-red-50 transition-all"
                            >
                              <X className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          )}
                          <Link
                            href={`/dashboard/bookings/${booking.id}`}
                            className="font-sans text-sm text-gold font-medium hover:text-gold-dark"
                          >
                            View Details
                          </Link>
                        </>
                      )}
                      {booking.status === 'COMPLETED' && (
                        <>
                          {booking.rating ? (
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <Star
                                  key={j}
                                  className={cn(
                                    'w-3.5 h-3.5',
                                    j < booking.rating! ? 'text-gold fill-gold' : 'text-gray-200'
                                  )}
                                />
                              ))}
                            </div>
                          ) : (
                            <button className="font-sans text-sm text-gold font-medium hover:text-gold-dark flex items-center gap-1">
                              Rate your experience <Star className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <Link
                            href={`/services/${booking.serviceSlug}`}
                            className="font-sans text-sm text-navy font-medium hover:text-gold flex items-center gap-1"
                          >
                            Book Again <ArrowRight className="w-3 h-3" />
                          </Link>
                        </>
                      )}
                      {booking.status === 'CANCELLED' && (
                        <Link
                          href={`/services/${booking.serviceSlug}`}
                          className="font-sans text-sm text-gold font-medium hover:text-gold-dark flex items-center gap-1"
                        >
                          Book Again <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      ) : (
        /* List view */
        <AnimatedSection delay={0.16}>
          <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left font-sans text-xs uppercase tracking-widest text-gray-400 px-5 py-3">Service</th>
                    <th className="text-left font-sans text-xs uppercase tracking-widest text-gray-400 px-5 py-3">Date</th>
                    <th className="text-left font-sans text-xs uppercase tracking-widest text-gray-400 px-5 py-3">Reference</th>
                    <th className="text-left font-sans text-xs uppercase tracking-widest text-gray-400 px-5 py-3">Amount</th>
                    <th className="text-left font-sans text-xs uppercase tracking-widest text-gray-400 px-5 py-3">Status</th>
                    <th className="text-right font-sans text-xs uppercase tracking-widest text-gray-400 px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-50 hover:bg-cream/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                            {booking.image ? (
                              <Image src={booking.image} alt={booking.service} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-navy/10" />
                            )}
                          </div>
                          <div>
                            <span className="font-sans text-sm font-medium text-navy">{booking.service}</span>
                            {booking.bookedFor && (
                              <p className="font-sans text-[10px] text-gold">For: {booking.bookedFor.name}</p>
                            )}
                            <BookingCancellationNote
                              status={booking.status}
                              cancellationDeadline={booking.cancellationDeadline}
                              variant="compact"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-sans text-sm text-gray-500">{formatDate(booking.date)}</td>
                      <td className="px-5 py-4 font-mono text-xs text-gray-400">{booking.reference}</td>
                      <td className="px-5 py-4 font-sans text-sm font-medium text-navy">{formatCurrency(booking.amount)}</td>
                      <td className="px-5 py-4">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                          statusStyles[booking.status].bg,
                          statusStyles[booking.status].text
                        )}>
                          <span className={cn('w-1.5 h-1.5 rounded-full', statusStyles[booking.status].dot)} />
                          {statusLabel[booking.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          {booking.canCancel && (
                            <button
                              onClick={() => setCancelModal(booking)}
                              className="font-sans text-xs text-red-500 font-medium hover:text-red-600"
                            >
                              Cancel
                            </button>
                          )}
                          {booking.canReschedule && (
                            <button
                              onClick={() => {
                                setRescheduleModal(booking)
                                setNewDate(booking.date)
                                setNewTime(booking.time)
                              }}
                              className="font-sans text-xs text-teal font-medium hover:text-teal-600"
                            >
                              Reschedule
                            </button>
                          )}
                          <Link href={`/dashboard/bookings/${booking.id}`} className="font-sans text-xs text-gold font-medium hover:text-gold-dark">
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>
      )}

      {/* ── Cancel Modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {cancelModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelModal(null)}
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
                  Are you sure you want to cancel your <strong>{cancelModal.service}</strong> booking
                  on <strong>{formatDate(cancelModal.date)}</strong> at <strong>{cancelModal.time}</strong>?
                </p>

                <p className="mt-3 font-sans text-xs text-charcoal/50">
                  Ref: {cancelModal.reference}
                </p>

                {cancelModal.cancellationDeadline && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                    <p className="font-sans text-xs text-amber-700">
                      {new Date(cancelModal.cancellationDeadline) > new Date()
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
                    onClick={() => setCancelModal(null)}
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
        {rescheduleModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRescheduleModal(null)}
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
                  <button onClick={() => setRescheduleModal(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="font-sans text-sm text-charcoal/70 mb-1">
                  <strong>{rescheduleModal.service}</strong>
                </p>
                <p className="font-sans text-xs text-charcoal/50 mb-4">
                  Currently: {formatDate(rescheduleModal.date)} at {rescheduleModal.time}
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block font-sans text-sm font-medium text-navy mb-2">
                      New Date
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      min={today}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="w-full px-4 py-3 border border-charcoal/20 rounded-lg font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm font-medium text-navy mb-2">
                      New Time
                    </label>
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
                    onClick={() => setRescheduleModal(null)}
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
