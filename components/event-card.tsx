"use client"

import { useState } from "react"
import { format } from "date-fns"
import type { Event } from "@/types/event"
import Image from "next/image"
import { Trash2, Edit2, Check } from "lucide-react"
import ConfirmationDialog from "./confirmation-dialog"
import EditEventForm from "./edit-event-form"

interface EventCardProps {
  event: Event
  onDelete: (eventId: number) => Promise<void>
  onUpdate: (eventId: number, data: { summary?: string; category?: string; status?: string }) => Promise<void>
  selectionMode: boolean
  isSelected: boolean
  onToggleSelect: (eventId: number) => void
}

export default function EventCard({
  event,
  onDelete,
  onUpdate,
  selectionMode,
  isSelected,
  onToggleSelect,
}: EventCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)

  // 格式化日期
  const formattedDate = format(new Date(event.create_time), "MM月dd日 HH:mm")

  // 获取状态文本和颜色
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "0":
        return { text: "待处理", color: "bg-yellow-500" }
      case "1":
        return { text: "整改中", color: "bg-blue-500" }
      case "2":
        return { text: "待复核", color: "bg-purple-500" }
      case "3":
        return { text: "已闭环", color: "bg-green-500" }
      default:
        return { text: "未知", color: "bg-gray-500" }
    }
  }

  const statusInfo = getStatusInfo(event.status)

  const handleDeleteClick = () => {
    setShowConfirmation(true)
  }

  const handleEditClick = () => {
    setShowEditForm(true)
  }

  const handleConfirmDelete = async () => {
    setShowConfirmation(false)
    setIsDeleting(true)
    try {
      await onDelete(event.id)
    } catch (error) {
      console.error("Error deleting event:", error)
      setIsDeleting(false)
    }
  }

  const handleCardClick = () => {
    if (selectionMode) {
      onToggleSelect(event.id)
    }
  }

  return (
    <>
      <div
        className={`bg-white rounded-xl shadow-sm overflow-hidden mb-4 ${isDeleting ? "opacity-50" : ""} ${
          selectionMode ? "cursor-pointer" : ""
        } ${isSelected && selectionMode ? "ring-2 ring-[#007AFF]" : ""}`}
        onClick={handleCardClick}
      >
        {/* 选择指示器 */}
        {selectionMode && (
          <div className="absolute top-2 left-2 z-10">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                isSelected ? "bg-[#007AFF]" : "bg-gray-200"
              }`}
            >
              {isSelected && <Check size={14} className="text-white" />}
            </div>
          </div>
        )}

        {/* 卡片头部 */}
        <div className={`p-4 border-b border-gray-100 ${selectionMode ? "pl-10" : ""}`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{event.summary}</h3>
              <p className="text-sm text-gray-500 mt-1">{event.category}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`${statusInfo.color} text-white text-xs px-2 py-1 rounded-full`}>{statusInfo.text}</div>
              {!selectionMode && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditClick()
                    }}
                    className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100"
                    aria-label="编辑卡片"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick()
                    }}
                    disabled={isDeleting}
                    className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100"
                    aria-label="删除卡片"
                  >
                    {isDeleting ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 卡片内容 */}
        <div className="p-4">
          {/* 消息内容 */}
          {event.messages.map((message) => (
            <div key={message.message_id} className="mb-3">
              <p className="text-sm text-gray-700">{message.content}</p>
              <p className="text-xs text-gray-500 mt-1">{format(new Date(message.timestamp), "HH:mm")}</p>
            </div>
          ))}

          {/* 图片内容 */}
          {event.candidate_images && event.candidate_images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {event.candidate_images.map((image) => (
                <div key={image.image_key} className="relative h-32 rounded-md overflow-hidden">
                  <Image
                    src={image.image_data || "/placeholder.svg?height=128&width=128&query=event image"}
                    alt="Event image"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 卡片底部 */}
        <div className="bg-gray-50 px-4 py-3 text-xs text-gray-500 flex justify-between">
          <span>ID: {event.id}</span>
          <span>{formattedDate}</span>
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        title="删除卡片"
        message={`确定要删除"${event.summary}"吗？此操作无法撤销。`}
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowConfirmation(false)}
      />

      <EditEventForm event={event} isOpen={showEditForm} onClose={() => setShowEditForm(false)} onSave={onUpdate} />
    </>
  )
}
