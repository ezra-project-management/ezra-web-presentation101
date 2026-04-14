'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { MembershipCard } from '@/components/membership/MembershipCard'
import { MembershipForm } from '@/components/membership/MembershipForm'
import { AnimatedSection, TextReveal } from '@/components/ui/AnimatedSection'

const plans = [
  {
    id: 'fitness',
    emoji: '🏋🏽',
    title: 'Fitness Centre Membership',
    description: 'Full access to gym equipment, group classes, and professional trainers.',
    price: 'KSh 6,500',
    period: 'month',
    features: [
      'Unlimited gym access',
      'Group fitness classes',
      'Locker & shower access',
      'Member-only discounts',
    ],
  },
  {
    id: 'swimming',
    emoji: '🏊',
    title: 'Swimming Pool Membership',
    description: 'Unlimited pool sessions with access to our coaching team and lane reservations.',
    price: 'KSh 4,800',
    period: 'month',
    features: [
      'Unlimited pool access',
      'Lane reservation priority',
      'Access to swim coaches',
      'Locker & shower access',
    ],
  },
]

export default function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('fitness')

  const handleFormSubmit = (data: any) => {
    console.log('Form Submitted:', data)
    toast.success('Your application has been received! Our team will contact you within 24 hours.')
    // In a real app, you'd send this to your backend
  }

  return (
    <main className="min-h-screen bg-white pb-24 pt-32 overflow-x-hidden" suppressHydrationWarning>
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center">
          <AnimatedSection variant="blurIn" delay={0.1}>
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-charcoal/40 mb-4 block">
              EZRA CENTER • NAIROBI • EST. 2020
            </span>
          </AnimatedSection>
          
          <h1 className="font-display text-5xl md:text-7xl text-navy font-semibold leading-tight">
            Become a <span className="italic font-normal text-gold-dark">Member</span> <br />
            of Ezra Center
          </h1>
          
          <AnimatedSection variant="blurIn" delay={0.4}>
            <p className="mt-8 max-w-2xl mx-auto font-sans text-base md:text-lg text-charcoal/60 leading-relaxed">
              Enjoy unlimited access to our world-class fitness and aquatic facilities. 
              Choose the plan that fits your lifestyle.
            </p>
          </AnimatedSection>
          
          <AnimatedSection variant="blurIn" delay={0.6}>
            <div className="mt-12 flex justify-center">
              <div className="w-48 h-px bg-gold/30" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════ STEP 1: PLAN SELECTION ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="text-center mb-16">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/40">
            Step 1 — Choose your membership plan
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, idx) => (
            <AnimatedSection key={plan.id} variant="fadeUp" delay={0.2 + idx * 0.1}>
              <MembershipCard
                {...plan}
                isSelected={selectedPlan === plan.id}
                onClick={() => setSelectedPlan(plan.id)}
              />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ═══════════════ STEP 2: APPLICATION FORM ═══════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/40">
            Step 2 — Complete your application
          </span>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-[2rem] border border-charcoal/5 shadow-premium p-8 md:p-16">
          <div className="mb-12 border-b border-charcoal/5 pb-12">
            <h2 className="font-display text-4xl md:text-5xl text-navy font-semibold mb-6">
              Membership Application
            </h2>
            <p className="font-sans text-base text-charcoal/60 leading-relaxed">
              Fill in your details below and our team will reach out within 24 hours to confirm your membership and arrange payment.
            </p>
          </div>

          <MembershipForm selectedPlan={selectedPlan} onSubmit={handleFormSubmit} />
        </div>
      </section>
    </main>
  )
}
