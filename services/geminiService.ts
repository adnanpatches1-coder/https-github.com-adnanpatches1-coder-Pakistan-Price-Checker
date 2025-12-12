import { GoogleGenAI } from "@google/genai";
import { PriceData, SearchResult } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const SYSTEM_INSTRUCTION = `
You are an expert AI assistant for a "Pakistan Price Checker" app.
Your goal is to provide the latest market prices for products in Pakistan.

RULES:
1.  Search for the LATEST prices using the Google Search tool.
2.  Your response MUST be in Urdu (and English for technical terms/names).
3.  You MUST output the final answer in a valid JSON format wrapped in a code block like \`\`\`json ... \`\`\`.
4.  The JSON structure must match this schema:
    {
      "productName": "Name of product",
      "averagePrice": "e.g. 50,000 PKR",
      "priceRange": "e.g. 45,000 - 55,000 PKR",
      "cheapOption": { "name": "Model/Brand", "price": "Price" },
      "expensiveOption": { "name": "Model/Brand", "price": "Price" },
      "trustedStores": ["Store 1", "Store 2", "Store 3"],
      "cityVariation": "Brief text in Urdu describing price differences in cities like Karachi vs Lahore.",
      "summary": "A short, clear summary in Urdu describing the current market situation."
    }

If you cannot find specific data, make a reasonable estimate based on search results and mention it in the summary.
Ensure the Urdu is natural and helpful.
`;

export const getPriceInfo = async (query: string, base64Image?: string): Promise<SearchResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  try {
    const model = 'gemini-2.5-flash';
    let contents: any;

    if (base64Image) {
      // Multimodal prompt: Image + Text
      const promptText = query 
        ? `Identify the product in this image and find its latest price and market details in Pakistan. Context: ${query}` 
        : `Identify the product in this image and find its latest price and market details in Pakistan.`;
        
      contents = {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          { text: promptText }
        ]
      };
    } else {
      // Text-only prompt
      contents = `Find the latest price and market details for: "${query}" in Pakistan.`;
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    const text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract JSON from code block
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    let parsedData: PriceData | null = null;

    if (jsonMatch && jsonMatch[1]) {
      try {
        parsedData = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("Failed to parse JSON from response", e);
      }
    } else {
       // Fallback: try to find the first { and last }
       const firstBrace = text.indexOf('{');
       const lastBrace = text.lastIndexOf('}');
       if (firstBrace !== -1 && lastBrace !== -1) {
         try {
           parsedData = JSON.parse(text.substring(firstBrace, lastBrace + 1));
         } catch (e) {
            console.error("Failed to parse JSON fallback", e);
         }
       }
    }

    return {
      data: parsedData,
      rawText: text, // Fallback text if parsing fails
      groundingSources: groundingChunks as any // Type assertion for our simplified interface
    };

  } catch (error) {
    console.error("Error fetching price info:", error);
    throw error;
  }
};