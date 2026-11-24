import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { improveCommitMessage } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { message, diff } = await req.json()
    if (!message) return NextResponse.json({ error: "Commit message is required" }, { status: 400 })

    const result = await improveCommitMessage(message, diff || "")
    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to improve commit message" }, { status: 500 })
  }
}
