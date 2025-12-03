import z from "zod";

export const QuestionSchema = z.object({
  id: z.number(),
  topic: z.string(),
  difficulty: z.string(),
  question: z.string(),
  expected_answer_outline: z.string(),
});
export type IQuestion = z.infer<typeof QuestionSchema>;
