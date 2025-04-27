import { NextResponse } from "next/server"
import { addAuthHeader } from "@/utils/api-utils"

export async function GET() {
  try {
    const response = await fetch("http://43.139.19.144:8000/get_messages_with_image", {
      method: "GET",
      headers: addAuthHeader({
        "Content-Type": "application/json",
      }),
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error updating messages:", error)
    return NextResponse.json({ error: "Failed to update messages" }, { status: 500 })
  }
}
