"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ChatBubbleProps {
  isUser: boolean
  children: ReactNode
  avatar?: string
  name: string
  timestamp?: string
}

export default function ChatBubble({ isUser, children, avatar, name, timestamp }: ChatBubbleProps) {
  return (
    <motion.div
      className={`flex w-full max-w-3xl ${isUser ? "justify-end" : "justify-start"} mb-4`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`flex ${isUser ? "flex-row-reverse" : "flex-row"} items-start gap-2`}>
        {/* 头像 */}
        <div
          className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white font-medium
  ${isUser ? "bg-green-600" : "bg-primary-600"}`}
        >
          {avatar ? (
            <img src={avatar || "/placeholder.svg"} alt={name} className="h-10 w-10 rounded-full" />
          ) : (
            <span>{name.charAt(0).toUpperCase()}</span>
          )}
        </div>

        {/* 消息内容 */}
        <div className="flex flex-col">
          <div className={`flex items-center gap-2 mb-1 ${isUser ? "justify-end" : "justify-start"}`}>
            <span className="text-xs font-medium text-secondary-600">{name}</span>
            {timestamp && <span className="text-xs text-secondary-400">[{timestamp}]</span>}
          </div>
          <div
            className={`rounded-2xl px-4 py-3 inline-block max-w-md text-sm
    ${
      isUser
        ? "bg-green-600 text-white rounded-tr-none"
        : "bg-white border border-secondary-200 text-secondary-800 rounded-tl-none shadow-sm"
    }`}
          >
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
