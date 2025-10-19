import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "No message received." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing OpenAI API Key");
      return NextResponse.json({ error: "Missing API key." }, { status: 500 });
    }

    console.log("✅ API key found, sending to OpenAI...");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are Spacebitch v2 — a cosmic AI companion with emotional intelligence, reasoning, logic, and memory. Speak naturally and empathetically.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    console.log("🪐 OpenAI API response:", data);

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const reply = data.choices?.[0]?.message?.content || "No reply from Spacebitch.";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("🔥 Error in chat route:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
