// geminiService.ts
// Lightweight wrapper around the Gemini calls used by the UI.
// IMPORTANT: Do NOT embed private keys in client code. This wrapper assumes you call your own server endpoint
// (recommended) that holds credentials. If you call Google APIs from backend, adapt accordingly.

export type GeminiError = {
  kind: 'quota' | 'rate_limit' | 'auth' | 'network' | 'unknown';
  message: string;
  details?: any;
};

async function safeFetchJSON(url: string, options: RequestInit = {}) {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch (err) { data = text; }

    if (!res.ok) {
      // Try to detect common Gemini / Google error shapes
      const errMsg = (data && data.error) || (data && data.message) || data || res.statusText || 'Unknown error';
      // detect quota / rate-limit using keywords
      const lower = String(errMsg).toLowerCase();
      const isQuota = lower.includes('quota') || lower.includes('quota exceeded') || lower.includes('quotaexceeded');
      const isRate = lower.includes('rate') || lower.includes('rate limit') || lower.includes('too many requests');
      const isAuth = res.status === 401 || res.status === 403 || lower.includes('unauthorized') || lower.includes('permission');

      const kind: GeminiError['kind'] = isQuota ? 'quota' : isRate ? 'rate_limit' : isAuth ? 'auth' : res.status >= 500 ? 'network' : 'unknown';

      const ge: GeminiError = { kind, message: String(errMsg).slice(0, 200), details: data };
      throw ge;
    }

    return data;
  } catch (e: any) {
    // If error is our typed GeminiError, rethrow; otherwise wrap as network/unknown
    if (e && e.kind) throw e;
    const ge: GeminiError = { kind: 'network', message: e?.message || String(e), details: e };
    throw ge;
  }
}

/**
 * Example: call to backend chat endpoint that relays requests to Gemini.
 * You should point this to your own server endpoint (not directly to Google from client).
 */
export async function generateText(payload: any) {
  // Example: `/api/generate` should be implemented server-side to call Google Gemini
  const url = '/api/generate';
  try {
    const resp = await safeFetchJSON(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    return resp;
  } catch (err) {
    // Re-throw structured error so UI can present it. Keep stack/inner details out of user view.
    throw err;
  }
}

/**
 * Chat-style streaming or single-shot wrapper. Point to your implementation.
 */
export async function chatRequest(sessionId: string, message: string) {
  const url = `/api/chat`;
  try {
    const resp = await safeFetchJSON(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message }),
      credentials: 'include'
    });
    return resp;
  } catch (err) {
    throw err;
  }
}
