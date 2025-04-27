import { NextResponse } from "next/server"
import { addAuthHeader } from "@/utils/api-utils"

export async function DELETE(request: Request, { params }: { params: { docId: string } }) {
  try {
    const { docId } = params

    const response = await fetch(`http://43.139.19.144:8000/delete_doc/${docId}`, {
      method: "DELETE",
      headers: addAuthHeader({
        "Content-Type": "application/json",
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`API responded with status: ${response.status}. ${errorData.message || "doc not found"}`)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error(`Error deleting document ${params.docId}:`, error)
    return NextResponse.json(
      { error: "Failed to delete document", details: error instanceof Error ? error.message : "doc not found" },
      { status: 404 },
    )
  }
}
