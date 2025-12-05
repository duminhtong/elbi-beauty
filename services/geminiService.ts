import { GoogleGenAI, Type } from "@google/genai";
import { ServiceItem } from "../types";

const apiKey = process.env.API_KEY;

// Initialize globally, checking if key exists
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const searchServicesWithAI = async (
  query: string,
  services: ServiceItem[]
): Promise<string[]> => {
  if (!ai) {
    console.warn("Gemini API Key missing, falling back to empty result");
    return [];
  }

  // Optimize payload: only send necessary fields to save tokens
  const serviceContext = services.map(s => ({
    id: s.id,
    name: s.name,
    category: s.category,
    description: s.description,
    price: s.price
  }));

  const prompt = `
    Bạn là trợ lý AI của một tiệm nail. 
    Khách hàng đang tìm kiếm: "${query}".
    
    Dưới đây là danh sách dịch vụ hiện có:
    ${JSON.stringify(serviceContext)}

    Hãy phân tích ý định của khách hàng và trả về danh sách các ID của dịch vụ phù hợp nhất.
    Nếu khách hàng hỏi về giá (ví dụ: "dưới 200k"), hãy lọc theo giá.
    Nếu khách hàng hỏi về vấn đề (ví dụ: "tay khô"), hãy tìm dịch vụ giải quyết vấn đề đó.
    Sắp xếp độ ưu tiên từ cao xuống thấp.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedServiceIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    const parsed = JSON.parse(jsonText);
    return parsed.recommendedServiceIds || [];

  } catch (error) {
    console.error("AI Search Error:", error);
    return [];
  }
};