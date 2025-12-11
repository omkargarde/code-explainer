import { createServerFn } from "@tanstack/react-start";
import { PROMPTS } from "@/constants/constants";
import { fetchAIResponseUsingAudioInput } from "@/utils/server-only-utils/AiFunctions";
import { createZodErrorResponse } from "@/utils/zod-error-handler";
import {
  audioFormDataSchema,
  isFormDataSchema,
} from "@/routes/generate/-components/questions-typing";
import { getUserSession } from "@/lib/auth-server-func";

export const generateFeedbackFn = createServerFn({ method: "POST" })
  .inputValidator(isFormDataSchema)
  .handler(async ({ data }) => {
    try {
      const userSession = await getUserSession();
      console.log("generateFeedbackFn: User session", userSession);

      if (!userSession.email) {
console.error("generateFeedbackFn: No user email found");
        throw new Error("User not found");
      }

      const rawAudio = data.get("audio");
      const rawQuestion = data.get("question");

      const parsedResult = audioFormDataSchema.safeParse({
        audio: rawAudio,
        question: rawQuestion,
      });

      if (!parsedResult.success) {
        throw new Error(createZodErrorResponse(parsedResult.error));
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

      console.log("returning response successfully");
      return { feedback: response };
    } catch (error) {
      console.error("Error in generateFeedbackFn:", error);
      throw error;
    }
  });
