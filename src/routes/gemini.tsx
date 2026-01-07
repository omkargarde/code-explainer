import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { QuestionCard } from "@/components/QuestionCard";
import { AudioRecorder } from "@/components/AudioRecorder";
import { geminiQuestionOptions } from "@/lib/query-options";
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
  const { data, isLoading, error, refetch } = useQuery(geminiQuestionOptions);
  const { remainingSeconds, rateLimitInfo, isRateLimited } =
    useRateLimitCountdown(RATE_LIMIT_KEY);

  useEffect(() => {
    if (error) {
      const errorDetails = getErrorDetails(error);
      if (errorDetails?.code === 429) {
        saveRateLimitInfo(errorDetails);
      }
    }
  }, [error]);

  if (isLoading) return <div>Loading...</div>;

  if (isRateLimited && rateLimitInfo) {
    return (
      <div className="rounded-lg border border-red-500 bg-red-900/20 p-6 text-center text-red-400">
        <p className="text-lg font-semibold">{rateLimitInfo.message}</p>
        <div className="mt-4 space-y-2">
          <p className="text-sm">
            Rate limit reached. Please retry in{" "}
            <span className="font-bold text-orange-400">
              {remainingSeconds}
            </span>{" "}
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

  if (error) {
    const errorDetails = getErrorDetails(error);

    return (
      <div className="rounded-lg border border-red-500 bg-red-900/20 p-6 text-center text-red-400">
        <p className="text-lg font-semibold">
          {errorDetails?.message || error.message}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen overflow-hidden items-center justify-center bg-gray-900 px-2">
        <div className="mx-auto w-full max-w-3xl text-center">
          <button
            onClick={() => refetch()}
            className="rounded-full bg-orange-500 px-8 py-4 font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Get Question
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden items-center justify-center bg-gray-900 px-2">
      <div className="mx-auto w-full max-w-3xl overflow-y-auto max-h-screen">
        <QuestionCard question={data} />
        <AudioRecorder />
      </div>
    </div>
  );
}
