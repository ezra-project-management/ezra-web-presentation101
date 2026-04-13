'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'
import { SERVICE_STARTING_PRICE_KES } from '@/lib/service-pricing'

const WEB_CHAT_PRICE_HINT = Object.entries(SERVICE_STARTING_PRICE_KES)
  .map(([slug, n]) => `${slug.replace(/-/g, ' ')} from KES ${n.toLocaleString()}`)
  .join('; ')

interface Message {
  id: string
  role: 'ai' | 'user'
  text: string
}

const quickReplies = [
  'Salon & spa',
  'Gym & pool',
  'What’s free this week?',
  'Speak to someone',
]

const initialMessage: Message = {
  id: '1',
  role: 'ai',
  text: "Hi — ask about a space, a time, or what something roughly costs. If it needs a human, we’ll point you there.",
}

export function AIChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([initialMessage])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
  system: `You are the messaging guide for Ezra Center in Nairobi — a calm, full-service venue (wellness, fitness, meetings, events, dining spaces). Speak in short, warm, human sentences — never corporate or robotic. Hours: 6am–10pm daily.

Official “from” prices (KES) for the public site: ${WEB_CHAT_PRICE_HINT}. Use these for ballpark questions; say the final amount is confirmed when they book. Help with booking intent, what each space is like, timing, and how to reach the team.`,
  messages: [...messages.filter(m => m.id !== '1'), userMessage].map(m => ({
    role: m.role === 'ai' ? 'assistant' : 'user',
    content: m.text,
  })),
}),
      })
      const data = await response.json()
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: data.content?.[0]?.text || 'Sorry, I could not process that. Please try again.',
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch {
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: 'Connection issue. Please try again in a moment.',
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-24 lg:bottom-6 right-4 lg:right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-[380px] h-[420px] sm:h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-navy p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-gold" />
              </div>
              <div className="flex-1">
                <p className="font-display text-sm font-semibold text-white">
                  Ask Ezra
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="font-sans text-xs text-white/60">
                    Typical reply in a few minutes
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.role === 'ai' ? 'flex justify-start' : 'flex justify-end'
                  }
                >
                  <div
                    className={
                      msg.role === 'ai'
                        ? 'bg-cream rounded-lg rounded-tl-none p-3 max-w-[80%]'
                        : 'bg-gold/10 rounded-lg rounded-tr-none p-3 max-w-[80%]'
                    }
                  >
                    <p className="font-sans text-sm text-charcoal leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                </div>
              ))}

              {/* Quick Replies (show after initial message only) */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => sendMessage(reply)}
                      className="px-3 py-1.5 rounded-full border border-gold/30 text-gold font-sans text-xs hover:bg-gold/5 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-cream rounded-lg rounded-tl-none p-3">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-charcoal/30 animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-charcoal/30 animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-charcoal/30 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="border-t border-charcoal/10 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-full bg-cream font-sans text-sm outline-none focus:ring-1 focus:ring-gold"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white hover:bg-gold-light transition-colors disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 rounded-full bg-gold flex items-center justify-center text-white shadow-lg hover:bg-gold-light transition-all duration-300 hover:shadow-xl"
        aria-label="Open messages"
      >
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-gold animate-ping opacity-20" />
        )}
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  )
}
