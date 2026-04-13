import type { Metadata } from 'next'
import { LegalPageShell } from '@/components/legal/LegalPageShell'

export const metadata: Metadata = {
  title: 'Terms of Service | Ezra Center',
  description: 'Terms and conditions for using Ezra Center services and digital platforms.',
}

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service" updated="1 April 2026">
      <p>
        These terms govern your use of Ezra Center’s website, booking tools, and on-site services in Nairobi.
        By booking or visiting, you agree to them. If you do not agree, please do not use our services.
      </p>

      <h2>Services</h2>
      <p>
        We provide hospitality, wellness, fitness, meeting, and event-related services as described on our
        website and at our venue. Descriptions, images, and starting prices are indicative; final charges depend
        on your selected package, duration, and add-ons confirmed at booking or point of sale.
      </p>

      <h2>Bookings and payments</h2>
      <ul>
        <li>Bookings are confirmed when we acknowledge them electronically or in writing, subject to availability.</li>
        <li>Prices are quoted in Kenyan Shillings unless stated otherwise.</li>
        <li>
          For paid services, you agree to pay according to the method shown at checkout or at the desk
          (including M-Pesa or card where accepted).
        </li>
        <li>Late cancellation or no-show fees may apply as communicated at the time of booking.</li>
      </ul>

      <h2>Conduct</h2>
      <p>
        We expect respectful behaviour toward staff and other guests. We may refuse service or remove anyone
        who endangers safety, damages property, or disrupts operations, without prejudice to our other rights.
      </p>

      <h2>Health and safety</h2>
      <p>
        Some activities (fitness, pool, treatments) carry inherent risk. You confirm you are fit to participate
        and will follow staff instructions. Inform us of medical conditions where relevant.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by Kenyan law, Ezra Center is not liable for indirect or consequential
        loss, or for loss arising from events outside our reasonable control. Nothing in these terms excludes
        liability that cannot legally be excluded.
      </p>

      <h2>Intellectual property</h2>
      <p>
        Content on this site (logos, text, design) belongs to Ezra Center or its licensors. You may not copy or
        exploit it for commercial use without permission.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of Kenya. Courts in Nairobi shall have non-exclusive jurisdiction
        over disputes, subject to any mandatory consumer protections.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms:{' '}
        <a href="mailto:legal@ezracenter.com" className="text-gold-dark hover:underline">
          legal@ezracenter.com
        </a>
      </p>
    </LegalPageShell>
  )
}
