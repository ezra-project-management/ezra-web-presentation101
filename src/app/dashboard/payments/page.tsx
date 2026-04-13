'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import CountUp from 'react-countup'
import { CreditCard, Banknote, Smartphone, Download } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import { CURRENT_USER, UPCOMING_BOOKINGS, PAST_BOOKINGS, SPENDING_CHART_DATA } from '@/lib/dashboard-data'

const allPayments = [
  ...UPCOMING_BOOKINGS.filter(b => b.paymentMethod).map(b => ({
    id: b.id,
    date: b.date,
    service: b.service,
    reference: b.reference,
    amount: b.amount,
    method: b.paymentMethod!,
    mpesaRef: b.mpesaRef,
    status: b.status === 'CONFIRMED' ? 'Paid' : 'Pending',
  })),
  ...PAST_BOOKINGS.filter(b => b.status !== 'CANCELLED').map(b => ({
    id: b.id,
    date: b.date,
    service: b.service,
    reference: b.reference,
    amount: b.amount,
    method: b.paymentMethod,
    mpesaRef: null as string | null,
    status: 'Paid' as const,
  })),
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const thisMonthSpend = SPENDING_CHART_DATA[SPENDING_CHART_DATA.length - 1].amount

const methodIcons: Record<string, typeof CreditCard> = {
  MPESA: Smartphone,
  CASH: Banknote,
  CARD: CreditCard,
}

const methodColors: Record<string, string> = {
  MPESA: 'bg-green-50 text-green-700',
  CASH: 'bg-navy/5 text-navy',
  CARD: 'bg-blue-50 text-blue-700',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function PaymentsPage() {
  return (
    <div className="space-y-8">
      <AnimatedSection>
        <h1 className="font-display text-2xl lg:text-3xl text-navy font-semibold">
          Payments
        </h1>
      </AnimatedSection>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: 'Total Spent',
            sublabel: 'All time',
            value: CURRENT_USER.totalSpent,
            icon: CreditCard,
            color: 'text-navy',
          },
          {
            label: 'This Month',
            sublabel: 'March 2026',
            value: thisMonthSpend,
            icon: Smartphone,
            color: 'text-gold-dark',
          },
          {
            label: 'Last Payment',
            sublabel: formatDate(allPayments[0]?.date || ''),
            value: allPayments[0]?.amount || 0,
            icon: Banknote,
            color: 'text-emerald-600',
          },
        ].map((card, i) => (
          <AnimatedSection key={card.label} delay={i * 0.08}>
            <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-sans text-xs uppercase tracking-widest text-gray-400">
                    {card.label}
                  </p>
                  <p className="font-display text-3xl font-bold text-navy mt-2">
                    KSh <CountUp end={card.value} duration={1.5} separator="," />
                  </p>
                  <p className="font-sans text-xs text-gray-400 mt-1">{card.sublabel}</p>
                </div>
                <div className={cn('w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center', card.color)}>
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Spending Chart */}
      <AnimatedSection delay={0.24}>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6">
          <h3 className="font-display text-lg text-navy font-semibold mb-1">Spending Overview</h3>
          <p className="font-sans text-xs text-gray-400 mb-6">Last 6 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={SPENDING_CHART_DATA}>
              <defs>
                <linearGradient id="payGoldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A84C" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontFamily: 'var(--font-dm-sans)' }}
                formatter={(value) => [`KSh ${Number(value).toLocaleString()}`, 'Spent']}
              />
              <Area type="monotone" dataKey="amount" stroke="#C9A84C" strokeWidth={2.5} fill="url(#payGoldGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </AnimatedSection>

      {/* Payment History */}
      <AnimatedSection delay={0.32}>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card overflow-hidden">
          <div className="p-6 pb-0">
            <h3 className="font-display text-lg text-navy font-semibold">Payment History</h3>
          </div>
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left font-sans text-xs uppercase tracking-widest text-gray-400 px-6 pb-3">Date</th>
                  <th className="text-left font-sans text-xs uppercase tracking-widest text-gray-400 px-6 pb-3">Service</th>
                  <th className="text-left font-sans text-xs uppercase tracking-widest text-gray-400 px-6 pb-3">Reference</th>
                  <th className="text-left font-sans text-xs uppercase tracking-widest text-gray-400 px-6 pb-3">Amount</th>
                  <th className="text-left font-sans text-xs uppercase tracking-widest text-gray-400 px-6 pb-3">Method</th>
                  <th className="text-left font-sans text-xs uppercase tracking-widest text-gray-400 px-6 pb-3">Status</th>
                  <th className="text-right font-sans text-xs uppercase tracking-widest text-gray-400 px-6 pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {allPayments.map((payment) => {
                  const MethodIcon = methodIcons[payment.method] || CreditCard
                  return (
                    <tr key={payment.id} className="border-b border-gray-50 last:border-0 hover:bg-cream/30 transition-colors">
                      <td className="px-6 py-4 font-sans text-sm text-gray-500">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-6 py-4 font-sans text-sm font-medium text-navy">
                        {payment.service}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-400">
                        {payment.reference}
                      </td>
                      <td className="px-6 py-4 font-sans text-sm font-semibold text-navy">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                          methodColors[payment.method] || 'bg-gray-50 text-gray-600'
                        )}>
                          <MethodIcon className="w-3 h-3" />
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          'rounded-full px-2.5 py-0.5 text-xs font-medium',
                          payment.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        )}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-navy transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
