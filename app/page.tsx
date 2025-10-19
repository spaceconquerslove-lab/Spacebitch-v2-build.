'use client'
import { useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!input.trim() || loading) return

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: input }
    ]

    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.reply }])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-6">
      <div className="space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <p>{m.content}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          className="border p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something..."
        />
        <button
          className="ml-2 px-4 py-2 bg-blue-600 text-white"
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </main>
  )
}
