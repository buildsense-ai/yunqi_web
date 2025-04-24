"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface ToastProps {
  message: string
  type: "success" | "error" | "info"
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const bgColor = type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-[#007AFF]"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${bgColor} text-white px-4 py-2 rounded-lg shadow-lg max-w-xs mx-auto`}
    >
      {message}
    </motion.div>
  )
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: "success" | "error" | "info" }>>([])

  // Add this to the window object so it can be called from anywhere
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.showToast = (message: string, type: "success" | "error" | "info" = "info") => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts((prev) => [...prev, { id, message, type }])
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        // @ts-ignore
        delete window.showToast
      }
    }
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 flex flex-col items-center gap-2 z-50 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Add this to the global Window interface
declare global {
  interface Window {
    showToast?: (message: string, type?: "success" | "error" | "info") => void
  }
}
