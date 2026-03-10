'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Phone, ChevronDown, Minus, Plus, UserPlus, X, AlertCircle, Bell } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { SERVICES } from '@/lib/services'
import { useBooking, isClosedDay, PUBLIC_HOLIDAYS } from '@/lib/booking-context'

interface BookingWidgetProps {
  serviceName: string
  basePrice: number
  duration: string
}

const TIME_SLOTS = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
]

export function BookingWidget({
  serviceName,
  basePrice,
  duration,
}: BookingWidgetProps) {
  const router = useRouter()
  const { createBooking, getBookedTimes } = useBooking()

  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [guests, setGuests] = useState(1)
  const [showRequest, setShowRequest] = useState(false)
  const [specialRequest, setSpecialRequest] = useState('')
  const [smsReminder, setSmsReminder] = useState(true)

  // Multi-service selection
  const [additionalServices, setAdditionalServices] = useState<string[]>([])
  const [showServicePicker, setShowServicePicker] = useState(false)

  // Book for someone else
  const [bookingForOther, setBookingForOther] = useState(false)
  const [otherName, setOtherName] = useState('')
  const [otherPhone, setOtherPhone] = useState('')

  // Available services to add (excluding current)
  const otherServices = SERVICES.filter(s => s.name !== serviceName)

  // Check if selected date is closed
  const closedReason = selectedDate ? isClosedDay(selectedDate) : null

  // Get already-booked times for the selected date
  const bookedTimes = selectedDate ? getBookedTimes(selectedDate) : []

  // Calculate total price
  const totalPrice = useMemo(() => {
    let total = basePrice
    additionalServices.forEach(name => {
      const svc = SERVICES.find(s => s.name === name)
      if (svc) total += svc.basePrice
    })
    return total * guests
  }, [basePrice, additionalServices, guests])

  // Calculate total duration
  const totalDuration = useMemo(() => {
    const parseMins = (d: string) => {
      const m = d.match(/(\d+)\s*min/i)
      if (m) return parseInt(m[1])
      const h = d.match(/(\d+)\s*hr/i)
      if (h) return parseInt(h[1]) * 60
      return 60
    }
    let mins = parseMins(duration)
    additionalServices.forEach(name => {
      const svc = SERVICES.find(s => s.name === name)
      if (svc) mins += parseMins(svc.duration)
    })
    if (mins >= 60) {
      const h = Math.floor(mins / 60)
      const m = mins % 60
      return m > 0 ? `${h} hr ${m} min` : `${h} hr`
    }
    return `${mins} min`
  }, [duration, additionalServices])

  const toggleService = (name: string) => {
    setAdditionalServices(prev =>
      prev.includes(name)
        ? prev.filter(s => s !== name)
        : [...prev, name]
    )
  }

  // Get today's date string for min attr
  const today = new Date().toISOString().split('T')[0]

  const handleBook = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time')
      return
    }
    if (closedReason) {
      toast.error(closedReason)
      return
    }
    if (bookingForOther && (!otherName.trim() || !otherPhone.trim())) {
      toast.error('Please fill in the name and phone for the person you\'re booking for')
      return
    }

    const allServiceNames = [serviceName, ...additionalServices]
    const currentService = SERVICES.find(s => s.name === serviceName)

    createBooking({
      service: allServiceNames.length > 1 ? allServiceNames.join(' + ') : serviceName,
      serviceSlug: currentService?.slug || '',
      serviceCategory: currentService?.category || '',
      resource: '',
      staff: '',
      date: selectedDate,
      time: selectedTime,
      endTime: '',
      duration: totalDuration,
      guests,
      status: 'CONFIRMED',
      amount: totalPrice,
      paymentMethod: 'MPESA',
      mpesaRef: `QJK${Date.now().toString(36).toUpperCase()}`,
      image: currentService?.image || '',
      notes: specialRequest || null,
      canReschedule: true,
      canCancel: true,
      cancellationDeadline: new Date(new Date(selectedDate).getTime() - 86400000).toISOString(),
      rating: null,
      review: null,
      bookedFor: bookingForOther ? { name: otherName, phone: otherPhone } : null,
      services: allServiceNames,
      smsReminder,
    })

    toast.success('Booking confirmed! Redirecting...')
    setTimeout(() => router.push('/dashboard/booking-confirmed'), 500)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gold/20 p-6 sticky top-24">
      <h3 className="font-display text-xl font-semibold text-navy">
        Book This Service
      </h3>

      {/* Price */}
      <div className="mt-4">
        <p className="font-display text-2xl text-gold font-semibold">
          From {formatCurrency(basePrice)}
        </p>
        <p className="font-sans text-sm text-charcoal/50">{duration}</p>
      </div>

      {/* ── Add More Services ────────────────────────────── */}
      <div className="mt-6">
        <button
          onClick={() => setShowServicePicker(!showServicePicker)}
          className="flex items-center gap-2 font-sans text-sm text-gold hover:text-gold-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Another Service
          <ChevronDown className={cn('w-4 h-4 transition-transform', showServicePicker && 'rotate-180')} />
        </button>

        {showServicePicker && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
            {otherServices.map(svc => (
              <label
                key={svc.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                  additionalServices.includes(svc.name)
                    ? 'border-gold bg-gold/5'
                    : 'border-charcoal/10 hover:border-gold/40'
                )}
              >
                <input
                  type="checkbox"
                  checked={additionalServices.includes(svc.name)}
                  onChange={() => toggleService(svc.name)}
                  className="sr-only"
                />
                <div className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors',
                  additionalServices.includes(svc.name)
                    ? 'border-gold bg-gold text-white'
                    : 'border-charcoal/20'
                )}>
                  {additionalServices.includes(svc.name) && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm font-medium text-navy">{svc.name}</p>
                  <p className="font-sans text-xs text-charcoal/50">{svc.duration}</p>
                </div>
                <p className="font-sans text-sm font-medium text-gold shrink-0">
                  +{formatCurrency(svc.basePrice)}
                </p>
              </label>
            ))}
          </div>
        )}

        {/* Selected services summary */}
        {additionalServices.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {additionalServices.map(name => (
              <div key={name} className="flex items-center gap-2 px-3 py-1.5 bg-gold/5 rounded-lg">
                <span className="font-sans text-xs text-navy flex-1">{name}</span>
                <button
                  onClick={() => toggleService(name)}
                  className="text-charcoal/40 hover:text-red-500 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-charcoal/10">
              <span className="font-sans text-xs text-charcoal/50">
                Combined duration: {totalDuration}
              </span>
              <span className="font-sans text-sm font-semibold text-gold">
                Total: {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Date ─────────────────────────────────────────── */}
      <div className="mt-6">
        <label className="block font-sans text-sm font-medium text-navy mb-2">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          min={today}
          onChange={(e) => {
            setSelectedDate(e.target.value)
            setSelectedTime('')
          }}
          className="w-full px-4 py-3 border border-charcoal/20 rounded-lg font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
        />
        {closedReason && (
          <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <p className="font-sans text-xs text-red-600">{closedReason}</p>
          </div>
        )}
        {selectedDate && !closedReason && (
          <p className="mt-1.5 font-sans text-xs text-emerald-600">
            {new Date(selectedDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        )}
      </div>

      {/* ── Time Slots ───────────────────────────────────── */}
      <div className="mt-6">
        <label className="block font-sans text-sm font-medium text-navy mb-2">
          Select Time
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((time) => {
            const isBooked = bookedTimes.includes(time)
            const disabled = !!closedReason || isBooked

            return (
              <button
                key={time}
                onClick={() => !disabled && setSelectedTime(time)}
                disabled={disabled}
                className={cn(
                  'px-3 py-2 rounded-lg font-sans text-sm transition-all duration-200',
                  disabled
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                    : selectedTime === time
                    ? 'bg-gold text-white shadow-sm'
                    : 'border border-charcoal/20 text-charcoal hover:border-gold'
                )}
                title={isBooked ? 'Already booked' : undefined}
              >
                {time}
              </button>
            )
          })}
        </div>
        {bookedTimes.length > 0 && !closedReason && (
          <p className="mt-2 font-sans text-xs text-charcoal/40">
            Greyed-out slots are already booked
          </p>
        )}
      </div>

      {/* ── Guests ───────────────────────────────────────── */}
      <div className="mt-6">
        <label className="block font-sans text-sm font-medium text-navy mb-2">
          Guests
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setGuests(Math.max(1, guests - 1))}
            className="w-10 h-10 rounded-lg border border-charcoal/20 flex items-center justify-center hover:border-gold transition-colors"
            aria-label="Decrease guests"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-sans text-lg font-medium w-8 text-center">
            {guests}
          </span>
          <button
            onClick={() => setGuests(Math.min(20, guests + 1))}
            className="w-10 h-10 rounded-lg border border-charcoal/20 flex items-center justify-center hover:border-gold transition-colors"
            aria-label="Increase guests"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Book for Someone Else ────────────────────────── */}
      <div className="mt-6">
        <button
          onClick={() => setBookingForOther(!bookingForOther)}
          className="flex items-center gap-2 font-sans text-sm text-gold hover:text-gold-dark transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          {bookingForOther ? 'Booking for myself' : 'Book for someone else'}
        </button>
        {bookingForOther && (
          <div className="mt-3 space-y-3 p-4 bg-cream/50 rounded-lg border border-gold/10">
            <p className="font-sans text-xs text-charcoal/60">
              Enter the details of the person this booking is for
            </p>
            <input
              type="text"
              value={otherName}
              onChange={(e) => setOtherName(e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-2.5 border border-charcoal/20 rounded-lg font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
            />
            <input
              type="tel"
              value={otherPhone}
              onChange={(e) => setOtherPhone(e.target.value)}
              placeholder="Phone number (e.g. +254...)"
              className="w-full px-4 py-2.5 border border-charcoal/20 rounded-lg font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
            />
          </div>
        )}
      </div>

      {/* ── SMS Reminder Toggle ──────────────────────────── */}
      <div className="mt-6 flex items-center justify-between">
        <label className="flex items-center gap-2 font-sans text-sm text-navy cursor-pointer">
          <Bell className="w-4 h-4 text-charcoal/40" />
          SMS Reminder
        </label>
        <button
          onClick={() => setSmsReminder(!smsReminder)}
          className={cn(
            'relative w-11 h-6 rounded-full transition-colors duration-200',
            smsReminder ? 'bg-gold' : 'bg-charcoal/20'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
              smsReminder && 'translate-x-5'
            )}
          />
        </button>
      </div>
      {smsReminder && (
        <p className="mt-1 font-sans text-xs text-charcoal/40">
          We&apos;ll send you a reminder SMS 24 hours before your appointment
        </p>
      )}

      {/* ── Special Request ──────────────────────────────── */}
      <div className="mt-6">
        <button
          onClick={() => setShowRequest(!showRequest)}
          className="flex items-center gap-2 font-sans text-sm text-gold hover:text-gold-dark transition-colors"
        >
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform',
              showRequest && 'rotate-180'
            )}
          />
          Add Special Request
        </button>
        {showRequest && (
          <textarea
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
            placeholder="Any special requirements..."
            className="mt-3 w-full px-4 py-3 border border-charcoal/20 rounded-lg font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition resize-none h-24"
          />
        )}
      </div>

      {/* ── Total & Book Button ──────────────────────────── */}
      {(additionalServices.length > 0 || guests > 1) && (
        <div className="mt-4 p-3 bg-navy/5 rounded-lg">
          <div className="flex justify-between font-sans text-sm">
            <span className="text-charcoal/60">Subtotal</span>
            <span className="font-medium text-navy">{formatCurrency(totalPrice)}</span>
          </div>
          {guests > 1 && (
            <p className="font-sans text-xs text-charcoal/40 mt-1">
              {guests} guests × {formatCurrency(totalPrice / guests)} each
            </p>
          )}
        </div>
      )}

      <button
        onClick={handleBook}
        disabled={!!closedReason}
        className={cn(
          'mt-6 w-full py-4 font-sans font-medium text-lg rounded-lg transition-all duration-300 shadow-md hover:shadow-lg',
          closedReason
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-gold text-navy-dark hover:bg-gold-light'
        )}
      >
        {additionalServices.length > 0
          ? `Book ${additionalServices.length + 1} Services`
          : 'Book Now'}
      </button>

      {/* Trust indicators */}
      <div className="mt-4 space-y-2">
        <p className="flex items-center gap-2 font-sans text-xs text-charcoal/50">
          <Lock className="w-3.5 h-3.5" />
          Secure M-Pesa payment
        </p>
        <p className="flex items-center gap-2 font-sans text-xs text-charcoal/50">
          <Phone className="w-3.5 h-3.5" />
          Instant confirmation by SMS
        </p>
      </div>
    </div>
  )
}
