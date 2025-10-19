import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { systemPrompt } from "@/lib/persona";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];

    const userMessages = messages
      .filter((m: any) => m?.role === "user")
      .map((m: any) => ({ role: "user" as const, content: m.content }));

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        ...userMessages,
      ],
      temperature: 0.8,
      presence_penalty: 0.2,
      frequency_penalty: 0.2,
    });

    const reply = completion.choices?.[0]?.message?.content ?? "…";
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("API error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
