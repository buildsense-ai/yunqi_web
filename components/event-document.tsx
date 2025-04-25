"use client"

import type React from "react"
import { useState } from "react"
import { FileText, Trash2, Check } from "lucide-react"
import type { EventDocument } from "@/types/event"

interface EventDocumentProps {
  document: EventDocument
  eventId: number
  onDelete?: (eventId: number, messageId: string) => Promise<void>
  selectionMode?: boolean
  isSelected?: boolean
  onToggleSelect?: (messageId: string) => void
}

export default function EventDocument({
  document,
  eventId,
  onDelete,
  selectionMode = false,
  isSelected = false,
  onToggleSelect = () => {},
}: EventDocumentProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteButton, setShowDeleteButton] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onDelete || isDeleting) return

    setIsDeleting(true)
    try {
      await onDelete(eventId, document.message_id)
    } catch (error) {
      console.error("Error deleting document:", error)
      setIsDeleting(false)
    }
  }

  const handleClick = () => {
    if (selectionMode) {
      onToggleSelect(document.message_id)
    }
  }

  return (
    <div
      className={`relative bg-gray-50 rounded-md p-3 flex items-center ${selectionMode ? "cursor-pointer" : ""} ${
        isSelected && selectionMode ? "ring-2 ring-[#007AFF]" : ""
      }`}
      onMouseEnter={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
      onClick={handleClick}
    >
      {/* Document icon */}
      <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-500 mr-3">
        <FileText size={20} />
      </div>

      {/* Document name */}
      <div className="flex-1">
        <p className="font-medium text-sm truncate">{document.document_name}</p>
        <p className="text-xs text-gray-500">上传者: {document.sender_id.substring(0, 6)}</p>
      </div>

      {/* Selection indicator */}
      {selectionMode && (
        <div className="absolute top-2 left-2 z-10">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isSelected ? "bg-[#007AFF]" : "bg-white/70"
            }`}
          >
            {isSelected && <Check size={14} className="text-white" />}
          </div>
        </div>
      )}

      {/* Delete button */}
      {!selectionMode && onDelete && showDeleteButton && !isDeleting && (
        <button
          onClick={handleDelete}
          className="w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-600/80 transition-colors"
          aria-label="删除文档"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* Deleting state */}
      {isDeleting && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center">
          <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
        </div>
      )}
    </div>
  )
}
