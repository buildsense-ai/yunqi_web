import { NextResponse } from "next/server"
import { addAuthHeader } from "@/utils/api-utils"

export async function GET() {
  try {
    const response = await fetch("http://43.139.19.144:8000/get_AllDocs", {
      method: "GET",
      headers: addAuthHeader({
        "Content-Type": "application/json",
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}
