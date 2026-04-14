'use client'

import { useState } from 'react'
import { toast } from 'sonner'

const options = [
  'Gym / Fitness Centre Membership - Monthly',
  'Swimming Pool Membership - Monthly',
]

export default function PublicMembershipPage() {
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [membershipType, setMembershipType] = useState(options[0])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    toast.success('Membership request received. We will contact you shortly.')
    setFullName('')
    setPhone('')
    setEmail('')
    setMembershipType(options[0])
  }

  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-gold/20 bg-gradient-to-br from-white to-cream/40 p-6 shadow-card sm:p-8">
        <h1 className="font-display text-3xl font-semibold text-navy">Membership</h1>
        <p className="mt-2 font-sans text-sm text-charcoal/60">
          Choose a monthly membership and share your details. Our team will confirm pricing and activation.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {options.map((option) => (
            <div key={option} className="rounded-xl border border-charcoal/10 bg-white p-4">
              <p className="font-sans text-sm font-semibold text-navy">{option}</p>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block font-sans text-xs font-semibold uppercase tracking-wide text-charcoal/55">
              Full name
            </label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-charcoal/20 px-4 py-3 font-sans text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-sans text-xs font-semibold uppercase tracking-wide text-charcoal/55">
                Phone
              </label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-charcoal/20 px-4 py-3 font-sans text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>
            <div>
              <label className="mb-1 block font-sans text-xs font-semibold uppercase tracking-wide text-charcoal/55">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-charcoal/20 px-4 py-3 font-sans text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-sans text-xs font-semibold uppercase tracking-wide text-charcoal/55">
              Membership option
            </label>
            <select
              value={membershipType}
              onChange={(e) => setMembershipType(e.target.value)}
              className="w-full rounded-xl border border-charcoal/20 px-4 py-3 font-sans text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
            >
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gold px-4 py-3 font-sans text-sm font-semibold text-navy transition hover:bg-gold-light"
          >
            Submit membership request
          </button>
        </form>
      </div>
    </section>
  )
}
