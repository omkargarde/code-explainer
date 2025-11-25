import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { QuestionsCard } from "@/routes/generate/-components/QuestionCard";
import { QuestionNav } from "@/routes/generate/-components/QuestionNav";
import {
  generateFeedbackFn,
  generateQuestionFn,
} from "@/routes/generate/-components/generateQuestionFn.ts";
import Loading from "@/components/Loading.tsx";
import AudioRecorder from "@/routes/generate/-components/AudioRecorder";
import { QUERY_KEYS } from "@/constants/constants";

export const Route = createFileRoute("/generate/questions")({
  component: Questions,
});

export interface IQuestion {
  id: number;
  topic: string;
  difficulty: string;
  question: string;
  expected_answer_outline: string;
}

function Questions() {
  const generateQuestion = useServerFn(generateQuestionFn);
  const generateFeedback = useServerFn(generateFeedbackFn);
  const {
    isPending,
    isError,
    data: generatedQuestionsData,
    error,
    refetch: generateQuestionsFn,
  } = useQuery({
    queryFn: generateQuestion,
    queryKey: [QUERY_KEYS.upload_files],
  });

  const {
    isPending: feedbackPending,
    isError: feedbackErrored,
    data: feedbackData,
    error: feedbackError,
    mutate: feedbackMutation,
  } = useMutation({
    mutationFn: (dataForFeedbackGeneration: FormData) =>
      generateFeedback({ data: dataForFeedbackGeneration }),
    mutationKey: [QUERY_KEYS.generate_feedback],
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  // Keyboard navigation (← and →)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!generatedQuestionsData) return;
      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) =>
          prev < generatedQuestionsData.length - 1 ? prev + 1 : prev,
        );
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [generatedQuestionsData]);

  if (isError) {
    return <h1>{error.message}</h1>;
  }
  if (isPending) {
    return <Loading />;
  }
  if (generatedQuestionsData.length === 0) {
    return (
      <div className="mt-4 text-gray-500">
        Record your answer above to receive AI feedback
      </div>
    );
  }

  const currentQuestion = generatedQuestionsData[currentIndex];

  const handleNext = () => {
    if (currentIndex < generatedQuestionsData.length - 1) {
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
      <button
        className="btn btn-primary btn-block py-6 text-2xl"
        onClick={() => generateQuestionsFn()}
      >
        Generate questions
      </button>
      <QuestionNav
        currentIndex={currentIndex}
        handleNext={handleNext}
        handlePrev={handlePrev}
        length={generatedQuestionsData.length}
      />
      <QuestionsCard question={currentQuestion} />
      <AudioRecorder
        question={currentQuestion}
        feedbackMutation={feedbackMutation}
      />
      <DisplayFeedback
        feedbackData={feedbackData}
        feedbackError={feedbackError}
        feedbackErrored={feedbackErrored}
        feedbackPending={feedbackPending}
      />
    </section>
  );
}

function DisplayFeedback(props: {
  feedbackPending: boolean;
  feedbackErrored: boolean;
  feedbackError: Error | null;
  feedbackData:
    | {
        feedback: string;
        error?: undefined;
      }
    | {
        error: string;
        feedback?: undefined;
      }
    | undefined;
}) {
  if (!props.feedbackData) {
    return <h1>No data found</h1>;
  }
  if (props.feedbackErrored) {
    if (!props.feedbackError) return <h1>something went wrong</h1>;
    return <h1>{props.feedbackError.message}</h1>;
  }
  if (props.feedbackData.error) {
    return (
      <div className="rounded bg-red-100 p-4 text-red-700">
        <h2 className="font-semibold">Error generating feedback:</h2>
        <p>{props.feedbackData.error}</p>
      </div>
    );
  }
  if (props.feedbackPending) {
    return <Loading />;
  }
  // return <div>{props.feedbackData.feedback}</div>;
  return (
    <div className="prose mt-4 max-w-none">
      <h2 className="font-semibold">AI Feedback:</h2>{" "}
      <Markdown remarkPlugins={[remarkGfm]}>
        {props.feedbackData.feedback}
      </Markdown>
    </div>
  );
}
