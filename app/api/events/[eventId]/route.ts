import { NextResponse } from "next/server"
import { addAuthHeader } from "@/utils/api-utils"

export async function GET(request: Request, { params }: { params: { eventId: string } }) {
  try {
    const { eventId } = params
    const url = new URL(request.url)
    const action = url.searchParams.get("action")

    // If action is "delete", handle deletion
    if (action === "delete") {
      const response = await fetch(`http://43.139.19.144:8000/events-db/${eventId}`, {
        method: "GET", // Using GET for deletion as per API requirements
        headers: addAuthHeader({
          "Content-Type": "application/json",
        }),
      })

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    }

    // If no action specified, just get the event
    const response = await fetch(`http://43.139.19.144:8000/events-db/${eventId}`, {
      method: "GET",
      headers: addAuthHeader({
        "Content-Type": "application/json",
      }),
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error with event ${params.eventId}:`, error)
    return NextResponse.json({ error: "Operation failed" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { eventId: string } }) {
  try {
    // Ensure params is properly awaited
    const { eventId } = params
    const body = await request.json()

    const response = await fetch(`http://43.139.19.144:8000/events-db/${eventId}`, {
      method: "PUT",
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
    console.error(`Error updating event ${params.eventId}:`, error)
    return NextResponse.json(
      { error: "Failed to update event", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
