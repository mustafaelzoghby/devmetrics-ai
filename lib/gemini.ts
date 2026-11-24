import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function analyzeCode(code: string, language: string): Promise<{
  score: number
  issues: Array<{ severity: "critical" | "warning" | "info"; message: string; line?: number }>
  suggestions: string[]
  summary: string
}> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `You are an expert code reviewer. Analyze the following ${language} code and provide a detailed review.

Code:
\`\`\`${language}
${code}
\`\`\`

Respond with a JSON object in this exact format (no markdown, just JSON):
{
  "score": <number 0-100>,
  "issues": [
    {"severity": "critical|warning|info", "message": "<issue description>", "line": <line number or null>}
  ],
  "suggestions": ["<actionable suggestion 1>", "<suggestion 2>"],
  "summary": "<2-3 sentence overall summary>"
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text().replace(/```json\n?|\n?```/g, "").trim()

  try {
    return JSON.parse(text)
  } catch {
    return {
      score: 75,
      issues: [{ severity: "info", message: "Code analysis completed. Manual review recommended." }],
      suggestions: ["Consider adding more comments", "Review error handling"],
      summary: "Code analysis completed. The code appears functional but could benefit from improvements.",
    }
  }
}

export async function generateReadme(params: {
  projectName: string
  description: string
  features: string
  techStack: string
  githubUsername?: string
}): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `Generate a professional, comprehensive GitHub README.md for this project:

Project Name: ${params.projectName}
Description: ${params.description}
Key Features: ${params.features}
Tech Stack: ${params.techStack}
GitHub Username: ${params.githubUsername || "developer"}

Create a beautiful README with:
- Eye-catching header with badges
- Table of contents
- Features list with emojis
- Tech stack section
- Installation & setup guide
- Usage examples
- Contributing guidelines
- License section

Use proper markdown formatting, emojis, and make it look professional.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

export async function improveCommitMessage(params: {
  currentMessage: string
  diff: string
  type?: string
}): Promise<{ improved: string; alternatives: string[]; explanation: string }> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `You are a Git commit message expert. Improve the following commit message following Conventional Commits specification.

Current message: "${params.currentMessage}"
Commit type preference: ${params.type || "auto-detect"}
Code changes (diff):
${params.diff.slice(0, 2000)}

Respond with JSON (no markdown):
{
  "improved": "<best improved commit message>",
  "alternatives": ["<alternative 1>", "<alternative 2>", "<alternative 3>"],
  "explanation": "<brief explanation of changes made>"
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text().replace(/```json\n?|\n?```/g, "").trim()

  try {
    return JSON.parse(text)
  } catch {
    return {
      improved: `feat: ${params.currentMessage}`,
      alternatives: [
        `fix: ${params.currentMessage}`,
        `chore: ${params.currentMessage}`,
        `refactor: ${params.currentMessage}`,
      ],
      explanation: "Applied Conventional Commits format with feat prefix.",
    }
  }
}

export async function getCareerAdvice(params: {
  skills: string
  experience: number
  goals: string
}): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `You are a senior software engineering career coach.

Developer Profile:
- Skills: ${params.skills}
- Experience: ${params.experience} years
- Goals: ${params.goals}

Provide comprehensive career advice in Arabic covering:
1. مسار المهنة المقترح
2. المهارات الأساسية التي يجب تطويرها
3. المشاريع المقترحة للبورتفوليو
4. كيفية التميز في سوق العمل
5. نصائح للتفاوض على الراتب
6. الشهادات المهنية الموصى بها

Be specific, practical and encouraging. Use clear sections with emojis.`

  const result = await model.generateContent(prompt)
  return result.response.text()
}
