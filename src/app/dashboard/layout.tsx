'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  CalendarDays,
  Crown,
  CreditCard,
  Heart,
  Bell,
  User,
  Globe,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CURRENT_USER, UPCOMING_BOOKINGS, NOTIFICATIONS_DATA } from '@/lib/dashboard-data'
import { BookingProvider } from '@/lib/booking-context'

const navLinks = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, badge: 0 },
  { name: 'Bookings', href: '/dashboard/bookings', icon: CalendarDays, badge: UPCOMING_BOOKINGS.length },
  { name: 'Membership', href: '/dashboard/membership', icon: Crown, badge: 0 },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard, badge: 0 },
  { name: 'Favourites', href: '/dashboard/favourites', icon: Heart, badge: 0 },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: NOTIFICATIONS_DATA.filter(n => !n.read).length },
  { name: 'Profile', href: '/dashboard/profile', icon: User, badge: 0 },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [sidebarHover, setSidebarHover] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const unreadCount = NOTIFICATIONS_DATA.filter(n => !n.read).length

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handler = () => setScrolled(el.scrollTop > 80)
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSidebarHover(false)
  }, [pathname])

  return (
    <BookingProvider>
    <div className="h-screen overflow-hidden bg-cream/30 relative">

      {/* ═══════ DESKTOP: COMPACT FLOATING PILL (not scrolled) ═══════ */}
      <AnimatePresence>
        {!scrolled && (
          <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden lg:block"
          >
            <div className="flex items-center gap-1 px-2 py-1.5 bg-navy/85 backdrop-blur-2xl rounded-full border border-white/[0.12] shadow-[0_4px_30px_rgba(15,44,74,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]">
              {/* Avatar + Name */}
              <Link href="/dashboard/profile" className="flex items-center gap-2 pl-1.5 pr-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/40 text-white flex items-center justify-center font-display text-xs font-bold">
                  {CURRENT_USER.initials}
                </div>
                <div className="hidden xl:block">
                  <p className="font-sans text-xs font-semibold text-white leading-tight">{CURRENT_USER.firstName}</p>
                  <p className="font-sans text-[9px] text-gold/80 font-medium">Gold Member</p>
                </div>
              </Link>

              {/* Divider */}
              <div className="w-px h-6 bg-white/10" />

              {/* Nav links — icons + labels on xl */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'relative flex items-center gap-1.5 px-3 py-2 rounded-full transition-all duration-300 group',
                    isActive(link.href)
                      ? 'text-navy-dark'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                  title={link.name}
                >
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="dashPill"
                      className="absolute inset-0 bg-gold rounded-full"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <link.icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 hidden xl:inline font-sans text-xs font-medium">{link.name}</span>
                  {link.badge > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 z-20 w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center ring-2 ring-navy/50">
                      {link.badge}
                    </span>
                  )}
                  {/* Tooltip — only when labels hidden */}
                  <span className="xl:hidden absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-navy/90 text-white text-[11px] font-sans rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                    {link.name}
                  </span>
                </Link>
              ))}

              {/* Divider */}
              <div className="w-px h-6 bg-white/10" />

              {/* Back to website */}
              <Link
                href="/"
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                title="Back to website"
              >
                <Globe className="w-4 h-4" />
                <span className="xl:hidden absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-navy/90 text-white text-[11px] font-sans rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                  Website
                </span>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ═══════ DESKTOP: OVAL SIDEBAR (scrolled) ═══════ */}
      <AnimatePresence>
        {scrolled && (
          <motion.nav
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-3 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
            onMouseEnter={() => setSidebarHover(true)}
            onMouseLeave={() => setSidebarHover(false)}
          >
            <motion.div
              animate={{ width: sidebarHover ? 200 : 56 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-navy/85 backdrop-blur-2xl rounded-[30px] border border-white/[0.12] shadow-[0_8px_40px_rgba(15,44,74,0.4),inset_0_1px_0_rgba(255,255,255,0.08)] py-3 px-2 overflow-hidden"
            >
              {/* Avatar */}
              <Link href="/dashboard/profile" className="flex items-center gap-3 px-1.5 py-2 mb-1 rounded-full hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/40 text-white flex items-center justify-center font-display text-xs font-bold shrink-0">
                  {CURRENT_USER.initials}
                </div>
                <AnimatePresence>
                  {sidebarHover && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      <p className="font-sans text-sm font-semibold text-white leading-tight">
                        {CURRENT_USER.firstName}
                      </p>
                      <p className="font-sans text-[10px] text-gold font-medium">Gold Member</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>

              <div className="w-8 h-px bg-white/10 mx-auto my-1.5" />

              {/* Nav */}
              <div className="space-y-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      'relative flex items-center gap-3 px-1.5 py-2 rounded-full font-sans text-sm transition-all duration-300',
                      isActive(link.href)
                        ? 'bg-gold/20 text-gold'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0">
                      <link.icon className="w-4 h-4" />
                    </div>
                    <AnimatePresence>
                      {sidebarHover && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="overflow-hidden whitespace-nowrap font-medium"
                        >
                          {link.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {link.badge > 0 && (
                      <span className={cn(
                        'bg-red-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-navy/40',
                        sidebarHover ? 'ml-auto' : 'absolute top-0.5 right-0.5'
                      )}>
                        {link.badge}
                      </span>
                    )}
                    {isActive(link.href) && (
                      <motion.div
                        layoutId="dashSide"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gold rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
              </div>

              <div className="w-8 h-px bg-white/10 mx-auto my-1.5" />

              {/* Bottom */}
              <Link
                href="/"
                className="flex items-center gap-3 px-1.5 py-2 rounded-full font-sans text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <AnimatePresence>
                  {sidebarHover && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap font-medium"
                    >
                      Website
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <button className="w-full flex items-center gap-3 px-1.5 py-2 rounded-full font-sans text-sm text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0">
                  <LogOut className="w-4 h-4" />
                </div>
                <AnimatePresence>
                  {sidebarHover && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap font-medium"
                    >
                      Sign Out
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ═══════ MOBILE: BOTTOM DOCK BAR ═══════ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-3 mb-3">
          <div className="flex items-center justify-around py-2 px-1 bg-navy/85 backdrop-blur-2xl rounded-full border border-white/[0.12] shadow-[0_-4px_30px_rgba(15,44,74,0.4),inset_0_1px_0_rgba(255,255,255,0.08)]">
            {navLinks.slice(0, 5).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-300',
                  isActive(link.href)
                    ? 'text-gold'
                    : 'text-white/75 active:scale-95'
                )}
              >
                {isActive(link.href) && (
                  <motion.span
                    layoutId="mobileDock"
                    className="absolute inset-0 bg-gold/15 rounded-2xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <link.icon className="w-4.5 h-4.5 relative z-10" />
                <span className="relative z-10 text-[9px] font-sans font-medium">{link.name}</span>
                {link.badge > 0 && (
                  <span className="absolute top-0.5 right-1 z-20 w-3.5 h-3.5 bg-red-500 text-white text-[7px] font-bold rounded-full flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            {/* More button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-white/40 active:scale-95 transition-transform"
            >
              <Menu className="w-4.5 h-4.5" />
              <span className="text-[9px] font-sans font-medium">More</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile "More" sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 max-h-[80vh]"
            >
              <div className="mx-2 mb-2 bg-navy/90 backdrop-blur-2xl rounded-3xl border border-white/[0.12] shadow-[0_-8px_40px_rgba(15,44,74,0.4)] overflow-hidden">
                {/* Drag handle */}
                <div className="flex justify-center pt-3 pb-2">
                  <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>

                {/* User card */}
                <div className="flex items-center gap-3 mx-4 mb-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/40 text-white flex items-center justify-center font-display text-sm font-bold">
                    {CURRENT_USER.initials}
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-base font-semibold text-white">
                      {CURRENT_USER.firstName} {CURRENT_USER.lastName}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-gold border border-gold/30 font-sans">
                        <Crown className="w-2.5 h-2.5" />
                        GOLD
                      </span>
                      <span className="font-sans text-[10px] text-white/40">{CURRENT_USER.loyaltyPoints.toLocaleString()} pts</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white/60" />
                  </button>
                </div>

                {/* All nav links */}
                <div className="px-3 pb-2 space-y-0.5">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-2xl font-sans text-sm font-medium transition-all',
                          isActive(link.href)
                            ? 'bg-gold/15 text-gold'
                            : 'text-white/75 active:bg-white/5'
                        )}
                      >
                        <link.icon className="w-5 h-5" />
                        {link.name}
                        {link.badge > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="mx-6 h-px bg-white/10" />

                <div className="px-3 py-2 space-y-0.5">
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl font-sans text-sm text-white/50 active:bg-white/5 transition-all"
                  >
                    <Globe className="w-5 h-5" />
                    Back to Website
                  </Link>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-sans text-sm text-white/75 active:text-red-400 active:bg-red-500/10 transition-all">
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>

                {/* Safe area spacer */}
                <div className="h-2" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════ MOBILE: TOP STATUS BAR ═══════ */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-12 flex items-center justify-between px-4 bg-white/50 backdrop-blur-xl border-b border-white/20">
        <Link href="/dashboard" className="flex items-center gap-1.5">
          <span className="font-display text-base font-bold text-navy">EZRA</span>
          <span className="w-1 h-1 rounded-full bg-gold inline-block" />
          <span className="font-display text-base font-light text-navy/50">ANNEX</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/notifications" className="relative p-1.5">
            <Bell className="w-4.5 h-4.5 text-navy/50" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-red-500 text-white text-[7px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link href="/dashboard/profile">
            <div className="w-7 h-7 rounded-full bg-navy text-white flex items-center justify-center font-display text-[10px] font-bold">
              {CURRENT_USER.initials}
            </div>
          </Link>
        </div>
      </div>

      {/* ═══════ PAGE CONTENT ═══════ */}
      <main
        ref={scrollRef}
        className="h-full overflow-y-auto pt-12 lg:pt-0 pb-24 lg:pb-0"
      >
        {/* Spacer so content doesn't hide behind floating pill */}
        <div className="hidden lg:block h-16" />
        <div className="p-5 lg:p-8 max-w-[1100px] mx-auto">
          {children}
        </div>
      </main>
    </div>
    </BookingProvider>
  )
}
