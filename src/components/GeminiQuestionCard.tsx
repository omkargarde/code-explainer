interface GeminiQuestionCardProps {
  response: string;
}

export function GeminiQuestionCard({ response }: GeminiQuestionCardProps) {
  return (
    <div className="min-w-0 flex-1">
      <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
        <div className="mb-3">
          <span className="inline-block rounded-full bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-300">
            AI Response
          </span>
        </div>
        <div className="rounded-md border border-gray-600 bg-gray-800/50 p-3">
          <p className="text-sm whitespace-pre-wrap text-gray-300">
            {response}
          </p>
        </div>
      </div>
    </div>
  );
}
