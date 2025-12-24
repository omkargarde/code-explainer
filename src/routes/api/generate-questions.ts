import { LLM_MODELS } from "@/constants/constants";
import { google } from "@ai-sdk/google";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText } from "ai";

export const Route = createFileRoute("/api/generate-questions")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = await request.json();

          const result = streamText({
            model: google(LLM_MODELS.gemini_flash_lite_preview),
            messages: convertToModelMessages(messages),
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
