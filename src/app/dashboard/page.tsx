'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  Star,
  TrendingUp,
  ArrowRight,
  QrCode,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  Crown,
} from 'lucide-react'
import CountUp from 'react-countup'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import { SERVICES } from '@/lib/services'
import {
  CURRENT_USER,
  UPCOMING_BOOKINGS,
  PAST_BOOKINGS,
  SPENDING_CHART_DATA,
  SERVICE_HISTORY_CHART,
} from '@/lib/dashboard-data'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const statusStyles: Record<string, string> = {
  CONFIRMED: 'text-emerald-600',
  PENDING_PAYMENT: 'text-amber-600',
  COMPLETED: 'text-navy',
  CANCELLED: 'text-gray-400',
}

const statusDot: Record<string, string> = {
  CONFIRMED: 'bg-emerald-500',
  PENDING_PAYMENT: 'bg-amber-500 animate-pulse-dot',
  COMPLETED: 'bg-navy',
  CANCELLED: 'bg-gray-400',
}

const statusLabel: Record<string, string> = {
  CONFIRMED: 'Confirmed',
  PENDING_PAYMENT: 'Pending Payment',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

export default function DashboardPage() {
  const greeting = useMemo(() => getGreeting(), [])
  const nextBooking = UPCOMING_BOOKINGS[0]
  const otherUpcoming = UPCOMING_BOOKINGS.slice(1)
  const [qrOpen, setQrOpen] = useState(false)

  return (
    <div className="space-y-8">
      {/* Section A — Hero Welcome Card */}
      <AnimatedSection>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy via-navy-light to-[#1A4A7A] p-8 lg:p-10 animate-gradient">
          {/* Decorative circles */}
          <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute bottom-[-60px] left-[-20px] w-[250px] h-[250px] rounded-full bg-teal/5 blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="font-display text-3xl lg:text-4xl text-white">
                  <span className="font-light">{greeting}, </span>
                  <span className="font-bold">{CURRENT_USER.firstName}</span>
                </h1>
                <p className="mt-2 font-sans text-white/60 text-sm">
                  Welcome back to Ezra Annex
                </p>
              </div>
              <Link
                href="/services"
                className="bg-gold text-navy font-sans font-semibold text-sm rounded-full px-6 py-2.5 hover:bg-gold-light transition-all duration-300 shadow-md hover:shadow-gold flex items-center gap-2"
              >
                Book a Service
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats inside hero */}
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { label: 'Upcoming', value: UPCOMING_BOOKINGS.length, icon: CalendarDays },
                { label: 'Points', value: CURRENT_USER.loyaltyPoints, icon: Star },
                { label: 'Visits', value: CURRENT_USER.totalVisits, icon: TrendingUp },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4"
                >
                  <stat.icon className="w-5 h-5 text-gold/80 mb-2" />
                  <p className="font-display text-2xl lg:text-3xl font-bold text-white">
                    <CountUp end={stat.value} duration={1.5} separator="," />
                  </p>
                  <p className="font-sans text-xs text-white/60 uppercase tracking-wide mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Section B — Next Appointment */}
      <AnimatedSection delay={0.08}>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl lg:text-2xl text-navy font-semibold">
              Next Appointment
            </h2>
            <Link
              href="/dashboard/bookings"
              className="font-sans text-sm text-gold hover:text-gold-dark transition-colors flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {nextBooking ? (
            <>
              {/* Main booking card */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-[140px] h-[140px] rounded-2xl overflow-hidden shrink-0">
                  <Image
                    src={nextBooking.image}
                    alt={nextBooking.service}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="font-display text-xl font-semibold text-navy">
                        {nextBooking.service}
                        <span className="font-sans text-sm font-normal text-gray-400 ml-2">
                          {nextBooking.resource}
                        </span>
                      </p>
                      <p className="font-sans text-sm text-charcoal/70 mt-1">
                        {formatDate(nextBooking.date)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-4 font-sans text-sm text-charcoal/60">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {nextBooking.time} - {nextBooking.endTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {nextBooking.resource}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      with {nextBooking.staff}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5 font-sans text-sm font-medium">
                      <span className={cn('w-2 h-2 rounded-full', statusDot[nextBooking.status])} />
                      <span className={statusStyles[nextBooking.status]}>
                        {statusLabel[nextBooking.status]}
                      </span>
                    </span>
                    <span className="font-sans text-sm text-navy font-semibold">
                      {formatCurrency(nextBooking.amount)}
                    </span>
                    {nextBooking.paymentMethod && (
                      <span className="font-sans text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Paid
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => setQrOpen(!qrOpen)}
                      className="flex items-center gap-2 px-4 py-2 bg-navy text-white font-sans text-sm font-medium rounded-lg hover:bg-navy-light transition-all duration-300"
                    >
                      <QrCode className="w-4 h-4" />
                      QR Check-in
                    </button>
                    {nextBooking.canReschedule && (
                      <button className="px-4 py-2 border border-charcoal/20 text-navy font-sans text-sm font-medium rounded-lg hover:border-gold hover:shadow-sm transition-all duration-300">
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Other upcoming (mini cards) */}
              {otherUpcoming.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-3">
                    Also upcoming
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {otherUpcoming.map((booking) => (
                      <Link
                        key={booking.id}
                        href={`/dashboard/bookings/${booking.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-gold/30 hover:shadow-sm transition-all duration-300 group"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <Image src={booking.image} alt={booking.service} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm font-medium text-navy truncate">
                            {booking.service}
                          </p>
                          <p className="font-sans text-xs text-gray-400">
                            {formatDate(booking.date)} · {booking.time}
                          </p>
                        </div>
                        <span className="flex items-center gap-1">
                          <span className={cn('w-1.5 h-1.5 rounded-full', statusDot[booking.status])} />
                          <span className={cn('font-sans text-xs font-medium', statusStyles[booking.status])}>
                            {statusLabel[booking.status]}
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-4">
                <CalendarDays className="w-8 h-8 text-gold" />
              </div>
              <p className="font-display text-xl text-navy font-semibold">No upcoming appointments</p>
              <p className="font-sans text-sm text-gray-400 mt-1">Your schedule is clear — time to treat yourself</p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 mt-6 bg-gold text-navy font-sans font-semibold text-sm rounded-full px-6 py-3 hover:bg-gold-light transition-all"
              >
                Book an Experience <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* Section C — Loyalty Progress */}
      <AnimatedSection delay={0.16}>
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-gold/30 rounded-2xl p-6 lg:p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-2">
                Your Membership
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-gold to-gold-dark text-white font-sans">
                <Crown className="w-3 h-3" />
                GOLD MEMBER
              </span>
            </div>
            <p className="font-display text-3xl font-bold text-navy">
              <CountUp end={CURRENT_USER.loyaltyPoints} duration={1.5} separator="," /> <span className="text-base font-normal text-gray-400">points</span>
            </p>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-sans text-sm text-charcoal/60">
                Progress to {CURRENT_USER.nextTier}
              </span>
              <span className="font-sans text-sm font-medium text-navy">
                {Math.round((CURRENT_USER.loyaltyPoints / 5000) * 100)}%
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold"
                initial={{ width: 0 }}
                animate={{ width: `${(CURRENT_USER.loyaltyPoints / 5000) * 100}%` }}
                transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p className="mt-2 font-sans text-xs text-gray-400">
              {CURRENT_USER.loyaltyPoints.toLocaleString()} / 5,000 points needed
            </p>
          </div>

          <div className="mt-6 flex items-center gap-4 flex-wrap">
            <Link
              href="/dashboard/membership"
              className="font-sans text-sm text-gold-dark font-medium hover:underline flex items-center gap-1"
            >
              Earn more points <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/dashboard/membership"
              className="font-sans text-sm text-gold-dark font-medium hover:underline flex items-center gap-1"
            >
              How to redeem <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Section D — Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatedSection delay={0.24}>
          <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display text-lg text-navy font-semibold">Your Spending</h3>
              <Link href="/dashboard/payments" className="font-sans text-xs text-gold hover:text-gold-dark">
                View all
              </Link>
            </div>
            <p className="font-sans text-xs text-gray-400 mb-4">Last 6 months</p>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={SPENDING_CHART_DATA}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontFamily: 'var(--font-dm-sans)' }}
                  formatter={(value) => [`KES ${Number(value).toLocaleString()}`, 'Spent']}
                />
                <Area type="monotone" dataKey="amount" stroke="#C9A84C" strokeWidth={2} fill="url(#goldGradient)" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="font-sans text-xs text-gray-400">Total this year</p>
              <p className="font-display text-2xl font-bold text-navy">
                {formatCurrency(CURRENT_USER.totalSpent)}
              </p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.32}>
          <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6">
            <h3 className="font-display text-lg text-navy font-semibold mb-1">Favourite Services</h3>
            <p className="font-sans text-xs text-gray-400 mb-4">By number of visits</p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={SERVICE_HISTORY_CHART} layout="vertical" margin={{ left: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="service" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} width={80} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontFamily: 'var(--font-dm-sans)' }}
                  formatter={(value) => [`${value} visits`, 'Visits']}
                />
                <Bar dataKey="visits" fill="#0F2C4A" radius={[0, 6, 6, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AnimatedSection>
      </div>

      {/* Section E — Quick Book Strip */}
      <AnimatedSection delay={0.4}>
        <h3 className="font-display text-xl text-navy font-semibold mb-4">Quick Book</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2">
          {SERVICES.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group shrink-0 w-[160px] rounded-2xl overflow-hidden relative h-[110px] border-2 border-transparent hover:border-gold transition-all duration-300 hover:scale-105"
            >
              <Image
                src={service.image}
                alt={service.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="font-display text-sm font-semibold text-white">{service.name}</p>
                <p className="font-sans text-[10px] text-white/60">{formatCurrency(service.basePrice)}+</p>
              </div>
            </Link>
          ))}
        </div>
      </AnimatedSection>

      {/* Section F — Recent Activity */}
      <AnimatedSection delay={0.48}>
        <h3 className="font-display text-xl text-navy font-semibold mb-4">Recent Activity</h3>
        <div className="relative pl-6">
          {/* Gold timeline line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-gold via-gold/40 to-transparent" />

          <div className="space-y-6">
            {PAST_BOOKINGS.slice(0, 3).map((booking, i) => (
              <AnimatedSection key={booking.id} delay={0.5 + i * 0.08}>
                <div className="relative flex items-start gap-4">
                  {/* Dot */}
                  <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-gold" />

                  <div className="flex-1 bg-gradient-to-br from-white to-cream/40 rounded-xl shadow-card p-4 hover:shadow-card-hover transition-all duration-300">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-sans text-sm font-medium text-navy">{booking.service}</p>
                        <p className="font-sans text-xs text-gray-400 mt-0.5">
                          {formatDate(booking.date)} · {booking.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-sans text-sm font-semibold text-navy">
                          {formatCurrency(booking.amount)}
                        </span>
                        <span className={cn(
                          'font-sans text-xs font-medium rounded-full px-2.5 py-0.5',
                          booking.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                          booking.status === 'CANCELLED' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'
                        )}>
                          {statusLabel[booking.status]}
                        </span>
                      </div>
                    </div>
                    {booking.status === 'COMPLETED' && (
                      <div className="mt-3 flex items-center justify-between">
                        {booking.rating && (
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
                        )}
                        <Link
                          href={`/services/${booking.serviceSlug}`}
                          className="font-sans text-xs text-gold font-medium hover:text-gold-dark flex items-center gap-1"
                        >
                          Book Again <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
