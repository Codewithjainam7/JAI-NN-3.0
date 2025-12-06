import { GoogleGenAI } from "@google/genai";
import { Message, ModelId } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// We initialize the client per request to ensure we can swap keys if needed in future features
// API key must be obtained from process.env.API_KEY
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const streamChatResponse = async (
  messages: Message[],
  modelId: ModelId,
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    const ai = getClient();
    
    // Transform messages to Gemini format
    // We only take the last few messages to manage context window if needed, 
    // but for now we send the history.
    // Note: The first message should ideally be the system instruction, but 
    // the SDK handles systemInstruction separately in config.
    
    const contents = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const chat = ai.chats.create({
      model: modelId,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: contents.slice(0, -1), // Everything except the last new message
    });

    const lastMessage = contents[contents.length - 1].parts[0].text;
    
    const result = await chat.sendMessageStream({
        message: lastMessage
    });

    let fullText = "";
    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }
    
    return fullText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};