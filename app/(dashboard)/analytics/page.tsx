"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  GitCommit,
  GitPullRequest,
  Star,
  GitFork,
  TrendingUp,
  Users,
  Code,
  RefreshCw,
  Search,
  Github,
  Calendar,
  Zap,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

const mockCommitData = [
  { month: "Jun", commits: 45 },
  { month: "Jul", commits: 72 },
  { month: "Aug", commits: 38 },
  { month: "Sep", commits: 91 },
  { month: "Oct", commits: 65 },
  { month: "Nov", commits: 88 },
];

const mockLanguageData = [
  { name: "TypeScript", value: 55 },
  { name: "JavaScript", value: 20 },
  { name: "Python", value: 12 },
  { name: "CSS", value: 8 },
  { name: "Other", value: 5 },
];

const mockRepos = [
  { name: "devmetrics-ai", stars: 128, forks: 34, commits: 342, prs: 28, language: "TypeScript", score: 94 },
  { name: "fast-food", stars: 56, forks: 12, commits: 189, prs: 15, language: "JavaScript", score: 78 },
  { name: "portfolio", stars: 89, forks: 21, commits: 234, prs: 19, language: "TypeScript", score: 85 },
];

export default function AnalyticsPage() {
  const [username, setUsername] = useState("mustafaelzoghby");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/github/analytics?username=${username}`);
      const json = await res.json();
      setData(json);
    } catch {
      // use mock data
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">GitHub Analytics</h1>
        <p className="text-muted-foreground mt-1">
          تحليل شامل لأداءك على GitHub بالذكاء الاصطناعي
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="أدخل اسم مستخدم GitHub..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchAnalytics()}
              />
            </div>
            <Button onClick={fetchAnalytics} disabled={loading}>
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Github className="h-4 w-4 mr-2" />
              )}
              تحليل
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "إجمالي المستودعات", value: "32", icon: Code, change: "+3 هذا الشهر", color: "text-blue-500" },
          { label: "إجمالي النجوم", value: "2,847", icon: Star, change: "+156 هذا الشهر", color: "text-yellow-500" },
          { label: "Total Commits", value: "4,521", icon: GitCommit, change: "+88 هذا الأسبوع", color: "text-green-500" },
          { label: "Developer Score", value: "94/100", icon: Zap, change: "🏆 مستوى خبير", color: "text-purple-500" },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Commit Activity</CardTitle>
            <CardDescription>آخر 6 شهور</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mockCommitData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="commits" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
            <CardDescription>توزيع لغات البرمجة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={mockLanguageData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                    {mockLanguageData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {mockLanguageData.map((lang, i) => (
                  <div key={lang.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span>{lang.name}</span>
                    </div>
                    <span className="font-medium">{lang.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Repositories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Repositories</CardTitle>
          <CardDescription>أفضل مستودعاتك بالتفصيل</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRepos.map((repo) => (
              <div key={repo.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Code className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{repo.name}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" /> {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" /> {repo.forks}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitCommit className="h-3 w-3" /> {repo.commits}
                      </span>
                      <Badge variant="outline" className="text-xs">{repo.language}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">Score</p>
                    <p className="text-2xl font-bold text-primary">{repo.score}</p>
                  </div>
                  <div className="w-20">
                    <Progress value={repo.score} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
