import { useState, useRef, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      message: "Hi 👋 I am your AI assistant",
    },
  ]);

  const [input, setInput] = useState("");
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = {
      id: crypto.randomUUID(),
      sender: "user",
      message: input,
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages([
      ...updated,
      {
        id: crypto.randomUUID(),
        sender: "bot",
        message: data.reply,
      },
    ]);
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="header">
          🤖 AI Chatbot
        </div>

        {/* Chat box */}
        <div className="chat" ref={chatRef}>
          {messages.map((m) => (
            <div
              key={m.id}
              className={`message ${m.sender}`}
            >
              {m.message}
            </div>
          ))}
        </div>

        {/* Input box */}
        <div className="inputBox">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}