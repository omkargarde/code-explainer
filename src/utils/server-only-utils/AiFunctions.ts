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
/**
 * Generate AI content from the provided messages and enforce the response structure using the given Zod schema.
 *
 * @param messages - The textual prompt or conversation to send to the model.
 * @param schema - Zod schema that the model's JSON response must conform to.
 * @returns The model's generated content result, including text and structured JSON according to `schema`.
 * @throws Error - If the API quota is exceeded (message indicates "429" or "quota").
 * @throws Error - For other errors that occur while fetching the AI response.
 */
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

/**
 * Uploads an audio file, sends it with an accompanying message to the AI model, and returns the model's textual response.
 *
 * @param audio - The audio file to upload and include as part of the AI input
 * @param message - Additional text message to send alongside the uploaded audio
 * @returns The generated response text on success, or an `Error` instance describing the failure
 */
export async function fetchAIResponseUsingAudioInput({
  audio,
  message,
}: {
  audio: File;
  message: string;
}) {
  try {
    console.log("uploading the audio file");
    const myFile = await ai.files.upload({
      file: audio,
      config: { mimeType: audio.type },
    });

    console.log("verifying file uri");
    if (!myFile.uri) {
      return new Error("Uploaded file uri is undefined");
    }

    console.log("verifying file mime type");
    if (!myFile.mimeType) {
      return new Error("Uploaded mimeType uri is undefined");
    }

    console.log("generating feedback based on audio answer");
    return await ai.models.generateContent({
      model: MODELS.gemini_flash_lite_preview,
      contents: createUserContent([
        createPartFromUri(myFile.uri, myFile.mimeType),
        message,
      ]),
    });
  } catch (error) {
    console.error("Error in fetchAIResponseUsingAudioInput:", error);
    return new Error("Error in fetchAIResponseUsingAudioInput:", {
      cause: error,
    });
  }
}
