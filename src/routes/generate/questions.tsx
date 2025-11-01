import path from "node:path";
import fs from "node:fs";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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

  const [currentIndex, setCurrentIndex] = useState(0);

  // Keyboard navigation (← and →)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!questions) return;
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) =>
          prev < questions.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [questions]);

  if (isError) {
    return <h1>{error.message}</h1>;
  }
  if (isPending) {
    return <h1>Loading...</h1>;
  }
  if (questions.length === 0) {
    return <h1>No questions found.</h1>;
  }

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <section className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-center text-2xl font-semibold">
        Interview questions
      </h1>

      <div className="mt-6 flex items-center justify-between">
        <button
          className="btn btn-outline"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Previous
        </button>

        <span className="text-sm text-gray-500">
          {currentIndex + 1} / {questions.length}
        </span>

        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={currentIndex === questions.length - 1}
        >
          Next
        </button>
      </div>

      <section className="card card-body bg-accent-content my-6 rounded-2xl p-6 shadow-lg">
        <header className="card-title flex flex-col items-start gap-0.5 pb-4">
          <h2 className="text-xl font-bold">{currentQuestion.topic}</h2>
          <p className="text-sm text-gray-300">
            Difficulty: {currentQuestion.difficulty}
          </p>
        </header>
        <div className="text-base leading-6">
          <p className="font-medium">{currentQuestion.question}</p>
          <p className="pt-2 text-gray-300">
            {currentQuestion.expected_answer_outline}
          </p>
        </div>
      </section>
    </section>
  );
}
