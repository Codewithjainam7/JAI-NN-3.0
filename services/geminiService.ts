import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message, ModelId } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

export type GeminiErrorKind = 'quota' | 'rate_limit' | 'auth' | 'network' | 'unknown';

export type GeminiError = {
  kind: GeminiErrorKind;
  message: string;
  status?: number;
  details?: any;
};

function convertMessagesToGemini(messages: Message[]) {
  return messages.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));
}

function handleGeminiError(error: any): GeminiError {
  const message = error?.message || String(error);
  let kind: GeminiErrorKind = 'unknown';
  
  if (message.includes('API_KEY') || message.includes('401') || message.includes('403')) {
    kind = 'auth';
  } else if (message.includes('quota') || message.includes('429')) {
    kind = 'quota';
  } else if (message.includes('rate limit')) {
    kind = 'rate_limit';
  } else if (message.includes('fetch') || message.includes('network')) {
    kind = 'network';
  }
  
  return { kind, message, details: error };
}

export async function streamChatResponse(
  messages: Message[],
  modelId: ModelId,
  onChunk: (text: string) => void
) {
  if (!genAI) {
    throw handleGeminiError(new Error('Gemini API not configured. Please add VITE_GEMINI_API_KEY to your .env.local file'));
  }

  try {
    const model = genAI.getGenerativeModel({ model: modelId });
    const history = convertMessagesToGemini(messages.slice(0, -1));
    const lastMessage = messages[messages.length - 1].text;

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(lastMessage);

    let fullText = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      onChunk(fullText);
    }

    return fullText;
  } catch (error: any) {
    throw handleGeminiError(error);
  }
}

export function isGeminiError(e: any): e is GeminiError {
  return !!e && typeof e.kind === 'string' && typeof e.message === 'string';
}
