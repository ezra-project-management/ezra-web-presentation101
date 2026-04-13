/**
 * Starting-from prices (KSh) — single source for web + admin demos.
 * Display via `formatCurrency()` everywhere. Mirror in `ezra-admin/service-pricing.ts`.
 */
export const STARTING_PRICE_KES: Record<string, number> = {
  'salon-spa': 1800,
  barbershop: 850,
  gym: 1200,
  boardroom: 4500,
  ballroom: 85000,
  'banquet-hall': 35000,
  'swimming-pool': 2200,
}

export function startingPriceForSlug(slug: string): number {
  return STARTING_PRICE_KES[slug] ?? 0
}
