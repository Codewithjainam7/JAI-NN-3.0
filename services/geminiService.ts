// services/geminiService.ts
// Client-side wrapper — NO server SDKs or keys here. Calls server endpoints /api/stream and /api/chat.

export type GeminiErrorKind = 'quota' | 'rate_limit' | 'auth' | 'network' | 'unknown';
export type GeminiError = { kind: GeminiErrorKind; message: string; status?: number; details?: any };

async function safeJsonResponse(res: Response) {
  const txt = await res.text();
  try { return JSON.parse(txt); } catch { return txt; }
}

function inferKindFromMessage(msg = '', status?: number): GeminiErrorKind {
  const lower = (msg || '').toLowerCase();
  if (status === 401 || status === 403 || lower.includes('unauthorized') || lower.includes('permission')) return 'auth';
  if (lower.includes('quota') || lower.includes('quota exceeded')) return 'quota';
  if (lower.includes('rate') || status === 429) return 'rate_limit';
  if (!status || status >= 500) return 'network';
  return 'unknown';
}

/**
 * Attempt to stream via /api/stream. If it returns non-2xx or no body, fallback to /api/chat.
 * messages: Message[] (your App passes [...messages, userMsg])
 * modelId: string (passed but forwarded to server)
 * onChunk: called with text chunks (or full text on fallback)
 */
export function streamChatResponse(
  messages: any[],
  modelId: string,
  onChunk: (text: string) => void,
  opts?: { timeoutMs?: number }
) {
  let aborted = false;
  const controller = new AbortController();

  const cancel = () => {
    aborted = true;
    try { controller.abort(); } catch {}
  };

  const done = (async () => {
    // Primary: attempt streaming endpoint which should stream chunks (if your server supports it)
    try {
      const res = await fetch('/api/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, modelId }),
        signal: controller.signal,
        credentials: 'include'
      });

      if (!res.ok) {
        const payload = await safeJsonResponse(res);
        const message = (payload && (payload.error || payload.message)) || res.statusText || 'Stream error';
        const kind = inferKindFromMessage(String(message), res.status);
        const err: GeminiError = { kind, message: String(message), status: res.status, details: payload };
        // If quota/auth, surface without fallback (fatal until fixed)
        if (err.kind === 'quota' || err.kind === 'auth') throw err;
        // otherwise fallthrough to fallback
        throw err;
      }

      // If response has no body, fallback
      if (!res.body) throw new Error('No streaming body, falling back to non-stream endpoint');

      // Read stream chunks and call onChunk with raw chunk text
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { value, done: readerDone } = await reader.read();
        if (readerDone) break;
        if (value) {
          const textChunk = decoder.decode(value, { stream: true });
          full += textChunk;
          try { onChunk(textChunk); } catch (e) { console.warn('onChunk callback error', e); }
        }
      }

      return { ok: true, streamed: true, result: full };
    } catch (err: any) {
      if (aborted) {
        const ge: GeminiError = { kind: 'network', message: 'Stream aborted by user', details: err };
        throw ge;
      }

      // If error was quota/auth from server, rethrow so UI can show proper banner
      if (err && (err as GeminiError)?.kind) {
        throw err;
      }

      // Fallback to non-streaming /api/chat
      try {
        const res2 = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages, modelId }),
          signal: controller.signal,
          credentials: 'include'
        });

        if (!res2.ok) {
          const payload = await safeJsonResponse(res2);
          const message = (payload && (payload.error || payload.message)) || res2.statusText || 'Chat endpoint error';
          const kind = inferKindFromMessage(String(message), res2.status);
          const ge: GeminiError = { kind, message: String(message), status: res2.status, details: payload };
          throw ge;
        }

        const data = await safeJsonResponse(res2);
        // server should return { ok: true, result: "...text..." } or just text
        const final = (data && data.ok && data.result) ? data.result : (data?.result ?? data);
        const text = typeof final === 'string' ? final : JSON.stringify(final);
        try { onChunk(text); } catch (e) {}
        return { ok: true, streamed: false, result: final };
      } catch (finalErr: any) {
        // Normalize and rethrow
        const ge: GeminiError = (finalErr && finalErr.kind) ? finalErr : { kind: 'unknown', message: finalErr?.message || String(finalErr), details: finalErr };
        throw ge;
      }
    }
  })();

  return { done, cancel };
}

export function isGeminiError(e: any): e is GeminiError {
  return !!e && typeof e.kind === 'string' && typeof e.message === 'string';
}
