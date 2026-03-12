import { notFound } from 'next/navigation'
import { SERVICES } from '@/lib/services'
import { BookPageClient } from './BookPageClient'

export default async function BookServicePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = SERVICES.find((s) => s.slug === slug)

  if (!service) {
    notFound()
  }

  return <BookPageClient service={service} />
}
