import { createServerFn } from "@tanstack/react-start";
import { PROMPTS } from "@/constants/constants";
import { fetchAIResponseUsingAudioInput } from "@/utils/server-only-utils/AiFunctions";
import { createZodErrorResponse } from "@/utils/zod-error-handler";
import {
  audioFormDataSchema,
  isFormDataSchema,
} from "@/routes/generate/-components/questions-typing";

export const generateFeedbackFn = createServerFn({ method: "POST" })
  .inputValidator(isFormDataSchema)
  .handler(async ({ data }) => {
    // parse the input for audio
    console.log("generateFeedbackFn is called");

    const formData = data as unknown as FormData;

    const rawAudio = formData.get("audio");
    const rawQuestion = formData.get("question");

    const parsedResult = audioFormDataSchema.safeParse({
      audio: rawAudio,
      question: rawQuestion,
    });

    if (!parsedResult.success) {
      throw new Error(createZodErrorResponse(parsedResult.error));
    }

    const safeFormData = parsedResult.data;

    // get AI feedback by sending audio, the question and the answer outline
    const message = PROMPTS.feedback_for_answer_uploaded(safeFormData.question);

    console.log("generating response");
    const response = await fetchAIResponseUsingAudioInput({
      audio: safeFormData.audio,
      message: message,
    });

    if (response instanceof Error) throw response;
    if (!response) throw new Error("failed to generate response");

    return { feedback: response };
  });
