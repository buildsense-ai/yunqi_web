"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Check } from "lucide-react"
import Image from "next/image"
import axios from "axios"
import type { Message } from "@/types/message"

interface ImageSelectionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSelectImage: (image: {
    image_key: string
    sender_id: string
    timestamp: string
    image_data: string
    message_id: string
  }) => void
  eventId: number
}

export default function ImageSelectionDialog({ isOpen, onClose, onSelectImage, eventId }: ImageSelectionDialogProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)

  // 获取消息列表
  useEffect(() => {
    if (isOpen) {
      fetchMessages()
    }
  }, [isOpen])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://43.139.19.144:8000/get_Messages")
      // 只过滤出包含图片的消息
      const messagesWithImages = response.data.filter((msg: Message) => msg.image_url)
      setMessages(messagesWithImages)
      setError(null)
    } catch (err) {
      console.error("Error fetching messages:", err)
      setError("获取消息失败，请重试")
    } finally {
      setLoading(false)
    }
  }

  // 过滤消息
  const filteredMessages = messages.filter((message) => {
    if (!searchTerm) return true

    // Add null checks to safely handle undefined properties
    const messageText = message.message_content?.text || ""
    const senderId = message.sender_id || ""

    return (
      messageText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      senderId.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // 处理选择图片
  const handleSelectImage = (message: Message) => {
    if (selectedMessageId === message.message_id) {
      setSelectedMessageId(null)
    } else {
      setSelectedMessageId(message.message_id)
    }
  }

  // 处理确认选择
  const handleConfirmSelection = () => {
    const selectedMessage = messages.find((msg) => msg.message_id === selectedMessageId)
    if (selectedMessage) {
      onSelectImage({
        image_key: `image_${selectedMessage.message_id}.jpg`,
        sender_id: selectedMessage.sender_id,
        timestamp: new Date(selectedMessage.create_time).toISOString(),
        image_data: selectedMessage.image_url || "",
        message_id: selectedMessage.message_id,
      })
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

      {/* Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">选择图片</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="搜索消息..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-transparent"
            />
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-8 h-8 rounded-full border-2 border-[#007AFF] border-t-transparent animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-xl text-center text-red-500">
              {error}
              <button onClick={fetchMessages} className="block mx-auto mt-2 text-[#007AFF] font-medium">
                重试
              </button>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <p>没有找到包含图片的消息</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredMessages.map((message, index) => (
                <motion.div
                  key={message.message_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.03,
                  }}
                  className={`mb-3 p-3 rounded-lg border cursor-pointer ${
                    selectedMessageId === message.message_id
                      ? "border-[#007AFF] bg-blue-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                  onClick={() => handleSelectImage(message)}
                >
                  <div className="flex items-start gap-3">
                    {/* 选择指示器 */}
                    <div
                      className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                        selectedMessageId === message.message_id ? "bg-[#007AFF]" : "bg-gray-200"
                      }`}
                    >
                      {selectedMessageId === message.message_id && <Check size={14} className="text-white" />}
                    </div>

                    {/* 消息内容 */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium">用户 {(message.sender_id || "").substring(0, 6)}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(message.create_time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{message.message_content?.text || ""}</p>

                      {/* 图片预览 */}
                      {message.image_url && (
                        <div className="mt-2 relative h-24 rounded-md overflow-hidden">
                          <Image
                            src={message.image_url || "/placeholder.svg"}
                            alt="Message image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleConfirmSelection}
            disabled={!selectedMessageId}
            className={`w-full py-2.5 px-4 rounded-full ${
              selectedMessageId ? "bg-[#007AFF] text-white" : "bg-gray-200 text-gray-500"
            } font-medium`}
          >
            关联图片
          </button>
        </div>
      </motion.div>
    </div>
  )
}
