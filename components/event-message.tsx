"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import type { EventMessage } from "@/types/event"

interface EventMessageProps {
  message: EventMessage
  eventId: number
  onDelete?: (eventId: number, messageId: string) => Promise<void>
}

export default function EventMessage({ message, eventId, onDelete }: EventMessageProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteButton, setShowDeleteButton] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onDelete || isDeleting) return

    setIsDeleting(true)
    try {
      await onDelete(eventId, message.message_id)
    } catch (error) {
      console.error("Error deleting message:", error)
      setIsDeleting(false)
    }
  }

  return (
    <div
      className="mb-3 relative"
      onMouseEnter={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
    >
      <div className="flex justify-between items-start">
        <p className="text-sm text-gray-700">{message.content}</p>

        {/* Delete button */}
        {showDeleteButton && onDelete && !isDeleting && (
          <button
            onClick={handleDelete}
            className="ml-2 p-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            aria-label="删除消息"
          >
            <Trash2 size={14} />
          </button>
        )}

        {/* Deleting state */}
        {isDeleting && (
          <div className="ml-2 w-5 h-5 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-1">{format(new Date(message.timestamp), "HH:mm")}</p>
    </div>
  )
}
