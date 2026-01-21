import { GoogleGenAI } from "@google/genai";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import { LLM_MODELS, PROMPTS } from "@/constants/constants";
import { Env } from "@/Env";
import { FeedbackSchema } from "@/typing/feedback";
import { handleGeminiError } from "@/lib/gemini-error";

export const Route = createFileRoute("/api/gemini-feedback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const formData = await request.formData();
        const questionStr = formData.get("question") as string;
        const answerAudio = formData.get("audioBlob") as Blob | undefined;

        if (!questionStr) {
          return new Response(
            JSON.stringify({ error: "Question is required" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        if (!answerAudio) {
          return new Response(
            JSON.stringify({ error: "Audio file is required" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const question = JSON.parse(questionStr);

        const audioFile = new File([answerAudio], "answer.webm", {
          type: answerAudio.type || "audio/webm",
        });

        const ai = new GoogleGenAI({ apiKey: Env.GEMINI_API_KEY });

        try {
          const uploadedFile = await ai.files.upload({ file: audioFile });

          const prompt = PROMPTS.system_prompt.feedback_for_answer_uploaded(
            question.question,
          );

          const response = await ai.models.generateContent({
            model: LLM_MODELS.gemini_3_flash_preview,
            contents: [prompt, uploadedFile],
            config: {
              responseMimeType: "application/json",
              responseJsonSchema: z.toJSONSchema(FeedbackSchema),
            },
          });

          console.log(response.text);
          return new Response(response.text);
        } catch (err: unknown) {
          const geminiErrorResponse = handleGeminiError(err);
          if (geminiErrorResponse) {
            return geminiErrorResponse;
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
