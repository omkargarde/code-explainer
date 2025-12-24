import { google } from "@ai-sdk/google";
import { createFileRoute } from "@tanstack/react-router";
import { Output, convertToModelMessages, streamText } from "ai";
import z from "zod";
import { LLM_MODELS, PROMPTS } from "@/constants/constants";

const QuestionSchema = z
  .object({
    id: z.number(),
    topic: z.string(),
    difficulty: z.string(),
    question: z.string(),
    expected_answer_outline: z.string(),
  })
  .array()
  .min(1)
  .max(1);

export type IQuestionForPart = z.infer<typeof QuestionSchema>;

export const Route = createFileRoute("/api/generate-questions")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = await request.json();

          const result = streamText({
            model: google(LLM_MODELS.gemini_flash_lite_preview),
            messages: convertToModelMessages(messages),
            experimental_output: Output.object({
              schema: QuestionSchema,
            }),
            system: PROMPTS.system_prompt
              .question_generation_for_javascript_and_react as any,
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
