"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Bot,
  FolderKanban,
  Home,
  Settings,
  Shield,
  Users,
  Bell,
  FileText,
  CreditCard,
  Activity,
  GitBranch,
  ChevronDown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react"

const navigation = [
  {
    title: "Overview",
    href: "/overview",
    icon: Home,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "AI Tools",
    href: "/ai-tools",
    icon: Bot,
    badge: "New",
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Teams",
    href: "/teams",
    icon: Users,
  },
  {
    title: "GitHub",
    href: "/analytics",
    icon: GitBranch,
  },
]

const managementNavigation = [
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Subscriptions",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    title: "Audit Logs",
    href: "/admin/audit-logs",
    icon: FileText,
  },
  {
    title: "System Health",
    href: "/admin/system",
    icon: Activity,
  },
]

const accountNavigation = [
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

interface SidebarProps {
  isAdmin?: boolean
  unreadNotifications?: number
}

export function Sidebar({ isAdmin, unreadNotifications = 0 }: SidebarProps) {
  const pathname = usePathname()
  const [adminOpen, setAdminOpen] = useState(pathname.startsWith("/admin"))

  return (
    <div className="flex h-full flex-col gap-2">
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold">
            DM
          </div>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            DevMetrics
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-auto px-3 py-2">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.title}
                {item.badge && (
                  <Badge className="ml-auto text-xs py-0 h-5 bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Account */}
        <div className="mt-6">
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Account
          </p>
          <nav className="space-y-1">
            {accountNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.title}
                  {item.href === "/notifications" && unreadNotifications > 0 && (
                    <Badge className="ml-auto text-xs py-0 h-5 bg-red-100 text-red-700 hover:bg-red-100">
                      {unreadNotifications}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="mt-6">
            <Collapsible open={adminOpen} onOpenChange={setAdminOpen}>
              <CollapsibleTrigger className="flex w-full items-center justify-between px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 hover:text-foreground transition-colors">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  Admin
                </div>
                <ChevronDown
                  className={cn("h-3 w-3 transition-transform", adminOpen && "rotate-180")}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <nav className="space-y-1">
                  {managementNavigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                          isActive
                            ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.title}
                      </Link>
                    )
                  })}
                </nav>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>
    </div>
  )
}
