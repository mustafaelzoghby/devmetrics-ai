"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  MoreHorizontal,
  Calendar,
  User,
  Flag,
  Trash2,
  Pencil,
  GripVertical,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDate, getInitials } from "@/lib/utils"

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"
type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE"

interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  status: TaskStatus
  dueDate?: string
  assignee?: { name: string; image?: string }
  labels?: string[]
  order: number
}

interface Column {
  id: string
  name: string
  color: string
  tasks: Task[]
}

const priorityConfig = {
  LOW: { label: "Low", color: "text-blue-600 bg-blue-50", icon: "🔵" },
  MEDIUM: { label: "Medium", color: "text-yellow-600 bg-yellow-50", icon: "🟡" },
  HIGH: { label: "High", color: "text-orange-600 bg-orange-50", icon: "🟠" },
  URGENT: { label: "Urgent", color: "text-red-600 bg-red-50", icon: "🔴" },
}

const columnColors: Record<string, string> = {
  "To Do": "border-t-gray-400",
  "In Progress": "border-t-blue-500",
  "In Review": "border-t-yellow-500",
  "Done": "border-t-green-500",
}

function TaskCard({ task, onUpdate, onDelete }: {
  task: Task
  onUpdate: (task: Task) => void
  onDelete: (id: string) => void
}) {
  const priority = priorityConfig[task.priority]

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1">
          <GripVertical className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          <span className="text-sm font-medium line-clamp-2">{task.title}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUpdate(task)}>
              <Pencil className="mr-2 h-3 w-3" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600">
              <Trash2 className="mr-2 h-3 w-3" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
      )}

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-2">
          {task.labels.map((label) => (
            <Badge key={label} variant="outline" className="text-xs py-0 h-4">{label}</Badge>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <Badge className={`${priority.color} border-0 text-xs py-0 h-4`}>
            {priority.icon} {priority.label}
          </Badge>
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>
        {task.assignee && (
          <Avatar className="h-5 w-5">
            <AvatarImage src={task.assignee.image} />
            <AvatarFallback className="text-xs">{getInitials(task.assignee.name)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  )
}

function NewTaskDialog({ columnId, onAdd }: { columnId: string; onAdd: (task: Partial<Task>) => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<Priority>("MEDIUM")

  function handleSubmit() {
    if (!title.trim()) return
    onAdd({ title, description, priority, status: columnId as TaskStatus, order: 0 })
    setTitle("")
    setDescription("")
    setPriority("MEDIUM")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-foreground">
          <Plus className="mr-1 h-3.5 w-3.5" /> Add task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Title</Label>
            <Input className="mt-1" placeholder="Task title..." value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Textarea className="mt-1" placeholder="Describe the task..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(priorityConfig) as Priority[]).map((p) => (
                  <SelectItem key={p} value={p}>
                    {priorityConfig[p].icon} {priorityConfig[p].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Create Task</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface KanbanBoardProps {
  projectName: string
  initialColumns?: Column[]
}

export function KanbanBoard({ projectName, initialColumns }: KanbanBoardProps) {
  const defaultColumns: Column[] = [
    { id: "TODO", name: "To Do", color: "border-t-gray-400", tasks: [] },
    { id: "IN_PROGRESS", name: "In Progress", color: "border-t-blue-500", tasks: [] },
    { id: "IN_REVIEW", name: "In Review", color: "border-t-yellow-500", tasks: [] },
    { id: "DONE", name: "Done", color: "border-t-green-500", tasks: [] },
  ]

  const [columns, setColumns] = useState<Column[]>(initialColumns || defaultColumns)
  const [draggedTask, setDraggedTask] = useState<{ task: Task; fromColumnId: string } | null>(null)

  function addTask(columnId: string, taskData: Partial<Task>) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title!,
      description: taskData.description,
      priority: taskData.priority || "MEDIUM",
      status: columnId as TaskStatus,
      order: 0,
    }
    setColumns((cols) =>
      cols.map((col) =>
        col.id === columnId ? { ...col, tasks: [newTask, ...col.tasks] } : col
      )
    )
  }

  function deleteTask(taskId: string) {
    setColumns((cols) =>
      cols.map((col) => ({ ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }))
    )
  }

  function handleDragStart(task: Task, fromColumnId: string) {
    setDraggedTask({ task, fromColumnId })
  }

  function handleDrop(toColumnId: string) {
    if (!draggedTask || draggedTask.fromColumnId === toColumnId) {
      setDraggedTask(null)
      return
    }
    setColumns((cols) =>
      cols.map((col) => {
        if (col.id === draggedTask.fromColumnId) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== draggedTask.task.id) }
        }
        if (col.id === toColumnId) {
          return { ...col, tasks: [{ ...draggedTask.task, status: toColumnId as TaskStatus }, ...col.tasks] }
        }
        return col
      })
    )
    setDraggedTask(null)
  }

  const totalTasks = columns.reduce((acc, col) => acc + col.tasks.length, 0)
  const doneTasks = columns.find((c) => c.id === "DONE")?.tasks.length || 0
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{projectName}</h2>
          <p className="text-sm text-muted-foreground">
            {doneTasks}/{totalTasks} tasks completed · {progress}% done
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-32 bg-muted rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <Button size="sm">
            <Plus className="mr-1 h-4 w-4" /> Add Column
          </Button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-4 gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex flex-col min-w-72"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(column.id)}
          >
            <div className={`bg-muted/50 rounded-xl border-t-4 ${column.color} p-3 h-full`}>
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{column.name}</span>
                  <Badge variant="outline" className="text-xs py-0 h-4">{column.tasks.length}</Badge>
                </div>
              </div>

              {/* Tasks */}
              <div className="space-y-2 min-h-16">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task, column.id)}
                  >
                    <TaskCard
                      task={task}
                      onUpdate={(t) => console.log("Update", t)}
                      onDelete={deleteTask}
                    />
                  </div>
                ))}
              </div>

              {/* Add Task */}
              <div className="mt-2">
                <NewTaskDialog columnId={column.id} onAdd={(data) => addTask(column.id, data)} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
