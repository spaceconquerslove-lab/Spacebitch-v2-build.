import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: messages.map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  })

  const data = await response.json()
  const reply = data.choices?.[0]?.message?.content || 'No response.'

  return NextResponse.json({ reply })
}
