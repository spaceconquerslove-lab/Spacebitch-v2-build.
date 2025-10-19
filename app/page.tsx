'use client'
import { useState } from 'react'

export default function Page() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage() {
    if (!input.trim() || loading) return
    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: '⚠️ Connection error' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white">
      <h1 className="text-2xl mb-4 font-semibold">Spacebitch v2</h1>
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-4 flex flex-col space-y-3">
        <div className="h-96 overflow-y-auto space-y-2 border border-gray-700 rounded-xl p-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-2 rounded-xl ${m.role === 'user' ? 'bg-gray-700 text-right' : 'bg-gray-800 text-left'}`}
            >
              {m.content}
            </div>
          ))}
          {loading && <div className="italic text-gray-500">Spacebitch is thinking...</div>}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-xl p-2 bg-gray-800 border border-gray-700 focus:border-purple-500 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type here..."
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 rounded-xl disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  )
}
