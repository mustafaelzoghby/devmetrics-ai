import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createGitHubClient } from "@/lib/github"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
    })

    if (!user?.githubToken || !user.githubUsername) {
      return NextResponse.json({ error: "GitHub not connected" }, { status: 400 })
    }

    // Check cache first (5 min TTL)
    const cached = await prisma.gitHubAnalyticsCache.findFirst({
      where: {
        userId: user.id,
        repoFullName: "overview",
        expiresAt: { gt: new Date() },
      },
    })

    if (cached) return NextResponse.json(cached.data)

    // Fetch fresh data from GitHub
    const gh = createGitHubClient(user.githubToken)
    const [contributions, repos] = await Promise.all([
      gh.getContributionStats(user.githubUsername),
      gh.getUserRepos(user.githubUsername),
    ])

    // Calculate language distribution
    const languageCounts: Record<string, number> = {}
    for (const repo of repos.slice(0, 20)) {
      try {
        const langs = await gh.getRepoLanguages(user.githubUsername, repo.name)
        for (const [lang, bytes] of Object.entries(langs)) {
          languageCounts[lang] = (languageCounts[lang] || 0) + (bytes as number)
        }
      } catch {}
    }

    const totalBytes = Object.values(languageCounts).reduce((a, b) => a + b, 0)
    const languages = Object.entries(languageCounts)
      .map(([name, bytes]) => ({ name, percentage: Math.round((bytes / totalBytes) * 100) }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 8)

    const analyticsData = {
      contributions: contributions.data?.user?.contributionsCollection,
      topRepos: repos.slice(0, 10).map((r: any) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        url: r.html_url,
        updatedAt: r.updated_at,
      })),
      languages,
      totalRepos: repos.length,
      totalStars: repos.reduce((acc: number, r: any) => acc + r.stargazers_count, 0),
      totalForks: repos.reduce((acc: number, r: any) => acc + r.forks_count, 0),
    }

    // Cache for 5 minutes
    await prisma.gitHubAnalyticsCache.upsert({
      where: { userId_repoFullName: { userId: user.id, repoFullName: "overview" } },
      create: {
        userId: user.id,
        repoFullName: "overview",
        data: analyticsData as any,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
      update: {
        data: analyticsData as any,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    })

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("GitHub analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
