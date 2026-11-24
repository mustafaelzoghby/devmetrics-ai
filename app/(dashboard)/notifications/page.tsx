"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  GitCommit,
  Users,
  CheckCircle,
  AlertCircle,
  Star,
  GitPullRequest,
  MessageSquare,
  Shield,
  Clock,
  Trash2,
  CheckCheck,
} from "lucide-react";

const mockNotifications = [
  {
    id: "1",
    type: "COMMIT",
    title: "Commit جديد في devmetrics-ai",
    message: "تم دفع 3 commits إلى الفرع الرئيسي",
    time: "منذ 5 دقائق",
    read: false,
    icon: GitCommit,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    id: "2",
    type: "TEAM",
    title: "دعوة للانضمام لفريق",
    message: "Ahmed Ali دعاك للانضمام إلى Frontend Team",
    time: "منذ 20 دقيقة",
    read: false,
    icon: Users,
    color: "text-purple-500",
    bg: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    id: "3",
    type: "PR",
    title: "Pull Request تم قبوله",
    message: "تم دمج PR #42: Add AI code review feature",
    time: "منذ ساعة",
    read: false,
    icon: GitPullRequest,
    color: "text-green-500",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    id: "4",
    type: "COMMENT",
    title: "تعليق جديد على مهمة",
    message: "Sara Mohamed علقت على: Setup Prisma schema",
    time: "منذ 2 ساعة",
    read: true,
    icon: MessageSquare,
    color: "text-yellow-500",
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    id: "5",
    type: "STAR",
    title: "نجمة جديدة على مستودعك",
    message: "حصل devmetrics-ai على نجمة من مستخدم جديد",
    time: "منذ 3 ساعات",
    read: true,
    icon: Star,
    color: "text-orange-500",
    bg: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    id: "6",
    type: "SECURITY",
    title: "تنبيه أمني",
    message: "تم تسجيل دخول من جهاز جديد في القاهرة",
    time: "منذ 5 ساعات",
    read: true,
    icon: Shield,
    color: "text-red-500",
    bg: "bg-red-100 dark:bg-red-900/30",
  },
  {
    id: "7",
    type: "TASK",
    title: "مهمة مكتملة",
    message: "تم إنجاز: Deploy to Vercel successfully",
    time: "أمس",
    read: true,
    icon: CheckCircle,
    color: "text-teal-500",
    bg: "bg-teal-100 dark:bg-teal-900/30",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">الإشعارات</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0 ? `لديك ${unreadCount} إشعارات غير مقروءة` : "كل الإشعارات مقروءة ✅"}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllRead} className="gap-2">
              <CheckCheck className="h-4 w-4" />
              قراءة الكل
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">غير مقروءة</CardTitle>
            <Bell className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي اليوم</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">تنبيهات أمنية</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.map((notif) => {
          const Icon = notif.icon;
          return (
            <div
              key={notif.id}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all group ${
                !notif.read ? "bg-primary/5 border-primary/20" : "bg-card hover:bg-muted/30"
              }`}
            >
              <div className={`p-2.5 rounded-full flex-shrink-0 ${notif.bg}`}>
                <Icon className={`h-4 w-4 ${notif.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`font-medium text-sm ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>
                      {notif.title}
                      {!notif.read && (
                        <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {!notif.read && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markRead(notif.id)}>
                        <CheckCircle className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteNotification(notif.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">{notif.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
