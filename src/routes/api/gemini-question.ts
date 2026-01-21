import { createFileRoute } from "@tanstack/react-router";
import { GoogleGenAI } from "@google/genai";
import z from "zod";
import type { GeminiApiError } from "@/lib/gemini-error";
import { parseGeminiError } from "@/lib/gemini-error";
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
        const now = Date.now();
        const timeSinceLastCall = now - cache.timestamp;

        if (cache.data && timeSinceLastCall < cache.CACHE_DURATION) {
          console.log("Returning cached response");
          return new Response(cache.data, {
            headers: { "Content-Type": "application/json" },
          });
        }

        const ai = new GoogleGenAI({ apiKey: Env.GEMINI_API_KEY });

        try {
          const response = await ai.models.generateContent({
            model: LLM_MODELS.gemini_3_flash_preview,
            contents:
              PROMPTS.system_prompt
                .question_generation_for_javascript_and_react,
            config: {
              responseMimeType: "application/json",
              responseJsonSchema: z.toJSONSchema(QuestionSchema),
            },
          });

          if (response.text) {
            cache.data = response.text;
            cache.timestamp = now;
            console.log("Response cached");
          }

          return new Response(response.text);
        } catch (err: unknown) {
          if (err && typeof err === "object" && "message" in err) {
            const errorMessage = err.message as string;
            try {
              const errorData = JSON.parse(errorMessage) as GeminiApiError;
              const parsedError = parseGeminiError(errorData);

              if (parsedError.isRateLimitError) {
                return new Response(
                  JSON.stringify({
                    code: 429,
                    message: parsedError.message,
                    retryAfter: parsedError.retryAfterSeconds,
                    quotaLimit: parsedError.quotaLimit,
                  }),
                  {
                    status: 429,
                    headers: { "Content-Type": "application/json" },
                  },
                );
              }
            } catch {
              console.log("Failed to parse gemini api error");
            }

            return new Response(
              JSON.stringify({ code: 500, message: errorMessage }),
              { status: 500, headers: { "Content-Type": "application/json" } },
            );
          }

          return new Response(
            JSON.stringify({ code: 500, message: "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
