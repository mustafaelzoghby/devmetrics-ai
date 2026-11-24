import type { Metadata } from "next"
import { Sidebar } from "@/components/sidebar"
import { UserNav } from "@/components/user-nav"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Dashboard — DevMetrics AI" }

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <Sidebar isAdmin={false} unreadNotifications={0} />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
