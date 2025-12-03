import {
  GoogleGenAI,
  createPartFromUri,
  createUserContent,
} from "@google/genai";
import type { IQuestion } from "@/routes/generate/questions";
import { ENV } from "@/Env";
import { FORMAT_CONFIG, MODELS } from "@/constants/constants";

const ai = new GoogleGenAI({
  apiKey: ENV.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function fetchAIResponse(messages: string) {
  return await ai.models.generateContent({
    model: MODELS.gemini_3_pro_preview,
    contents: messages,
    config: {
      responseMimeType: FORMAT_CONFIG.json.type,
      responseJsonSchema: ,
    },
  });
}

export async function fetchAIResponseUsingAudioInput({
  audio,
  message,
}: {
  audio: File;
  message: string;
}) {
  try {
    const myFile = await ai.files.upload({
      file: audio,
      config: { mimeType: audio.type },
    });

    if (!myFile.uri) {
      return Error("Uploaded file uri is undefined");
    }
    if (!myFile.mimeType) {
      return Error("Uploaded mimeType uri is undefined");
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: createUserContent([
        createPartFromUri(myFile.uri, myFile.mimeType),
        message,
      ]),
    });

    console.log(response.text);
    return response.text;
  } catch (error) {
    console.error("Error in fetchAIResponseUsingAudioInput:", error);
    if (error instanceof Error) return error;
    return new Error(
      "An unknown error occurred while fetching AI response with audio.",
    );
  }
}
