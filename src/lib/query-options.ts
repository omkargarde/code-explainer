import type { IQuestion } from "@/typing/questions";

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
