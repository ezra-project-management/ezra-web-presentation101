import type { Metadata } from 'next'
import { LegalPageShell } from '@/components/legal/LegalPageShell'

export const metadata: Metadata = {
  title: 'Privacy Policy | Ezra Center',
  description: 'How Ezra Center collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy" updated="1 April 2026">
      <p>
        Ezra Center (“we”, “us”) respects your privacy. This policy describes how we handle personal
        information when you use our website, book services, visit our premises, or interact with our team
        in Nairobi. We aim for the same care you would expect from a premium hospitality brand.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account and booking details:</strong> name, phone number, email, service selections,
          appointment times, and payment references where applicable.
        </li>
        <li>
          <strong>Visit information:</strong> arrival times, preferences you share with us, and loyalty or
          membership activity.
        </li>
        <li>
          <strong>Technical data:</strong> device type, browser, approximate location (e.g. city-level), and
          cookies used to keep sessions secure and improve the site.
        </li>
      </ul>

      <h2>How we use information</h2>
      <ul>
        <li>To confirm, change, or remind you about bookings.</li>
        <li>To deliver services safely and personalize your visit where you ask us to.</li>
        <li>To operate loyalty or membership programmes you join.</li>
        <li>To meet legal, tax, and accounting requirements in Kenya.</li>
        <li>To improve our digital channels and staff tools, using aggregated or de-identified data where possible.</li>
      </ul>

      <h2>Staff and confidentiality</h2>
      <p>
        Operational staff see only what they need to deliver your service (for example, time slot and service
        type). Where the law or our internal policies require it, guest identity may be limited on certain
        staff screens to protect privacy until check-in or payment is completed. Managers and reception may
        access fuller records for legitimate business purposes.
      </p>

      <h2>Sharing</h2>
      <p>
        We do not sell your personal data. We may share information with payment processors, SMS or email
        providers, and professional advisers where necessary to run Ezra Center. Any transfer outside Kenya
        will follow applicable data protection rules and appropriate safeguards.
      </p>

      <h2>Retention</h2>
      <p>
        We keep booking and financial records for as long as required for operations, disputes, and law. Marketing
        preferences and analytics data are kept shorter unless you remain an active member or subscriber.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>Ask to access or correct your personal information.</li>
        <li>Opt out of non-essential marketing messages.</li>
        <li>Request deletion where we are not legally required to retain data.</li>
      </ul>
      <p>
        Contact us at{' '}
        <a href="mailto:privacy@ezracenter.org" className="text-gold-dark hover:underline">
          privacy@ezracenter.org
        </a>{' '}
        or through the details on our Contact page.
      </p>

      <h2>Security</h2>
      <p>
        We use reasonable technical and organisational measures to protect information. No online system is
        perfectly secure; please use strong passwords and notify us if you suspect misuse.
      </p>

      <h2>Updates</h2>
      <p>
        We may update this policy from time to time. The “Last updated” date at the top will change when we do.
        Continued use of our services after changes means you accept the revised policy.
      </p>
    </LegalPageShell>
  )
}
