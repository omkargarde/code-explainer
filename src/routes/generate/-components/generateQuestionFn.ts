import { createServerFn } from "@tanstack/react-start";
import { and, eq, gt } from "drizzle-orm";
import { QuestionSchema } from "./questions-typing";
import { PROMPTS } from "@/constants/constants.ts";

import { delay } from "@/utils/delay";
import { fetchAIResponse } from "@/utils/server-only-utils/AiFunctions";
import { getUserSession } from "@/lib/auth-server-func";
import { db } from "@/db/database";
import { markdownTable, user } from "@/db/schema";
import { createZodErrorResponse } from "@/utils/zod-error-handler";

export const generateQuestionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const userSession = await getUserSession();

      if (!userSession.email) {
        throw new Error("User email not found");
      }

      const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

      const response_from_db = await db
        .select({ content: markdownTable.content })
        .from(markdownTable)
        .innerJoin(user, eq(markdownTable.userId, user.id))
        .where(
          and(
            eq(user.email, userSession.email),
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
      console.log("safeGeneratedContent.data", safeGeneratedContent.data);

      const request_to_db = await db.insert(markdownTable).values({
        content: JSON.stringify(safeGeneratedContent.data), // your variable containing the data to save
        userId: (
          await db
            .select({ id: user.id })
            .from(user)
            .where(eq(user.email, userSession.email))
        )[0].id,
        updatedAt: new Date(),
      });
      return safeGeneratedContent.data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate questions";
      console.error("Error generating questions:", message);
      return { error: message };
    }
  },
);
