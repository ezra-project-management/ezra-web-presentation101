'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { Info, Lock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect } from 'react'

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

interface MembershipFormProps {
  selectedPlan: string
  onSubmit: (data: FormData) => void
}

export function MembershipForm({ selectedPlan, onSubmit }: MembershipFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedPlan: selectedPlan,
      agreed: false,
    },
  })

  // Sync selectedPlan prop with react-hook-form value
  useEffect(() => {
    if (selectedPlan) {
      setValue('selectedPlan', selectedPlan)
    }
  }, [selectedPlan, setValue])

  const inputClasses = "w-full rounded-xl border border-charcoal/10 px-4 py-3.5 font-sans text-sm outline-none transition-all focus:border-gold focus:ring-1 focus:ring-gold bg-white"
  const labelClasses = "mb-2 block font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-charcoal/60"

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-12"
      suppressHydrationWarning // Ignore extension attributes like bis_skin_checked
    >
      {/* PERSONAL DETAILS */}
      <section>
        <div className="text-center mb-8">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/40">Personal Details</span>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>First Name</label>
            <input {...register('firstName')} placeholder="e.g. Amara" className={inputClasses} />
            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className={labelClasses}>Last Name</label>
            <input {...register('lastName')} placeholder="e.g. Wanjiku" className={inputClasses} />
            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className={labelClasses}>Email Address</label>
            <input {...register('email')} type="email" placeholder="you@email.com" className={inputClasses} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className={labelClasses}>Phone Number</label>
            <input {...register('phone')} placeholder="+254 7XX XXX XXX" className={inputClasses} />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
          </div>
          <div>
            <label className={labelClasses}>Date of Birth</label>
            <input {...register('dob')} type="date" className={inputClasses} />
            {errors.dob && <p className="mt-1 text-xs text-red-500">{errors.dob.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className={labelClasses}>Gender</label>
            <select {...register('gender')} className={inputClasses}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP DETAILS */}
      <section>
        <div className="text-center mb-8">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/40">Membership Details</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClasses}>Selected Plan</label>
            <select {...register('selectedPlan')} className={inputClasses}>
              <option value="">Select a plan</option>
              <option value="fitness">Fitness Centre Membership</option>
              <option value="swimming">Swimming Pool Membership</option>
            </select>
            {errors.selectedPlan && <p className="mt-1 text-xs text-red-500">{errors.selectedPlan.message}</p>}
          </div>
          <div>
            <label className={labelClasses}>Preferred Start Date</label>
            <input {...register('startDate')} type="date" className={inputClasses} />
            {errors.startDate && <p className="mt-1 text-xs text-red-500">{errors.startDate.message}</p>}
          </div>
          <div>
            <label className={labelClasses}>Membership Duration</label>
            <select {...register('duration')} className={inputClasses}>
              <option value="">Select duration</option>
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
              <option value="12">1 Year</option>
            </select>
            {errors.duration && <p className="mt-1 text-xs text-red-500">{errors.duration.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className={labelClasses}>Preferred Payment Method</label>
            <select {...register('paymentMethod')} className={inputClasses}>
              <option value="">Select method</option>
              <option value="mpesa">M-Pesa</option>
              <option value="card">Credit/Debit Card</option>
              <option value="bank">Bank Transfer</option>
            </select>
            {errors.paymentMethod && <p className="mt-1 text-xs text-red-500">{errors.paymentMethod.message}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className={labelClasses}>Health Conditions or Special Requirements</label>
            <textarea 
              {...register('healthConditions')} 
              placeholder="Let us know of any injuries, health conditions, or anything our team should be aware of. (Optional)" 
              className={cn(inputClasses, "min-h-[120px] resize-none")}
            />
          </div>
        </div>
      </section>

      {/* EMERGENCY CONTACT */}
      <section>
        <div className="text-center mb-8">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal/40">Emergency Contact</span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className={labelClasses}>Emergency Contact Name</label>
            <input {...register('emergencyName')} placeholder="Full name" className={inputClasses} />
            {errors.emergencyName && <p className="mt-1 text-xs text-red-500">{errors.emergencyName.message}</p>}
          </div>
          <div>
            <label className={labelClasses}>Emergency Contact Phone</label>
            <input {...register('emergencyPhone')} placeholder="+254 7XX XXX XXX" className={inputClasses} />
            {errors.emergencyPhone && <p className="mt-1 text-xs text-red-500">{errors.emergencyPhone.message}</p>}
          </div>
        </div>
      </section>

      {/* POLICY BOX */}
      <section className="bg-cream/30 rounded-2xl border border-gold/10 p-8">
        <label className="mb-4 flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-gold-dark">
          <Info className="w-4 h-4" />
          Membership Policy
        </label>
        <p className="font-sans text-sm text-charcoal/70 leading-relaxed italic">
          A 50% deposit is required to confirm your membership. Memberships are non-transferable. 
          Monthly memberships may be paused once per quarter with at least 7 days&apos; written notice. 
          Cancellations submitted more than 14 days before the next billing cycle will receive a 70% deposit refund. 
          Cancellations within 7-13 days receive 50%, and within 24 hours, no refund is issued. 
          Ezra Center reserves the right to terminate memberships for breach of facility rules.
        </p>
      </section>

      {/* AGREEMENT & SUBMIT */}
      <section className="space-y-8">
        <div className="flex items-start gap-4">
          <input 
            type="checkbox" 
            {...register('agreed')} 
            id="agreed"
            className="mt-1 w-5 h-5 rounded border-charcoal/20 text-gold focus:ring-gold pointer-events-auto" 
          />
          <label htmlFor="agreed" className="font-sans text-sm text-charcoal/60 leading-normal">
            I have read and agree to the <a href="#" className="underline hover:text-gold transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-gold transition-colors">Privacy Policy</a>. I understand the membership and cancellation policy stated above.
          </label>
        </div>
        {errors.agreed && <p className="mt-1 text-xs text-red-500">{errors.agreed.message}</p>}

        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-medium text-charcoal/40 uppercase tracking-widest">
            <Lock className="w-3 h-3" />
            Your information is encrypted and secure
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="group flex items-center justify-center gap-3 w-full max-w-md bg-navy text-white font-sans text-xs font-bold uppercase tracking-[0.2em] py-5 rounded-full transition-all hover:bg-navy-light shadow-2xl"
          >
            Submit Application
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>
      </section>
    </form>
  )
}
