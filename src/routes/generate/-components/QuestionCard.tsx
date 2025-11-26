import type { IQuestion } from "../questions";

export function QuestionsCard({ question }: { question: IQuestion }) {
  return (
    <section className="card card-body bg-accent-content my-6 rounded-2xl p-6 shadow-lg">
      <header className="card-title flex flex-col items-start gap-0.5 pb-4">
        <h2 className="text-xl font-bold">{question.topic}</h2>
        <p className="text-sm text-gray-300">
          Difficulty: {question.difficulty}
        </p>
      </header>
      <div className="text-base leading-6">
        <p className="font-medium">{question.question}</p>
        <p className="pt-2 text-gray-300">{question.expected_answer_outline}</p>
      </div>
    </section>
  );
}
