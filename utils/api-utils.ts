// 用于客户端获取token的函数
export function getClientToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token")
  }
  return null
}

// 为fetch请求添加Authorization头
export function addAuthHeader(headers: HeadersInit = {}): HeadersInit {
  // 由于我们不能在API路由中使用cookies()，我们需要从请求中获取token
  // 这个函数现在只添加基本的headers，token将在API路由中处理
  return {
    ...headers,
    "Content-Type": "application/json",
  }
}
