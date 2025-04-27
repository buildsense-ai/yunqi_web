"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RefreshCw, CheckCircle, XCircle } from "lucide-react"
import axiosClient from "@/utils/axios-client"

interface UpdateMessagesButtonProps {
  onUpdate?: () => void
}

export default function UpdateMessagesButton({ onUpdate }: UpdateMessagesButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  // 重置状态的定时器
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (status !== "idle") {
      timer = setTimeout(() => {
        setStatus("idle")
      }, 3000) // 3秒后重置状态
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [status])

  const handleUpdateMessages = async () => {
    try {
      setIsLoading(true)
      setStatus("idle")

      // 使用axiosClient来自动添加Authorization头部
      const response = await axiosClient.get("/api/update-messages")

      // 检查响应状态
      if (response.status === 200) {
        setStatus("success")

        // 调用更新回调
        if (onUpdate) {
          onUpdate()
        }
      } else {
        setStatus("error")
      }
    } catch (error) {
      console.error("Error updating messages:", error)
      setStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  // 获取按钮颜色
  const getButtonColor = () => {
    if (isLoading) return "bg-[#34C759]"
    switch (status) {
      case "success":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-[#34C759]"
    }
  }

  // 获取按钮图标
  const getButtonIcon = () => {
    if (isLoading) {
      return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    }

    switch (status) {
      case "success":
        return <CheckCircle size={16} />
      case "error":
        return <XCircle size={16} />
      default:
        return <RefreshCw size={16} />
    }
  }

  // 获取提示文本
  const getTooltipText = () => {
    if (isLoading) return "正在更新..."

    switch (status) {
      case "success":
        return "更新成功"
      case "error":
        return "更新失败"
      default:
        return "更新消息数据库"
    }
  }

  return (
    <div className="relative">
      <motion.button
        onClick={handleUpdateMessages}
        disabled={isLoading}
        whileTap={{ scale: 0.95 }}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getButtonColor()}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="更新消息数据库"
      >
        {getButtonIcon()}
      </motion.button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-50"
          >
            {getTooltipText()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 状态反馈 - 在按钮旁边显示 */}
      <AnimatePresence>
        {status !== "idle" && !showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-40"
          >
            {status === "success" ? "更新成功" : "更新失败"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
