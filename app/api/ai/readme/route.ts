import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { generateReadme } from "@/lib/gemini"

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { name, description, language, features, techStack } = await req.json()
    if (!name) return NextResponse.json({ error: "Repository name is required" }, { status: 400 })

    const readme = await generateReadme({ name, description, language, features, techStack })
    return NextResponse.json({ readme })
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate README" }, { status: 500 })
  }
}
