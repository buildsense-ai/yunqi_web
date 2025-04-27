"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import ChatMessage from "@/components/chat-message"
import ClusteringButton from "@/components/clustering-button"
import ViewCardsButton from "@/components/view-cards-button"
import UpdateMessagesButton from "@/components/update-messages-button"
import { useCache } from "@/contexts/cache-context"

export default function ChatPage() {
  const { messages, setMessages, isCacheStale, invalidateMessages } = useCache()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchMessages = async (force = false) => {
    // Skip fetching if cache is fresh and not forced
    if (!force && !isCacheStale("messages")) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await axios.get("http://43.139.19.144:8000/get_Messages")
      setMessages(response.data)
      setError(null)
    } catch (err) {
      console.error("Error fetching messages:", err)
      setError("Failed to load messages. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()

    // Poll for new messages every 30 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages(true) // Force refresh on polling
    }, 30000)

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle refresh triggered by update button
  const handleRefresh = () => {
    invalidateMessages()
    fetchMessages(true)
  }

  return (
    <div className="flex flex-col h-screen w-screen fixed inset-0 bg-[#F2F2F7] overflow-hidden">
      {/* iOS-style header - fixed position */}
      <div className="bg-white py-3 px-4 border-b border-gray-200 flex items-center justify-between z-10">
        <div className="flex items-center">
          <button className="text-[#007AFF] text-sm font-medium">Back</button>
        </div>
        <div className="text-center">
          <h1 className="font-semibold text-lg">Group Chat</h1>
          <p className="text-xs text-gray-500">5 participants</p>
        </div>
        <div className="flex items-center space-x-3">
          <UpdateMessagesButton onUpdate={handleRefresh} />
          <ClusteringButton onClusteringComplete={handleRefresh} />
          <ViewCardsButton />
          <button className="text-[#007AFF] text-sm font-medium">Info</button>
        </div>
      </div>

      {/* Chat messages - scrollable container */}
      <div className="flex-1 overflow-y-auto overscroll-none -webkit-overflow-scrolling-touch p-4 space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 rounded-full border-2 border-[#007AFF] border-t-transparent animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-xl text-center text-red-500">
            {error}
            <button onClick={() => fetchMessages(true)} className="block mx-auto mt-2 text-[#007AFF] font-medium">
              Try Again
            </button>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.message_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: [0.25, 0.1, 0.25, 1.0], // iOS-like easing
                }}
              >
                <ChatMessage message={message} isCurrentUser={message.sender_id === "current-user"} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
