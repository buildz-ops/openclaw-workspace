"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("mission-control-chat");
    if (stored) {
      const parsed = JSON.parse(stored);
      setMessages(parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("mission-control-chat", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Message received. This is a demo response from the assistant.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="px-8 py-6 border-b border-cyan-500/30">
        <h1 className="text-mono-upper text-2xl tracking-widest text-mission-cyan">
          CHAT
        </h1>
        <p className="text-mission-text-secondary text-xs tracking-wide mt-1">
          Direct communication channel
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-mission-text-secondary text-sm mt-12">
            NO MESSAGES. START A CONVERSATION.
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] glass-panel rounded-sm p-4 ${
                msg.role === "user" 
                  ? "bg-mission-cyan/10 border-mission-cyan/30" 
                  : "bg-mission-card-bg border-cyan-500/30"
              }`}
            >
              <div className="text-xs text-mission-text-secondary mb-2 text-mono-upper tracking-wider">
                {msg.role === "user" ? "USER" : "ASSISTANT"} • {msg.timestamp.toLocaleTimeString()}
              </div>
              <div className="text-mission-text-primary">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass-panel rounded-sm p-4 border-cyan-500/30">
              <div className="text-mission-cyan text-mono-upper text-xs tracking-wider">
                PROCESSING...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-8 py-6 border-t border-cyan-500/30">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="TYPE MESSAGE..."
            className="flex-1 glass-panel rounded-sm px-4 py-3 text-mission-text-primary placeholder:text-mission-text-secondary/50 focus:outline-none focus:border-mission-cyan/50 bg-mission-card-bg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="glass-panel rounded-sm px-6 py-3 text-mission-cyan hover:bg-mission-cyan/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
