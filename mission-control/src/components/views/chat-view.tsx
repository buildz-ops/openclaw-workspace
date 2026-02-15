"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import MissionPageHeader from "@/components/mission/mission-page-header";
import MissionPanel from "@/components/mission/mission-panel";
import MissionPill from "@/components/mission/mission-pill";
import { fetchMission } from "@/lib/fetch-mission";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

interface ChatSendPayload {
  accepted: boolean;
  assistant?: string;
  model?: string;
}

function formatClock(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string>("");
  const [modelLabel, setModelLabel] = useState<string>("");
  const listRef = useRef<HTMLDivElement>(null);

  const loadHistory = useCallback(async () => {
    const history = await fetchMission<{ messages: ChatMessage[] }>("/api/chat-history");
    setMessages(history.data.messages);
  }, []);

  useEffect(() => {
    loadHistory().catch(() => setMessages([]));

    const poller = setInterval(() => {
      loadHistory().catch(() => undefined);
    }, 20000);

    return () => clearInterval(poller);
  }, [loadHistory]);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    node.scrollTop = node.scrollHeight;
  }, [messages, isSending]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || isSending) return;

    setIsSending(true);
    setError("");
    setInput("");

    try {
      const response = await fetch("/api/chat-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-10).map((msg) => ({ role: msg.role, content: msg.content })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as { data?: ChatSendPayload; meta?: { note?: string } };
      setModelLabel(payload?.data?.model || "");

      if (!payload?.data?.accepted || !payload?.data?.assistant) {
        setError(payload?.meta?.note || "Assistant did not return a response.");
      }

      await loadHistory();
    } catch {
      setError("Assistant is unavailable right now. Verify local model service is running.");
    } finally {
      setIsSending(false);
    }
  };

  const headerPill = useMemo(() => {
    if (isSending) return <MissionPill tone="info">Processing</MissionPill>;
    if (modelLabel) return <MissionPill tone="ok">{modelLabel}</MissionPill>;
    return <MissionPill tone="neutral">Local Model</MissionPill>;
  }, [isSending, modelLabel]);

  return (
    <div className="mc-stack mc-chat-page">
      <MissionPageHeader title="Chat" subtitle="Live operator channel // local model response stream" />

      <MissionPanel title="Session" subtitle="Real prompt/response log from workspace memory" rightSlot={headerPill} className="mc-chat-panel">
        <div className="mc-chat-session">
          <div className="mc-chat-log" ref={listRef}>
            {messages.length === 0 ? (
              <div className="mc-list-item">
                <p className="mc-list-sub">No messages yet.</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={`${msg.timestamp}-${msg.role}-${index}`}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <article
                    className={`mc-list-item mc-chat-bubble ${
                      msg.role === "user" ? "mc-chat-bubble-user" : "mc-chat-bubble-assistant"
                    }`}
                  >
                    <div className="mc-row">
                      <MissionPill tone={msg.role === "user" ? "info" : "neutral"}>{msg.role}</MissionPill>
                      <span className="mc-list-sub">{formatClock(msg.timestamp)}</span>
                    </div>
                    <p className="mc-chat-text">{msg.content}</p>
                  </article>
                </div>
              ))
            )}
          </div>

          {error ? <p className="mc-list-sub mc-chat-error">{error}</p> : null}

          <div className="mc-row mc-chat-input-row">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleSend().catch(() => undefined);
                }
              }}
              placeholder={isSending ? "Assistant is responding..." : "Send command..."}
              disabled={isSending}
              className="mc-input mc-input-plain"
            />
            <button type="button" className="mc-btn mc-btn-input" disabled={isSending} onClick={() => handleSend().catch(() => undefined)}>
              <Send size={14} />
            </button>
          </div>
        </div>
      </MissionPanel>
    </div>
  );
}
