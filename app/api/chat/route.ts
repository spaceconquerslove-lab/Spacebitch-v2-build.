import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    console.log("🛰 Received message:", message);

    if (!message) {
      return NextResponse.json({ error: "No message received." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("❌ No API key found in environment.");
      return NextResponse.json({ error: "Missing API key." }, { status: 500 });
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    console.log("🚀 Using model:", model);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are Spacebitch v2, a cosmic AI companion with emotional intelligence and reasoning.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    console.log("💫 OpenAI response:", data);

    if (data.error) {
      console.error("🔥 OpenAI error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const reply = data.choices?.[0]?.message?.content || "No reply from Spacebitch.";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("💥 Server error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
