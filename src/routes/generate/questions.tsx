import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { QuestionsCard } from "@/routes/generate/-components/QuestionCard";
import { QuestionNav } from "@/routes/generate/-components/QuestionNav";
import { generateQuestionFn } from "@/routes/generate/-components/generateQuestionFn.ts";
import Loading from "@/components/Loading.tsx";
import AudioRecorder from "@/components/AudioRecorder";

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
    return <Loading />;
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
      <QuestionNav
        currentIndex={currentIndex}
        handleNext={handleNext}
        handlePrev={handlePrev}
        length={questions.length}
      />
      <QuestionsCard question={currentQuestion} />
      <AudioRecorder />
    </section>
  );
}
