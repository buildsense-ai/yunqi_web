"use client"

import { useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { RefreshCw } from "lucide-react"

interface UpdateMessagesButtonProps {
  onUpdate?: () => void
}

export default function UpdateMessagesButton({ onUpdate }: UpdateMessagesButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const handleUpdateMessages = async () => {
    try {
      setIsLoading(true)
      // Call the update messages API endpoint
      await axios.get("/api/update-messages")
      // Show success state briefly
      setTimeout(() => {
        setIsLoading(false)
        if (onUpdate) {
          onUpdate()
        }
      }, 1000)
    } catch (error) {
      console.error("Error updating messages:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="relative">
      <motion.button
        onClick={handleUpdateMessages}
        disabled={isLoading}
        whileTap={{ scale: 0.95 }}
        className="w-8 h-8 rounded-full bg-[#34C759] flex items-center justify-center text-white"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="更新消息数据库"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <RefreshCw size={16} />
        )}
      </motion.button>

      {showTooltip && (
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
          更新消息数据库
        </div>
      )}
    </div>
  )
}
