"use client"

import { useEffect, useState, useRef } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import ChatMessage from "@/components/chat-message"
import ChatInput from "@/components/chat-input"
import type { Message } from "@/types/message"

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchMessages = async () => {
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
    const intervalId = setInterval(fetchMessages, 30000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (text: string) => {
    // In a real app, you would send this to your API
    console.log("Sending message:", text)
    // For demo purposes, we'll just add it to the local state
    const newMessage: Message = {
      message_id: `temp-${Date.now()}`,
      msg_type: "text",
      create_time: Date.now(),
      sender_id: "current-user", // Assuming this is the current user
      message_content: {
        text,
      },
      image_url: null,
      status: "1",
    }

    setMessages([...messages, newMessage])
  }

  return (
    <div className="flex flex-col h-screen bg-[#F2F2F7]">
      {/* iOS-style header */}
      <div className="bg-white py-3 px-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button className="text-[#007AFF] text-sm font-medium">Back</button>
        </div>
        <div className="text-center">
          <h1 className="font-semibold text-lg">Group Chat</h1>
          <p className="text-xs text-gray-500">5 participants</p>
        </div>
        <div>
          <button className="text-[#007AFF] text-sm font-medium">Info</button>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 rounded-full border-2 border-[#007AFF] border-t-transparent animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-xl text-center text-red-500">
            {error}
            <button onClick={fetchMessages} className="block mx-auto mt-2 text-[#007AFF] font-medium">
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

      {/* Input area */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  )
}
