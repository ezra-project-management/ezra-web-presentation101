'use client'

import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { MembershipWizard } from '@/components/membership/MembershipWizard'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export default function MembershipPage() {
  const handleFormSubmit = () => {
    toast.success('Your application has been received! Our team will contact you within 24 hours.')
  }

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-cream/50 via-white to-cream/30 pb-28 pt-24 sm:pt-28 overflow-x-hidden">
      {/* Compact hero — single fold */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 text-center mb-8 sm:mb-10">
        <AnimatedSection variant="fadeUp" delay={0.05}>
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.35em] text-charcoal/40">
            Ezra Center · Nairobi
          </span>
        </AnimatedSection>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-4 font-display text-3xl sm:text-5xl text-navy font-semibold leading-[1.1]"
        >
          Become a <span className="italic font-normal text-gold-dark">Member</span>
          <span className="hidden sm:inline">
            <br />
          </span>
          <span className="sm:hidden"> </span>
          of Ezra Center
        </motion.h1>
        <p className="mt-4 max-w-lg mx-auto font-sans text-sm sm:text-base text-charcoal/55 leading-relaxed">
          A short guided flow — pick your plan, tell us about you, and submit. Save time on mobile and desktop.
        </p>
      </section>

      {/* Wizard card */}
      <section className="max-w-3xl mx-auto px-3 sm:px-6">
        <div className="rounded-[1.75rem] border border-charcoal/5 bg-white/90 shadow-[0_20px_60px_-15px_rgba(15,44,74,0.12)] backdrop-blur-sm sm:rounded-[2rem]">
          <MembershipWizard onSubmit={handleFormSubmit} />
        </div>
      </section>
    </main>
  )
}
