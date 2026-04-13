import { HeroSection } from '@/components/home/HeroSection'
import { ServicesGrid } from '@/components/home/ServicesGrid'
import { GallerySection } from '@/components/home/GallerySection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { CTASection } from '@/components/home/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesGrid />
      <GallerySection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
