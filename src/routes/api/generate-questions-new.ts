import { createFileRoute } from "@tanstack/react-router";
import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { geminiText } from "@tanstack/ai-gemini";
import { PROMPTS } from "@/constants/constants";
import { QuestionSchema } from "@/typing/questions";

export const Route = createFileRoute("/api/generate-questions-new")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, conversationId } = await request.json();

        try {
          // Create a streaming chat response
          const stream = chat({
            adapter: geminiText("gemini-3-flash-preview"),
            conversationId,
            messages: [
              { role: "user", content: messages },
              {
                role: "assistant",
                content:
                  PROMPTS.system_prompt
                    .question_generation_for_javascript_and_react,
              },
            ],
            outputSchema: QuestionSchema,
          });

          // Convert stream to HTTP response
          return toServerSentEventsResponse(stream);
        } catch (error) {
          return new Response(
            JSON.stringify({
              error:
                error instanceof Error ? error.message : "An error occurred",
            }),
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
