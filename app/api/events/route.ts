import { NextResponse } from "next/server"
import { addAuthHeader } from "@/utils/api-utils"

export async function GET(request: Request) {
  try {
    // 从请求头中获取token
    const token = request.headers.get("authorization")?.split(" ")[1]

    const headers: HeadersInit = addAuthHeader()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch("http://43.139.19.144:8000/events-db", {
      cache: "no-store",
      headers,
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
