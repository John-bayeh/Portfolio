import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Send, Bot, Sparkles, User, RefreshCw } from 'lucide-react'

const QUICK_REPLIES = [
  'What are your projects?',
  'Are you available for hire?',
  'What is your tech stack?',
  'About Yohannes',
]

const INITIAL_WELCOME = {
  id: 'welcome-1',
  role: 'assistant',
  content: "Hi! I'm Yohannes's portfolio AI. Ask me about his work, skills, or how to collaborate.",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)

  const chatEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
      inputRef.current?.focus()
    }
  }, [isOpen, messages, loading])

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim()
    if (!query || loading) return

    if (query.length > 500) return

    const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const userMsgObj = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: userTimestamp,
    }

    // Append user message
    const updatedMessages = [...messages, userMsgObj]
    setMessages(updatedMessages)
    setInputMessage('')
    setShowQuickReplies(false)
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process AI response.')
      }

      const replyContent = data.reply
      const aiTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: replyContent,
          timestamp: aiTimestamp,
        },
      ])
    } catch (error) {
      console.error('ChatBot API Error:', error)
      const errorTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      let fallbackText = "I don't have that information, but you can reach Yohannes directly at yohannesbayeh41@gmail.com or WhatsApp: +251 96 329 3185. He responds within 24 hours."

      if (error?.message?.includes('API Key') || error?.message?.includes('missing')) {
        fallbackText = "⚠️ Groq API key is missing or invalid. Please configure GROQ_API_KEY in environment variables."
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          timestamp: errorTimestamp,
          isError: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999]">
      {/* Floating Toggle Button */}
      <motion.button
        id="chatbot-toggle-btn"
        aria-label="Open portfolio AI chat"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#C9A84C] text-[#080808] shadow-[0_10px_25px_rgba(201,168,76,0.4)] hover:shadow-[0_15px_35px_rgba(201,168,76,0.6)] transition-all duration-300 focus:outline-none"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Bot className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Dot Indicator */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A84C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-[#C9A84C] border-2 border-[#080808]"></span>
          </span>
        )}
      </motion.button>

      {/* Chat Window Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-x-3 bottom-20 sm:absolute sm:inset-auto sm:bottom-20 sm:right-0 w-auto sm:w-[370px] max-w-[calc(100vw-24px)] sm:max-w-none h-[490px] sm:h-[520px] max-h-[calc(100vh-100px)] bg-[#0D0D0D] border border-[#222222] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 bg-[#111111] border-b border-[#222222] select-none">
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#C9A84C]">
                  <Bot className="w-5 h-5" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#C9A84C] border-2 border-[#111111] rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-semibold text-sm text-white tracking-wide">Bobo</h3>
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                  </div>
                  <p className="text-[11px] text-[#888888]">Portfolio AI • online</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#888888] hover:text-white hover:bg-[#222222] rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs no-scrollbar">
              {/* Top Banner Hero */}
              <div className="text-center py-3 px-2 border-b border-[#1f1f1f] mb-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/40 flex items-center justify-center text-[#C9A84C] mb-2 shadow-[0_0_15px_rgba(201,168,76,0.2)]">
                  <Bot className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-white tracking-wide">Welcome to Bobo</h4>
                <p className="text-[11px] text-[#777777] mt-0.5">A great friend to chat with you</p>
              </div>

              {/* Messages Mapping */}
              {messages.map((msg) => {
                const isUser = msg.role === 'user'
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start space-x-2 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#C9A84C] flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`px-3.5 py-2.5 rounded-2xl leading-relaxed text-[12.5px] ${
                          isUser
                            ? 'bg-[#C9A84C] text-[#080808] font-medium rounded-br-none shadow-md'
                            : msg.isError
                            ? 'bg-red-950/40 border border-red-800/40 text-red-200 rounded-bl-none'
                            : 'bg-[#181818] border border-[#262626] text-[#E0E0E0] rounded-bl-none'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[9.5px] text-[#666666] mt-1 px-1">{msg.timestamp}</span>
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-lg bg-[#222222] border border-[#333333] text-[#AAAAAA] flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                )
              })}

              {/* Loading Dots Indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#C9A84C] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#181818] border border-[#262626] px-4 py-3 rounded-2xl rounded-bl-none flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-bounce"></span>
                  </div>
                </motion.div>
              )}

              {/* Quick Reply Chips */}
              {showQuickReplies && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-2 flex flex-wrap gap-1.5"
                >
                  {QUICK_REPLIES.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      className="px-3 py-1.5 text-[11px] rounded-full border border-[#C9A84C]/40 text-[#C9A84C] bg-[#C9A84C]/5 hover:bg-[#C9A84C]/20 hover:border-[#C9A84C] transition-all duration-200 active:scale-95 text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Box */}
            <div style={{ backgroundColor: '#111111', borderColor: '#222222' }} className="p-3 border-t select-none">
              <div style={{ backgroundColor: '#181818', borderColor: '#333333' }} className="relative flex items-center border rounded-xl focus-within:!border-[#C9A84C] transition-colors px-3 py-1.5">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  maxLength={500}
                  disabled={loading}
                  style={{ color: '#ffffff', backgroundColor: 'transparent' }}
                  className="w-full text-xs !text-white placeholder-[#888888] focus:outline-none pr-8 py-1.5 disabled:opacity-50"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || loading}
                  aria-label="Send message"
                  style={inputMessage.trim() && !loading ? { backgroundColor: '#C9A84C', color: '#080808' } : { backgroundColor: '#333333', color: '#666666' }}
                  className="absolute right-2.5 p-1.5 rounded-lg disabled:opacity-40 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-between px-1 mt-1.5 text-[10px] text-[#777777]">
                <span>Powered by Groq AI</span>
                <span>{inputMessage.length}/500</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
