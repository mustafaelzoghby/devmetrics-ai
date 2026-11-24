"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  GitBranch,
  BarChart3,
  Bot,
  FolderKanban,
  Users,
  Shield,
  Zap,
  Star,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "GitHub Analytics",
    description: "Real-time repository scoring, commit heatmaps, language distribution, and PR analytics.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Bot,
    title: "AI-Powered Tools",
    description: "Code reviews, README generation, commit message improvement, and career advice — all with Gemini AI.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    badge: "New",
  },
  {
    icon: FolderKanban,
    title: "Project Management",
    description: "Kanban boards, task assignments, deadlines, and progress tracking built for developers.",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Invite team members, assign roles, track team performance and collaborate effectively.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "5-level RBAC system: Super Admin, Admin, Manager, Developer, and Viewer roles.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: Zap,
    title: "Audit Logs",
    description: "Track every action across your organization with detailed, filterable audit trails.",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
]

const stats = [
  { label: "Repositories Analyzed", value: "10K+" },
  { label: "AI Code Reviews", value: "50K+" },
  { label: "Developers", value: "2K+" },
  { label: "Teams", value: "500+" },
]

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for personal projects",
    features: ["3 repositories", "2 projects", "10 AI requests/month", "Basic analytics"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    per: "/month",
    description: "For professional developers",
    features: ["20 repositories", "10 projects", "500 AI requests/month", "Advanced analytics", "Team features (10 members)", "Priority support"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: ["Unlimited everything", "SSO integration", "Custom AI models", "Dedicated support", "SLA guarantee", "On-premise option"],
    cta: "Contact Sales",
    popular: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navbar */}
      <nav className="border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold">
              DM
            </div>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              DevMetrics AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a>
            <Button onClick={() => signIn("github")} size="sm">
              <GitBranch className="mr-2 h-4 w-4" />
              Sign in with GitHub
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-gray-950 dark:to-purple-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-0">
            <Star className="mr-1 h-3 w-3" /> Powered by Google Gemini AI
          </Badge>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Your Developer Analytics
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Supercharged with AI
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Analyze your GitHub repos, get AI-powered code reviews, manage projects with Kanban boards, 
            and lead your team — all in one platform built for senior developers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => signIn("github")} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0">
              <GitBranch className="mr-2 h-5 w-5" />
              Start Free with GitHub
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete platform that elevates your developer workflow, from code analysis to team management.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{feature.title}</h3>
                    {(feature as any).badge && (
                      <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0 text-xs">
                        {(feature as any).badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Start free, scale as you grow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? "border-indigo-500 shadow-lg shadow-indigo-100" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-indigo-600 text-white hover:bg-indigo-600">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.per && <span className="text-muted-foreground">{plan.per}</span>}
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => signIn("github")}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 font-bold text-xl mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold">
              DM
            </div>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              DevMetrics AI
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Built with ❤️ by{" "}
            <a href="https://mustafa-mahmoud.vercel.app" className="text-indigo-600 hover:underline">
              Mustafa Mahmoud
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
