
import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { CEFRLevel, Industry, UserProfile, GroundingSource } from "../types";
import { SYSTEM_INSTRUCTIONS } from "../constants";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Helper to wait for a specified delay
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Wrapper function for exponential backoff retries
async function callWithRetry<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.status === 429 || error?.code === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
    
    if (retries > 0 && isRateLimit) {
      console.warn(`Rate limit hit (429). Retrying in ${delay}ms...`);
      await wait(delay);
      // Double the delay for the next attempt (exponential backoff)
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const chatWithGemini = async (
  message: string, 
  history: { role: 'user' | 'model', content: string }[],
  userProfile: UserProfile
) => {
  return callWithRetry(async () => {
    const ai = getAI();
    const context = `User Context: Level ${userProfile.level}, Industry ${userProfile.industry}, Name ${userProfile.name}. Current Streak: ${userProfile.streak}.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history.map(h => ({ role: h.role, parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: `${context}\n\n${message}` }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTIONS,
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "Entschuldigung, ich habe das nicht verstanden.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const urls: GroundingSource[] = groundingChunks
      .map((chunk: any) => {
        if (chunk.web) {
          return { uri: chunk.web.uri, title: chunk.web.title };
        }
        return null;
      })
      .filter((v): v is GroundingSource => v !== null);

    return { text, urls };
  });
};

export const explainGrammarDeep = async (topic: string, level: CEFRLevel) => {
  return callWithRetry(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ parts: [{ text: `Explain the German grammar topic: "${topic}" for a ${level} student in detail.` }] }],
      config: {
        systemInstruction: "You are an expert German linguist. Use deep thinking to provide a clear, structured breakdown.",
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });
    return response.text;
  });
};

export const generateSpeech = async (text: string) => {
  return callWithRetry(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  });
};

export const analyzeAudioInput = async (base64Audio: string, userProfile: UserProfile, mimeType: string = 'audio/webm', contextPhrase?: string) => {
  return callWithRetry(async () => {
    const ai = getAI();
    
    const prompt = `
      You are an expert German Phonetics and Grammar coach. 
      Analyze the provided audio of a student at CEFR Level ${userProfile.level}.
      ${contextPhrase ? `The student was likely responding to or repeating: "${contextPhrase}"` : "Analyze the student's general spoken German."}
      
      Please provide a structured diagnostic feedback including:
      1. **Conjugation Accuracy**: Did the verb endings match the subjects?
      2. **Consonant Clarity**: Specific check on German sounds like "ch", "sch", "r", "z", and "st/sp".
      3. **Intonation & Word Stress**: Is the melody of the sentence correct? Is the stress on the right syllable?
      4. **Transcription**: What exactly did you hear them say?
      
      Use a supportive, gamified tone. Award XP in your response if they did a good job!
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Audio
            }
          },
          { text: prompt }
        ]
      }
    });
    return response.text;
  });
};
