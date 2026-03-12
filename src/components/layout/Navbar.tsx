'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, ChevronDown, Home, Briefcase, Info, Phone, LogIn, CalendarCheck } from 'lucide-react'
import { SERVICES } from '@/lib/services'
import { cn } from '@/lib/utils'

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Services', href: '/services', hasDropdown: true, icon: Briefcase },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Contact', href: '/contact', icon: Phone },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const pathname = usePathname()
  const { scrollY } = useScroll()

  // Hide on auth and dashboard pages
  const isAuthPage = pathname.startsWith('/auth')
  const isDashboard = pathname.startsWith('/dashboard')

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 100)
  })

  useEffect(() => {
    const id = setTimeout(() => {
      setMobileOpen(false)
      setServicesOpen(false)
      setSidebarExpanded(false)
    }, 0)
    return () => clearTimeout(id)
  }, [pathname])

  if (isAuthPage || isDashboard) return null

  return (
    <>
      {/* ═══════════════ TOP FLOATING PILL (visible when not scrolled) ═══════════════ */}
      <AnimatePresence>
        {!scrolled && (
          <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 hidden lg:block"
          >
            <div className="flex items-center gap-1 px-2 py-1.5 bg-navy/80 backdrop-blur-xl rounded-full border border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.2)]">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center pl-3 pr-3"
              >
                <Image
                  src="/ezralogo.jpeg"
                  alt="Ezra Annex"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </Link>

              {/* Divider */}
              <div className="w-px h-5 bg-white/15" />

              {/* Nav Links */}
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => link.hasDropdown && setServicesOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setServicesOpen(false)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'relative px-4 py-2 font-sans text-sm font-medium rounded-full transition-all duration-300 flex items-center gap-1.5',
                      pathname === link.href
                        ? 'text-navy-dark'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    )}
                  >
                    {pathname === link.href && (
                      <motion.span
                        layoutId="pillActive"
                        className="absolute inset-0 bg-gold rounded-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.name}</span>
                    {link.hasDropdown && (
                      <motion.span
                        className="relative z-10"
                        animate={{ rotate: servicesOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </motion.span>
                    )}
                  </Link>

                  {/* Services Dropdown */}
                  {link.hasDropdown && (
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[400px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-charcoal/5 p-3"
                        >
                          <div className="grid grid-cols-2 gap-0.5">
                            {SERVICES.map((service) => (
                              <Link
                                key={service.id}
                                href={`/services/${service.slug}`}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-cream transition-all duration-200 group"
                              >
                                <span className="text-base group-hover:scale-110 transition-transform duration-300" suppressHydrationWarning>
                                  {service.icon}
                                </span>
                                <div>
                                  <p className="font-sans text-sm font-medium text-navy group-hover:text-gold transition-colors">
                                    {service.name}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}

              {/* Divider */}
              <div className="w-px h-5 bg-white/15" />

              {/* Auth */}
              <Link
                href="/auth/login"
                className="px-4 py-2 font-sans text-sm font-medium text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-all duration-300"
              >
                Login
              </Link>
              <Link
                href="/services"
                className="px-5 py-2 bg-gold text-navy-dark font-sans text-sm font-medium rounded-full hover:bg-gold-light transition-all duration-300 shadow-md"
              >
                Book Now
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ═══════════════ SIDE BAR (visible when scrolled) ═══════════════ */}
      <AnimatePresence>
        {scrolled && (
          <motion.nav
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -80, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block"
            onMouseEnter={() => setSidebarExpanded(true)}
            onMouseLeave={() => {
              setSidebarExpanded(false)
              setServicesOpen(false)
            }}
          >
            <motion.div
              animate={{ width: sidebarExpanded ? 180 : 56 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-navy/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.3)] py-3 px-2 overflow-hidden"
            >
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center justify-center mb-3 px-2 py-2"
              >
                <Image
                  src="/ezralogo.jpeg"
                  alt="Ezra Annex"
                  width={44}
                  height={44}
                  className="rounded-full object-cover"
                />
              </Link>

              <div className="w-full h-px bg-white/10 mb-2" />

              {/* Nav Links */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <div key={link.name} className="relative">
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm transition-all duration-300',
                        pathname === link.href
                          ? 'bg-gold/20 text-gold'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      )}
                      onMouseEnter={() => link.hasDropdown && sidebarExpanded && setServicesOpen(true)}
                      onMouseLeave={() => link.hasDropdown && setServicesOpen(false)}
                    >
                      <link.icon className="w-4.5 h-4.5 shrink-0" />
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
                      {pathname === link.href && (
                        <motion.div
                          layoutId="sideActive"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-gold rounded-full"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </Link>

                    {/* Sidebar services dropdown */}
                    {link.hasDropdown && sidebarExpanded && (
                      <AnimatePresence>
                        {servicesOpen && (
                          <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-full top-0 ml-2 w-[220px] bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-charcoal/5 p-2 z-50"
                            onMouseEnter={() => setServicesOpen(true)}
                            onMouseLeave={() => setServicesOpen(false)}
                          >
                            {SERVICES.map((service) => (
                              <Link
                                key={service.id}
                                href={`/services/${service.slug}`}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cream transition-colors text-sm font-sans text-navy hover:text-gold"
                              >
                                <span suppressHydrationWarning>{service.icon}</span>
                                {service.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                ))}
              </div>

              <div className="w-full h-px bg-white/10 my-2" />

              {/* Auth Links */}
              <Link
                href="/auth/login"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <LogIn className="w-4.5 h-4.5 shrink-0" />
                <AnimatePresence>
                  {sidebarExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap font-medium"
                    >
                      Login
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>

              <Link
                href="/services"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-sans text-sm bg-gold/20 text-gold hover:bg-gold/30 transition-all duration-300 mt-1"
              >
                <CalendarCheck className="w-4.5 h-4.5 shrink-0" />
                <AnimatePresence>
                  {sidebarExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap font-medium"
                    >
                      Book Now
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* ═══════════════ MOBILE NAV ═══════════════ */}
      <div className="lg:hidden fixed top-4 right-4 z-[60]">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-11 h-11 rounded-full bg-navy/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white shadow-lg"
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

      {/* Mobile Logo */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]">
        <Link href="/" className="flex items-center gap-2 px-2 py-1.5 bg-cream/90 backdrop-blur-xl border border-white/20 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] active:scale-95 transition-transform duration-200">
          <Image
            src="/ezralogo.jpeg"
            alt="Ezra Annex"
            width={34}
            height={34}
            className="rounded-full object-cover"
          />
          <span className="font-display text-sm font-bold text-navy pr-2">EZRA</span>
        </Link>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[280px] bg-navy/95 backdrop-blur-xl z-[55] overflow-y-auto"
            >
              {/* Mobile menu header */}
              <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-white/10">
                <Image
                  src="/ezralogo.jpeg"
                  alt="Ezra Annex"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <div>
                  <p className="font-display text-sm font-semibold text-white">Menu</p>
                  <p className="font-sans text-xs text-white/40">Navigate & Book</p>
                </div>
              </div>

              <div className="px-4 pt-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    {link.hasDropdown ? (
                      <>
                        <button
                          onClick={() => setServicesOpen(!servicesOpen)}
                          className={cn(
                            'flex items-center justify-between w-full px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all',
                            pathname === link.href
                              ? 'bg-gold/20 text-gold'
                              : 'text-white/70 active:bg-white/5'
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <link.icon className="w-5 h-5" />
                            {link.name}
                          </span>
                          <ChevronDown className={cn('w-4 h-4 transition-transform duration-300', servicesOpen && 'rotate-180')} />
                        </button>
                        <AnimatePresence>
                          {servicesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 pl-4 border-l border-white/10 mt-1 space-y-0.5 pb-2">
                                {SERVICES.map((service) => (
                                  <Link
                                    key={service.id}
                                    href={`/services/${service.slug}`}
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg font-sans text-sm text-white/50 active:bg-white/5 hover:text-gold transition-colors"
                                  >
                                    <span suppressHydrationWarning>{service.icon}</span>
                                    {service.name}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all',
                          pathname === link.href
                            ? 'bg-gold/20 text-gold'
                            : 'text-white/70 active:bg-white/5'
                        )}
                      >
                        <link.icon className="w-5 h-5" />
                        {link.name}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mx-4 mt-4 pt-4 border-t border-white/10 space-y-2 pb-8">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm text-white/70 active:bg-white/5 transition-all"
                >
                  <LogIn className="w-5 h-5" />
                  Login
                </Link>
                <Link
                  href="/services"
                  className="block text-center font-sans text-sm font-semibold px-6 py-3.5 bg-gold text-navy-dark rounded-xl shadow-gold"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
