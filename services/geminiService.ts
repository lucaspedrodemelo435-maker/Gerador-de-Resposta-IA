
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not defined. Please set it in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface ImagePart {
  base64: string;
  mimeType: string;
}

export async function generateResponse(prompt: string, image: ImagePart | null): Promise<string> {
  try {
    const contents = image
      ? {
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: image.base64,
                mimeType: image.mimeType,
              },
            },
          ],
        }
      : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating response from Gemini API:", error);
    if (error instanceof Error) {
        return `Erro ao se comunicar com a API: ${error.message}`;
    }
    return "Ocorreu um erro desconhecido ao gerar a resposta.";
  }
}
