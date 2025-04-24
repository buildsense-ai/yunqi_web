import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const response = await fetch("http://43.139.19.144:8000/merge-events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
