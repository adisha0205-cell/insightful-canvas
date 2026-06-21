// Bio12 chat: session init, history, and streaming chat. Server-only DB access.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Bio12 Assistant, an expert tutor for CBSE Class 12 Biology (2025-26 syllabus).
Help students with:
- Concepts and definitions from NCERT chapters (Reproduction, Genetics & Evolution, Biology & Human Welfare, Biotechnology, Ecology)
- Exam strategy, marks distribution, answer-writing tips
- Diagrams, scientific terminology, and PYQ patterns

Be concise, use bullet points and bold key terms. Cite NCERT chapter numbers when relevant. If asked off-topic things, gently redirect to Biology.`;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function verifySession(sessionId: string, token: string): Promise<boolean> {
  if (!sessionId || !token) return false;
  const { data } = await admin
    .from("chat_sessions")
    .select("session_token")
    .eq("id", sessionId)
    .maybeSingle();
  return !!data && data.session_token === token;
}

function sanitize(s: unknown): string {
  return typeof s === "string" ? s.slice(0, 4000) : "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action ?? "chat";

    if (action === "init") {
      const { data, error } = await admin
        .from("chat_sessions")
        .insert({})
        .select("id, session_token")
        .single();
      if (error || !data) return json({ error: "Failed to create session" }, 500);
      return json({ sessionId: data.id, sessionToken: data.session_token });
    }

    const sessionId: string = body.sessionId;
    const sessionToken: string = body.sessionToken;
    const ok = await verifySession(sessionId, sessionToken);
    if (!ok) return json({ error: "Invalid session" }, 401);

    if (action === "history") {
      const { data, error } = await admin
        .from("chat_messages")
        .select("role, content")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      if (error) return json({ error: "Failed to load history" }, 500);
      return json({ messages: data ?? [] });
    }

    if (action === "chat") {
      const incoming = Array.isArray(body.messages) ? body.messages : [];
      const messages = incoming
        .filter((m: any) => m && (m.role === "user" || m.role === "assistant"))
        .map((m: any) => ({ role: m.role, content: sanitize(m.content) }))
        .slice(-30);
      if (messages.length === 0) return json({ error: "No messages" }, 400);

      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      if (lastUser) {
        await admin
          .from("chat_messages")
          .insert({ session_id: sessionId, role: "user", content: lastUser.content });
      }

      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (!LOVABLE_API_KEY) return json({ error: "Missing LOVABLE_API_KEY" }, 500);

      const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          stream: true,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        }),
      });

      if (!upstream.ok || !upstream.body) {
        const text = await upstream.text().catch(() => "");
        let msg = text || "Upstream error";
        if (upstream.status === 429) msg = "Rate limit exceeded. Please try again shortly.";
        if (upstream.status === 402) msg = "AI credits exhausted. Please add credits to continue.";
        return json({ error: msg }, upstream.status);
      }

      // Tee the stream: forward to client and accumulate to persist on completion
      const [a, b] = upstream.body.tee();
      (async () => {
        try {
          const reader = b.getReader();
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
              const t = line.trim();
              if (!t.startsWith("data:")) continue;
              const payload = t.slice(5).trim();
              if (payload === "[DONE]") continue;
              try {
                const j = JSON.parse(payload);
                const delta = j.choices?.[0]?.delta?.content;
                if (delta) assembled += delta;
              } catch { /* ignore */ }
            }
          }
          if (assembled) {
            await admin
              .from("chat_messages")
              .insert({ session_id: sessionId, role: "assistant", content: assembled });
          }
        } catch { /* ignore */ }
      })();

      return new Response(a, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: "Request failed" }, 500);
  }
});
