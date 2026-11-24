import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { analyzeCode } from "@/lib/gemini"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { code, language } = await req.json()
    if (!code || !language) return NextResponse.json({ error: "Code and language are required" }, { status: 400 })
    if (code.length > 10000) return NextResponse.json({ error: "Code too long (max 10,000 characters)" }, { status: 400 })

    const result = await analyzeCode(code, language)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Code review error:", error)
    return NextResponse.json({ error: "Failed to analyze code" }, { status: 500 })
  }
}
