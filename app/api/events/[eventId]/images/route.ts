import { NextResponse } from "next/server"
import { addAuthHeader } from "@/utils/api-utils"

export async function POST(request: Request, { params }: { params: { eventId: string } }) {
  try {
    const { eventId } = params
    const body = await request.json()

    const response = await fetch(`http://43.139.19.144:8000/events-db/${eventId}/images`, {
      method: "POST",
      headers: addAuthHeader({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API responded with status: ${response.status}. ${errorData.message || "Unknown error"}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error associating image with event ${params.eventId}:`, error)
    return NextResponse.json(
      { error: "Failed to associate image", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
