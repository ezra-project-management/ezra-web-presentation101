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
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CURRENT_USER, UPCOMING_BOOKINGS, NOTIFICATIONS_DATA } from '@/lib/dashboard-data'

const sidebarLinks = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, color: 'text-white' },
  { name: 'My Bookings', href: '/dashboard/bookings', icon: CalendarDays, color: 'text-teal-light', badge: UPCOMING_BOOKINGS.length },
  { name: 'Membership', href: '/dashboard/membership', icon: Crown, color: 'text-gold' },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard, color: 'text-emerald-400' },
  { name: 'Favourites', href: '/dashboard/favourites', icon: Heart, color: 'text-rose-400' },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell, color: 'text-white', badge: NOTIFICATIONS_DATA.filter(n => !n.read).length },
  { name: 'Profile', href: '/dashboard/profile', icon: User, color: 'text-white/80' },
]

function getBreadcrumb(pathname: string) {
  if (pathname === '/dashboard') return [{ label: 'Dashboard', href: '/dashboard' }]
  const segments = pathname.replace('/dashboard/', '').split('/')
  const crumbs = [{ label: 'Dashboard', href: '/dashboard' }]
  const labels: Record<string, string> = {
    bookings: 'My Bookings',
    membership: 'Membership',
    payments: 'Payments',
    favourites: 'Favourites',
    notifications: 'Notifications',
    profile: 'Profile',
    'booking-confirmed': 'Booking Confirmed',
  }
  if (segments[0]) {
    crumbs.push({ label: labels[segments[0]] || segments[0], href: `/dashboard/${segments[0]}` })
  }
  if (segments[1]) {
    crumbs.push({ label: segments[1].toUpperCase(), href: pathname })
  }
  return crumbs
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const breadcrumbs = getBreadcrumb(pathname)
  const unreadCount = NOTIFICATIONS_DATA.filter(n => !n.read).length

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  // Listen for scroll on the main content area
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handler = () => setScrolled(el.scrollTop > 80)
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSidebarExpanded(false)
  }, [pathname])

  return (
    <div className="h-screen overflow-hidden bg-cream/30 relative">
      {/* ═══════════════ DESKTOP: FLOATING PILL (visible when NOT scrolled) ═══════════════ */}
      <AnimatePresence>
        {!scrolled && (
          <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden lg:block"
          >
            <div className="flex items-center gap-1 px-2 py-1.5 bg-navy/70 backdrop-blur-2xl rounded-full border border-white/15 shadow-[0_8px_40px_rgba(15,44,74,0.4)]">
              {/* Avatar + Name */}
              <div className="flex items-center gap-2 pl-3 pr-2">
                <div className="w-8 h-8 rounded-full bg-white/15 border border-gold/40 text-white flex items-center justify-center font-display text-xs font-semibold">
                  {CURRENT_USER.initials}
                </div>
                <span className="font-display text-sm font-semibold text-white hidden xl:block">
                  {CURRENT_USER.firstName}
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-gold border border-gold/30 font-sans hidden xl:flex">
                  <Crown className="w-2.5 h-2.5" />
                  GOLD
                </span>
              </div>

              {/* Divider */}
              <div className="w-px h-6 bg-white/15" />

              {/* Nav Links */}
              {sidebarLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'relative px-3.5 py-2 font-sans text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-1.5',
                    isActive(link.href)
                      ? 'text-navy-dark'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  )}
                >
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="dashPillActive"
                      className="absolute inset-0 bg-gold rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <link.icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 hidden xl:inline">{link.name}</span>
                  {link.badge && link.badge > 0 && (
                    <span className="relative z-10 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center -ml-0.5">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}

              {/* Divider */}
              <div className="w-px h-6 bg-white/15" />

              {/* Back to website */}
              <Link
                href="/"
                className="px-3 py-2 font-sans text-sm text-white/60 hover:text-white rounded-full hover:bg-white/10 transition-all duration-300"
              >
                <Globe className="w-4 h-4" />
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ═══════════════ DESKTOP: SIDEBAR (visible when scrolled) ═══════════════ */}
      <AnimatePresence>
        {scrolled && (
          <motion.nav
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
            onMouseEnter={() => setSidebarExpanded(true)}
            onMouseLeave={() => setSidebarExpanded(false)}
          >
            <motion.div
              animate={{ width: sidebarExpanded ? 240 : 60 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-navy/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_8px_40px_rgba(15,44,74,0.35)] py-3 px-2 overflow-hidden"
            >
              {/* Avatar */}
              <div className="flex items-center gap-3 px-2 py-2 mb-1">
                <div className="w-9 h-9 rounded-full bg-white/15 border border-gold/40 text-white flex items-center justify-center font-display text-xs font-semibold shrink-0">
                  {CURRENT_USER.initials}
                </div>
                <AnimatePresence>
                  {sidebarExpanded && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      <p className="font-display text-sm font-semibold text-white">
                        {CURRENT_USER.firstName}
                      </p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-gold border border-gold/30 font-sans mt-0.5">
                        <Crown className="w-2.5 h-2.5" />
                        GOLD
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="w-full h-px bg-white/10 mb-2" />

              {/* Nav Links */}
              <div className="space-y-1">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm transition-all duration-300 relative',
                      isActive(link.href)
                        ? 'bg-gold/20 text-gold'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <link.icon className={cn('w-[18px] h-[18px] shrink-0', isActive(link.href) ? 'text-gold' : '')} />
                    <AnimatePresence>
                      {sidebarExpanded && (
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
                    {link.badge && link.badge > 0 && (
                      <span className={cn(
                        'bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center',
                        sidebarExpanded ? 'ml-auto' : 'absolute -top-0.5 -right-0.5'
                      )}>
                        {link.badge}
                      </span>
                    )}
                    {isActive(link.href) && (
                      <motion.div
                        layoutId="dashSideActive"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gold rounded-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
              </div>

              <div className="w-full h-px bg-white/10 my-2" />

              {/* Bottom links */}
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <Globe className="w-[18px] h-[18px] shrink-0" />
                <AnimatePresence>
                  {sidebarExpanded && (
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

              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300">
                <LogOut className="w-[18px] h-[18px] shrink-0" />
                <AnimatePresence>
                  {sidebarExpanded && (
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

      {/* ═══════════════ MOBILE: FLOATING BUTTON + OVERLAY ═══════════════ */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-12 h-12 rounded-full bg-navy/70 backdrop-blur-2xl border border-white/15 flex items-center justify-center text-white shadow-[0_8px_32px_rgba(15,44,74,0.4)]"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Menu className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Mobile Logo Pill */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-navy/70 backdrop-blur-2xl rounded-full border border-white/15 shadow-[0_8px_32px_rgba(15,44,74,0.4)]">
          <div className="w-7 h-7 rounded-full bg-white/15 border border-gold/40 text-white flex items-center justify-center font-display text-[10px] font-semibold">
            {CURRENT_USER.initials}
          </div>
          <span className="font-display text-sm font-semibold text-white">
            {CURRENT_USER.firstName}
          </span>
          {unreadCount > 0 && (
            <Link href="/dashboard/notifications" className="relative">
              <Bell className="w-4 h-4 text-white/60" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[7px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-72 bg-navy/80 backdrop-blur-2xl border-l border-white/10 z-50 pt-20 px-5"
            >
              {/* User section */}
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full bg-white/15 border border-gold/40 text-white flex items-center justify-center font-display text-sm font-semibold">
                  {CURRENT_USER.initials}
                </div>
                <div>
                  <p className="font-display text-base font-semibold text-white">
                    {CURRENT_USER.firstName} {CURRENT_USER.lastName}
                  </p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold/20 text-gold border border-gold/30 font-sans">
                    <Crown className="w-2.5 h-2.5" />
                    GOLD
                  </span>
                </div>
              </div>

              <div className="h-px bg-white/10 mb-3" />

              <div className="space-y-1">
                {sidebarLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all',
                        isActive(link.href)
                          ? 'bg-gold/20 text-gold'
                          : 'text-white/70 hover:bg-white/5'
                      )}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.name}
                      {link.badge && link.badge > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm text-white/60 hover:bg-white/5 transition-all"
                >
                  <Globe className="w-5 h-5" />
                  Back to Website
                </Link>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════ GLASSMORPHIC TOP HEADER BAR ═══════════════ */}
      <header className="fixed top-0 left-0 right-0 h-14 z-30 bg-white/60 backdrop-blur-xl border-b border-white/30 shadow-[0_1px_12px_rgba(15,44,74,0.04)] flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Breadcrumb - hidden on mobile (logo pill is there) */}
          <nav className="hidden lg:flex items-center gap-1 font-sans text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-navy font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-gray-400 hover:text-navy transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {/* Notification bell */}
          <Link
            href="/dashboard/notifications"
            className="relative p-2 rounded-xl text-gray-400 hover:text-navy hover:bg-white/50 transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-sans text-xs font-medium border border-navy/30">
            {CURRENT_USER.initials}
          </div>
        </div>
      </header>

      {/* ═══════════════ PAGE CONTENT ═══════════════ */}
      <main
        ref={scrollRef}
        className="h-full overflow-y-auto pt-14"
      >
        <div className="p-6 lg:p-8 max-w-[1200px] mx-auto pb-20 lg:pb-8">
          {children}
        </div>
      </main>
    </div>
  )
}
