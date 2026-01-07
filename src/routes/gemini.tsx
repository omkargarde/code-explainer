import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { QuestionCard } from "@/components/QuestionCard";
import { AudioRecorder } from "@/components/AudioRecorder";
import { geminiQuestionOptions } from "@/lib/query-options";

export const Route = createFileRoute("/gemini")({
  component: GeminiChat,
});

function GeminiChat() {
  const { data, isLoading, error, refetch } = useQuery(geminiQuestionOptions);

  if (isLoading) return <div>Loading...</div>;

  if (error)
    return (
      <div className="rounded-lg border border-red-500 bg-red-900/20 p-6 text-center text-red-400">
        <p className="text-lg font-semibold">{error.message}</p>
        {error.message.includes("retryAfter") &&
          (() => {
            try {
              const errorData = JSON.parse(error.message);
              if (errorData.retryAfter) {
                return (
                  <p className="mt-2 text-sm">
                    Please retry in {errorData.retryAfter} seconds
                    {errorData.quotaLimit &&
                      ` (quota: ${errorData.quotaLimit}/day)`}
                  </p>
                );
              }
            } catch {
              return null;
            }
          })()}
      </div>
    );

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
