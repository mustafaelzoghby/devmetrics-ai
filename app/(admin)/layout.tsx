import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

export const metadata: Metadata = { title: "Admin Dashboard — DevMetrics AI" }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession()
  if (!session?.user) redirect("/login")
  // Admin check will be done per-page using middleware
  return <>{children}</>
}
