import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  githubRepo: z.string().optional(),
  teamId: z.string().optional(),
  color: z.string().optional(),
  dueDate: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email! } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const projects = await prisma.project.findMany({
      where: { ownerId: user.id },
      include: {
        _count: { select: { tasks: true } },
        tasks: {
          where: { status: "DONE" },
          select: { id: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email! } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const body = await req.json()
    const data = createProjectSchema.parse(body)

    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

    const project = await prisma.project.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        githubRepo: data.githubRepo,
        teamId: data.teamId,
        color: data.color || "#6366f1",
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        ownerId: user.id,
        // Create default kanban columns
        columns: {
          create: [
            { name: "To Do", order: 0, color: "#6b7280" },
            { name: "In Progress", order: 1, color: "#3b82f6" },
            { name: "In Review", order: 2, color: "#f59e0b" },
            { name: "Done", order: 3, color: "#10b981" },
          ],
        },
      },
      include: { columns: true },
    })

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "project.created",
        entity: "Project",
        entityId: project.id,
        newValues: { name: project.name, slug: project.slug },
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
