"use server";
import { environmentVariables } from "@/Env";
import OpenAI from "openai";

// Allow streaming responses up to 30 seconds

export async function CallGemini(_initialState: any, formData: FormData) {
  const code = formData.get("code") as string;
  const language = (formData.get("language") as string) || "JavaScript";

  if (!code) {
    return { error: "Code is required." };
  }
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `you are a expert of ${language}, tasked with teaching the users.`,
    },
    {
      role: "user",
      content: `please explain this ${language ?? "JavaScript"} code in simple terms:\n\n
				\`\`\`${language}\n${code}\`\`\`
				`,
    },
  ];

  const client = new OpenAI({
    apiKey: environmentVariables.GOOGLE_GENERATIVE_AI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });

  const response = await client.chat.completions.create({
    model: "gemini-2.0-flash",
    messages,
    temperature: 0.3,
  });

  const explanation = response.choices[0]?.message;
  if (!explanation) {
    return {
      error: "Failed to generate explanation.",
    };
  }

  return {
    data: explanation,
  };
}
