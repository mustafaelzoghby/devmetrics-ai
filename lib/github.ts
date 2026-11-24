export interface GitHubAnalytics {
  user: {
    login: string
    name: string | null
    avatar_url: string
    bio: string | null
    public_repos: number
    followers: number
    following: number
    created_at: string
  }
  stats: {
    totalStars: number
    totalForks: number
    totalCommits: number
    topLanguages: Record<string, number>
    contributionStreak: number
  }
  repos: Array<{
    name: string
    description: string | null
    stargazers_count: number
    forks_count: number
    language: string | null
    updated_at: string | null
    topics: string[]
    html_url: string
  }>
  score: number
}

async function ghFetch(url: string, token?: string | null) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }
  if (token) headers["Authorization"] = `Bearer ${token}`
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
  return res.json()
}

export function createGitHubClient(token?: string | null) {
  return {
    getUser: (username: string) => ghFetch(`https://api.github.com/users/${username}`, token),
    getRepos: (username: string) =>
      ghFetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, token),
  }
}

export async function getGitHubAnalytics(
  username: string,
  token?: string | null
): Promise<GitHubAnalytics> {
  const [user, repos] = await Promise.all([
    ghFetch(`https://api.github.com/users/${username}`, token),
    ghFetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, token),
  ])

  const totalStars = repos.reduce((sum: number, r: any) => sum + (r.stargazers_count || 0), 0)
  const totalForks = repos.reduce((sum: number, r: any) => sum + (r.forks_count || 0), 0)

  const topLanguages: Record<string, number> = {}
  repos.forEach((r: any) => {
    if (r.language) {
      topLanguages[r.language] = (topLanguages[r.language] || 0) + 1
    }
  })

  const score = calculateDeveloperScore({
    publicRepos: user.public_repos || 0,
    followers: user.followers || 0,
    totalStars,
    totalForks,
    yearsActive: Math.floor(
      (Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365)
    ),
  })

  return {
    user: {
      login: user.login,
      name: user.name || null,
      avatar_url: user.avatar_url,
      bio: user.bio || null,
      public_repos: user.public_repos || 0,
      followers: user.followers || 0,
      following: user.following || 0,
      created_at: user.created_at,
    },
    stats: {
      totalStars,
      totalForks,
      totalCommits: 0,
      topLanguages,
      contributionStreak: 0,
    },
    repos: repos.slice(0, 10).map((r: any) => ({
      name: r.name,
      description: r.description || null,
      stargazers_count: r.stargazers_count || 0,
      forks_count: r.forks_count || 0,
      language: r.language || null,
      updated_at: r.updated_at || null,
      topics: r.topics || [],
      html_url: r.html_url,
    })),
    score,
  }
}

function calculateDeveloperScore(params: {
  publicRepos: number
  followers: number
  totalStars: number
  totalForks: number
  yearsActive: number
}): number {
  let score = 0
  score += Math.min(params.publicRepos * 2, 30)
  score += Math.min(params.followers * 0.5, 20)
  score += Math.min(params.totalStars * 0.3, 25)
  score += Math.min(params.totalForks * 0.5, 15)
  score += Math.min(params.yearsActive * 2, 10)
  return Math.min(Math.round(score), 100)
}
