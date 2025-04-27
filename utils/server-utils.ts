import { addAuthHeader } from "./api-utils"

// 从请求中获取token
export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader) return null

  const parts = authHeader.split(" ")
  if (parts.length !== 2 || parts[0] !== "Bearer") return null

  return parts[1]
}

// 从请求中获取token并添加到headers中
export function getHeadersWithAuth(request: Request): HeadersInit {
  const headers = addAuthHeader()
  const token = getTokenFromRequest(request)

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}
