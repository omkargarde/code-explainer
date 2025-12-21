import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { Env } from "@/Env";
import { LLM_MODELS } from "@/constants/constants";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = await request.json();

          const google = createGoogleGenerativeAI({
            apiKey: Env.GOOGLE_GENERATIVE_AI_API_KEY,
          });

          const result = streamText({
            model: google(LLM_MODELS.gemini_flash_lite_preview),
            messages: convertToModelMessages(messages),
            // messages,
          });

          return result.toUIMessageStreamResponse();
        } catch (error) {
          console.error("Chat API error:", error);
          return new Response(
            JSON.stringify({ error: "Failed to process chat request" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
