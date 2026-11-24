/**
 * devmetrics-sdk
 * Open-source TypeScript SDK for GitHub developer analytics
 * 
 * @author Mustafa Mahmoud
 * @license MIT
 */

export interface DevMetricsConfig {
  token: string
  cacheEnabled?: boolean
  cacheTTL?: number // milliseconds, default 5 minutes
}

export interface RepoStats {
  score: number
  name: string
  fullName: string
  description: string | null
  stars: number
  forks: number
  openIssues: number
  language: string | null
  languages: Record<string, number>
  commits: number
  pullRequests: number
  lastCommit: string | null
  createdAt: string
  updatedAt: string
  breakdown: {
    stars: number
    commits: number
    hasReadme: number
    hasDescription: number
    hasLicense: number
    forks: number
    languages: number
    prActivity: number
  }
}

export interface DeveloperProfile {
  username: string
  name: string
  bio: string | null
  avatarUrl: string
  publicRepos: number
  followers: number
  following: number
  totalStars: number
  totalForks: number
  topLanguages: Array<{ name: string; percentage: number }>
  contributionStreak: number
  totalContributions: number
}

export interface ContributionCalendar {
  totalContributions: number
  weeks: Array<{
    days: Array<{
      date: string
      count: number
      level: 0 | 1 | 2 | 3 | 4
    }>
  }>
}

const GITHUB_API = "https://api.github.com"

class Cache {
  private store = new Map<string, { data: any; expiresAt: number }>()

  get(key: string) {
    const entry = this.store.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }
    return entry.data
  }

  set(key: string, data: any, ttl: number) {
    this.store.set(key, { data, expiresAt: Date.now() + ttl })
  }

  clear() {
    this.store.clear()
  }
}

export class DevMetrics {
  private token: string
  private cache: Cache
  private cacheEnabled: boolean
  private cacheTTL: number

  constructor(config: DevMetricsConfig) {
    this.token = config.token
    this.cache = new Cache()
    this.cacheEnabled = config.cacheEnabled ?? true
    this.cacheTTL = config.cacheTTL ?? 5 * 60 * 1000
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    const cacheKey = endpoint

    if (this.cacheEnabled) {
      const cached = this.cache.get(cacheKey)
      if (cached) return cached
    }

    const response = await fetch(`${GITHUB_API}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    if (this.cacheEnabled) {
      this.cache.set(cacheKey, data, this.cacheTTL)
    }

    return data
  }

  /**
   * Get comprehensive stats for a repository including a quality score
   */
  async getRepoStats(repoFullName: string): Promise<RepoStats> {
    const [owner, repo] = repoFullName.split("/")
    if (!owner || !repo) throw new Error("Invalid repo format. Use 'owner/repo'")

    const [repoData, languages, commits, prs] = await Promise.all([
      this.fetch<any>(`/repos/${owner}/${repo}`),
      this.fetch<Record<string, number>>(`/repos/${owner}/${repo}/languages`),
      this.fetch<any[]>(`/repos/${owner}/${repo}/commits?per_page=100`),
      this.fetch<any[]>(`/repos/${owner}/${repo}/pulls?state=all&per_page=100`),
    ])

    const scores = {
      stars: Math.min((repoData.stargazers_count / 100) * 20, 20),
      commits: Math.min((commits.length / 30) * 20, 20),
      hasReadme: repoData.has_wiki ? 15 : 0,
      hasDescription: repoData.description ? 10 : 0,
      hasLicense: repoData.license ? 10 : 0,
      forks: Math.min((repoData.forks_count / 20) * 10, 10),
      languages: Math.min(Object.keys(languages).length * 2, 10),
      prActivity: Math.min(prs.length * 2, 10),
    }

    const score = Math.min(Math.round(Object.values(scores).reduce((a, b) => a + b, 0)), 100)

    return {
      score,
      name: repoData.name,
      fullName: repoData.full_name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      openIssues: repoData.open_issues_count,
      language: repoData.language,
      languages,
      commits: commits.length,
      pullRequests: prs.length,
      lastCommit: commits[0]?.commit?.author?.date || null,
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
      breakdown: scores,
    }
  }

  /**
   * Get developer profile with aggregated stats
   */
  async getDeveloperProfile(username: string): Promise<DeveloperProfile> {
    const [user, repos] = await Promise.all([
      this.fetch<any>(`/users/${username}`),
      this.fetch<any[]>(`/users/${username}/repos?per_page=100&sort=updated`),
    ])

    // Calculate language distribution
    const languageCounts: Record<string, number> = {}
    for (const repo of repos.slice(0, 20)) {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
      }
    }

    const totalRepos = Object.values(languageCounts).reduce((a, b) => a + b, 0)
    const topLanguages = Object.entries(languageCounts)
      .map(([name, count]) => ({ name, percentage: Math.round((count / totalRepos) * 100) }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5)

    return {
      username: user.login,
      name: user.name || user.login,
      bio: user.bio,
      avatarUrl: user.avatar_url,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      totalStars: repos.reduce((acc, r) => acc + r.stargazers_count, 0),
      totalForks: repos.reduce((acc, r) => acc + r.forks_count, 0),
      topLanguages,
      contributionStreak: 0, // Requires GraphQL
      totalContributions: 0, // Requires GraphQL
    }
  }

  /**
   * Compare multiple repositories
   */
  async compareRepos(repoFullNames: string[]): Promise<RepoStats[]> {
    const results = await Promise.all(repoFullNames.map((r) => this.getRepoStats(r)))
    return results.sort((a, b) => b.score - a.score)
  }

  /**
   * Get top repositories for a user sorted by score
   */
  async getTopRepos(username: string, limit = 5): Promise<RepoStats[]> {
    const repos = await this.fetch<any[]>(`/users/${username}/repos?per_page=30&sort=stars`)
    const topRepos = repos.slice(0, Math.min(limit * 2, 20))
    const stats = await Promise.all(topRepos.map((r) => this.getRepoStats(r.full_name).catch(() => null)))
    return stats.filter(Boolean).sort((a, b) => b!.score - a!.score).slice(0, limit) as RepoStats[]
  }

  /**
   * Clear the internal cache
   */
  clearCache() {
    this.cache.clear()
  }
}

// Factory function for quick setup
export function createDevMetrics(token: string, options?: Partial<DevMetricsConfig>) {
  return new DevMetrics({ token, ...options })
}

// Standalone utility functions
export async function quickRepoScore(repoFullName: string, token: string): Promise<number> {
  const dm = createDevMetrics(token)
  const stats = await dm.getRepoStats(repoFullName)
  return stats.score
}

export function formatScore(score: number): { label: string; color: string; emoji: string } {
  if (score >= 90) return { label: "Excellent", color: "#10b981", emoji: "🌟" }
  if (score >= 75) return { label: "Great", color: "#6366f1", emoji: "🚀" }
  if (score >= 60) return { label: "Good", color: "#3b82f6", emoji: "✅" }
  if (score >= 40) return { label: "Fair", color: "#f59e0b", emoji: "⚠️" }
  return { label: "Needs Work", color: "#ef4444", emoji: "🔧" }
}
