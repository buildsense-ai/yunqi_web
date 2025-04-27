"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LogIn, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"

export default function LoginButton() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()
  const [showTooltip, setShowTooltip] = useState(false)

  const handleClick = () => {
    if (isAuthenticated) {
      logout()
      // 登出后重定向到登录页面
      router.push("/login")
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
          isAuthenticated ? "bg-red-500" : "bg-[#007AFF]"
        }`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={isAuthenticated ? "登出" : "登录"}
      >
        {isAuthenticated ? <LogOut size={16} /> : <LogIn size={16} />}
      </motion.button>

      {showTooltip && (
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
          {isAuthenticated ? "登出" : "登录"}
        </div>
      )}
    </div>
  )
}
