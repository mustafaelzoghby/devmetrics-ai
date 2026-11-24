"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText, Search, Download, Filter, User, Calendar, ChevronRight } from "lucide-react"
import { formatDate, formatRelativeTime } from "@/lib/utils"

interface AuditEntry {
  id: string
  userId: string
  userName: string
  userEmail: string
  action: string
  entity: string
  entityId: string
  ipAddress?: string
  createdAt: string
  metadata?: Record<string, any>
}

const actionColors: Record<string, string> = {
  "user.created": "bg-green-100 text-green-700",
  "user.updated": "bg-blue-100 text-blue-700",
  "user.deleted": "bg-red-100 text-red-700",
  "user.suspended": "bg-orange-100 text-orange-700",
  "project.created": "bg-green-100 text-green-700",
  "project.deleted": "bg-red-100 text-red-700",
  "task.created": "bg-green-100 text-green-700",
  "task.moved": "bg-purple-100 text-purple-700",
  "team.invited": "bg-blue-100 text-blue-700",
  "auth.login": "bg-gray-100 text-gray-700",
  "auth.logout": "bg-gray-100 text-gray-700",
  "subscription.upgraded": "bg-yellow-100 text-yellow-700",
}

const sampleLogs: AuditEntry[] = [
  { id: "1", userId: "u1", userName: "Ahmed Hassan", userEmail: "ahmed@example.com", action: "user.created", entity: "User", entityId: "u5", createdAt: new Date(Date.now() - 3600000).toISOString(), ipAddress: "197.60.12.45" },
  { id: "2", userId: "u1", userName: "Ahmed Hassan", userEmail: "ahmed@example.com", action: "project.created", entity: "Project", entityId: "p3", createdAt: new Date(Date.now() - 7200000).toISOString(), ipAddress: "197.60.12.45" },
  { id: "3", userId: "u2", userName: "Sara Mohamed", userEmail: "sara@example.com", action: "task.created", entity: "Task", entityId: "t12", createdAt: new Date(Date.now() - 86400000).toISOString(), ipAddress: "41.33.100.5" },
  { id: "4", userId: "u3", userName: "Omar Khaled", userEmail: "omar@example.com", action: "user.suspended", entity: "User", entityId: "u4", createdAt: new Date(Date.now() - 172800000).toISOString(), ipAddress: "105.130.5.22" },
  { id: "5", userId: "u1", userName: "Ahmed Hassan", userEmail: "ahmed@example.com", action: "subscription.upgraded", entity: "Subscription", entityId: "s2", createdAt: new Date(Date.now() - 259200000).toISOString(), ipAddress: "197.60.12.45" },
  { id: "6", userId: "u2", userName: "Sara Mohamed", userEmail: "sara@example.com", action: "auth.login", entity: "Session", entityId: "sess1", createdAt: new Date(Date.now() - 3800000).toISOString(), ipAddress: "41.33.100.5" },
  { id: "7", userId: "u3", userName: "Omar Khaled", userEmail: "omar@example.com", action: "task.moved", entity: "Task", entityId: "t8", createdAt: new Date(Date.now() - 10800000).toISOString(), ipAddress: "105.130.5.22" },
  { id: "8", userId: "u1", userName: "Ahmed Hassan", userEmail: "ahmed@example.com", action: "team.invited", entity: "TeamInvitation", entityId: "inv1", createdAt: new Date(Date.now() - 43200000).toISOString(), ipAddress: "197.60.12.45" },
]

export default function AuditLogs() {
  const [logs] = useState<AuditEntry[]>(sampleLogs)
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [entityFilter, setEntityFilter] = useState("all")

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.entity.toLowerCase().includes(search.toLowerCase())
    const matchAction = actionFilter === "all" || log.action.startsWith(actionFilter)
    const matchEntity = entityFilter === "all" || log.entity === entityFilter
    return matchSearch && matchAction && matchEntity
  })

  const entities = [...new Set(logs.map((l) => l.entity))]
  const actionPrefixes = [...new Set(logs.map((l) => l.action.split(".")[0]))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Audit Logs
          </h1>
          <p className="text-muted-foreground">Track every action performed across your platform.</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Export Logs
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: logs.length, color: "bg-blue-50 text-blue-600" },
          { label: "Today", value: logs.filter((l) => new Date(l.createdAt) > new Date(Date.now() - 86400000)).length, color: "bg-green-50 text-green-600" },
          { label: "Unique Users", value: new Set(logs.map((l) => l.userId)).size, color: "bg-purple-50 text-purple-600" },
          { label: "Critical Actions", value: logs.filter((l) => l.action.includes("deleted") || l.action.includes("suspended")).length, color: "bg-red-50 text-red-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className={`text-2xl font-bold ${stat.color.split(" ")[1]}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
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
              <Input placeholder="Search logs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actionPrefixes.map((p) => (
                  <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={entityFilter} onValueChange={setEntityFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Entity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Entities</SelectItem>
                {entities.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base">Events ({filtered.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{log.userName}</div>
                        <div className="text-xs text-muted-foreground">{log.userEmail}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${actionColors[log.action] || "bg-gray-100 text-gray-700"} border-0 text-xs font-mono`}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{log.entity}</div>
                    <div className="text-xs text-muted-foreground font-mono">{log.entityId}</div>
                  </TableCell>
                  <TableCell className="text-sm font-mono text-muted-foreground">
                    {log.ipAddress || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatRelativeTime(new Date(log.createdAt))}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(log.createdAt)}</div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
