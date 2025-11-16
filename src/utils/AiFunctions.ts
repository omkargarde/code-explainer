import {
  GoogleGenAI,
  createPartFromUri,
  createUserContent,
} from "@google/genai";
import { ENV } from "@/Env";
import { MODELS } from "@/constants/constants";

const ai = new GoogleGenAI({
  apiKey: ENV.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function fetchAIResponse(messages: string) {
  return await ai.models.generateContent({
    model: MODELS.flash_lite_preview,
    contents: messages,
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
    if (error instanceof Error) return Error("something went wrong");
    else return Error("something went wrong");
  }
}
