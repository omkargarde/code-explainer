import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function CodeExplanation({ explanation }: { explanation: any }) {
  console.log("explanation ::", explanation);

  return (
    <>
      <section className="mt-6 w-full max-w-4xl rounded-2xl bg-gray-50 p-6 shadow-lg">
        <h2 className="mb-2 text-2xl font-semibold">Explanation:</h2>
        <Markdown remarkPlugins={[remarkGfm]}>{explanation}</Markdown>
      </section>
    </>
  );
}
