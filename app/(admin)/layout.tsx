import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Sidebar } from "@/components/sidebar"
import { UserNav } from "@/components/user-nav"
import { Bell, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = { title: "Admin — DevMetrics AI" }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <Sidebar isAdmin={true} unreadNotifications={0} />
      </aside>
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-6">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-500" />
            <Badge variant="destructive" className="text-xs">Admin Panel</Badge>
          </div>
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
