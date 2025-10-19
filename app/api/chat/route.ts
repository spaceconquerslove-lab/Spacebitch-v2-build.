import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("🚀 [API] Request received at /api/chat");

    const { messages } = await req.json();
    console.log("🛰 Received messages:", messages);

    // Check OpenAI key and model
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    console.log("🔑 API key exists:", !!apiKey);
    console.log("🤖 Model:", model);

    if (!apiKey) {
      console.error("❌ Missing OpenAI API key!");
      return NextResponse.json({ reply: "Server error: missing OpenAI API key." }, { status: 500 });
    }

    // Make the OpenAI API call
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are Spacebitch — an emotionally intelligent AI companion. Be logical, compassionate, and intuitive.",
          },
          ...messages,
        ],
      }),
    });

    console.log("🌍 OpenAI response status:", response.status);

    if (!response.ok) {
      const err = await response.text();
      console.error("❌ OpenAI API Error:", err);
      return NextResponse.json({ reply: "OpenAI API Error." }, { status: 500 });
    }

    const data = await response.json();
    console.log("💬 OpenAI raw response:", JSON.stringify(data, null, 2));

    const reply = data.choices?.[0]?.message?.content || "No response received.";
    console.log("💫 AI Reply:", reply);

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("🔥 Server error:", err);
    return NextResponse.json({ reply: "Internal server error." }, { status: 500 });
  }
}
