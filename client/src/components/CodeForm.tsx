import { useActionState, type ReactNode } from "react";
import { LanguagesList } from "../constants/constants";
import { explain } from "../actions";
import CodeExplanation from "./CodeExplanation";
import Error from "./Error";

export default function CodeForm() {
  const [formState, formAction, isPending] = useActionState(explain, null);
  return (
    <>
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-lg">
        <form action={formAction}>
          <Label htmlFor="language">Language:</Label>
          <select
            name="language"
            id="language"
            className="mb-4 w-full rounded-lg border bg-transparent p-2"
          >
            {LanguagesList.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
          <Label htmlFor="code">Your Code:</Label>
          <textarea
            name="code"
            id="code"
            className="min-h-150px w-full rounded-lg border bg-transparent p-3 font-mono text-sm"
            placeholder="Paste your code here"
            required
          />

          <button
            type="submit"
            disabled={isPending}
            className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Explaining" : "Explain Code"}
          </button>
        </form>
        {isPending ? (
          <p className="my-3w-64 bg-gray-300 p-2">Thinking...</p>
        ) : formState?.data !== null ? (
          <CodeExplanation explanation={formState?.data.explanation.content} />
        ) : (
          formState.error !== null && <Error error={formState.error} />
        )}
      </div>
    </>
  );
}

function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block font-semibold">
      {children}
    </label>
  );
}
