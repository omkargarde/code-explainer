import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { QuestionCard } from "@/components/QuestionCard";
import { AudioRecorder } from "@/components/AudioRecorder";
import {
  gemini_feedback_options,
  gemini_question_options,
} from "@/lib/query-options";
import { useRateLimitCountdown } from "@/hooks/useRateLimitCountdown";

interface ApiErrorResponse {
  code: number;
  message: string;
  retryAfter?: number;
  quotaLimit?: number;
}

interface RateLimitInfo {
  retryAfter: number;
  quotaLimit?: number;
  message: string;
  timestamp: number;
}

const RATE_LIMIT_KEY = "gemini-rate-limit";

function getErrorDetails(error: Error): ApiErrorResponse | null {
  try {
    return JSON.parse(error.message) as ApiErrorResponse;
  } catch {
    return null;
  }
}

function saveRateLimitInfo(errorDetails: ApiErrorResponse) {
  const info: RateLimitInfo = {
    retryAfter: errorDetails.retryAfter || 60,
    quotaLimit: errorDetails.quotaLimit,
    message: errorDetails.message,
    timestamp: Date.now(),
  };
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(info));
}

export const Route = createFileRoute("/gemini")({
  component: GeminiChat,
});

function GeminiChat() {
  const {
    data: cached_question_data,
    isLoading: is_cache_question_loading,
    error: cached_question_error,
    refetch: refetch_cached_question,
  } = useQuery(gemini_question_options(false));

  const {
    data: new_question_data,
    isLoading: is_new_question_loading,
    error: new_question_error,
    refetch: refetch_new_question,
  } = useQuery(gemini_question_options(true));

  const { remainingSeconds, rateLimitInfo, isRateLimited } =
    useRateLimitCountdown(RATE_LIMIT_KEY);

  const feedbackMutation = useMutation(gemini_feedback_options);

  const handleSubmitAnswer = (audioBlob: Blob) => {
    console.log("[gemini] Submit answer triggered", { audioBlob });
    const currentQuestion = new_question_data || cached_question_data;
    if (currentQuestion) {
      feedbackMutation.mutate({ question: currentQuestion, audioBlob });
    }
  };

  useEffect(() => {
    const currentError = new_question_error || cached_question_error;
    if (currentError) {
      const errorDetails = getErrorDetails(currentError);
      if (errorDetails?.code === 429) {
        saveRateLimitInfo(errorDetails);
      }
    }
  }, [new_question_error, cached_question_error]);

  if (is_cache_question_loading || is_new_question_loading) {
    return <div>Loading...</div>;
  }

  if (isRateLimited && rateLimitInfo) {
    return (
      <div className="rounded-lg border border-red-500 bg-red-900/20 p-6 text-center text-red-400">
        <p className="text-lg font-semibold">{rateLimitInfo.message}</p>
        <div className="mt-4 space-y-2">
          <p className="text-sm">
            Rate limit reached. Please retry in
            <span className="font-bold text-orange-400">
              {remainingSeconds}
            </span>
            seconds
          </p>
          {rateLimitInfo.quotaLimit && (
            <p className="text-xs opacity-75">
              Quota limit: {rateLimitInfo.quotaLimit} requests per day
            </p>
          )}
        </div>
      </div>
    );
  }

  const currentError = new_question_error || cached_question_error;
  if (currentError) {
    const errorDetails = getErrorDetails(currentError);

    return (
      <div className="rounded-lg border border-red-500 bg-red-900/20 p-6 text-center text-red-400">
        <p className="text-lg font-semibold">
          {errorDetails?.message || currentError.message}
        </p>
      </div>
    );
  }

  const currentQuestion = new_question_data || cached_question_data;

  if (!currentQuestion) {
    return (
      <div className="flex h-screen overflow-hidden items-center justify-center bg-gray-900 px-2">
        <div className="mx-auto w-full max-w-3xl text-center space-y-4">
          <button
            onClick={() => {
              console.log(
                "[gemini] Generate New Question button clicked, calling refetchNew",
              );
              refetch_new_question();
            }}
            disabled={isRateLimited || is_new_question_loading}
            className="rounded-full bg-orange-500 px-8 py-4 font-semibold text-white hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            {isRateLimited
              ? `Generate New Question (${remainingSeconds}s)`
              : "Generate New Question"}
          </button>
          <button
            onClick={() => {
              console.log(
                "[gemini] Get Cached Question button clicked, calling refetchCached",
              );
              refetch_cached_question();
            }}
            disabled={isRateLimited || is_cache_question_loading}
            className="rounded-full bg-blue-500 px-8 py-4 font-semibold text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-600"
          >
            {isRateLimited
              ? `Get Cached Question (${remainingSeconds}s)`
              : "Get Cached Question"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden items-center justify-center bg-gray-900 px-2">
      <div className="mx-auto w-full max-w-3xl overflow-y-auto max-h-screen">
        <QuestionCard question={currentQuestion} />
        <AudioRecorder
          onSubmit={handleSubmitAnswer}
          isSubmitting={feedbackMutation.isPending}
        />
        {feedbackMutation.data && (
          <section className="mt-6 p-4 rounded-lg border border-green-500 bg-green-900/20">
            <h3 className="text-lg font-semibold text-green-400 mb-4">
              Feedback Received
            </h3>
            <div className="text-gray-300">
              <p className="font-semibold mb-2">Technical Feedback:</p>
              <ul className="list-disc list-inside text-sm space-y-1 mb-4">
                <li>
                  {feedbackMutation.data.technicalFeedback.technicalAccuracy}
                </li>
                <li>{feedbackMutation.data.technicalFeedback.completeness}</li>
                <li>
                  {
                    feedbackMutation.data.technicalFeedback
                      .bestPracticesAndCodeQuality
                  }
                </li>
              </ul>
              <p className="font-semibold mb-2">Summary:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>
                  <strong>Strengths:</strong>{" "}
                  {feedbackMutation.data.summary.strengths.join(", ")}
                </li>
                <li>
                  <strong>Areas for Improvement:</strong>{" "}
                  {feedbackMutation.data.summary.areasForImprovement.join(", ")}
                </li>
              </ul>
            </div>
          </section>
        )}
        {feedbackMutation.error && (
          <div className="mt-6 p-4 rounded-lg border border-red-500 bg-red-900/20 text-red-400">
            <p className="font-semibold">Error submitting answer:</p>
            <p className="text-sm">{feedbackMutation.error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
