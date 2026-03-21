'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(redirectTo)
  }

  const update = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        <Image
          src="/images/image-resizing-2.jpeg"
          alt="Ezra Annex"
          fill
          className="object-cover brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/55 via-navy/40 to-navy/50" />
        <div className="relative z-10 text-center px-12">
          <h2 className="font-display text-4xl text-white font-semibold">
            Join Ezra Annex
          </h2>
          <p className="mt-4 font-sans text-white/70">
            Create your account and unlock exclusive access to premium services.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="inline-block">
            <Image
              src="/ezralogo.jpeg"
              alt="Ezra Annex"
              width={100}
              height={100}
              className="rounded-full object-cover shadow-md"
            />
          </Link>

          <h2 className="mt-8 font-display text-2xl text-navy font-semibold">
            Create your account
          </h2>

          {/* Step Indicator */}
          <div className="mt-6 flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-sans text-sm font-medium transition-colors ${
                    s <= step
                      ? 'bg-gold text-white'
                      : 'bg-charcoal/10 text-charcoal/40'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-0.5 ${
                      s < step ? 'bg-gold' : 'bg-charcoal/10'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Name */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block font-sans text-sm font-medium text-navy mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => update('firstName', e.target.value)}
                      className="w-full py-3 border-b border-charcoal/20 focus:border-gold outline-none transition font-sans bg-transparent"
                      placeholder="First name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm font-medium text-navy mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => update('lastName', e.target.value)}
                      className="w-full py-3 border-b border-charcoal/20 focus:border-gold outline-none transition font-sans bg-transparent"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Contact */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block font-sans text-sm font-medium text-navy mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="w-full py-3 border-b border-charcoal/20 focus:border-gold outline-none transition font-sans bg-transparent"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm font-medium text-navy mb-2">
                      Phone Number
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-sm text-charcoal/60 py-3 pr-2 border-b border-charcoal/20">
                        +254
                      </span>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className="flex-1 py-3 border-b border-charcoal/20 focus:border-gold outline-none transition font-sans bg-transparent"
                        placeholder="7XX XXX XXX"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Password */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block font-sans text-sm font-medium text-navy mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => update('password', e.target.value)}
                      className="w-full py-3 border-b border-charcoal/20 focus:border-gold outline-none transition font-sans bg-transparent"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm font-medium text-navy mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        update('confirmPassword', e.target.value)
                      }
                      className="w-full py-3 border-b border-charcoal/20 focus:border-gold outline-none transition font-sans bg-transparent"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => update('agreeTerms', e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-charcoal/30 text-gold focus:ring-gold"
                    />
                    <span className="font-sans text-sm text-charcoal/70">
                      I agree to the{' '}
                      <span className="text-gold">Terms of Service</span> and{' '}
                      <span className="text-gold">Privacy Policy</span>
                    </span>
                  </label>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-8 flex items-center gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 font-sans text-sm text-charcoal/60 hover:text-navy transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                type={step === 3 ? 'submit' : 'button'}
                onClick={step < 3 ? handleNext : undefined}
                className="flex-1 py-3.5 bg-gold text-navy-dark font-sans font-medium rounded-lg hover:bg-gold-light transition-all duration-300 shadow-md"
              >
                {step === 3 ? 'Create Account' : 'Continue'}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center font-sans text-sm text-charcoal/60">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="text-gold font-medium hover:text-gold-dark transition-colors"
            >
              Sign in &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
