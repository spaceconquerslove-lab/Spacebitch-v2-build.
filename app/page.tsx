"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: newMessages }),
  cache: "no-store",
});

      if (!res.ok) {
        const errText = await res.text();
        console.error("Server error:", errText);
        setMessages([...newMessages, { role: "assistant", content: "Server error." }]);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply || "No response." }]);
    } catch (err) {
      console.error("Network error:", err);
      setMessages([...newMessages, { role: "assistant", content: "Network error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        backgroundColor: "black",
        color: "white",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "monospace",
      }}
    >
      <h1>Spacebitch v2</h1>

      <div style={{ width: "90%", maxWidth: 400 }}>
        {messages.map((msg, i) => (
          <p key={i}>
            <strong>{msg.role === "user" ? "You: " : "AI: "}</strong>
            {msg.content}
          </p>
        ))}

        {loading && <p>Typing...</p>}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something..."
          style={{
            width: "80%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #444",
            backgroundColor: "#222",
            color: "white",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: "8px",
            padding: "8px 16px",
            borderRadius: "6px",
            backgroundColor: "#ff00ff",
            border: "none",
            color: "white",
          }}
        >
          Send
        </button>
      </div>
    </main>
  );
}
