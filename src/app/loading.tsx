'use client'

import Image from 'next/image'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-navy">
      {/* Radial glow behind logo */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-gold/10 blur-3xl" />

      {/* Logo */}
      <div className="relative animate-logo-breathe">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold/30 shadow-gold">
          <Image
            src="/ezralogo.jpeg"
            alt="Ezra Annex"
            width={80}
            height={80}
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Brand name */}
      <div className="mt-6 flex items-center gap-1.5">
        <span className="font-display text-2xl font-bold text-white tracking-wider">
          EZRA
        </span>
        <span className="font-display text-2xl font-light text-white/60 tracking-wider">
          ANNEX
        </span>
      </div>

      {/* Animated gold line */}
      <div className="mt-8 w-40 h-[2px] rounded-full bg-white/10 overflow-hidden">
        <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-gold to-transparent animate-loading-slide" />
      </div>
    </div>
  )
}
