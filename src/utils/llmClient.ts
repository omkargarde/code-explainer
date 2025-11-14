import OpenAI from "openai";
import { environmentVariables } from "@/Env";

export function createNewAIClient() {
  return new OpenAI({
    apiKey: environmentVariables.GOOGLE_GENERATIVE_AI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });
}

export function fetchAIResponse(
  messages: Array<OpenAI.Chat.Completions.ChatCompletionMessageParam>,
) {
  const client = createNewAIClient();

  return client.chat.completions.create({
    model: "gemini-2.0-flash",
    messages,
    temperature: 0.9,
  });
}

export async function fetchAIResponseUsingAudioInput() {
  const client = createNewAIClient();

  // get audio
  const url = "https://cdn.openai.com/API/docs/audio/alloy.wav";
  const audioResponse = await fetch(url);
  // 
  const buffer = await audioResponse.arrayBuffer();
  const base64str = Buffer.from(buffer).toString("base64");

  return await client.chat.completions.create({
    model: "gpt-4o-audio-preview",
    modalities: ["text", "audio"],
    audio: { voice: "alloy", format: "wav" },
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "What is in this recording?" },
          {
            type: "input_audio",
            input_audio: { data: base64str, format: "wav" },
          },
        ],
      },
    ],
    store: true,
  });
}
