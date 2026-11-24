import type { Metadata } from "next"
import { Inter, Geist } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "sonner"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DevMetrics AI — Developer Analytics Platform",
  description:
    "AI-powered developer analytics, GitHub insights, project management, and team collaboration. Built for Senior developers.",
  keywords: ["developer analytics", "GitHub analytics", "AI code review", "project management", "developer tools"],
  authors: [{ name: "Mustafa Mahmoud", url: "https://mustafa-mahmoud.vercel.app" }],
  openGraph: {
    title: "DevMetrics AI",
    description: "Your Developer Analytics Supercharged with AI",
    type: "website",
    url: "https://devmetrics-ai.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevMetrics AI",
    description: "Your Developer Analytics Supercharged with AI",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  )
}
