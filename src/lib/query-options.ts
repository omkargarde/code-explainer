import type { IQuestion } from "@/typing/questions";
import type { IFeedback } from "@/typing/feedback";

export const gemini_question_options = (generate: boolean = false) =>
  ({
    queryKey: ["gemini-question", { generate }] as const,
    queryFn: async () => {
      console.log("[query-options] geminiQuestionOptions queryFn called", {
        generate,
      });
      const url = `/api/gemini-question?generate=${generate}`;
      const response = await fetch(url);
      console.log("[query-options] Response status:", response.status);
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
  }) as const;

export const gemini_feedback_options = {
  mutationKey: ["gemini-feedback"],
  mutationFn: async ({
    question,
    audioBlob,
  }: {
    question: IQuestion;
    audioBlob: Blob;
  }) => {
    console.log("[query-options] geminiFeedbackOptions mutationFn called", {
      question: question.question,
      audioBlobSize: audioBlob.size,
    });
    const formData = new FormData();
    formData.append("question", JSON.stringify(question));
    formData.append("audioBlob", audioBlob);

    const response = await fetch("/api/gemini-feedback", {
      method: "POST",
      body: formData,
    });

    console.log("[query-options] Feedback response status:", response.status);

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
