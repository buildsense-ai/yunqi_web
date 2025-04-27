import { NextResponse } from "next/server"
import { getHeadersWithAuth } from "@/utils/server-utils"

export async function GET(request: Request, { params }: { params: { eventId: string } }) {
  try {
    const { eventId } = params

    const headers = getHeadersWithAuth(request)

    const response = await fetch(`http://43.139.19.144:8000/events-db/${eventId}/messages`, {
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
    console.error(`Error fetching messages for event ${params.eventId}:`, error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: { eventId: string } }) {
  try {
    const { eventId } = params
    const body = await request.json()

    const headers = getHeadersWithAuth(request)

    const response = await fetch(`http://43.139.19.144:8000/events-db/${eventId}/messages`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API responded with status: ${response.status}. ${errorData.message || "Unknown error"}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error adding message to event ${params.eventId}:`, error)
    return NextResponse.json(
      { error: "Failed to add message", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
