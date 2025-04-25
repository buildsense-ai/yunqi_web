"use client"

import { useState } from "react"
import { format } from "date-fns"
import type { Event } from "@/types/event"
import { Trash2, Edit2, Check, ImageIcon, Plus, FileText } from "lucide-react"
import ConfirmationDialog from "./confirmation-dialog"
import EditEventForm from "./edit-event-form"
import SingleEventImage from "./event-image"
import ImageSelectionDialog from "./image-selection-dialog"
import EventDocument from "./event-document"
import DocumentUploadDialog from "./document-upload-dialog"
import EventMessage from "./event-message"

interface EventCardProps {
  event: Event
  onDelete: (eventId: number) => Promise<void>
  onUpdate: (eventId: number, data: { summary?: string; category?: string; status?: string }) => Promise<void>
  onDeleteImage: (eventId: number, messageId: string) => Promise<void>
  onAddImage: (eventId: number, imageData: any) => Promise<void>
  onDeleteDocument?: (eventId: number, messageId: string) => Promise<void>
  onDeleteMessage?: (eventId: number, messageId: string) => Promise<void>
  onUploadSuccess?: () => void
  selectionMode: boolean
  isSelected: boolean
  onToggleSelect: (eventId: number) => void
}

export default function EventCard({
  event,
  onDelete,
  onUpdate,
  onDeleteImage,
  onAddImage,
  onDeleteDocument,
  onDeleteMessage,
  onUploadSuccess,
  selectionMode,
  isSelected,
  onToggleSelect,
}: EventCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [imageSelectionMode, setImageSelectionMode] = useState(false)
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([])
  const [showImageDeleteConfirmation, setShowImageDeleteConfirmation] = useState(false)
  const [showImageSelectionDialog, setShowImageSelectionDialog] = useState(false)
  const [showDocumentUploadDialog, setShowDocumentUploadDialog] = useState(false)

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

  const toggleImageSelectionMode = () => {
    setImageSelectionMode(!imageSelectionMode)
    setSelectedImageIds([])
  }

  const toggleImageSelection = (messageId: string) => {
    setSelectedImageIds((prevIds) => {
      if (prevIds.includes(messageId)) {
        return prevIds.filter((id) => id !== messageId)
      } else {
        return [...prevIds, messageId]
      }
    })
  }

  const handleDeleteSelectedImages = async () => {
    setShowImageDeleteConfirmation(false)

    // 逐个删除选中的图片
    for (const messageId of selectedImageIds) {
      try {
        await onDeleteImage(event.id, messageId)
      } catch (error) {
        console.error(`Error deleting image ${messageId}:`, error)
      }
    }

    // 重置选择状态
    setSelectedImageIds([])
    setImageSelectionMode(false)
  }

  const handleAddImage = (imageData: any) => {
    onAddImage(event.id, imageData)
    setShowImageSelectionDialog(false)
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
              {!selectionMode && !imageSelectionMode && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowDocumentUploadDialog(true)
                    }}
                    className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 hover:bg-blue-100"
                    aria-label="上传文档"
                  >
                    <FileText size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowImageSelectionDialog(true)
                    }}
                    className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500 hover:bg-green-100"
                    aria-label="关联图片"
                  >
                    <Plus size={16} />
                  </button>
                  {event.candidate_images && event.candidate_images.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleImageSelectionMode()
                      }}
                      className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 hover:bg-purple-100"
                      aria-label="选择图片"
                    >
                      <ImageIcon size={16} />
                    </button>
                  )}
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

              {/* 图片选择模式下的操作按钮 */}
              {imageSelectionMode && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (selectedImageIds.length > 0) {
                        setShowImageDeleteConfirmation(true)
                      }
                    }}
                    disabled={selectedImageIds.length === 0}
                    className={`text-sm font-medium ${
                      selectedImageIds.length === 0 ? "text-gray-400" : "text-red-500"
                    }`}
                  >
                    删除 ({selectedImageIds.length})
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleImageSelectionMode()
                    }}
                    className="text-sm font-medium text-[#007AFF]"
                  >
                    取消
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 卡片内容 */}
        <div className="p-4">
          {/* 消息内容 */}
          {event.messages.map((message) => (
            <EventMessage key={message.message_id} message={message} eventId={event.id} onDelete={onDeleteMessage} />
          ))}

          {/* 图片内容 */}
          {event.candidate_images && event.candidate_images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {event.candidate_images.map((image) => (
                <SingleEventImage
                  key={image.image_key}
                  image={image}
                  eventId={event.id}
                  onDelete={onDeleteImage}
                  selectionMode={imageSelectionMode}
                  isSelected={selectedImageIds.includes(image.message_id)}
                  onToggleSelect={toggleImageSelection}
                />
              ))}
            </div>
          )}

          {/* 文档内容 */}
          {event.documents && event.documents.length > 0 && (
            <div className="mt-3 space-y-2">
              <h4 className="text-sm font-medium text-gray-700">文档</h4>
              {event.documents.map((document) => (
                <EventDocument
                  key={document.document_key}
                  document={document}
                  eventId={event.id}
                  onDelete={onDeleteDocument}
                />
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

      <ConfirmationDialog
        isOpen={showImageDeleteConfirmation}
        title="删除图片"
        message={`确定要删除选中的 ${selectedImageIds.length} 张图片吗？此操作无法撤销。`}
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleDeleteSelectedImages}
        onCancel={() => setShowImageDeleteConfirmation(false)}
      />

      <EditEventForm event={event} isOpen={showEditForm} onClose={() => setShowEditForm(false)} onSave={onUpdate} />

      <ImageSelectionDialog
        isOpen={showImageSelectionDialog}
        onClose={() => setShowImageSelectionDialog(false)}
        onSelectImage={handleAddImage}
        eventId={event.id}
      />

      <DocumentUploadDialog
        isOpen={showDocumentUploadDialog}
        onClose={() => setShowDocumentUploadDialog(false)}
        eventId={event.id}
        onSuccess={() => {
          if (onUploadSuccess) onUploadSuccess()
        }}
      />
    </>
  )
}
