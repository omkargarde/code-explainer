import { createFileRoute } from "@tanstack/react-router";
import { google } from "@ai-sdk/google";
import { Output, streamText } from "ai";
import { Env } from "@/Env";
import { QuestionSchema } from "@/typing/questions";
import { LLM_MODELS, PROMPTS } from "@/constants/constants";

const cache = {
  data: null as string | null,
  timestamp: 0,
  CACHE_DURATION: 600000,
};

export const Route = createFileRoute("/api/gemini-question")({
  server: {
    handlers: {
      GET: async () => {
        console.log("[gemini-question] Request received");
        const now = Date.now();
        const timeSinceLastCall = now - cache.timestamp;
        console.log(
          `[gemini-question] Time since last call: ${timeSinceLastCall}ms, cache duration: ${cache.CACHE_DURATION}ms`,
        );

        if (cache.data && timeSinceLastCall < cache.CACHE_DURATION) {
          console.log(
            "[gemini-question] [cache hit] Returning cached response",
          );
          return new Response(cache.data, {
            headers: { "Content-Type": "application/json" },
          });
        }

        console.log(
          "[gemini-question] [cache miss] Calling Gemini API for new question",
        );

        try {
          const result = streamText({
            model: google(LLM_MODELS.gemini_3_flash_preview, {
              apiKey: Env.GEMINI_API_KEY,
            }),
            messages: [
              {
                role: "system",
                content: PROMPTS.system_prompt
                  .question_generation_for_javascript_and_react as any,
              },
              {
                role: "user",
                content: "Generate one interview question",
              },
            ],
            experimental_output: Output.object({
              schema: QuestionSchema,
            }),
          });

          console.log("[gemini-question] Streaming response started");
          return result.toDataStreamResponse();
        } catch (err: unknown) {
          console.error("[gemini-question] Error occurred:", err);
          console.log("[gemini-question] unhandled error occurred");
          return new Response(
            JSON.stringify({ code: 500, message: "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
