'use client'

import { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import * as Switch from '@radix-ui/react-switch'
import {
  Camera,
  Crown,
  Shield,
  CheckCircle,
  Monitor,
  Trash2,
  Download,
  ExternalLink,
} from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { cn } from '@/lib/utils'
import { CURRENT_USER } from '@/lib/dashboard-data'

const tabsList = [
  { value: 'personal', label: 'Personal Information' },
  { value: 'security', label: 'Security' },
  { value: 'preferences', label: 'Preferences' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'privacy', label: 'Privacy & Account' },
]

const serviceChips = [
  'Salon & Spa', 'Barbershop', 'Fitness Centre', 'Meeting Rooms',
  'Ballroom', 'Banquet Hall', 'Swimming Pool',
]

const dietaryOptions = ['Vegetarian', 'Vegan', 'Halal', 'Gluten-free', 'None']

const notificationChannels = [
  { label: 'Booking Confirmations', sms: true, email: true },
  { label: 'Booking Reminders', sms: true, email: false },
  { label: 'Payment Receipts', sms: true, email: true },
  { label: 'Promotional Offers', sms: false, email: false },
  { label: 'Loyalty Updates', sms: true, email: true },
  { label: 'System Updates', sms: false, email: true },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal')
  const [favouriteServices, setFavouriteServices] = useState(['Salon & Spa', 'Fitness Centre', 'Swimming Pool'])
  const [dietary, setDietary] = useState<string[]>(['None'])
  const [notifSettings, setNotifSettings] = useState(notificationChannels)

  const toggleFavService = (name: string) => {
    setFavouriteServices(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    )
  }

  const toggleDietary = (name: string) => {
    if (name === 'None') {
      setDietary(['None'])
    } else {
      setDietary(prev => {
        const next = prev.filter(d => d !== 'None')
        return next.includes(name) ? next.filter(d => d !== name) : [...next, name]
      })
    }
  }

  const toggleNotif = (index: number, channel: 'sms' | 'email') => {
    setNotifSettings(prev => prev.map((item, i) =>
      i === index ? { ...item, [channel]: !item[channel] } : item
    ))
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <AnimatedSection>
        <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="relative group">
              <div className="w-[72px] h-[72px] rounded-full bg-navy text-white flex items-center justify-center font-display text-2xl font-semibold border-[3px] border-gold/30">
                {CURRENT_USER.initials}
              </div>
              <button className="absolute inset-0 rounded-full bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>
            <div>
              <h1 className="font-display text-2xl text-navy font-semibold">
                {CURRENT_USER.firstName} {CURRENT_USER.lastName}
              </h1>
              <p className="font-sans text-sm text-gray-400 mt-0.5">
                {CURRENT_USER.email} &middot; {CURRENT_USER.phone}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-gold/20 to-gold/10 text-gold-dark border border-gold/30 font-sans">
                  <Crown className="w-3 h-3" />
                  Gold Member
                </span>
                <span className="font-sans text-xs text-gray-400">
                  Joined {CURRENT_USER.memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Tabs */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <AnimatedSection delay={0.08}>
          <Tabs.List className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {tabsList.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  'px-4 py-2 rounded-full font-sans text-sm font-medium transition-all duration-200 whitespace-nowrap',
                  activeTab === tab.value
                    ? 'bg-navy text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </AnimatedSection>

        {/* Tab 1: Personal Info */}
        <Tabs.Content value="personal">
          <AnimatedSection delay={0.16}>
            <div className="mt-6 bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'First Name', value: CURRENT_USER.firstName, verified: false },
                  { label: 'Last Name', value: CURRENT_USER.lastName, verified: false },
                  { label: 'Email', value: CURRENT_USER.email, verified: true },
                  { label: 'Phone', value: CURRENT_USER.phone, verified: false },
                  { label: 'Date of Birth', value: '1996-08-15', verified: false },
                  { label: 'City', value: 'Nairobi', verified: false },
                ].map((field) => (
                  <div key={field.label}>
                    <label className="flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-gray-400 mb-2">
                      {field.label}
                      {field.verified && (
                        <span className="flex items-center gap-0.5 text-emerald-600 normal-case tracking-normal">
                          <CheckCircle className="w-3 h-3" />
                          <span className="text-[10px]">Verified</span>
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      defaultValue={field.value}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold/20 outline-none transition bg-white"
                    />
                  </div>
                ))}
              </div>
              <button className="mt-6 px-6 py-3 bg-gold text-navy font-sans font-semibold text-sm rounded-xl hover:bg-gold-light transition-all duration-300 shadow-md hover:shadow-gold">
                Save Changes
              </button>
            </div>
          </AnimatedSection>
        </Tabs.Content>

        {/* Tab 2: Security */}
        <Tabs.Content value="security">
          <div className="mt-6 space-y-6">
            <AnimatedSection delay={0.16}>
              <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
                <h3 className="font-display text-lg text-navy font-semibold mb-6">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
                    <div key={label}>
                      <label className="block font-sans text-xs uppercase tracking-widest text-gray-400 mb-2">
                        {label}
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl font-sans text-sm focus:border-gold focus:ring-1 focus:ring-gold/20 outline-none transition bg-white"
                      />
                    </div>
                  ))}

                  {/* Password strength */}
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={cn(
                        'h-1.5 flex-1 rounded-full',
                        i <= 2 ? 'bg-red-400' : i <= 4 ? 'bg-gold' : 'bg-emerald-500',
                        i > 0 && 'bg-gray-200'
                      )} />
                    ))}
                  </div>

                  <button className="px-6 py-3 bg-gold text-navy font-sans font-semibold text-sm rounded-xl hover:bg-gold-light transition-all duration-300 shadow-md">
                    Update Password
                  </button>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.24}>
              <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
                <h3 className="font-display text-lg text-navy font-semibold mb-6">Active Sessions</h3>
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-sans text-sm font-medium text-navy">Chrome on MacOS</p>
                      <p className="font-sans text-xs text-gray-400">Last active 2 hours ago</p>
                    </div>
                  </div>
                  <span className="font-sans text-xs text-emerald-600 font-medium">Current</span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.32}>
              <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-navy" />
                    <div>
                      <p className="font-sans text-sm font-medium text-navy">Two-Factor Authentication</p>
                      <p className="font-sans text-xs text-gray-400">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Switch.Root className="w-11 h-6 bg-gray-200 rounded-full relative data-[state=checked]:bg-gold transition-colors">
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform data-[state=checked]:translate-x-5 translate-x-0.5" />
                  </Switch.Root>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Tabs.Content>

        {/* Tab 3: Preferences */}
        <Tabs.Content value="preferences">
          <div className="mt-6 space-y-6">
            <AnimatedSection delay={0.16}>
              <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
                <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-4">Favourite Services</h3>
                <div className="flex flex-wrap gap-2">
                  {serviceChips.map((name) => (
                    <button
                      key={name}
                      onClick={() => toggleFavService(name)}
                      className={cn(
                        'px-4 py-2 rounded-full font-sans text-sm transition-all duration-200',
                        favouriteServices.includes(name)
                          ? 'bg-gold/10 text-gold-dark border border-gold/30 font-medium'
                          : 'bg-gray-100 text-gray-500 border border-transparent hover:bg-gray-200'
                      )}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.24}>
              <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
                <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-4">Dietary Requirements</h3>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleDietary(option)}
                      className={cn(
                        'px-4 py-2 rounded-full font-sans text-sm transition-all duration-200',
                        dietary.includes(option)
                          ? 'bg-navy/10 text-navy border border-navy/20 font-medium'
                          : 'bg-gray-100 text-gray-500 border border-transparent hover:bg-gray-200'
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.32}>
              <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
                <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-4">Preferred Language</h3>
                <div className="flex gap-3">
                  {['English', 'Swahili'].map((lang) => (
                    <button
                      key={lang}
                      className={cn(
                        'px-5 py-2.5 rounded-xl font-sans text-sm transition-all duration-200',
                        lang === 'English'
                          ? 'bg-navy text-white font-medium'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      )}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
                <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-4">Preferred Contact Method</h3>
                <div className="flex gap-3">
                  {['SMS', 'Email', 'WhatsApp'].map((method) => (
                    <button
                      key={method}
                      className={cn(
                        'px-5 py-2.5 rounded-xl font-sans text-sm transition-all duration-200',
                        method === 'WhatsApp'
                          ? 'bg-navy text-white font-medium'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      )}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Tabs.Content>

        {/* Tab 4: Notifications */}
        <Tabs.Content value="notifications">
          <AnimatedSection delay={0.16}>
            <div className="mt-6 bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 lg:p-8">
              <h3 className="font-sans text-xs uppercase tracking-widest text-gray-400 mb-6">Notification Channels</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left font-sans text-sm font-medium text-navy pb-4 pr-8"></th>
                      <th className="text-center font-sans text-xs uppercase tracking-widest text-gray-400 pb-4 w-20">SMS</th>
                      <th className="text-center font-sans text-xs uppercase tracking-widest text-gray-400 pb-4 w-20">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifSettings.map((setting, i) => (
                      <tr key={setting.label} className="border-b border-gray-50 last:border-0">
                        <td className="py-4 pr-8">
                          <span className="font-sans text-sm text-navy">{setting.label}</span>
                        </td>
                        <td className="py-4 text-center">
                          <Switch.Root
                            checked={setting.sms}
                            onCheckedChange={() => toggleNotif(i, 'sms')}
                            className="w-9 h-5 bg-gray-200 rounded-full relative data-[state=checked]:bg-gold transition-colors mx-auto"
                          >
                            <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow-sm transition-transform data-[state=checked]:translate-x-4 translate-x-0.5" />
                          </Switch.Root>
                        </td>
                        <td className="py-4 text-center">
                          <Switch.Root
                            checked={setting.email}
                            onCheckedChange={() => toggleNotif(i, 'email')}
                            className="w-9 h-5 bg-gray-200 rounded-full relative data-[state=checked]:bg-gold transition-colors mx-auto"
                          >
                            <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow-sm transition-transform data-[state=checked]:translate-x-4 translate-x-0.5" />
                          </Switch.Root>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedSection>
        </Tabs.Content>

        {/* Tab 5: Privacy & Account */}
        <Tabs.Content value="privacy">
          <div className="mt-6 space-y-4">
            <AnimatedSection delay={0.16}>
              <button className="w-full flex items-center gap-4 bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all duration-300 text-left">
                <Download className="w-5 h-5 text-navy" />
                <div>
                  <p className="font-sans text-sm font-medium text-navy">Download My Data</p>
                  <p className="font-sans text-xs text-gray-400">Get a copy of your personal data</p>
                </div>
              </button>
            </AnimatedSection>

            <AnimatedSection delay={0.24}>
              <a href="#" className="flex items-center gap-4 bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all duration-300">
                <ExternalLink className="w-5 h-5 text-navy" />
                <div>
                  <p className="font-sans text-sm font-medium text-navy">Privacy Policy</p>
                  <p className="font-sans text-xs text-gray-400">Read our privacy policy</p>
                </div>
              </a>
            </AnimatedSection>

            <AnimatedSection delay={0.32}>
              <a href="#" className="flex items-center gap-4 bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all duration-300">
                <ExternalLink className="w-5 h-5 text-navy" />
                <div>
                  <p className="font-sans text-sm font-medium text-navy">Terms of Service</p>
                  <p className="font-sans text-xs text-gray-400">Read our terms of service</p>
                </div>
              </a>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <button className="w-full flex items-center gap-4 bg-gradient-to-br from-white to-cream/40 rounded-2xl shadow-card p-6 hover:shadow-card-hover transition-all duration-300 text-left border border-red-100">
                <Trash2 className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-sans text-sm font-medium text-red-600">Delete Account</p>
                  <p className="font-sans text-xs text-gray-400">Permanently delete your account and all data</p>
                </div>
              </button>
            </AnimatedSection>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
