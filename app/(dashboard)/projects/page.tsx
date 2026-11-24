"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Search,
  Kanban,
  List,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Folder,
} from "lucide-react";

const mockProjects = [
  {
    id: "1",
    name: "DevMetrics AI Platform",
    description: "منصة SaaS لتحليل أداء المطورين",
    status: "ACTIVE",
    progress: 75,
    tasks: { total: 48, done: 36 },
    members: 4,
    dueDate: "2025-01-15",
    priority: "HIGH",
    tags: ["Next.js", "AI", "SaaS"],
  },
  {
    id: "2",
    name: "Portfolio Website",
    description: "بورتفوليو شخصي احترافي",
    status: "ACTIVE",
    progress: 90,
    tasks: { total: 20, done: 18 },
    members: 1,
    dueDate: "2024-12-01",
    priority: "MEDIUM",
    tags: ["React", "Tailwind"],
  },
  {
    id: "3",
    name: "Mobile App v2",
    description: "تطبيق موبايل للإصدار الثاني",
    status: "PLANNING",
    progress: 20,
    tasks: { total: 60, done: 12 },
    members: 6,
    dueDate: "2025-03-01",
    priority: "HIGH",
    tags: ["React Native", "TypeScript"],
  },
  {
    id: "4",
    name: "API Gateway",
    description: "بوابة API للميكروسيرفيسز",
    status: "COMPLETED",
    progress: 100,
    tasks: { total: 35, done: 35 },
    members: 3,
    dueDate: "2024-11-01",
    priority: "LOW",
    tags: ["Node.js", "Docker"],
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  ACTIVE: { label: "نشط", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", icon: CheckCircle2 },
  PLANNING: { label: "تخطيط", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400", icon: Clock },
  ON_HOLD: { label: "متوقف", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", icon: AlertCircle },
  COMPLETED: { label: "مكتمل", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400", icon: CheckCircle2 },
};

const priorityConfig: Record<string, string> = {
  HIGH: "text-red-500",
  MEDIUM: "text-yellow-500",
  LOW: "text-green-500",
};

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = mockProjects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">إدارة مشاريعك بكفاءة عالية</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          مشروع جديد
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "إجمالي المشاريع", value: "12", icon: Folder, color: "text-blue-500" },
          { label: "نشطة", value: "7", icon: CheckCircle2, color: "text-green-500" },
          { label: "قيد التخطيط", value: "3", icon: Clock, color: "text-yellow-500" },
          { label: "مكتملة", value: "2", icon: CheckCircle2, color: "text-gray-500" },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="بحث في المشاريع..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex border rounded-lg overflow-hidden">
          <Button
            variant={view === "grid" ? "default" : "ghost"}
            size="sm"
            className="rounded-none"
            onClick={() => setView("grid")}
          >
            <Kanban className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="sm"
            className="rounded-none"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className={`grid gap-4 ${view === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        {filtered.map((project) => {
          const status = statusConfig[project.status];
          const StatusIcon = status.icon;
          return (
            <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Folder className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">{project.description}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">التقدم</span>
                    <span className="font-medium">{project.tasks.done}/{project.tasks.total} مهمة</span>
                  </div>
                  <Progress value={project.progress} className="h-1.5" />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1">
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {project.members}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {project.dueDate}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
