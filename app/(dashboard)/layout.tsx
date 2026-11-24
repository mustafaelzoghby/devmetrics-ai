import type { Metadata } from "next"
import { Sidebar } from "@/components/sidebar"
import { UserNav } from "@/components/user-nav"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export const metadata: Metadata = {
  title: "Dashboard — DevMetrics AI",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { role: true },
  })

  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN"

  const unreadCount = await prisma.notification.count({
    where: {
      user: { email: session.user.email! },
      read: false,
    },
  })

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <Sidebar isAdmin={isAdmin} unreadNotifications={unreadCount} />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
            <UserNav />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
