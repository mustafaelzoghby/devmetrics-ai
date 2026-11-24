"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Users,
  Search,
  MoreHorizontal,
  Shield,
  UserX,
  UserCheck,
  Mail,
  Filter,
  Download,
  Eye,
  TrendingUp,
  Activity,
} from "lucide-react"
import { formatDate, formatRelativeTime, getInitials } from "@/lib/utils"

type UserRole = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "DEVELOPER" | "VIEWER"
type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING"
type SubscriptionPlan = "FREE" | "PRO" | "ENTERPRISE"

interface User {
  id: string
  name: string
  email: string
  image?: string
  role: UserRole
  status: UserStatus
  subscriptionPlan: SubscriptionPlan
  githubUsername?: string
  createdAt: string
  lastActive?: string
}

const roleColors: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-red-100 text-red-700",
  ADMIN: "bg-orange-100 text-orange-700",
  MANAGER: "bg-blue-100 text-blue-700",
  DEVELOPER: "bg-green-100 text-green-700",
  VIEWER: "bg-gray-100 text-gray-700",
}

const statusColors: Record<UserStatus, string> = {
  ACTIVE: "bg-green-100 text-green-700",
  SUSPENDED: "bg-red-100 text-red-700",
  PENDING: "bg-yellow-100 text-yellow-700",
}

const planColors: Record<SubscriptionPlan, string> = {
  FREE: "bg-gray-100 text-gray-600",
  PRO: "bg-indigo-100 text-indigo-700",
  ENTERPRISE: "bg-yellow-100 text-yellow-700",
}

// Sample data - will be replaced with real API data
const sampleUsers: User[] = [
  { id: "1", name: "Ahmed Hassan", email: "ahmed@example.com", role: "ADMIN", status: "ACTIVE", subscriptionPlan: "PRO", githubUsername: "ahmedh", createdAt: "2024-01-15", lastActive: "2024-11-24" },
  { id: "2", name: "Sara Mohamed", email: "sara@example.com", role: "DEVELOPER", status: "ACTIVE", subscriptionPlan: "FREE", githubUsername: "saram", createdAt: "2024-02-20", lastActive: "2024-11-23" },
  { id: "3", name: "Omar Khaled", email: "omar@example.com", role: "MANAGER", status: "ACTIVE", subscriptionPlan: "ENTERPRISE", githubUsername: "omark", createdAt: "2024-03-10", lastActive: "2024-11-22" },
  { id: "4", name: "Nour Ali", email: "nour@example.com", role: "VIEWER", status: "SUSPENDED", subscriptionPlan: "FREE", createdAt: "2024-04-05", lastActive: "2024-10-15" },
  { id: "5", name: "Youssef Ibrahim", email: "youssef@example.com", role: "DEVELOPER", status: "PENDING", subscriptionPlan: "PRO", githubUsername: "youssefib", createdAt: "2024-11-20" },
]

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [planFilter, setPlanFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.githubUsername?.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === "all" || u.role === roleFilter
    const matchStatus = statusFilter === "all" || u.status === statusFilter
    const matchPlan = planFilter === "all" || u.subscriptionPlan === planFilter
    return matchSearch && matchRole && matchStatus && matchPlan
  })

  function changeRole(userId: string, role: UserRole) {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u))
  }

  function toggleStatus(userId: string) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
          : u
      )
    )
  }

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "ACTIVE").length,
    pro: users.filter((u) => u.subscriptionPlan === "PRO").length,
    enterprise: users.filter((u) => u.subscriptionPlan === "ENTERPRISE").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            User Management
          </h1>
          <p className="text-muted-foreground">Manage users, roles, and permissions across the platform.</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active", value: stats.active, icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pro Users", value: stats.pro, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Enterprise", value: stats.enterprise, icon: Activity, color: "text-yellow-600", bg: "bg-yellow-50" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {["SUPER_ADMIN", "ADMIN", "MANAGER", "DEVELOPER", "VIEWER"].map((r) => (
                  <SelectItem key={r} value={r}>{r.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {["ACTIVE", "SUSPENDED", "PENDING"].map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                {["FREE", "PRO", "ENTERPRISE"].map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">
            Users ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} />
                        <AvatarFallback className="text-xs">{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                        {user.githubUsername && (
                          <div className="text-xs text-muted-foreground">@{user.githubUsername}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${roleColors[user.role]} border-0 text-xs`}>
                      {user.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[user.status]} border-0 text-xs`}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${planColors[user.subscriptionPlan]} border-0 text-xs`}>
                      {user.subscriptionPlan}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastActive ? formatRelativeTime(new Date(user.lastActive)) : "—"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => { setSelectedUser(user); setViewDialogOpen(true) }}>
                          <Eye className="mr-2 h-3.5 w-3.5" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-3.5 w-3.5" /> Send Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel className="text-xs text-muted-foreground">Change Role</DropdownMenuLabel>
                        {(["ADMIN", "MANAGER", "DEVELOPER", "VIEWER"] as UserRole[]).map((role) => (
                          <DropdownMenuItem
                            key={role}
                            onClick={() => changeRole(user.id, role)}
                            className={user.role === role ? "bg-muted" : ""}
                          >
                            <Shield className="mr-2 h-3.5 w-3.5" />
                            Set as {role.replace("_", " ")}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => toggleStatus(user.id)}
                          className={user.status === "ACTIVE" ? "text-red-600" : "text-green-600"}
                        >
                          {user.status === "ACTIVE"
                            ? <><UserX className="mr-2 h-3.5 w-3.5" /> Suspend</>
                            : <><UserCheck className="mr-2 h-3.5 w-3.5" /> Activate</>}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.image} />
                  <AvatarFallback className="text-xl">{getInitials(selectedUser.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                  <p className="text-muted-foreground text-sm">{selectedUser.email}</p>
                  {selectedUser.githubUsername && (
                    <p className="text-sm text-blue-600">@{selectedUser.githubUsername}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Role", value: <Badge className={`${roleColors[selectedUser.role]} border-0 text-xs`}>{selectedUser.role}</Badge> },
                  { label: "Status", value: <Badge className={`${statusColors[selectedUser.status]} border-0 text-xs`}>{selectedUser.status}</Badge> },
                  { label: "Plan", value: <Badge className={`${planColors[selectedUser.subscriptionPlan]} border-0 text-xs`}>{selectedUser.subscriptionPlan}</Badge> },
                  { label: "Member Since", value: formatDate(selectedUser.createdAt) },
                ].map((item) => (
                  <div key={item.label} className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                    <div className="text-sm font-medium">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
