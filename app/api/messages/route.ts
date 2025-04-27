import { NextResponse } from "next/server"
import { getHeadersWithAuth } from "@/utils/server-utils"

export async function GET(request: Request) {
  try {
    const headers = getHeadersWithAuth(request)

    const response = await fetch("http://43.139.19.144:8000/messages", {
      method: "GET",
      headers,
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
