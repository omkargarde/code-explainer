import type { IQuestion } from "@/typing/questions";
import type { IFeedback } from "@/typing/feedback";

export const geminiQuestionOptions = {
  queryKey: ["gemini-question"],
  queryFn: async () => {
    const response = await fetch("/api/gemini-question");
    if (!response.ok) {
      if (response.status === 429) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Rate limit exceeded");
      }
      throw new Error("Failed to fetch data");
    }
    return (await response.json()) as IQuestion;
  },
  enabled: false,
} as const;

export const geminiFeedbackOptions = {
  mutationKey: ["gemini-feedback"],
  mutationFn: async ({
    question,
    audioBlob,
  }: {
    question: IQuestion;
    audioBlob: Blob;
  }) => {
    const formData = new FormData();
    formData.append("question", JSON.stringify(question));
    formData.append("audioBlob", audioBlob);

    const response = await fetch("/api/gemini-feedback", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 429) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Rate limit exceeded");
      }
      throw new Error("Failed to generate feedback");
    }

    return (await response.json()) as IFeedback;
  },
} as const;
