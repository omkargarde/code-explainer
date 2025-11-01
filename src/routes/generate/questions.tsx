import path from "node:path";
import fs from "node:fs";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import type OpenAI from "openai";
import { fetchAIResponse } from "@/utils/llmClient";
import { DATA_DIRECTORY, PROMPTS } from "@/constants/constants";

export const Route = createFileRoute("/generate/questions")({
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
    // Directory where markdown files are saved
    const RESPONSE_DIR = path.join(
      process.cwd(),
      DATA_DIRECTORY.existing_response,
    );

    // Ensure directory exists
    if (!fs.existsSync(RESPONSE_DIR)) {
      fs.mkdirSync(RESPONSE_DIR, { recursive: true });
    }
    const filePath = path.join(RESPONSE_DIR, "questions.md");

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "");
    }

    const file_content = fs.readFileSync(filePath, "utf-8");
    if (file_content.trim() !== "") {
      return JSON.parse(file_content) as Array<QuestionsInterface>;
    }
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

    fs.writeFileSync(filePath, JSON.stringify(returnPayload));
    return returnPayload;
  },
);

function Questions() {
  const generateQuestion = useServerFn(generateQuestionFn);

  const {
    isPending,
    isError,
    data: questions,
    error,
  } = useQuery({
    queryFn: generateQuestion,
    queryKey: ["uploadFiles"],
  });
  if (isError) {
    return <h1>{error.message}</h1>;
  }
  if (isPending) {
    return <h1>Loading...</h1>;
  }
  console.log(questions);

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
