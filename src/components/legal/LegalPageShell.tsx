import Link from 'next/link'

export function LegalPageShell({
  title,
  updated,
  children,
}: {
  title: string
  updated: string
  children: React.ReactNode
}) {
  return (
    <div className="pt-28 pb-20 min-h-screen bg-cream/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <nav className="mb-8 font-sans text-sm text-charcoal/50">
          <Link href="/" className="hover:text-gold transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gold">{title}</span>
        </nav>
        <h1 className="font-display text-3xl md:text-4xl text-navy font-semibold">{title}</h1>
        <p className="mt-2 font-sans text-sm text-charcoal/45">Last updated {updated}</p>
        <div className="mt-10 space-y-8 font-sans text-[15px] leading-relaxed text-charcoal/85 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-navy [&_h2]:mt-10 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
          {children}
        </div>
      </div>
    </div>
  )
}
