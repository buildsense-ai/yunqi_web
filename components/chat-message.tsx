"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Message } from "@/types/message"
import { motion } from "framer-motion"

interface ChatMessageProps {
  message: Message
  isCurrentUser: boolean
}

export default function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  const [isLongPressed, setIsLongPressed] = useState(false)

  const formattedTime = format(new Date(message.create_time), "h:mm a")

  // Generate a consistent avatar color based on sender_id
  const getAvatarColor = (id: string) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
    ]

    // Simple hash function to get a consistent index
    const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  const getInitials = (id: string) => {
    // Extract initials from the ID or use a default
    return id.substring(0, 2).toUpperCase()
  }

  const handleLongPress = () => {
    setIsLongPressed(true)
    setTimeout(() => setIsLongPressed(false), 2000)
  }

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4 relative`}>
      {!isCurrentUser && (
        <div className="flex-shrink-0 mr-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={`/blue-skinned-figure.png?height=32&width=32&query=avatar ${message.sender_id}`} />
            <AvatarFallback className={getAvatarColor(message.sender_id)}>
              {getInitials(message.sender_id)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      <div className="max-w-[70%]">
        {!isCurrentUser && (
          <div className="text-xs text-gray-500 ml-1 mb-1">User {message.sender_id.substring(0, 6)}</div>
        )}

        <motion.div
          whileTap={{ scale: 0.98 }}
          onTapStart={() => setTimeout(handleLongPress, 500)}
          className={`
            relative rounded-2xl px-4 py-2 shadow-sm
            ${isCurrentUser ? "bg-[#007AFF] text-white rounded-tr-sm" : "bg-white text-black rounded-tl-sm"}
          `}
        >
          {/* 修复文本换行问题 */}
          <div className="break-words whitespace-pre-wrap overflow-wrap-anywhere">
            {message.message_content?.text || ""}
          </div>

          {isLongPressed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-10 left-0 right-0 bg-black/80 text-white text-xs py-1 px-2 rounded-md flex justify-between"
            >
              <button>Copy</button>
              <button>Reply</button>
              <button>Forward</button>
            </motion.div>
          )}

          <div className={`text-xs mt-1 ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}>
            {formattedTime}
            {isCurrentUser && <span className="ml-1">{message.status === "1" ? "✓" : "⟳"}</span>}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
