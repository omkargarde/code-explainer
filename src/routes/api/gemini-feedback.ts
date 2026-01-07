import { GoogleGenAI } from "@google/genai";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { LLM_MODELS, PROMPTS } from "@/constants/constants";
import { Env } from "@/Env";
import { QuestionSchema } from "@/typing/questions";

export const Route = createFileRoute("/api/gemini-feedback")({
  server: {
    handlers: {
      POST: async () => {
        const ai = new GoogleGenAI({ apiKey: Env.GEMINI_API_KEY });

        const response = await ai.models.generateContent({
          model: LLM_MODELS.gemini_2_flash,
          contents:
            PROMPTS.system_prompt.question_generation_for_javascript_and_react,
          config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(QuestionSchema),
          },
        });

        console.log(response.text);
        return new Response(response.text);
      },
    },
  },
});
