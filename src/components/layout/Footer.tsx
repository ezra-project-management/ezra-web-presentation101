import type { ComponentType } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, Instagram, Youtube } from 'lucide-react'
import { IconX, IconTikTok } from '@/components/icons/SocialBrandIcons'
import { SERVICES } from '@/lib/services'

const quickLinks = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Privacy Policy', href: '/privacy' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Careers', href: '#' },
]

const socials: { href: string; label: string; Icon: ComponentType<{ className?: string }> }[] = [
  { href: '#', label: 'Instagram', Icon: Instagram },
  { href: '#', label: 'X', Icon: IconX },
  { href: '#', label: 'TikTok', Icon: IconTikTok },
  { href: '#', label: 'YouTube', Icon: Youtube },
]

export function Footer() {
  return (
    <footer className="border-t border-gold/15 bg-navy text-white shadow-[0_-8px_40px_-20px_rgba(0,0,0,0.35)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/ezralogo.jpeg"
                alt="Ezra Center"
                width={72}
                height={72}
                className="rounded-full object-cover ring-2 ring-gold/25 shadow-lg"
              />
            </Link>
            <p className="font-sans text-sm text-white/65 leading-relaxed mb-6">
              A place to look and feel your best, all under one roof.
            </p>
            <div className="flex flex-wrap gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-white/20 bg-white/[0.04] flex items-center justify-center hover:border-gold hover:text-gold hover:bg-white/[0.07] transition-colors"
                >
                  <social.Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-lg font-semibold text-gold mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="font-sans text-sm text-white/60 hover:text-gold transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-semibold text-gold mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-white/60 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-lg font-semibold text-gold mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="font-sans text-sm text-white/65">
                  Ezra Center
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="font-sans text-sm text-white/65">
                  +254 700 000 000
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="font-sans text-sm text-white/65">
                  hello@ezracenter.org
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                <span className="font-sans text-sm text-white/65">
                  Mon to Sun, 6:00 AM to 10:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gold/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-sans text-sm text-white/45">
              &copy; 2026 Ezra Center. All rights reserved.
            </p>
            <p className="font-sans text-sm text-white/45">
              Powered by{' '}
              <span className="text-gold/70">Nexus Swift Tech Solutions</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
