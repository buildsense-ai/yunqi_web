import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

export async function POST(request: Request, { params }: { params: { eventId: string } }) {
  try {
    const { eventId } = params

    // Get the binary data from the request
    const binaryData = await request.arrayBuffer()

    // Prepare the form data to send to the backend
    const formData = new FormData()
    formData.append("file", new Blob([binaryData]), "document.docx")

    // Get the token
    const token = await getToken({ req: request })

    // Send the request to the backend
    const response = await fetch(`http://43.139.19.144:8000/upload_doc?event_id=${eventId}`, {
      method: "POST",
      headers: token?.accessToken ? { Authorization: `Bearer ${token.accessToken}` } : undefined,
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API responded with status: ${response.status}. ${errorData.message || "Unknown error"}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`Error uploading document for event ${params.eventId}:`, error)
    return NextResponse.json(
      { error: "Failed to upload document", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
