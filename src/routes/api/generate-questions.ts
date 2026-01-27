import { google } from "@ai-sdk/google";
import { createFileRoute } from "@tanstack/react-router";
import { Output, convertToModelMessages, streamText } from "ai";
import { LLM_MODELS, PROMPTS } from "@/constants/constants";
import { QuestionSchema } from "@/typing/questions";

export const Route = createFileRoute("/api/generate-questions")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = await request.json();

          const result = streamText({
            model: google(LLM_MODELS.gemini_flash_lite_preview),
            messages: await convertToModelMessages(messages),
            experimental_output: Output.object({
              schema: QuestionSchema,
            }),
            system: PROMPTS.system_prompt
              .question_generation_for_javascript_and_react as any,
            temperature: 2,
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
