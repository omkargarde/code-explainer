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
        console.log("[gemini-feedback] Request received");
        const formData = await request.formData();
        const questionStr = formData.get("question") as string;
        const answerAudio = formData.get("audioBlob") as Blob | undefined;

        if (!questionStr) {
          console.error("[gemini-feedback] Question is missing");
          return new Response(
            JSON.stringify({ error: "Question is required" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        if (!answerAudio) {
          console.error("[gemini-feedback] Audio file is missing");
          return new Response(
            JSON.stringify({ error: "Audio file is required" }),
            { status: 400, headers: { "Content-Type": "application/json" } },
          );
        }

        const question = JSON.parse(questionStr);
        console.log(
          `[gemini-feedback] Question received: ${question.question}`,
        );
        console.log(
          `[gemini-feedback] Audio blob size: ${answerAudio.size} bytes, type: ${answerAudio.type}`,
        );

        const audioFile = new File([answerAudio], "answer.webm", {
          type: answerAudio.type || "audio/webm",
        });
        console.log(
          `[gemini-feedback] Created File object: ${audioFile.name}, ${audioFile.size} bytes`,
        );

        const ai = new GoogleGenAI({ apiKey: Env.GEMINI_API_KEY });

        try {
          console.log("[gemini-feedback] Uploading audio file to Gemini");
          const uploadedFile = await ai.files.upload({ file: audioFile });
          console.log(
            `[gemini-feedback] File uploaded successfully: ${uploadedFile.name}, uri: ${uploadedFile.uri}`,
          );

          const prompt = PROMPTS.system_prompt.feedback_for_answer_uploaded(
            question.question,
          );
          console.log(
            "[gemini-feedback] Calling Gemini API for feedback generation",
          );

          const response = await ai.models.generateContent({
            model: LLM_MODELS.gemini_3_flash_preview,
            contents: [
              {
                role: "user",
                parts: [
                  { text: prompt },
                  {
                    fileData: {
                      fileUri: uploadedFile.uri,
                      mimeType: uploadedFile.mimeType,
                    },
                  },
                ],
              },
            ],
            config: {
              responseMimeType: "application/json",
              responseJsonSchema: z.toJSONSchema(FeedbackSchema),
            },
          });

          console.log(
            `[gemini-feedback] Response received: ${response.text ? "success" : "no text"}`,
          );
          return new Response(response.text);
        } catch (err: unknown) {
          console.error("[gemini-feedback] Error occurred:", err);
          const geminiErrorResponse = handleGeminiError(err);
          if (geminiErrorResponse) {
            console.log(
              "[gemini-feedback] Returning formatted error response from handleGeminiError",
            );
            return geminiErrorResponse;
          }

          console.log(
            "[gemini-feedback] Returning generic unknown error response",
          );
          return new Response(
            JSON.stringify({ code: 500, message: "Unknown error" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
