import path from "node:path";
import fs from "node:fs/promises";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import type { IQuestion } from "@/routes/generate/questions.tsx";
import type OpenAI from "openai";
import { DATA_DIRECTORY, PROMPTS } from "@/constants/constants.ts";
import { checkFileExists } from "@/utils/checkFileExists.ts";
import { fetchAIResponse } from "@/utils/llmClient.ts";
import { delay } from "@/utils/delay";

export const generateQuestionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    // Directory where markdown files are saved
    const RESPONSE_DIR = path.join(
      process.cwd(),
      DATA_DIRECTORY.existing_response,
    );

    // Ensure directory exists
    const directoryExists = await checkFileExists(RESPONSE_DIR);
    if (directoryExists) {
      await fs.mkdir(RESPONSE_DIR, { recursive: true });
    }

    // Ensure File exists
    const filePath = path.join(RESPONSE_DIR, "questions.md");
    const fileExists = await checkFileExists(filePath);
    if (fileExists) {
      await fs.writeFile(filePath, "");
    }

    // check if file is older than 10 minutes
    const fileMetaData = await fs.stat(filePath);
    const lastModified = fileMetaData.birthtimeMs;
    const currentTime = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    const fileIsTenMinutesOld = tenMinutes > currentTime - lastModified;

    const file_content = await fs.readFile(filePath, "utf-8");
    if (file_content.trim() !== "" && fileIsTenMinutesOld) {
      return JSON.parse(file_content) as Array<IQuestion>;
    }
    const messages: Array<OpenAI.Chat.Completions.ChatCompletionMessageParam> =
      [
        {
          role: "user",
          content: PROMPTS.question_generation_for_javascript_and_react,
        },
      ];

    const response = await fetchAIResponse(messages);
    const content = response.choices[0].message.content;
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

const audioFormDataSchema = z.instanceof(FormData).refine(
  (formData) => {
    const file = formData.get("audio");
    if (!file) return false;
    if (!(file instanceof File)) return false;
    return file.type.startsWith("audio/");
  },
  {
    message: "FormData must contain a valid audio file under the 'audio' field",
  },
);

const isFormDataSchema = z.instanceof(FormData);

export const generateFeedbackFn = createServerFn({ method: "GET" })
  .inputValidator(isFormDataSchema)
  .handler(({ data }) => {
    // parse the input for audio
    const parsedResult = audioFormDataSchema.safeParse(data);

    if (!parsedResult.success) {
      const errorMsg = parsedResult.error.issues
        .map((i) => i.message)
        .join(", ");
      throw new Error(`Invalid upload: ${errorMsg}`);
    }

    const audioFile = parsedResult.data;

    // get AI feedback by sending audio, the question and the answer outline
    const messages: Array<OpenAI.Chat.Completions.ChatCompletionMessageParam> =
      [
        {
          role: "system",
          content: ``,
        },
        {
          role: "user",
          content: ``,
        },
      ];

    const response = await fetchAIResponse(messages);

    const explanation = response.choices[0]?.message;
    // check for error
    // convert markdown to json
    // return response
  });
