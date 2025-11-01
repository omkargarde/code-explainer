import OpenAI from "openai";
import { environmentVariables } from "@/Env";

export async function fetchAIResponse(
  messages: Array<OpenAI.Chat.Completions.ChatCompletionMessageParam>,
) {
  const client = new OpenAI({
    apiKey: environmentVariables.GOOGLE_GENERATIVE_AI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });

  const response = await client.chat.completions.create({
    model: "gemini-2.0-flash",
    messages,
    temperature: 0.7,
  });
  return response;
}
