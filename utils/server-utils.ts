import { addAuthHeader } from "./api-utils"

// 从请求中获取token并添加到headers中
export function getHeadersWithAuth(request: Request): HeadersInit {
  const headers = addAuthHeader()
  const token = request.headers.get("authorization")?.split(" ")[1]

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  return headers
}
