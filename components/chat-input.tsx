"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  MicrophoneIcon,
  FaceSmileIcon,
  CameraIcon,
} from "@heroicons/react/24/outline"
import { motion } from "framer-motion"

interface ChatInputProps {
  onSendMessage: (text: string) => void
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage("")
      setIsExpanded(false)
    }
  }

  const handleFocus = () => {
    setIsExpanded(true)
  }

  return (
    <div className="border-t border-gray-200 bg-white p-2">
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex justify-around p-2"
        >
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <CameraIcon className="h-6 w-6 text-gray-600" />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <PaperClipIcon className="h-6 w-6 text-gray-600" />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <FaceSmileIcon className="h-6 w-6 text-gray-600" />
          </button>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <motion.div className="flex-1 relative" layout>
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={handleFocus}
            placeholder="iMessage"
            className="w-full py-2 px-4 bg-gray-100 rounded-full focus:outline-none focus:ring-1 focus:ring-[#007AFF] transition-all"
          />
          {!message && (
            <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <MicrophoneIcon className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </motion.div>

        <motion.button
          type="submit"
          disabled={!message.trim()}
          whileTap={{ scale: 0.9 }}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            message.trim() ? "bg-[#007AFF] text-white" : "bg-gray-200 text-gray-400"
          }`}
        >
          <PaperAirplaneIcon className="h-5 w-5 rotate-90" />
        </motion.button>
      </form>
    </div>
  )
}
