'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  CalendarDays,
  CheckCircle,
  Bell,
  Star,
  Tag,
  MessageSquare,
  Settings,
} from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'
import { NOTIFICATIONS_DATA } from '@/lib/dashboard-data'

type NotificationType = 'booking' | 'payment' | 'reminder' | 'loyalty' | 'promo' | 'review' | 'system'

const typeConfig: Record<NotificationType, { icon: typeof Bell; bg: string; text: string }> = {
  booking: { icon: CalendarDays, bg: 'bg-teal/15', text: 'text-teal' },
  payment: { icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-700' },
  reminder: { icon: Bell, bg: 'bg-navy/10', text: 'text-navy' },
  loyalty: { icon: Star, bg: 'bg-gold/15', text: 'text-gold-dark' },
  promo: { icon: Tag, bg: 'bg-orange-100', text: 'text-orange-700' },
  review: { icon: MessageSquare, bg: 'bg-purple-100', text: 'text-purple-700' },
  system: { icon: Settings, bg: 'bg-gray-100', text: 'text-gray-600' },
}

const filterTabs = [
  { key: 'All', types: null },
  { key: 'Bookings', types: ['booking', 'reminder'] },
  { key: 'Payments', types: ['payment'] },
  { key: 'Loyalty', types: ['loyalty'] },
  { key: 'Promotions', types: ['promo'] },
]

function timeAgo(dateStr: string) {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function groupByDate(notifications: typeof NOTIFICATIONS_DATA) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  const groups: { label: string; items: typeof NOTIFICATIONS_DATA }[] = [
    { label: 'Today', items: [] },
    { label: 'This Week', items: [] },
    { label: 'Earlier', items: [] },
  ]

  notifications.forEach(n => {
    const date = new Date(n.time)
    if (date >= today) groups[0].items.push(n)
    else if (date >= weekAgo) groups[1].items.push(n)
    else groups[2].items.push(n)
  })

  return groups.filter(g => g.items.length > 0)
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA)

  const unreadCount = notifications.filter(n => !n.read).length

  const filtered = activeTab === 'All'
    ? notifications
    : notifications.filter(n => {
        const tab = filterTabs.find(t => t.key === activeTab)
        return tab?.types?.includes(n.type)
      })

  const grouped = groupByDate(filtered)

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AnimatedSection>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl text-navy font-semibold">
              Notifications
            </h1>
            <p className="mt-1 font-sans text-sm text-gray-400">
              {unreadCount > 0 ? `${unreadCount} unread` : 'You\'re all caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="font-sans text-sm text-gold font-medium hover:text-gold-dark transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
      </AnimatedSection>

      {/* Filter Tabs */}
      <AnimatedSection delay={0.08}>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-2 rounded-full font-sans text-sm font-medium transition-all duration-200 whitespace-nowrap',
                activeTab === tab.key
                  ? 'bg-navy text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {tab.key}
            </button>
          ))}
        </div>
      </AnimatedSection>

      {/* Notifications grouped by date */}
      {grouped.length === 0 ? (
        <AnimatedSection delay={0.16}>
          <div className="text-center py-16 bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card">
            <div className="w-16 h-16 mx-auto rounded-full bg-gold/10 flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-gold" />
            </div>
            <p className="font-display text-xl text-navy font-semibold">You&apos;re all caught up!</p>
            <p className="font-sans text-sm text-gray-400 mt-1">No notifications in this category</p>
          </div>
        </AnimatedSection>
      ) : (
        grouped.map((group) => (
          <div key={group.label}>
            <AnimatedSection delay={0.12}>
              <p className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-3">
                {group.label}
              </p>
            </AnimatedSection>

            <div className="space-y-3">
              {group.items.map((notification, i) => {
                const config = typeConfig[notification.type as NotificationType] || typeConfig.system
                const Icon = config.icon

                return (
                  <AnimatedSection key={notification.id} delay={0.14 + i * 0.05}>
                    <div
                      onClick={() => markRead(notification.id)}
                      className={cn(
                        'bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-5 flex items-start gap-4 hover:shadow-card-hover transition-all duration-300 cursor-pointer',
                        !notification.read && 'border-l-[3px] border-gold bg-gold/5'
                      )}
                    >
                      {/* Icon */}
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                        config.bg
                      )}>
                        <Icon className={cn('w-5 h-5', config.text)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-sans text-sm font-medium text-navy flex items-center gap-2">
                            {notification.title}
                            {!notification.read && (
                              <span className="w-2 h-2 rounded-full bg-gold animate-pulse-dot" />
                            )}
                          </p>
                          <span className="font-sans text-xs text-gray-400 whitespace-nowrap shrink-0">
                            {timeAgo(notification.time)}
                          </span>
                        </div>
                        <p className="mt-1 font-sans text-sm text-charcoal/60 leading-relaxed">
                          {notification.message}
                        </p>
                        {notification.actionLabel && notification.actionHref && (
                          <Link
                            href={notification.actionHref}
                            className="inline-block mt-3 font-sans text-sm text-gold font-medium hover:text-gold-dark transition-colors"
                          >
                            {notification.actionLabel} &rarr;
                          </Link>
                        )}
                      </div>
                    </div>
                  </AnimatedSection>
                )
              })}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
