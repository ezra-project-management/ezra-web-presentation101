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

export const POLICY_HEADLINE = 'Your 24-hour grace window'

export const POLICY_LEAD_UPCOMING =
  'Think of it as hotel-style flexibility: you may cancel this visit or move it to another time without charge — as long as you let us know at least twenty-four hours before you were due to walk through our doors.'

export const POLICY_LEAD_UPCOMING_PAST =
  'The complimentary twenty-four-hour window for this visit has passed. Cancellations from here carry a 50% fee — we still love you; we just need to protect our team and the room we held for you.'

export const POLICY_LEAD_ARCHIVED =
  'Every Ezra reservation carries the same twenty-four-hour courtesy on future bookings — cancel or reschedule free until the day before your slot.'

export const POLICY_TRUST_BADGE = '24-hour flexible cancellation'

export const POLICY_MICRO =
  '24h free cancel / reschedule before your slot — open the booking for the full story.'
