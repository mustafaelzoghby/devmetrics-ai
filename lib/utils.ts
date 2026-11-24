import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—"
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return "—"
  const d = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(d)
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M"
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K"
  return num.toString()
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getInitials(name: string): string {
  if (!name) return "?"
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export const SUBSCRIPTION_LIMITS = {
  FREE: { repos: 3, aiRequests: 10, teamMembers: 1, projects: 2 },
  PRO: { repos: 20, aiRequests: 500, teamMembers: 10, projects: 20 },
  ENTERPRISE: { repos: -1, aiRequests: -1, teamMembers: -1, projects: -1 },
} as const

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ["*"],
  ADMIN: ["users:read", "users:write", "projects:read", "projects:write", "audit:read", "teams:read", "teams:write"],
  MANAGER: ["projects:read", "projects:write", "teams:read", "teams:write"],
  DEVELOPER: ["projects:read", "projects:write", "teams:read"],
  VIEWER: ["projects:read", "teams:read"],
} as const

export function hasPermission(role: keyof typeof ROLE_PERMISSIONS, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] as readonly string[]
  return perms.includes("*") || perms.includes(permission)
}
