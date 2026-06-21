
-- Drop public policies
DROP POLICY IF EXISTS "Anyone can read chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can insert chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can create chat sessions" ON public.chat_sessions;
DROP POLICY IF EXISTS "Anyone can read chat sessions" ON public.chat_sessions;

-- Add per-session secret token (server-validated)
ALTER TABLE public.chat_sessions
  ADD COLUMN IF NOT EXISTS session_token text NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex');

-- Revoke client-side privileges; only service_role (used by edge function) can access
REVOKE ALL ON public.chat_sessions FROM anon, authenticated;
REVOKE ALL ON public.chat_messages FROM anon, authenticated;
GRANT ALL ON public.chat_sessions TO service_role;
GRANT ALL ON public.chat_messages TO service_role;

-- RLS stays enabled; with no policies, anon/authenticated have no access. service_role bypasses RLS.
