import { NextResponse } from "next/server"
import { addAuthHeader } from "@/utils/api-utils"

export async function DELETE(request: Request, { params }: { params: { eventId: string; messageId: string } }) {
  try {
    const { eventId, messageId } = params

    // Call the backend API to delete the document
    const response = await fetch(`http://43.139.19.144:8000/delete_doc?event_id=${eventId}&message_id=${messageId}`, {
      method: "DELETE",
      headers: addAuthHeader(),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API responded with status: ${response.status}. ${errorData.message || "Unknown error"}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error deleting document from event ${params.eventId}:`, error)
    return NextResponse.json(
      { error: "Failed to delete document", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
