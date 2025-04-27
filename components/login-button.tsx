"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LogIn } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function LoginButton() {
  const router = useRouter()
  const { isAuthenticated, logout } = useAuth()

  const handleClick = () => {
    if (isAuthenticated) {
      logout()
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center text-white"
        aria-label={isAuthenticated ? "登出" : "登录"}
      >
        <LogIn size={16} className={isAuthenticated ? "rotate-180" : ""} />
      </motion.button>
    </div>
  )
}
