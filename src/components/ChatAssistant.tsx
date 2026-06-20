import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Msg = { role: "user" | "assistant"; content: string };

const SESSION_KEY = "bio12_chat_session_id";

export const ChatAssistant = () => {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize session
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let id = localStorage.getItem(SESSION_KEY);
      if (!id) {
        const { data, error } = await supabase
          .from("chat_sessions")
          .insert({})
          .select("id")
          .single();
        if (error || !data) return;
        id = data.id;
        localStorage.setItem(SESSION_KEY, id);
      }
      if (cancelled) return;
      setSessionId(id);
      const { data: msgs } = await supabase
        .from("chat_messages")
        .select("role, content")
        .eq("session_id", id)
        .order("created_at", { ascending: true });
      if (msgs && !cancelled) {
        setMessages(
          msgs
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }))
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streamText, streaming, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming || !sessionId) return;

    const userMsg: Msg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setStreaming(true);
    setStreamText("");

    // Persist user message
    supabase.from("chat_messages").insert({ session_id: sessionId, role: "user", content: text });

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Request failed" }));
        toast({ title: "Chat error", description: err.error ?? "Failed to reach assistant", variant: "destructive" });
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assembled = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              assembled += delta;
              setStreamText(assembled);
            }
          } catch {
            // ignore non-JSON keep-alive lines
          }
        }
      }

      if (assembled) {
        setMessages((prev) => [...prev, { role: "assistant", content: assembled }]);
        supabase
          .from("chat_messages")
          .insert({ session_id: sessionId, role: "assistant", content: assembled });
      }
    } catch (e) {
      toast({ title: "Chat error", description: (e as Error).message, variant: "destructive" });
    } finally {
      setStreaming(false);
      setStreamText("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-hover hover:bg-primary-mid hover:scale-105 transition-all flex items-center justify-center"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[min(92vw,400px)] h-[min(75vh,600px)] bg-card border border-border rounded-2xl shadow-hover flex flex-col overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-glow/30 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="font-display font-semibold text-sm">Bio12 Assistant</div>
              <div className="text-xs text-primary-foreground/70">Ask anything about Class 12 Biology</div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
            {messages.length === 0 && !streaming && (
              <div className="text-center text-sm text-muted-foreground py-8">
                <p className="font-medium text-foreground mb-2">👋 Hi! I'm your Biology tutor.</p>
                <p>Ask about any chapter, concept, definition, or exam tip.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "user" ? (
                  <div className="max-w-[85%] bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-3.5 py-2 text-sm">
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-[90%] text-sm text-foreground prose prose-sm max-w-none prose-headings:font-display prose-p:my-1.5 prose-ul:my-1.5 prose-strong:text-primary">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
            {streaming && (
              <div className="flex justify-start">
                <div className="max-w-[90%] text-sm text-foreground prose prose-sm max-w-none prose-p:my-1.5 prose-strong:text-primary">
                  {streamText ? (
                    <ReactMarkdown>{streamText}</ReactMarkdown>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span className="text-xs">Thinking…</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border p-3 bg-card">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                placeholder="Ask about meiosis, PCR, ecosystems…"
                className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring max-h-32"
                disabled={!sessionId}
              />
              <button
                onClick={send}
                disabled={streaming || !input.trim() || !sessionId}
                className="w-9 h-9 shrink-0 rounded-lg bg-primary text-primary-foreground hover:bg-primary-mid disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                aria-label="Send"
              >
                {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
