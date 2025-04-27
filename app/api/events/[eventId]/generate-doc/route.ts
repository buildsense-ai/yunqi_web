import { NextResponse } from "next/server"
import { addAuthHeader } from "@/utils/api-utils"

export async function GET(request: Request, { params }: { params: { eventId: string } }) {
  try {
    const { eventId } = params

    const response = await fetch(`http://43.139.19.144:8000/generate_doc/${eventId}`, {
      method: "GET",
      headers: addAuthHeader({
        "Content-Type": "application/json",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API responded with status: ${response.status}. ${errorData.message || "Unknown error"}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error generating document for event ${params.eventId}:`, error)
    return NextResponse.json(
      { error: "Failed to generate document", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
