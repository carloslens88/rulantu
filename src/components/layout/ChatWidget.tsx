"use client";

import { useEffect, useRef, useState } from "react";
import CircuitNode from "@/components/ui/CircuitNode";
import { ChatIcon, CloseIcon, ArrowIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/data/content";

type Message = { role: "user" | "assistant"; content: string };

type ChatWidgetProps = {
  dict: Dictionary;
};

/**
 * A small assistant grounded in RULANTU's own copy (see the system prompt
 * in worker.js), running on Workers AI — no third-party chat vendor, no
 * database, one route. It answers questions and points toward the real
 * conversion paths (booking, WhatsApp, the contact form) rather than
 * trying to close anything itself.
 */
export default function ChatWidget({ dict }: ChatWidgetProps) {
  const { chat } = dict;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, error]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? chat.closeLabel : chat.openLabel}
        aria-expanded={open}
        data-cursor="link"
        className="metal-shine fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-ink border border-paper/20 flex items-center justify-center text-signal shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden transition-transform duration-300 hover:scale-105"
      >
        {open ? <CloseIcon className="w-5 h-5" /> : <ChatIcon className="w-5 h-5" />}
      </button>

      <div
        role="dialog"
        aria-label={chat.title}
        aria-hidden={!open}
        className={`fixed bottom-24 right-6 z-40 w-[calc(100vw-3rem)] max-w-sm h-[min(32rem,70vh)] bg-ink border border-paper/15 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden origin-bottom-right transition-all duration-300 ${
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-paper/10 shrink-0">
          <CircuitNode className="w-4 h-4 text-signal shrink-0" />
          <p className="font-display font-bold text-paper truncate">{chat.title}</p>
        </div>

        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        >
          <Bubble role="assistant" text={chat.greeting} />
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role} text={m.content} />
          ))}
          {loading && <TypingDots />}
          {error && (
            <p className="text-signal text-sm px-1" role="alert">
              {chat.errorMessage}
            </p>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2 p-3 border-t border-paper/10 shrink-0"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={chat.placeholder}
            aria-label={chat.placeholder}
            className="flex-1 min-w-0 bg-transparent text-paper placeholder:text-stone text-sm outline-none px-2.5 py-2"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label={chat.send}
            data-cursor="drag"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-signal text-ink shrink-0 disabled:opacity-40 transition-opacity duration-300"
          >
            <ArrowIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </>
  );
}

function Bubble({ role, text }: { role: "user" | "assistant"; text: string }) {
  const isUser = role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <p
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-signal text-ink rounded-br-sm"
            : "bg-paper/10 text-paper rounded-bl-sm"
        }`}
      >
        {text}
      </p>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1 bg-paper/10 rounded-2xl rounded-bl-sm px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-paper/50 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
