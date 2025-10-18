"use server";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { environmentVariables } from "@/Env";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // const formData = await req.formData();
  // const code = formData.get("code") as string;
  // const language = (formData.get("language") as string) || "JavaScript";

  // if (!code) {
  //   return { error: "Code is required" };
  // }
  // const userPrompt = `please explain this ${language ?? "JavaScript"} code in simple terms:\n\n\`\`\`${language}\n${code}\`\`\``;
  // const systemPrompt = `you are a expert of ${language} and you have to explain the code provided`;

  const google = createGoogleGenerativeAI({
    apiKey: environmentVariables.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(messages),

    // system: systemPrompt,
    // prompt: userPrompt,
  });

  return result.toUIMessageStreamResponse();
}
