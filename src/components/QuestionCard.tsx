interface QuestionCardProps {
  question: {
    id: number;
    topic: string;
    difficulty: string;
    question: string;
    expected_answer_outline: string;
  };
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className="min-w-0 flex-1 space-y-4">
      <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
        <div className="mb-3">
          <span className="inline-block rounded-full bg-orange-500/20 px-3 py-1 text-sm font-medium text-orange-300">
            {question.difficulty}
          </span>
          <span className="ml-2 inline-block rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-300">
            {question.topic}
          </span>
        </div>
        <h3 className="mb-3 text-lg font-semibold text-white">
          {question.question}
        </h3>

        <div className="rounded-md border border-gray-600 bg-gray-800/50 p-3">
          <h4 className="mb-2 text-sm font-medium text-gray-300">
            Expected Answer Outline:
          </h4>
          <p className="text-sm whitespace-pre-wrap text-gray-400">
            {question.expected_answer_outline}
          </p>
        </div>
      </div>
    </div>
  );
}
