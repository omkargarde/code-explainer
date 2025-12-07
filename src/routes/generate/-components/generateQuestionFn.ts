import { createServerFn } from "@tanstack/react-start";
import { and, eq, gt } from "drizzle-orm";
import { QuestionSchema } from "./questions-typing";
import { PROMPTS } from "@/constants/constants.ts";

import { fetchAIResponse } from "@/utils/server-only-utils/AiFunctions";
import { getUserSession } from "@/lib/auth-server-func";
import { db } from "@/db/database";
import { markdownTable, user } from "@/db/schema";
import { createZodErrorResponse } from "@/utils/zod-error-handler";

export const generateQuestionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const userSession = await getUserSession();

    console.log("getting user session");
    if (!userSession.email) {
      throw new Error("User email not found");
    }

    const twentyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    console.log("fetching previously generated content from database");
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
        JSON.parse(response_from_db[0].content),
      );
      if (!safeQuestionsContent.success) {
        console.error(
          "error occurred while validating previously generated content",
          safeQuestionsContent.error,
        );
        throw new Error(createZodErrorResponse(safeQuestionsContent.error));
      }
      console.log(
        "returning previously generated content",
        safeQuestionsContent.data[0],
      );
      return safeQuestionsContent.data;
    }

    console.log("generating new questions");
    const response = await fetchAIResponse(
      PROMPTS.question_generation_for_javascript_and_react,
      QuestionSchema,
    );

    const generatedContent = response.text;

    if (!generatedContent) {
      throw new Error("failed to generate questions");
    }
    console.log("unadulterated generated content", generatedContent[0]);
    const safeGeneratedContent = QuestionSchema.safeParse(
      JSON.parse(generatedContent),
    );
    console.log("safeGeneratedContent", safeGeneratedContent.data);
    if (!safeGeneratedContent.success) {
      console.error(
        "error occurred while validating newly generated content",
        safeGeneratedContent.error,
      );
      throw new Error(createZodErrorResponse(safeGeneratedContent.error));
    }
    console.log("safeGeneratedContent.data", safeGeneratedContent.data[0]);

    const userRecord = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, userSession.email));

    if (!userRecord.length) {
      throw new Error("User not found in database");
    }

    const request_to_db = await db
      .insert(markdownTable)
      .values({
        content: JSON.stringify(safeGeneratedContent.data), // your variable containing the data to save
        userId: userRecord[0].id,
      })
      .onConflictDoUpdate({
        target: markdownTable.id,
        set: {
          content: JSON.stringify(safeGeneratedContent.data),
        },
      })
      .returning();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!request_to_db || request_to_db.length === 0) {
      throw new Error(
        "failed to insert new generated question in the database",
      );
    }

    console.log(
      "returning newly generated content",
      safeGeneratedContent.data[0],
    );
    return safeGeneratedContent.data;
  },
);
