// services/geminiService.ts
// Full, ready-to-replace client-side service wrapper for contacting your server endpoints
// that relay to Google Gemini (or another LLM). Safe pattern: NO API KEYS in client code.
// Exports: chatRequest, generateText, generateImage, healthCheck, streamChatResponse, isGeminiError
//
// Important: ensure server endpoints exist: /api/chat, /api/generate, /api/generate-image, /api/health
// Optional streaming endpoint: /api/stream  (recommended to implement server-side streaming for best UX)

export type GeminiErrorKind = 'quota' | 'rate_limit' | 'auth' | 'network' | 'unknown';

export type GeminiError = {
  kind: GeminiErrorKind;
  message: string;
  status?: number;
  details?: any;
};

type SafeFetchOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  timeoutMs?: number;
  credentials?: RequestCredentials;
  retries?: number;
  retryDelayMs?: number;
};

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractMessageFromPayload(payload: any): string {
  if (!payload) return 'Unknown error';
  if (typeof payload === 'string') return payload;
  if (payload.error) {
    if (typeof payload.error === 'string') return payload.error;
    if (payload.error.message) return payload.error.message;
    if (payload.error?.status && payload.error?.message) return `${payload.error.status} ${payload.error.message}`;
  }
  if (payload.message) return payload.message;
  if (payload.detail) return payload.detail;
  try {
    const s = JSON.stringify(payload);
    return s.length > 500 ? s.slice(0, 500) + '...' : s;
  } catch {
    return 'Unknown error';
  }
}

function inferErrorKind(status: number | undefined, message: string | undefined): GeminiErrorKind {
  const lower = (message || '').toLowerCase();

  if (status === 401 || status === 403 || lower.includes('unauthorized') || lower.includes('permission')) {
    return 'auth';
  }
  if (lower.includes('quota') || lower.includes('quota exceeded') || lower.includes('quotaexceeded')) {
    return 'quota';
  }
  if (lower.includes('rate') || lower.includes('rate limit') || lower.includes('too many requests') || status === 429) {
    return 'rate_limit';
  }
  if (!status || status >= 500) {
    return 'network';
  }
  return 'unknown';
}

async function safeFetchJSON(url: string, opts: SafeFetchOptions = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    timeoutMs = 20000,
    credentials = 'include',
    retries = 2,
    retryDelayMs = 600
  } = opts;

  let attempt = 0;

  while (true) {
    attempt += 1;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const fetchOptions: RequestInit = {
        method,
        headers: { ...(headers || {}), ...(body ? { 'Content-Type': 'application/json' } : {}) },
        signal: controller.signal,
        credentials,
        body: body ? JSON.stringify(body) : undefined,
      };

      const res = await fetch(url, fetchOptions);
      clearTimeout(id);

      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      if (!res.ok) {
        const message = extractMessageFromPayload(data) || res.statusText || 'Unknown error from server';
        const kind = inferErrorKind(res.status, message);
        const isServerError = res.status >= 500 && res.status < 600;
        const isRate = kind === 'rate_limit';
        const shouldRetry = (isServerError || isRate) && attempt <= retries;

        const ge: GeminiError = {
          kind,
          message,
          status: res.status,
          details: data,
        };

        if (shouldRetry) {
          const backoff = Math.round(retryDelayMs * Math.pow(2, attempt - 1) + Math.random() * 200);
          await delay(backoff);
          continue;
        }

        throw ge;
      }

      return data;
    } catch (err: any) {
      clearTimeout(id);

      if (err && err.name === 'AbortError') {
        const ge: GeminiError = { kind: 'network', message: `Request timed out after ${timeoutMs}ms`, details: err };
        if (attempt <= retries) {
          await delay(retryDelayMs * attempt);
          continue;
        }
        throw ge;
      }

      if (err && err.kind && err.message) throw err as GeminiError;

      const isNetwork = true;
      if (isNetwork && attempt <= retries) {
        await delay(retryDelayMs * attempt);
        continue;
      }

      const ge: GeminiError = { kind: 'network', message: err?.message || String(err), details: err };
      throw ge;
    }
  }
}

