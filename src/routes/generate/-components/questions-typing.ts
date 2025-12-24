import z from "zod";

export const QuestionSchema = z
  .object({
    id: z.number(),
    topic: z.string(),
    difficulty: z.string(),
    question: z.string(),
    expected_answer_outline: z.string(),
  })
  .array()
  .length(1);

export type IQuestion = z.infer<typeof QuestionSchema>;
export type IQuestionItem = IQuestion[number];

export const audioFormDataSchema = z.object({
  audio: z.instanceof(File),
  question: z.string(),
});

export type IAudioForm = z.infer<typeof audioFormDataSchema>;

export const isFormDataSchema = z.instanceof(FormData);
