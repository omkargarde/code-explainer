import path from "node:path";
import fs from "node:fs/promises";
import z from "zod";
import { createServerFn } from "@tanstack/react-start";
import type { IQuestion } from "@/routes/generate/questions.tsx";
import { DATA_DIRECTORY, PROMPTS } from "@/constants/constants.ts";
import { checkFileExists } from "@/utils/checkFileExists.ts";
import {
  fetchAIResponse,
  fetchAIResponseUsingAudioInput,
} from "@/utils/AiFunctions";
import { delay } from "@/utils/delay";

export const generateQuestionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    // Directory where markdown files are saved
    const RESPONSE_DIR = path.join(
      process.cwd(),
      DATA_DIRECTORY.existing_response,
    );

    // Ensure directory exists
    // Ensure directory exists
    const directoryExists = await checkFileExists(RESPONSE_DIR);
    if (!directoryExists) {
      await fs.mkdir(RESPONSE_DIR, { recursive: true });
    }

    // Ensure File exists
    const filePath = path.join(RESPONSE_DIR, "questions.md");
    const fileExists = await checkFileExists(filePath);

    if (fileExists) {
      // check if file is older than 10 minutes
      const fileMetaData = await fs.stat(filePath);

      const lastModified = fileMetaData.mtime.getTime();
      const currentTime = Date.now();
      const tenMinutes = 10 * 60 * 1000;

      const fileIsFresh = currentTime - lastModified < tenMinutes;

      if (fileIsFresh) {
        const file_content = await fs.readFile(filePath, "utf-8");
        if (file_content.trim() !== "") {
          console.log("file is fresh"); 
          return JSON.parse(file_content) as Array<IQuestion>;
        }
      }
    }

    const response = await fetchAIResponse(
      PROMPTS.question_generation_for_javascript_and_react,
    );
    const content = response.text;
    if (!content) {
      throw new Error("failed to generate questions");
    }
    await fs.writeFile(filePath, "");
    const cleanedContent = content
      .replace(/^```[a-z]*\s*/i, "") // Remove ```language from start
      .replace(/\s*```$/, "") // Remove ``` from end
      .trim();

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
        const errorMsg = parsedResult.error.issues
          .map((i) => i.message)
          .join(", ");
        throw new Error(`Invalid upload: ${errorMsg}`);
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
      if (error instanceof Error) {
        console.error("error", error.message);
        return { error: error.message };
      } else {
        // Returning a generic error message as per the previous structure.
        console.error("error", error);
        return { error: "An unexpected error occurred." };
      }
    }
  });
