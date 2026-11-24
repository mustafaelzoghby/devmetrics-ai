"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Search,
  Users,
  Crown,
  Shield,
  Code,
  Eye,
  Mail,
  MoreHorizontal,
  UserPlus,
  Settings,
  Star,
} from "lucide-react";

const mockTeams = [
  {
    id: "1",
    name: "Frontend Team",
    description: "فريق تطوير الواجهات الأمامية",
    members: [
      { name: "Mustafa Mahmoud", role: "OWNER", avatar: null, tasks: 12, commits: 89 },
      { name: "Ahmed Ali", role: "ADMIN", avatar: null, tasks: 8, commits: 56 },
      { name: "Sara Mohamed", role: "MEMBER", avatar: null, tasks: 10, commits: 43 },
      { name: "Omar Hassan", role: "MEMBER", avatar: null, tasks: 6, commits: 31 },
    ],
    projects: 4,
    productivity: 87,
    color: "#6366f1",
  },
  {
    id: "2",
    name: "Backend Team",
    description: "فريق تطوير الخوادم والـ APIs",
    members: [
      { name: "Youssef Ibrahim", role: "OWNER", avatar: null, tasks: 15, commits: 120 },
      { name: "Nour Ahmed", role: "MEMBER", avatar: null, tasks: 11, commits: 78 },
      { name: "Kareem Saad", role: "MEMBER", avatar: null, tasks: 9, commits: 65 },
    ],
    projects: 3,
    productivity: 92,
    color: "#8b5cf6",
  },
];

const roleConfig: Record<string, { label: string; icon: any; color: string }> = {
  OWNER: { label: "مالك", icon: Crown, color: "text-yellow-500" },
  ADMIN: { label: "مشرف", icon: Shield, color: "text-blue-500" },
  MEMBER: { label: "عضو", icon: Code, color: "text-green-500" },
  VIEWER: { label: "مشاهد", icon: Eye, color: "text-gray-500" },
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function TeamsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockTeams.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.description.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground mt-1">إدارة فرق العمل والأعضاء</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          فريق جديد
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "إجمالي الفرق", value: "5", icon: Users },
          { label: "إجمالي الأعضاء", value: "18", icon: UserPlus },
          { label: "متوسط الإنتاجية", value: "89%", icon: Star },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{s.label}</CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-9" placeholder="بحث في الفرق..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Teams */}
      <div className="space-y-6">
        {filtered.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl" style={{ backgroundColor: team.color + "20" }}>
                    <Users className="h-5 w-5" style={{ color: team.color }} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <CardDescription>{team.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{team.projects} مشاريع</Badge>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-1" />
                    إعدادات
                  </Button>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-1" />
                    دعوة
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Productivity */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">الإنتاجية الإجمالية</span>
                  <span className="font-medium">{team.productivity}%</span>
                </div>
                <Progress value={team.productivity} className="h-2" />
              </div>

              {/* Members */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-right p-3 font-medium">العضو</th>
                      <th className="text-right p-3 font-medium">الدور</th>
                      <th className="text-right p-3 font-medium">المهام</th>
                      <th className="text-right p-3 font-medium">Commits</th>
                      <th className="text-right p-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {team.members.map((member) => {
                      const role = roleConfig[member.role];
                      const RoleIcon = role.icon;
                      return (
                        <tr key={member.name} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={member.avatar || undefined} />
                                <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{member.name}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`flex items-center gap-1 w-fit text-xs font-medium ${role.color}`}>
                              <RoleIcon className="h-3 w-3" />
                              {role.label}
                            </span>
                          </td>
                          <td className="p-3 text-muted-foreground">{member.tasks}</td>
                          <td className="p-3 text-muted-foreground">{member.commits}</td>
                          <td className="p-3">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
