import {
  GoogleGenAI,
  createPartFromUri,
  createUserContent,
} from "@google/genai";
import z from "zod";
import { ENV } from "@/Env";
import { FORMAT_CONFIG, MODELS } from "@/constants/constants";

const ai = new GoogleGenAI({
  apiKey: ENV.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function fetchAIResponse(messages: string, schema: z.ZodSchema) {
  try {
    return await ai.models.generateContent({
      model: MODELS.gemini_flash_lite_preview,
      contents: messages,
      config: {
        responseMimeType: FORMAT_CONFIG.json.type,
        responseJsonSchema: z.toJSONSchema(schema),
      },
    });
  } catch (error) {
    console.error("Error in fetchAIResponse:", error);
    if (error instanceof Error) {
      if (error.message.includes("429") || error.message.includes("quota")) {
        throw new Error(
          "API quota exceeded. Please try again later or check your billing details.",
        );
      }
      throw error;
    }
    throw new Error("An unknown error occurred while fetching AI response.");
  }
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
      model: MODELS.gemini_flash_lite_preview,
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
