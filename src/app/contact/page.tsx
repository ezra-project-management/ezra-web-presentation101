'use client'

import { useState, FormEvent } from 'react'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

const contactInfo = [
  { icon: MapPin, label: 'Location', value: 'Nairobi, Kenya' },
  { icon: Phone, label: 'Phone', value: '+254 700 000 000' },
  { icon: Mail, label: 'Email', value: 'hello@ezraannex.com' },
  { icon: Clock, label: 'Hours', value: 'Mon – Sun: 6:00 AM – 10:00 PM' },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    toast.success('Message sent successfully!', {
      description: "We'll get back to you within 24 hours.",
    })
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="text-gold font-sans text-sm font-medium uppercase tracking-widest">
            Contact
          </span>
          <h1 className="mt-3 font-display text-4xl md:text-5xl text-navy font-semibold">
            Get in Touch
          </h1>
          <p className="mt-4 font-sans text-charcoal/70 max-w-xl mx-auto">
            Have a question or want to make a booking? We would love to hear from you.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <AnimatedSection>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-sans text-sm font-medium text-navy mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-charcoal/20 rounded-lg font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
                  placeholder="Your name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-sm font-medium text-navy mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-charcoal/20 rounded-lg font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block font-sans text-sm font-medium text-navy mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-charcoal/20 rounded-lg font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition"
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-navy mb-2">
                  Subject
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-charcoal/20 rounded-lg font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition bg-white"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="booking">Booking</option>
                  <option value="events">Events</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-sans text-sm font-medium text-navy mb-2">
                  Message
                </label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={5}
                  className="w-full px-4 py-3 border border-charcoal/20 rounded-lg font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold outline-none transition resize-none"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gold text-navy-dark font-sans font-medium text-lg rounded-lg hover:bg-gold-light transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Send Message
              </button>
            </form>
          </AnimatedSection>

          {/* Contact Info */}
          <AnimatedSection delay={0.2}>
            <div className="space-y-6">
              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactInfo.map((info) => (
                  <div
                    key={info.label}
                    className="bg-white rounded-xl p-5 shadow-sm border border-charcoal/5"
                  >
                    <info.icon className="w-5 h-5 text-gold mb-3" />
                    <p className="font-sans text-xs text-charcoal/50 uppercase tracking-wider">
                      {info.label}
                    </p>
                    <p className="font-sans text-sm text-navy font-medium mt-1">
                      {info.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="bg-navy-light rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px]">
                <Image
                  src="/ezralogo.jpeg"
                  alt="Ezra Annex"
                  width={64}
                  height={64}
                  className="rounded-full object-cover mb-3"
                />
                <p className="font-sans text-sm text-white/60 mt-1">
                  Nairobi, Kenya
                </p>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-emerald-500 text-white font-sans font-medium rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
