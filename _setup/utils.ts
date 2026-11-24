import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

export function formatRelativeTime(date: Date | string) {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (seconds < 60) return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return formatDate(date)
}

export function formatNumber(num: number) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export const SUBSCRIPTION_LIMITS = {
  FREE: {
    repos: 3,
    projects: 2,
    teamMembers: 1,
    aiRequests: 10,
  },
  PRO: {
    repos: 20,
    projects: 10,
    teamMembers: 10,
    aiRequests: 500,
  },
  ENTERPRISE: {
    repos: Infinity,
    projects: Infinity,
    teamMembers: Infinity,
    aiRequests: Infinity,
  },
}

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ["*"],
  ADMIN: ["users.read", "users.write", "projects.*", "teams.*", "analytics.*"],
  MANAGER: ["projects.*", "teams.read", "teams.write", "analytics.read"],
  DEVELOPER: ["projects.read", "projects.write", "tasks.*", "analytics.read"],
  VIEWER: ["projects.read", "tasks.read", "analytics.read"],
}

export function hasPermission(role: string, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS] || []
  return perms.includes("*") || perms.includes(permission) || perms.some((p) => p.endsWith(".*") && permission.startsWith(p.slice(0, -2)))
}
