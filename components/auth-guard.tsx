"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 如果用户未登录，重定向到登录页面
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // 如果用户未登录，不渲染子组件
  if (!isAuthenticated) {
    return null
  }

  // 如果用户已登录，渲染子组件
  return <>{children}</>
}
