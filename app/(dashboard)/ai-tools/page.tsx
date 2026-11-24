"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Bot,
  Code2,
  FileText,
  GitCommit,
  Compass,
  Loader2,
  Copy,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  TrendingUp,
} from "lucide-react"
import { toast } from "sonner"

type ToolTab = "code-review" | "readme" | "commit" | "career"

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState<ToolTab>("code-review")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  // Code Review State
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("typescript")

  // README State
  const [repoName, setRepoName] = useState("")
  const [repoDesc, setRepoDesc] = useState("")
  const [repoFeatures, setRepoFeatures] = useState("")
  const [repoTech, setRepoTech] = useState("")

  // Commit State
  const [commitMsg, setCommitMsg] = useState("")
  const [diff, setDiff] = useState("")

  async function handleCodeReview() {
    if (!code.trim()) return toast.error("Please enter some code to review")
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/ai/code-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      toast.error("Failed to analyze code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleReadmeGenerate() {
    if (!repoName.trim()) return toast.error("Please enter repository name")
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/ai/readme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: repoName,
          description: repoDesc,
          language: "TypeScript",
          features: repoFeatures.split("\n").filter(Boolean),
          techStack: repoTech.split("\n").filter(Boolean),
        }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      toast.error("Failed to generate README. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleCommitImprove() {
    if (!commitMsg.trim()) return toast.error("Please enter a commit message")
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/ai/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: commitMsg, diff }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      toast.error("Failed to improve commit message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleCareerAdvice() {
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch("/api/ai/career")
      const data = await res.json()
      setResult(data)
    } catch {
      toast.error("Failed to get career advice. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Copied to clipboard!")
  }

  const severityColor = {
    low: "bg-blue-100 text-blue-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bot className="h-6 w-6 text-purple-600" />
          AI Tools
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-0">Powered by Gemini</Badge>
        </h1>
        <p className="text-muted-foreground">Supercharge your development workflow with AI assistance.</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v as ToolTab); setResult(null) }}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="code-review" className="flex items-center gap-2">
            <Code2 className="h-3.5 w-3.5" />
            Code Review
          </TabsTrigger>
          <TabsTrigger value="readme" className="flex items-center gap-2">
            <FileText className="h-3.5 w-3.5" />
            README
          </TabsTrigger>
          <TabsTrigger value="commit" className="flex items-center gap-2">
            <GitCommit className="h-3.5 w-3.5" />
            Commits
          </TabsTrigger>
          <TabsTrigger value="career" className="flex items-center gap-2">
            <Compass className="h-3.5 w-3.5" />
            Career
          </TabsTrigger>
        </TabsList>

        {/* Code Review Tab */}
        <TabsContent value="code-review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI Code Reviewer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-48 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["typescript", "javascript", "python", "rust", "go", "java", "csharp", "cpp"].map((l) => (
                      <SelectItem key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Paste your code</Label>
                <Textarea
                  className="mt-1 font-mono text-sm min-h-48"
                  placeholder="// Paste your code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
              <Button onClick={handleCodeReview} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analyze Code
              </Button>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-4">
              {/* Score Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className={`text-5xl font-bold ${result.score >= 80 ? "text-green-600" : result.score >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                        {result.score}
                      </div>
                      <div className="text-sm text-muted-foreground">Quality Score</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{result.summary}</p>
                      {result.metrics && (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                          {Object.entries(result.metrics).map(([key, val]: any) => (
                            <div key={key} className="text-center">
                              <div className="text-lg font-semibold">{val}</div>
                              <div className="text-xs text-muted-foreground capitalize">{key}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issues */}
              {result.issues?.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertCircle className="h-4 w-4 text-orange-600" />Issues Found ({result.issues.length})</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {result.issues.map((issue: any, i: number) => (
                      <div key={i} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`${(severityColor as any)[issue.severity] || severityColor.low} border-0 text-xs`}>
                            {issue.severity}
                          </Badge>
                          <span className="text-sm font-medium">{issue.type}</span>
                          {issue.line && <span className="text-xs text-muted-foreground">Line {issue.line}</span>}
                        </div>
                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                        {issue.fix && <p className="text-sm text-green-700 mt-1"><strong>Fix:</strong> {issue.fix}</p>}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Suggestions */}
              {result.suggestions?.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4 text-blue-600" />Suggestions</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {result.suggestions.map((s: any, i: number) => (
                      <div key={i} className="border rounded-lg p-3">
                        <Badge variant="outline" className="mb-2 text-xs">{s.category}</Badge>
                        <p className="text-sm">{s.suggestion}</p>
                        {s.example && <pre className="mt-2 text-xs bg-muted p-2 rounded">{s.example}</pre>}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* README Tab */}
        <TabsContent value="readme" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">README Generator</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Repository Name</Label>
                  <Input className="mt-1" placeholder="my-awesome-project" value={repoName} onChange={(e) => setRepoName(e.target.value)} />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input className="mt-1" placeholder="Brief description..." value={repoDesc} onChange={(e) => setRepoDesc(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Key Features (one per line)</Label>
                <Textarea className="mt-1 min-h-24" placeholder="User authentication&#10;Real-time updates&#10;Dark mode support" value={repoFeatures} onChange={(e) => setRepoFeatures(e.target.value)} />
              </div>
              <div>
                <Label>Tech Stack (one per line)</Label>
                <Textarea className="mt-1 min-h-24" placeholder="Next.js&#10;TypeScript&#10;PostgreSQL" value={repoTech} onChange={(e) => setRepoTech(e.target.value)} />
              </div>
              <Button onClick={handleReadmeGenerate} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate README
              </Button>
            </CardContent>
          </Card>

          {result?.readme && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Generated README</CardTitle>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(result.readme)}>
                  {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-4 rounded-lg overflow-auto max-h-96 whitespace-pre-wrap font-mono">
                  {result.readme}
                </pre>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Commit Tab */}
        <TabsContent value="commit" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Commit Message Improver</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Original Commit Message</Label>
                <Input className="mt-1" placeholder="fixed stuff" value={commitMsg} onChange={(e) => setCommitMsg(e.target.value)} />
              </div>
              <div>
                <Label>Code Diff (optional)</Label>
                <Textarea className="mt-1 font-mono text-sm min-h-32" placeholder="Paste git diff output here..." value={diff} onChange={(e) => setDiff(e.target.value)} />
              </div>
              <Button onClick={handleCommitImprove} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Improve Message
              </Button>
            </CardContent>
          </Card>

          {result?.suggestions && (
            <Card>
              <CardHeader><CardTitle className="text-base">Improved Suggestions</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {result.suggestions.map((s: any, i: number) => (
                  <div key={i} className="border rounded-lg p-4 hover:border-purple-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="font-mono text-xs">{s.type}</Badge>
                      <Button size="sm" variant="ghost" onClick={() => copyToClipboard(s.message)}>
                        {copied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <code className="text-sm font-mono bg-muted px-2 py-1 rounded block">{s.message}</code>
                    <p className="text-xs text-muted-foreground mt-2">{s.explanation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Career Tab */}
        <TabsContent value="career" className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">AI Career Advisor</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Get personalized career advice based on your GitHub activity, skills, and project history.
              </p>
              <Button onClick={handleCareerAdvice} disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Compass className="mr-2 h-4 w-4" />}
                Analyze My Career Profile
              </Button>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="text-sm py-1 px-3 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-0">
                      {result.currentLevel?.toUpperCase()} LEVEL
                    </Badge>
                  </div>
                  <p className="text-sm">{result.overallAdvice}</p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                {result.strengths?.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle className="text-sm flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-600" />Your Strengths</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {result.strengths.map((s: string, i: number) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span> {s}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {result.skillGaps?.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle className="text-sm flex items-center gap-2"><TrendingUp className="h-4 w-4 text-orange-600" />Skills to Learn</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {result.skillGaps.slice(0, 4).map((gap: any, i: number) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-sm">{gap.skill}</span>
                          <Badge className={`text-xs border-0 ${gap.importance === "high" ? "bg-red-100 text-red-700" : gap.importance === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                            {gap.importance}
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              {result.projectIdeas?.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-sm">Recommended Projects</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {result.projectIdeas.map((p: any, i: number) => (
                      <div key={i} className="border rounded-lg p-3">
                        <div className="font-medium text-sm mb-1">{p.title}</div>
                        <p className="text-xs text-muted-foreground mb-2">{p.description}</p>
                        <div className="flex gap-1 flex-wrap">
                          {p.skills?.map((s: string) => (
                            <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