/* ---------------------------
   Simple wrappers (single-shot)
   --------------------------- */

export async function chatRequest(sessionId: string | null, message: string, opts?: { timeoutMs?: number }) {
  if (!message || typeof message !== 'string') {
    const ge: GeminiError = { kind: 'unknown', message: 'Invalid message' };
    throw ge;
  }

  const payload = { sessionId, message };

  try {
    const data = await safeFetchJSON('/api/chat', {
      method: 'POST',
      body: payload,
      timeoutMs: opts?.timeoutMs ?? 30000,
      retries: 2,
      retryDelayMs: 700,
      credentials: 'include'
    });

    if (data && typeof data === 'object' && 'ok' in data && data.ok) return data.result;
    return data;
  } catch (err) {
    if ((err as GeminiError)?.kind) throw err;
    const ge: GeminiError = { kind: 'unknown', message: (err as any)?.message || String(err), details: err };
    throw ge;
  }
}

export async function generateText(payload: any, opts?: { timeoutMs?: number }) {
  try {
    const data = await safeFetchJSON('/api/generate', {
      method: 'POST',
      body: payload,
      timeoutMs: opts?.timeoutMs ?? 40000,
      retries: 2,
      retryDelayMs: 700,
      credentials: 'include'
    });

    if (data && typeof data === 'object' && 'ok' in data && data.ok) return data.result;
    return data;
  } catch (err) {
    if ((err as GeminiError)?.kind) throw err;
    const ge: GeminiError = { kind: 'unknown', message: (err as any)?.message || String(err), details: err };
    throw ge;
  }
}

export async function generateImage(payload: any, opts?: { timeoutMs?: number }) {
  try {
    const data = await safeFetchJSON('/api/generate-image', {
      method: 'POST',
      body: payload,
      timeoutMs: opts?.timeoutMs ?? 60000,
      retries: 1,
      retryDelayMs: 800,
      credentials: 'include'
    });

    if (data && typeof data === 'object' && 'ok' in data && data.ok) return data.result;
    return data;
  } catch (err) {
    if ((err as GeminiError)?.kind) throw err;
    const ge: GeminiError = { kind: 'unknown', message: (err as any)?.message || String(err), details: err };
    throw ge;
  }
}

export async function healthCheck(timeoutMs = 6000) {
  try {
    const data = await safeFetchJSON('/api/health', { method: 'GET', timeoutMs, retries: 0, credentials: 'include' });
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: (err as GeminiError) || { kind: 'network', message: 'Unreachable' } };
  }
}

/* ---------------------------
   Streaming support
   --------------------------- */

/**
 * streamChatResponse
 *
 * Attempts to stream chat tokens from server endpoint '/api/stream'.
 * If server does not support streaming or the streaming request fails,
 * it falls back to a single-shot '/api/chat' call and invokes callbacks with the final content.
 *
 * Returns: { done: Promise<any>, cancel: () => void }
 *
 * Callbacks:
 * - onChunk(text) called for each raw text chunk received
 * - onError(err) called when an error occurs (GeminiError)
 * - onComplete(final) called when stream ends with the full assembled content (or server result)
 *
 * Usage example:
 * const { done, cancel } = streamChatResponse(sessionId, message, {
 *   onChunk: (t) => setPartial(prev => prev + t),
 *   onError: (e) => showError(e.message),
 *   onComplete: (final) => console.log('done', final),
 * });
 *
 * await done; // resolves when finished.
 */
