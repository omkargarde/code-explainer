// import { ErrorComponent, createFileRoute } from "@tanstack/react-router";

// import { createServerFn, useServerFn } from "@tanstack/react-start";

// import { useMutation } from "@tanstack/react-query";
// import z from "zod";
// import Markdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import type { OpenAi } from "OpenAI";
// import type { ReactNode } from "react";
// import { LanguagesList } from "@/constants/constants";
// import { fetchAIResponse } from "@/utils/server-only-utils/AiFunctions";

// export const Route = createFileRoute("/code")({
//   component: Code,
// });

// const CallAiSchema = z.object({
//   code: z.string().min(1),
//   language: z.string().min(0),
// });
// type CallAiSchemaType = z.Infer<typeof CallAiSchema>;

// export const callAi = createServerFn({ method: "POST" })
//   .inputValidator(CallAiSchema)
//   .handler(async ({ data }) => {
//     const { code, language } = data;
//     console.log("data received is ", data);

//     const messages: Array<OpenAI.Chat.Completions.ChatCompletionMessageParam> =
//       [
//         {
//           role: "system",
//           content: `you are a expert of ${language}, tasked with teaching the users.`,
//         },
//         {
//           role: "user",
//           content: `please explain this ${language || "JavaScript"} code in simple terms:\n\n\`\`\`${language}\n${code}\`\`\`
// 				`,
//         },
//       ];

//     const response = await fetchAIResponse(messages);

//     const explanation = response.choices[0]?.message;
//     console.log("explanation generated is ", explanation);

//     // typescript is not type narrowing correctly

//     if (!explanation) {
//       const errorMessage = "Failed to generate explanation.";
//       console.log(errorMessage);
//       return {
//         error: errorMessage,
//       };
//     }

//     return {
//       explanation: explanation,
//     };
//   });

// function Code() {
//   const getExplanation = useServerFn(callAi);

//   const { mutate, isPending, isSuccess, data, isError, error } = useMutation({
//     mutationFn: (postData: CallAiSchemaType) =>
//       getExplanation({ data: postData }),
//     mutationKey: ["getExplanation"],
//   });

//   function submitForm(formData: FormData) {
//     const code = formData.get("code") as string;
//     const language = formData.get("language") as string;
//     mutate({ code, language });
//     console.log(data);
//   }

//   return (
//     <section className="flex min-h-screen flex-col items-center p-6">
//       <div className="w-full max-w-4xl rounded-2xl bg-white shadow-lg">
//         <form action={submitForm}>
//           <Label htmlFor="language">Language:</Label>
//           <select
//             name="language"
//             id="language"
//             className="mb-4 w-full rounded-lg border bg-transparent p-2"
//           >
//             {LanguagesList.map((language) => (
//               <option key={language} value={language}>
//                 {language}
//               </option>
//             ))}
//           </select>
//           <Label htmlFor="code">Your Code:</Label>
//           <textarea
//             name="code"
//             id="code"
//             className="min-h-150px w-full rounded-lg border bg-transparent p-3 font-mono text-sm"
//             placeholder="Paste your code here"
//             required
//           />
//           <button
//             type="submit"
//             // disabled={isPending}
//             className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {isPending ? "Explaining" : "Explain Code"}
//           </button>
//         </form>
//         {isPending && <p className="my-3w-64 bg-gray-300 p-2">Thinking...</p>}
//         {isSuccess && (
//           <CodeExplanation explanation={data.explanation?.content} />
//         )}
//         {isError && <ErrorComponent error={error} />}
//       </div>
//     </section>
//   );
// }

// function CodeExplanation({ explanation }: { explanation: any }) {
//   console.log("explanation ::", explanation);

//   return (
//     <>
//       <section className="mt-6 w-full max-w-4xl rounded-2xl bg-gray-50 p-6 shadow-lg">
//         <h2 className="mb-2 text-2xl font-semibold">Explanation:</h2>
//         <Markdown remarkPlugins={[remarkGfm]}>{explanation}</Markdown>
//       </section>
//     </>
//   );
// }

// function Label({
//   htmlFor,
//   children,
// }: {
//   htmlFor: string;
//   children: ReactNode;
// }) {
//   return (
//     <label htmlFor={htmlFor} className="mb-2 block font-semibold">
//       {children}
//     </label>
//   );
// }
