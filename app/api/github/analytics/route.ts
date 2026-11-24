import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const username = searchParams.get("username") || (session.user as any).login

    if (!username) {
      return NextResponse.json({ error: "GitHub username required" }, { status: 400 })
    }

    // Fetch from GitHub API directly
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    }
    const token = (session as any)?.user?.githubToken
    if (token) headers["Authorization"] = `Bearer ${token}`

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, { headers }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers }),
    ])

    if (!userRes.ok) {
      return NextResponse.json({ error: "GitHub user not found" }, { status: 404 })
    }

    const user = await userRes.json()
    const repos = reposRes.ok ? await reposRes.json() : []

    const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0)
    const totalForks = repos.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0)

    const languageCounts: Record<string, number> = {}
    repos.forEach((r: any) => {
      if (r.language) languageCounts[r.language] = (languageCounts[r.language] || 0) + 1
    })

    const analyticsData = {
      user: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
      },
      topRepos: repos.slice(0, 10).map((r: any) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        url: r.html_url,
      })),
      languages: Object.entries(languageCounts)
        .map(([name, count]) => ({ name, percentage: Math.round((count / (repos.length || 1)) * 100) }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 8),
      totalRepos: repos.length,
      totalStars,
      totalForks,
      score: Math.min(
        Math.round(
          Math.min(user.public_repos * 2, 30) +
          Math.min(user.followers * 0.5, 20) +
          Math.min(totalStars * 0.3, 25) +
          Math.min(totalForks * 0.5, 15) +
          10
        ),
        100
      ),
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("GitHub analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
