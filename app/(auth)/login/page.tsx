"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GitBranch, BarChart3, Bot, Shield } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-bold shadow-lg">
              DM
            </div>
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            DevMetrics AI
          </CardTitle>
          <CardDescription className="text-base">
            Your Developer Analytics Supercharged with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Features preview */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: BarChart3, label: "GitBranch Analytics", color: "bg-blue-50 text-blue-600" },
              { icon: Bot, label: "AI Code Review", color: "bg-purple-50 text-purple-600" },
              { icon: Shield, label: "Team Management", color: "bg-green-50 text-green-600" },
            ].map((f) => (
              <div key={f.label} className={`flex flex-col items-center gap-2 p-3 rounded-xl ${f.color.split(" ")[0]}`}>
                <f.icon className={`h-5 w-5 ${f.color.split(" ")[1]}`} />
                <span className="text-xs font-medium text-center leading-tight">{f.label}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="w-full h-12 text-base bg-gray-900 hover:bg-gray-800 text-white"
            size="lg"
          >
            <GitBranch className="mr-3 h-5 w-5" />
            Continue with GitHub
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <a href="#" className="underline hover:text-foreground">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
