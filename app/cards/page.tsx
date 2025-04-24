"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, Filter } from "lucide-react"
import EventCard from "@/components/event-card"
import type { Event } from "@/types/event"

export default function CardsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
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

  return (
    <div className="flex flex-col h-screen bg-[#F2F2F7]">
      {/* iOS-style header */}
      <div className="bg-white py-3 px-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Link href="/" className="text-[#007AFF] text-sm font-medium flex items-center">
            <ChevronLeft size={16} />
            <span>返回</span>
          </Link>
        </div>
        <div className="text-center">
          <h1 className="font-semibold text-lg">事件卡片</h1>
        </div>
        <div className="flex items-center">
          <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <Filter size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Cards content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 rounded-full border-2 border-[#007AFF] border-t-transparent animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-xl text-center text-red-500">
            {error}
            <button onClick={fetchEvents} className="block mx-auto mt-2 text-[#007AFF] font-medium">
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
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: [0.25, 0.1, 0.25, 1.0], // iOS-like easing
                }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
