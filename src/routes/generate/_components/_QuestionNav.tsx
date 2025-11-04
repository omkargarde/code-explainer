export function QuestionNav({
  currentIndex,
  handleNext,
  handlePrev,
  length,
}: {
  currentIndex: number;
  length: number;
  handleNext: () => void;
  handlePrev: () => void;
}) {
  return (
    <section className="mt-6 flex items-center justify-between">
      <button
        className="btn btn-outline"
        onClick={handlePrev}
        disabled={currentIndex === 0}
      >
        Previous
      </button>

      <span className="text-sm text-gray-500">
        {currentIndex + 1} / {length}
      </span>

      <button
        className="btn btn-primary"
        onClick={handleNext}
        disabled={currentIndex === length - 1}
      >
        Next
      </button>
    </section>
  );
}
