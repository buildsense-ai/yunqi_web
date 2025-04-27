"use client"
import { useState } from "react"
import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import type { EventMessage } from "@/types/event"

interface EditableMessageProps {
  message: EventMessage
  eventId: number
  onDelete: (eventId: number, messageId: string) => Promise<void>
}

export default function EditableMessage({ message, eventId, onDelete }: EditableMessageProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (isDeleting) return

    setIsDeleting(true)
    try {
      await onDelete(eventId, message.message_id)
    } catch (error) {
      console.error("Error deleting message:", error)
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex items-start justify-between p-3 border border-gray-200 rounded-md mb-2 group">
      <div className="flex-1">
        <p className="text-sm text-gray-700 break-words whitespace-pre-wrap overflow-wrap-anywhere">
          {message.content}
        </p>
        <p className="text-xs text-gray-500 mt-1">{format(new Date(message.timestamp), "HH:mm")}</p>
      </div>

      {/* Delete button - always visible but not causing layout shift */}
      <div className="ml-2 flex-shrink-0">
        {isDeleting ? (
          <div className="w-6 h-6 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-red-500 border-t-transparent animate-spin"></div>
          </div>
        ) : (
          <button
            onClick={handleDelete}
            className="p-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            aria-label="删除消息"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
