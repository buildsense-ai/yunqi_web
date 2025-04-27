"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
    if (isLoading) return

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

  return (
    <div className="relative">
      <motion.button
        onClick={handleUpdateMessages}
        disabled={isLoading}
        whileTap={{ scale: 0.95 }}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
          isLoading
            ? "bg-[#34C759]"
            : status === "success"
              ? "bg-green-500"
              : status === "error"
                ? "bg-red-500"
                : "bg-[#34C759]"
        }`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="更新消息数据库"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : status === "success" ? (
          <CheckCircle size={16} />
        ) : status === "error" ? (
          <XCircle size={16} />
        ) : (
          <RefreshCw size={16} />
        )}
      </motion.button>

      {showTooltip && (
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
          {isLoading
            ? "正在更新..."
            : status === "success"
              ? "更新成功"
              : status === "error"
                ? "更新失败"
                : "更新消息数据库"}
        </div>
      )}

      {/* 状态反馈 - 在按钮旁边显示 */}
      {status !== "idle" && !showTooltip && (
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
          {status === "success" ? "更新成功" : "更新失败"}
        </div>
      )}
    </div>
  )
}
