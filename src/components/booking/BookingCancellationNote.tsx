'use client'

import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BookingStatus } from '@/lib/booking-context'
import {
  POLICY_HEADLINE,
  POLICY_LEAD_ARCHIVED,
  POLICY_LEAD_UPCOMING,
  POLICY_LEAD_UPCOMING_PAST,
  POLICY_MICRO,
  formatPolicyDeadline,
  isFreeCancellationWindow,
} from '@/lib/booking-copy'

type Variant = 'detail' | 'card' | 'compact' | 'inline' | 'micro'

export function BookingCancellationNote({
  status,
  cancellationDeadline,
  variant,
  className,
}: {
  status: BookingStatus
  cancellationDeadline: string | null
  variant: Variant
  className?: string
}) {
  const archived = status === 'COMPLETED' || status === 'CANCELLED'
  const upcoming = status === 'CONFIRMED' || status === 'PENDING_PAYMENT'
  const deadlineLine = formatPolicyDeadline(cancellationDeadline)
  const withinWindow = isFreeCancellationWindow(cancellationDeadline)

  if (variant === 'micro') {
    return (
      <p className={cn('font-sans text-[10px] text-charcoal/45 leading-snug mt-1', className)}>
        {POLICY_MICRO}
      </p>
    )
  }

  if (variant === 'compact') {
    if (archived) {
      return (
        <p className={cn('font-sans text-[10px] text-charcoal/40 mt-1 max-w-[220px]', className)}>
          {POLICY_LEAD_ARCHIVED}
        </p>
      )
    }
    return (
      <p className={cn('font-sans text-[10px] text-amber-800/90 mt-1 max-w-[260px] leading-snug', className)}>
        <Sparkles className="inline w-3 h-3 mr-0.5 text-gold -translate-y-px" />
        {upcoming
          ? withinWindow
            ? `Cancel or reschedule free until 24h before your slot${deadlineLine ? ` — by ${deadlineLine}` : ''}.`
            : 'The free 24h window has passed; 50% fee on cancel.'
          : POLICY_LEAD_ARCHIVED}
      </p>
    )
  }

  if (archived) {
    const body = (
      <p className="font-sans text-xs text-charcoal/55 leading-relaxed">{POLICY_LEAD_ARCHIVED}</p>
    )
    if (variant === 'detail') {
      return (
        <div
          className={cn(
            'rounded-xl border border-charcoal/10 bg-cream/50 p-4',
            className
          )}
        >
          <p className="font-sans text-xs uppercase tracking-widest text-charcoal/40 mb-2">
            How we treat changes
          </p>
          {body}
        </div>
      )
    }
    return (
      <div className={cn('rounded-xl border border-charcoal/8 bg-navy/[0.03] p-3', className)}>
        {body}
      </div>
    )
  }

  const showPastCopy = upcoming && !withinWindow
  const lead = showPastCopy ? POLICY_LEAD_UPCOMING_PAST : POLICY_LEAD_UPCOMING
  const isCard = variant === 'card'
  const headlineCls = isCard
    ? 'font-sans text-[10px] uppercase tracking-widest text-amber-800/80 mb-1.5 flex items-center gap-1.5'
    : 'font-sans text-xs uppercase tracking-widest text-amber-800/80 mb-2 flex items-center gap-1.5'
  const leadCls = isCard
    ? 'font-sans text-xs text-amber-900/85 leading-relaxed'
    : 'font-sans text-sm text-amber-900/85 leading-relaxed'

  const inner = (
    <>
      <p className={headlineCls}>
        <Sparkles className={cn('text-gold shrink-0', isCard ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
        {POLICY_HEADLINE}
      </p>
      <p className={leadCls}>{lead}</p>
      {deadlineLine && upcoming && (
        <ul className={cn('font-sans text-amber-900/90 mt-3 space-y-1.5 list-disc pl-4', isCard ? 'text-[11px]' : 'text-sm')}>
          {withinWindow ? (
            <>
              <li>
                <strong>Free until:</strong> {deadlineLine}
              </li>
              <li>After that, cancelling costs 50% of this booking.</li>
            </>
          ) : (
            <>
              <li>
                <strong>Free window ended:</strong> {deadlineLine}
              </li>
              <li>Cancelling now: 50% fee. You can still cancel in the app.</li>
            </>
          )}
        </ul>
      )}
      {!deadlineLine && upcoming && (
        <p className={cn('font-sans text-amber-800/80 mt-2', isCard ? 'text-[11px] leading-snug' : 'text-sm')}>
          The deadline is 24 hours before your scheduled start time.
        </p>
      )}
    </>
  )

  if (variant === 'detail') {
    return (
      <div
        className={cn(
          'rounded-xl border border-amber-200/60 bg-gradient-to-br from-amber-50/80 to-amber-50/30 p-4',
          className
        )}
      >
        {inner}
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'rounded-xl border border-gold/25 bg-navy/[0.02] p-4 text-left',
          className
        )}
      >
        {inner}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-amber-200/50 bg-amber-50/40 p-3 mt-3',
        className
      )}
    >
      {inner}
    </div>
  )
}
