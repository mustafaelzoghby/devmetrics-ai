import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { analyzeCode } from "@/lib/gemini"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check subscription limits
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const { code, language } = await req.json()

    if (!code || !language) {
      return NextResponse.json({ error: "Code and language are required" }, { status: 400 })
    }

    if (code.length > 10000) {
      return NextResponse.json({ error: "Code too long (max 10,000 characters)" }, { status: 400 })
    }

    // Analyze with Gemini
    const result = await analyzeCode(code, language)

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "ai.code_review",
        entity: "AIRequest",
        entityId: user.id,
        newValues: { language, codeLength: code.length, score: result.score },
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Code review error:", error)
    return NextResponse.json({ error: "Failed to analyze code" }, { status: 500 })
  }
}
