import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message, ModelId } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not set");
  }
  return new GoogleGenerativeAI(apiKey);
};

export const streamChatResponse = async (
  messages: Message[],
  modelId: ModelId,
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    const genAI = getClient();
    
    // Get the generative model
    const model = genAI.getGenerativeModel({ 
      model: modelId,
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    // Transform messages to Gemini format
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });

    const lastMessage = messages[messages.length - 1].text;
    
    // Stream the response
    const result = await chat.sendMessageStream(lastMessage);

    let fullText = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        fullText += chunkText;
        onChunk(fullText);
      }
    }
    
    return fullText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
