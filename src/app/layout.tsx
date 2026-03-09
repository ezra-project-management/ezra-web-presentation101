import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { ConditionalFooter } from '@/components/layout/ConditionalFooter'
import { AIChatBubble } from '@/components/ai/AIChatBubble'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { Toaster } from 'sonner'

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

export const metadata: Metadata = {
  title: 'Ezra Annex | Premium Hospitality & Wellness in Nairobi',
  description:
    "Book world-class salon, gym, spa, events, boardrooms, and accommodation at Ezra Annex — Nairobi's premier lifestyle destination.",
  openGraph: {
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200',
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-charcoal" suppressHydrationWarning>
        <ScrollProgress />
        <Navbar />
        <main>{children}</main>
        <ConditionalFooter />
        <AIChatBubble />
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
