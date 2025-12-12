// geminiService.ts
// Client-side wrapper for calling your server endpoints that relay to Google Gemini (or another LLM service).
// SAFE PATTERN: This file does NOT contain API keys. It expects server endpoints under /api/* which hold secrets.
// Replace this file in your frontend; ensure server endpoints /api/chat and /api/generate exist (see earlier /api/chat.ts example).
//
// Features:
// - Structured GeminiError type (quota, rate_limit, auth, network, unknown).
// - safeFetchJSON helper that parses JSON/text and surfaces friendly error kinds.
// - Exponential backoff retry for transient 5xx / rate-limit errors.
// - Timeout via AbortController.
// - Public methods: chatRequest, generateText, generateImage, healthCheck
//
// Usage:
// import { chatRequest, generateText } from './geminiService';
// await chatRequest(sessionId, "Hello");
// await generateText({ prompt: "Explain X", model: "text-bison-001" });
//
// NOTE: Adapt endpoint paths if your server uses different names.

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
  retries?: number; // how many retry attempts on transient errors (5xx / rate-limit)
  retryDelayMs?: number; // base delay for exponential backoff
};

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse error message candidates from server response payload
 */
function extractMessageFromPayload(payload: any): string {
  if (!payload) return 'Unknown error';
  if (typeof payload === 'string') return payload;
  if (payload.error) {
    if (typeof payload.error === 'string') return payload.error;
    if (payload.error.message) return payload.error.message;
    // google-style error object
    if (payload.error?.status && payload.error?.message) return `${payload.error.status} ${payload.error.message}`;
  }
  if (payload.message) return payload.message;
  if (payload.detail) return payload.detail;
  // fallback to JSON stringified truncated
  try {
    const s = JSON.stringify(payload);
    return s.length > 500 ? s.slice(0, 500) + '...' : s;
  } catch {
    return 'Unknown error';
  }
}

/**
 * Map textual error content or HTTP status to a GeminiErrorKind
 */
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

/**
 * Robust JSON/text fetch with timeout, retry/backoff and friendly error typing.
 */
async function safeFetchJSON(url: string, opts: SafeFetchOptions = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    timeoutMs = 20_000,
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
        // Create helpful error payload
        const message = extractMessageFromPayload(data) || res.statusText || 'Unknown error from server';
        const kind = inferErrorKind(res.status, message);

        // Determine if retryable: 5xx or rate_limit or network
        const isServerError = res.status >= 500 && res.status < 600;
        const isRate = kind === 'rate_limit';
        const shouldRetry = (isServerError || isRate) && attempt <= retries;

        const ge: GeminiError = {
          kind,
          message: message,
          status: res.status,
          details: data,
        };

        if (shouldRetry) {
          // exponential backoff with jitter
          const backoff = Math.round(retryDelayMs * Math.pow(2, attempt - 1) + Math.random() * 200);
          await delay(backoff);
          continue;
        }

        // final: throw structured error
        throw ge;
      }

      // 2xx success
      return data;
    } catch (err: any) {
      clearTimeout(id);

      // If it's an AbortError (timeout)
      if (err && err.name === 'AbortError') {
        const ge: GeminiError = { kind: 'network', message: `Request timed out after ${timeoutMs}ms`, details: err };
        if (attempt <= retries) {
          await delay(retryDelayMs * attempt);
          continue;
        }
        throw ge;
      }

      // If it's already a structured GeminiError, just rethrow
      if (err && err.kind && err.message) throw err as GeminiError;

      // For network-level errors, attempt retry if allowed
      const isNetwork = true;
      if (isNetwork && attempt <= retries) {
        await delay(retryDelayMs * attempt);
        continue;
      }

      // Otherwise wrap and throw
      const ge: GeminiError = { kind: 'network', message: err?.message || String(err), details: err };
      throw ge;
    }
  }
}

/* ---------------------------
   Public service functions
   --------------------------- */

/**
 * Chat request wrapper
 * - sessionId: a local session identifier (optional) your server can use to maintain history
 * - message: user message text
 *
 * The server endpoint /api/chat should accept { sessionId, message } and return structured JSON { ok: true, result: ... }
 */
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
      timeoutMs: opts?.timeoutMs ?? 30_000,
      retries: 2,
      retryDelayMs: 700,
      credentials: 'include'
    });

    // Normalize server response shape: if server returns { ok: true, result: {...} } return result
    if (data && typeof data === 'object' && 'ok' in data && data.ok) return data.result;
    return data;
  } catch (err) {
    // ensure thrown errors follow GeminiError shape
    if ((err as GeminiError)?.kind) throw err;
    const ge: GeminiError = { kind: 'unknown', message: (err as any)?.message || String(err), details: err };
    throw ge;
  }
}

/**
 * Generate text helper (single-shot)
 * - payload is forwarded to your server /api/generate which should call the LLM generate API
 * - payload may include prompt, model, temperature, maxOutputTokens, etc.
 */
export async function generateText(payload: any, opts?: { timeoutMs?: number }) {
  try {
    const data = await safeFetchJSON('/api/generate', {
      method: 'POST',
      body: payload,
      timeoutMs: opts?.timeoutMs ?? 40_000,
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

/**
 * Generate image (if your backend supports an image generation endpoint).
 * - payload might be { prompt: '...', style: '...' }
 * - server should return image URLs or base64 as appropriate
 */
export async function generateImage(payload: any, opts?: { timeoutMs?: number }) {
  try {
    const data = await safeFetchJSON('/api/generate-image', {
      method: 'POST',
      body: payload,
      timeoutMs: opts?.timeoutMs ?? 60_000,
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

/**
 * Optional health check to verify server and upstream API are reachable
 */
export async function healthCheck(timeoutMs = 6_000) {
  try {
    const data = await safeFetchJSON('/api/health', { method: 'GET', timeoutMs, retries: 0, credentials: 'include' });
    return { ok: true, data };
  } catch (err) {
    // return structured failure
    return { ok: false, error: (err as GeminiError) || { kind: 'network', message: 'Unreachable' } };
  }
}

/* ---------------------------
   Utility helper to surface errors for UI
   UI code can call this before displaying to users.
   Example:
     try { await chatRequest(...); } catch (e) {
       if (e.kind === 'quota') showBanner("Quota exceeded...");
     }
   --------------------------- */
export function isGeminiError(e: any): e is GeminiError {
  return !!e && typeof e.kind === 'string' && typeof e.message === 'string';
}
