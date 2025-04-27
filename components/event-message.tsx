"use client"
import { format } from "date-fns"
import type { EventMessage } from "@/types/event"

interface EventMessageProps {
  message: EventMessage
  eventId: number
}

export default function EventMessage({ message, eventId }: EventMessageProps) {
  return (
    <div className="mb-3">
      <p className="text-sm text-gray-700 break-words whitespace-pre-wrap overflow-wrap-anywhere">{message.content}</p>
      <p className="text-xs text-gray-500 mt-1">{format(new Date(message.timestamp), "HH:mm")}</p>
    </div>
  )
}
