import path from "node:path";
import fs from "node:fs/promises";
import z from "zod";
import { createServerFn } from "@tanstack/react-start";
import { and, eq, gt } from "drizzle-orm";
import { QuestionSchema } from "./questions-typing";
import { DATA_DIRECTORY, PROMPTS } from "@/constants/constants.ts";
import { checkFileExists } from "@/utils/server-only-utils/checkFileExists";

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
      QuestionSchema.safeParse;
      return JSON.parse(response_from_db[0].content) as Array<IQuestion>;
    }

    const response = await fetchAIResponse(
      PROMPTS.question_generation_for_javascript_and_react,
    );

    const generatedContent = response.text;

    if (!generatedContent) {
      throw new Error("failed to generate questions");
    }

    const cleanedContent = generatedContent
      .replace(/^```[a-z]*\s*/i, "") // Remove ```language from start
      .replace(/\s*```$/, "") // Remove ``` from end
      .trim();

    // required for content generation to complete safely
    // sometimes returning incomplete response without
    await delay(1);

    console.log("cleanedContent", cleanedContent);
    const returnPayload = JSON.parse(cleanedContent) as Array<IQuestion>;

    await fs.writeFile(filePath, JSON.stringify(returnPayload));
    return returnPayload;
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
      // We need to cast `data` to `FormData` because `isFormDataSchema` only
      // asserts that it is a `FormData` instance, but TypeScript doesn't
      // automatically infer the type for the handler's `data` parameter.
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

      const { audio, question } = parsedResult.data;

      // get AI feedback by sending audio, the question and the answer outline
      const message = PROMPTS.feedback_for_answer_uploaded(question);

      console.log("generating response");
      const response = await fetchAIResponseUsingAudioInput({
        audio,
        message,
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
