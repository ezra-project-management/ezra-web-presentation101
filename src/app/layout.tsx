import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { ConditionalFooter } from '@/components/layout/ConditionalFooter'
import { AIChatBubble } from '@/components/ai/AIChatBubble'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { TextScaleControl } from '@/components/ui/TextScaleControl'
import { Toaster } from 'sonner'
import { BookingProvider } from '@/lib/booking-context'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0F2C4A',
}

const siteDescription =
  'Premier conferencing, wellness, and hospitality in Nairobi. Salon, spa, fitness, pools, and refined spaces — international standards, warm Kenyan welcome.'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ezracenter.org'),
  title: 'Premier Conferencing and Wellness hub in Nairobi | Ezra Center',
  description: siteDescription,
  openGraph: {
    title: 'Premier Conferencing and Wellness hub in Nairobi',
    description: siteDescription,
    siteName: 'Ezra Center',
    locale: 'en_KE',
    type: 'website',
    images: [
      {
        url: '/images/image-resizing-2.jpeg',
        width: 1200,
        height: 630,
        alt: 'Ezra Center',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premier Conferencing and Wellness hub in Nairobi',
    description: siteDescription,
    images: ['/images/image-resizing-2.jpeg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-charcoal pb-[5rem] sm:pb-[5.5rem]" suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html:
              '!function(){try{var s=localStorage.getItem("ezra-text-scale");if(s)document.documentElement.style.setProperty("--ezra-text-scale",s)}catch(e){}}();',
          }}
        />
        <ScrollProgress />
        <Navbar />
        <BookingProvider>
          <main>{children}</main>
        </BookingProvider>
        <ConditionalFooter />
        <AIChatBubble />
        <TextScaleControl />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-dm-sans)',
            },
          }}
        />
      </body>
    </html>
  )
}
