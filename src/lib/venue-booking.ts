/** Boardroom, ballroom & banquet — headcount drives ops; hire is priced per slot, not per guest. */

export const VENUE_SLUGS = new Set(['boardroom', 'ballroom', 'banquet-hall'])

export function isVenueSlug(slug: string): boolean {
  return VENUE_SLUGS.has(slug)
}

export function defaultVenueAttendees(slug: string): number {
  if (slug === 'boardroom') return 12
  if (slug === 'ballroom') return 120
  if (slug === 'banquet-hall') return 80
  return 1
}

export function maxVenueAttendees(slug: string): number {
  if (slug === 'boardroom') return 40
  if (slug === 'ballroom') return 500
  if (slug === 'banquet-hall') return 150
  return 999
}

export function minVenueAttendees(_slug: string): number {
  return 1
}
