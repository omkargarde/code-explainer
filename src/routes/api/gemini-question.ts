import { createFileRoute } from "@tanstack/react-router";
import { GoogleGenAI } from "@google/genai";
import z from "zod";
import { handleGeminiError } from "@/lib/gemini-error";
import { Env } from "@/Env";
import { QuestionSchema } from "@/typing/questions";
import { LLM_MODELS, PROMPTS } from "@/constants/constants";

// Simple in-memory cache for the last generated question
let cachedQuestion: string | null = null;

export const Route = createFileRoute("/api/gemini-question")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        console.log("[gemini-question] Request received");

        // Parse query parameters
        const url = new URL(request.url);
        const generate = url.searchParams.get("generate") === "true";

        console.log(`[gemini-question] Generate parameter: ${generate}`);

        // If generate is false or missing, return cached question
        if (!generate && cachedQuestion) {
          console.log(
            "[gemini-question] Returning cached question",
          );
          return new Response(cachedQuestion, {
            headers: { "Content-Type": "application/json" },
          });
        }

        // Generate new question
        console.log(`[gemini-question] Calling Gemini API for new question`);
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

          console.log(
            `[gemini-question] Response received: ${response.text ? "success" : "no text"}`,
          );

          if (response.text) {
            // Cache the new question
            cachedQuestion = response.text;
            console.log("[gemini-question] Question cached successfully");
          }

          return new Response(response.text);
        } catch (err: unknown) {
          console.error("[gemini-question] Error occurred:", err);
          const geminiErrorResponse = handleGeminiError(err);
          if (geminiErrorResponse) {
            return geminiErrorResponse;
          }

          console.log("[gemini-question] Unhandled error occurred");
          return new Response(
            JSON.stringify({ code: 500, message: "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
