import { DashboardOverview } from "@/components/dashboard/overview"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function OverviewPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <DashboardOverview
      user={{
        name: session.user.name || "Developer",
        image: session.user.image || undefined,
        subscriptionPlan: "FREE",
      }}
    />
  )
}
