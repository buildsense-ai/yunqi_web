import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("http://43.139.19.144:8000/generate_events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error generating events:", error)
    return NextResponse.json({ error: "Failed to generate events" }, { status: 500 })
  }
}
