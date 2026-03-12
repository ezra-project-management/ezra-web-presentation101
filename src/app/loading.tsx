'use client'

import Image from 'next/image'

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-navy overflow-hidden">
      {/* Animated radial glows */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gold/8 blur-[100px] animate-logo-breathe" />
      <div className="absolute w-[200px] h-[200px] rounded-full bg-gold/5 blur-[60px] animate-loading-pulse-slow" />

      {/* Spinning ring behind logo */}
      <div className="relative">
        <div className="absolute -inset-4 rounded-full border border-gold/20 animate-spin-slow" />
        <div className="absolute -inset-4 rounded-full border border-transparent border-t-gold/50 animate-spin-slow" />

        {/* Logo container */}
        <div className="relative animate-logo-breathe">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gold/40 shadow-[0_0_40px_rgba(201,168,76,0.2)]">
            <Image
              src="/ezralogo.jpeg"
              alt="Ezra Annex"
              width={128}
              height={128}
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Animated gold dots */}
      <div className="mt-10 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gold/80 animate-loading-dot-1" />
        <span className="w-2 h-2 rounded-full bg-gold/60 animate-loading-dot-2" />
        <span className="w-2 h-2 rounded-full bg-gold/40 animate-loading-dot-3" />
      </div>
    </div>
  )
}
