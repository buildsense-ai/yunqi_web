"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import type { Event } from "@/types/event"
import EditableMessage from "./editable-message"

interface EditEventFormProps {
  event: Event
  isOpen: boolean
  onClose: () => void
  onSave: (eventId: number, data: { summary?: string; category?: string; status?: string }) => Promise<void>
  onDeleteMessage?: (eventId: number, messageId: string) => Promise<void>
}

export default function EditEventForm({ event, isOpen, onClose, onSave, onDeleteMessage }: EditEventFormProps) {
  const [formData, setFormData] = useState({
    summary: "",
    category: "",
    status: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState(event.messages || [])

  // 当事件数据变化时更新表单
  useEffect(() => {
    if (event) {
      setFormData({
        summary: event.summary || "",
        category: event.category || "",
        status: event.status || "0",
      })
      setMessages(event.messages || [])
    }
  }, [event])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      // 只发送已更改的字段
      const changedData: { summary?: string; category?: string; status?: string } = {}
      if (formData.summary !== event.summary) changedData.summary = formData.summary
      if (formData.category !== event.category) changedData.category = formData.category
      if (formData.status !== event.status) changedData.status = formData.status

      await onSave(event.id, changedData)
      onClose()
    } catch (err) {
      console.error("Error saving event:", err)
      setError("保存失败，请重试")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteMessage = async (eventId: number, messageId: string) => {
    if (!onDeleteMessage) return

    try {
      await onDeleteMessage(eventId, messageId)
      // Update local state to reflect the deletion
      setMessages(messages.filter((msg) => msg.message_id !== messageId))
    } catch (error) {
      console.error("Error deleting message:", error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">编辑卡片</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto p-4 flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Summary */}
              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                  概述
                </label>
                <input
                  type="text"
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                  placeholder="事件概述"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  类别
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                  placeholder="事件类别"
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  状态
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
                >
                  <option value="0">待处理</option>
                  <option value="1">整改中</option>
                  <option value="2">待复核</option>
                  <option value="3">已闭环</option>
                </select>
              </div>

              {/* Messages section */}
              {messages.length > 0 && (
                <div>
                  <h3 className="block text-sm font-medium text-gray-700 mb-2">消息列表</h3>
                  <p className="text-xs text-gray-500 mb-2">点击消息右侧的删除按钮可删除该消息</p>
                  <div className="space-y-2">
                    {messages.map((message) => (
                      <EditableMessage
                        key={message.message_id}
                        message={message}
                        eventId={event.id}
                        onDelete={handleDeleteMessage}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Error message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </form>
        </div>

        {/* Footer with buttons */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            取消
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-[#007AFF] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isSaving ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                保存中...
              </div>
            ) : (
              "保存"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
