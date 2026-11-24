import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { skills, experience, goals } = await req.json();

  if (!skills || !experience) {
    return NextResponse.json({ error: "Skills and experience are required" }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a senior software engineering career coach. 
    
Based on the following developer profile:
- Skills: ${skills}
- Experience: ${experience} years
- Goals: ${goals || "Advance in career and get better opportunities"}

Provide comprehensive, actionable career advice in Arabic covering:
1. مسار المهنة المقترح (3-5 سنوات)
2. المهارات الأساسية التي يجب تطويرها
3. المشاريع المقترحة لتقوية البورتفوليو
4. كيفية التميز في سوق العمل
5. نصائح للتفاوض على الراتب
6. الشهادات المهنية الموصى بها

Be specific, practical and encouraging. Format with clear sections and bullet points.`;

    const result = await model.generateContent(prompt);
    const advice = result.response.text();

    return NextResponse.json({ advice });
  } catch (error) {
    console.error("Career advice error:", error);
    return NextResponse.json({ error: "فشل في توليد النصيحة المهنية" }, { status: 500 });
  }
}
