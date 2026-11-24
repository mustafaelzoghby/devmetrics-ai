"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart3,
  GitCommit,
  GitPullRequest,
  Star,
  Users,
  TrendingUp,
  Zap,
  ArrowUpRight,
  Bot,
  FolderKanban,
  Activity,
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import Link from "next/link"
import { getInitials, formatNumber, formatRelativeTime } from "@/lib/utils"

// Mock data — will be replaced with real API data
const commitData = [
  { month: "Jun", commits: 45 },
  { month: "Jul", commits: 72 },
  { month: "Aug", commits: 58 },
  { month: "Sep", commits: 89 },
  { month: "Oct", commits: 102 },
  { month: "Nov", commits: 134 },
]

const languageData = [
  { name: "TypeScript", value: 45, color: "#3178c6" },
  { name: "JavaScript", value: 25, color: "#f7df1e" },
  { name: "Python", value: 15, color: "#3776ab" },
  { name: "CSS", value: 10, color: "#264de4" },
  { name: "Other", value: 5, color: "#6b7280" },
]

const recentActivity = [
  { type: "commit", repo: "devmetrics-ai", message: "feat: add kanban board drag and drop", time: new Date(Date.now() - 3600000) },
  { type: "pr", repo: "portfolio", message: "PR #12: Update projects section", time: new Date(Date.now() - 7200000) },
  { type: "star", repo: "react-hooks-lib", message: "Received 5 new stars", time: new Date(Date.now() - 86400000) },
  { type: "commit", repo: "api-gateway", message: "fix: handle rate limiting properly", time: new Date(Date.now() - 172800000) },
]

interface DashboardOverviewProps {
  user: {
    name: string
    image?: string
    githubUsername?: string
    subscriptionPlan: string
  }
}

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const stats = [
    {
      title: "Total Repositories",
      value: "24",
      change: "+3 this month",
      icon: BarChart3,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "up",
    },
    {
      title: "Total Commits",
      value: "1,247",
      change: "+134 this month",
      icon: GitCommit,
      color: "text-green-600",
      bg: "bg-green-50",
      trend: "up",
    },
    {
      title: "Pull Requests",
      value: "48",
      change: "12 open",
      icon: GitPullRequest,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "up",
    },
    {
      title: "Total Stars",
      value: "386",
      change: "+22 this month",
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      trend: "up",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your code today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            className={
              user.subscriptionPlan === "FREE"
                ? "bg-gray-100 text-gray-700"
                : user.subscriptionPlan === "PRO"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-yellow-100 text-yellow-700"
            }
          >
            {user.subscriptionPlan}
          </Badge>
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.image} />
            <AvatarFallback>{getInitials(user.name || "U")}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.title}</div>
              <div className="text-xs text-green-600 mt-1">{stat.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commit Activity Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">Commit Activity</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/analytics">
                View All <ArrowUpRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={commitData}>
                <defs>
                  <linearGradient id="commitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="commits"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#commitGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Languages Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Languages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center mb-4">
              <PieChart width={160} height={160}>
                <Pie
                  data={languageData}
                  cx={80}
                  cy={80}
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                >
                  {languageData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </div>
            <div className="space-y-2">
              {languageData.map((lang) => (
                <div key={lang.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: lang.color }} />
                    <span>{lang.name}</span>
                  </div>
                  <span className="text-muted-foreground">{lang.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                    activity.type === "commit" ? "bg-blue-100 text-blue-600" :
                    activity.type === "pr" ? "bg-purple-100 text-purple-600" :
                    "bg-yellow-100 text-yellow-600"
                  }`}>
                    {activity.type === "commit" ? <GitCommit className="h-3 w-3" /> :
                     activity.type === "pr" ? <GitPullRequest className="h-3 w-3" /> :
                     <Star className="h-3 w-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.repo} · {formatRelativeTime(activity.time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <Link href="/dashboard/ai-tools">
                <Bot className="h-4 w-4 text-purple-600" />
                AI Code Review
                <Badge className="ml-auto bg-purple-100 text-purple-700 hover:bg-purple-100 border-0">New</Badge>
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <Link href="/dashboard/ai-tools/readme">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                Generate README
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <Link href="/dashboard/projects/new">
                <FolderKanban className="h-4 w-4 text-green-600" />
                New Project
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start gap-3" asChild>
              <Link href="/dashboard/teams">
                <Users className="h-4 w-4 text-orange-600" />
                Invite Team Member
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
