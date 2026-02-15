"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

export default function ChatView() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch("/api/chat-history")
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []));
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const response = await fetch("/api/chat-send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    if (response.ok) {
      const data = await response.json();
      setMessages([...messages, { role: "user", content: input, timestamp: data.timestamp }]);
      setInput("");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6 h-[600px] flex flex-col"
      >
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-hide">
          {messages.length === 0 ? (
            <div className="text-center text-neutral-400 mt-20">No messages yet</div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] p-4 rounded-2xl ${
                    msg.role === "user" ? "bg-blue-500/20 text-blue-100" : "bg-white/5 text-neutral-100"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="text-xs text-neutral-500 mt-1 block">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button
            onClick={handleSend}
            className="p-3 rounded-2xl bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
