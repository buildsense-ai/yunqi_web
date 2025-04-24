"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Trash2, Check } from "lucide-react"
import type { EventImage } from "@/types/event"

interface EventImageProps {
  image: EventImage
  eventId: number
  onDelete: (eventId: number, messageId: string) => Promise<void>
  selectionMode?: boolean
  isSelected?: boolean
  onToggleSelect?: (messageId: string) => void
}

export default function EventImage({
  image,
  eventId,
  onDelete,
  selectionMode = false,
  isSelected = false,
  onToggleSelect = () => {},
}: EventImageProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteButton, setShowDeleteButton] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isDeleting) return

    setIsDeleting(true)
    try {
      await onDelete(eventId, image.message_id)
    } catch (error) {
      console.error("Error deleting image:", error)
      setIsDeleting(false)
    }
  }

  const handleClick = () => {
    if (selectionMode) {
      onToggleSelect(image.message_id)
    }
  }

  return (
    <div
      className={`relative h-32 rounded-md overflow-hidden ${selectionMode ? "cursor-pointer" : ""} ${
        isSelected && selectionMode ? "ring-2 ring-[#007AFF]" : ""
      }`}
      onMouseEnter={() => setShowDeleteButton(true)}
      onMouseLeave={() => setShowDeleteButton(false)}
      onClick={handleClick}
    >
      <Image
        src={image.image_data || "/placeholder.svg?height=128&width=128&query=event image"}
        alt="Event image"
        fill
        className="object-cover"
      />

      {/* 选择指示器 */}
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

      {/* 删除按钮 */}
      {!selectionMode && showDeleteButton && !isDeleting && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-600/80 transition-colors"
          aria-label="删除图片"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* 删除中状态 */}
      {isDeleting && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
        </div>
      )}
    </div>
  )
}
