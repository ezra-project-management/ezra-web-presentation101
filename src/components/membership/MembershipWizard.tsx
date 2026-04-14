'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Home,
  Info,
  Lock,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MembershipCard } from '@/components/membership/MembershipCard'

const formSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Please select a gender'),
  selectedPlan: z.string().min(1, 'Please select a plan'),
  startDate: z.string().min(1, 'Preferred start date is required'),
  duration: z.string().min(1, 'Please select a duration'),
  paymentMethod: z.string().min(1, 'Please select a payment method'),
  healthConditions: z.string().optional(),
  emergencyName: z.string().min(2, 'Emergency contact name is required'),
  emergencyPhone: z.string().min(10, 'Emergency contact phone is required'),
  agreed: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
})

type FormData = z.infer<typeof formSchema>

const PLANS = [
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

const STEPS = [
  { id: 'plan', label: 'Plan', short: 'Choose' },
  { id: 'you', label: 'About you', short: 'You' },
  { id: 'details', label: 'Details', short: 'Details' },
  { id: 'review', label: 'Review', short: 'Finish' },
] as const

type StepIndex = 0 | 1 | 2 | 3

const step1Fields: (keyof FormData)[] = ['firstName', 'lastName', 'email', 'phone', 'dob', 'gender']
const step2Fields: (keyof FormData)[] = ['selectedPlan', 'startDate', 'duration', 'paymentMethod']

interface MembershipWizardProps {
  onSubmit: (data: FormData) => void
}

export function MembershipWizard({ onSubmit }: MembershipWizardProps) {
  const [step, setStep] = useState<StepIndex>(0)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedPlan: 'fitness',
      agreed: false,
    },
  })

  const selectedPlan = watch('selectedPlan')

  useEffect(() => {
    const t = new Date().toISOString().split('T')[0]
    const dob = document.getElementById('mem-dob') as HTMLInputElement | null
    const start = document.getElementById('mem-start') as HTMLInputElement | null
    if (dob) dob.max = t
    if (start) start.min = t
  }, [step])

  const goNext = async () => {
    if (step === 0) {
      setStep(1)
      return
    }
    if (step === 1) {
      const ok = await trigger(step1Fields)
      if (!ok) return
      setStep(2)
      return
    }
    if (step === 2) {
      const ok = await trigger(step2Fields)
      if (!ok) return
      setStep(3)
      return
    }
  }

  const goBack = () => {
    if (step === 0) return
    setStep((s) => (s - 1) as StepIndex)
  }

  const finish = handleSubmit((data) => {
    onSubmit(data)
    setSubmitted(true)
  })

  const inputClasses =
    'w-full rounded-xl border border-charcoal/10 px-4 py-3 font-sans text-sm outline-none transition-all focus:border-gold focus:ring-1 focus:ring-gold bg-white'
  const labelClasses = 'mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal/55'

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -16 },
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center px-4 py-12 md:py-16 max-w-md mx-auto"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-gold/10">
          <Check className="h-8 w-8 text-gold-dark" strokeWidth={2.5} />
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-navy">You&apos;re on the list</h2>
        <p className="mt-4 font-sans text-sm text-charcoal/60 leading-relaxed">
          Thank you for applying. Our team will reach out within 24 hours to confirm your membership and next steps.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-navy/15 bg-white px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.15em] text-navy shadow-sm transition hover:bg-cream"
        >
          <Home className="h-4 w-4" />
          Back to home
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-8 pt-4 sm:px-6">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex flex-1 flex-col items-center gap-2 min-w-0">
              <div
                className={cn(
                  'flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300',
                  i < step
                    ? 'bg-gold text-navy-dark shadow-md'
                    : i === step
                      ? 'bg-navy text-white ring-2 ring-gold/40 ring-offset-2'
                      : 'bg-charcoal/10 text-charcoal/35'
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  'hidden text-[9px] font-bold uppercase tracking-wider sm:block truncate max-w-full text-center',
                  i === step ? 'text-navy' : 'text-charcoal/40'
                )}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-charcoal/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold"
            initial={false}
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          />
        </div>
        <p className="mt-3 text-center font-sans text-[11px] text-charcoal/45 sm:hidden">
          Step {step + 1} of {STEPS.length} — {STEPS[step].label}
        </p>
      </div>

      <div className="relative min-h-[320px] overflow-hidden sm:min-h-[380px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {/* Step 0 — Plan */}
            {step === 0 && (
              <div>
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-gold/15 bg-gradient-to-br from-cream/80 to-white p-4">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" />
                  <p className="text-left font-sans text-sm leading-relaxed text-charcoal/70">
                    Pick the membership that fits you. You can change this before you submit.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
                  {PLANS.map((plan) => (
                    <MembershipCard
                      key={plan.id}
                      {...plan}
                      isSelected={selectedPlan === plan.id}
                      onClick={() => setValue('selectedPlan', plan.id, { shouldValidate: true })}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Step 1 — Personal */}
            {step === 1 && (
              <div className="space-y-5">
                <h3 className="font-display text-xl text-navy sm:text-2xl">About you</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClasses}>First name</label>
                    <input {...register('firstName')} placeholder="e.g. Amara" className={inputClasses} />
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClasses}>Last name</label>
                    <input {...register('lastName')} placeholder="e.g. Wanjiku" className={inputClasses} />
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClasses}>Email</label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="you@email.com"
                      className={inputClasses}
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className={labelClasses}>Phone</label>
                    <input {...register('phone')} placeholder="+254 7XX XXX XXX" className={inputClasses} />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <label className={labelClasses}>Date of birth</label>
                    <input id="mem-dob" {...register('dob')} type="date" className={inputClasses} />
                    {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClasses}>Gender</label>
                    <select {...register('gender')} className={inputClasses}>
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Membership prefs */}
            {step === 2 && (
              <div className="space-y-5">
                <h3 className="font-display text-xl text-navy sm:text-2xl">Membership preferences</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={labelClasses}>Plan</label>
                    <select {...register('selectedPlan')} className={inputClasses}>
                      <option value="fitness">Fitness Centre Membership</option>
                      <option value="swimming">Swimming Pool Membership</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClasses}>Preferred start</label>
                    <input id="mem-start" {...register('startDate')} type="date" className={inputClasses} />
                    {errors.startDate && (
                      <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClasses}>Duration</label>
                    <select {...register('duration')} className={inputClasses}>
                      <option value="">Select</option>
                      <option value="1">1 month</option>
                      <option value="3">3 months</option>
                      <option value="6">6 months</option>
                      <option value="12">1 year</option>
                    </select>
                    {errors.duration && (
                      <p className="mt-1 text-xs text-red-500">{errors.duration.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClasses}>Payment method</label>
                    <select {...register('paymentMethod')} className={inputClasses}>
                      <option value="">Select</option>
                      <option value="mpesa">M-Pesa</option>
                      <option value="card">Credit / debit card</option>
                      <option value="bank">Bank transfer</option>
                    </select>
                    {errors.paymentMethod && (
                      <p className="mt-1 text-xs text-red-500">{errors.paymentMethod.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClasses}>Health or special notes (optional)</label>
                    <textarea
                      {...register('healthConditions')}
                      placeholder="Injuries, conditions, or anything we should know."
                      rows={3}
                      className={cn(inputClasses, 'min-h-[88px] resize-none')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 — Emergency + policy + submit */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="font-display text-xl text-navy sm:text-2xl">Almost there</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClasses}>Emergency contact name</label>
                    <input {...register('emergencyName')} placeholder="Full name" className={inputClasses} />
                    {errors.emergencyName && (
                      <p className="mt-1 text-xs text-red-500">{errors.emergencyName.message}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClasses}>Emergency phone</label>
                    <input {...register('emergencyPhone')} placeholder="+254 7XX XXX XXX" className={inputClasses} />
                    {errors.emergencyPhone && (
                      <p className="mt-1 text-xs text-red-500">{errors.emergencyPhone.message}</p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-gold/15 bg-cream/40 p-5">
                  <label className="mb-3 flex items-center gap-2 font-sans text-[10px] font-bold uppercase tracking-wider text-gold-dark">
                    <Info className="h-4 w-4" />
                    Membership policy
                  </label>
                  <p className="font-sans text-xs leading-relaxed text-charcoal/65 sm:text-sm">
                    A 50% deposit is required to confirm your membership. Memberships are non-transferable. Monthly
                    memberships may be paused once per quarter with at least 7 days&apos; written notice. Cancellations
                    submitted more than 14 days before the next billing cycle will receive a 70% deposit refund.
                    Cancellations within 7–13 days receive 50%, and within 24 hours, no refund is issued. Ezra Center
                    reserves the right to terminate memberships for breach of facility rules.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    {...register('agreed')}
                    id="mem-agreed"
                    className="mt-1 h-5 w-5 shrink-0 rounded border-charcoal/20 text-gold focus:ring-gold"
                  />
                  <label htmlFor="mem-agreed" className="font-sans text-sm text-charcoal/65 leading-snug">
                    I agree to the{' '}
                    <Link href="/terms" className="underline decoration-gold/40 underline-offset-2 hover:text-gold">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="underline decoration-gold/40 underline-offset-2 hover:text-gold">
                      Privacy Policy
                    </Link>
                    . I understand the membership policy above.
                  </label>
                </div>
                {errors.agreed && <p className="text-xs text-red-500">{errors.agreed.message}</p>}

                <p className="flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-widest text-charcoal/40">
                  <Lock className="h-3 w-3" />
                  Your information is sent securely
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav buttons */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-full border border-charcoal/10 px-5 py-3.5 font-sans text-xs font-semibold uppercase tracking-wider text-charcoal/70 transition hover:bg-cream disabled:pointer-events-none disabled:opacity-30'
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-navy px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-[0.15em] text-white shadow-lg transition hover:bg-navy-light"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-[0.15em] text-navy-dark shadow-lg transition hover:bg-gold-light"
          >
            Submit application
            <Check className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
