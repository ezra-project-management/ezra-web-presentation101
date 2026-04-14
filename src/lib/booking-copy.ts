/** Shared guest-facing copy for Ezra’s 24-hour cancellation / reschedule policy */

function convertTo24(time12: string) {
  const [time, modifier] = time12.split(' ')
  const [h, m] = time.split(':')
  let hours = parseInt(h, 10)
  if (modifier === 'PM' && hours < 12) hours += 12
  if (modifier === 'AM' && hours === 12) hours = 0
  return `${hours.toString().padStart(2, '0')}:${m}:00`
}

/** ISO instant 24 hours before the scheduled service (local calendar date + slot time). */
export function computeCancellationDeadline(dateStr: string, time12: string): string {
  const start = new Date(`${dateStr}T${convertTo24(time12)}`)
  return new Date(start.getTime() - 24 * 60 * 60 * 1000).toISOString()
}

export function isFreeCancellationWindow(cancellationDeadline: string | null): boolean {
  if (!cancellationDeadline) return true
  const t = new Date(cancellationDeadline).getTime()
  if (Number.isNaN(t)) return true
  return t > Date.now()
}

/** Friendly line for the exact cut-off, when we have a stored deadline. */
export function formatPolicyDeadline(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export const POLICY_HEADLINE = 'Cancelling or rescheduling'

export const POLICY_LEAD_UPCOMING =
  'Cancel or move your visit for free if you tell us at least 24 hours before your appointment time.'

export const POLICY_LEAD_UPCOMING_PAST =
  'The free 24-hour window has passed. If you cancel now, a 50% fee applies.'

export const POLICY_LEAD_ARCHIVED =
  'Future bookings follow the same rule: free changes until 24 hours before your slot.'

export const POLICY_TRUST_BADGE = '24-hour flexible cancellation'

export const POLICY_MICRO = 'Free cancel or reschedule up to 24h before your visit.'

export const DEPOSIT_REQUIRED_SERVICE_SLUGS = ['boardroom', 'ballroom', 'banquet-hall', 'gym'] as const

export function requiresDeposit(serviceSlug: string): boolean {
  return DEPOSIT_REQUIRED_SERVICE_SLUGS.includes(serviceSlug as (typeof DEPOSIT_REQUIRED_SERVICE_SLUGS)[number])
}

export function isBallroomOrBanquet(serviceSlug: string): boolean {
  return serviceSlug === 'ballroom' || serviceSlug === 'banquet-hall'
}
