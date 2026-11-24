"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  FolderKanban,
  Activity,
  TrendingUp,
  TrendingDown,
  Server,
  Database,
  Zap,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  DollarSign,
  ArrowUpRight,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

const userGrowthData = [
  { month: "Jun", users: 120 },
  { month: "Jul", users: 185 },
  { month: "Aug", users: 240 },
  { month: "Sep", users: 320 },
  { month: "Oct", users: 480 },
  { month: "Nov", users: 620 },
]

const revenueData = [
  { month: "Jun", revenue: 1200 },
  { month: "Jul", revenue: 2100 },
  { month: "Aug", revenue: 2800 },
  { month: "Sep", revenue: 3600 },
  { month: "Oct", revenue: 5200 },
  { month: "Nov", revenue: 7400 },
]

const aiUsageData = [
  { day: "Mon", requests: 1240 },
  { day: "Tue", requests: 1890 },
  { day: "Wed", requests: 2340 },
  { day: "Thu", requests: 1670 },
  { day: "Fri", requests: 2890 },
  { day: "Sat", requests: 1120 },
  { day: "Sun", requests: 980 },
]

const systemHealth = [
  { name: "API Server", status: "healthy", uptime: 99.98, latency: "45ms" },
  { name: "Database", status: "healthy", uptime: 99.99, latency: "12ms" },
  { name: "AI Engine", status: "healthy", uptime: 99.95, latency: "890ms" },
  { name: "Auth Service", status: "healthy", uptime: 100, latency: "23ms" },
  { name: "Email Service", status: "degraded", uptime: 98.5, latency: "340ms" },
]

export function AdminDashboard() {
  const kpis = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Active Projects",
      value: "1,234",
      change: "+8.2%",
      trend: "up",
      icon: FolderKanban,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Monthly Revenue",
      value: "$7,400",
      change: "+42.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      title: "AI Requests Today",
      value: "14,892",
      change: "+5.1%",
      trend: "up",
      icon: Zap,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Pro Subscribers",
      value: "482",
      change: "+18.7%",
      trend: "up",
      icon: TrendingUp,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Churn Rate",
      value: "2.3%",
      change: "-0.5%",
      trend: "down",
      icon: TrendingDown,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-indigo-600" />
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Platform-wide overview and system health monitoring.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${kpi.bg} mb-3`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <div className="text-xl font-bold">{kpi.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{kpi.title}</div>
              <div className={`flex items-center gap-1 mt-1 text-xs ${kpi.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {kpi.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {kpi.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">User Growth</CardTitle>
            <Badge variant="outline" className="text-xs">Last 6 months</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} fill="url(#userGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Monthly Revenue</CardTitle>
            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-xs">+42.3%</Badge>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v) => `$${v}`} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              AI Requests (This Week)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={aiUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="#9333ea" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="h-4 w-4 text-green-600" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemHealth.map((service) => (
              <div key={service.name} className="flex items-center gap-3">
                {service.status === "healthy" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-yellow-500 shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{service.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{service.latency}</span>
                      <span className="text-xs font-mono">{service.uptime}%</span>
                    </div>
                  </div>
                  <Progress
                    value={service.uptime}
                    className="h-1.5"
                  />
                </div>
                <Badge
                  className={`text-xs border-0 shrink-0 ${service.status === "healthy" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                >
                  {service.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subscription Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { plan: "Free", count: 2185, pct: 76.7, color: "bg-gray-200" },
              { plan: "Pro", count: 482, pct: 16.9, color: "bg-indigo-500" },
              { plan: "Enterprise", count: 180, pct: 6.3, color: "bg-yellow-500" },
            ].map((item) => (
              <div key={item.plan} className="text-center p-4 bg-muted/50 rounded-xl">
                <div className="text-3xl font-bold mb-1">{item.count.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mb-3">{item.plan} Users</div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
                <div className="text-xs text-muted-foreground mt-1">{item.pct}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
