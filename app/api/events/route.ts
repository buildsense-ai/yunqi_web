import { NextResponse } from "next/server"
import { addAuthHeader } from "@/utils/api-utils"

export async function GET() {
  try {
    const response = await fetch("http://43.139.19.144:8000/events-db", {
      cache: "no-store",
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
    console.error("Error fetching events:", error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}
