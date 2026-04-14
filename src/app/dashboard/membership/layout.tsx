import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'Your Ezra Center membership — executive tiers, loyalty rewards, and a refined wellness experience in Nairobi.',
}

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return children
}
