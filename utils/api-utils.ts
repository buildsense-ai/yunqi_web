import { cookies } from "next/headers"

// 用于服务器端获取token的函数
export function getServerToken(): string | null {
  const cookieStore = cookies()
  return cookieStore.get("access_token")?.value || null
}

// 用于客户端获取token的函数
export function getClientToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token")
  }
  return null
}

// 为fetch请求添加Authorization头
export function addAuthHeader(headers: HeadersInit = {}): HeadersInit {
  // 这个函数只在服务器端使用
  const token = getServerToken()

  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    }
  }

  return headers
}
