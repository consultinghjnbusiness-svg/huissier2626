import { GoogleGenerativeAI } from "@google/generative-ai";
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const generateLegalAct = async (facts: string, actType: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `Génère acte OHADA Congo: ${actType}\nFaits: ${facts}`;
  const result = await model.generateContent(prompt);
  return await result.response.text();
};
