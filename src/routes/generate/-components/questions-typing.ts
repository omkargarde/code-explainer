import z from "zod";

export const QuestionSchema = z.object({
  id: z.number(),
  topic: z.string(),
  difficulty: z.string(),
  question: z.string(),
  expected_answer_outline: z.string(),
});

export const audioFormDataSchema = z.object({
  audio: z.instanceof(File),
  question: z.string(),
});

export const isFormDataSchema = z.instanceof(FormData);

export type IQuestion = z.infer<typeof QuestionSchema>;
export type IAudioForm = z.infer<typeof audioFormDataSchema>;
