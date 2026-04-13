/**
 * Starting-from prices (KES) — keep in sync with ezra-admin `src/lib/service-pricing.ts`
 * (lowest menu price per venue from admin pricing tables).
 */
export const SERVICE_STARTING_PRICE_KES: Record<string, number> = {
  'salon-spa': 1000,
  barbershop: 500,
  gym: 1200,
  boardroom: 12000,
  ballroom: 120000,
  'banquet-hall': 40000,
  'swimming-pool': 2500,
}

export function startingPriceForSlug(slug: string): number {
  return SERVICE_STARTING_PRICE_KES[slug] ?? 0
}
