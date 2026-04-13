import { cn } from '@/lib/utils'

/** Secondary CTA on dark hero / imagery — frosted glass (matches “Book a visit”). */
export const btnGlassOnDark =
  'inline-flex items-center justify-center rounded-sm border border-white/20 bg-white/[0.05] px-8 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-300 hover:border-gold/50 hover:bg-white/[0.1]'

/** Compact glass control on dark (nav login, small pills). */
export const btnGlassOnDarkSm =
  'inline-flex items-center justify-center rounded-full border border-white/20 bg-white/[0.06] px-5 py-2 font-sans text-sm font-medium text-white/90 backdrop-blur-md transition-all duration-300 hover:border-gold/45 hover:bg-white/[0.1]'

/** CTA strip on photo cards (service grid). */
export const btnGlassOnPhoto =
  'inline-flex flex-1 items-center justify-center rounded-xl border border-white/25 bg-white/[0.12] px-4 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md transition-all duration-300 group-hover:border-gold/45 group-hover:bg-white/[0.18] sm:flex-initial sm:min-w-[8.5rem]'

/** Frosted button on white / light cards. */
export const btnGlassOnLight =
  'inline-flex w-full items-center justify-center rounded-xl border border-navy/10 bg-white/85 px-5 py-3 font-sans text-sm font-semibold text-navy shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-md transition-all duration-300 hover:border-gold/35 hover:bg-white hover:shadow-md'

export const btnGlassOnDarkLg =
  'inline-flex items-center justify-center gap-2 rounded-lg border border-white/22 bg-white/[0.06] px-8 py-4 font-sans text-lg font-medium text-white backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-500 hover:border-gold/45 hover:bg-white/[0.1]'

export function glassOnDarkClassName(className?: string) {
  return cn(btnGlassOnDark, className)
}
