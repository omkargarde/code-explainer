import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
import z from "zod";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, gt } from "drizzle-orm";
import { QuestionSchema } from "./questions-typing";
import { PROMPTS } from "@/constants/constants.ts";

import { delay } from "@/utils/delay";
import {
  fetchAIResponse,
  fetchAIResponseUsingAudioInput,
} from "@/utils/server-only-utils/AiFunctions";
import { getUserSession } from "@/lib/auth-server-func";
import { db } from "@/db/database";
import { markdownTable, userTable } from "@/db/schema";
import { createZodErrorResponse } from "@/utils/zod-error-handler";

export const generateQuestionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const user = await getUserSession();

    if (!user.email) {
      throw new Error("User email not found");
    }

    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

    const response_from_db = await db
      .select({ content: markdownTable.content })
      .from(markdownTable)
      .innerJoin(userTable, eq(markdownTable.userId, userTable.id))
      .where(
        and(
          eq(userTable.email, user.email),
          gt(markdownTable.updatedAt, twentyMinutesAgo),
        ),
      );
    if (response_from_db.length > 0) {
      const safeQuestionsContent = QuestionSchema.safeParse(
        response_from_db[0].content,
      );
      if (!safeQuestionsContent.success) {
        return createZodErrorResponse(safeQuestionsContent.error);
      }
      return safeQuestionsContent.data;
    }

    const response = await fetchAIResponse(
      PROMPTS.question_generation_for_javascript_and_react,
      QuestionSchema,
    );

    const generatedContent = response.text;

    if (!generatedContent) {
      throw new Error("failed to generate questions");
    }
    console.log("generatedContent", generatedContent);
    const cleanedContent = generatedContent
      .replace(/^```[a-z]*\s*/i, "") // Remove ```language from start
      .replace(/\s*```$/, "") // Remove ``` from end
      .trim();

    // required for content generation to complete safely
    // sometimes returning incomplete response without
    await delay(1);

    console.log("cleanedContent", cleanedContent);
    const safeGeneratedContent = QuestionSchema.safeParse(cleanedContent);
    if (!safeGeneratedContent.success) {
      return createZodErrorResponse(safeGeneratedContent.error);
    }

    const request_to_db = await db.insert(markdownTable).values({
      id: randomUUID(),
      content: JSON.stringify(safeGeneratedContent.data), // your variable containing the data to save
      userId: (
        await db
          .select({ id: userTable.id })
          .from(userTable)
          .where(eq(userTable.email, user.email))
      )[0].id,
      updatedAt: new Date(),
    });
    return safeGeneratedContent.data;
  },
);

const audioFormDataSchema = z.object({
  audio: z.instanceof(File),
  question: z.string(),
});

const isFormDataSchema = z.instanceof(FormData);

export const generateFeedbackFn = createServerFn({ method: "POST" })
  .inputValidator(isFormDataSchema)
  .handler(async ({ data }) => {
    // parse the input for audio
    try {
      console.log("generateFeedbackFn is called");

      const formData = data as unknown as FormData;

      const rawAudio = formData.get("audio");
      const rawQuestion = formData.get("question");

      const parsedResult = audioFormDataSchema.safeParse({
        audio: rawAudio,
        question: rawQuestion,
      });

      if (!parsedResult.success) {
        return createZodErrorResponse(parsedResult.error);
      }

      const safeFormData = parsedResult.data;

      // get AI feedback by sending audio, the question and the answer outline
      const message = PROMPTS.feedback_for_answer_uploaded(
        safeFormData.question,
      );

      console.log("generating response");
      const response = await fetchAIResponseUsingAudioInput({
        audio: safeFormData.audio,
        message: message,
      });

      if (response instanceof Error) throw response;
      if (!response) throw new Error("failed to generate response");

      // We need to return an object that conforms to the
      // expected return type, which can include an `error` property.
      return { feedback: response };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      console.error("error", message);
      return { error: message };
    }
  });
