export type MembershipTierId = 'basic' | 'premium' | 'vip'

export const MEMBERSHIP_STORAGE_KEY = 'ezra-membership-preference'

export const MEMBERSHIP_LABELS: Record<MembershipTierId, string> = {
  basic: 'Basic',
  premium: 'Premium',
  vip: 'VIP',
}

export type TierBenefit = { text: string; highlight?: boolean }

export interface MembershipTierDefinition {
  id: MembershipTierId
  name: string
  tagline: string
  priceNote: string
  /** Tailwind classes for the card surface (gradient + border) */
  cardClass: string
  badgeClass: string
  benefits: TierBenefit[]
}

export const MEMBERSHIP_TIERS: MembershipTierDefinition[] = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'Everything you need to book with ease.',
    priceNote: 'Included with your account',
    cardClass: 'bg-gradient-to-b from-slate-100/90 to-white border border-charcoal/10',
    badgeClass: 'bg-charcoal/10 text-charcoal',
    benefits: [
      { text: 'Book any service online, anytime' },
      { text: 'Loyalty points on every visit' },
      { text: 'SMS reminders before appointments' },
      { text: 'Standard cancellation window' },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Extra comfort, priority access, real savings.',
    priceNote: 'From KES 2,500 / month',
    cardClass: 'bg-gradient-to-b from-gold/15 to-cream/70 border border-gold/30',
    badgeClass: 'bg-gold/20 text-navy border border-gold/40',
    benefits: [
      { text: 'Priority booking — pick your favourite time first', highlight: true },
      { text: '10% off eligible services, automatically applied' },
      { text: '48-hour early access to new slots and events' },
      { text: 'Complimentary drink on arrival (select venues)' },
      { text: 'Birthday month: bonus points + a small gift from us' },
    ],
  },
  {
    id: 'vip',
    name: 'VIP',
    tagline: 'The full Ezra experience — reserved for our closest guests.',
    priceNote: 'From KES 6,500 / month',
    cardClass: 'bg-gradient-to-b from-navy via-navy-light to-navy-dark border border-gold/40',
    badgeClass: 'bg-gold text-navy-dark',
    benefits: [
      { text: 'Everything in Premium', highlight: true },
      { text: 'Dedicated concierge line (WhatsApp)' },
      { text: '15% off eligible services + exclusive packages' },
      { text: 'First choice of staff where available' },
      { text: 'Private room upgrades when we can offer them' },
      { text: 'Quarterly invite-only evenings' },
    ],
  },
]

export function getTierById(id: MembershipTierId): MembershipTierDefinition {
  return MEMBERSHIP_TIERS.find(t => t.id === id) ?? MEMBERSHIP_TIERS[0]
}
