'use client'

import {
  motion,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
  type TargetAndTransition,
  type Transition,
} from 'framer-motion'
import { useRef, ReactNode } from 'react'

type AnimationVariant =
  | 'fadeUp'
  | 'fadeDown'
  | 'fadeLeft'
  | 'fadeRight'
  | 'scaleUp'
  | 'blurIn'
  | 'slideReveal'
  | 'clipUp'

interface AnimatedSectionProps {
  children: ReactNode
  delay?: number
  className?: string
  variant?: AnimationVariant
  /** Ignored when spring is used — kept for reduced-motion fallback */
  duration?: number
}

const animations: Record<AnimationVariant, { initial: TargetAndTransition; animate: TargetAndTransition }> = {
  fadeUp: {
    initial: { opacity: 0, y: 52 },
    animate: { opacity: 1, y: 0 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -44 },
    animate: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    initial: { opacity: 0, x: -52 },
    animate: { opacity: 1, x: 0 },
  },
  fadeRight: {
    initial: { opacity: 0, x: 52 },
    animate: { opacity: 1, x: 0 },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
  blurIn: {
    initial: { opacity: 0, filter: 'blur(14px)', y: 24 },
    animate: { opacity: 1, filter: 'blur(0px)', y: 0 },
  },
  slideReveal: {
    initial: { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
    animate: { opacity: 1, clipPath: 'inset(0 0 0% 0)' },
  },
  clipUp: {
    initial: { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
    animate: { opacity: 1, clipPath: 'inset(0% 0 0 0)' },
  },
}

function buildTransition(
  reduceMotion: boolean | null,
  delay: number,
  duration: number,
  variant: AnimationVariant
): Transition {
  if (reduceMotion) {
    return { duration: 0.2, delay, ease: 'easeOut' }
  }
  /* Clip / slide-reveal paths feel better with a smooth curve than overshoot */
  if (variant === 'slideReveal' || variant === 'clipUp') {
    return { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }
  }
  return {
    type: 'spring',
    stiffness: variant === 'scaleUp' ? 320 : 280,
    damping: variant === 'blurIn' ? 34 : 30,
    mass: 0.72,
    delay,
  }
}

export function AnimatedSection({
  children,
  delay = 0,
  className = '',
  variant = 'fadeUp',
  duration = 0.9,
}: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-72px' })
  const reduceMotion = useReducedMotion()
  const anim = animations[variant]

  return (
    <motion.div
      ref={ref}
      initial={anim.initial}
      animate={isInView ? anim.animate : anim.initial}
      transition={buildTransition(reduceMotion, delay, duration, variant)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* Parallax wrapper for background images/sections */
export function ParallaxSection({
  children,
  className = '',
  speed = 0.3,
}: {
  children: ReactNode
  className?: string
  speed?: number
}) {
  const ref = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -100}px`, `${speed * 100}px`])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={reduceMotion ? undefined : { y }} className="absolute inset-0">
        {children}
      </motion.div>
    </div>
  )
}

/* Text reveal animation — word by word (springy when allowed) */
export function TextReveal({
  text,
  className = '',
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduceMotion = useReducedMotion()
  const words = text.split(' ')

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="mr-[0.3em] inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '118%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '118%', opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0.18, delay: delay + i * 0.02, ease: 'easeOut' }
                : {
                    type: 'spring',
                    stiffness: 380,
                    damping: 28,
                    mass: 0.55,
                    delay: delay + i * 0.045,
                  }
            }
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* Horizontal line reveal animation */
export function LineReveal({
  className = '',
  delay = 0,
}: {
  className?: string
  delay?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className={`h-px bg-gold/40 ${className}`}
      initial={{ scaleX: 0, transformOrigin: 'left' }}
      animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
      transition={
        reduceMotion
          ? { duration: 0.35, delay, ease: 'easeOut' }
          : { type: 'spring', stiffness: 260, damping: 26, mass: 0.6, delay }
      }
    />
  )
}
