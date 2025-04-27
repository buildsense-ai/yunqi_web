import { NextResponse } from "next/server"
import { addAuthHeader } from "@/utils/api-utils"

export async function POST(request: Request) {
  try {
    // Get the array of event IDs directly from the request body
    const eventIds = await request.json()

    // Validate that we received an array
    if (!Array.isArray(eventIds)) {
      return NextResponse.json({ error: "Invalid request format. Expected an array of event IDs." }, { status: 400 })
    }

    const response = await fetch("http://43.139.19.144:8000/merge-events", {
      method: "POST",
      headers: addAuthHeader({
        "Content-Type": "application/json",
      }),
      // Send the array directly
      body: JSON.stringify(eventIds),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API responded with status: ${response.status}. ${errorData.message || "Unknown error"}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error merging events:", error)
    return NextResponse.json(
      { error: "Failed to merge events", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
