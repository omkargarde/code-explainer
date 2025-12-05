import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { PROMPTS } from "@/constants/constants";
import { fetchAIResponseUsingAudioInput } from "@/utils/server-only-utils/AiFunctions";
import { createZodErrorResponse } from "@/utils/zod-error-handler";

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
