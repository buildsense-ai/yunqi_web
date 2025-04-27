"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, Filter, CheckSquare, X, Layers } from "lucide-react"
import EventCard from "@/components/event-card"
import MergeConfirmation from "@/components/merge-confirmation"
import GenerateDocumentButton from "@/components/generate-document-button"
import { DocumentProvider } from "@/contexts/document-context"
import { useCache } from "@/contexts/cache-context"

export default function CardsPage() {
  const { events, setEvents, isCacheStale, invalidateEvents } = useCache()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([])
  const [showMergeConfirmation, setShowMergeConfirmation] = useState(false)
  const [isMerging, setIsMerging] = useState(false)

  const fetchEvents = async (force = false) => {
    // Skip fetching if cache is fresh and not forced
    if (!force && !isCacheStale("events")) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await axios.get("/api/events")
      setEvents(response.data.events)
      setError(null)
    } catch (err) {
      console.error("Error fetching events:", err)
      setError("Failed to load events. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // 显示Toast消息
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  // 删除卡片 - Updated to use GET with action=delete
  const handleDeleteEvent = async (eventId: number) => {
    try {
      const response = await axios.get(`/api/events/${eventId}?action=delete`)

      // Check if deletion was successful
      if (response.data && response.data.message) {
        // 从列表中移除已删除的卡片
        setEvents(events.filter((event) => event.id !== eventId))
        showToast("卡片已成功删除", "success")
      } else {
        throw new Error("Deletion response did not contain expected data")
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      showToast("删除卡片失败，请重试", "error")
      throw error
    }
  }

  // 更新卡片
  const handleUpdateEvent = async (eventId: number, data: { summary?: string; category?: string; status?: string }) => {
    try {
      const response = await axios.put(`/api/events/${eventId}`, data)

      // 更新列表中的卡片
      setEvents(
        events.map((event) => {
          if (event.id === eventId) {
            return {
              ...event,
              ...data,
            }
          }
          return event
        }),
      )

      showToast("卡片已成功更新", "success")
    } catch (error) {
      console.error("Error updating event:", error)
      showToast("更新卡片失败，请重试", "error")
      throw error
    }
  }

  // 删除图片
  const handleDeleteImage = async (eventId: number, messageId: string) => {
    try {
      await axios.delete(`/api/events/${eventId}/images/${messageId}`)

      // 更新列表中的卡片，移除已删除的图片
      setEvents(
        events.map((event) => {
          if (event.id === eventId && event.candidate_images) {
            return {
              ...event,
              candidate_images: event.candidate_images.filter((img) => img.message_id !== messageId),
            }
          }
          return event
        }),
      )

      showToast("图片已成功删除", "success")
    } catch (error) {
      console.error("Error deleting image:", error)
      showToast("删除图片失败，请重试", "error")
      throw error
    }
  }

  // 添加图片
  const handleAddImage = async (eventId: number, imageData: any) => {
    try {
      const response = await axios.post(`/api/events/${eventId}/images`, imageData)

      // 更新列表中的卡片，添加新图片
      setEvents(
        events.map((event) => {
          if (event.id === eventId) {
            return {
              ...event,
              candidate_images: event.candidate_images
                ? [...event.candidate_images, response.data.image]
                : [response.data.image],
            }
          }
          return event
        }),
      )

      showToast("图片已成功关联", "success")
    } catch (error) {
      console.error("Error adding image:", error)
      showToast("关联图片失败，请重试", "error")
      throw error
    }
  }

  // Add the handleDeleteDocument function
  const handleDeleteDocument = async (eventId: number, messageId: string) => {
    try {
      await axios.delete(`/api/events/${eventId}/documents/${messageId}`)

      // Update the events list, remove the deleted document
      setEvents(
        events.map((event) => {
          if (event.id === eventId && event.documents) {
            return {
              ...event,
              documents: event.documents.filter((doc) => doc.message_id !== messageId),
            }
          }
          return event
        }),
      )

      showToast("文档已成功删除", "success")
    } catch (error) {
      console.error("Error deleting document:", error)
      showToast("删除文档失败，请重试", "error")
      throw error
    }
  }

  // Add the handleDeleteMessage function
  const handleDeleteMessage = async (eventId: number, messageId: string) => {
    try {
      await axios.delete(`/api/events/${eventId}/messages/${messageId}`)

      // Update the events list, remove the deleted message
      setEvents(
        events.map((event) => {
          if (event.id === eventId) {
            return {
              ...event,
              messages: event.messages.filter((msg) => msg.message_id !== messageId),
            }
          }
          return event
        }),
      )

      showToast("消息已成功删除", "success")
    } catch (error) {
      console.error("Error deleting message:", error)
      showToast("删除消息失败，请重试", "error")
      throw error
    }
  }

  // 切换选择模式
  const toggleSelectionMode = () => {
    setSelectionMode(!selectionMode)
    setSelectedEventIds([])
  }

  // 切换卡片选择状态
  const toggleEventSelection = (eventId: number) => {
    setSelectedEventIds((prevIds) => {
      if (prevIds.includes(eventId)) {
        return prevIds.filter((id) => id !== eventId)
      } else {
        return [...prevIds, eventId]
      }
    })
  }

  // 显示合并确认对话框
  const handleShowMergeConfirmation = () => {
    if (selectedEventIds.length < 2) {
      showToast("请至少选择两张卡片进行合并", "error")
      return
    }
    setShowMergeConfirmation(true)
  }

  // 合并卡片
  const handleMergeEvents = async () => {
    if (selectedEventIds.length < 2) {
      showToast("请至少选择两张卡片进行合并", "error")
      return
    }

    setIsMerging(true)
    try {
      // Send just the array of IDs instead of an object with event_ids property
      const response = await axios.post("/api/merge-events", selectedEventIds)

      // 刷新卡片列表
      invalidateEvents() // Invalidate events cache
      await fetchEvents(true) // Force refresh

      // 退出选择模式
      setSelectionMode(false)
      setSelectedEventIds([])
      setShowMergeConfirmation(false)

      showToast("卡片已成功合并", "success")
    } catch (error) {
      console.error("Error merging events:", error)
      showToast("合并卡片失败，请重试", "error")
    } finally {
      setIsMerging(false)
    }
  }

  return (
    <DocumentProvider>
      <div className="flex flex-col h-screen w-screen fixed inset-0 bg-[#F2F2F7] overflow-hidden">
        {/* iOS-style header */}
        <div className="bg-white py-3 px-4 border-b border-gray-200 flex items-center justify-between z-10">
          <div className="flex items-center">
            {selectionMode ? (
              <button onClick={toggleSelectionMode} className="text-[#007AFF] text-sm font-medium flex items-center">
                <X size={16} className="mr-1" />
                <span>取消</span>
              </button>
            ) : (
              <Link href="/" className="text-[#007AFF] text-sm font-medium flex items-center">
                <ChevronLeft size={16} />
                <span>返回</span>
              </Link>
            )}
          </div>
          <div className="text-center">
            <h1 className="font-semibold text-lg">
              {selectionMode ? `已选择 ${selectedEventIds.length} 项` : "事件卡片"}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {selectionMode ? (
              <>
                <button
                  onClick={handleShowMergeConfirmation}
                  disabled={selectedEventIds.length < 2}
                  className={`flex items-center text-sm font-medium ${
                    selectedEventIds.length < 2 ? "text-gray-400" : "text-[#007AFF]"
                  }`}
                >
                  <Layers size={16} className="mr-1" />
                  <span>合并</span>
                </button>
                <GenerateDocumentButton selectedEventIds={selectedEventIds} />
              </>
            ) : (
              <>
                <button
                  onClick={toggleSelectionMode}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <CheckSquare size={16} className="text-gray-600" />
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Filter size={16} className="text-gray-600" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Cards content */}
        <div className="flex-1 overflow-y-auto overscroll-none -webkit-overflow-scrolling-touch p-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="w-8 h-8 rounded-full border-2 border-[#007AFF] border-t-transparent animate-spin"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-xl text-center text-red-500">
              {error}
              <button onClick={() => fetchEvents(true)} className="block mx-auto mt-2 text-[#007AFF] font-medium">
                重试
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p>暂无事件卡片</p>
            </div>
          ) : (
            <AnimatePresence>
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: [0.25, 0.1, 0.25, 1.0], // iOS-like easing
                  }}
                >
                  <EventCard
                    event={event}
                    onDelete={handleDeleteEvent}
                    onUpdate={handleUpdateEvent}
                    onDeleteImage={handleDeleteImage}
                    onAddImage={handleAddImage}
                    onDeleteDocument={handleDeleteDocument}
                    onDeleteMessage={handleDeleteMessage}
                    onUploadSuccess={() => fetchEvents(true)}
                    selectionMode={selectionMode}
                    isSelected={selectedEventIds.includes(event.id)}
                    onToggleSelect={toggleEventSelection}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Toast notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg ${
                toast.type === "success" ? "bg-green-500" : "bg-red-500"
              } text-white`}
            >
              {toast.message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Merge confirmation dialog */}
        <MergeConfirmation
          isOpen={showMergeConfirmation}
          selectedCount={selectedEventIds.length}
          onConfirm={handleMergeEvents}
          onCancel={() => setShowMergeConfirmation(false)}
          isLoading={isMerging}
        />
      </div>
    </DocumentProvider>
  )
}