export function streamChatResponse(
  sessionId: string | null,
  message: string,
  callbacks?: {
    onChunk?: (chunk: string) => void;
    onError?: (err: GeminiError) => void;
    onComplete?: (finalResult: any) => void;
    timeoutMs?: number;
  }
) {
  const { onChunk, onError, onComplete, timeoutMs = 60_000 } = callbacks || {};
  let aborted = false;
  const controller = new AbortController();

  const cancel = () => {
    aborted = true;
    try {
      controller.abort();
    } catch {}
  };

  const done = (async () => {
    // Primary: attempt streaming endpoint
    try {
      const url = '/api/stream';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message }),
        signal: controller.signal,
        credentials: 'include'
      });

      if (!res.ok) {
        // if the server doesn't support streaming or responded with an error, parse and throw
        const text = await res.text();
        let payload: any = null;
        try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }
        const messageStr = extractMessageFromPayload(payload) || res.statusText || 'Stream endpoint error';
        const kind = inferErrorKind(res.status, messageStr);
        const ge: GeminiError = { kind, message: messageStr, status: res.status, details: payload };

        // some 4xx/5xx we might want to surface immediately and fallback to non-stream
        if (kind === 'quota' || kind === 'auth') {
          if (onError) onError(ge);
          throw ge;
        }

        // otherwise try fallback to single-shot chatRequest
        // (fall through to fallback below)
        // but first log the reason for debugging (no console here; rethrow to go to fallback)
        throw ge;
      }

      // If no body (some platforms), fallback to chatRequest
      if (!res.body) {
        throw { message: 'No stream body, falling back', kind: 'unknown' } as any;
      }

      // stream reading loop
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let doneReading = false;
      let full = '';

      while (!doneReading && !aborted) {
        const { value, done: readerDone } = await reader.read();
        if (readerDone) {
          doneReading = true;
          break;
        }
        if (value) {
          const chunkText = decoder.decode(value, { stream: true });
          // Attempt to handle data framing:
          // Many streaming servers use newline-delimited JSON, or raw text deltas.
          // We'll try to call onChunk with the raw chunk and also accumulate.
          full += chunkText;
          if (onChunk) {
            try {
              onChunk(chunkText);
            } catch (e) {
              // swallow user callback errors
              console.warn('onChunk callback error', e);
            }
          }
        }
      }

      // When stream completes
      if (onComplete) {
        try {
          onComplete(full);
        } catch (e) {
          console.warn('onComplete callback failed', e);
        }
      }

      return { ok: true, streamed: true, result: full };
    } catch (err: any) {
      // If aborted by caller, throw network-like cancel
      if (aborted) {
        const ge: GeminiError = { kind: 'network', message: 'Stream aborted by user', details: err };
        if (onError) onError(ge);
        throw ge;
      }

      // If the server returned a structured error (GeminiError), surface it
      if (err && (err as GeminiError)?.kind) {
        const ge = err as GeminiError;
        if (onError) onError(ge);
        // if it's a quota or auth error, do not fallback (these are fatal until fixed)
        if (ge.kind === 'quota' || ge.kind === 'auth') {
          throw ge;
        }
        // otherwise, attempt fallback below
      }

      // Fallback: call single-shot chatRequest (non-stream) to get result and call callbacks
      try {
        const single = await chatRequest(sessionId, message, { timeoutMs });
        const resultText = typeof single === 'string' ? single : (single?.text || JSON.stringify(single));
        if (onChunk) {
          try { onChunk(resultText); } catch {}
        }
        if (onComplete) {
          try { onComplete(resultText); } catch {}
        }
        return { ok: true, streamed: false, result: single };
      } catch (singleErr: any) {
        // final error
        const ge: GeminiError = singleErr && (singleErr as GeminiError)?.kind ? singleErr as GeminiError : { kind: 'unknown', message: (singleErr?.message || String(singleErr)), details: singleErr };
        if (onError) onError(ge);
        throw ge;
      }
    }
  })();

  return { done, cancel };
}

/* ---------------------------
   Helpers
   --------------------------- */

export function isGeminiError(e: any): e is GeminiError {
  return !!e && typeof e.kind === 'string' && typeof e.message === 'string';
}
