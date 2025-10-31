import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type OpenAI from "openai";
import { fetchAIResponse } from "@/utils/llmClient";
import { PROMPTS } from "@/constants/constants";

export const Route = createFileRoute("/generate/questions")({
  loader: async () => {
    return generateQuestionFn();
  },
  component: Questions,
});

export interface QuestionsInterface {
  id: number;
  topic: string;
  difficulty: string;
  question: string;
  expected_answer_outline: string;
}

const generateQuestionFn = createServerFn({ method: "GET" }).handler(
  async () => {
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
    // console.log(content);

    const cleanedContent = content
      .replace(/^```[a-z]*\s*/i, "") // Remove ```language from start
      .replace(/\s*```$/, "") // Remove ``` from end
      .trim();
    console.warn("cleanedContent");
    console.log(cleanedContent);
    const returnPayload = JSON.parse(
      cleanedContent,
    ) as Array<QuestionsInterface>;
    // console.log(returnPayload);
    // return response.choices[0].message;
    return returnPayload;
  },
);

function Questions() {
  const questions = Route.useLoaderData();

  // We can assume by this point that `isSuccess === true`
  return (
    <section>
      <h1 className="text-2xl">Interview questions </h1>
      <ul>
        {questions.map((question) => (
          <li key={question.id}>
            <section className="card card-body card-border bg-accent-content mx-auto my-4 max-w-5xl shadow">
              <header className="card-title">
                <h2 className="">{question.topic}</h2>
                <p>Difficulty: {question.difficulty}</p>
              </header>
              <div className="text-base leading-6">
                <p>{question.question}</p>
                <p className="pt-2">{question.expected_answer_outline}</p>
              </div>
            </section>
          </li>
        ))}
      </ul>
    </section>
  );
}
