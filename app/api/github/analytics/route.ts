import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createGitHubClient } from "@/lib/github"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user?.githubToken || !user.githubUsername) {
      return NextResponse.json({ error: "GitHub not connected" }, { status: 400 })
    }

    const cached = await prisma.gitHubAnalyticsCache.findFirst({
      where: { userId: user.id, repoFullName: "overview", expiresAt: { gt: new Date() } },
    })
    if (cached) return NextResponse.json(cached.data)

    const gh = createGitHubClient(user.githubToken)
    const repos = await gh.getUserRepos(user.githubUsername)

    const languageCounts: Record<string, number> = {}
    for (const repo of repos.slice(0, 10)) {
      if (repo.language) languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
    }

    const totalRepos = Object.values(languageCounts).reduce((a, b) => a + b, 0)
    const languages = Object.entries(languageCounts)
      .map(([name, count]) => ({ name, percentage: Math.round((count / (totalRepos || 1)) * 100) }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 8)

    const analyticsData = {
      topRepos: repos.slice(0, 10).map((r: any) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        url: r.html_url,
      })),
      languages,
      totalRepos: repos.length,
      totalStars: repos.reduce((acc: number, r: any) => acc + r.stargazers_count, 0),
      totalForks: repos.reduce((acc: number, r: any) => acc + r.forks_count, 0),
    }

    await prisma.gitHubAnalyticsCache.upsert({
      where: { userId_repoFullName: { userId: user.id, repoFullName: "overview" } },
      create: { userId: user.id, repoFullName: "overview", data: analyticsData as any, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
      update: { data: analyticsData as any, expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
    })

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("GitHub analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
